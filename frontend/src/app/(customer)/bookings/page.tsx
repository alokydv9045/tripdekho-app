"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { bookingService } from "@/services/index";
import { Calendar, Users, MapPin, Tag, Clock, MessageSquare, Star, Plane, TrendingUp, IndianRupee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReviewModal from "@/components/shared/ReviewModal";
import { toast } from "sonner";
import { fixImageUrl } from "@/lib/utils/formatters";

export default function BookingsPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings();
      setBookings(data?.data?.bookings || data?.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Compute derived stats
  const totalSpent = bookings.reduce((acc, b) => acc + (parseFloat(b.totalPrice) || 0), 0);
  const upcoming = bookings.filter(b => b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'pending');
  const completed = bookings.filter(b => b.status?.toLowerCase() === 'completed');

  return (
    <div className="min-h-screen bg-[#FFFBF0]">
      
      {reviewBooking && (
        <ReviewModal 
          tripId={reviewBooking.trip?.id}
          tripTitle={reviewBooking.trip?.title}
          bookingId={reviewBooking.id}
          onClose={() => setReviewBooking(null)}
          onSuccess={fetchBookings}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="mb-10 relative">
          <p className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 font-mono">Your Journey Log</p>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase relative select-none">
            <span className="font-caveat font-normal capitalize text-amber-500 tracking-normal block text-4xl md:text-5xl -mb-3 md:-mb-5 pl-1 rotate-[-2deg]">My</span>
            <span className="font-marker font-normal tracking-wide text-gray-900 text-5xl md:text-7xl">ADVENTURES</span>
          </h1>
        </div>

        {/* Stats Banner */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: Plane, label: 'Total Trips', value: bookings.length, color: 'text-amber-500' },
              { icon: IndianRupee, label: 'Total Spent', value: `₹${Math.round(totalSpent).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: 'text-emerald-500' },
              { icon: Calendar, label: 'Upcoming', value: upcoming.length, color: 'text-blue-500' },
              { icon: Star, label: 'Completed', value: completed.length, color: 'text-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-4 hover:border-amber-200 transition-all duration-300 group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 space-y-8">
          {loading ? (
            /* Skeleton Loading */
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden flex flex-col md:flex-row animate-pulse">
                  <div className="w-full md:w-80 h-64 md:h-auto bg-gray-100 shrink-0" />
                  <div className="p-10 flex-grow space-y-4">
                    <div className="h-3 bg-gray-100 rounded-full w-1/4" />
                    <div className="h-8 bg-gray-100 rounded-full w-2/3" />
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="h-12 bg-gray-50 rounded-2xl" />
                      <div className="h-12 bg-gray-50 rounded-2xl" />
                      <div className="h-12 bg-gray-50 rounded-2xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length > 0 ? (
            bookings.map((booking: any, index: number) => (
              <div 
                key={booking.id} 
                className="group bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden hover:shadow-2xl hover:shadow-amber-100/50 transition-all duration-500 flex flex-col md:flex-row relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Status Badge Floating */}
                <div className="absolute top-6 left-6 z-10 md:hidden">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                </div>

                {/* Trip Image */}
                <div className="relative w-full md:w-80 h-64 md:h-auto shrink-0 overflow-hidden">
                  <Image 
                    src={fixImageUrl(booking.trip?.images?.[0]) || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80"} 
                    alt={booking.trip?.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                </div>
                
                {/* Booking Details */}
                <div className="p-8 md:p-10 flex-grow flex flex-col justify-between relative">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Adventure Tracked</p>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase group-hover:text-amber-600 transition-colors">
                          {booking.trip?.title}
                        </h3>
                      </div>
                      <span className={`hidden md:block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-50 rounded-xl text-amber-500 group-hover:bg-amber-50 transition-colors">
                           <Calendar size={16} />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Travel Date</p>
                           <span className="font-bold text-gray-900 text-xs">
                             {booking?.departure?.startDate ? new Date(booking.departure.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "TBD"}
                           </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-50 rounded-xl text-amber-500 group-hover:bg-amber-50 transition-colors">
                           <Users size={16} />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Travelers</p>
                           <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">{booking.numberOfGuests} Guests</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-50 rounded-xl text-amber-500 group-hover:bg-amber-50 transition-colors">
                           <Tag size={16} />
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Pass ID</p>
                           <span className="font-bold text-gray-900 text-xs uppercase tracking-widest">#{booking.id.slice(-8).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                       <div className="pr-6 border-r border-gray-100">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                         <p className="text-2xl font-black text-gray-950 tracking-tighter">₹{Math.round(parseFloat(booking.totalPrice) || 0).toLocaleString('en-IN')}</p>
                       </div>

                       {booking.status?.toLowerCase() === 'completed' && booking.reviewed && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100">
                             <Star size={12} className="fill-current" /> Reviewed
                          </div>
                       )}
                    </div>

                    <div className="flex items-center gap-3">
                      {booking.status?.toLowerCase() === 'completed' && !booking.reviewed && (
                        <button 
                          onClick={() => setReviewBooking(booking)}
                          className="flex items-center gap-2 px-8 py-3 bg-amber-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl shadow-amber-400/20"
                        >
                          Write a Review <MessageSquare size={14} />
                        </button>
                      )}
                      
                      <Link 
                        href={`/bookings/${booking.id}`}
                        className="px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                      >
                        Booking Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, #FFD133 0%, transparent 70%)`, backgroundSize: '400px 400px', backgroundPosition: 'center' }} />
              <div className="relative z-10">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-100">
                  <MapPin className="w-10 h-10 text-amber-300" />
                </div>
                <p className="text-amber-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">No Adventures Yet</p>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Your log is empty</h3>
                <p className="text-gray-400 mb-12 max-w-sm mx-auto font-medium leading-relaxed">Explore our premium curated trips and start your next legendary journey today.</p>
                <Link 
                  href="/trips" 
                  className="inline-flex items-center gap-3 px-12 py-5 bg-amber-400 hover:bg-black hover:text-white text-black font-black rounded-2xl transition-all duration-300 shadow-xl shadow-amber-400/20 text-xs uppercase tracking-widest"
                >
                  <Plane size={16} />
                  Find My First Trip
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
