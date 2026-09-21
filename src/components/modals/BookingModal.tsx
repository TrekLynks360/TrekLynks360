import React, { useState } from 'react';
import { X, Calendar, Users, Shield, CheckCircle, Sparkles, CreditCard, ArrowRight, Mountain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TREKS_DATA } from '../../data/treksData';
import { Trek } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTrek?: Trek | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedTrek,
}) => {
  const [selectedTrekId, setSelectedTrekId] = useState<string>(
    preselectedTrek?.id || TREKS_DATA[0].id
  );
  const [trekkersCount, setTrekkersCount] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('2026-07-12');
  const [includeRentalGear, setIncludeRentalGear] = useState<boolean>(true);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);

  const [leadName, setLeadName] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [medicalFitness, setMedicalFitness] = useState<boolean>(true);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  if (!isOpen) return null;

  const trek = TREKS_DATA.find((t) => t.id === selectedTrekId) || TREKS_DATA[0];

  const basePrice = trek.priceInr * trekkersCount;
  const gearAddon = includeRentalGear ? 1200 * trekkersCount : 0;
  const insuranceAddon = includeInsurance ? 450 * trekkersCount : 0;
  const groupDiscount = trekkersCount >= 3 ? Math.round(basePrice * 0.1) : 0;
  const totalAmount = basePrice + gearAddon + insuranceAddon - groupDiscount;

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    const ref = `TL360-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setIsSuccess(true);

    // Fire joyful celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#facc15', '#ffffff', '#10b981'],
      });
    } catch {
      // ignore
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      id="booking-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] rounded-3xl bg-slate-950 border border-white/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-['Rajdhani',sans-serif] uppercase tracking-tight">
                Expedition Reservation Desk
              </h2>
              <p className="text-xs text-slate-400">Direct bookings verified by Jiten Bhatt & Lead Guides</p>
            </div>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                BOOKING CONFIRMED: {bookingRef}
              </div>

              <h3 className="text-2xl font-black text-white font-['Rajdhani',sans-serif]">
                Namaste, {leadName}! You’re Heading To The Himalayas.
              </h3>

              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Your reservation for <strong className="text-white">{trek.name}</strong> has been received. Jiten Bhatt and the basecamp operations team have blocked your slots.
              </p>

              <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Expedition:</span>
                  <span className="font-bold text-white">{trek.name}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Departure:</span>
                  <span className="font-bold text-yellow-400">{selectedDate}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Trekkers:</span>
                  <span className="font-bold text-white">{trekkersCount} person(s)</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-2 border-t border-white/10">
                  <span>Total Amount:</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xs uppercase tracking-wider font-['Rajdhani',sans-serif]"
                >
                  Return to 360° Explorer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCompleteBooking} className="space-y-6">
              {/* Step 1: Trek Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-['Rajdhani',sans-serif]">
                  1. Select Uttarakhand Trek
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TREKS_DATA.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTrekId(t.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedTrekId === t.id
                          ? 'bg-red-950/40 border-yellow-400 shadow-md ring-1 ring-yellow-400/50'
                          : 'bg-slate-900/60 border-white/10 hover:border-white/20 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">{t.name.split('&')[0]}</span>
                        <span className="text-xs font-mono font-bold text-yellow-400">
                          ₹{t.priceInr.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>{t.altitudeFt.toLocaleString()} FT</span>
                        <span>•</span>
                        <span>{t.durationDays} Days</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date & Trekkers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-['Rajdhani',sans-serif]">
                    2. Departure Batch Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-['Rajdhani',sans-serif]">
                    3. Group Size (Trekkers)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 6, 8].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setTrekkersCount(count)}
                        className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                          trekkersCount === count
                            ? 'bg-yellow-400 text-slate-950 font-black'
                            : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Add-ons & Expeditions Safety */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-['Rajdhani',sans-serif]">
                  Gear & High-Altitude Safety Add-ons
                </span>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeRentalGear}
                      onChange={(e) => setIncludeRentalGear(e.target.checked)}
                      className="rounded accent-red-600"
                    />
                    <span>Alpine Gear Rental (Microspikes, Trekking Poles, -10°C Sleeping Bag)</span>
                  </div>
                  <span className="font-mono text-yellow-400 font-bold">+₹1,200/person</span>
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeInsurance}
                      onChange={(e) => setIncludeInsurance(e.target.checked)}
                      className="rounded accent-red-600"
                    />
                    <span>High-Altitude Medical & Heli-Evac Insurance Cover</span>
                  </div>
                  <span className="font-mono text-yellow-400 font-bold">+₹450/person</span>
                </label>
              </div>

              {/* Step 4: Trekker Contact Details */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-['Rajdhani',sans-serif]">
                  4. Lead Trekker Information
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    required
                    className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile / WhatsApp *"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    required
                    className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Price Summary & Submit */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">Grand Total (Inclusive of Taxes)</div>
                  <div className="text-2xl font-black text-yellow-400 font-['Rajdhani',sans-serif]">
                    ₹{totalAmount.toLocaleString()}
                  </div>
                  {groupDiscount > 0 && (
                    <div className="text-[10px] text-emerald-400 font-medium">
                      ✓ Group discount of ₹{groupDiscount.toLocaleString()} applied
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider font-['Rajdhani',sans-serif] shadow-lg shadow-red-600/30 border border-yellow-400/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>Confirm Reservation</span>
                  <ArrowRight className="w-4 h-4 text-yellow-300" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
