import React, { useState } from 'react';
import { X, Calendar, Mountain, Clock, MapPin, CheckCircle2, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { TREKS_DATA, PANORAMA_SCENES } from '../../data/treksData';
import { Trek, PanoramaScene } from '../../types';

interface TreksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrekForBooking: (trek: Trek) => void;
  onViewTrekIn360: (scene: PanoramaScene) => void;
}

export const TreksModal: React.FC<TreksModalProps> = ({
  isOpen,
  onClose,
  onSelectTrekForBooking,
  onViewTrekIn360,
}) => {
  const [selectedTrek, setSelectedTrek] = useState<Trek>(TREKS_DATA[0]);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  if (!isOpen) return null;

  const filteredTreks = TREKS_DATA.filter((trek) => {
    if (filterDifficulty === 'all') return true;
    return trek.difficulty.toLowerCase().includes(filterDifficulty.toLowerCase());
  });

  const handleLaunch360 = (trek: Trek) => {
    const scene = PANORAMA_SCENES.find((s) => s.id === trek.panoramaSceneId) || PANORAMA_SCENES[0];
    onViewTrekIn360(scene);
    onClose();
  };

  return (
    <div
      id="treks-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl bg-slate-950 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-xs font-black uppercase font-['Rajdhani',sans-serif]">
                Garhwal & Kumaon
              </span>
              <span className="text-xs text-yellow-400 font-bold font-mono">16+ YRS EXPERTISE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-['Rajdhani',sans-serif] tracking-tight mt-1">
              Curated Himalayan Expeditions
            </h2>
          </div>

          <button
            id="close-treks-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Trek Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-3">
              {['all', 'easy-moderate', 'moderate', 'difficult'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterDifficulty(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-['Rajdhani',sans-serif] uppercase tracking-wider transition-all ${
                    filterDifficulty === lvl
                      ? 'bg-yellow-400 text-slate-950 font-black shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {filteredTreks.map((trek) => {
              const isSelected = selectedTrek.id === trek.id;
              return (
                <div
                  key={trek.id}
                  onClick={() => setSelectedTrek(trek)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-yellow-400/80 shadow-lg shadow-yellow-400/10 scale-[1.01]'
                      : 'bg-slate-900/40 border-white/10 hover:border-white/30 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-white">{trek.name}</h4>
                      <p className="text-xs text-yellow-400/90 font-medium mt-0.5">{trek.tagline}</p>
                    </div>
                    <span className="text-sm font-black text-yellow-400 font-['Rajdhani',sans-serif]">
                      ₹{trek.priceInr.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-300 font-mono">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Mountain className="w-3.5 h-3.5" />
                      {trek.altitudeFt.toLocaleString()} FT
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {trek.durationDays} Days
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">{trek.difficulty}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Trek Detailed Preview */}
          <div className="lg:col-span-7 bg-slate-900/50 p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-yellow-400 font-['Rajdhani',sans-serif] uppercase tracking-wider">
                    {selectedTrek.region}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-0.5 font-['Rajdhani',sans-serif]">
                    {selectedTrek.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-yellow-400 font-['Rajdhani',sans-serif]">
                    ₹{selectedTrek.priceInr.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-slate-400">All meals, gear & guides</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedTrek.overview}
              </p>

              {/* Key Highlights */}
              <div>
                <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-['Rajdhani',sans-serif]">
                  Expedition Highlights
                </h5>
                <div className="space-y-2">
                  {selectedTrek.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daywise brief */}
              <div>
                <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 font-['Rajdhani',sans-serif]">
                  Day-by-Day Route Itinerary ({selectedTrek.durationDays} Days)
                </h5>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-2">
                  {selectedTrek.itinerary.map((step) => (
                    <div
                      key={step.day}
                      className="p-2 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-400 font-mono font-bold text-[10px]">
                          D{step.day}
                        </span>
                        <span className="text-white font-medium">{step.title}</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[11px]">{step.altitude}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => handleLaunch360(selectedTrek)}
                className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider font-['Rajdhani',sans-serif] border border-white/15 flex items-center justify-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4 text-yellow-400" />
                <span>Experience 360° Panorama</span>
              </button>

              <button
                onClick={() => {
                  onSelectTrekForBooking(selectedTrek);
                  onClose();
                }}
                className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider font-['Rajdhani',sans-serif] shadow-lg shadow-red-600/30 border border-yellow-400/40 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>Book This Trek Now</span>
                <ArrowRight className="w-4 h-4 text-yellow-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
