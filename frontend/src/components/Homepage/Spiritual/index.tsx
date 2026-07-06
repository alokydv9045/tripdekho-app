"use client";

import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ScrollableTripRow from "@/components/shared/ScrollableTripRow";
import { tripService } from "@/services/index";

const Spiritual: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAllTrips({ category: "spiritual", limit: 8 });
        setTrips(data?.data?.trips || data?.trips || data || []);
      } catch (error) {
        console.error("Failed to fetch spiritual trips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (!loading && trips.length === 0) return null;

  return (
    <section
      id="spiritual-section"
      className="relative w-full py-12 md:py-16"
      style={{ background: "var(--background, #FFFBF0)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Spiritual"
          highlightedWord=""
          viewAllHref="/category/spiritual"
          viewAllLabel="View all"
        />

        <ScrollableTripRow
          trips={trips}
          loading={loading}
          sectionId="spiritual"
        />
      </div>
    </section>
  );
};

export default Spiritual;
