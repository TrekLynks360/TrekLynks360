import React from 'react';
import { Compass, Sparkles, Mountain, ArrowRight, ShieldCheck, Award, Globe } from 'lucide-react';

interface HeroContentProps {
  onExploreTreks: () => void;
  onOpenBooking: () => void;
  onOpen3DEarth?: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  onExploreTreks,
  onOpenBooking,
  onOpen3DEarth,
}) => {
  return (
    <div
      id="hero-center-content"
      className="pointer-events-none flex flex-col items-center text-center max-w-4xl px-4 select-none"
    >
      {/* Top Futuristic Tag / Badge */}
      <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-yellow-400/40 shadow-xl mb-4 group cursor-default">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400" />
        </span>
        <span className="text-xs font-black tracking-widest uppercase font-['Rajdhani',sans-serif] text-yellow-300">
          PREMIUM GARHWAL & KUMAON EXPEDITIONS
        </span>
        <span className="text-white/30">•</span>
        <span className="text-[11px] font-bold text-red-400 font-mono">EST. 2008</span>
      </div>

      {/* Main Center Heading strictly as requested:
          "UNLEASH YOUR ADVENTURE. EXPLORE UTTARAKHAND IN 3D."
      */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white font-['Rajdhani',sans-serif] tracking-tight uppercase leading-[0.92] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] max-w-4xl">
        UNLEASH YOUR ADVENTURE.{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-amber-300 drop-shadow-[0_0_35px_rgba(250,204,21,0.4)]">
          EXPLORE UTTARAKHAND IN 3D.
        </span>
      </h1>

      {/* Subheading strictly as requested:
          "Experience immersive treks, guided by expertise of 7+ years. Book your next journey with TrekLynks360°."
      */}
      <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-slate-200 font-semibold max-w-2xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
        Experience immersive treks, guided by expertise of 7+ years. Book your next journey with{' '}
        <span className="font-extrabold text-white">
          <span className="text-red-500">TrekLynks</span>
          <span className="text-yellow-400">360°</span>
        </span>
        .
      </p>

      {/* Prominent Inviting 3D CTA Button strictly as requested:
          Text: "EXPLORE TREKS NOW (360° VIEW)"
      */}
      <div className="pointer-events-auto mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3.5 flex-wrap justify-center">
        <button
          id="hero-3d-cta-button"
          onClick={onExploreTreks}
          className="relative group px-9 py-4.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 text-white font-black text-base sm:text-lg tracking-wider uppercase font-['Rajdhani',sans-serif] shadow-[0_12px_30px_rgba(220,38,38,0.5)] border-t border-yellow-300/60 border-b-4 border-red-950 active:border-b-0 active:translate-y-1 hover:shadow-[0_16px_40px_rgba(250,204,21,0.45)] transition-all duration-150 flex items-center gap-3 overflow-hidden cursor-pointer"
        >
          {/* Animated 3D highlight sheen */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          {/* 360 rotation badge icon */}
          <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow group-hover:rotate-180 transition-transform duration-500">
            <Compass className="w-5 h-5 text-slate-950" />
          </div>

          <span className="text-white drop-shadow">
            EXPLORE TREKS NOW (360° VIEW)
          </span>

          <ArrowRight className="w-5 h-5 text-yellow-300 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 3D Google Earth Satellite Map CTA Button */}
        {onOpen3DEarth && (
          <button
            id="hero-3d-earth-btn"
            onClick={onOpen3DEarth}
            className="px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-900/90 to-teal-900/90 hover:from-emerald-800 hover:to-teal-800 text-emerald-200 hover:text-white font-black text-sm sm:text-base tracking-wider uppercase font-['Rajdhani',sans-serif] border-2 border-emerald-400/60 hover:border-yellow-400 backdrop-blur-xl shadow-xl transition-all flex items-center gap-2.5 cursor-pointer active:scale-95"
          >
            <Globe className="w-5 h-5 text-yellow-300" />
            <span>3D Satellite Map</span>
          </button>
        )}

        {/* Secondary Quick Action: Direct Booking */}
        <button
          id="hero-book-fast-btn"
          onClick={onOpenBooking}
          className="px-7 py-4 rounded-2xl bg-slate-950/85 hover:bg-slate-900 text-slate-100 hover:text-white font-bold text-sm sm:text-base tracking-wider uppercase font-['Rajdhani',sans-serif] border border-white/25 hover:border-yellow-400/60 backdrop-blur-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Instant Booking</span>
          <span className="text-xs text-yellow-400 font-mono font-bold">2026 Season</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-5 hidden sm:flex items-center gap-4 text-xs text-slate-300 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-yellow-400" />
          <span>7+ Years Uttarakhand Pioneer</span>
        </div>
        <span className="text-white/20">•</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>NIM Certified Alpine Guides</span>
        </div>
        <span className="text-white/20">•</span>
        <div className="flex items-center gap-1.5">
          <Mountain className="w-4 h-4 text-sky-400" />
          <span>250+ Successful Expeditions</span>
        </div>
      </div>
    </div>
  );
};
