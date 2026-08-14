import React, { useRef, useState } from 'react';
import { RoomDesign, FurnitureObject } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  FileText,
  Image as ImageIcon,
  Grid,
  Tag,
  Move,
  RotateCw,
  Trash2,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface FloorPlan2DViewerProps {
  roomDesign: RoomDesign;
  onUpdateDesign?: (updated: RoomDesign) => void;
  selectedObjectId?: string | null;
  onSelectObject?: (objId: string | null) => void;
  className?: string;
  isInteractive?: boolean;
}

export const FloorPlan2DViewer: React.FC<FloorPlan2DViewerProps> = ({
  roomDesign,
  onUpdateDesign,
  selectedObjectId = null,
  onSelectObject,
  className = '',
  isInteractive = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [draggingObjId, setDraggingObjId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Scale: 1 foot = 20 SVG units
  const SCALE = 20;
  const padding = 50;
  const svgWidth = roomDesign.length * SCALE + padding * 2;
  const svgHeight = roomDesign.width * SCALE + padding * 2;

  const selectedObj = roomDesign.objects.find((o) => o.id === selectedObjectId);

  // Mouse Drag handlers for 2D furniture movement
  const handlePointerDown = (e: React.PointerEvent, obj: FurnitureObject) => {
    if (!isInteractive) return;
    e.stopPropagation();
    if (onSelectObject) onSelectObject(obj.id);

    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickXFt = (e.clientX - rect.left - padding) / (SCALE * zoom);
    const clickYFt = (e.clientY - rect.top - padding) / (SCALE * zoom);

    setDraggingObjId(obj.id);
    setDragOffset({
      x: clickXFt - obj.x,
      y: clickYFt - obj.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingObjId || !isInteractive || !onUpdateDesign || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const currXFt = (e.clientX - rect.left - padding) / (SCALE * zoom);
    const currYFt = (e.clientY - rect.top - padding) / (SCALE * zoom);

    const obj = roomDesign.objects.find((o) => o.id === draggingObjId);
    if (!obj) return;

    // Constrain inside room boundaries
    const newX = Math.max(0.5, Math.min(roomDesign.length - obj.width - 0.5, currXFt - dragOffset.x));
    const newY = Math.max(0.5, Math.min(roomDesign.width - obj.depth - 0.5, currYFt - dragOffset.y));

    // Snap to 0.5 ft grid
    const snappedX = Math.round(newX * 2) / 2;
    const snappedY = Math.round(newY * 2) / 2;

    const updatedObjects = roomDesign.objects.map((item) => {
      if (item.id === draggingObjId) {
        return { ...item, x: snappedX, y: snappedY };
      }
      return item;
    });

    onUpdateDesign({
      ...roomDesign,
      objects: updatedObjects,
    });
  };

  const handlePointerUp = () => {
    setDraggingObjId(null);
  };

  // Transformation helpers
  const rotateSelectedObject = () => {
    if (!selectedObj || !onUpdateDesign) return;
    const newRot = (selectedObj.rotation + 45) % 360;
    const updated = roomDesign.objects.map((o) => (o.id === selectedObj.id ? { ...o, rotation: newRot } : o));
    onUpdateDesign({ ...roomDesign, objects: updated });
  };

  const deleteSelectedObject = () => {
    if (!selectedObj || !onUpdateDesign) return;
    const updated = roomDesign.objects.filter((o) => o.id !== selectedObj.id);
    onUpdateDesign({ ...roomDesign, objects: updated });
    if (onSelectObject) onSelectObject(null);
  };

  const duplicateSelectedObject = () => {
    if (!selectedObj || !onUpdateDesign) return;
    const newObj: FurnitureObject = {
      ...selectedObj,
      id: `${selectedObj.type}_${Date.now()}`,
      name: `${selectedObj.name} (Copy)`,
      x: Math.min(roomDesign.length - selectedObj.width - 1, selectedObj.x + 2),
      y: Math.min(roomDesign.width - selectedObj.depth - 1, selectedObj.y + 2),
    };
    onUpdateDesign({ ...roomDesign, objects: [...roomDesign.objects, newObj] });
    if (onSelectObject) onSelectObject(newObj.id);
  };

  // Export as SVG
  const exportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${roomDesign.name.replace(/\s+/g, '_')}_2D_Blueprint.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export as PDF
  const exportPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text('SMART LAND-TO-HOME ARCHITECTURAL BLUEPRINT', 40, 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Room: ${roomDesign.name} (${roomDesign.category.toUpperCase()})`, 40, 60);
    doc.text(`Dimensions: ${roomDesign.length} ft × ${roomDesign.width} ft | Area: ${roomDesign.area} sq ft`, 40, 75);
    doc.text(`Style: ${roomDesign.style} | Floor: ${roomDesign.floorMaterial}`, 40, 90);

    // Architectural Specs Table
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SCHEDULE OF FURNITURE & ARCHITECTURAL OBJECTS:', 40, 120);

    let currentY = 140;
    doc.setFont('helvetica', 'normal');
    roomDesign.objects.forEach((obj, idx) => {
      if (currentY > 520) return;
      doc.text(
        `${idx + 1}. ${obj.name} [${obj.type.toUpperCase()}] — Size: ${obj.width}×${obj.depth}ft | Coord: (${obj.x}, ${obj.y}) | Rot: ${obj.rotation}°`,
        50,
        currentY
      );
      currentY += 16;
    });

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Preliminary design blueprint generated by Smart Land-To-Home AI. Scale 1:50 concept.', 40, 560);

    doc.save(`${roomDesign.name.replace(/\s+/g, '_')}_Architectural_Spec.pdf`);
  };

  return (
    <div
      id="floorplan_2d_container"
      className={`relative flex flex-col w-full h-full min-h-[440px] bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800 select-none ${className}`}
    >
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 z-10">
        {/* Title & Dimension Badge */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs font-semibold text-blue-400">
            2D BLUEPRINT
          </div>
          <span className="text-xs font-bold text-white truncate max-w-[200px]">{roomDesign.name}</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {roomDesign.length}′ × {roomDesign.width}′ ({roomDesign.area} sq ft)
          </span>
        </div>

        {/* View Options & Export Actions */}
        <div className="flex items-center gap-1.5">
          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showGrid ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Dimension Toggle */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showDimensions ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Dimension Lines"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Labels Toggle */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              showLabels ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title="Toggle Object Labels"
          >
            <Tag className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Zoom */}
          <button
            onClick={() => setZoom(Math.max(0.6, zoom - 0.15))}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-300 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2.0, zoom + 0.15))}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Export Buttons */}
          <button
            onClick={exportSVG}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            title="Export SVG"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">SVG</span>
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm"
            title="Export PDF Report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div
        className="flex-1 w-full h-full overflow-auto flex items-center justify-center p-6 bg-slate-950/60 cursor-crosshair"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out',
          }}
        >
          <svg
            ref={svgRef}
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="shadow-2xl rounded-lg bg-slate-900 border border-slate-700"
          >
            <defs>
              {/* Blueprint Grid Pattern */}
              <pattern id="grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse">
                <path d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="0.8" />
              </pattern>
              <pattern id="majorGrid" width={SCALE * 5} height={SCALE * 5} patternUnits="userSpaceOnUse">
                <path d={`M ${SCALE * 5} 0 L 0 0 0 ${SCALE * 5}`} fill="none" stroke="rgba(148, 163, 184, 0.16)" strokeWidth="1.2" />
              </pattern>

              {/* Wall Hatching Pattern */}
              <pattern id="wallHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#334155" strokeWidth="2.5" />
              </pattern>
            </defs>

            {/* Background Grid */}
            {showGrid && (
              <>
                <rect x={padding} y={padding} width={roomDesign.length * SCALE} height={roomDesign.width * SCALE} fill="url(#grid)" />
                <rect x={padding} y={padding} width={roomDesign.length * SCALE} height={roomDesign.width * SCALE} fill="url(#majorGrid)" />
              </>
            )}

            {/* Room Floor Fill */}
            <rect
              x={padding}
              y={padding}
              width={roomDesign.length * SCALE}
              height={roomDesign.width * SCALE}
              fill="#0F172A"
              stroke="#3B82F6"
              strokeWidth="2"
            />

            {/* External Thick Architectural Walls */}
            {/* Top Wall */}
            <rect x={padding - 6} y={padding - 6} width={roomDesign.length * SCALE + 12} height="8" fill="url(#wallHatch)" stroke="#475569" strokeWidth="1.5" />
            {/* Bottom Wall */}
            <rect x={padding - 6} y={padding + roomDesign.width * SCALE - 2} width={roomDesign.length * SCALE + 12} height="8" fill="url(#wallHatch)" stroke="#475569" strokeWidth="1.5" />
            {/* Left Wall */}
            <rect x={padding - 6} y={padding - 6} width="8" height={roomDesign.width * SCALE + 12} fill="url(#wallHatch)" stroke="#475569" strokeWidth="1.5" />
            {/* Right Wall */}
            <rect x={padding + roomDesign.length * SCALE - 2} y={padding - 6} width="8" height={roomDesign.width * SCALE + 12} fill="url(#wallHatch)" stroke="#475569" strokeWidth="1.5" />

            {/* Architectural Dimension Lines */}
            {showDimensions && (
              <g className="text-slate-400 font-mono text-[11px]">
                {/* Top Dimension String */}
                <line x1={padding} y1={padding - 22} x2={padding + roomDesign.length * SCALE} y2={padding - 22} stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={padding} y1={padding - 26} x2={padding} y2={padding - 18} stroke="#64748B" strokeWidth="1.5" />
                <line x1={padding + roomDesign.length * SCALE} y1={padding - 26} x2={padding + roomDesign.length * SCALE} y2={padding - 18} stroke="#64748B" strokeWidth="1.5" />
                <text x={padding + (roomDesign.length * SCALE) / 2} y={padding - 26} textAnchor="middle" fill="#94A3B8" fontWeight="bold">
                  {roomDesign.length}′-0″ ({Math.round(roomDesign.length * 0.3048 * 10) / 10}m)
                </text>

                {/* Left Dimension String */}
                <line x1={padding - 22} y1={padding} x2={padding - 22} y2={padding + roomDesign.width * SCALE} stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={padding - 26} y1={padding} x2={padding - 18} y2={padding} stroke="#64748B" strokeWidth="1.5" />
                <line x1={padding - 26} y1={padding + roomDesign.width * SCALE} x2={padding - 18} y2={padding + roomDesign.width * SCALE} stroke="#64748B" strokeWidth="1.5" />
                <text
                  x={padding - 28}
                  y={padding + (roomDesign.width * SCALE) / 2}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontWeight="bold"
                  transform={`rotate(-90 ${padding - 28} ${padding + (roomDesign.width * SCALE) / 2})`}
                >
                  {roomDesign.width}′-0″ ({Math.round(roomDesign.width * 0.3048 * 10) / 10}m)
                </text>
              </g>
            )}

            {/* Room Center Watermark Tag */}
            <g opacity="0.2" pointerEvents="none">
              <text
                x={padding + (roomDesign.length * SCALE) / 2}
                y={padding + (roomDesign.width * SCALE) / 2 - 8}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="18"
                fontWeight="bold"
                letterSpacing="2"
              >
                {roomDesign.category.toUpperCase().replace('_', ' ')}
              </text>
              <text
                x={padding + (roomDesign.length * SCALE) / 2}
                y={padding + (roomDesign.width * SCALE) / 2 + 14}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="12"
                fontFamily="monospace"
              >
                AREA: {roomDesign.area} SQ FT
              </text>
            </g>

            {/* Render 2D Furniture & Architectural Symbols */}
            {roomDesign.objects.map((obj) => {
              const isSelected = selectedObjectId === obj.id;
              const posX = padding + obj.x * SCALE;
              const posY = padding + obj.y * SCALE;
              const w = obj.width * SCALE;
              const d = obj.depth * SCALE;

              // Center for rotation
              const cx = posX + w / 2;
              const cy = posY + d / 2;

              return (
                <g
                  key={obj.id}
                  transform={`rotate(${obj.rotation} ${cx} ${cy})`}
                  onPointerDown={(e) => handlePointerDown(e, obj)}
                  className="cursor-move"
                >
                  {/* Door representation with swing arc */}
                  {obj.type === 'door' ? (
                    <g>
                      <line x1={posX} y1={posY} x2={posX + w} y2={posY} stroke="#E2E8F0" strokeWidth="3" />
                      <path
                        d={`M ${posX} ${posY} A ${w} ${w} 0 0 1 ${posX + w} ${posY + w}`}
                        fill="rgba(59, 130, 246, 0.15)"
                        stroke="#3B82F6"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <line x1={posX} y1={posY} x2={posX + w} y2={posY + w} stroke="#E2E8F0" strokeWidth="2" />
                    </g>
                  ) : obj.type === 'window' ? (
                    /* Window double-line symbol */
                    <g>
                      <rect x={posX} y={posY} width={w} height={d} fill="#1E293B" stroke="#0EA5E9" strokeWidth="1.5" />
                      <line x1={posX} y1={posY + d / 2} x2={posX + w} y2={posY + d / 2} stroke="#38BDF8" strokeWidth="2" />
                    </g>
                  ) : (
                    /* Standard Furniture CAD Block */
                    <g>
                      {/* Main CAD Block Shape */}
                      <rect
                        x={posX}
                        y={posY}
                        width={w}
                        height={d}
                        rx="4"
                        fill={obj.color || '#334155'}
                        stroke={isSelected ? '#3B82F6' : '#64748B'}
                        strokeWidth={isSelected ? '2.5' : '1.2'}
                        className="transition-all hover:brightness-125"
                      />

                      {/* Internal architectural detail lines based on type */}
                      {obj.type === 'sofa' && (
                        <>
                          <rect x={posX + 4} y={posY + 4} width={w - 8} height={d * 0.3} rx="2" fill="rgba(0,0,0,0.2)" />
                          <line x1={posX + w * 0.33} y1={posY + d * 0.3} x2={posX + w * 0.33} y2={posY + d - 4} stroke="rgba(255,255,255,0.2)" />
                          <line x1={posX + w * 0.66} y1={posY + d * 0.3} x2={posX + w * 0.66} y2={posY + d - 4} stroke="rgba(255,255,255,0.2)" />
                        </>
                      )}

                      {obj.type === 'bed' && (
                        <>
                          <rect x={posX + 4} y={posY + 4} width={w - 8} height={d * 0.2} rx="2" fill="rgba(255,255,255,0.4)" />
                          {/* Pillows */}
                          <rect x={posX + 8} y={posY + d * 0.24} width={w * 0.38} height={d * 0.22} rx="3" fill="#FFFFFF" />
                          <rect x={posX + w * 0.54} y={posY + d * 0.24} width={w * 0.38} height={d * 0.22} rx="3" fill="#FFFFFF" />
                        </>
                      )}

                      {obj.type === 'dining_table' && (
                        <circle cx={cx} cy={cy} r={Math.min(w, d) * 0.15} fill="none" stroke="rgba(255,255,255,0.3)" />
                      )}

                      {obj.type === 'bathtub' && (
                        <rect x={posX + 4} y={posY + 4} width={w - 8} height={d - 8} rx={d * 0.3} fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                      )}

                      {obj.type === 'toilet' && (
                        <>
                          <rect x={posX + 2} y={posY + 2} width={w - 4} height={d * 0.35} rx="2" fill="#FFFFFF" />
                          <ellipse cx={cx} cy={posY + d * 0.65} rx={(w - 6) / 2} ry={(d * 0.6) / 2} fill="#FFFFFF" />
                        </>
                      )}

                      {/* Selection Highlight Ring */}
                      {isSelected && (
                        <rect
                          x={posX - 4}
                          y={posY - 4}
                          width={w + 8}
                          height={d + 8}
                          rx="6"
                          fill="none"
                          stroke="#60A5FA"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                      )}
                    </g>
                  )}

                  {/* Object Label Text */}
                  {showLabels && (
                    <text
                      x={cx}
                      y={cy + 3}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="600"
                      className="pointer-events-none drop-shadow-sm select-none"
                    >
                      {obj.name.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Selected Object 2D Action Bar (Bottom) */}
      {selectedObj && isInteractive && onUpdateDesign && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-white">{selectedObj.name}</span>
            <span className="text-[11px] text-slate-400 font-mono">
              ({selectedObj.x.toFixed(1)}′, {selectedObj.y.toFixed(1)}′) • {selectedObj.width}×{selectedObj.depth}ft
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={rotateSelectedObject}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rotate 45° ({selectedObj.rotation}°)</span>
            </button>
            <button
              onClick={duplicateSelectedObject}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </button>
            <button
              onClick={deleteSelectedObject}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-900/40 hover:bg-red-800 text-red-200 rounded-lg border border-red-700/50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Interactive Prompt */}
      {!selectedObj && (
        <div className="absolute bottom-3 left-4 pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] text-slate-400 border border-white/5">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Click and drag any furniture item in 2D • Live synchronized with 3D!</span>
        </div>
      )}
    </div>
  );
};
