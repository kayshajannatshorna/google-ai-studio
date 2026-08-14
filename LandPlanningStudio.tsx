import React, { useState, useEffect } from 'react';
import { LandInput, LandAnalysis, ProjectData, FloorOption } from '../../types';
import {
  Compass,
  Building,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  DollarSign,
  Maximize2,
  CheckCircle2,
  Bot
} from 'lucide-react';

interface LandPlanningStudioProps {
  onGenerateProject: (land: LandInput, analysis: LandAnalysis, selectedFloor: FloorOption) => void;
  className?: string;
}

export const LandPlanningStudio: React.FC<LandPlanningStudioProps> = ({
  onGenerateProject,
  className = '',
}) => {
  const [length, setLength] = useState<number>(40);
  const [width, setWidth] = useState<number>(60);
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [minRoomLength, setMinRoomLength] = useState<number>(30);
  const [minRoomWidth, setMinRoomWidth] = useState<number>(20);
  const [selectedFloor, setSelectedFloor] = useState<FloorOption>('Ground + 1');
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Compute Land Metrics instantly
  const calculateAnalysis = (): LandAnalysis => {
    const isMeter = unit === 'm';
    const lenFt = isMeter ? length * 3.28084 : length;
    const widFt = isMeter ? width * 3.28084 : width;

    const totalAreaSqFt = Math.round(lenFt * widFt);
    const totalAreaSqM = Math.round(totalAreaSqFt * 0.092903);

    const frontSetback = lenFt > 60 ? 12 : 8;
    const rearSetback = lenFt > 60 ? 10 : 6;
    const sideSetback = widFt > 40 ? 6 : 4;

    const buildableLength = Math.max(15, lenFt - (frontSetback + rearSetback));
    const buildableWidth = Math.max(15, widFt - sideSetback * 2);
    const groundFootprint = Math.round(buildableLength * buildableWidth);
    const groundCoveragePercent = Math.min(75, Math.round((groundFootprint / totalAreaSqFt) * 100));
    const openSpaceSqFt = totalAreaSqFt - groundFootprint;

    let floorsCount = 2;
    if (selectedFloor === 'Single Floor (Ground Only)') floorsCount = 1;
    else if (selectedFloor === 'Ground + 1') floorsCount = 2;
    else if (selectedFloor === 'Ground + 2') floorsCount = 3;
    else if (selectedFloor === 'Ground + 3') floorsCount = 4;

    const minRoomArea = minRoomLength * minRoomWidth; // default 600
    const totalBuildable = groundFootprint * floorsCount;
    const maxRooms = Math.max(3, Math.floor((totalBuildable * 0.85) / minRoomArea));

    const distribution: LandAnalysis['suggestedDistribution'] = [
      {
        floor: 'Ground Floor',
        rooms: [
          { category: 'living_room', name: 'Grand Living Room', count: 1, area: 600 },
          { category: 'kitchen', name: 'Gourmet Kitchen', count: 1, area: 600 },
          { category: 'dining_room', name: 'Formal Dining', count: 1, area: 600 },
          { category: 'bathroom', name: 'Guest Powder Room', count: 1, area: 600 },
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
    ];

    if (floorsCount >= 3) {
      distribution.push({
        floor: '2nd Floor',
        rooms: [
          { category: 'family_room', name: 'Entertainment Lounge', count: 1, area: 600 },
          { category: 'guest_room', name: 'Guest Bedroom', count: 1, area: 600 },
        ],
        totalFloorArea: 1200,
      });
    }

    const baseRate = 185;
    const minCost = Math.round((totalBuildable * baseRate * 0.9) / 1000) * 1000;
    const maxCost = Math.round((totalBuildable * baseRate * 1.35) / 1000) * 1000;

    return {
      totalAreaSqFt,
      totalAreaSqM,
      buildableAreaSqFt: totalBuildable,
      openSpaceSqFt,
      groundCoveragePercent,
      far: 1.6,
      setbacks: {
        front: frontSetback,
        rear: rearSetback,
        left: sideSetback,
        right: sideSetback,
      },
      suggestedFloorsCount: floorsCount,
      suggestedFloorsList: floorsCount === 1 ? ['Ground Floor'] : floorsCount === 2 ? ['Ground Floor', '1st Floor'] : ['Ground Floor', '1st Floor', '2nd Floor'],
      suggestedRoomCount: Math.min(12, Math.max(4, maxRooms)),
      suggestedDistribution: distribution,
      estimatedCostRange: {
        min: minCost,
        max: maxCost,
        currency: '$',
      },
    };
  };

  const analysis = calculateAnalysis();

  // Fetch AI Advice when land inputs settle
  const fetchAiArchitectGuidance = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/architect-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          land: { length, width, unit, configuredMinRoomLength: minRoomLength, configuredMinRoomWidth: minRoomWidth },
          goal: 'Optimal solar orientation, structural layout, and luxury living experience',
        }),
      });
      const data = await res.json();
      if (data.advice) {
        setAiAdvice(data.advice);
      }
    } catch (e) {
      console.warn('AI advice fetch error', e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiArchitectGuidance();
  }, [length, width, unit, selectedFloor]);

  const handleLaunch = () => {
    const input: LandInput = {
      length,
      width,
      unit,
      configuredMinRoomLength: minRoomLength,
      configuredMinRoomWidth: minRoomWidth,
    };
    onGenerateProject(input, analysis, selectedFloor);
  };

  return (
    <div id="land_planning_studio" className={`w-full space-y-6 ${className}`}>
      {/* Top Input Bar & Plot Geometry Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Dimension Controls & Constraints */}
        <div className="lg:col-span-5 space-y-4 p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Land Dimensions & Parameters</span>
            </h3>
            {/* Unit Switcher */}
            <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setUnit('ft')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  unit === 'ft' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                FEET (ft)
              </button>
              <button
                onClick={() => setUnit('m')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  unit === 'm' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                METERS (m)
              </button>
            </div>
          </div>

          {/* Sliders and Numerical Inputs */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Plot Length (Depth):</span>
                <span className="font-mono font-bold text-blue-400">{length} {unit}</span>
              </div>
              <input
                type="range"
                min="25"
                max="150"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-300">Plot Width (Frontage):</span>
                <span className="font-mono font-bold text-blue-400">{width} {unit}</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Quick Presets */}
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">Standard Plot Presets:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '30 × 50 ft', l: 50, w: 30 },
                  { label: '40 × 60 ft', l: 60, w: 40 },
                  { label: '50 × 80 ft', l: 80, w: 50 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setLength(preset.l);
                      setWidth(preset.w);
                      setUnit('ft');
                    }}
                    className="px-2 py-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700/60 font-mono transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Selection */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-300 block mb-2">Select Elevation / Floors:</span>
              <div className="grid grid-cols-2 gap-2">
                {(['Single Floor (Ground Only)', 'Ground + 1', 'Ground + 2', 'Ground + 3'] as FloorOption[]).map((fl) => (
                  <button
                    key={fl}
                    onClick={() => setSelectedFloor(fl)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      selectedFloor === fl
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] text-blue-400 uppercase tracking-wider">
                      {fl.includes('1') ? '2-Storey Villa' : fl.includes('2') ? '3-Storey Mansion' : fl.includes('3') ? '4-Storey Estate' : 'Bungalow'}
                    </div>
                    <div>{fl}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Room Size Standard Badge */}
            <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-500/30 flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-blue-200 block">Strict Standard Compliance:</span>
                <span className="text-slate-400 text-[11px]">
                  All room designs are calibrated to minimum {minRoomLength} × {minRoomWidth} ft ({minRoomLength * minRoomWidth} sq ft) with zero spatial compromises.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Architectural Metrics & Interactive Plot Schematic */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-md">
              <span className="text-[11px] text-slate-400 block font-medium">Total Land Area</span>
              <div className="text-lg font-bold text-white font-mono">{analysis.totalAreaSqFt.toLocaleString()} <span className="text-xs text-slate-400 font-normal">sq ft</span></div>
              <span className="text-[10px] text-slate-500 font-mono">({analysis.totalAreaSqM} m²)</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-md">
              <span className="text-[11px] text-slate-400 block font-medium">Buildable Footprint</span>
              <div className="text-lg font-bold text-emerald-400 font-mono">{analysis.buildableAreaSqFt.toLocaleString()} <span className="text-xs text-slate-400 font-normal">sq ft</span></div>
              <span className="text-[10px] text-slate-500 font-mono">({analysis.groundCoveragePercent}% ground coverage)</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-md">
              <span className="text-[11px] text-slate-400 block font-medium">Recommended Rooms</span>
              <div className="text-lg font-bold text-blue-400 font-mono">{analysis.suggestedRoomCount} <span className="text-xs text-slate-400 font-normal">Rooms</span></div>
              <span className="text-[10px] text-slate-500 font-mono">across {analysis.suggestedFloorsCount} floors</span>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-md">
              <span className="text-[11px] text-slate-400 block font-medium">Estimated Build Cost</span>
              <div className="text-lg font-bold text-amber-400 font-mono">${(analysis.estimatedCostRange.min / 1000).toFixed(0)}k–${(analysis.estimatedCostRange.max / 1000).toFixed(0)}k</div>
              <span className="text-[10px] text-slate-500 font-mono">Turnkey luxury finish</span>
            </div>
          </div>

          {/* AI Architect Advisory Panel */}
          <div className="p-5 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 rounded-2xl border border-blue-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/30 rounded-lg text-blue-400">
                  <Bot className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Principal Architect Guidance
                </h4>
              </div>
              {isLoadingAi && <span className="text-[11px] text-blue-400 animate-pulse">Analyzing plot solar & zoning...</span>}
            </div>

            {aiAdvice && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="font-semibold text-amber-300 block mb-1">☀️ Solar & Daylighting:</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{aiAdvice.solarOrientation}</p>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="font-semibold text-cyan-300 block mb-1">💨 Cross-Ventilation:</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{aiAdvice.ventilationTip}</p>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button to Launch 3D House Preview */}
          <button
            onClick={handleLaunch}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
          >
            <span>GENERATE 3D HOUSE & 2D BLUEPRINTS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
