import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Compass,
  Phone,
  Volume2,
  VolumeX,
  Menu,
  X,
  Calendar,
  Mountain,
  Users,
  Image,
  Info,
  Sparkles,
  Globe,
} from 'lucide-react';
import { alpineAudio } from '../utils/audioSynth';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  viewMode?: 'panorama' | 'earth3d';
  onToggleViewMode?: (mode: 'panorama' | 'earth3d') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  viewMode = 'panorama',
  onToggleViewMode,
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSoundscape = () => {
    const active = alpineAudio.toggle();
    setIsAudioActive(active);
  };

  const navItems = [
    { id: 'home', label: 'Home', target: 'hero', icon: Compass },
    { id: 'our-treks', label: 'Treks', target: 'treks', icon: Mountain },
    { id: '3d-explorer', label: '3D Map', target: '3d-explorer', icon: Globe },
    { id: 'about-us', label: 'Jiten Bhatt', target: 'founder', icon: Info },
    { id: 'team', label: 'Team', target: 'team', icon: Users },
    { id: 'safety', label: 'Safety', target: 'safety', icon: Sparkles },
    { id: 'gallery-360', label: 'Gallery', target: 'gallery', icon: Image },
    { id: 'book-now', label: 'Book Now', target: 'booking', icon: Calendar, highlight: true },
  ];

  const handleItemClick = (id: string, target?: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    if (target) {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      id="main-navbar"
      className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 p-2.5 sm:px-6 sm:py-3 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border-2 border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
        {/* Branding & Logo in Top Left corner as requested */}
        <Logo
          size="md"
          onClick={() => handleItemClick('home')}
        />

        {/* Desktop Navigation Menu */}
        <nav className="hidden xl:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            if (item.highlight) {
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleItemClick(item.id, item.target)}
                  className="ml-1 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider font-['Rajdhani',sans-serif] shadow-lg shadow-red-600/40 border border-yellow-400/50 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-yellow-300" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleItemClick(item.id, item.target)}
                className={`px-3.5 py-2 rounded-2xl text-sm font-bold uppercase tracking-wider font-['Rajdhani',sans-serif] transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-yellow-400 bg-white/15 shadow-sm border border-yellow-400/40 font-black'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Utility Actions: 3D Google Earth Satellite Toggle, Soundscape, Hotline */}
        <div className="flex items-center gap-2.5">
          {/* Prominent 3D Google Earth Satellite Map Toggle */}
          {onToggleViewMode && (
            <button
              id="toggle-earth-3d-btn"
              onClick={() => onToggleViewMode(viewMode === 'panorama' ? 'earth3d' : 'panorama')}
              className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl border-2 text-xs sm:text-sm font-black font-['Rajdhani',sans-serif] tracking-wider uppercase transition-all shadow-xl active:scale-95 cursor-pointer ${
                viewMode === 'earth3d'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-yellow-400 text-white shadow-emerald-500/30'
                  : 'bg-slate-900/90 border-yellow-400/60 text-yellow-300 hover:bg-yellow-400 hover:text-slate-950 shadow-black/50'
              }`}
              title="Switch between 360 Ground Panorama and 3D Google Earth Satellite Map"
            >
              <Globe className="w-4 h-4 text-yellow-300" />
              <span className="hidden md:inline">
                {viewMode === 'earth3d' ? '360° Panorama' : '3D Satellite Map'}
              </span>
              <span className="md:hidden">
                {viewMode === 'earth3d' ? '360°' : '3D Map'}
              </span>
            </button>
          )}

          {/* Alpine Wind & Prayer Bell Audio Toggle */}
          <button
            id="audio-soundscape-toggle"
            onClick={toggleSoundscape}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs sm:text-sm font-bold font-['Rajdhani',sans-serif] tracking-wider transition-all cursor-pointer ${
              isAudioActive
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/90 border-white/15 text-slate-300 hover:text-white'
            }`}
            title="Toggle Alpine Wind & Chime Soundscape"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="hidden lg:inline">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden lg:inline">Audio Off</span>
              </>
            )}
          </button>

          {/* Expedition Emergency Hotline */}
          <a
            id="emergency-hotline-btn"
            href="tel:+919953262699"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-white/15 text-slate-200 hover:text-yellow-400 hover:border-yellow-400/40 text-xs sm:text-sm font-bold transition-all font-mono"
            title="Sankri & Dehradun Basecamp Hotline"
          >
            <Phone className="w-3.5 h-3.5 text-red-500" />
            <span>+91 9953262699</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-2xl bg-slate-900 border border-white/15 text-slate-200 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-3 p-5 rounded-3xl bg-slate-950/98 backdrop-blur-3xl border-2 border-white/20 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Mobile 3D Satellite Map Toggle */}
          {onToggleViewMode && (
            <button
              onClick={() => {
                onToggleViewMode(viewMode === 'panorama' ? 'earth3d' : 'panorama');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm uppercase tracking-wider font-['Rajdhani',sans-serif] flex items-center justify-between border border-yellow-400 shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-yellow-300" />
                <span>{viewMode === 'earth3d' ? 'Switch to 360° Ground Panorama' : 'Switch to 3D Google Earth Satellite Map'}</span>
              </div>
              <span className="text-xs bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-md font-mono">3D</span>
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id, item.target)}
                className={`w-full py-3 px-4 rounded-2xl text-left text-sm sm:text-base font-bold font-['Rajdhani',sans-serif] uppercase tracking-wider flex items-center justify-between transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border border-yellow-400/50'
                    : isActive
                    ? 'text-yellow-400 bg-white/15 border border-yellow-400/40'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-yellow-400" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && <Sparkles className="w-4 h-4 text-yellow-300" />}
              </button>
            );
          })}

          <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs sm:text-sm text-slate-300">
            <span>Basecamp Hotline:</span>
            <a href="tel:+919953262699" className="text-yellow-400 font-mono font-bold hover:underline">
              +91 9953262699
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
