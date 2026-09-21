import React, { useState } from 'react';
import { Award, ShieldCheck, ChevronRight, User, Mountain } from 'lucide-react';
import { FOUNDER_INFO } from '../data/treksData';

interface FounderCardProps {
  onOpenModal: () => void;
}

export const FounderCard: React.FC<FounderCardProps> = ({ onOpenModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id="meet-the-founder-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="pointer-events-auto group relative w-80 sm:w-96 rounded-3xl p-5 sm:p-6 bg-slate-950/85 backdrop-blur-2xl border-2 border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:border-yellow-400/60 transition-all duration-300 hover:shadow-yellow-400/15 hover:-translate-y-1"
    >
      {/* 3D Glass Light Glint */}
      <div className="absolute top-0 inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-black uppercase tracking-wider shadow-lg border border-yellow-400/50 flex items-center gap-1.5 font-['Rajdhani',sans-serif]">
        <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" />
        <span>Meet The Founder</span>
      </div>

      <div className="flex items-start gap-4 mt-2">
        {/* Jiten Bhatt Profile Photo */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-xl shadow-black/60 group-hover:scale-105 transition-transform duration-300">
            <img
              src={FOUNDER_INFO.image}
              alt="Jiten Bhatt - Founder & Lead Guide"
              className="w-full h-full object-cover object-center"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[10px] text-white font-bold shadow" title="Verified Expedition Leader">
            ✓
          </span>
        </div>

        {/* Founder Credentials & Caption */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-yellow-400 font-bold font-['Rajdhani',sans-serif] tracking-wider uppercase">
            <span>Garhwal Native</span>
            <span>•</span>
            <span>NIM Alum</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mt-0.5">
            {FOUNDER_INFO.name}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-200 mt-0.5">
            Founder & Lead Guide
          </p>

          {/* Requested Caption */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200">
            <Award className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="text-xs font-black tracking-tight font-['Rajdhani',sans-serif] uppercase">
              16+ Years Experience in Uttarakhand
            </span>
          </div>
        </div>
      </div>

      {/* Mini stats & Quote */}
      <div className="mt-4 pt-3.5 border-t border-white/15 text-xs sm:text-sm text-slate-200 space-y-2">
        <p className="line-clamp-2 italic text-slate-200 text-xs sm:text-sm leading-relaxed">
          "{FOUNDER_INFO.quote}"
        </p>

        <div className="flex items-center justify-between text-xs text-slate-300 font-mono pt-1">
          <span className="font-bold text-slate-200">250+ EXPEDITIONS</span>
          <span className="text-emerald-400 font-bold">100% ZERO-LOSS SAFETY</span>
        </div>
      </div>

      {/* Action CTA to open complete story */}
      <button
        id="view-founder-profile-btn"
        onClick={onOpenModal}
        className="w-full mt-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-red-700 hover:to-red-600 text-white font-bold text-sm flex items-center justify-center gap-2 border border-white/15 hover:border-yellow-400/50 shadow-lg transition-all group/btn font-['Rajdhani',sans-serif] tracking-wider uppercase active:scale-95"
      >
        <span>Expedition Bio & Track Record</span>
        <ChevronRight className="w-4 h-4 text-yellow-400 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
