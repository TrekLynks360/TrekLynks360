import React from 'react';
import { X, Award, ShieldCheck, Mountain, Compass, Heart, CheckCircle2 } from 'lucide-react';
import { FOUNDER_INFO } from '../../data/treksData';

interface FounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookWithFounder: () => void;
}

export const FounderModal: React.FC<FounderModalProps> = ({
  isOpen,
  onClose,
  onBookWithFounder,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="founder-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-slate-950 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-xs font-black uppercase font-['Rajdhani',sans-serif]">
              Founder & Lead Expedition Leader
            </span>
            <span className="text-xs text-yellow-400 font-bold font-mono">16+ YRS UTTARAKHAND</span>
          </div>

          <button
            id="close-founder-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-2xl">
                <img
                  src={FOUNDER_INFO.image}
                  alt={FOUNDER_INFO.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px] uppercase font-['Rajdhani',sans-serif]">
                Verified Guide
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-3xl font-black text-white font-['Rajdhani',sans-serif] tracking-tight">
                {FOUNDER_INFO.name}
              </h3>
              <p className="text-sm font-semibold text-yellow-400">
                Garhwal Native • High-Altitude Mountaineer & Rescue Specialist
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-bold font-['Rajdhani',sans-serif] uppercase">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>16+ Years Experience in Uttarakhand</span>
              </div>
              <p className="text-xs text-slate-300 italic pt-1">
                "{FOUNDER_INFO.quote}"
              </p>
            </div>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FOUNDER_INFO.stats.map((stat, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-center">
                <div className="text-xl sm:text-2xl font-black text-yellow-400 font-['Rajdhani',sans-serif]">
                  {stat.value}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Biography */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-2 text-sm text-slate-300 leading-relaxed">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Rajdhani',sans-serif]">
              The Mountaineering Legacy
            </h4>
            <p>{FOUNDER_INFO.bio}</p>
          </div>

          {/* Certifications & Alpine Training */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Rajdhani',sans-serif]">
              Alpine Qualifications & Licenses
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FOUNDER_INFO.certifications.map((cert, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Personalized trail briefings conducted before every departure.
            </div>

            <button
              onClick={() => {
                onClose();
                onBookWithFounder();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider font-['Rajdhani',sans-serif] shadow-lg shadow-red-600/30 border border-yellow-400/40"
            >
              Plan Journey With Jiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
