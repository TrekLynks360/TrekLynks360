import React, { useState, useRef, useCallback } from 'react';
import { PANORAMA_SCENES, TREKS_DATA } from './data/treksData';
import { PanoramaScene, Hotspot, Trek } from './types';
import { Panorama360Viewer } from './components/Panorama360Viewer';
import { GoogleEarth3DMap } from './components/GoogleEarth3DMap';
import { Navbar } from './components/Navbar';
import { HeroContent } from './components/HeroContent';
import { BookingPreviewCard } from './components/BookingPreviewCard';
import { ControlRing360 } from './components/ControlRing360';
import { InteractivityHint } from './components/InteractivityHint';
import { PeakWeatherWidget } from './components/PeakWeatherWidget';

// Website Sections
import { FeaturedTreksSection } from './components/website/FeaturedTreksSection';
import { Interactive3DSection } from './components/website/Interactive3DSection';
import { MeetFounderSection } from './components/website/MeetFounderSection';
import { TeamSection } from './components/website/TeamSection';
import { SafetySection } from './components/website/SafetySection';
import { GallerySection } from './components/website/GallerySection';
import { BookingInquirySection } from './components/website/BookingInquirySection';
import { WebsiteFooter } from './components/website/WebsiteFooter';

// Modals
import { TreksModal } from './components/modals/TreksModal';
import { BookingModal } from './components/modals/BookingModal';
import { FounderModal } from './components/modals/FounderModal';
import { TeamModal } from './components/modals/TeamModal';
import { GalleryModal } from './components/modals/GalleryModal';
import { ContactModal } from './components/modals/ContactModal';

import { 
  Eye, 
  EyeOff, 
  Globe, 
  ShieldCheck, 
  Award, 
  Users, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  Sparkles,
  ArrowRight,
  Compass
} from 'lucide-react';

