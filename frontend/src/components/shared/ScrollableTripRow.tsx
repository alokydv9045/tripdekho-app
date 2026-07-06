"use client";

import React, { useRef, useState, useEffect } from "react";
import TripCard from "@/components/Homepage/UpcomingTrips/TripCard";
import { Trip } from "@/types/trip";
import StaggerGroup from "./StaggerGroup";
import { motion, AnimatePresence } from "framer-motion";
import { variants } from "@/lib/motion";

interface ScrollableTripRowProps {
  trips: Trip[];
  sectionId: string;
  loading?: boolean;
}

/**
 * Reusable horizontally scrollable row of TripCards.
 * Encapsulates scroll logic, nav buttons, and fade gradients.
 * Used by UpcomingTrips, BudgetFriendly, WeekendEscapes, etc.
 */
const ScrollableTripRow: React.FC<ScrollableTripRowProps> = ({
  trips,
  sectionId,
  loading = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 4
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [trips, loading]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Left Scroll Button */}
      {canScrollLeft && !loading && (
        <button
          id={`${sectionId}-scroll-left`}
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-10 h-10 rounded-full items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            backdropFilter: "blur(8px)",
          }}
          aria-label="Scroll left"
          suppressHydrationWarning
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#191c1d"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Right Scroll Button */}
      {canScrollRight && !loading && (
        <button
          id={`${sectionId}-scroll-right`}
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-10 h-10 rounded-full items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            backdropFilter: "blur(8px)",
          }}
          aria-label="Scroll right"
          suppressHydrationWarning
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#191c1d"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Left Fade Gradient */}
      {canScrollLeft && !loading && (
        <div
          className="hidden md:block absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--background, #FFFBF0), transparent)",
          }}
        />
      )}

      {/* Right Fade Gradient */}
      {canScrollRight && !loading && (
        <div
          className="hidden md:block absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to left, var(--background, #FFFBF0), transparent)",
          }}
        />
      )}

      {/* Cards Row */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div 
               key="loading"
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               className="flex w-full items-center justify-center py-20"
             >
               <div className="flex flex-col items-center gap-3">
                 <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Adventures...</span>
               </div>
             </motion.div>
          ) : trips.length > 0 ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.4 }}
              className="flex gap-5 w-full"
            >
              <StaggerGroup className="flex gap-5">
                {trips.map((trip) => (
                  <motion.div key={trip.id || trip.id} variants={variants.staggerChildFadeDown}>
                    <TripCard trip={trip} />
                  </motion.div>
                ))}
              </StaggerGroup>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center w-full py-16 px-4 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200"
            >
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
               </div>
               <h3 className="text-sm font-bold text-gray-900 mb-1">No trips available</h3>
               <p className="text-gray-400 text-[10px] font-medium text-center">New itineraries coming soon.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScrollableTripRow;
