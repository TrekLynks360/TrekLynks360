import React from 'react';
import { Compass, RotateCw, Sun, Sunset, Moon, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { PANORAMA_SCENES } from '../data/treksData';
import { PanoramaScene } from '../types';

interface ControlRing360Props {
  currentHeading: number;
  currentPitch: number;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  activeScene: PanoramaScene;
  onSelectScene: (scene: PanoramaScene) => void;
  onRotateToHeading: (deg: number) => void;
  onToggleTheme: (theme: 'daylight' | 'golden' | 'twilight') => void;
}

export const ControlRing360: React.FC<ControlRing360Props> = ({
  currentHeading,
  currentPitch,
  isAutoRotate,
  onToggleAutoRotate,
  activeScene,
  onSelectScene,
  onRotateToHeading,
  onToggleTheme,
}) => {
  // Cardinal directions
  const getCompassHeadingText = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const cardinalPoints = [
    { label: 'N', deg: 0 },
    { label: 'NE', deg: 45 },
    { label: 'E', deg: 90 },
    { label: 'SE', deg: 135 },
    { label: 'S', deg: 180 },
    { label: 'SW', deg: 225 },
    { label: 'W', deg: 270 },
    { label: 'NW', deg: 315 },
  ];

  const currentSceneIndex = PANORAMA_SCENES.findIndex((s) => s.id === activeScene.id);

  const prevScene = () => {
    const nextIdx = (currentSceneIndex - 1 + PANORAMA_SCENES.length) % PANORAMA_SCENES.length;
    onSelectScene(PANORAMA_SCENES[nextIdx]);
  };

  const nextScene = () => {
    const nextIdx = (currentSceneIndex + 1) % PANORAMA_SCENES.length;
    onSelectScene(PANORAMA_SCENES[nextIdx]);
  };

  return (
    <div
      id="360-control-ring-overlay"
      className="pointer-events-auto flex flex-col items-center w-full max-w-4xl px-4 select-none"
    >
      {/* Upper Scene Navigation Pills */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/70 backdrop-blur-xl border border-white/15 shadow-2xl mb-3 overflow-x-auto max-w-full">
        <button
          id="prev-scene-btn"
          onClick={prevScene}
          className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="Previous Peak Panorama"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {PANORAMA_SCENES.map((scene) => {
          const isActive = scene.id === activeScene.id;
          return (
            <button
              key={scene.id}
              id={`scene-select-${scene.id}`}
              onClick={() => onSelectScene(scene)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 border border-yellow-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-yellow-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{scene.name.split(' ')[0]}</span>
              <span className="text-[10px] text-yellow-300 font-mono hidden sm:inline">
                {scene.altitude.split(' ')[0]}
              </span>
            </button>
          );
        })}

        <button
          id="next-scene-btn"
          onClick={nextScene}
          className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="Next Peak Panorama"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Curved 3D Control Ring HUD */}
      <div className="relative w-full max-w-2xl px-6 py-3 rounded-2xl bg-slate-950/80 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Glow arc rim behind */}
        <div className="absolute inset-x-8 -top-px h-[2px] bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent" />
        <div className="absolute inset-x-12 -bottom-px h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        {/* Left: Active Scene & Himalayan Altitude Gauge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-yellow-500/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 font-['Rajdhani',sans-serif]">
                360° Peak View
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-500" />
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                {activeScene.altitude}
              </span>
            </div>
            <p className="text-sm font-extrabold text-white tracking-tight">{activeScene.name}</p>
          </div>
        </div>

        {/* Center: Curved Compass Dial Ribbon & Degree Indicators */}
        <div className="flex flex-col items-center">
          {/* Compass Ribbon Strip */}
          <div className="relative w-56 h-8 bg-slate-900/90 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center shadow-inner">
            {/* Center Pointer needle */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-yellow-400 z-10 shadow-[0_0_8px_#facc15]" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-yellow-400 z-10" />

            {/* Sliding Cardinal Marks */}
            <div
              className="flex items-center gap-4 transition-transform duration-75 ease-out text-[11px] font-bold font-mono select-none"
              style={{
                transform: `translateX(${-((currentHeading % 360) * 1.5) + 84}px)`,
              }}
            >
              {/* Duplicate array for continuous loop */}
              {[...cardinalPoints, ...cardinalPoints, ...cardinalPoints].map((pt, i) => (
                <button
                  key={`${pt.label}-${i}`}
                  onClick={() => onRotateToHeading(pt.deg)}
                  className={`px-1.5 py-0.5 rounded hover:text-yellow-400 transition-colors ${
                    Math.abs(((currentHeading % 360) - pt.deg + 360) % 360) < 15
                      ? 'text-yellow-400 font-black scale-110'
                      : 'text-slate-400'
                  }`}
                >
                  {pt.label}
                  <span className="text-[8px] block text-slate-500">{pt.deg}°</span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Bearing Coordinates & Pitch */}
          <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono font-semibold text-slate-300">
            <span className="text-yellow-400 font-bold">{currentHeading}°</span>
            <span className="text-slate-500">|</span>
            <span className="text-white">{getCompassHeadingText(currentHeading)}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">PITCH {currentPitch}°</span>
          </div>
        </div>

        {/* Right: Quick Controls (Auto-Rotate & Sky Lighting Atmosphere) */}
        <div className="flex items-center gap-2">
          {/* Auto Rotate Button */}
          <button
            id="toggle-auto-rotate"
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isAutoRotate
                ? 'bg-red-600/90 border-yellow-400 text-white shadow-lg shadow-red-600/30'
                : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle 360° Auto Pan"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5 text-yellow-400" /> : <Play className="w-3.5 h-3.5" />}
            <span className="font-['Rajdhani',sans-serif] tracking-wider uppercase">
              {isAutoRotate ? 'Panning' : 'Auto 360°'}
            </span>
          </button>

          {/* Sky Atmosphere Lighting Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10">
            <button
              id="theme-daylight"
              onClick={() => onToggleTheme('daylight')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeScene.skyTheme === 'daylight'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Daylight Noon"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              id="theme-golden"
              onClick={() => onToggleTheme('golden')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeScene.skyTheme === 'golden'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Golden Hour Sunset"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              id="theme-twilight"
              onClick={() => onToggleTheme('twilight')}
              className={`p-1.5 rounded-lg transition-colors ${
                activeScene.skyTheme === 'twilight'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Alpine Starlit Twilight"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
