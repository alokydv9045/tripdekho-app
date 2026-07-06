'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { 
  Map,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const OperationsAdminDashboard = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOpsData = async () => {
    try {
      setLoading(true);
      const [tripsData, bookingsData] = await Promise.all([
        adminService.getTrips({ limit: 10, status: 'pending' }).catch(() => ({ trips: [] })),
        adminService.getBookings({ limit: 10, status: 'pending' }).catch(() => ({ bookings: [] }))
      ]);
      setTrips(tripsData.trips || []);
      setBookings(bookingsData.bookings || []);
    } catch (err: any) {
      toast.error('Failed to load operations data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpsData();
  }, []);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Operations Hub...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex items-center gap-2 mb-8">
         <Briefcase className="text-black" size={28} />
         <h1 className="text-3xl font-bold tracking-tight">Operations Hub</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Pending Trips */}
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[500px] overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
               <Map className="text-emerald-600" size={24} />
               <div>
                  <h2 className="text-sm font-bold text-gray-900">Trip Approvals</h2>
                  <p className="text-xs text-gray-400">Newly created itineraries requiring review</p>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
               {trips.length > 0 ? trips.map((trip, i) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 line-clamp-1">{trip.title}</span>
                     </div>
                     <p className="text-xs text-gray-500 mb-3">{trip.vendor?.businessName || 'Unknown Vendor'}</p>
                     <div className="flex gap-2">
                        <button className="flex-1 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-all">Approve</button>
                     </div>
                  </div>
               )) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                     <CheckCircle size={40} className="opacity-20" />
                     <p className="text-sm font-medium">All trips reviewed</p>
                  </div>
               )}
            </div>
         </div>

         {/* Pending Bookings */}
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[500px] overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
               <Briefcase className="text-blue-600" size={24} />
               <div>
                  <h2 className="text-sm font-bold text-gray-900">Pending Bookings</h2>
                  <p className="text-xs text-gray-400">Bookings awaiting vendor confirmation</p>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
               {bookings.length > 0 ? bookings.map((booking, i) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">Ref: {booking.id.slice(-6)}</span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase">Pending</span>
                     </div>
                     <p className="text-xs text-gray-500">{booking.trip?.title}</p>
                     <p className="text-xs text-gray-400 mt-1">Amt: ₹{booking.totalAmount}</p>
                  </div>
               )) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                     <CheckCircle size={40} className="opacity-20" />
                     <p className="text-sm font-medium">No pending bookings</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
