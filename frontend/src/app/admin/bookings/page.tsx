'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Search, 
  MapPin, 
  Users, 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Eye, 
  Filter,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  User as UserIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BookingRegistryPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [lastSynced, setLastSynced] = useState<string>('');
  const [limit] = useState(20);

  const fetchBookings = useCallback(async (pageTarget = page) => {
    try {
      setLoading(true);
      const res = await adminService.getBookings({ 
        page: pageTarget, 
        limit,
        status: statusFilter === 'all' ? undefined : statusFilter, 
        search: debouncedSearch || undefined 
      });
      setBookings(res.bookings || []);
      setTotalPages(res.totalPages || 1);
      setTotalResults(res.total || 0);
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      toast.error('Data mismatch: Booking registry inaccessible');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, limit, page]);

  useEffect(() => {
    fetchBookings(1);
    setPage(1);
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    if (page > 1) fetchBookings(page);
  }, [page]);

  const handleUpdateStatus = async (id: string, status: string) => {
    const originalStatus = bookings.find(b => b.id === id)?.status;
    
    // Optimistic update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    
    try {
      await adminService.updateBookingStatus(id, status);
      toast.success(`Booking marked as ${status.toUpperCase()}`);
      if (selectedBooking?.id === id) setSelectedBooking({...selectedBooking, status});
    } catch (err) {
      // Rollback
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: originalStatus } : b));
      toast.error('Update failed: Status synchronization denied');
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const configs: Record<string, { label: string, color: string }> = {
      pending: { label: 'PENDING', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      confirmed: { label: 'CONFIRMED', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
      completed: { label: 'ARCHIVED', color: 'bg-blue-100 text-blue-700 border-blue-200' },
      cancelled: { label: 'CANCELLED', color: 'bg-red-100 text-red-700 border-red-200' },
    };
    const config = configs[status] || configs.pending;
    return (
      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", config.color)}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 px-2 md:px-0">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 leading-none">Booking Registry</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                {totalResults} Total Reservations
              </span>
              <div className="h-1 w-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Sync Active
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-2 hidden lg:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Last Updated</p>
            <p className="text-xs font-bold text-gray-600 mt-1">{lastSynced || '--:--:--'}</p>
          </div>
          <button 
            onClick={() => fetchBookings()} 
            disabled={loading}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-600 hover:text-black flex items-center gap-2"
          >
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Filters & Table Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          
          {/* Controls */}
          <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between bg-gray-50/30">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'pending', label: 'Pending' },
                { id: 'confirmed', label: 'Confirmed' },
                { id: 'completed', label: 'Archived' },
                { id: 'cancelled', label: 'Cancelled' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all border",
                    statusFilter === tab.id 
                      ? "bg-black text-white border-black shadow-md" 
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative group w-full lg:min-w-[320px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Reservation # or Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Manifest</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Traveler</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Trip</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fulfillment</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-24">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Synchronizing Registry...</p>
                      </div>
                    </td>
                  </tr>
                ) : bookings.length > 0 ? (
                  bookings.map((b) => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={b.id} 
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-amber-500 font-bold text-xs ring-4 ring-gray-100">
                            #{b.bookingNumber?.toString().slice(-4) || '??'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">ORDER_{b.bookingNumber}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                              <Calendar size={10} /> {new Date(b.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-[10px] font-bold uppercase">
                            {b.user?.name?.slice(0, 2) || 'GU'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{b.user?.name || 'GUEST_NODE'}</div>
                            <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                              <Users size={10} /> {b.numberOfGuests} travelers
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-[200px]">
                        <div className="text-sm font-bold text-gray-900 truncate group-hover:text-amber-600 transition-colors">
                          {b.tripSnapshot?.title || 'Unknown Trip'}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {b.tripSnapshot?.location?.city || 'Remote'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-black hover:border-black transition-all"
                            onClick={() => setSelectedBooking(b)}
                          >
                            <Eye size={16} />
                          </button>
                          {b.status === 'pending' && (
                            <button 
                              className="p-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button 
                              className="p-2.5 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-24 text-center">
                      <div className="inline-flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                          <Search size={32} />
                        </div>
                        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">No matching reservations found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Showing <span className="text-black">{Math.min(bookings.length, limit)}</span> of <span className="text-black">{totalResults}</span> Results
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600 transition-all font-bold text-xs flex items-center gap-1"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                      page === i + 1 
                        ? "bg-black text-white shadow-lg" 
                        : "bg-white text-gray-400 hover:text-black border border-gray-200"
                    )}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))}
              </div>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-2 bg-white border border-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-600 transition-all font-bold text-xs flex items-center gap-1"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Audit Shell */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-12">
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               className="absolute inset-0 bg-black/60 backdrop-blur-md"
               onClick={() => setSelectedBooking(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] z-10 border border-gray-100"
            >
              {/* Modal Header */}
              <div className="p-4 md:p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6">
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-white px-3 py-1 rounded-lg border border-gray-100">Audit Sequence Verified</span>
                      <StatusBadge status={selectedBooking.status} />
                    </div>
                    <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter">Reservation #{selectedBooking.bookingNumber}</h2>
                    <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Transaction Record: {selectedBooking.id}</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-4 py-2 rounded-xl border-2 font-bold text-xs uppercase tracking-widest",
                      selectedBooking.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                    )}>
                      {selectedBooking.paymentStatus === 'paid' ? 'Settled' : 'Unpaid'}
                    </div>
                    <button 
                      className="w-10 h-10 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-all" 
                      onClick={() => setSelectedBooking(null)}
                    >
                      <XCircle size={20} />
                    </button>
                 </div>
              </div>
              
              <div className="p-4 md:p-8 sm:p-10 overflow-y-auto custom-scrollbar flex-1">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* User Info */}
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">
                        <UserIcon size={14} className="text-amber-500" /> Traveler Identity
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 leading-tight">{selectedBooking.user?.name}</div>
                        <div className="text-xs font-bold text-gray-400 lowercase truncate mt-0.5">{selectedBooking.user?.email}</div>
                        <div className="text-xs font-bold text-gray-400 mt-1">{selectedBooking.user?.phone || 'No phone record'}</div>
                      </div>
                    </div>

                    {/* Trip Info */}
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">
                        <MapPin size={14} className="text-amber-500" /> Targeted Experience
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{selectedBooking.tripSnapshot?.title}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                          {selectedBooking.tripSnapshot?.location?.city}, {selectedBooking.tripSnapshot?.location?.country}
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">
                        <Clock size={14} className="text-amber-500" /> Temporal Marker
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900 leading-tight">
                          {new Date(selectedBooking.selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                          {typeof selectedBooking.tripSnapshot?.duration === 'object' 
                            ? `${selectedBooking.tripSnapshot.durationDays || selectedBooking.tripSnapshot.duration?.days}D / ${selectedBooking.tripSnapshot.durationNights || selectedBooking.tripSnapshot.duration?.nights}N`
                            : (selectedBooking.tripSnapshot?.duration || 'Multi-day')} Session
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Pricing Grid */}
                 <div className="bg-white text-gray-900 rounded-2xl md:rounded-[2rem] p-4 md:p-8 sm:p-12 shadow-sm border border-gray-100 space-y-10 relative overflow-hidden mb-12">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.04]">
                      <CreditCard size={160} />
                    </div>
                    
                    <div className="relative z-10">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600 mb-8 flex items-center gap-3">
                        <div className="h-1 w-8 bg-amber-500" /> Financial Settlement Details
                      </h4>
                      
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-sm font-medium border-b border-gray-100 pb-4">
                            <span className="text-gray-500">Inventory Yield ({selectedBooking.numberOfGuests} Guests)</span>
                            <span className="text-gray-900 font-bold">₹{selectedBooking.basePrice?.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm font-medium border-b border-gray-100 pb-4">
                            <span className="text-gray-500">Platform Fee</span>
                            <span className="text-gray-900 font-bold">₹{selectedBooking.platformFee?.toLocaleString()}</span>
                         </div>
                         {selectedBooking.discount > 0 && (
                            <div className="flex justify-between items-center text-sm font-bold text-amber-600 border-b border-gray-100 pb-4">
                               <span>Promotional Reduction</span>
                               <span>-₹{selectedBooking.discount?.toLocaleString()}</span>
                            </div>
                         )}
                         
                         <div className="pt-8 flex justify-between items-end">
                            <div>
                               <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Total Settlement Amount</div>
                               <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Authorized via Secure Gateway Protocol</p>
                            </div>
                            <div className="text-3xl md:text-5xl font-black tabular-nums text-gray-900 tracking-tighter">₹{selectedBooking.totalPrice?.toLocaleString()}</div>
                         </div>
                      </div>
                    </div>
                 </div>

                 {/* Guest Manifesto */}
                 <div className="space-y-6 pb-6">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                      <Users size={18} className="text-amber-500" /> Traveler Manifesto
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {selectedBooking.guestDetails?.guests?.map((g: any, i: number) => (
                          <div key={i} className="p-5 border border-gray-100 bg-white rounded-2xl flex items-center justify-between group hover:border-amber-200 transition-all shadow-sm hover:shadow-md">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                                   <UserIcon size={20} />
                                </div>
                                <div>
                                   <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">ENTITY_0{i+1}</div>
                                   <div className="text-sm font-bold text-gray-900">{g.name}</div>
                                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{g.age} yrs // {g.gender}</div>
                                 </div>
                             </div>
                          </div>
                       ))}
                    </div>
                    {selectedBooking.guestDetails?.specialRequests && (
                       <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 mt-4">
                           <div className="text-[9px] font-black uppercase tracking-widest text-amber-700 mb-2">Special Operational Instructions:</div>
                           <p className="text-xs font-bold text-amber-900 leading-relaxed italic">"{selectedBooking.guestDetails.specialRequests}"</p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Modal Actions */}
              <div className="p-4 md:p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="flex gap-4 w-full sm:w-auto">
                      <button 
                         className="flex-1 px-8 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-emerald-600 shadow-xl shadow-black/10 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                         disabled={selectedBooking.status === 'confirmed'}
                         onClick={() => handleUpdateStatus(selectedBooking.id, 'confirmed')}
                      >
                         <CheckCircle size={14} />
                         {selectedBooking.status === 'confirmed' ? 'Protocol Confirmed' : 'Authorize Reservation'}
                      </button>
                      <button 
                         className="flex-1 px-8 py-4 bg-white border border-gray-200 text-gray-500 text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                         disabled={selectedBooking.status === 'cancelled'}
                         onClick={() => handleUpdateStatus(selectedBooking.id, 'cancelled')}
                      >
                         <XCircle size={14} />
                         Redact Order
                      </button>
                  </div>
                  <div className="text-right hidden sm:block">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Operation ID: {selectedBooking.id}</span>
                  </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BookingRegistryPage;
