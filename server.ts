import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { allRoomDesigns, getDesignById } from './src/data/roomDesigns';
import { LandInput, LandAnalysis, ConfiguredRoom, ProjectData, RoomCategory, FloorLevel } from './src/types';

// In-memory project store for prototype persistence
const projectsDatabase: Map<string, ProjectData> = new Map();

// Helper to perform architectural land calculation
function calculateLandMetrics(input: LandInput): LandAnalysis {
  const isMeter = input.unit === 'm';
  const lenFt = isMeter ? input.length * 3.28084 : input.length;
  const widFt = isMeter ? input.width * 3.28084 : input.width;

  const totalAreaSqFt = Math.round(lenFt * widFt);
  const totalAreaSqM = Math.round(totalAreaSqFt * 0.092903);

  // Standard architectural setbacks based on plot size
  const frontSetback = lenFt > 60 ? 12 : 8;
  const rearSetback = lenFt > 60 ? 10 : 6;
  const sideSetback = widFt > 40 ? 6 : 4;

  const buildableLength = Math.max(15, lenFt - (frontSetback + rearSetback));
  const buildableWidth = Math.max(15, widFt - (sideSetback * 2));
  const groundFootprint = Math.round(buildableLength * buildableWidth);
  const groundCoveragePercent = Math.min(75, Math.round((groundFootprint / totalAreaSqFt) * 100));
  const openSpaceSqFt = totalAreaSqFt - groundFootprint;

  // Floor recommendation based on land size
  let suggestedFloorsCount = 2;
  let suggestedFloorsList: FloorLevel[] = ['Ground Floor', '1st Floor'];
  let far = 1.5;

  if (totalAreaSqFt < 1800) {
    suggestedFloorsCount = 3;
    suggestedFloorsList = ['Ground Floor', '1st Floor', '2nd Floor'];
    far = 2.0;
  } else if (totalAreaSqFt >= 1800 && totalAreaSqFt <= 3500) {
    suggestedFloorsCount = 2;
    suggestedFloorsList = ['Ground Floor', '1st Floor'];
    far = 1.6;
  } else {
    suggestedFloorsCount = 2;
    suggestedFloorsList = ['Ground Floor', '1st Floor'];
    far = 1.4;
  }

  // Room recommendation
  const minRoomArea = (input.configuredMinRoomLength || 30) * (input.configuredMinRoomWidth || 20); // default 600
  const approximateTotalBuildable = groundFootprint * suggestedFloorsCount;
  const maxPossibleRooms = Math.max(3, Math.floor((approximateTotalBuildable * 0.85) / minRoomArea));
  const suggestedRoomCount = Math.min(10, Math.max(4, maxPossibleRooms));

  const suggestedDistribution: LandAnalysis['suggestedDistribution'] = [
    {
      floor: 'Ground Floor',
      rooms: [
        { category: 'living_room', name: 'Grand Living Room', count: 1, area: 600 },
        { category: 'kitchen', name: 'Gourmet Kitchen', count: 1, area: 600 },
        { category: 'dining_room', name: 'Dining Room', count: 1, area: 600 },
        { category: 'bathroom', name: 'Powder / Guest Bath', count: 1, area: 600 },
      ],
      totalFloorArea: 2400,
    },
    {
      floor: '1st Floor',
      rooms: [
        { category: 'master_bedroom', name: 'Master Suite', count: 1, area: 600 },
        { category: 'bedroom', name: 'Bedroom 02', count: 1, area: 600 },
        { category: 'study_room', name: 'Executive Study', count: 1, area: 600 },
        { category: 'bathroom', name: 'Master En-Suite Bath', count: 1, area: 600 },
      ],
      totalFloorArea: 2400,
    },
  ];

  if (suggestedFloorsCount >= 3) {
    suggestedDistribution.push({
      floor: '2nd Floor',
      rooms: [
        { category: 'family_room', name: 'Entertainment Lounge', count: 1, area: 600 },
        { category: 'guest_room', name: 'Guest Suite', count: 1, area: 600 },
      ],
      totalFloorArea: 1200,
    });
  }

  const baseRatePerSqFt = 180; // $ or local currency per sq ft
  const estimatedMinCost = Math.round((approximateTotalBuildable * baseRatePerSqFt * 0.9) / 1000) * 1000;
  const estimatedMaxCost = Math.round((approximateTotalBuildable * baseRatePerSqFt * 1.35) / 1000) * 1000;

  return {
    totalAreaSqFt,
    totalAreaSqM,
    buildableAreaSqFt: approximateTotalBuildable,
    openSpaceSqFt,
    groundCoveragePercent,
    far,
    setbacks: {
      front: frontSetback,
      rear: rearSetback,
      left: sideSetback,
      right: sideSetback,
    },
    suggestedFloorsCount,
    suggestedFloorsList,
    suggestedRoomCount,
    suggestedDistribution,
    estimatedCostRange: {
      min: estimatedMinCost,
      max: estimatedMaxCost,
      currency: '$',
    },
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API 1: Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API 2: Land Analysis
  app.post('/api/land/analyze', (req, res) => {
    try {
      const input: LandInput = req.body;
      if (!input || !input.length || !input.width) {
        return res.status(400).json({ error: 'Valid length and width are required' });
      }
      const analysis = calculateLandMetrics(input);
      res.json({ success: true, input, analysis });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to analyze land' });
    }
  });

  // API 3: Room calculation
  app.post('/api/rooms/calculate', (req, res) => {
    try {
      const { land, floorsCount, customMinRoomSize } = req.body;
      const analysis = calculateLandMetrics(land || { length: 40, width: 60, unit: 'ft', configuredMinRoomLength: 30, configuredMinRoomWidth: 20 });
      res.json({
        success: true,
        distribution: analysis.suggestedDistribution,
        minRoomSize: customMinRoomSize || { length: 30, width: 20, area: 600 },
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API 4: Get Designs by Category or All
  app.get('/api/designs/:category', (req, res) => {
    const category = req.params.category as RoomCategory;
    const designs = allRoomDesigns[category];
    if (!designs) {
      return res.status(404).json({ error: `Category ${category} not found` });
    }
    res.json({ category, count: designs.length, designs });
  });

  app.get('/api/designs', (req, res) => {
    res.json({
      success: true,
      allDesigns: allRoomDesigns,
      totalCount: Object.values(allRoomDesigns).flat().length,
    });
  });

  // API 5: Project Management (Create, Save, List, Get, Delete)
  app.post('/api/project/create', (req, res) => {
    try {
      const { land, name } = req.body;
      const id = 'proj_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
      const analysis = calculateLandMetrics(land || { length: 40, width: 60, unit: 'ft', configuredMinRoomLength: 30, configuredMinRoomWidth: 20 });

      // Build default configured rooms
      const defaultRooms: ConfiguredRoom[] = [
        {
          id: 'room_gf_lr',
          name: 'Main Living Lounge',
          category: 'living_room',
          floor: 'Ground Floor',
          length: 30,
          width: 20,
          area: 600,
          designId: 'lr_01',
          positionX: 0,
          positionY: 0,
        },
        {
          id: 'room_gf_kit',
          name: 'Gourmet Kitchen',
          category: 'kitchen',
          floor: 'Ground Floor',
          length: 30,
          width: 20,
          area: 600,
          designId: 'kitchen_01',
          positionX: 30,
          positionY: 0,
        },
        {
          id: 'room_gf_din',
          name: 'Formal Dining',
          category: 'dining_room',
          floor: 'Ground Floor',
          length: 30,
          width: 20,
          area: 600,
          designId: 'dining_room_01',
          positionX: 0,
          positionY: 20,
        },
        {
          id: 'room_gf_bath',
          name: 'Powder Room',
          category: 'bathroom',
          floor: 'Ground Floor',
          length: 30,
          width: 20,
          area: 600,
          designId: 'bathroom_01',
          positionX: 30,
          positionY: 20,
        },
        {
          id: 'room_1f_mbr',
          name: 'Master Suite',
          category: 'master_bedroom',
          floor: '1st Floor',
          length: 30,
          width: 20,
          area: 600,
          designId: 'master_bedroom_01',
          positionX: 0,
          positionY: 0,
        },
        {
          id: 'room_1f_br2',
          name: 'Bedroom 02',
          category: 'bedroom',
          floor: '1st Floor',
          length: 30,
          width: 20,
          area: 600,
          designId: 'bedroom_01',
          positionX: 30,
          positionY: 0,
        },
        {
          id: 'room_1f_study',
          name: 'Executive Study',
          category: 'study_room',
          floor: '1st Floor',
          length: 30,
          width: 20,
          area: 600,
          designId: 'study_room_01',
          positionX: 0,
          positionY: 20,
        },
        {
          id: 'room_1f_mbath',
          name: 'Master En-Suite',
          category: 'bathroom',
          floor: '1st Floor',
          length: 30,
          width: 20,
          area: 600,
          designId: 'bathroom_02',
          positionX: 30,
          positionY: 20,
        },
      ];

      const newProject: ProjectData = {
        id,
        name: name || `Residence on ${land?.length || 40}×${land?.width || 60}ft Plot`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        land: land || { length: 40, width: 60, unit: 'ft', configuredMinRoomLength: 30, configuredMinRoomWidth: 20 },
        analysis,
        selectedFloorOption: 'Ground + 1',
        floorsCount: 2,
        rooms: defaultRooms,
        exterior: {
          wallColor: '#F4F4F6',
          wallTexture: 'smooth',
          roofStyle: 'modern_flat',
          roofColor: '#2B2D42',
          windowTint: 'clear',
          balconyGlass: true,
          gateStyle: 'modern_slat',
          nightLighting: false,
          hasPool: true,
          hasGarden: true,
          hasCar: true,
          louverAccents: true,
        },
        status: 'configured',
      };

      projectsDatabase.set(id, newProject);
      res.json({ success: true, project: newProject });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/project/save', (req, res) => {
    try {
      const project: ProjectData = req.body;
      if (!project || !project.id) {
        return res.status(400).json({ error: 'Project ID is required' });
      }
      project.updatedAt = new Date().toISOString();
      projectsDatabase.set(project.id, project);
      res.json({ success: true, message: 'Project saved successfully', project });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/project/:id', (req, res) => {
    const project = projectsDatabase.get(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, project });
  });

  app.get('/api/projects', (req, res) => {
    const list = Array.from(projectsDatabase.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    res.json({ success: true, count: list.length, projects: list });
  });

  app.delete('/api/project/:id', (req, res) => {
    const deleted = projectsDatabase.delete(req.params.id);
    res.json({ success: deleted });
  });

  // API 6: Customize room design
  app.post('/api/design/customize', (req, res) => {
    try {
      const { designId, customChanges } = req.body;
      const baseDesign = getDesignById(designId);
      if (!baseDesign) {
        return res.status(404).json({ error: 'Design not found' });
      }
      const updated = {
        ...baseDesign,
        ...customChanges,
        id: customChanges.id || `custom_${designId}_${Date.now()}`,
      };
      res.json({ success: true, design: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // API 7: Generate Floorplan & House layout
  app.post('/api/floorplan/generate', (req, res) => {
    const { land, rooms } = req.body;
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      blueprintSchema: {
        land,
        roomsCount: rooms?.length || 0,
        gridDimensions: { x: 60, y: 40 },
      },
    });
  });

  app.post('/api/house/generate', (req, res) => {
    const { project } = req.body;
    res.json({
      success: true,
      house3DData: {
        dimensions: {
          length: project?.land?.length || 40,
          width: project?.land?.width || 60,
          floors: project?.floorsCount || 2,
        },
        exterior: project?.exterior,
      },
    });
  });

  // API 8: AI Architectural Advice (Gemini API)
  app.post('/api/ai/architect-advice', async (req, res) => {
    try {
      const { land, rooms, goal } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          success: true,
          source: 'local_architect_engine',
          advice: {
            title: `Architectural Layout Guidance for ${land?.length || 40}×${land?.width || 60} ft Plot`,
            solarOrientation: 'Position main living spaces facing South/South-East to optimize passive daylighting while reducing thermal cooling load.',
            zoningStrategy: 'Maintain a clear vertical separation: public entertaining zones on the Ground Floor and private bedrooms on the 1st Floor.',
            ventilationTip: 'Cross-ventilation is best achieved by aligning large North-facing casement windows with South-facing terrace sliders.',
            setbackNote: `Your plot provides ~${Math.round((land?.length || 40) * (land?.width || 60) * 0.3)} sq ft of open landscape space, ideal for perimeter green buffers and two dedicated carports.`,
          },
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are a licensed principal residential architect. Provide professional architectural planning analysis for a house on a ${land?.length} x ${land?.width} ${land?.unit} plot.
Configured Rooms: ${JSON.stringify(rooms?.map((r: any) => ({ name: r.name, category: r.category, floor: r.floor, area: r.area })) || [])}.
User Goal: ${goal || 'Optimal space planning, solar orientation, and structural efficiency'}.

Respond in JSON format matching this schema:
{
  "title": "Short title",
  "solarOrientation": "Solar and daylighting advice",
  "zoningStrategy": "Public vs private circulation tips",
  "ventilationTip": "Cross-ventilation and comfort tips",
  "setbackNote": "Landscape and exterior optimization"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, source: 'gemini-3.7-flash', advice: parsed });
    } catch (err: any) {
      res.json({
        success: true,
        source: 'fallback',
        advice: {
          title: 'Architectural Analysis Overview',
          solarOrientation: 'Maximize morning sunlight in bedrooms and diffuse North light in the study and living areas.',
          zoningStrategy: 'Group wet zones (kitchen, laundry, bathrooms) vertically along a single plumbing stack for efficiency.',
          ventilationTip: 'Utilize operable clerestory windows near the central staircase for stack-effect passive cooling.',
          setbackNote: 'Preserve adequate front driveway clearance to ensure safe vehicular ingress and egress.',
        },
      });
    }
  });

  // Vite middleware for dev or static serving in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Land-To-Home server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
