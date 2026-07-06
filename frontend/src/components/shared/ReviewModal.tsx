"use client";

import React, { useState } from "react";
import { Star, X, Send, Loader2, Sparkles } from "lucide-react";
import { reviewService } from "@/services/reviewService";
import { toast } from "sonner";

interface ReviewModalProps {
  tripId: string;
  tripTitle: string;
  bookingId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ tripId, tripTitle, bookingId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    try {
      setIsSubmitting(true);
      const finalComment = [title.trim(), content.trim()].filter(Boolean).join('\n\n');
      
      if (!finalComment) {
        toast.error("Please provide a title or share your story");
        setIsSubmitting(false);
        return;
      }

      await reviewService.createReview({
        tripId,
        bookingId,
        rating,
        comment: finalComment
      });
      toast.success("Thank you for your feedback!");
      onSuccess();
      onClose();
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl shadow-black/20 overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
        {/* Header decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
             <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-500">
                   <Sparkles size={16} />
                   <p className="text-[10px] font-black uppercase tracking-widest leading-none mt-1">Review Your Trip</p>
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-tight">
                  How was the service by <span className="text-amber-500">{tripTitle}</span>?
                </h2>
             </div>
             <button 
               onClick={onClose} 
               className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
             >
               <X size={24} />
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Star Rating */}
            <div className="flex flex-col items-center gap-4 py-4 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate your experience</p>
               <div className="flex gap-2">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <button
                     key={star}
                     type="button"
                     onMouseEnter={() => setHoverRating(star)}
                     onMouseLeave={() => setHoverRating(0)}
                     onClick={() => setRating(star)}
                     className="p-1 transition-transform active:scale-95 duration-200"
                   >
                     <Star 
                       size={40} 
                       className={`transition-all duration-300 ${
                         (hoverRating || rating) >= star 
                           ? "fill-amber-400 text-amber-400 scale-110" 
                           : "text-gray-300 fill-gray-100"
                       }`} 
                     />
                   </button>
                 ))}
               </div>
               <p className="text-xs font-bold text-amber-600 h-4">
                 {rating === 1 && "Not what I expected"}
                 {rating === 2 && "Could be better"}
                 {rating === 3 && "It was okay"}
                 {rating === 4 && "Great experience!"}
                 {rating === 5 && "Absolutely incredible!"}
               </p>
            </div>

            {/* Content Fields */}
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Review Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. Breath-taking views and great host"
                    required
                    className="w-full h-14 px-6 bg-gray-50 border border-transparent focus:bg-white focus:border-amber-400 rounded-2xl outline-none text-sm font-bold transition-all placeholder:text-gray-300"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Share your story</label>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell other travelers about your favorite moments..."
                    className="w-full h-32 p-6 bg-gray-50 border border-transparent focus:bg-white focus:border-amber-400 rounded-[24px] outline-none text-sm font-bold transition-all resize-none placeholder:text-gray-300"
                  />
               </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-grow flex items-center justify-center gap-3 h-16 bg-gray-900 text-white rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-amber-500 hover:text-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>Sending... <Loader2 className="animate-spin" size={18} /></>
                ) : (
                  <>Submit Review <Send size={18} /></>
                )}
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="px-8 bg-gray-100 text-gray-500 rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-gray-200 hover:text-gray-900 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
