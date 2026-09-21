import React, { useState } from 'react';
import { Calendar, Tag, ChevronRight, Users, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { TREKS_DATA } from '../data/treksData';
import { Trek } from '../types';

interface BookingPreviewCardProps {
  onViewDetails: (trek: Trek) => void;
  onBookNow: (trek: Trek) => void;
}

export const BookingPreviewCard: React.FC<BookingPreviewCardProps> = ({
  onViewDetails,
  onBookNow,
}) => {
  const [selectedTrekIndex, setSelectedTrekIndex] = useState(0);
  const currentTrek = TREKS_DATA[selectedTrekIndex];

  const nextTrek = () => {
    setSelectedTrekIndex((prev) => (prev + 1) % TREKS_DATA.length);
  };

  const prevTrek = () => {
    setSelectedTrekIndex((prev) => (prev - 1 + TREKS_DATA.length) % TREKS_DATA.length);
  };

  return (
    <div
      id="booking-preview-card"
      className="pointer-events-auto group relative w-80 sm:w-96 rounded-3xl p-5 sm:p-6 bg-slate-950/85 backdrop-blur-2xl border-2 border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.75)] hover:border-yellow-400/60 transition-all duration-300 hover:shadow-yellow-400/15 hover:-translate-y-1"
    >
      {/* 3D Glass Light Glint */}
      <div className="absolute top-0 inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

      {/* Card Header with Category & Slider Toggle */}
      <div className="flex items-center justify-between -mt-1 mb-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider shadow font-['Rajdhani',sans-serif]">
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>Next Trek: {currentTrek.name.split('&')[0].trim()}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={prevTrek}
            className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center text-xs font-bold border border-white/15"
            title="Previous Trek Preview"
          >
            ‹
          </button>
          <span className="text-xs text-slate-300 font-mono font-bold">
            {selectedTrekIndex + 1}/{TREKS_DATA.length}
          </span>
          <button
            onClick={nextTrek}
            className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center text-xs font-bold border border-white/15"
            title="Next Trek Preview"
          >
            ›
          </button>
        </div>
      </div>

      {/* Trek Title & Elevation */}
      <div className="mt-1">
        <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug group-hover:text-yellow-300 transition-colors">
          {currentTrek.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-xs sm:text-sm text-slate-200">
          <span className="flex items-center gap-1 text-yellow-400 font-bold font-['Rajdhani',sans-serif]">
            <MapPin className="w-3.5 h-3.5" />
            {currentTrek.region}
          </span>
          <span>•</span>
          <span className="font-mono text-emerald-400 font-bold">{currentTrek.altitudeFt.toLocaleString()} FT</span>
        </div>
      </div>

      {/* Details Box: Dates & Price */}
      <div className="mt-3.5 p-4 rounded-2xl bg-slate-900/90 border border-white/15 space-y-2.5 text-xs sm:text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-yellow-400" />
            Dates:
          </span>
          <span className="font-bold text-white tracking-tight">
            {currentTrek.nextDeparture}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-slate-300 flex items-center gap-1.5 font-medium">
            <Tag className="w-4 h-4 text-red-400" />
            Price:
          </span>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-black text-yellow-400 font-['Rajdhani',sans-serif]">
              ₹{currentTrek.priceInr.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1">/ trekker</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1.5">
          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
            <Users className="w-3.5 h-3.5" />
            {currentTrek.availableSlots} slots left
          </span>
          <span className="text-slate-300 font-mono font-medium">
            {currentTrek.durationDays} Days / {currentTrek.durationDays - 1} Nights
          </span>
        </div>
      </div>

      {/* Action Buttons: View Details & Book Slot */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          id="preview-view-details-btn"
          onClick={() => onViewDetails(currentTrek)}
          className="py-3 px-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1 border border-white/15 transition-all font-['Rajdhani',sans-serif] tracking-wider uppercase"
        >
          <span>View Details</span>
        </button>

        <button
          id="preview-book-slot-btn"
          onClick={() => onBookNow(currentTrek)}
          className="py-3 px-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 border border-yellow-400/50 shadow-lg shadow-red-600/30 transition-all font-['Rajdhani',sans-serif] tracking-wider uppercase active:scale-95"
        >
          <span>Book Slot</span>
          <ArrowRight className="w-4 h-4 text-yellow-300" />
        </button>
      </div>
    </div>
  );
};
