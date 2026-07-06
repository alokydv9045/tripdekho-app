"use client";

import React, { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { reviewService } from "@/services/reviewService";
import { toast } from "sonner";

interface ReviewFormProps {
  tripId: string;
  bookingId?: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ tripId, bookingId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (content.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewService.createReview({ 
        tripId, 
        rating, 
        comment: content 
      });
      toast.success("Review submitted successfully!");
      setRating(0);
      setContent("");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Review failed:", error);
      const errorMsg = error.response?.data?.message;
      const displayMsg = Array.isArray(errorMsg) ? errorMsg[0] : (errorMsg || "Failed to submit review");
      toast.error(displayMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <h3 className="text-xl font-extrabold text-gray-900 mb-2 tracking-tight uppercase">Share Your Experience</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">How was your trip with us?</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Star Rating */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Rating</label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-all transform hover:scale-110 active:scale-95"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    (hover || rating) >= star
                      ? "fill-amber-400 stroke-amber-400"
                      : "fill-transparent stroke-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Review Comment</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell others about the local guides, accommodation, and your overall experience..."
            className="w-full h-32 p-6 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-amber-400 transition-all text-sm font-medium resize-none placeholder:text-gray-300"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-16 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber-400 hover:text-black transition-all shadow-lg shadow-gray-900/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Post Review</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
