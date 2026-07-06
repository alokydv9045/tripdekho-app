"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollableTripRow from "@/components/shared/ScrollableTripRow";
import { tripService } from "@/services/index";

const TopTripsForYou: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTrips = async () => {
      try {
        const data = await tripService.getAllTrips({ featured: "true", limit: 8 });
        setTrips(data?.data?.trips || data?.trips || data || []);
      } catch (error) {
        console.error("Failed to fetch top trips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopTrips();
  }, []);

  if (!loading && trips.length === 0) return null;

  return (
    <section
      id="top-trips-section"
      className="relative w-full py-12 md:py-16"
      style={{ background: "var(--background, #FFFBF0)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Top Trips For"
          highlightedWord="You"
          viewAllHref="/category/top-trips"
          viewAllLabel="View all"
        />

        <ScrollableTripRow
          trips={trips}
          loading={loading}
          sectionId="top-trips"
        />
      </div>
    </section>
  );
};

export default TopTripsForYou;
