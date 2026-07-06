"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollableTripRow from "@/components/shared/ScrollableTripRow";
import { tripService } from "@/services/index";

interface Props {
  trips?: any[]; // Keep prop for backward compatibility in page.tsx but we'll fetch live
}

const UpcomingTrips: React.FC<Props> = ({ trips: initialTrips = [] }) => {
  const [trips, setTrips] = useState<any[]>(initialTrips);
  const [loading, setLoading] = useState(!initialTrips.length);

  useEffect(() => {
    // Always fetch fresh to bypass Next.js stuck build cache
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAllTrips({ limit: 12 });
        setTrips(data?.data?.trips || data?.trips || data?.data || []);
      } catch (error) {
        console.error("Failed to fetch upcoming trips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (!loading && trips.length === 0) return null;

  return (
    <section
      id="upcoming-trips-section"
      className="relative w-full py-12 md:py-16"
      style={{ background: "var(--background, #FFFBF0)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Upcoming"
          highlightedWord="Trips"
          viewAllHref="/search"
          viewAllLabel="View all"
        />

        <ScrollableTripRow 
          trips={trips} 
          sectionId="upcoming-trips" 
          loading={loading} 
        />
      </div>
    </section>
  );
};

export default UpcomingTrips;
