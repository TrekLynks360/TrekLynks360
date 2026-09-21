import React from 'react';
import { FOUNDER_INFO } from '../../data/treksData';
import { 
  Award, 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Quote, 
  HeartHandshake, 
  Mountain,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface MeetFounderSectionProps {
  onOpenBooking: () => void;
}

export const MeetFounderSection: React.FC<MeetFounderSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="founder" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/90 text-slate-100 border-t border-white/10 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Founder Photo with Experience Badge & Accreditations (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-red-600 via-yellow-400 to-amber-500 opacity-30 blur-lg" />

              {/* Main Photo Card */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/20 bg-slate-950 shadow-2xl">
                <img
                  src={FOUNDER_INFO.image}
                  alt={FOUNDER_INFO.name}
                  className="w-full h-[460px] object-cover object-top"
                  loading="lazy"
                />

                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Experience Badge Floating on Photo */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-yellow-400/50 shadow-xl">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-black uppercase text-yellow-300 font-['Rajdhani',sans-serif] tracking-wider">
                    16+ Years Garhwal Master
                  </span>
                </div>

                {/* Bottom Name Card on Photo */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-white/15">
                  <h3 className="text-2xl font-black text-white font-['Rajdhani',sans-serif] tracking-tight">
                    {FOUNDER_INFO.name}
                  </h3>
                  <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider font-['Rajdhani',sans-serif]">
                    {FOUNDER_INFO.role}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Garhwal Himalayas, Uttarakhand, India</span>
                  </div>
                </div>
              </div>

              {/* Verified Safety Seal Pill */}
              <div className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/70 border border-white/10 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Nehru Institute of Mountaineering (NIM) Advanced Alumnus</span>
              </div>
            </div>
          </div>

          {/* Right Column: Founder Narrative, Stats, Certifications, Quote (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Pill Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider font-['Rajdhani',sans-serif]">
                Meet The Mountain Visionary
              </span>
              <span className="text-xs text-slate-400 font-mono">ESTD. GARHWAL HIMALAYAS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight leading-tight">
              Guided by 16+ Years of Indigenous Mountain Wisdom
            </h2>

            <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed">
              {FOUNDER_INFO.bio}
            </p>

            {/* Founder Quote Card */}
            <div className="mt-6 p-5 rounded-2xl bg-slate-950/60 border border-yellow-400/30 relative">
              <Quote className="w-8 h-8 text-yellow-400/30 absolute top-4 right-4 pointer-events-none" />
              <p className="text-sm sm:text-base italic text-yellow-200 font-serif leading-relaxed">
                "{FOUNDER_INFO.quote}"
              </p>
              <div className="mt-2 text-xs font-bold text-slate-400 font-['Rajdhani',sans-serif] uppercase tracking-wider">
                — {FOUNDER_INFO.name}, Founder & Expedition Leader
              </div>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {FOUNDER_INFO.stats.map((st, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-amber-300 font-['Rajdhani',sans-serif]">
                    {st.value}
                  </div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mt-1">
                    {st.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Official Credentials Checklist */}
            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-300 font-['Rajdhani',sans-serif] tracking-wider mb-2">
                Official Certifications & Alpine Accreditations:
              </h4>
              {FOUNDER_INFO.certifications.map((cert, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>

            {/* Direct CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm uppercase tracking-wider font-['Rajdhani',sans-serif] shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                Plan a Trek With Jiten Bhatt
              </button>
              <a
                href="#contact"
                className="px-6 py-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-850 text-slate-200 hover:text-white font-bold text-sm uppercase tracking-wider font-['Rajdhani',sans-serif] border border-white/15 transition-all cursor-pointer"
              >
                Contact Basecamp Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
