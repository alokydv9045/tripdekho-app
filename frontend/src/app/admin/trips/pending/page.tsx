"use client";

import React, { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Tag, 
  Calendar, 
  MoreVertical, 
  ArrowLeft,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const PendingTripsPage = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingTrips();
  }, []);

  const fetchPendingTrips = async () => {
    setLoading(true);
    try {
      // Fetching all trips and filtering for pending to ensure 100% accuracy
      const data = await adminService.getTrips({ status: 'pending' });
      const pendingTrips = (data.trips || []).filter((t: any) => t.status === 'pending');
      setTrips(pendingTrips);
    } catch (error) {
      toast.error("Failed to fetch pending trips");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (tripId: string, status: 'approved' | 'rejected') => {
    setProcessingId(tripId);
    try {
      await adminService.updateTripStatus(tripId, status);
      toast.success(`Trip ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      setTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs & Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
             <Link 
               href="/admin/trips" 
               className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-amber-500 transition-colors"
             >
               <ArrowLeft size={14} /> Back to Moderation
             </Link>
             <div>
               <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight uppercase">
                 Approval <span className="text-amber-500">Queue</span>
               </h1>
               <div className="flex items-center gap-3 mt-2">
                 <div className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                   {trips.length} Itineraries awaiting verification
                 </p>
               </div>
             </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verifying records...</p>
          </div>
        ) : trips.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {trips.map((trip) => (
              <div 
                key={trip.id}
                className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col lg:flex-row group hover:border-amber-200 transition-all duration-500"
              >
                {/* Trip Preview */}
                <div className="relative w-full lg:w-96 h-64 lg:h-auto shrink-0 overflow-hidden">
                  <Image 
                    src={(trip.thumbnail?.url && trip.thumbnail.url.trim() !== "") ? trip.thumbnail.url : (trip.images?.[0]?.url && trip.images[0].url.trim() !== "") ? trip.images[0].url : (typeof trip.images?.[0] === 'string' && trip.images[0].trim() !== "") ? trip.images[0] : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80'} 
                    alt={trip.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    {(Array.isArray(trip.category) ? trip.category : typeof trip.category === 'string' ? trip.category.split(',') : []).slice(0, 2).map((cat: string) => (
                      <span key={cat} className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
                        {cat.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-10 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
                           {trip.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin size={14} className="text-amber-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                             {trip.location?.city}, {trip.location?.country}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-t border-gray-50 pt-6">
                         <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-amber-500" /> {trip.durationDays || trip.duration?.days}D / {trip.durationNights || trip.duration?.nights}N
                         </div>
                         <div className="flex items-center gap-2">
                            <Tag size={14} className="text-amber-500" /> ₹{trip.price?.amount?.toLocaleString()}
                         </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-black font-black text-xs uppercase">
                             {trip.vendor?.businessName?.charAt(0) || <Briefcase size={14} />}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Vendor Account</p>
                             <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                {trip.vendor?.businessName || "Unknown Partner"}
                             </p>
                          </div>
                       </div>
                       <p className="text-xs font-bold text-gray-500 line-clamp-3 leading-relaxed">
                          {trip.description}
                       </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-50">
                     <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                        <Clock size={14} /> Pending Review
                     </div>

                     <div className="flex gap-4">
                        <button 
                          disabled={!!processingId}
                          onClick={() => handleUpdateStatus(trip.id, 'approved')}
                          className="px-10 h-14 bg-green-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 flex items-center gap-2"
                        >
                           {processingId === trip.id ? "Processing..." : <>Approve Trip <CheckCircle2 size={16} /></>}
                        </button>
                        <button 
                          disabled={!!processingId}
                          onClick={() => handleUpdateStatus(trip.id, 'rejected')}
                          className="px-10 h-14 bg-white text-red-500 border border-red-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-50 transition-all flex items-center gap-2"
                        >
                           Reject <XCircle size={16} />
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200">
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle2 size={48} />
             </div>
             <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Queue Is Empty</h3>
             <p className="text-sm font-bold text-gray-400 max-w-sm mx-auto mt-2 uppercase tracking-widest">
                All itineraries have been processed. Great job on the moderation!
             </p>
             <Link href="/admin/trips" className="inline-block mt-10 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-500 hover:text-black transition-all">
                Return to Dashboard
             </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingTripsPage;
