'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { 
  Star, 
  Search, 
  CheckCircle, 
  XCircle,
  User,
  MapPin,
  RefreshCw,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  AlertCircle,
  Edit3,
  Trash2,
  Save
} from "lucide-react";

const ReviewsManagementPage = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [lastSynced, setLastSynced] = useState<string>('');
  const [limit] = useState(20);

  const fetchReviews = useCallback(async (pageTarget = page) => {
    try {
      setLoading(true);
      const res = await adminService.getReviews({ 
        page: pageTarget, 
        limit,
        status: statusFilter === 'all' ? undefined : statusFilter, 
        search: debouncedSearch || undefined 
      });
      setReviews(res.reviews || []);
      setTotalPages(res.totalPages || 1);
      setTotalResults(res.total || 0);
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, limit, page]);

  useEffect(() => {
    fetchReviews(1);
    setPage(1);
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    if (page > 1) fetchReviews(page);
  }, [page]);

  const handleUpdateStatus = async (id: string, status: string) => {
    const originalStatus = reviews.find(r => r.id === id)?.status;
    
    // Optimistic update
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    
    try {
      await adminService.updateReviewStatus(id, status);
      toast.success(`Review ${status} successfully`);
      if (selectedReview?.id === id) setSelectedReview({...selectedReview, status});
    } catch (err) {
      // Rollback
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: originalStatus } : r));
      toast.error('Failed to update review status');
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) return;
    try {
      await adminService.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      if (selectedReview?.id === id) setSelectedReview(null);
      toast.success('Review deleted successfully');
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  const handleEditReview = async (review: any) => {
    setEditingReview(review);
    setEditComment(review.comment || '');
    setEditRating(review.rating || 5);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    try {
      await adminService.updateReview(editingReview.id, { comment: editComment, rating: editRating });
      setReviews(prev => prev.map(r => r.id === editingReview.id ? { ...r, comment: editComment, rating: editRating } : r));
      if (selectedReview?.id === editingReview.id) {
        setSelectedReview({ ...selectedReview, comment: editComment, rating: editRating });
      }
      setEditingReview(null);
      toast.success('Review updated successfully');
    } catch (err) {
      toast.error('Failed to update review');
    }
  };

  const StarRating = ({ rating, size = 12 }: { rating: number, size?: number }) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={size} 
          className={cn(
            i < Math.floor(rating) 
              ? "text-amber-400 fill-amber-400" 
              : "text-gray-200 fill-gray-200"
          )} 
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <Star className="text-black" size={24} />
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Reviews</h1>
            </div>
            <p className="text-sm text-gray-500">Moderate and manage platform-wide customer reviews and feedback</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-2 hidden lg:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Public Sentiment</p>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-tight">Highly Positive</p>
          </div>
          <button 
            onClick={() => fetchReviews()}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
          >
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
               <CheckCircle size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Approved Reviews</p>
               <p className="text-3xl font-bold text-gray-900">{totalResults}</p>
            </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
               <AlertCircle size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Audit</p>
               <p className="text-3xl font-bold text-gray-900">{reviews.filter(r => r.status === 'pending').length}</p>
            </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
               <Star size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Rating</p>
               <p className="text-3xl font-bold text-gray-900">4.8</p>
            </div>
         </div>
      </div>

      {/* Main Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
         <div className="flex overflow-x-auto w-full lg:w-auto gap-1 pb-2 lg:pb-0">
            {['all', 'pending', 'approved', 'rejected'].map(t => (
              <button 
                key={t}
                onClick={() => setStatusFilter(t)}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap",
                  statusFilter === t ? "bg-black text-white" : "bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {t}
              </button>
            ))}
         </div>
         <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
               type="text" 
               placeholder="Search review content or author..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all"
            />
         </div>
      </div>

      {/* Review List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                   <th className="px-6 py-4">Traveler</th>
                   <th className="px-6 py-4">Rating</th>
                   <th className="px-6 py-4">Review Content</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-6 py-8 animate-pulse bg-gray-50/20" /></tr>
                  ))
                ) : reviews.length > 0 ? reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase">
                              {review.customer?.name?.charAt(0) || 'U'}
                           </div>
                           <div>
                              <p className="font-bold text-gray-900">{review.customer?.name}</p>
                              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{new Date(review.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <StarRating rating={review.rating} />
                        <span className="text-[10px] font-bold text-gray-900 mt-1 block uppercase tracking-tighter">{review.rating} / 5.0</span>
                     </td>
                     <td className="px-6 py-4 max-w-md">
                        <p className="text-gray-700 line-clamp-2 leading-relaxed text-xs italic">"{review.comment}"</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                           <MapPin size={10} /> {review.trip?.title || 'Unknown Experience'}
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                          review.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 
                          review.status === 'pending' ? 'bg-amber-50 text-amber-700' : 
                          'bg-red-50 text-red-700'
                        )}>
                           {review.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           {review.status !== 'approved' && (
                             <button 
                               onClick={() => handleUpdateStatus(review.id, 'approved')}
                               className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                             >
                                <CheckCircle size={16} />
                             </button>
                           )}
                           {review.status !== 'rejected' && (
                             <button 
                               onClick={() => handleUpdateStatus(review.id, 'rejected')}
                               className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                             >
                                <XCircle size={16} />
                             </button>
                           )}
                           <button 
                              onClick={() => setSelectedReview(review)}
                              className="p-2 text-gray-300 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                           >
                              <MessageSquare size={16} />
                           </button>
                           <button 
                              onClick={() => handleEditReview(review)}
                              className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                           >
                              <Edit3 size={16} />
                           </button>
                           <button 
                              onClick={() => handleDeleteReview(review.id)}
                              className="p-2 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-medium">No reviews matching criteria</td></tr>
                )}
             </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page {page} of {totalPages}</span>
           <div className="flex gap-2">
              <button 
                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button 
                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
           </div>
        </div>
      )}

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-8 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
                       <User size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-gray-900 tracking-tight">{selectedReview.customer?.name}</h2>
                       <p className="text-sm text-gray-500 font-medium">{selectedReview.customer?.email}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedReview(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-10 space-y-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
                 <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rating</p>
                       <StarRating rating={selectedReview.rating} size={20} />
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Timestamp</p>
                       <p className="text-sm font-bold text-gray-900">{new Date(selectedReview.createdAt).toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience Title</p>
                    <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                       <MapPin className="text-black" size={18} />
                       <span className="text-sm font-bold text-gray-900">{selectedReview.trip?.title}</span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Review Content</p>
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-gray-700 leading-relaxed italic relative">
                       <div className="absolute top-4 right-6 opacity-5">
                          <MessageSquare size={40} />
                       </div>
                       "{selectedReview.comment}"
                    </div>
                 </div>
              </div>

              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button 
                   onClick={() => handleUpdateStatus(selectedReview.id, 'rejected')}
                   className="px-6 py-3 border border-red-200 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                 >
                    Reject
                 </button>
                 <button 
                   onClick={() => handleUpdateStatus(selectedReview.id, 'approved')}
                   className="px-10 py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
                 >
                    Approve
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-gray-900">Edit Review</h3>
                 <button onClick={() => setEditingReview(null)} className="p-1.5 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                    <X size={18} />
                 </button>
              </div>
              <div className="p-6 space-y-5">
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Rating</label>
                    <div className="flex gap-1">
                       {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEditRating(star)}
                            className="transition-all hover:scale-110"
                          >
                            <Star
                              size={24}
                              className={cn(
                                star <= editRating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                              )}
                            />
                          </button>
                       ))}
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Comment</label>
                    <textarea
                       value={editComment}
                       onChange={(e) => setEditComment(e.target.value)}
                       className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 resize-none transition-all"
                       placeholder="Review content..."
                    />
                 </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button
                   onClick={() => setEditingReview(null)}
                   className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-all"
                 >
                    Cancel
                 </button>
                 <button
                   onClick={handleSaveEdit}
                   className="px-5 py-2.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all flex items-center gap-2"
                 >
                    <Save size={14} /> Save Changes
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagementPage;
