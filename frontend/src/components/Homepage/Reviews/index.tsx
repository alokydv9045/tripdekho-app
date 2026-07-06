"use client";

import { useState, useEffect } from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import ReviewCard from "./ReviewCard";
// import { reviewsData } from "../data/reviews";

import { axiosPublic } from "@/lib/axios";

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosPublic.get('/reviews/top');
        if (res.data.success) {
          setReviews(res.data.data.reviews || res.data.data);
        }
      } catch (error) {
        console.error('Fetch reviews failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <section
      id="reviews-section"
      className="relative w-full py-12 md:py-16"
      style={{ background: "var(--background, #ffffff)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Reviews"
          highlightedWord=""
          showViewAll={false}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id || review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