export default function App() {
  const [activeScene, setActiveScene] = useState<PanoramaScene>(PANORAMA_SCENES[0]);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [currentHeading, setCurrentHeading] = useState<number>(180);
  const [currentPitch, setCurrentPitch] = useState<number>(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // View Mode for Hero: 'panorama' (360 ground sphere) or 'earth3d' (interactive Google Earth 3D terrain)
  const [viewMode, setViewMode] = useState<'panorama' | 'earth3d'>('panorama');

  // Active Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeModal, setActiveModal] = useState<
    'none' | 'our-treks' | 'book-now' | 'about-us' | 'team' | 'gallery-360' | 'contact'
  >('none');

  const [bookingTargetTrek, setBookingTargetTrek] = useState<Trek | null>(null);
  const [isCleanHudMode, setIsCleanHudMode] = useState<boolean>(false);

  // Turn to heading ref connecting ControlRing with Panorama360Viewer
  const targetHeadingRef = useRef<((heading: number, pitch?: number) => void) | null>(null);

  const handleHeadingChange = useCallback((heading: number, pitch: number) => {
    setCurrentHeading(heading);
    setCurrentPitch(pitch);
  }, []);

  const handleRotateToHeading = (deg: number) => {
    if (targetHeadingRef.current) {
      targetHeadingRef.current(deg, 0);
    }
  };

  const handleToggleTheme = (theme: 'daylight' | 'golden' | 'twilight') => {
    setActiveScene((prev) => ({
      ...prev,
      skyTheme: theme,
    }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      scrollToSection('hero');
    } else if (tab === 'our-treks') {
      scrollToSection('treks');
    } else if (tab === '3d-explorer') {
      scrollToSection('3d-explorer');
    } else if (tab === 'about-us') {
      scrollToSection('founder');
    } else if (tab === 'team') {
      scrollToSection('team');
    } else if (tab === 'safety') {
      scrollToSection('safety');
    } else if (tab === 'gallery-360') {
      scrollToSection('gallery');
    } else if (tab === 'book-now') {
      scrollToSection('booking');
    } else if (tab === 'contact') {
      scrollToSection('contact');
    }
  };

  const handleOpenBookingForTrek = (trek: Trek) => {
    setBookingTargetTrek(trek);
    setActiveModal('book-now');
  };

  const handleViewItinerary = (trek: Trek) => {
    setBookingTargetTrek(trek);
    setActiveModal('our-treks');
  };

  const handleViewTrekIn360 = (scene: PanoramaScene) => {
    setActiveScene(scene);
    setViewMode('panorama');
    scrollToSection('hero');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-yellow-400 selection:text-slate-950 overflow-x-hidden">
      {/* 1. Modern Sticky Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* 2. Hero Interactive Stage (360° Panorama or 3D Google Earth Satellite) */}
      <section id="hero" className="relative w-full h-screen min-h-[700px] overflow-hidden bg-slate-950 select-none">
        {/* Viewport Engine */}
        {viewMode === 'earth3d' ? (
          <div className="absolute inset-0 z-0">
            <GoogleEarth3DMap
              onSelectTrekForBooking={handleOpenBookingForTrek}
              onSwitchToPanorama={() => setViewMode('panorama')}
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0">
            <Panorama360Viewer
              scene={activeScene}
              isAutoRotate={isAutoRotate}
              onHeadingChange={handleHeadingChange}
              onSelectHotspot={setActiveHotspot}
              activeHotspot={activeHotspot}
              targetHeadingRef={targetHeadingRef}
            />
          </div>
        )}

        {/* Hero Interactive UI Layer */}
        {viewMode === 'panorama' && (
          <div
            id="hero-3d-interactive-stage"
            className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between pt-24 pb-4 px-4 sm:px-6 lg:px-8"
          >
            {/* Top Hint Bar & Clean View Toggle */}
            <div className="w-full flex items-center justify-between pointer-events-auto gap-3">
              {/* Real-Time Himalayan Peak Weather Widget */}
              <div className="flex items-center gap-2.5">
                <PeakWeatherWidget scene={activeScene} />
                <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/75 backdrop-blur-xl border border-white/15 text-xs text-slate-200 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-['Rajdhani',sans-serif] font-bold text-yellow-400 uppercase tracking-wider">
                    360° View
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="font-mono text-slate-100 font-semibold truncate max-w-[200px]">{activeScene.location}</span>
                </div>
              </div>

              {/* Interactivity Hint in Center */}
              <div className="hidden sm:block mx-auto">
                <InteractivityHint isVisible={!isCleanHudMode} />
              </div>

              {/* Quick Actions: Switch to 3D Earth & Clean View / HUD Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="switch-to-earth-pill"
                  onClick={() => setViewMode('earth3d')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 backdrop-blur-xl border border-emerald-400/50 text-emerald-300 hover:text-white text-xs font-bold font-['Rajdhani',sans-serif] tracking-wider uppercase transition-all shadow-lg cursor-pointer"
                  title="Launch 3D Google Earth Satellite Map"
                >
                  <Globe className="w-3.5 h-3.5 text-yellow-400" />
                  <span>3D Satellite Map</span>
                </button>

                <button
                  id="toggle-hud-mode-btn"
                  onClick={() => setIsCleanHudMode(!isCleanHudMode)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl border border-white/15 text-slate-200 hover:text-white text-xs font-['Rajdhani',sans-serif] font-bold tracking-wider uppercase transition-all shadow-lg cursor-pointer"
                  title="Toggle Unobstructed 360 Panoramic Mode"
                >
                  {isCleanHudMode ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Show UI</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">Clean 360° View</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Center Stage: Hero Text + Right Floating Booking Card */}
            <div className="flex-1 flex flex-col justify-center items-center my-2 w-full">
              {!isCleanHudMode ? (
                <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
                  {/* Center Main Heading & 3D CTA Buttons */}
                  <div className="flex-1 flex justify-center w-full">
                    <HeroContent
                      onExploreTreks={() => scrollToSection('treks')}
                      onOpenBooking={() => scrollToSection('booking')}
                      onOpen3DEarth={() => scrollToSection('3d-explorer')}
                    />
                  </div>

                  {/* Right Floating Card: Booking Preview Card */}
                  <div className="flex justify-center lg:justify-end w-full lg:w-auto shrink-0">
                    <BookingPreviewCard
                      onViewDetails={() => scrollToSection('treks')}
                      onBookNow={(trek) => handleOpenBookingForTrek(trek)}
                    />
                  </div>
                </div>
              ) : (
                <div className="pointer-events-none text-center p-5 rounded-3xl bg-slate-950/60 backdrop-blur-md border border-white/15 max-w-md shadow-2xl">
                  <span className="text-xs font-['Rajdhani',sans-serif] font-black uppercase text-yellow-400 tracking-widest block">
                    IMMERSIVE PANORAMIC MODE ACTIVE
                  </span>
                  <p className="text-sm text-slate-200 mt-1.5 font-medium">
                    Drag anywhere to explore 360°. Scroll down to view all treks, team, and booking.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Curved UI Overlay or "Control Ring" */}
            <div className="w-full flex flex-col items-center gap-2 mt-auto pointer-events-auto">
              <ControlRing360
                currentHeading={currentHeading}
                currentPitch={currentPitch}
                isAutoRotate={isAutoRotate}
                onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
                activeScene={activeScene}
                onSelectScene={setActiveScene}
                onRotateToHeading={handleRotateToHeading}
                onToggleTheme={handleToggleTheme}
              />

              {/* Scroll Down Invitation Pill */}
              <button
                onClick={() => scrollToSection('trust-strip')}
                className="mt-1 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-slate-300 hover:text-yellow-400 text-xs font-['Rajdhani',sans-serif] uppercase font-bold tracking-wider transition-all shadow-lg cursor-pointer"
              >
                <span>Scroll Down For Website Details</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce text-yellow-400" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3. Trust & Accreditations Ribbon Strip */}
      <div id="trust-strip" className="relative z-20 py-6 px-4 sm:px-6 lg:px-8 bg-slate-900 border-y border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-center">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            <div className="text-left">
              <div className="text-sm font-black text-white font-['Rajdhani',sans-serif]">7+ Years Experience</div>
              <div className="text-xs text-slate-400">Garhwal Himalayas Pioneer</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="text-left">
              <div className="text-sm font-black text-white font-['Rajdhani',sans-serif]">Strict 1:6 Guide Ratio</div>
              <div className="text-xs text-slate-400">Max 12 Trekkers Per Batch</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div className="text-left">
              <div className="text-sm font-black text-white font-['Rajdhani',sans-serif]">100% Zero-Loss Record</div>
              <div className="text-xs text-slate-400">NIM Certified Leadership</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div className="text-left">
              <div className="text-sm font-black text-white font-['Rajdhani',sans-serif]">Dehradun Logistics HQ</div>
              <div className="text-xs text-slate-400">Tarun Vihar Bangali Kothi</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Featured Himalayan Treks Section */}
      <FeaturedTreksSection
        onSelectTrekForBooking={handleOpenBookingForTrek}
        onViewItinerary={handleViewItinerary}
        onExploreIn360={handleViewTrekIn360}
      />

      {/* 5. Interactive 3D Satellite Map & 360° Explorer Section */}
      <Interactive3DSection
        onSelectTrekForBooking={handleOpenBookingForTrek}
        activeScene={activeScene}
        onSelectScene={setActiveScene}
      />

      {/* 6. Meet The Founder Section (Jiten Bhatt) */}
      <MeetFounderSection
        onOpenBooking={() => scrollToSection('booking')}
      />

      {/* 7. Expedition Leaders & Technical Guides Section (Jiten Bhatt & Pradeep) */}
      <TeamSection />

      {/* 8. Uncompromising Safety Architecture Section */}
      <SafetySection />

      {/* 9. Himalayan Visual Archive (360° Gallery) */}
      <GallerySection
        onExploreIn360={handleViewTrekIn360}
      />

      {/* 10. Direct Basecamp Reservations & Inquiries Form */}
      <BookingInquirySection />

      {/* 11. Full Website Footer with Dehradun Logistics & Sankri Basecamp Details */}
      <WebsiteFooter />

      {/* Interactive Modals (for detailed day-by-day views and instant popups) */}
      <TreksModal
        isOpen={activeModal === 'our-treks'}
        onClose={() => {
          setActiveModal('none');
          setActiveTab('home');
        }}
        onSelectTrekForBooking={handleOpenBookingForTrek}
        onViewTrekIn360={handleViewTrekIn360}
      />

      <BookingModal
        isOpen={activeModal === 'book-now'}
        onClose={() => {
          setActiveModal('none');
          setActiveTab('home');
        }}
        preselectedTrek={bookingTargetTrek}
      />

      <FounderModal
        isOpen={activeModal === 'about-us'}
        onClose={() => {
          setActiveModal('none');
          setActiveTab('home');
        }}
        onBookWithFounder={() => {
          setBookingTargetTrek(TREKS_DATA[0]);
          setActiveModal('book-now');
        }}
      />

      <TeamModal
        isOpen={activeModal === 'team'}
        onClose={() => {
          setActiveModal('none');
          setActiveTab('home');
        }}
      />

      <GalleryModal
        isOpen={activeModal === 'gallery-360'}
        onClose={() => {
          setActiveModal('none');
          setActiveTab('home');
        }}
        activeScene={activeScene}
        onSelectScene={setActiveScene}
      />

      <ContactModal
        isOpen={activeModal === 'contact'}
        onClose={() => {
          setActiveModal('none');
          setActiveTab('home');
        }}
      />
    </div>
  );
}
