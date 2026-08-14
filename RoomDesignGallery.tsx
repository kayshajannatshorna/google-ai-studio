import React, { useState } from 'react';
import { RoomCategory, RoomDesign, FurnitureObject, FloorMaterial } from '../../types';
import { allRoomDesigns, getDesignsByCategory } from '../../data/roomDesigns';
import { RoomViewer3D } from '../3d/RoomViewer3D';
import { FloorPlan2DViewer } from '../2d/FloorPlan2DViewer';
import {
  Sparkles,
  Sliders,
  Layers,
  Eye,
  Check,
  Plus,
  Palette,
  Compass,
  ArrowRight,
  Maximize2,
  Box,
  Lightbulb,
  X
} from 'lucide-react';

interface RoomDesignGalleryProps {
  onSelectDesignForRoom?: (category: RoomCategory, design: RoomDesign) => void;
  className?: string;
}

export const RoomDesignGallery: React.FC<RoomDesignGalleryProps> = ({
  onSelectDesignForRoom,
  className = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>('living_room');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('all');
  const [activePreviewDesign, setActivePreviewDesign] = useState<RoomDesign>(allRoomDesigns.living_room[0]);
  const [previewMode, setPreviewMode] = useState<'3d' | '2d'>('3d');
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [customizingDesign, setCustomizingDesign] = useState<RoomDesign>(allRoomDesigns.living_room[0]);

  const categories: { id: RoomCategory; name: string; count: number }[] = [
    { id: 'living_room', name: 'Living Room', count: 10 },
    { id: 'master_bedroom', name: 'Master Bedroom', count: 10 },
    { id: 'bedroom', name: 'Bedrooms', count: 10 },
    { id: 'kitchen', name: 'Gourmet Kitchen', count: 10 },
    { id: 'dining_room', name: 'Dining Room', count: 10 },
    { id: 'bathroom', name: 'Luxury Bathrooms', count: 10 },
    { id: 'study_room', name: 'Study & Office', count: 10 },
    { id: 'family_room', name: 'Family Lounge', count: 10 },
    { id: 'drawing_room', name: 'Drawing Room', count: 10 },
    { id: 'guest_room', name: 'Guest Suite', count: 10 },
  ];

  const currentCategoryDesigns = getDesignsByCategory(selectedCategory);

  const filteredDesigns = selectedStyleFilter === 'all'
    ? currentCategoryDesigns
    : currentCategoryDesigns.filter((d) => d.style.toLowerCase().includes(selectedStyleFilter.toLowerCase()));

  const handleOpenCustomizer = (design: RoomDesign) => {
    setCustomizingDesign(JSON.parse(JSON.stringify(design))); // deep copy
    setIsCustomizeModalOpen(true);
  };

  const handleApplyCustomization = () => {
    setActivePreviewDesign(customizingDesign);
    setIsCustomizeModalOpen(false);
    if (onSelectDesignForRoom) {
      onSelectDesignForRoom(customizingDesign.category, customizingDesign);
    }
  };

  return (
    <div id="room_design_catalog_section" className={`flex flex-col w-full space-y-6 ${className}`}>
      {/* Category Selection Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const firstDesign = allRoomDesigns[cat.id]?.[0] || allRoomDesigns.living_room[0];
                setActivePreviewDesign(firstDesign);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Showcase Layout (Split: Left = 10 Designs Grid, Right = Live 3D / 2D Interactive Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 10 Curated Designs for Selected Category */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>10 Exclusive {categories.find((c) => c.id === selectedCategory)?.name} Concepts</span>
            </h3>
            <span className="text-xs text-slate-400">Min 30×20 ft (600 sq ft)</span>
          </div>

          {/* Cards List */}
          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredDesigns.map((design, idx) => {
              const isSelected = activePreviewDesign.id === design.id;
              return (
                <div
                  key={design.id}
                  onClick={() => setActivePreviewDesign(design)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-mono font-semibold">
                          #{idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-white">{design.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{design.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono text-slate-300 font-semibold">
                        {design.length}′ × {design.width}′
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono">{design.area} sq ft</div>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                        {design.style}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400">
                        {design.objects.length} Objects
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCustomizer(design);
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors"
                      >
                        Customize
                      </button>
                      {onSelectDesignForRoom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDesignForRoom(design.category, design);
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium flex items-center gap-1 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          <span>Select</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Interactive 3D & 2D Synchronized Studio View */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Top Switcher Bar */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{activePreviewDesign.name}</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {activePreviewDesign.length} × {activePreviewDesign.width} ft ({activePreviewDesign.area} sq ft)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* 3D vs 2D Toggle */}
              <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800">
                <button
                  onClick={() => setPreviewMode('3d')}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    previewMode === '3d' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>3D VIEW</span>
                </button>
                <button
                  onClick={() => setPreviewMode('2d')}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    previewMode === '2d' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>2D BLUEPRINT</span>
                </button>
              </div>

              {/* Customize Button */}
              <button
                onClick={() => handleOpenCustomizer(activePreviewDesign)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>EDIT DESIGN</span>
              </button>
            </div>
          </div>

          {/* Interactive Viewer Canvas */}
          <div className="w-full h-[540px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {previewMode === '3d' ? (
              <RoomViewer3D
                roomDesign={activePreviewDesign}
                onUpdateDesign={(updated) => setActivePreviewDesign(updated)}
                isInteractive={true}
              />
            ) : (
              <FloorPlan2DViewer
                roomDesign={activePreviewDesign}
                onUpdateDesign={(updated) => setActivePreviewDesign(updated)}
                isInteractive={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Full Real-time Room Customization Modal */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Customize: {customizingDesign.name}</h3>
              </div>
              <button
                onClick={() => setIsCustomizeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Room Dimensions & Area */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Room Length (ft):</label>
                  <input
                    type="number"
                    min="20"
                    max="60"
                    value={customizingDesign.length}
                    onChange={(e) => {
                      const len = parseInt(e.target.value) || 30;
                      setCustomizingDesign({
                        ...customizingDesign,
                        length: len,
                        area: len * customizingDesign.width,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Room Width (ft):</label>
                  <input
                    type="number"
                    min="15"
                    max="50"
                    value={customizingDesign.width}
                    onChange={(e) => {
                      const wid = parseInt(e.target.value) || 20;
                      setCustomizingDesign({
                        ...customizingDesign,
                        width: wid,
                        area: customizingDesign.length * wid,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Calculated Area:</label>
                  <div className="px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-blue-400 font-mono font-bold text-xs">
                    {customizingDesign.area} sq ft ({customizingDesign.length >= 30 && customizingDesign.width >= 20 ? '✓ Standard Compliant' : 'Custom'})
                  </div>
                </div>
              </div>

              {/* Material & Wall Finish */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Floor Material:</label>
                  <select
                    value={customizingDesign.floorMaterial}
                    onChange={(e) => setCustomizingDesign({ ...customizingDesign, floorMaterial: e.target.value as FloorMaterial })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="Hardwood Oak">Hardwood Oak</option>
                    <option value="Italian White Marble">Italian White Marble</option>
                    <option value="Dark Walnut">Dark Walnut</option>
                    <option value="Black Slate">Black Slate</option>
                    <option value="Terrazzo Stone">Terrazzo Stone</option>
                    <option value="Polished Concrete">Polished Concrete</option>
                    <option value="Herringbone Parquet">Herringbone Parquet</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Wall Color Tone:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customizingDesign.wallColor}
                      onChange={(e) => setCustomizingDesign({ ...customizingDesign, wallColor: e.target.value })}
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={customizingDesign.wallColor}
                      onChange={(e) => setCustomizingDesign({ ...customizingDesign, wallColor: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Lighting Mood:</label>
                  <select
                    value={customizingDesign.lightingMood}
                    onChange={(e) => setCustomizingDesign({ ...customizingDesign, lightingMood: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                  >
                    <option value="daylight">Bright Natural Daylight</option>
                    <option value="warm">Warm Architectural Ambient</option>
                    <option value="moody">Moody Evening Twilight</option>
                  </select>
                </div>
              </div>

              {/* Objects List & Management */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">Configured Furniture & Fixtures ({customizingDesign.objects.length}):</label>
                  <button
                    onClick={() => {
                      const newObj: FurnitureObject = {
                        id: `item_${Date.now()}`,
                        name: 'Accent Armchair',
                        type: 'armchair',
                        width: 3.5,
                        depth: 3.5,
                        height: 3,
                        x: 4,
                        y: 4,
                        rotation: 0,
                        color: '#64748B',
                      };
                      setCustomizingDesign({
                        ...customizingDesign,
                        objects: [...customizingDesign.objects, newObj],
                      });
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {customizingDesign.objects.map((obj, i) => (
                    <div key={obj.id} className="flex items-center justify-between p-2 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: obj.color || '#64748B' }} />
                        <span className="font-medium text-white">{obj.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {obj.width}×{obj.depth}ft
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updated = customizingDesign.objects.filter((_, idx) => idx !== i);
                          setCustomizingDesign({ ...customizingDesign, objects: updated });
                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-800 bg-slate-950">
              <button
                onClick={() => setIsCustomizeModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomization}
                className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply & Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
