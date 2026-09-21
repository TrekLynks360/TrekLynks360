import React, { useState } from 'react';
import { TREKS_DATA } from '../../data/treksData';
import { 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export const BookingInquirySection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    trek: TREKS_DATA[0].name,
    trekkersCount: '2',
    preferredDate: 'November 2026',
    notes: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello TrekLynks360° Team! I want to inquire about booking the ${formData.trek} for ${formData.trekkersCount} trekkers in ${formData.preferredDate}. My name is ${formData.name || 'Trekker'}.`
    );
    window.open(`https://wa.me/919953262699?text=${text}`, '_blank');
  };

  return (
    <section id="booking" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Booking Benefits & Logistics Contact (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider font-['Rajdhani',sans-serif] mb-3">
                Direct Basecamp Reservations
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight">
                Secure Your Himalayan Slot
              </h2>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                We maintain a strict maximum of 12 participants per batch to guarantee safety, personalized acclimatization, and pristine camping quality.
              </p>

              {/* What is Included Checklist */}
              <div className="mt-8 space-y-3 p-5 rounded-2xl bg-slate-900/60 border border-white/10">
                <h4 className="text-xs font-black uppercase text-yellow-400 font-['Rajdhani',sans-serif] tracking-wider mb-2">
                  Every TrekLynks360° Booking Includes:
                </h4>
                {[
                  'NIM certified mountaineering expedition leaders & medics',
                  'High-altitude 4-season alpine camping tents & sub-zero sleeping bags',
                  'All nutritious hot meals, evening high-tea, and hydration soups',
                  'Microspikes, gaiters, and safety harnesses for snow ridges',
                  'Medical oxygen cylinder & continuous pulse oximeter monitoring',
                  'Forest permits, wildlife sanctuary fees & UTDB insurance cover',
                ].map((inc, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="mt-8 p-6 rounded-2xl bg-slate-900/90 border border-white/10 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 font-['Rajdhani',sans-serif]">
                Immediate Assistance Hotline:
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <a href="tel:+919953262699" className="font-bold text-white hover:text-yellow-400 transition-colors">
                    +91 9953262699
                  </a>
                  <div className="text-[11px] text-slate-400">Direct Basecamp Dispatch & Inquiries</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <a href="mailto:prdpsng@outlook.com" className="font-bold text-white hover:text-yellow-400 transition-colors">
                    prdpsng@outlook.com
                  </a>
                  <div className="text-[11px] text-slate-400">Formal Itinerary & Group Bookings</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300">
                  Tarun Vihar Bangali Kothi, Dehradun, Uttarakhand 24821
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-white/15 shadow-2xl backdrop-blur-xl">
              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight">
                    Inquiry Received Successfully!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you, <strong className="text-white">{formData.name}</strong>! Our expedition coordinator has registered your request for <strong className="text-yellow-400">{formData.trek}</strong>. Jiten Bhatt or our dispatch team will reach out to you within 2 business hours.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleWhatsAppDirect}
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider font-['Rajdhani',sans-serif] flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp Now (+91 9953262699)</span>
                    </button>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider font-['Rajdhani',sans-serif] cursor-pointer"
                    >
                      Send Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-['Rajdhani',sans-serif] tracking-tight">
                        Reserve Your Expedition Batch
                      </h3>
                      <p className="text-xs text-slate-400">
                        Zero deposit required for initial consultation & fitness review
                      </p>
                    </div>
                    <span className="text-xs font-mono text-yellow-400 font-bold">2026 CALENDAR</span>
                  </div>

                  {/* Trek Selection */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 font-['Rajdhani',sans-serif] tracking-wider mb-1.5">
                      Select Himalayan Trek:
                    </label>
                    <select
                      value={formData.trek}
                      onChange={(e) => setFormData({ ...formData, trek: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    >
                      {TREKS_DATA.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} ({t.altitudeFt.toLocaleString()} ft • {t.durationDays} Days • ₹{t.priceInr.toLocaleString('en-IN')})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Trekkers Count */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 font-['Rajdhani',sans-serif] tracking-wider mb-1.5">
                        Target Month / Date:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nov 2026 / Diwali Batch"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 font-['Rajdhani',sans-serif] tracking-wider mb-1.5">
                        Number of Trekkers:
                      </label>
                      <select
                        value={formData.trekkersCount}
                        onChange={(e) => setFormData({ ...formData, trekkersCount: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Trekker (Solo)' : 'Trekkers'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 font-['Rajdhani',sans-serif] tracking-wider mb-1.5">
                        Your Full Name:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Verma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 font-['Rajdhani',sans-serif] tracking-wider mb-1.5">
                        WhatsApp / Mobile Phone:
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 font-['Rajdhani',sans-serif] tracking-wider mb-1.5">
                      Email Address:
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>

                  {/* Special Notes / Prior Experience */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 font-['Rajdhani',sans-serif] tracking-wider mb-1.5">
                      Prior Trekking Experience / Queries (Optional):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention any prior mountain experience, dietary preferences, or fitness questions..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Form Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      className="w-full sm:flex-1 py-4 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm uppercase tracking-wider font-['Rajdhani',sans-serif] shadow-lg shadow-red-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Expedition Booking Request</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto px-6 py-4 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-sm uppercase tracking-wider font-['Rajdhani',sans-serif] flex items-center justify-center gap-2 border border-emerald-400/40 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp Direct</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
