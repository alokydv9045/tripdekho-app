import React from "react";
import Image from "next/image";
import { Review } from "@/types/review";
import { fixImageUrl } from "@/lib/utils/formatters";

interface ReviewCardProps {
  review: any;
}

const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  let avatarUrl = review.user?.avatar || (typeof review.customer === 'object' ? review.customer?.avatar : "") || review.image || "";
  
  // Handle if avatarUrl is a JSON object with a url property
  if (avatarUrl && typeof avatarUrl === 'object' && avatarUrl.url) {
    avatarUrl = avatarUrl.url;
  }
  
  // Ensure it's a string before calling trim
  avatarUrl = typeof avatarUrl === 'string' ? avatarUrl : "";
  
  const imageUrl = fixImageUrl(avatarUrl.trim() !== "" ? avatarUrl : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800");

  return (
    <article className="flex flex-col sm:flex-row bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.04)] h-full">
      {/* Image Container */}
      <div className="relative w-full sm:w-[280px] h-[200px] sm:h-[280px] shrink-0 bg-gray-100">
        <Image
          src={imageUrl}
          alt={`Review by ${review.author || review.user?.name || (typeof review.customer === 'object' ? review.customer?.name : "") || "Anonymous Traveler"}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 280px"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col grow p-6 sm:p-8">
        {/* Stars */}
        <div className="flex items-center gap-1 mb-4 justify-center sm:justify-start">
          {[...Array(Math.floor(review.ratings?.overall || review.rating || 0))].map((_, i) => (
            <StarIcon key={i} />
          ))}
        </div>

        {/* Text */}
        <div className="text-center sm:text-left text-[13px] sm:text-[14px] leading-relaxed text-gray-700 grow mb-6">
          {review.comment || review.content || review.text || "This traveler has not left a written review yet."}{" "}
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">
            Read more...
          </span>
        </div>

        {/* Author */}
        <div className="text-center sm:text-left text-sm font-semibold text-gray-900 mt-auto">
          {review.author || review.user?.name || (typeof review.customer === 'object' ? review.customer?.name : "") || "Anonymous Traveler"}
        </div>
      </div>
    </article>
  );
};

export default ReviewCard;
