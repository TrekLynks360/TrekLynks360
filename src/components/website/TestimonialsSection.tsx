import React from 'react';
import { TESTIMONIALS_DATA } from '../../data/treksData';
import { Star, Quote, CheckCircle2, Award } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="reviews" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/95 text-slate-100 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-black uppercase tracking-wider font-['Rajdhani',sans-serif] mb-3">
            Trekker Testimonials
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight">
            Voices From The High Himalayan Trails
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400" />
              ))}
            </div>
            <span className="text-base font-bold text-white font-['Rajdhani',sans-serif]">
              4.9 / 5.0 Rating
            </span>
            <span className="text-slate-400 text-sm">from 1,200+ Guided Trekkers</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-slate-950/70 border border-white/10 hover:border-yellow-400/40 transition-all duration-300 relative flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-white/5 absolute top-6 right-6 pointer-events-none" />

              <div>
                {/* Rating & Trek Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-mono font-bold text-yellow-300">
                    {t.trekName}
                  </span>
                </div>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400/40"
                  loading="lazy"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white font-['Rajdhani',sans-serif] text-base">
                      {t.name}
                    </h4>
                    <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">{t.location} • {t.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
