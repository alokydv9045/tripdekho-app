"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, ShieldCheck, CreditCard } from "lucide-react";
import PrimaryButton from "../shared/PrimaryButton";

interface BookingSummaryProps {
  trip: any;
  numberOfGuests: number;
  selectedDate: string;
  totalAmount: number;
  basePrice: number;
  platformFee: number;
  discount?: number;
  availablePoints?: number;
  pointsToRedeem?: number;
  onPointsChange?: (points: number) => void;
  isLoading: boolean;
  onConfirm: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2
  }).format(amount);
};

const BookingSummary: React.FC<BookingSummaryProps> = ({
  trip,
  numberOfGuests,
  selectedDate,
  totalAmount,
  basePrice,
  platformFee,
  discount = 0,
  availablePoints = 0,
  pointsToRedeem = 0,
  onPointsChange,
  isLoading,
  onConfirm
}) => {
  if (!trip) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden sticky top-24">
      {/* Trip Information */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex gap-4 mb-4">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
            <Image
              src={trip.thumbnail?.url || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"}
              alt={trip.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 line-clamp-2 leading-tight mb-1">
              {trip.title}
            </h3>
            <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">
              {trip.location?.city}, {trip.location?.country}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-extrabold text-gray-500 rounded uppercase tracking-widest">
                {trip.durationDays || trip.duration?.days}D / {trip.durationNights || trip.duration?.nights}N
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 py-4 border-t border-gray-50 mt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-gray-500 uppercase tracking-wide text-xs">Trip Date</span>
            <span className="font-extrabold text-gray-900">{new Date(selectedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-gray-500 uppercase tracking-wide text-xs">Total Guests</span>
            <span className="font-extrabold text-gray-900">{numberOfGuests} Adults</span>
          </div>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="p-6 bg-gray-50">
        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">Price Breakdown</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-gray-600">Base Price ({numberOfGuests} x ₹{formatCurrency(trip.price?.amount || 0)})</span>
            <span className="font-extrabold text-gray-900">₹{formatCurrency(basePrice)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-gray-600">Platform Fee</span>
            <span className="font-extrabold text-gray-900">₹{formatCurrency(platformFee)}</span>
          </div>

          {/* Wander Points Redemption */}
          {availablePoints > 0 && onPointsChange && (
            <div className="pt-3 mt-3 border-t border-dashed border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center">✨</span>
                  Wander Points
                </span>
                <span className="text-xs font-bold text-gray-500">Balance: {availablePoints}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={Math.min(availablePoints, basePrice + platformFee)}
                  value={pointsToRedeem || ""}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onPointsChange(Math.min(val, availablePoints, basePrice + platformFee));
                  }}
                  className="flex-1 h-10 px-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:border-amber-400 focus:ring-2 focus:ring-amber-50 outline-none"
                  placeholder="Points to redeem"
                />
                <button
                  type="button"
                  onClick={() => onPointsChange(Math.min(availablePoints, basePrice + platformFee))}
                  className="px-4 h-10 bg-amber-50 text-amber-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-amber-100 transition-colors"
                >
                  Max
                </button>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-sm mt-3 text-green-600">
                  <span className="font-bold">Points Applied</span>
                  <span className="font-extrabold">-₹{formatCurrency(discount)}</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 mt-4 flex justify-between items-center">
            <span className="text-base font-extrabold text-gray-900 uppercase">Total Amount</span>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-black text-amber-500 leading-none">₹{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <PrimaryButton
          fullWidth
          className="mt-8 h-14 text-base font-black shadow-lg shadow-amber-200 group relative overflow-hidden"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-3 justify-center">
              Confirm & Pay <CreditCard className="w-5 h-5" />
            </span>
          )}
        </PrimaryButton>

        {/* Security / Info */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 p-3 bg-white/50 border border-white rounded-xl shadow-sm">
            <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-[11px] font-bold text-gray-500 leading-tight">
              Secure checkout process with end-to-end encryption.
            </p>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/50 border border-white rounded-xl shadow-sm">
            <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-[11px] font-bold text-gray-500 leading-tight">
              By confirming, you agree to our <Link href="/terms" className="text-amber-600 underline hover:text-amber-700 transition-colors cursor-pointer">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
