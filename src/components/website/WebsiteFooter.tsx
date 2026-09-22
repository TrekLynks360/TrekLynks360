import React from 'react';
import { Logo } from '../Logo';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Compass, 
  Heart, 
  ArrowUp,
  MessageSquare
} from 'lucide-react';

export const WebsiteFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative bg-slate-950 text-slate-300 border-t border-white/15 pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Pioneering futuristic 3D & 360° immersive Himalayan trekking experiences across Uttarakhand. Directed by Jiten Bhatt with 7+ years of alpine mountain guidance, 1:6 safety ratios, and 100% zero-loss record.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-300">
                2026 Himalayan Registrations Active
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://wa.me/919953262699"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-['Rajdhani',sans-serif] uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Dispatch</span>
              </a>
              <a
                href="tel:+919953262699"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/10 text-white text-xs font-bold font-['Rajdhani',sans-serif] uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4 text-red-500" />
                <span>Call Dispatch</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Rajdhani',sans-serif]">
              Expedition Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#treks" className="hover:text-yellow-400 transition-colors">
                  Featured Himalayan Treks
                </a>
              </li>
              <li>
                <a href="#3d-explorer" className="hover:text-yellow-400 transition-colors">
                  Interactive 3D Satellite Map
                </a>
              </li>
              <li>
                <a href="#founder" className="hover:text-yellow-400 transition-colors">
                  Meet Jiten Bhatt (Founder)
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-yellow-400 transition-colors">
                  Expedition Team & Guides
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-yellow-400 transition-colors">
                  High Altitude Safety Protocols
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-yellow-400 transition-colors">
                  Himalayan 360° Visual Archive
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-yellow-400 transition-colors">
                  Batch Availability & Booking
                </a>
              </li>
            </ul>
          </div>

          {/* Uttarakhand Peaks */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Rajdhani',sans-serif]">
              Top Treks 2026
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#treks" className="hover:text-yellow-400 transition-colors flex items-center justify-between">
                  <span>Kedarkantha Winter Peak</span>
                  <span className="font-mono text-yellow-400/80">12,500 FT</span>
                </a>
              </li>
              <li>
                <a href="#treks" className="hover:text-yellow-400 transition-colors flex items-center justify-between">
                  <span>Valley of Flowers & Hemkund</span>
                  <span className="font-mono text-yellow-400/80">14,400 FT</span>
                </a>
              </li>
              <li>
                <a href="#treks" className="hover:text-yellow-400 transition-colors flex items-center justify-between">
                  <span>Rupin Pass High Ridge</span>
                  <span className="font-mono text-yellow-400/80">15,250 FT</span>
                </a>
              </li>
              <li>
                <a href="#treks" className="hover:text-yellow-400 transition-colors flex items-center justify-between">
                  <span>Har Ki Dun Sacred Valley</span>
                  <span className="font-mono text-yellow-400/80">11,700 FT</span>
                </a>
              </li>
              <li>
                <a href="#treks" className="hover:text-yellow-400 transition-colors flex items-center justify-between">
                  <span>Kuari Pass (Nanda Devi)</span>
                  <span className="font-mono text-yellow-400/80">12,516 FT</span>
                </a>
              </li>
              <li>
                <a href="#treks" className="hover:text-yellow-400 transition-colors flex items-center justify-between">
                  <span>Brahmatal Frozen Lake</span>
                  <span className="font-mono text-yellow-400/80">12,250 FT</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Basecamp & Logistics Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white font-['Rajdhani',sans-serif]">
              Logistics & Basecamp
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-['Rajdhani',sans-serif]">
                    Dehradun Logistics Office:
                  </strong>
                  Tarun Vihar Bangali Kothi, Dehradun, Uttarakhand 24821
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Compass className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-['Rajdhani',sans-serif]">
                    Garhwal Trailhead Hub:
                  </strong>
                  Sankri Basecamp, Govind National Park, Uttarkashi
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-['Rajdhani',sans-serif]">
                    24/7 Hotline / WhatsApp:
                  </strong>
                  <a href="tel:+919953262699" className="text-yellow-300 font-mono font-bold hover:underline">
                    +91 9953262699
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-['Rajdhani',sans-serif]">
                    Email:
                  </strong>
                  <a href="mailto:prdpsng@outlook.com" className="text-slate-300 hover:text-white hover:underline">
                    prdpsng@outlook.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Accreditations Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} TrekLynks360°. All rights reserved.</span>
            <span>•</span>
            <span className="text-slate-400">Registered with Uttarakhand Tourism Development Board (UTDB)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>NIM Certified</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase font-['Rajdhani',sans-serif]">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
