"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";

import { vendorService } from "@/services/vendorService";
import { tripService } from "@/services/tripService";
import { 
  Plus, Search, Filter, MoreVertical, 
  MapPin, Calendar, Users, Eye, 
  Edit3, Trash2, ArrowUpRight, CheckCircle2, Copy 
} from "lucide-react";
import Link from "next/link";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { toast } from "sonner";


const VendorTripsPage = () => {
  const [vendor, setVendor] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch trips and vendor info in parallel
        const [tripsData, vendorData] = await Promise.all([
          tripService.getMyTrips(),
          vendorService.getCurrentVendor().catch(() => null)
        ]);
        setTrips(tripsData.data || []);
        if (vendorData?.data) {
          setVendor(vendorData.data);
        }
      } catch (err) {
        console.error("Error fetching vendor data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;
    try {
      await tripService.deleteTrip(id);
      setTrips(trips.filter(t => t.id !== id));
      toast.success("Trip deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete trip.");
    }
  };

  const handleCopy = async (trip: any) => {
    try {
      const payload = {
        ...trip,
        title: `${trip.title} (Copy)`,
        status: 'draft',
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        slug: undefined,
        stats: undefined,
      };
      await tripService.createTrip(payload);
      toast.success('Trip duplicated! You can edit it from your trips list.');
      // Re-fetch trips
      const tripsData = await tripService.getMyTrips();
      setTrips(tripsData.data || []);
    } catch (err) {
      toast.error('Failed to duplicate trip.');
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) || trip.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <PremiumLoader />;

  return (
    <div className="min-h-screen bg-transparent text-gray-900">


      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
           <div className="space-y-2">
             <div className="flex items-center gap-3">
                <Link href="/vendor/dashboard" className="text-[10px] font-black text-gray-400 hover:text-amber-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                  Dashboard <ChevronRight className="w-3 h-3" />
                </Link>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Manage Trips</span>
             </div>
             <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">My Trips</h1>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Manage your published journeys and track their status</p>
           </div>
           
           {vendor && (vendor.kycStatus === 'approved' || vendor.kycStatus === 'verified') ? (
             <Link href="/vendor/trips/new">
               <PrimaryButton className="h-14 px-8 font-black text-base shadow-xl shadow-amber-200">
                 <Plus className="mr-2 w-5 h-5" /> Host New Trip
               </PrimaryButton>
             </Link>
           ) : (
             <PrimaryButton 
               onClick={() => toast.error('Please complete your KYC verification to host a new trip.')}
               className="h-14 px-8 font-black text-base shadow-xl shadow-gray-200 bg-gray-300 hover:bg-gray-400 text-gray-500 cursor-not-allowed opacity-70"
             >
               <Plus className="mr-2 w-5 h-5" /> Host New Trip
             </PrimaryButton>
           )}
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-gray-100 rounded-3xl p-4 mb-10 flex flex-col md:flex-row gap-4 shadow-sm">
           <div className="flex-1 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search trips by title or destination..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-amber-400 transition-all font-bold text-sm"
             />
           </div>
           <select 
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
             className="h-12 px-6 bg-gray-50 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:border-amber-400 transition-all shadow-sm cursor-pointer"
           >
             <option value="all">All Status</option>
             <option value="draft">Draft</option>
             <option value="published">Published</option>
             <option value="completed">Completed</option>
           </select>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredTrips.length > 0 ? (
             filteredTrips.map((trip: any, idx: number) => (
               <div key={idx} className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col group w-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)" }}>
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden shrink-0 w-full aspect-[4/3]">
                     <img 
                       src={trip.thumbnail?.url?.trim() ? trip.thumbnail.url : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800"} 
                       alt={trip.title}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                       onError={(e) => {
                         (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800";
                       }}
                     />
                     
                     {/* Status Badge */}
                     <div
                        className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                        style={{
                          background: trip.status === 'published' ? "rgba(34, 197, 94, 0.85)" : trip.status === 'completed' ? "rgba(59, 130, 246, 0.85)" : "rgba(245, 158, 11, 0.85)",
                          color: (trip.status === 'published' || trip.status === 'completed') ? "#fff" : "#000",
                          backdropFilter: "blur(4px)",
                          fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif",
                        }}
                     >
                        {trip.status}
                     </div>

                     {/* Vendor Actions Menu (replacing Heart icon) */}
                     <div className="absolute top-3 right-3 z-20">
                         <div className="relative group/menu">
                           <button className="p-2 bg-black/20 text-white hover:bg-black/40 rounded-full transition-all duration-300 backdrop-blur-md">
                             <MoreVertical className="w-4 h-4" />
                           </button>
                           {/* Simple Mini Menu */}
                           <div className="absolute right-0 top-full pt-2 w-40 opacity-0 scale-95 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:scale-100 group-hover/menu:pointer-events-auto transition-all">
                             <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden flex flex-col">
                               <Link href={`/vendor/trips/${trip.id}/edit`} className="px-4 py-2.5 text-left text-[12px] font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                 <Edit3 className="w-3.5 h-3.5 text-amber-500" /> Edit
                               </Link>
                               <button 
                                onClick={() => handleDelete(trip.id)}
                                className="px-4 py-2.5 text-left text-[12px] font-bold hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
                               >
                                 <Trash2 className="w-3.5 h-3.5" /> Delete
                               </button>
                               <button 
                                onClick={() => handleCopy(trip)}
                                className="px-4 py-2.5 text-left text-[12px] font-bold hover:bg-blue-50 text-blue-600 transition-colors flex items-center gap-2"
                               >
                                 <Copy className="w-3.5 h-3.5" /> Copy Trip
                               </button>
                             </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center flex-grow p-4 pt-3.5">
                     {/* Duration & Location */}
                     <div className="flex items-center justify-between gap-1 text-[12px] mb-1.5" style={{ color: "#5e5e5e", fontFamily: "var(--font-vietnam), 'Be Vietnam Pro', sans-serif" }}>
                        <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span>{trip.durationNights || trip.duration?.nights || 0}N / {trip.durationDays || trip.duration?.days || 0}D</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-70 text-[11px] font-bold">
                           <MapPin className="w-3 h-3" /> {trip.location?.city}
                        </div>
                     </div>

                     {/* Title */}
                     <h3 className="font-bold leading-snug mb-2.5 line-clamp-2 text-[14px] min-h-[40px]" style={{ color: "#191c1d", fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}>
                        {trip.title}
                     </h3>

                     {/* Tags (Category & Difficulty) */}
                     <div className="flex flex-wrap gap-1.5 mb-2.5">
                       {(Array.isArray(trip.category) ? trip.category : typeof trip.category === 'string' ? trip.category.split(',').map((c: string) => c.trim()).filter(Boolean) : []).slice(0, 2).map((cat: string) => (
                         <span key={cat} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                           {cat}
                         </span>
                       ))}
                       {((Array.isArray(trip.category) ? trip.category : typeof trip.category === 'string' ? trip.category.split(',') : [])).length > 2 && (
                         <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-gray-100">
                           +{(Array.isArray(trip.category) ? trip.category : trip.category.split(',')).length - 2}
                         </span>
                       )}
                       {trip.difficulty && trip.difficulty !== 'none' && (
                         <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                           {trip.difficulty}
                         </span>
                       )}
                     </div>

                     {/* Pricing & Bookings */}
                     <div className="flex items-baseline justify-between gap-2 mb-3">
                        <div className="flex items-baseline gap-2">
                            <span className="text-[16px] font-extrabold" style={{ color: "#191c1d", fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', sans-serif" }}>
                               ₹{trip.price?.amount?.toLocaleString('en-IN') || 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[11px] font-bold">
                            {trip.stats?.bookings || 0} Bookings
                        </div>
                     </div>

                     {/* Action Link */}
                     <div className="pt-3 mt-auto border-t border-gray-100 flex items-center justify-between text-[11px]" style={{ color: "#5e5e5e", fontFamily: "var(--font-vietnam), 'Be Vietnam Pro', sans-serif" }}>
                         <div className="flex items-center gap-1 opacity-70">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            <span>Base Price</span>
                         </div>
                         <Link href={`/trips/${trip.slug}`} className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 font-bold">
                             View live <ArrowUpRight className="w-3 h-3" />
                         </Link>
                     </div>
                  </div>
               </div>
             ))
           ) : (
             <div className="col-span-full py-20 text-center space-y-6 bg-white border border-dashed border-gray-200 rounded-[40px]">
                <div className="w-20 h-20 bg-gray-50 rounded-[24px] flex items-center justify-center mx-auto">
                   <Calendar className="w-10 h-10 text-gray-300" />
                 </div>
                <div className="space-y-1">
                   <h3 className="text-xl font-black text-gray-900 uppercase">No trips found</h3>
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Start your vendor journey by hosting your first trip</p>
                </div>
             </div>
           )}
        </div>
      </main>

      
    </div>
  );
};

// Simple Chevron for breadcrumbs if not standard in lucide
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default VendorTripsPage;

