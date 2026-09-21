import React from 'react';
import { X, Shield, Award, Users } from 'lucide-react';
import { TEAM_MEMBERS } from '../../data/treksData';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="team-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-slate-950 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-xs font-black uppercase font-['Rajdhani',sans-serif]">
                Indigenous Mountain Guild
              </span>
              <span className="text-xs text-yellow-400 font-bold font-mono">100% CERTIFIED LOCAL TEAM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-['Rajdhani',sans-serif] tracking-tight mt-1">
              Meet The TrekLynks360° Expedition Leaders
            </h2>
          </div>

          <button
            id="close-team-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEAM_MEMBERS.map((member, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-yellow-400/40 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-yellow-400/60 flex-shrink-0 shadow-md">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white font-['Rajdhani',sans-serif]">
                    {member.name}
                  </h4>
                  <p className="text-xs text-yellow-400 font-semibold">{member.role}</p>
                  <span className="inline-block text-[11px] text-emerald-400 font-mono font-medium mt-0.5">
                    {member.experience} Experience
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {member.bio}
              </p>

              <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                {member.certifications.map((c, ci) => (
                  <span
                    key={ci}
                    className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
