import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', onClick }) => {
  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-3xl sm:text-4xl',
    lg: 'text-4xl sm:text-5xl',
  };

  return (
    <div
      id="brand-logo"
      onClick={onClick}
      className={`group flex items-center gap-3.5 cursor-pointer select-none transition-transform active:scale-95 ${className}`}
    >
      {/* Official TrekLynks360 Mountain & Cross Emblem matching user's reference IMG-20260921-WA0000.jpg */}
      <div
        className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center rounded-2xl bg-[#d9141e] shadow-xl shadow-red-600/40 ring-2 ring-white/30 overflow-hidden p-1.5`}
      >
        {/* Crisp vector recreation of the official logo */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bottom horizontal base bar */}
          <rect x="52" y="338" width="396" height="24" rx="3" fill="#ffffff" />

          {/* Left slope lower segment with gap */}
          <polygon points="85,322 108,268 126,276 103,330" fill="#ffffff" />

          {/* Left peak, notch dip, and main summit peak */}
          <polyline
            points="114,272 144,195 178,276 260,82"
            stroke="#ffffff"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Main descending right ridge */}
          <line
            x1="260"
            y1="82"
            x2="415"
            y2="345"
            stroke="#ffffff"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Perpendicular crossbar cutting through the right ridge (Trail Cross / Pickaxe) */}
          <line
            x1="312"
            y1="240"
            x2="385"
            y2="175"
            stroke="#ffffff"
            strokeWidth="24"
            strokeLinecap="square"
          />
        </svg>

        {/* 360 interactive pulse indicator */}
        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-yellow-400 animate-ping opacity-80" />
      </div>

      {/* Styled Brand Name strictly as requested:
          Written as "TrekLynks360°" (NOT all capital letters: "sara capital letter me mt likho")
          "TrekLynks" in bold striking RED text.
          "360°" in bright contrast YELLOW text with small degree symbol.
      */}
      <div className="flex flex-col">
        <div className="flex items-baseline tracking-tight font-black font-['Rajdhani',sans-serif]">
          <span
            className={`text-red-500 font-extrabold normal-case drop-shadow-[0_0_14px_rgba(239,68,68,0.4)] ${textSizes[size]}`}
          >
            TrekLynks
          </span>
          <span
            className={`text-yellow-400 font-black tracking-normal ml-0.5 drop-shadow-[0_0_14px_rgba(250,204,21,0.5)] ${textSizes[size]}`}
          >
            360°
          </span>
        </div>
        <div className="flex items-center gap-2 -mt-1">
          <span className="text-xs font-bold tracking-wider text-slate-300">
            Garhwal Himalayas
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="text-xs font-semibold text-emerald-400 tracking-wider">
            16 Yrs Exp
          </span>
        </div>
      </div>
    </div>
  );
};

