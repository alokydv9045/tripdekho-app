"use client";

import React, { useEffect, useState } from "react";
import TripsListPageLayout from "@/components/shared/TripsListPageLayout";
import { tripService } from "@/services/tripService";

interface CategoryPageContentProps {
  categorySlug: string;
}

/**
 * Maps category page slugs to the correct API query parameters.
 * Each homepage section uses different params (category, tags, featured, etc.)
 * but the category page URL is always /category/[slug].
 * This mapping ensures the category page fetches the same trips as the homepage section.
 */
const SLUG_TO_QUERY_MAP: Record<string, Record<string, any>> = {
  // Category-based sections (use `category` param)
  "beach": { category: "beach" },
  "mountains": { category: "mountain" },
  "heritage": { category: "heritage" },
  "hike": { category: "hike" },
  "spiritual": { category: "spiritual" },
  "explore-offbeat": { category: "offbeat" },
  
  // Tag-based sections (use `tags` param)
  "weekend-escapes": { tags: "weekend-escape" },
  "budget-friendly": { tags: "budget-stay", sortBy: "price-asc" },
  
  // Special sections
  "top-trips": { featured: "true" },
};

/**
 * Maps slugs to display titles for the page header.
 */
const SLUG_TO_TITLE_MAP: Record<string, { title: string; highlightedWord: string }> = {
  "weekend-escapes": { title: "Weekend", highlightedWord: "Escapes" },
  "budget-friendly": { title: "Budget", highlightedWord: "Friendly" },
  "top-trips": { title: "Top Trips For", highlightedWord: "You" },
  "explore-offbeat": { title: "Explore", highlightedWord: "Offbeat" },
  "beach": { title: "Beach", highlightedWord: "Trips" },
  "mountains": { title: "Mountain", highlightedWord: "Trips" },
  "heritage": { title: "Heritage", highlightedWord: "Trips" },
  "hike": { title: "Hiking", highlightedWord: "Trips" },
  "spiritual": { title: "Spiritual", highlightedWord: "Trips" },
};

const CategoryPageContent: React.FC<CategoryPageContentProps> = ({ categorySlug }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTitle = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        // Use the slug-to-query mapping for known slugs, fallback to category param
        const queryParams = SLUG_TO_QUERY_MAP[categorySlug] || { category: categorySlug };
        const response = await tripService.getAllTrips({ ...queryParams, limit: 50 });
        setTrips(response?.data?.trips || response?.trips || response || []);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [categorySlug]);

  // Get display title from mapping or generate from slug
  const titleConfig = SLUG_TO_TITLE_MAP[categorySlug];
  const displayTitle = titleConfig?.title || formatTitle(categorySlug);
  const highlightedWord = titleConfig?.highlightedWord || "Trips";

  if (loading) {
    return <div className="p-8 text-center">Loading trips...</div>;
  }

  return (
    <TripsListPageLayout
      title={displayTitle}
      highlightedWord={highlightedWord}
      trips={trips}
    />
  );
};

export default CategoryPageContent;
