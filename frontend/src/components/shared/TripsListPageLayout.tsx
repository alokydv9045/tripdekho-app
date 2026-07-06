"use client";

import React from "react";
import FilterSidebar from "@/components/shared/FilterSidebar";
import TripCard from "@/components/Homepage/UpcomingTrips/TripCard";
import { Trip } from "@/types/trip";

interface TripsListPageLayoutProps {
  title: string;
  highlightedWord: string;
  trips: Trip[];
  loading?: boolean;
}

const TripsListPageLayout: React.FC<TripsListPageLayoutProps> = ({
  title,
  highlightedWord,
  trips,
  loading = false,
}) => {
  return (
    <section className="w-full pb-16 pt-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1
          className="text-4xl md:text-5xl font-extrabold text-[#191c1d] mb-2"
          style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
        >
          {title} <span className="text-[#ffb300]">{highlightedWord}</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar filtering area */}
        <div className="w-full lg:w-auto overflow-visible lg:sticky lg:top-8 shrink-0">
          <FilterSidebar />
        </div>

        {/* Main Grid Area */}
        <div className="flex-grow w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full mx-auto">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-2xl" />
              ))
            ) : trips.length > 0 ? (
              trips.map((trip) => (
                <TripCard key={trip.id || trip.id} trip={trip} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500">
                No trips found.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripsListPageLayout;
