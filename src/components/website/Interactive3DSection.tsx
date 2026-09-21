import React, { useState } from 'react';
import { PanoramaScene, Trek } from '../../types';
import { PANORAMA_SCENES, TREKS_DATA } from '../../data/treksData';
import { GoogleEarth3DMap } from '../GoogleEarth3DMap';
import { Panorama360Viewer } from '../Panorama360Viewer';
import { ControlRing360 } from '../ControlRing360';
import { 
  Globe, 
  Compass, 
  Mountain, 
  Maximize2, 
  Info, 
  Layers, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface Interactive3DSectionProps {
  onSelectTrekForBooking: (trek: Trek) => void;
  activeScene: PanoramaScene;
  onSelectScene: (scene: PanoramaScene) => void;
}

export const Interactive3DSection: React.FC<Interactive3DSectionProps> = ({
  onSelectTrekForBooking,
  activeScene,
  onSelectScene,
}) => {
  const [interactiveMode, setInteractiveMode] = useState<'earth3d' | 'panorama'>('earth3d');
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [currentHeading, setCurrentHeading] = useState<number>(0);
  const [currentPitch, setCurrentPitch] = useState<number>(0);
  const [activeHotspot, setActiveHotspot] = useState<any>(null);

  const matchedTrek = TREKS_DATA.find((t) => t.panoramaSceneId === activeScene.id) || TREKS_DATA[0];

  return (
    <section id="3d-explorer" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-wider font-['Rajdhani',sans-serif]">
                Proprietary 3D Himalayan Engine
              </span>
              <span className="text-xs text-yellow-400 font-mono font-bold">TERRAIN TELEMETRY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight">
              Interactive 3D Satellite & 360° Explorer
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
              Inspect topographic elevations, glacial couloirs, and high-altitude basecamp waypoints before setting foot in Uttarakhand. Switch between satellite terrain and on-the-ground 360° photospheres.
            </p>
          </div>

          {/* Engine Mode Toggle */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-white/15 backdrop-blur-xl">
            <button
              onClick={() => setInteractiveMode('earth3d')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase font-['Rajdhani',sans-serif] tracking-wider transition-all cursor-pointer ${
                interactiveMode === 'earth3d'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4 text-yellow-300" />
              <span>3D Satellite Map</span>
            </button>
            <button
              onClick={() => setInteractiveMode('panorama')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold uppercase font-['Rajdhani',sans-serif] tracking-wider transition-all cursor-pointer ${
                interactiveMode === 'panorama'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-yellow-300" />
              <span>360° Ground Panorama</span>
            </button>
          </div>
        </div>

        {/* Interactive Viewport Canvas Box */}
        <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-slate-950 flex flex-col">
          {/* Main 3D / Panorama Viewport */}
          <div className="relative flex-1 w-full h-full">
            {interactiveMode === 'earth3d' ? (
              <GoogleEarth3DMap
                onSelectTrekForBooking={(trek) => onSelectTrekForBooking(trek)}
                onSwitchToPanorama={() => setInteractiveMode('panorama')}
              />
            ) : (
              <div className="relative w-full h-full">
                <Panorama360Viewer
                  scene={activeScene}
                  isAutoRotate={isAutoRotate}
                  onHeadingChange={(h, p) => {
                    setCurrentHeading(h);
                    setCurrentPitch(p);
                  }}
                  onSelectHotspot={setActiveHotspot}
                  activeHotspot={activeHotspot}
                />

                {/* Overlaid Bottom 360 Controls in Panorama Mode */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
                  <ControlRing360
                    currentHeading={currentHeading}
                    currentPitch={currentPitch}
                    isAutoRotate={isAutoRotate}
                    onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
                    activeScene={activeScene}
                    onSelectScene={onSelectScene}
                    onRotateToHeading={() => {}}
                    onToggleTheme={() => {}}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Info Bar with Quick Telemetry */}
          <div className="px-6 py-4 bg-slate-900/90 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-xs text-yellow-400 font-bold font-mono uppercase">
                  Active Scene: {activeScene.name}
                </span>
                <span className="text-slate-400 text-xs ml-2">({activeScene.altitude})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectTrekForBooking(matchedTrek)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider font-['Rajdhani',sans-serif] shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book {matchedTrek.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
