import React from 'react';
import { TEAM_MEMBERS } from '../../data/treksData';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, Mountain } from 'lucide-react';

export const TeamSection: React.FC = () => {
  return (
    <section id="team" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/95 text-slate-100 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider font-['Rajdhani',sans-serif] mb-3">
            Garhwal Mountain Veterans
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight">
            Our Expedition Leaders & Technical Guides
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Every expedition is led by native Himalayan mountaineers and certified medics with decades of high-altitude experience. No outsourced or unverified tour escorts.
          </p>
        </div>

        {/* Team Grid (4 Members) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden flex flex-col hover:border-yellow-400/50 hover:shadow-2xl transition-all duration-300"
            >
              {/* Image with overlay */}
              <div className="relative h-72 w-full overflow-hidden bg-slate-950">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Experience Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-yellow-400/40 text-yellow-300 text-xs font-mono font-bold">
                  {member.experience} EXP
                </div>
              </div>

              {/* Info Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white font-['Rajdhani',sans-serif] tracking-tight group-hover:text-yellow-400 transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-xs text-red-400 font-bold uppercase font-['Rajdhani',sans-serif] tracking-wider mt-0.5">
                    {member.role}
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Certifications Pills */}
                <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">
                    Accreditations:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.certifications.map((cert, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-800 border border-white/10 text-[10px] text-slate-200 font-medium"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
