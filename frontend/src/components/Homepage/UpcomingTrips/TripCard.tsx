"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Star } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Trip, TripPreview } from "@/types/trip";
import { RootState } from "@/store/store";
import { wishlistService } from "@/services/wishlistService";
import { formatPrice, fixImageUrl } from "@/lib/utils/formatters";
import AnimatedCard from "@/components/shared/AnimatedCard";

interface TripCardProps {
  trip: Trip | TripPreview | any;
  layout?: "vertical" | "horizontal";
  fullWidth?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ trip, layout = "vertical", fullWidth = false }) => {
  const isHorizontal = layout === "horizontal";
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const tripId = trip?.id || trip?.id || "temp-id";
  const slug = trip?.slug || tripId;

  useEffect(() => {
    if (isAuthenticated && tripId !== "temp-id") {
      const checkStatus = async () => {
        try {
          const status = await wishlistService.checkStatus(tripId);
          setIsLiked(status);
        } catch (error) {
          console.error("Error checking wishlist status:", error);
        }
      };
      checkStatus();
    }
  }, [isAuthenticated, tripId]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save trips");
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    try {
      const result = await wishlistService.toggleWishlist(tripId);
      setIsLiked(result.added);
      toast.success(result.added ? "Added to wishlist" : "Removed from wishlist");
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Wishlist toggle error:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Helper to get primary image
  const displayImageRaw = (trip?.thumbnail?.url && trip.thumbnail.url.trim() !== "") 
    ? trip.thumbnail.url 
    : (trip?.images && trip.images[0]?.url && trip.images[0].url.trim() !== "") 
      ? trip.images[0].url 
      : (typeof trip?.images?.[0] === 'string' && trip.images[0].trim() !== "")
        ? trip.images[0]
        : "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=1200";
        
  const displayImage = fixImageUrl(displayImageRaw);

  // Format dates for display (up to 3 dates)
  const renderDates = () => {
    if (!trip?.dates || trip.dates.length === 0) return "Dates to be announced";
    
    // Detailed structure
    if (typeof trip.dates[0] === 'object' && trip.dates[0].startDate) {
      return trip.dates.slice(0, 3).map((d: any) => {
        const date = new Date(d.startDate);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      }).join(', ');
    }
    
    // Array of strings
    if (typeof trip.dates[0] === 'string') {
      return trip.dates.slice(0, 3).join(', ');
    }
    
    return "Dates to be announced";
  };

  // Compute the lowest occupancy tier price (#32)
  const getLowestPrice = () => {
    const tiers = trip?.pricing?.tiers || trip?.pricingTiers || [];
    if (tiers.length > 0) {
      const amounts = tiers.map((t: any) => t.amount || t.price || 0).filter(Boolean);
      if (amounts.length > 0) return Math.min(...amounts);
    }
    return trip?.price?.amount || trip?.currentPrice || 0;
  };
  const hasOccupancyTiers = (trip?.pricing?.tiers?.length > 0 || trip?.pricingTiers?.length > 0);
  const currentPrice = getLowestPrice();
  const originalPrice = trip?.originalPrice || (currentPrice ? currentPrice + 3000 : 0);
  const discountAmount = originalPrice - currentPrice;


  const tripCategories = Array.isArray(trip?.category) 
    ? trip.category 
    : typeof trip?.category === 'string' 
      ? trip.category.split(',').map((c: string) => c.trim()).filter(Boolean) 
      : [];

  return (
    <Link href={`/trips/${slug}`} className="contents" id={`trip-card-${tripId}`}>
      <AnimatedCard className={`group flex flex-col ${fullWidth ? 'w-full h-full' : 'shrink-0 w-[78vw] xs:w-[260px] sm:w-[280px]'}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden shrink-0 w-full aspect-[4/3]">
          <Image
            src={displayImage}
            alt={trip?.title || "Trip Image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 300px"
          />

          {/* Free Goodies Badge */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
            style={{
              background: "rgba(0, 0, 0, 0.75)",
              color: "#fff",
              backdropFilter: "blur(4px)",
              fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
            }}
          >
            Free Goodies
            <span className="text-xs">🎁</span>
          </div>

          {/* Heart Icon Button */}
          <button
            onClick={handleToggleWishlist}
            disabled={isLiking}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 backdrop-blur-md ${
              isLiked 
                ? "bg-red-50 text-red-500" 
                : "bg-black/20 text-white hover:bg-black/40"
            }`}
            style={{ zIndex: 10 }}
          >
            <Heart 
              size={16} 
              fill={isLiked ? "currentColor" : "none"} 
              className={`${isLiking ? "animate-pulse" : ""}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center flex-grow p-4 pt-3.5">
          {/* Duration */}
          <div
            className="flex items-center gap-1 text-[12px] mb-1.5"
            style={{
              color: "#5e5e5e",
              fontFamily: "var(--font-vietnam), 'Be Vietnam Pro', sans-serif",
            }}
          >
            <svg
              className="w-3.5 h-3.5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {trip?.durationNights || trip?.duration?.nights || trip?.nights || 0} nights / {trip?.durationDays || trip?.duration?.days || trip?.days || 0} days
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-bold leading-snug mb-1.5 line-clamp-2 text-[14px] min-h-[40px]"
            style={{
              color: "#191c1d",
              fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
            }}
          >
            {trip?.title}
          </h3>

          {/* Base City */}
          {trip?.location?.city && (
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mb-2.5">
              <MapPin className="w-3 h-3" />
              <span>{trip.location.city}</span>
            </div>
          )}

          {/* Tags (Category & Difficulty) */}
          {(tripCategories.length > 0 || (trip?.difficulty && trip.difficulty !== 'none')) && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {tripCategories.slice(0, 2).map((cat: string) => (
                <span key={cat} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                  {cat}
                </span>
              ))}
              {tripCategories.length > 2 && (
                <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-gray-100">
                  +{tripCategories.length - 2}
                </span>
              )}
              {trip?.difficulty && trip.difficulty !== 'none' && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                  {trip.difficulty}
                </span>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-3 flex-wrap">
            {hasOccupancyTiers && (
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Starting from</span>
            )}
            <span
              className="text-[16px] font-extrabold"
              style={{
                color: "#191c1d",
                fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
              }}
            >
              {formatPrice(currentPrice)}
            </span>
            {originalPrice > currentPrice && (
              <>
                <span
                  className="text-[12px] line-through"
                  style={{ color: "#9e9e9e" }}
                >
                  {formatPrice(originalPrice)}
                </span>
                <span
                  className="text-[11px] font-bold"
                  style={{ color: "#e65100" }}
                >
                  {formatPrice(discountAmount)} Off
                </span>
              </>
            )}
          </div>

          {/* Dates */}
          <div
            className="flex items-start gap-1.5 text-[11px]"
            style={{
              color: "#5e5e5e",
              fontFamily: "var(--font-vietnam), 'Be Vietnam Pro', sans-serif",
            }}
          >
            <svg
              className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="leading-relaxed">
              {renderDates()}
            </span>
          </div>

          {/* Organizer */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div 
              className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-gray-50/80 border border-transparent"
            >
              <div className="flex items-center gap-1.5 overflow-hidden flex-1 pr-2">
                {(trip?.vendor?.logo?.url || trip?.vendor?.logo || trip?.vendor?.user?.avatar?.url || trip?.vendor?.user?.avatar) ? (
                  <img 
                    src={fixImageUrl(trip?.vendor?.logo?.url || trip?.vendor?.logo || trip?.vendor?.user?.avatar?.url || trip?.vendor?.user?.avatar)} 
                    alt="Vendor Logo" 
                    className="shrink-0 w-5 h-5 rounded-full object-cover shadow-sm bg-white border border-gray-100" 
                  />
                ) : (
                  <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-[10px] shadow-sm">🏢</span>
                )}
                <span 
                  className="text-[11px] text-gray-500 truncate"
                  style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                >
                  By <span className="font-bold text-gray-900 tracking-wide">{trip?.vendor?.user?.name || trip?.vendor?.businessName || 'TripDekho'}</span>
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2 border-l border-gray-200 pl-2">
                <Star size={10} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-black text-gray-700">
                  {trip.stats?.reviews > 0 ? trip.stats.rating.toFixed(1) : 'New'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </Link>
  );
};



export default TripCard;
