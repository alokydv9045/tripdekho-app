"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageCircle, AlertCircle, Send, CheckCircle2, Search, Filter } from "lucide-react";
import { reviewService } from "@/services/reviewService";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, average: 0, pending: 0 });
  const [activeReply, setActiveReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getVendorReviews({ limit: 50 });
      const data = res?.data?.reviews || [];
      
      setReviews(data);
      
      // Calculate stats
      if (data.length > 0) {
        const sum = data.reduce((acc: number, rev: any) => acc + rev.rating, 0);
        const pending = data.filter((rev: any) => !rev.response).length;
        setStats({
          total: data.length,
          average: sum / data.length,
          pending
        });
      }
    } catch (err) {
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const submitReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    
    try {
      setSubmittingReply(true);
      await reviewService.respondToReview(reviewId, replyText);
      toast.success("Response posted successfully");
      setActiveReply(null);
      setReplyText("");
      fetchReviews(); // refresh
    } catch (err) {
      toast.error("Failed to post response");
    } finally {
      setSubmittingReply(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return !r.response;
    if (filter === "replied") return !!r.response;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Reviews & Feedback</h1>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Listen to your travelers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Average Rating</p>
            <p className="text-3xl font-black text-gray-900">{stats.average.toFixed(1)}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 fill-blue-500" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Reviews</p>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 fill-rose-500" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pending Replies</p>
            <p className="text-3xl font-black text-gray-900">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
        {/* Filters */}
        <div className="flex gap-4 mb-8 border-b border-gray-100 pb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === "all" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              filter === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-50 text-gray-400 hover:bg-amber-50 hover:text-amber-600"
            }`}
          >
            Pending <span className="px-2 py-0.5 rounded-full bg-white/50 text-[10px]">{stats.pending}</span>
          </button>
          <button
            onClick={() => setFilter("replied")}
            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === "replied" ? "bg-emerald-100 text-emerald-700" : "bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
            }`}
          >
            Replied
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No reviews found</h3>
            <p className="text-sm text-gray-500 mt-2 font-medium">When travelers review your trips, they will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-3xl p-6 transition-all hover:bg-gray-100/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-black text-amber-500 shadow-sm border border-gray-100">
                      {review.user?.firstName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.user?.firstName} {review.user?.lastName}</h4>
                      <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                        <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg line-clamp-1 max-w-[200px]">
                          Trip: {review.trip?.title}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pl-16">
                  <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {review.comment}
                  </p>

                  {/* Vendor Response Section */}
                  {review.response ? (
                    <div className="mt-6 bg-white p-5 rounded-2xl border border-emerald-100 relative">
                      <div className="absolute -left-2 top-6 w-4 h-4 rotate-45 bg-white border-b border-l border-emerald-100"></div>
                      <div className="flex items-center gap-2 mb-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Your Response</span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">{review.response}</p>
                    </div>
                  ) : activeReply === review.id ? (
                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your official response..."
                        className="w-full h-32 p-4 bg-white border border-amber-200 focus:border-amber-400 rounded-2xl outline-none text-sm font-medium transition-all resize-none shadow-sm shadow-amber-500/5"
                        autoFocus
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setActiveReply(null);
                            setReplyText("");
                          }}
                          className="px-6 h-10 rounded-xl text-xs font-black text-gray-500 hover:bg-gray-200 uppercase tracking-widest transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => submitReply(review.id)}
                          disabled={submittingReply || !replyText.trim()}
                          className="px-6 h-10 rounded-xl bg-gray-900 text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-amber-500 hover:text-black transition-all disabled:opacity-50"
                        >
                          {submittingReply ? "Posting..." : <><Send className="w-3 h-3" /> Post Reply</>}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveReply(review.id)}
                      className="mt-6 flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Reply to Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
