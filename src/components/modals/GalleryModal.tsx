import React from 'react';
import { X, Eye, Compass, Mountain, Check } from 'lucide-react';
import { PANORAMA_SCENES } from '../../data/treksData';
import { PanoramaScene } from '../../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScene: PanoramaScene;
  onSelectScene: (scene: PanoramaScene) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  activeScene,
  onSelectScene,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="gallery-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-950 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-black uppercase font-['Rajdhani',sans-serif]">
                360° Interactive Viewports
              </span>
              <span className="text-xs text-slate-400 font-mono">GARHWAL HIMALAYAS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-['Rajdhani',sans-serif] tracking-tight mt-1">
              Himalayan 360° Panoramic Gallery
            </h2>
          </div>

          <button
            id="close-gallery-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panoramas Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-sm text-slate-300">
            Select any panoramic viewpoint below to instantaneously load the interactive 3D spherical environment into the hero canvas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PANORAMA_SCENES.map((scene) => {
              const isActive = scene.id === activeScene.id;
              return (
                <div
                  key={scene.id}
                  onClick={() => {
                    onSelectScene(scene);
                    onClose();
                  }}
                  className={`group relative p-5 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                    isActive
                      ? 'bg-slate-900 border-yellow-400 shadow-xl shadow-yellow-400/10'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/30 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {scene.altitude}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-[11px] font-semibold text-yellow-400 font-['Rajdhani',sans-serif] uppercase">
                          {scene.skyTheme} Atmosphere
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-white font-['Rajdhani',sans-serif] mt-1 group-hover:text-yellow-300 transition-colors">
                        {scene.name}
                      </h4>
                    </div>

                    {isActive && (
                      <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center text-xs font-black">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {scene.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <span className="text-slate-400">{scene.hotspots.length} Landmark Hotspots</span>
                    <span className="flex items-center gap-1 font-bold font-['Rajdhani',sans-serif] text-yellow-400 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                      <span>Launch 360° View</span>
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
