"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollableTripRow from "@/components/shared/ScrollableTripRow";
import { tripService } from "@/services/index";

const ExploreOffbeat: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAllTrips({ category: "offbeat", limit: 8 });
        setTrips(data?.data?.trips || data?.trips || data || []);
      } catch (error) {
        console.error("Failed to fetch offbeat trips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (!loading && trips.length === 0) return null;

  return (
    <section
      id="explore-offbeat-section"
      className="relative w-full py-12 md:py-16"
      style={{ background: "var(--background, #FFFBF0)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Explore"
          highlightedWord="Offbeat"
          viewAllHref="/category/explore-offbeat"
          viewAllLabel="View all"
        />

        <ScrollableTripRow
          trips={trips}
          loading={loading}
          sectionId="explore-offbeat"
        />
      </div>
    </section>
  );
};

export default ExploreOffbeat;
