"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { tripService } from "@/services/index";
import { reviewService } from "@/services/reviewService";
import Header from "@/components/Header";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ReviewForm from "@/components/Trips/ReviewForm";
import {
  Check, X, MapPin, Clock, Users, Calendar,
  ChevronDown, Star, ShieldCheck,
  Heart, Phone, Share2, MessageSquare,
  Navigation, AlertCircle,
  ChevronRight, Download, Smartphone,
  Minus, Plus as PlusIcon, CheckCircle2, Circle,
  Plane, BaggageClaim, Compass, Camera, Tent, Sun, Palmtree, Map as MapIcon
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAppSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import { openAuthModal } from "@/store/slices/authSlice";
import SectionReveal from "@/components/shared/SectionReveal";
import SplitReveal from "@/components/shared/SplitReveal";
import WeatherWidget from "@/components/shared/WeatherWidget";
import { fixImageUrl } from "@/lib/utils/formatters";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [occupancySelection, setOccupancySelection] = useState<Record<string, number>>({});
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");

  const { user } = useAppSelector((state) => state.auth);

  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 500], [0, 150]);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await tripService.getTripById(params.slug as string);
        const tripData = data?.data || data;
        setTrip(tripData);

        if (tripData?.id) {
          try {
            const reviewsRes = await reviewService.getReviewsByTrip(tripData.id);
            setReviews(reviewsRes?.data?.reviews || []);
          } catch (err) {
            console.error("Failed to fetch reviews", err);
          } finally {
            setReviewsLoading(false);
          }
        } else {
          setReviewsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch trip details", error);
        setReviewsLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchTrip();
    }
  }, [params.slug]);

  if (loading) return <PremiumLoader />;

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Trip Not Found</h2>
        <p className="text-gray-500 mb-6 text-center font-medium">Sorry, we couldn&apos;t find the trip you&apos;re looking for.</p>
        <PrimaryButton onClick={() => router.push("/trips")}>Browse All Trips</PrimaryButton>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const heroImage = fixImageUrl(trip.thumbnail?.url || trip.media?.[0]?.url) || "/mountains.png";
  const tripDates = trip.dates || [];
  const itinerary = trip.itinerary || [];
  const sortedItinerary = [...itinerary].sort((a: any, b: any) => (a.dayNumber || a.day || 0) - (b.dayNumber || b.day || 0));

  // Extract unique months for the dropdown
  const availableMonths = Array.from(new Set(tripDates.map((d: any) => {
    const date = new Date(d.startDate);
    return date.toLocaleString('default', { month: 'short' }) + "'" + date.getFullYear().toString().slice(-2);
  })));

  const currentSelectedMonth = selectedMonth || availableMonths[0] || "All";

  return (
    <div className="bg-[#FFFBF0] min-h-screen font-sans selection:bg-amber-100 selection:text-amber-900 relative">
      {/* Subtle decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-48 w-[800px] h-[800px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
        />
      </div>

      {/* Floating Icons from Hero Theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[12%] left-[8%] animate-fade-in-up delay-300">
          <Plane className="w-8 h-8 md:w-14 md:h-14 rotate-[15deg] opacity-50 text-[#d97706] animate-float-fast" />
        </div>
        <div className="absolute top-[55%] left-[4%] animate-fade-in-left delay-500">
          <BaggageClaim className="w-6 h-6 md:w-10 md:h-10 -rotate-12 opacity-40 text-[#d97706] animate-float-slow" />
        </div>
        <div className="absolute top-[25%] left-[25%] animate-fade-in-up delay-400">
          <Compass className="w-10 h-10 md:w-16 md:h-16 rotate-45 opacity-20 text-[#d97706] animate-float-diagonal" />
        </div>
        <div className="absolute bottom-[20%] right-[8%] animate-fade-in-right delay-500">
          <MapIcon className="w-7 h-7 md:w-12 md:h-12 rotate-[10deg] opacity-40 text-[#d97706] animate-float-slow" />
        </div>
        <div className="absolute top-[15%] right-[15%] animate-fade-in-left delay-200">
          <Camera className="w-6 h-6 md:w-10 md:h-10 -rotate-[15deg] opacity-30 text-[#d97706] animate-float-fast" />
        </div>
        <div className="absolute bottom-[15%] left-[20%] animate-fade-in-up delay-400">
          <Tent className="w-8 h-8 md:w-12 md:h-12 rotate-[5deg] opacity-30 text-[#d97706] animate-float" />
        </div>
        <div className="absolute top-[35%] right-[5%] animate-fade-in-up delay-500">
          <Sun className="w-10 h-10 md:w-16 md:h-16 opacity-25 text-[#d97706] animate-float-slow" />
        </div>
        <div className="absolute bottom-[25%] left-[45%] animate-fade-in-left delay-300">
          <Palmtree className="w-8 h-8 md:w-14 md:h-14 -rotate-[10deg] opacity-25 text-[#d97706] animate-float-diagonal" />
        </div>
      </div>

      <div className="relative z-10 block">
        <Header />

        {/* ─────────────── SECTION 1: HERO BANNER ─────────────── */}
        <section className="max-w-7xl mx-auto px-4 md:px-12 pt-6 pb-8">
          <div className="relative w-full rounded-[2.5rem] overflow-hidden min-h-[350px] md:min-h-[450px] flex flex-col shadow-lg">
            <motion.div className="absolute inset-0 z-0" style={{ y: yImage }}>
              <Image src={heroImage} alt={trip.title} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>

            <div className="relative z-10 p-6 md:p-10 flex flex-col flex-1 h-full">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-md">Trip To</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.2] text-center max-w-5xl px-4 drop-shadow-lg" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  {trip.title}
                </h1>
                
                {/* Category & Difficulty Tags */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {(Array.isArray(trip?.category) ? trip.category : typeof trip?.category === 'string' ? trip.category.split(',').map((c: string) => c.trim()).filter(Boolean) : []).map((cat: string) => (
                    <span key={cat} className="px-4 py-1.5 bg-amber-400/90 backdrop-blur-sm text-black text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                      {cat}
                    </span>
                  ))}
                  {trip?.difficulty && trip.difficulty !== 'none' && (
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                      {trip.difficulty}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Main 2-Column Layout wrapped in a solid container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16">
        <div className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-12 border border-gray-100">
          <SplitReveal
            className="flex flex-col lg:flex-row gap-10 relative items-start"
            leftClassName="flex-1 w-full"
            rightClassName="w-full lg:w-[380px] shrink-0 sticky top-24"
            leftContent={
              <div className="space-y-16">
          
          
          {/* ABOUT THE TRIP */}
          <SectionReveal variant="fadeInUp">
            <h2 className="text-3xl md:text-4xl text-gray-900 mb-8" style={{ fontFamily: "var(--font-caveat), cursive" }}>
              About the trip
            </h2>

            {/* Route Map Section */}
            <div className="w-full bg-[#fffcf5] rounded-3xl border border-gray-100 overflow-hidden relative group mb-8 flex items-center justify-center min-h-[300px]">
              {trip.routeMapImage?.url ? (
                <img src={fixImageUrl(trip.routeMapImage.url)} alt="Route Map" className="w-full h-auto max-h-[600px] object-contain group-hover:scale-[1.02] transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-amber-50/50">
                  <Navigation className="w-12 h-12 text-amber-200 mb-4" />
                  <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Route Map</p>
                </div>
              )}
            </div>
            
            {trip.description && (
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium whitespace-pre-wrap mb-8">
                {trip.description}
              </div>
            )}

          </SectionReveal>

          {/* ITINERARY BREAKDOWN (Summary) */}
          {sortedItinerary.length > 0 && (
            <SectionReveal variant="fadeInRight">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl text-gray-900" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  Itinerary Breakdown
                </h2>
                {trip.isCustomizable && (
                  <span className="px-4 py-1.5 bg-amber-400 text-black font-black text-[10px] uppercase tracking-widest rounded-full">
                    Customizable
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {sortedItinerary.map((day: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-100 rounded-xl p-4 md:p-5 flex items-start gap-4 hover:border-amber-200 transition-all cursor-pointer group"
                    onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                  >
                    <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center font-black text-xs text-gray-500 shrink-0 group-hover:bg-amber-400 group-hover:text-black group-hover:border-amber-400 transition-all">
                      {day.dayNumber || day.day}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-900">{day.title}</h3>
                        <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${expandedDay === i ? 'rotate-180 text-amber-500' : ''}`} />
                      </div>
                      {expandedDay === i && day.description && (
                        <p className="mt-3 text-xs text-gray-500 font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                          {day.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          )}

          {/* DETAILED ITINERARY */}
          {sortedItinerary.length > 0 && (
            <SectionReveal variant="fadeInUp">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-2xl md:text-3xl text-gray-900" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  Detailed Itinerary
                </h2>
              </div>

              <div className="space-y-8 relative before:absolute before:left-5 md:before:left-7 before:top-0 before:bottom-0 before:w-px before:bg-gray-100">
                {sortedItinerary.map((day: any, i: number) => (
                  <div key={i} className="relative pl-14 md:pl-20">
                    <div className="absolute left-0 top-0 w-10 h-10 md:w-14 md:h-14 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black text-xs md:text-sm z-10">
                      D{day.dayNumber || day.day}
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-black text-gray-900 tracking-tight mb-3">
                        {day.title}
                      </h3>

                      {day.description && (
                        <p className="text-sm text-gray-600 font-medium leading-relaxed mb-5 whitespace-pre-wrap">
                          {day.description}
                        </p>
                      )}

                      {/* Activities */}
                      {day.activities?.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Activities</p>
                          {day.activities.map((act: any, idx: number) => (
                            <div key={idx} className="flex gap-3 items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-gray-800">{act.title || act}</p>
                                {act.description && <p className="text-[11px] text-gray-500 mt-0.5">{act.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Accommodation & Meals */}
                      <div className="flex flex-wrap gap-4 mt-4">
                        {day.accommodation && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Stay:</span>
                            <span className="text-xs font-bold text-blue-800">{day.accommodation}</span>
                          </div>
                        )}
                        {day.meals && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
                            <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">Meals:</span>
                            <span className="text-xs font-bold text-green-800">
                              {[day.meals.breakfast && 'B', day.meals.lunch && 'L', day.meals.dinner && 'D'].filter(Boolean).join(' / ') || 'None'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionReveal>
          )}

          {/* WHAT'S IN THE PACKAGE? */}
          {(trip.inclusions?.length > 0 || trip.exclusions?.length > 0) && (
            <SectionReveal variant="blurReveal">
              <h2 className="text-2xl md:text-3xl text-gray-900 mb-8" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                What&apos;s in the Package?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {trip.inclusions?.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-md flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-green-700">Included</h3>
                    </div>
                    <div className="space-y-2">
                      {trip.inclusions.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100/50">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {trip.exclusions?.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-500 rounded-md flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-red-700">Excluded</h3>
                    </div>
                    <div className="space-y-2">
                      {trip.exclusions.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                          <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium text-gray-500">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionReveal>
          )}

          {/* COSTING TABLE */}
          {tripDates.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl text-gray-900 mb-8" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Costing
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Route</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Seats</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripDates.map((d: any, i: number) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-800">
                            {formatDate(d.startDate)} → {formatDate(d.endDate)}
                          </div>
                          <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                            {trip.location?.city || trip.travelingLocations?.join(' → ')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-700">{d.availableSeats !== undefined && d.availableSeats !== null ? d.availableSeats : d.totalSeats}</span>
                          <span className="text-[10px] text-gray-400 ml-1">seats</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-gray-900">{formatPrice(d.price)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* NOTES */}
          {trip.importantNote && (
            <section>
              <h2 className="text-2xl md:text-3xl text-gray-900 mb-6" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Notes
              </h2>
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 md:p-8">
                <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                  {trip.importantNote}
                </p>
              </div>
            </section>
          )}

          {/* GALLERY */}
          {trip.media?.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl text-gray-900 mb-8" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {trip.media.slice(0, 8).map((img: any, i: number) => (
                  <div key={i} className={`relative overflow-hidden rounded-2xl aspect-square ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                    <Image src={fixImageUrl(img.url)} alt={img.caption || "Trip photo"} fill className="object-cover hover:scale-110 transition-transform duration-700 cursor-zoom-in" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DESTINATIONS COVERED */}
          {trip.travelingLocations?.length > 0 && (
            <section>
              <h2 className="text-2xl md:text-3xl text-gray-900 mb-6" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Destinations Covered
              </h2>
              <div className="flex flex-wrap gap-3">
                {trip.travelingLocations.map((loc: string, i: number) => (
                  <span key={i} className="px-5 py-2.5 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-full">
                    {loc}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* PICKUP POINTS */}
          {(trip.pickupLocations?.length > 0 || trip.location?.pickupLocations?.length > 0) && (
            <section>
              <h2 className="text-2xl md:text-3xl text-gray-900 mb-6" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                Pickup Points
              </h2>
              <div className="space-y-2">
                {(trip.pickupLocations || trip.location?.pickupLocations || []).map((p: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-sm font-bold text-gray-700">{p}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VENDOR CARD */}
          {trip.vendor && (
            <section>
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-3 pr-4 rounded-2xl w-fit">
                <div className="relative w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
                  <Image src={fixImageUrl((trip.vendor?.logo?.url || (typeof trip.vendor?.logo === 'string' && trip.vendor.logo.trim() !== '' ? trip.vendor.logo : null)) || "/bg-logo.png")} alt="Vendor" fill className="object-contain p-2" />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Managed by</p>
                  <p className="font-extrabold text-gray-900 text-sm tracking-tight">{trip.vendor?.user?.name || trip.vendor?.businessName || 'TripDekho'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* REVIEWS */}
          <section className="pt-8 border-t border-gray-100">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl text-gray-900" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                  Traveler Feedback
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    <Star size={14} className="fill-current" />
                  </div>
                  {trip.stats?.reviews > 0 ? (
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      {trip.stats.rating.toFixed(1)} / 5.0 
                      <span className="lowercase ml-1 opacity-75 text-[10px]">
                        ({trip.stats.reviews} review{trip.stats.reviews !== 1 ? 's' : ''})
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {reviewsLoading ? (
               <div className="flex justify-center py-8">
                 <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
               </div>
            ) : reviews.length === 0 ? (
               <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 text-center">
                  <p className="text-sm font-bold text-gray-600">
                     Reviews are exclusively collected from verified travelers after they complete this trip.
                  </p>
               </div>
            ) : (
               <div className="space-y-6">
                 {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 rounded-3xl p-6 transition-all hover:bg-gray-100/50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-black text-amber-500 shadow-sm border border-gray-100">
                            {review.user?.firstName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{review.user?.firstName} {review.user?.lastName}</h4>
                            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                              <span>
                                {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="pl-16">
                        <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                          {review.comment}
                        </p>

                        {/* Vendor Response Section */}
                        {review.response && (
                          <div className="mt-6 bg-white p-5 rounded-2xl border border-gray-100 relative shadow-sm">
                            <div className="absolute -left-2 top-6 w-4 h-4 rotate-45 bg-white border-b border-l border-gray-100"></div>
                            <div className="flex items-center gap-2 mb-2 text-gray-900">
                              <div className="relative w-5 h-5 bg-white rounded-full border border-gray-100 overflow-hidden shrink-0">
                                <Image src={fixImageUrl((trip.vendor?.logo?.url || (typeof trip.vendor?.logo === 'string' && trip.vendor.logo.trim() !== '' ? trip.vendor.logo : null)) || "/bg-logo.png")} alt="Vendor" fill className="object-contain p-0.5" />
                              </div>
                              <span className="text-xs font-black uppercase tracking-widest">{trip.vendor?.user?.name || trip.vendor?.businessName || 'Host'} Response</span>
                            </div>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">{review.response}</p>
                          </div>
                        )}
                      </div>
                    </div>
                 ))}
               </div>
            )}
          </section>

          </div>
        }
        rightContent={
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <p className="text-xs font-bold text-gray-500 mb-1">Trip Starts From</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-black text-amber-400">{formatPrice(trip.price?.amount || 0)}</span>
              {trip.price?.originalPrice && trip.price.originalPrice > trip.price.amount && (
                <>
                  <span className="text-sm font-bold text-gray-400 line-through decoration-gray-400">{formatPrice(trip.price.originalPrice)}</span>
                  <span className="text-[10px] font-black text-red-500">{formatPrice(trip.price.originalPrice - (trip.price?.amount || 0))} Off</span>
                </>
              )}
            </div>
            <p className="text-[10px] font-bold text-gray-400 mb-6">Per Person</p>

            <div className="flex items-center justify-between mb-4 relative">
              <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                <Calendar className="w-4 h-4 text-blue-500" /> Trip Dates
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  {String(currentSelectedMonth)} <ChevronDown className="w-3 h-3" />
                </button>
                
                {isMonthDropdownOpen && availableMonths.length > 0 && (
                   <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg p-2 z-20 w-32 max-h-48 overflow-y-auto">
                     {availableMonths.map((month) => (
                       <button
                         key={month as string}
                         onClick={() => {
                           setSelectedMonth(month as string);
                           setIsMonthDropdownOpen(false);
                         }}
                         className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-lg"
                       >
                         {month as string}
                       </button>
                     ))}
                   </div>
                )}
              </div>
            </div>

            {/* Dates List */}
            <div className="space-y-4 mb-6">
              {tripDates
                .filter((d: any) => {
                  if (!selectedMonth) return true;
                  const date = new Date(d.startDate);
                  const m = date.toLocaleString('default', { month: 'short' }) + "'" + date.getFullYear().toString().slice(-2);
                  return m === selectedMonth || selectedMonth === "All";
                })
                .map((d: any, i: number) => {
                  const isSelected = selectedDate === d.startDate || (!selectedDate && i === 0);
                  // Initialize selectedDate implicitly if needed
                  if (!selectedDate && i === 0) {
                     // Can't do setState during render safely, but visual is enough.
                     // The actual Book Now button uses fallback.
                  }
                  
                  return (
                    <div 
                      key={i} 
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => setSelectedDate(d.startDate)}
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-800 group-hover:text-amber-500 transition-colors">
                          {formatDate(d.startDate)}
                        </p>
                        <p className="text-[10px] font-bold text-gray-500 mt-0.5">
                          Starting {formatPrice(d.price)} /Person
                        </p>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                      )}
                    </div>
                  );
              })}
            </div>

            {/* No. of Travellers */}
            <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 font-bold text-gray-800 text-sm">
                <Users className="w-4 h-4 text-purple-600" /> No. of Travellers
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="text-gray-400 hover:text-gray-800 w-6 h-6 flex items-center justify-center"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-black">{guestCount}</span>
                <button 
                  onClick={() => setGuestCount(guestCount + 1)}
                  className="text-gray-400 hover:text-gray-800 w-6 h-6 flex items-center justify-center"
                >
                  <PlusIcon className="w-3 h-3" />
                </button>
              </div>
            </div>

            {(!user || user?.id !== trip.vendor?.user?.id) && (
              <button
                onClick={() => {
                  if (!user) {
                    dispatch(openAuthModal('login'));
                    return;
                  }
                  const dateParam = selectedDate || tripDates[0]?.startDate || '';
                  router.push(`/bookings/new?tripId=${trip.id}&date=${encodeURIComponent(dateParam)}&guests=${guestCount}`);
                }}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3.5 rounded-xl transition-all mb-3"
              >
                Book Now
              </button>
            )}

            </div>
            
            <WeatherWidget location={trip.location?.state || trip.location?.city || trip.travelingLocations?.[0] || 'Manali'} />
          </div>
        }
      />
        </div>
      </div>


      </div>
    </div>
  );
}
