"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { vendorService } from "@/services/vendorService";
import Header from "@/components/Header";
import TripCard from "@/components/Homepage/UpcomingTrips/TripCard";
import {
  ShieldCheck, MapPin, Star, ChevronRight,
  Building2, Globe, Users, Calendar, Award, Mail,
  Phone, ArrowLeft, Mountain, Edit2,
  Plane, BaggageClaim, Map, Compass, Camera, Tent, Sun, Palmtree, Navigation, Ticket, ImagePlus
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


export default function VendorPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await vendorService.getPublicVendorProfile(params.id as string);
        if (res.success) {
          setData(res.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch vendor profile", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchProfile();
  }, [params.id]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });

  if (loading) return <PremiumLoader />;

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FFFBF0]">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Building2 className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Vendor Not Found</h2>
          <p className="text-gray-500 mb-6 text-center font-medium text-sm">This vendor profile doesn&apos;t exist or has been removed.</p>
          <button
            onClick={() => router.push("/trips")}
            className="px-8 py-3 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-full hover:bg-amber-500 transition-colors"
          >
            Browse Trips
          </button>
        </div>
      </div>
    );
  }

  const { vendor, stats, trips, reviews } = data;
  const isVerified = vendor.verificationStatus === "verified" || vendor.verificationStatus === "approved";
  const memberSince = vendor.createdAt ? formatDate(vendor.createdAt) : "N/A";

  // Normalize trips to match the TripCard's expected shape
  const normalizedTrips = trips.map((trip: any) => ({
    ...trip,
    nights: trip.durationNights,
    days: trip.durationDays,
    duration: { nights: trip.durationNights, days: trip.durationDays },
    currentPrice: trip.price?.amount || 0,
    originalPrice: trip.price?.originalPrice || (trip.price?.amount ? trip.price.amount + 3000 : 0),
    images: trip.thumbnail ? [trip.thumbnail] : [],
    vendor: { businessName: vendor.businessName, user: { name: vendor.businessName } },
  }));

  // Single canonical name — backend now serves user.name here
  const vendorDisplayName = vendor.businessName;

  return (
    <div className="min-h-screen bg-[#FFFBF0] font-sans">
      <Header />

      {/* ─────────── HERO SECTION ─────────── */}
      {/* ─────────── HERO SECTION ─────────── */}
      <section className="relative overflow-hidden group" style={{ background: "var(--background, #FFFBF0)" }}>
        
        {/* Dynamic Background: Either Poster or Theme with Floating Icons */}
        {vendor.bannerUrl ? (
          <div className="absolute inset-0 z-0">
            <Image src={vendor.bannerUrl} alt="Vendor Banner" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" /> {/* Frosted overlay to ensure text readability */}
          </div>
        ) : (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Subtle Gradient & Patterns */}
            <div
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
            />
            <div
              className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full opacity-[0.08]"
              style={{ background: "radial-gradient(circle, #FFD133 0%, transparent 70%)" }}
            />
            
            {/* Animated Floating Travel Icons (Theme matched) */}
            <div className="absolute top-[15%] left-[8%] opacity-0 animate-fade-in-up delay-300">
              <Plane className="w-8 h-8 md:w-14 md:h-14 rotate-[15deg] opacity-40 text-amber-600 animate-float-fast" />
            </div>
            <div className="absolute top-[55%] left-[4%] opacity-0 animate-fade-in-left delay-500">
              <BaggageClaim className="w-6 h-6 md:w-10 md:h-10 -rotate-12 opacity-30 text-amber-500 animate-float-slow delay-100" />
            </div>
            <div className="absolute top-[25%] left-[40%] opacity-0 animate-fade-in-up delay-400">
              <Compass className="w-10 h-10 md:w-16 md:h-16 rotate-45 opacity-20 text-amber-700 animate-float-diagonal delay-200" />
            </div>
            <div className="absolute bottom-[20%] right-[3%] opacity-0 animate-fade-in-right delay-500">
              <Map className="w-7 h-7 md:w-12 md:h-12 rotate-[10deg] opacity-30 text-amber-600 animate-float-slow delay-300" />
            </div>
            <div className="absolute top-[15%] right-[8%] opacity-0 animate-fade-in-left delay-200">
              <Camera className="w-6 h-6 md:w-10 md:h-10 -rotate-[15deg] opacity-25 text-amber-500 animate-float-fast delay-100" />
            </div>
          </div>
        )}

        {/* Edit Buttons for Vendor (Visible on hover) */}
        {isAuthenticated && user?.role === 'vendor' && (
          <div className="absolute top-4 right-4 z-20 md:top-8 md:right-8 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end gap-2">
            <Link href="/vendor/profile">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white backdrop-blur-md border border-gray-200 shadow-sm rounded-xl text-gray-900 text-xs font-bold uppercase tracking-wider transition-all">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </Link>
          </div>
        )}

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-[10px] font-black uppercase tracking-widest mb-8 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Go Back
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 bg-white/40 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-[2rem] shadow-xl shadow-amber-900/5">
            {/* Logo / Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl shadow-lg shadow-black/5 overflow-hidden flex items-center justify-center shrink-0 relative border border-gray-100"
            >
              {vendor.logo ? (
                <Image src={typeof vendor.logo === 'string' ? vendor.logo : vendor.logo?.url} alt={vendorDisplayName} fill className="object-contain p-3" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl font-black text-white">{vendorDisplayName?.charAt(0)}</span>
                </div>
              )}
            </motion.div>

            {/* Vendor Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}>
                  {vendorDisplayName}
                </h1>
                {isVerified && (
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500/15 border border-green-500/25 rounded-full mt-1 md:mt-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Verified</span>
                  </div>
                )}
              </div>

              {vendor.description && (
                <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-xl mb-5">
                  {vendor.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 md:gap-5">
                {vendor.contactEmail && (
                  <a
                    href={`mailto:${vendor.contactEmail}`}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-amber-600 text-[10.5px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" /> {vendor.contactEmail}
                  </a>
                )}
                {vendor.contactPhone && (
                  <a
                    href={`tel:${vendor.contactPhone}`}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-amber-600 text-[10.5px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> {vendor.contactPhone}
                  </a>
                )}
                <div className="flex items-center gap-1.5 text-gray-500 text-[10.5px] font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" /> Since {memberSince}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────── STATS BAR ─────────── */}
      <section className="relative z-20 -mt-6 max-w-4xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/80 p-5 md:p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <Mountain className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 tracking-tight leading-none">{stats.totalTrips}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Trips</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 tracking-tight leading-none">{stats.totalBookings}+</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Travelers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 tracking-tight leading-none">{stats.avgRating || "—"}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 tracking-tight leading-none">{stats.totalReviews}</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Reviews</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─────────── TRIPS SECTION (Using Homepage TripCard) ─────────── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-14 pb-10">
        <div className="mb-8">
          <h2
            className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
          >
            Trips by {vendorDisplayName}
          </h2>
          <p className="text-gray-400 font-semibold text-[11px] mt-1">
            {stats.totalTrips} trip{stats.totalTrips !== 1 ? "s" : ""} available to book
          </p>
        </div>

        {normalizedTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-[2rem] border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-gray-200" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">No trips available</h3>
            <p className="text-gray-400 text-[10px] font-medium text-center">New itineraries coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {normalizedTrips.map((trip: any, i: number) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <TripCard trip={trip} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ─────────── REVIEWS SECTION ─────────── */}
      {reviews.length > 0 && (
        <section className="bg-white py-14 md:py-20 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2
                  className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight"
                  style={{ fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}
                >
                  Traveler Reviews
                </h2>
                <p className="text-gray-400 font-semibold text-[11px] mt-1">
                  What travelers say about {vendorDisplayName}
                </p>
              </div>
              {stats.avgRating > 0 && (
                <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-base font-black text-gray-900">{stats.avgRating}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">/ 5.0</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((review: any, i: number) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="bg-gray-50 rounded-2xl p-5 hover:bg-white hover:shadow-md hover:shadow-gray-100/60 border border-transparent hover:border-gray-100 transition-all duration-300"
                >
                  {/* Stars + Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= review.rating ? "text-amber-400 fill-current" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-[13px] text-gray-600 font-medium leading-relaxed mb-4 line-clamp-3">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}

                  {/* Vendor Response */}
                  {review.response && (
                    <div className="bg-amber-50/60 rounded-lg p-3 mb-4 border border-amber-100/50">
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Reply</p>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">{review.response}</p>
                    </div>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100/80">
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-gray-100">
                      <span className="text-[10px] font-black text-gray-500">{review.user?.name?.charAt(0) || "?"}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{review.user?.name || "Anonymous"}</p>
                      {review.trip?.title && (
                        <Link
                          href={`/trips/${review.trip.slug}`}
                          className="text-[9px] font-bold text-amber-500 hover:text-amber-600 uppercase tracking-wider transition-colors truncate block"
                        >
                          {review.trip.title}
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─────────── CTA FOOTER ─────────── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="bg-gray-900 rounded-3xl p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/6 rounded-full blur-3xl" />

          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2">
              Explore with {vendorDisplayName}
            </h3>
            <p className="text-white/30 font-bold text-[10px] uppercase tracking-widest">
              Curated trips · Verified vendor · Secure bookings
            </p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="relative z-10 shrink-0 px-6 py-3 bg-amber-400 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white transition-colors shadow-lg shadow-amber-400/15"
          >
            View Trips ↑
          </button>
        </div>
      </section>
    </div>
  );
}
