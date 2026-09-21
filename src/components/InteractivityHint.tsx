import React from 'react';
import { MoveHorizontal, Compass } from 'lucide-react';

interface InteractivityHintProps {
  isVisible?: boolean;
}

export const InteractivityHint: React.FC<InteractivityHintProps> = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div
      id="drag-interactivity-hint"
      className="pointer-events-none select-none flex items-center gap-3 px-4 py-2 rounded-full bg-slate-950/75 backdrop-blur-xl border border-yellow-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] animate-pulse"
    >
      {/* Directional motion arrows with glowing 360 indicator */}
      <div className="flex items-center gap-1 text-yellow-400">
        <span className="text-xs font-mono font-bold animate-bounce-x-left">«</span>
        <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-red-600/30 border border-yellow-400/50">
          <MoveHorizontal className="w-3.5 h-3.5 text-yellow-300" />
        </div>
        <span className="text-xs font-mono font-bold animate-bounce-x-right">»</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-black font-['Rajdhani',sans-serif] tracking-widest uppercase text-white drop-shadow">
          DRAG TO EXPLORE 360°
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
      </div>
    </div>
  );
};
