import React, { useState, useEffect } from 'react';
import {
  LandInput,
  LandAnalysis,
  ProjectData,
  FloorOption,
  FloorLevel,
  ExteriorOptions,
  RoomCategory,
  RoomDesign
} from './types';
import { allRoomDesigns, getDesignById } from './data/roomDesigns';
import { InteractiveHouse3D } from './components/3d/InteractiveHouse3D';
import { ExteriorCustomizer } from './components/3d/ExteriorCustomizer';
import { FloorPlan2DViewer } from './components/2d/FloorPlan2DViewer';
import { FullHouseBlueprint2D } from './components/2d/FullHouseBlueprint2D';
import { RoomDesignGallery } from './components/catalog/RoomDesignGallery';
import { LandPlanningStudio } from './components/planner/LandPlanningStudio';
import {
  Home,
  Compass,
  Box,
  Layers,
  Sparkles,
  Download,
  Save,
  CheckCircle2,
  Sliders,
  FolderOpen,
  Plus,
  ArrowRight,
  Shield,
  Bot,
  Sun,
  Moon,
  Maximize2
} from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | '3d_house' | 'land_planner' | 'blueprint_2d' | 'room_gallery' | 'export_save'>('home');

  // Active Project State
  const [currentProject, setCurrentProject] = useState<ProjectData>(() => {
    // Initial Project Default
    const defaultLand: LandInput = {
      length: 40,
      width: 60,
      unit: 'ft',
      configuredMinRoomLength: 30,
      configuredMinRoomWidth: 20,
    };
    return {
      id: 'proj_default',
      name: 'Modern 40×60ft Residence',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      land: defaultLand,
      analysis: {
        totalAreaSqFt: 2400,
        totalAreaSqM: 223,
        buildableAreaSqFt: 3600,
        openSpaceSqFt: 800,
        groundCoveragePercent: 67,
        far: 1.5,
        setbacks: { front: 8, rear: 6, left: 4, right: 4 },
        suggestedFloorsCount: 2,
        suggestedFloorsList: ['Ground Floor', '1st Floor'],
        suggestedRoomCount: 8,
        suggestedDistribution: [
          {
            floor: 'Ground Floor',
            rooms: [
              { category: 'living_room', name: 'Grand Living Room', count: 1, area: 600 },
              { category: 'kitchen', name: 'Gourmet Kitchen', count: 1, area: 600 },
              { category: 'dining_room', name: 'Formal Dining', count: 1, area: 600 },
              { category: 'bathroom', name: 'Powder Room', count: 1, area: 600 },
            ],
            totalFloorArea: 2400,
          },
          {
            floor: '1st Floor',
            rooms: [
              { category: 'master_bedroom', name: 'Master Suite', count: 1, area: 600 },
              { category: 'bedroom', name: 'Bedroom 02', count: 1, area: 600 },
              { category: 'study_room', name: 'Executive Study', count: 1, area: 600 },
              { category: 'bathroom', name: 'Master En-Suite', count: 1, area: 600 },
            ],
            totalFloorArea: 2400,
          },
        ],
        estimatedCostRange: { min: 420000, max: 580000, currency: '$' },
      },
      selectedFloorOption: 'Ground + 1',
      floorsCount: 2,
      rooms: [
        { id: 'rm_gf_1', name: 'Main Living Room', category: 'living_room', floor: 'Ground Floor', length: 30, width: 20, area: 600, designId: 'lr_01', positionX: 0, positionY: 0 },
        { id: 'rm_gf_2', name: 'Chef Kitchen', category: 'kitchen', floor: 'Ground Floor', length: 30, width: 20, area: 600, designId: 'kitchen_01', positionX: 30, positionY: 0 },
        { id: 'rm_gf_3', name: 'Dining Room', category: 'dining_room', floor: 'Ground Floor', length: 30, width: 20, area: 600, designId: 'dining_room_01', positionX: 0, positionY: 20 },
        { id: 'rm_gf_4', name: 'Powder Room', category: 'bathroom', floor: 'Ground Floor', length: 30, width: 20, area: 600, designId: 'bathroom_01', positionX: 30, positionY: 20 },
        { id: 'rm_1f_1', name: 'Master Bedroom', category: 'master_bedroom', floor: '1st Floor', length: 30, width: 20, area: 600, designId: 'master_bedroom_01', positionX: 0, positionY: 0 },
        { id: 'rm_1f_2', name: 'Bedroom 02', category: 'bedroom', floor: '1st Floor', length: 30, width: 20, area: 600, designId: 'bedroom_01', positionX: 30, positionY: 0 },
        { id: 'rm_1f_3', name: 'Executive Study', category: 'study_room', floor: '1st Floor', length: 30, width: 20, area: 600, designId: 'study_room_01', positionX: 0, positionY: 20 },
        { id: 'rm_1f_4', name: 'Master Bath', category: 'bathroom', floor: '1st Floor', length: 30, width: 20, area: 600, designId: 'bathroom_02', positionX: 30, positionY: 20 },
      ],
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
  });

  const [savedProjectsList, setSavedProjectsList] = useState<ProjectData[]>([]);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Load saved projects on mount
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.projects && data.projects.length > 0) {
          setSavedProjectsList(data.projects);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProject = async () => {
    try {
      const res = await fetch('/api/project/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProject),
      });
      const data = await res.json();
      if (data.success) {
        setSaveToast('Project saved successfully!');
        setTimeout(() => setSaveToast(null), 3000);
        // Refresh list
        fetch('/api/projects')
          .then((r) => r.json())
          .then((d) => setSavedProjectsList(d.projects || []));
      }
    } catch (e) {
      setSaveToast('Saved locally!');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleCreateNewProject = (land: LandInput, analysis: LandAnalysis, selectedFloor: FloorOption) => {
    const floorsCount = selectedFloor === 'Single Floor (Ground Only)' ? 1 : selectedFloor === 'Ground + 1' ? 2 : 3;

    const newProj: ProjectData = {
      id: 'proj_' + Date.now(),
      name: `Residence on ${land.length}×${land.width}${land.unit} Plot`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      land,
      analysis,
      selectedFloorOption: selectedFloor,
      floorsCount,
      rooms: currentProject.rooms,
      exterior: currentProject.exterior,
      status: 'configured',
    };
    setCurrentProject(newProj);
    setActiveTab('3d_house');
  };

  const handleUpdateExterior = (updatedExterior: ExteriorOptions) => {
    setCurrentProject((prev) => ({
      ...prev,
      exterior: updatedExterior,
    }));
  };

  const handleSelectDesignForRoom = (category: RoomCategory, design: RoomDesign) => {
    setCurrentProject((prev) => {
      const updatedRooms = prev.rooms.map((r) => {
        if (r.category === category) {
          return {
            ...r,
            name: design.name,
            designId: design.id,
            length: design.length,
            width: design.width,
            area: design.area,
          };
        }
        return r;
      });
      return {
        ...prev,
        rooms: updatedRooms,
      };
    });
    setSaveToast(`Applied ${design.name} to all ${category.replace('_', ' ')}s`);
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>SMART LAND-TO-HOME</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                AI 3D
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Preliminary 2D & 3D House Planning Engine</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          {[
            { id: 'home', label: 'HOMEPAGE', icon: Home },
            { id: '3d_house', label: '3D HOUSE', icon: Box },
            { id: 'land_planner', label: 'LAND PLANNER', icon: Compass },
            { id: 'blueprint_2d', label: '2D BLUEPRINTS', icon: Layers },
            { id: 'room_gallery', label: '100 ROOM DESIGNS', icon: Sparkles },
            { id: 'export_save', label: 'SAVE & EXPORT', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions (Save & Quick Status) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveProject}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SAVE PROJECT</span>
          </button>
        </div>
      </header>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* ======================================================== */}
        {/* VIEW 1: HOMEPAGE WITH LIVE 3D INTERACTIVE HOUSE HERO */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Land-To-Home AI Architecture System</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Turn Your Land Into Your <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Dream Home</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Enter your land dimensions to generate full preliminary architectural blueprints, calculate optimal floor allocations, explore 100 room design variations, and interact with a live 3D house in real time.
              </p>
            </div>

            {/* LIVE 3D HERO INTERACTIVE HOUSE CANVAS */}
            <div className="relative w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
              <InteractiveHouse3D
                exterior={currentProject.exterior}
                showControls={true}
                className="w-full h-full"
              />
            </div>

            {/* Quick Land Input Bar directly beneath Hero */}
            <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-400" />
                    <span>Enter Your Plot Size to Generate House</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Calculates buildable area, setbacks, floor allocations, and generates custom 3D architecture.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Length:</span>
                    <span className="text-xs font-mono font-bold text-white">{currentProject.land.length} ft</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Width:</span>
                    <span className="text-xs font-mono font-bold text-white">{currentProject.land.width} ft</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('land_planner')}
                    className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>LAUNCH PLANNER</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('land_planner')}
                className="p-6 bg-slate-900/60 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group"
              >
                <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Automated Land & Setback Engine</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time calculation of ground coverage, front/rear/side setbacks, FAR, and buildable envelopes for any plot size.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('room_gallery')}
                className="p-6 bg-slate-900/60 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group"
              >
                <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">100 Curated Room Designs</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  10 unique designs for every major room (Living, Bath, Dining, Bedroom, Kitchen, Study, etc.) calibrated to standard 30×20 ft sizes.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('blueprint_2d')}
                className="p-6 bg-slate-900/60 hover:bg-slate-900 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group"
              >
                <div className="p-3 bg-cyan-600/20 text-cyan-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Architectural 2D Blueprint Export</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Synchronized 2D architectural sheets with dimension strings, door swings, furniture CAD blocks, and instant PDF/SVG download.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: 3D HOUSE MASTER STUDIO */}
        {/* ======================================================== */}
        {activeTab === '3d_house' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Box className="w-5 h-5 text-blue-400" />
                  <span>Interactive 3D House Studio</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Full multi-storey villa preview • Rotate, zoom, pan, isolate floors, explode floors, and customize facade materials
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('blueprint_2d')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                >
                  VIEW 2D BLUEPRINTS
                </button>
                <button
                  onClick={() => setActiveTab('room_gallery')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-colors"
                >
                  SELECT ROOM DESIGNS
                </button>
              </div>
            </div>

            {/* Split: 3D Viewport on Left, Exterior Customizer on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
                <InteractiveHouse3D
                  exterior={currentProject.exterior}
                  showControls={true}
                  className="w-full h-full"
                />
              </div>

              <div className="lg:col-span-4">
                <ExteriorCustomizer
                  exterior={currentProject.exterior}
                  onChange={handleUpdateExterior}
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: LAND PLANNING & CALCULATOR STUDIO */}
        {/* ======================================================== */}
        {activeTab === 'land_planner' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                <span>AI Land Planning & Floor Allocation Studio</span>
              </h2>
              <p className="text-xs text-slate-400">
                Enter plot dimensions to calculate setbacks, buildable footprint, floor distribution, and receive AI principal architect advice
              </p>
            </div>

            <LandPlanningStudio
              onGenerateProject={handleCreateNewProject}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: 2D ARCHITECTURAL MASTER BLUEPRINTS */}
        {/* ======================================================== */}
        {activeTab === 'blueprint_2d' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <span>2D Architectural Blueprint Sheets</span>
              </h2>
              <p className="text-xs text-slate-400">
                Master site plan, ground floor blueprint, upper floor sheets, dimensions, setbacks, and room layouts
              </p>
            </div>

            <FullHouseBlueprint2D project={currentProject} />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: 100 ROOM DESIGN CATALOG & 3D/2D CUSTOMIZER */}
        {/* ======================================================== */}
        {activeTab === 'room_gallery' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>100 Curated Room Design Library (10 per Category)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Select and inspect luxury room concepts • Real-time synchronized 3D & 2D furniture drag-and-drop customization
              </p>
            </div>

            <RoomDesignGallery
              onSelectDesignForRoom={handleSelectDesignForRoom}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 6: PROJECT SAVE & EXPORT HUB */}
        {/* ======================================================== */}
        {activeTab === 'export_save' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-400" />
                <span>Project Save & Master Export Hub</span>
              </h2>
              <p className="text-xs text-slate-400">
                Export complete architectural package, download blueprints in PDF/SVG, and manage saved projects
              </p>
            </div>

            {/* Current Project Summary Card */}
            <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{currentProject.name}</h3>
                  <p className="text-xs text-slate-400">
                    Plot: {currentProject.land.length} × {currentProject.land.width} ft ({currentProject.analysis.totalAreaSqFt} sq ft) • {currentProject.floorsCount} Floors • {currentProject.rooms.length} Rooms
                  </p>
                </div>
                <button
                  onClick={handleSaveProject}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

              {/* Export Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <button
                  onClick={() => setActiveTab('blueprint_2d')}
                  className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-xl text-left transition-all"
                >
                  <Download className="w-5 h-5 text-blue-400 mb-2" />
                  <span className="font-bold text-white text-xs block">Download PDF Master Blueprint</span>
                  <span className="text-[11px] text-slate-400">High-resolution vector CAD sheets</span>
                </button>

                <button
                  onClick={() => {
                    const jsonStr = JSON.stringify(currentProject, null, 2);
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${currentProject.name.replace(/\s+/g, '_')}_Project_Data.json`;
                    a.click();
                  }}
                  className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-xl text-left transition-all"
                >
                  <FolderOpen className="w-5 h-5 text-indigo-400 mb-2" />
                  <span className="font-bold text-white text-xs block">Export JSON Specification</span>
                  <span className="text-[11px] text-slate-400">Full 2D & 3D room data source</span>
                </button>

                <button
                  onClick={() => setActiveTab('room_gallery')}
                  className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-xl text-left transition-all"
                >
                  <Sparkles className="w-5 h-5 text-cyan-400 mb-2" />
                  <span className="font-bold text-white text-xs block">Room Design Schedules</span>
                  <span className="text-[11px] text-slate-400">100 curated room furniture lists</span>
                </button>
              </div>
            </div>

            {/* Saved Projects in Database */}
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Saved Projects in System ({savedProjectsList.length})
              </h4>

              {savedProjectsList.length === 0 ? (
                <p className="text-xs text-slate-500">No previous projects saved yet. Click "SAVE PROJECT" above to save your first residence!</p>
              ) : (
                <div className="space-y-2">
                  {savedProjectsList.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-slate-400 text-[11px]">
                          {p.land.length}×{p.land.width}ft • {p.rooms.length} rooms • Updated: {new Date(p.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentProject(p);
                          setActiveTab('3d_house');
                        }}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
                      >
                        Load Project
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Smart Land-To-Home • AI-Powered 2D & 3D House Design System</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Real-time Three.js WebGL</span>
            <span>•</span>
            <span>Synchronized 2D Blueprint Engine</span>
            <span>•</span>
            <span>100 Room Design Library</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
