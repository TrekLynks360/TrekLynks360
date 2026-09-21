import React, { useState } from 'react';
import { Trek, PanoramaScene } from '../../types';
import { TREKS_DATA, PANORAMA_SCENES } from '../../data/treksData';
import { 
  Mountain, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Search,
  Filter
} from 'lucide-react';

interface FeaturedTreksSectionProps {
  onSelectTrekForBooking: (trek: Trek) => void;
  onViewItinerary: (trek: Trek) => void;
  onExploreIn360: (scene: PanoramaScene) => void;
}

export const FeaturedTreksSection: React.FC<FeaturedTreksSectionProps> = ({
  onSelectTrekForBooking,
  onViewItinerary,
  onExploreIn360,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTreks = TREKS_DATA.filter((trek) => {
    const matchesSearch =
      trek.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trek.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trek.difficulty.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'winter') return trek.bestSeason.toLowerCase().includes('oct') || trek.bestSeason.toLowerCase().includes('dec') || trek.bestSeason.toLowerCase().includes('winter');
    if (selectedCategory === 'pass') return trek.name.toLowerCase().includes('pass') || trek.difficulty === 'Difficult';
    if (selectedCategory === 'valley') return trek.name.toLowerCase().includes('valley') || trek.name.toLowerCase().includes('dun') || trek.name.toLowerCase().includes('flowers');
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy-Moderate':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Difficult':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <section id="treks" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-950/90 text-slate-100 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider font-['Rajdhani',sans-serif]">
                Uttarakhand Expedition Roster 2026
              </span>
              <span className="text-xs text-yellow-400 font-mono font-bold">1:6 GUIDE RATIO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight">
              Featured Himalayan Treks
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
              Carefully engineered high-altitude routes chartered with 16+ years of Garhwal mountaineering wisdom. Every trek includes certified NIM expedition leaders, medical safety backup, and hot Garhwali meals.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
            <ShieldCheck className="w-6 h-6 text-yellow-400" />
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase">Guaranteed Departures</div>
              <div className="text-sm font-black text-white font-['Rajdhani',sans-serif]">
                Max 12 Trekkers Per Batch
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/70 border border-white/10 backdrop-blur-xl mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase font-['Rajdhani',sans-serif] tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Treks ({TREKS_DATA.length})
            </button>
            <button
              onClick={() => setSelectedCategory('winter')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase font-['Rajdhani',sans-serif] tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'winter'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Snow Summits
            </button>
            <button
              onClick={() => setSelectedCategory('pass')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase font-['Rajdhani',sans-serif] tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'pass'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              High Passes & Crossings
            </button>
            <button
              onClick={() => setSelectedCategory('valley')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black uppercase font-['Rajdhani',sans-serif] tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === 'valley'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Meadows & Lakes
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
        </div>

        {/* Treks Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTreks.map((trek) => {
            const matchedScene = PANORAMA_SCENES.find((s) => s.id === trek.panoramaSceneId) || PANORAMA_SCENES[0];
            return (
              <div
                key={trek.id}
                className="group relative rounded-3xl bg-slate-900/60 border border-white/15 overflow-hidden flex flex-col hover:border-yellow-400/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-300"
              >
                {/* Image Header with Altitude & Difficulty Badges */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                  <img
                    src={trek.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'}
                    alt={trek.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase font-['Rajdhani',sans-serif] border backdrop-blur-md ${getDifficultyColor(trek.difficulty)}`}>
                      {trek.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-yellow-400/40 text-yellow-300 text-xs font-mono font-bold backdrop-blur-md">
                      {trek.altitudeFt.toLocaleString()} FT / {trek.altitudeM} M
                    </span>
                  </div>

                  {/* Region & Departure */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                    <span className="flex items-center gap-1.5 drop-shadow">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {trek.region}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium drop-shadow">
                      <Calendar className="w-3.5 h-3.5" />
                      {trek.bestSeason}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white font-['Rajdhani',sans-serif] tracking-tight group-hover:text-yellow-400 transition-colors">
                      {trek.name}
                    </h3>
                    <p className="text-xs text-yellow-400/90 font-medium mt-1">
                      {trek.tagline}
                    </p>

                    <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                      {trek.overview}
                    </p>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-slate-950/60 border border-white/5 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Duration</div>
                        <div className="text-sm font-bold text-white font-['Rajdhani',sans-serif] mt-0.5">
                          {trek.durationDays} Days
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Max Altitude</div>
                        <div className="text-sm font-bold text-yellow-400 font-mono mt-0.5">
                          {trek.altitudeFt} ft
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Slots Left</div>
                        <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                          {trek.availableSlots} Seats
                        </div>
                      </div>
                    </div>

                    {/* Highlights Preview */}
                    <div className="mt-4 space-y-1.5">
                      {trek.highlights.slice(0, 2).map((hl, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-400">All-Inclusive from Basecamp</span>
                        <div className="text-2xl font-black text-white font-['Rajdhani',sans-serif]">
                          ₹{trek.priceInr.toLocaleString('en-IN')}{' '}
                          <span className="text-xs font-normal text-slate-400">/ person</span>
                        </div>
                      </div>

                      {/* 360 View Button */}
                      <button
                        onClick={() => onExploreIn360(matchedScene)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-yellow-300 text-xs font-bold font-['Rajdhani',sans-serif] uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
                        title="View this mountain in 360° interactive mode"
                      >
                        <Compass className="w-3.5 h-3.5 text-yellow-400" />
                        <span>360° View</span>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => onViewItinerary(trek)}
                        className="px-4 py-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold uppercase font-['Rajdhani',sans-serif] tracking-wider border border-white/15 transition-all text-center cursor-pointer"
                      >
                        View Itinerary
                      </button>

                      <button
                        onClick={() => onSelectTrekForBooking(trek)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold uppercase font-['Rajdhani',sans-serif] tracking-wider shadow-lg shadow-red-600/30 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Book Slot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
