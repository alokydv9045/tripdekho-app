"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { customerService } from "@/services/index";
import { Star, MessageSquare, Calendar, ChevronRight, PenTool, ArrowLeft, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomerReviewsPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await customerService.getReviews();
      // Safe extraction of reviews array
      const reviewsData = res?.data?.reviews || res?.reviews || res?.data || res || [];
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error("Failed fetching customer reviews", error);
      toast.error("Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={`${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/10 via-stone-50/50 to-zinc-100/30 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        
        {/* Header */}
        <div className="mb-10 relative">
          <p className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 font-mono">Your Contributions</p>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase relative select-none">
            <span className="font-caveat font-normal capitalize text-amber-500 tracking-normal block text-4xl md:text-5xl -mb-3 md:-mb-5 pl-1 rotate-[-2deg]">My</span>
            <span className="font-marker font-normal tracking-wide text-gray-900 text-5xl md:text-7xl">REVIEWS</span>
          </h1>
        </div>

        {loading ? (
          /* Loading skeleton */
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 animate-pulse space-y-4">
                <div className="h-4 bg-gray-100 rounded w-1/4" />
                <div className="h-6 bg-gray-100 rounded w-2/3" />
                <div className="h-16 bg-gray-50 rounded w-full" />
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-white border border-amber-200/20 rounded-[32px] p-8 shadow-xl shadow-gray-100/30 hover:shadow-2xl hover:border-amber-400/20 transition-all duration-300 group"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Review for</p>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase group-hover:text-amber-600 transition-colors">
                      {review.trip?.title || "Curated Adventure"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100">
                    {renderStars(review.rating)}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-6">
                  <Calendar size={14} className="text-amber-500" />
                  <span>Posted on {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-gray-50 relative">
                  <p className="text-sm font-bold text-gray-700 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Vendor response if available */}
                {review.response ? (
                  <div className="mt-6 pl-6 border-l-4 border-amber-400 space-y-2">
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Response from Guide / Host</p>
                    <p className="text-xs font-bold text-gray-600 leading-relaxed">
                      {review.response}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Awaiting response from vendor
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-100 text-amber-300">
              <MessageSquare size={36} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase">No Reviews Yet</h3>
            <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium text-sm leading-relaxed">
              You haven't written any reviews yet. Share your experiences on completed bookings to earn points!
            </p>
            <button 
              onClick={() => router.push("/bookings")}
              className="px-10 py-4 bg-amber-400 hover:bg-black hover:text-white text-black font-black rounded-2xl transition-all shadow-xl shadow-amber-400/20 text-xs uppercase tracking-widest inline-flex items-center gap-2"
            >
              Go to My Bookings <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
