import React from 'react';
import { ExteriorOptions } from '../../types';
import {
  Palette,
  Layers,
  Sparkles,
  Sun,
  Moon,
  Trees,
  Car,
  Waves,
  Shield,
  Sliders
} from 'lucide-react';

interface ExteriorCustomizerProps {
  exterior: ExteriorOptions;
  onChange: (updated: ExteriorOptions) => void;
  className?: string;
}

export const ExteriorCustomizer: React.FC<ExteriorCustomizerProps> = ({
  exterior,
  onChange,
  className = '',
}) => {
  const wallColors = [
    { name: 'Pure Chalk', hex: '#F4F4F6' },
    { name: 'Warm Travertine', hex: '#EAE5D9' },
    { name: 'Architectural Slate', hex: '#71717A' },
    { name: 'Charcoal Basalt', hex: '#27272A' },
    { name: 'Desert Sand', hex: '#D4C3B3' },
  ];

  const roofColors = [
    { name: 'Midnight Charcoal', hex: '#2B2D42' },
    { name: 'Graphite Black', hex: '#18181B' },
    { name: 'Terra Cotta', hex: '#9A3412' },
    { name: 'Brushed Zinc', hex: '#52525B' },
  ];

  const updateProp = <K extends keyof ExteriorOptions>(key: K, val: ExteriorOptions[K]) => {
    onChange({
      ...exterior,
      [key]: val,
    });
  };

  return (
    <div className={`p-4 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 space-y-4 text-xs ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-blue-400" />
          <span>Exterior Architecture Customizer</span>
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">Live 3D Sync</span>
      </div>

      {/* Exterior Wall Color Palette */}
      <div>
        <span className="font-semibold text-slate-300 block mb-1.5">Facade Wall Color:</span>
        <div className="flex items-center gap-2">
          {wallColors.map((col) => (
            <button
              key={col.name}
              onClick={() => updateProp('wallColor', col.hex)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                exterior.wallColor.toLowerCase() === col.hex.toLowerCase()
                  ? 'border-blue-500 scale-110 shadow-lg'
                  : 'border-slate-700 hover:scale-105'
              }`}
              style={{ backgroundColor: col.hex }}
              title={col.name}
            />
          ))}
          <input
            type="color"
            value={exterior.wallColor}
            onChange={(e) => updateProp('wallColor', e.target.value)}
            className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 ml-auto"
            title="Custom Wall Color"
          />
        </div>
      </div>

      {/* Roof Style */}
      <div>
        <span className="font-semibold text-slate-300 block mb-1.5">Roof & Coping Style:</span>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'modern_flat', label: 'Flat Parapet' },
            { id: 'cantilever_terrace', label: 'Cantilever' },
            { id: 'pitched', label: 'Pitched Alpine' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => updateProp('roofStyle', style.id as any)}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                exterior.roofStyle === style.id
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roof Color */}
      <div>
        <span className="font-semibold text-slate-300 block mb-1.5">Roof Fascia Color:</span>
        <div className="flex items-center gap-2">
          {roofColors.map((col) => (
            <button
              key={col.name}
              onClick={() => updateProp('roofColor', col.hex)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                exterior.roofColor.toLowerCase() === col.hex.toLowerCase()
                  ? 'border-blue-500 scale-110 shadow-lg'
                  : 'border-slate-700 hover:scale-105'
              }`}
              style={{ backgroundColor: col.hex }}
              title={col.name}
            />
          ))}
        </div>
      </div>

      {/* Landscape & Features Toggles */}
      <div className="pt-2 border-t border-slate-800 space-y-2">
        <span className="font-semibold text-slate-300 block">Site Landscaping & Props:</span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateProp('hasPool', !exterior.hasPool)}
            className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
              exterior.hasPool
                ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Luxury Pool</span>
          </button>

          <button
            onClick={() => updateProp('hasCar', !exterior.hasCar)}
            className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
              exterior.hasCar
                ? 'bg-blue-950/40 border-blue-500/50 text-blue-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Driveway EV</span>
          </button>

          <button
            onClick={() => updateProp('hasGarden', !exterior.hasGarden)}
            className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
              exterior.hasGarden
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Trees & Lawn</span>
          </button>

          <button
            onClick={() => updateProp('louverAccents', !exterior.louverAccents)}
            className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
              exterior.louverAccents
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Timber Louvers</span>
          </button>
        </div>
      </div>
    </div>
  );
};
