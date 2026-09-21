import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', trekInterest: 'Kedarkantha', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      id="contact-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-slate-950 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/30 border border-red-500/40 text-red-400 text-xs font-black uppercase font-['Rajdhani',sans-serif]">
                Direct Expedition Support
              </span>
              <span className="text-xs text-yellow-400 font-bold font-mono">UTTARAKHAND HQ</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase font-['Rajdhani',sans-serif] tracking-tight mt-1">
              Contact TrekLynks360°
            </h2>
          </div>

          <button
            id="close-contact-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Basecamp Contact Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Rajdhani',sans-serif]">
              Operational Hubs & Basecamp
            </h4>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-['Rajdhani',sans-serif] text-sm">
                    Sankri Basecamp Lodge
                  </strong>
                  <span>Main Trailhead Road, Sankri, Uttarkashi, Uttarakhand 249128</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-['Rajdhani',sans-serif] text-sm">
                    Dehradun Logistics Office
                  </strong>
                  <span>Tarun Vihar Bangali Kothi Dehradun Uttarakhand 24821</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">24/7 Expedition Hotline:</span>
                  <a href="tel:+919953262699" className="font-mono text-white font-bold hover:text-yellow-400">
                    +91 9953262699
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Official Dispatch Email:</span>
                  <a href="mailto:prdpsng@outlook.com" className="font-mono text-white hover:text-yellow-400">
                    prdpsng@outlook.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs leading-relaxed">
              <strong className="font-bold block text-white mb-0.5">Need customized dates or private group?</strong>
              Jiten Bhatt provides custom routes for alpine photographers, families, and high-altitude trail runners.
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/10">
            {submitted ? (
              <div className="py-10 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-black text-white font-['Rajdhani',sans-serif]">
                  Message Dispatched to Basecamp
                </h4>
                <p className="text-xs text-slate-300">
                  Thank you, {form.name}! Jiten Bhatt or our senior guide will contact you via WhatsApp / phone within 4 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Rajdhani',sans-serif]">
                  Expedition Inquiry
                </h4>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Himalayan Trek</label>
                  <select
                    value={form.trekInterest}
                    onChange={(e) => setForm({ ...form, trekInterest: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-yellow-400"
                  >
                    <option value="Valley of Flowers">Valley of Flowers (14,400 ft)</option>
                    <option value="Kedarkantha">Kedarkantha Winter Peak (12,500 ft)</option>
                    <option value="Rupin Pass">Rupin Pass High Traverse (15,250 ft)</option>
                    <option value="Har Ki Dun">Har Ki Dun - Valley of Gods (11,700 ft)</option>
                    <option value="Custom Expedition">Custom Uttarakhand Expedition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Inquiry / Special Request</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Mention tentative dates, group size, fitness level..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-yellow-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider font-['Rajdhani',sans-serif] shadow-md border border-yellow-400/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Submit Inquiry To Jiten</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
