import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Users, 
  Flame, 
  Leaf, 
  Radio, 
  CheckCircle2,
  Award
} from 'lucide-react';

export const SafetySection: React.FC = () => {
  const safetyPillars = [
    {
      icon: Users,
      title: 'Strict 1:6 Guide-to-Trekker Ratio',
      desc: 'Unlike commercial mass operators with 1:20 ratios, we cap every batch at 12 trekkers accompanied by at least 2 certified technical mountaineers.',
      highlight: 'Continuous Personal Attention',
    },
    {
      icon: Activity,
      title: 'Twice-Daily Oximeter & Vitals Audit',
      desc: 'Morning and evening pulse oximetry and AMS (Acute Mountain Sickness) scoring for every single participant before pushing to higher elevations.',
      highlight: 'Proactive Acclimatization',
    },
    {
      icon: ShieldCheck,
      title: 'High-Altitude Medical Oxygen & Stretcher',
      desc: 'Every expedition carries portable medical oxygen cylinders, comprehensive trauma first-aid kits, and high-altitude emergency medicines.',
      highlight: 'Rapid Response Protocol',
    },
    {
      icon: Flame,
      title: 'Nutritious Hot Garhwali Food & Hydration',
      desc: 'Engineered high-carbohydrate alpine diets prepared fresh at sub-zero temperatures using locally sourced Garhwal millets, hot soups, and ginger tea.',
      highlight: 'Zero Processed Meals',
    },
    {
      icon: Radio,
      title: 'Basecamp VHF Radio & Satellite Tracking',
      desc: 'Constant communication link between our trail leaders, Sankri Basecamp, and Dehradun Logistics HQ for immediate logistics & emergency dispatch.',
      highlight: 'Always Connected',
    },
    {
      icon: Leaf,
      title: 'Leave No Trace (LNT) Zero-Waste Camping',
      desc: 'We carry all non-biodegradable waste back to municipal recycling centers in Dehradun, using dry eco-toilets to protect fragile alpine meadows.',
      highlight: '100% Eco-Sensitive',
    },
  ];

  return (
    <section id="safety" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/95 text-slate-100 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-wider font-['Rajdhani',sans-serif] mb-3">
            Uncompromising Safety Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight">
            100% Zero-Loss High-Altitude Safety Record
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            In 16+ years and across 250+ Himalayan expeditions, safety has never been an afterthought at TrekLynks360°. Here is how we protect every breath in the mountains.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safetyPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-slate-950/70 border border-white/10 hover:border-yellow-400/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600/30 to-amber-500/30 border border-white/15 flex items-center justify-center text-yellow-400 mb-6">
                    <Icon className="w-6 h-6 text-yellow-400" />
                  </div>

                  <span className="text-[11px] font-black uppercase text-red-400 font-['Rajdhani',sans-serif] tracking-wider block mb-1">
                    {pillar.highlight}
                  </span>

                  <h3 className="text-xl font-bold text-white font-['Rajdhani',sans-serif] tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified NIM Protocol</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
