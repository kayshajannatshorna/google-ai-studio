import React, { useRef, useState } from 'react';
import { ProjectData, FloorLevel, ConfiguredRoom } from '../../types';
import { getDesignById } from '../../data/roomDesigns';
import {
  Download,
  FileText,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Building,
  CheckCircle2
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface FullHouseBlueprint2DProps {
  project: ProjectData;
  className?: string;
}

export const FullHouseBlueprint2D: React.FC<FullHouseBlueprint2DProps> = ({ project, className = '' }) => {
  const [activeFloorTab, setActiveFloorTab] = useState<FloorLevel | 'site_plan'>('Ground Floor');
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  const land = project.land;
  const analysis = project.analysis;

  // Filter rooms for current floor
  const floorRooms = project.rooms.filter((r) => r.floor === activeFloorTab);

  // SVG dimensions
  const SCALE = 12; // 1 ft = 12 SVG units
  const pad = 60;
  const plotWidthSvg = land.width * SCALE + pad * 2;
  const plotLengthSvg = land.length * SCALE + pad * 2;

  const exportFullPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a3',
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text('SMART LAND-TO-HOME — COMPLETE ARCHITECTURAL MASTER PLAN', 40, 50);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Project: ${project.name} | Plot Dimensions: ${land.length} × ${land.width} ft (${analysis.totalAreaSqFt} sq ft)`, 40, 75);
    doc.text(`Ground Coverage: ${analysis.groundCoveragePercent}% | Buildable Area: ${analysis.buildableAreaSqFt} sq ft | Floors: ${project.floorsCount}`, 40, 95);
    doc.text(`Setbacks: Front ${analysis.setbacks.front}ft, Rear ${analysis.setbacks.rear}ft, Sides ${analysis.setbacks.left}ft`, 40, 115);

    doc.line(40, 130, 800, 130);

    // Room Schedule
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('COMPREHENSIVE ROOM SCHEDULE & SPECIFICATION', 40, 160);

    let currY = 190;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ROOM NAME', 40, currY);
    doc.text('FLOOR LEVEL', 220, currY);
    doc.text('DIMENSIONS (FT)', 360, currY);
    doc.text('AREA (SQ FT)', 480, currY);
    doc.text('DESIGN PRESET / STYLE', 600, currY);

    currY += 15;
    doc.line(40, currY, 800, currY);
    currY += 20;

    doc.setFont('helvetica', 'normal');
    project.rooms.forEach((rm, idx) => {
      const design = getDesignById(rm.designId);
      doc.text(`${idx + 1}. ${rm.name}`, 40, currY);
      doc.text(rm.floor, 220, currY);
      doc.text(`${rm.length} × ${rm.width} ft`, 360, currY);
      doc.text(`${rm.area} sq ft`, 480, currY);
      doc.text(design ? design.style : 'Custom Layout', 600, currY);
      currY += 22;
    });

    currY += 20;
    doc.line(40, currY, 800, currY);
    currY += 25;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Estimated Construction Cost Range: ${analysis.estimatedCostRange.currency}${analysis.estimatedCostRange.min.toLocaleString()} – ${analysis.estimatedCostRange.currency}${analysis.estimatedCostRange.max.toLocaleString()}`, 40, currY);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated via Smart Land-To-Home AI. Scale concept for preliminary spatial approval.', 40, 560);

    doc.save(`${project.name.replace(/\s+/g, '_')}_Master_Blueprint.pdf`);
  };

  return (
    <div className={`flex flex-col w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl ${className}`}>
      {/* Top Header & Tab Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950/90 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{project.name}</span>
              <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full font-mono font-normal">
                {land.length}′ × {land.width}′ Plot
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Total: {analysis.totalAreaSqFt.toLocaleString()} sq ft • Buildable: {analysis.buildableAreaSqFt.toLocaleString()} sq ft • {project.rooms.length} Configured Rooms
            </p>
          </div>
        </div>

        {/* Floor Switcher Tabs & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
            {(['Ground Floor', '1st Floor', '2nd Floor'] as const).map((fl) => (
              <button
                key={fl}
                onClick={() => setActiveFloorTab(fl)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeFloorTab === fl ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {fl.toUpperCase()}
              </button>
            ))}
            <button
              onClick={() => setActiveFloorTab('site_plan')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeFloorTab === 'site_plan' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              SITE PLAN
            </button>
          </div>

          <button
            onClick={exportFullPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT MASTER PDF</span>
          </button>
        </div>
      </div>

      {/* Blueprint Canvas Sheet */}
      <div className="flex-1 w-full h-full min-h-[500px] overflow-auto flex items-center justify-center p-8 bg-slate-950/70">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
          <svg
            ref={svgRef}
            width={plotWidthSvg}
            height={plotLengthSvg}
            viewBox={`0 0 ${plotWidthSvg} ${plotLengthSvg}`}
            className="bg-slate-900 rounded-xl border border-slate-700 shadow-2xl"
          >
            {/* North Compass Arrow */}
            <g transform={`translate(${plotWidthSvg - 70}, 60)`} className="text-slate-400 select-none">
              <circle cx="0" cy="0" r="22" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
              <polygon points="0,-18 5,0 0,-4 -5,0" fill="#EF4444" />
              <polygon points="0,18 5,0 0,4 -5,0" fill="#94A3B8" />
              <text x="0" y="-22" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">
                N
              </text>
            </g>

            {/* Plot Boundary Wall */}
            <rect
              x={pad}
              y={pad}
              width={land.width * SCALE}
              height={land.length * SCALE}
              fill="none"
              stroke="#64748B"
              strokeWidth="3"
              strokeDasharray="6 3"
            />
            <text x={pad + 10} y={pad + 18} fill="#94A3B8" fontSize="10" fontFamily="monospace">
              PLOT BOUNDARY ({land.width}′ × {land.length}′ = {analysis.totalAreaSqFt} SQ FT)
            </text>

            {/* Setback Dashed Line Box */}
            <rect
              x={pad + analysis.setbacks.left * SCALE}
              y={pad + analysis.setbacks.front * SCALE}
              width={(land.width - analysis.setbacks.left - analysis.setbacks.right) * SCALE}
              height={(land.length - analysis.setbacks.front - analysis.setbacks.rear) * SCALE}
              fill="rgba(59, 130, 246, 0.04)"
              stroke="#3B82F6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Render Configured Rooms for Active Floor */}
            {activeFloorTab !== 'site_plan' &&
              floorRooms.map((rm, idx) => {
                const roomX = pad + analysis.setbacks.left * SCALE + (idx % 2 === 0 ? 0 : 30 * SCALE * 0.7);
                const roomY = pad + analysis.setbacks.front * SCALE + Math.floor(idx / 2) * (20 * SCALE * 0.75);
                const rw = rm.length * SCALE * 0.65;
                const rh = rm.width * SCALE * 0.7;

                return (
                  <g key={rm.id} className="transition-all hover:opacity-90">
                    <rect
                      x={roomX}
                      y={roomY}
                      width={rw}
                      height={rh}
                      fill="#1E293B"
                      stroke="#475569"
                      strokeWidth="2"
                      rx="3"
                    />
                    {/* Diagonal Room Identifier */}
                    <text
                      x={roomX + rw / 2}
                      y={roomY + rh / 2 - 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {rm.name}
                    </text>
                    <text
                      x={roomX + rw / 2}
                      y={roomY + rh / 2 + 12}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {rm.length}′ × {rm.width}′ ({rm.area} sq ft)
                    </text>
                  </g>
                );
              })}

            {/* Title Block in Lower Right */}
            <g transform={`translate(${plotWidthSvg - 260}, ${plotLengthSvg - 90})`}>
              <rect width="230" height="70" fill="#0F172A" stroke="#334155" strokeWidth="1.5" rx="4" />
              <text x="12" y="20" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                SMART LAND-TO-HOME
              </text>
              <text x="12" y="36" fill="#94A3B8" fontSize="9">
                FLOOR: {activeFloorTab.toUpperCase()}
              </text>
              <text x="12" y="52" fill="#64748B" fontSize="8" fontFamily="monospace">
                DATE: {new Date().toLocaleDateString()} • CONCEPT
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
