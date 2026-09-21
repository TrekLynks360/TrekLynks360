import React, { useState } from 'react';
import { GALLERY_DATA, PANORAMA_SCENES } from '../../data/treksData';
import { GalleryItem, PanoramaScene } from '../../types';
import { Compass, Eye, Mountain, MapPin } from 'lucide-react';

interface GallerySectionProps {
  onExploreIn360: (scene: PanoramaScene) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onExploreIn360 }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = GALLERY_DATA.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="gallery" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider font-['Rajdhani',sans-serif] mb-3">
              Captures From The Ridge
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight">
              Himalayan Visual Archive
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
              Real untampered perspectives from 11,000 to 15,250 feet across the Garhwal and Kumaon mountain sanctuaries. Click any scene to launch its interactive 360° environment.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {['all', 'summit', 'lake', 'meadow', 'campsite', 'culture'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase font-['Rajdhani',sans-serif] tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const matchedScene =
              PANORAMA_SCENES.find((s) => s.id === item.panoramaId) || PANORAMA_SCENES[0];
            return (
              <div
                key={item.id}
                onClick={() => onExploreIn360(matchedScene)}
                className="group relative h-80 rounded-3xl overflow-hidden border border-white/15 bg-slate-900 cursor-pointer shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold text-yellow-400">
                    {item.altitude}
                  </span>
                  <span className="p-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/15 text-white group-hover:text-yellow-400 group-hover:scale-110 transition-all">
                    <Compass className="w-4 h-4" />
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[11px] text-yellow-400 font-bold uppercase font-['Rajdhani',sans-serif] tracking-wider">
                    {item.trek}
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Rajdhani',sans-serif] tracking-tight group-hover:text-yellow-300 transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Click to view in 360° Viewer</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
