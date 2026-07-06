"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";

import { vendorService } from "@/services/vendorService";
import { bookingService } from "@/services/bookingService";
import { 
  Search, Filter, Calendar, Users, 
  MapPin, CheckCircle2, XCircle, Clock, 
  ChevronRight, MoreVertical, ExternalLink,
  Download, MessageSquare, Briefcase, ChevronDown, ChevronUp, Map
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

const VendorBookingsPage = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedTrips, setExpandedTrips] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const vendorData = await vendorService.getCurrentVendor();
        const vendorId = vendorData.data.id;
        
        // Fetch trips and bookings in parallel
        const [tripsRes, bookingsRes] = await Promise.all([
          vendorService.getVendorTrips(vendorId),
          vendorService.getVendorBookings(vendorId)
        ]);

        setTrips(tripsRes.data?.data || tripsRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        toast.error("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      if (status === 'confirmed') {
        await bookingService.confirmPayment(id);
      } else {
        await bookingService.cancelBooking(id);
      }
      
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Booking ${status} successfully`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const toggleTripExpand = (tripId: string) => {
    setExpandedTrips(prev => ({
      ...prev,
      [tripId]: !prev[tripId]
    }));
  };

  // Group bookings by trip
  const groupedTrips = trips.map(trip => {
    const tripBookings = bookings.filter(b => b.trip?.id === trip.id);
    const totalRevenue = tripBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    const pendingCount = tripBookings.filter(b => b.status === 'pending').length;

    // Filter bookings based on search and status
    const filteredBookings = tripBookings.filter(booking => {
      const matchesSearch = 
        booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return {
      ...trip,
      allBookings: tripBookings,
      filteredBookings,
      totalRevenue,
      pendingCount
    };
  });

  // Filter trips
  const filteredTrips = groupedTrips.filter(trip => {
    const tripMatchesSearch = trip.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter !== "all") {
      return trip.filteredBookings.length > 0;
    }
    if (searchTerm) {
      return tripMatchesSearch || trip.filteredBookings.length > 0;
    }
    return true; // If no filters applied, show all trips
  });

  if (loading) return <PremiumLoader />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Link href="/vendor/dashboard" className="hover:text-amber-500">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900">Bookings by Trip</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-[0.9]">
              Reservation <span className="text-amber-500">Center</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Manage your traveler bookings grouped by trip</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="h-12 px-6 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
                <Download size={14} /> Export Manifest
             </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <div className="md:col-span-2 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search by trip title, customer name, or booking ID..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full h-14 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-amber-400 transition-all font-bold text-sm shadow-sm"
             />
           </div>
           
           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="h-14 px-6 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:border-amber-400 transition-all shadow-sm cursor-pointer"
           >
             <option value="all">All Status</option>
             <option value="pending">Pending Review</option>
             <option value="confirmed">Confirmed</option>
             <option value="cancelled">Cancelled</option>
           </select>

           <div className="flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm px-4">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trips: {filteredTrips.length}</span>
           </div>
        </div>

        {/* Trips List */}
        <div className="space-y-6">
           {filteredTrips.length > 0 ? (
             filteredTrips.map((trip, idx) => (
               <div key={trip.id} className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/50 group transition-all">
                  
                  {/* Trip Header (Clickable Accordion) */}
                  <div 
                    onClick={() => toggleTripExpand(trip.id)}
                    className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer hover:bg-gray-50 transition-colors relative"
                  >
                    {trip.pendingCount > 0 && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                    )}

                    <div className="flex items-center gap-6 z-10">
                       <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                          {trip.thumbnail?.url ? (
                            <Image src={trip.thumbnail.url} alt={trip.title} fill className="object-cover" />
                          ) : (
                            <Map className="w-8 h-8 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight line-clamp-1">{trip.title}</h3>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                               <MapPin size={10} /> {trip.location?.city || 'Location N/A'}
                             </span>
                             <span className="w-1 h-1 rounded-full bg-gray-300" />
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                               {trip.durationDays} Days / {trip.durationNights} Nights
                             </span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-8 z-10">
                       <div className="space-y-1 text-center hidden md:block">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bookings</p>
                          <p className="text-lg font-black text-gray-900">{trip.allBookings.length}</p>
                       </div>
                       <div className="space-y-1 text-center hidden md:block">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confirmed Rev</p>
                          <p className="text-lg font-black text-green-600">₹{trip.totalRevenue.toLocaleString()}</p>
                       </div>
                       <div className="space-y-1 text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending</p>
                          <p className={`text-lg font-black ${trip.pendingCount > 0 ? 'text-amber-500' : 'text-gray-300'}`}>
                            {trip.pendingCount}
                          </p>
                       </div>
                       <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          {expandedTrips[trip.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                       </button>
                    </div>
                  </div>

                  {/* Accordion Content: Bookings List */}
                  {expandedTrips[trip.id] && (
                    <div className="bg-gray-50/50 border-t border-gray-100 p-6 md:p-8">
                       {trip.filteredBookings.length > 0 ? (
                         <div className="space-y-4">
                           {trip.filteredBookings.map((booking: any) => (
                             <div key={booking.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:border-amber-300 transition-colors">
                               
                               <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <Users className="w-5 h-5 text-gray-400" />
                                 </div>
                                 <div>
                                   <p className="font-black text-gray-900 uppercase">{booking.user?.name || "Traveler Name"}</p>
                                   <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                      <span>{booking.numberOfGuests} Guests</span>
                                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                                      <span><Calendar size={10} className="inline mr-1" /> {new Date(booking.selectedDate).toLocaleDateString()}</span>
                                   </div>
                                 </div>
                               </div>

                               <div className="flex items-center gap-6">
                                 <div className="text-right hidden sm:block">
                                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                                   <p className="font-black text-gray-900">₹{booking.totalPrice?.toLocaleString()}</p>
                                 </div>
                                 
                                 <div className={`flex items-center justify-center w-28 h-8 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                    booking.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                    'bg-red-100 text-red-600'
                                  }`}>
                                    {booking.status}
                                 </div>

                                 <div className="flex gap-2">
                                    {booking.status === 'pending' && (
                                      <>
                                        <button 
                                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                          className="h-8 px-3 bg-gray-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-green-500 transition-all"
                                          title="Confirm"
                                        >
                                           <CheckCircle2 size={14} />
                                        </button>
                                        <button 
                                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                          className="h-8 px-3 bg-white border border-red-100 text-red-500 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all"
                                          title="Reject"
                                        >
                                           <XCircle size={14} />
                                        </button>
                                      </>
                                    )}
                                     <Link href={`/bookings/${booking.id}`}>
                                        <button className="h-8 w-8 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center hover:bg-amber-400 hover:text-black transition-all" title="View Booking Details">
                                           <ExternalLink size={14} />
                                        </button>
                                     </Link>
                                     <Link href={`/messages?customerId=${booking.user?.id}`}>
                                        <button className="h-8 w-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all" title="Message Customer">
                                           <MessageSquare size={14} />
                                        </button>
                                     </Link>
                                 </div>
                               </div>

                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                           <Briefcase className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching bookings found for this trip.</p>
                         </div>
                       )}
                    </div>
                  )}

               </div>
             ))
           ) : (
             <div className="py-20 bg-white border border-dashed border-gray-200 rounded-[40px] text-center space-y-6">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto">
                   <Briefcase className="w-10 h-10 text-gray-200" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-gray-900 uppercase">No trips or bookings found</h3>
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Share your trips to start receiving bookings</p>
                </div>
                <Link href="/vendor/trips/new">
                   <button className="px-8 py-4 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-amber-500 transition-all shadow-xl shadow-amber-200">
                      Create a Trip
                   </button>
                </Link>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default VendorBookingsPage;
