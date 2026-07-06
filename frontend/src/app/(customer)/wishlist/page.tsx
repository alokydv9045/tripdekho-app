"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import TripCard from "@/components/Homepage/UpcomingTrips/TripCard";
import { Trip } from "@/types/trip";
import { wishlistService } from "@/services/wishlistService";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";

const WishlistPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useSelector((state: RootState) => state.auth);
  const [wishlistItems, setWishlistItems] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Please login to view your wishlist");
      router.push("/");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        const data = await wishlistService.getWishlist();
        // The service returns a WishlistResponse object containing an 'items' array
        const trips = data?.items?.map((item: any) => item.trip) || [];
        setWishlistItems(trips);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        toast.error("Failed to load wishlist");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  if (isAuthLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="flex-grow flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/10 via-stone-50/50 to-zinc-100/30 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Light Theme Page Header */}
        <div className="mb-10 relative">
          <p className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 font-mono">Saved Adventures</p>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase relative select-none">
            <span className="font-caveat font-normal capitalize text-amber-500 tracking-normal block text-4xl md:text-5xl -mb-3 md:-mb-5 pl-1 rotate-[-2deg]">My</span>
            <span className="font-marker font-normal tracking-wide text-gray-900 text-5xl md:text-7xl">WISHLIST</span>
          </h1>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 border border-amber-100 text-amber-300">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase">Your wishlist is empty</h2>
            <p className="text-gray-400 max-w-md mb-8 font-medium text-sm leading-relaxed">
              Looks like you haven&apos;t saved any trips yet. Start exploring and click the heart icon to save your favorite adventures!
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-10 py-4 bg-amber-400 hover:bg-black hover:text-white text-black font-black rounded-2xl transition-all shadow-xl shadow-amber-400/20 text-xs uppercase tracking-widest"
            >
              Explore Trips
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((trip) => (
              <div key={trip.id} className="flex justify-center">
                <TripCard trip={trip} layout="vertical" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
