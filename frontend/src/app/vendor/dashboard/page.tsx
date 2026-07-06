"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { vendorService } from "@/services/vendorService";
import { 
  TrendingUp, Users, ArrowUpRight, DollarSign, 
  Layers, ChevronRight, Activity, Bell,
  CreditCard, AlertCircle, Star, MessageSquare
} from "lucide-react";
import Link from "next/link";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { toast } from "sonner";
import { 

  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const VendorDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [vendor, setVendor] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const vendorData = await vendorService.getCurrentVendor();
        const vendorId = vendorData.data.id;
        setVendor(vendorData.data);

        const dashboardData = await vendorService.getDashboard(vendorId);
        setStats(dashboardData.data.stats);
        setRecentBookings(dashboardData.data.recentBookings || []);

        // Fetch notifications
        try {
          const { axiosPrivate } = await import("@/lib/axios");
          const notifRes = await axiosPrivate.get("/notifications?limit=3");
          setNotifications(notifRes.data?.data || notifRes.data?.notifications || []);
        } catch { /* notifications are non-critical */ }
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.response?.data?.message || "Failed to load vendor portal.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <PremiumLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
         <div className="max-w-md w-full bg-amber-50/50 border border-amber-100 rounded-[40px] p-12 text-center shadow-2xl shadow-amber-100/20">
            <div className="w-20 h-20 bg-amber-100 rounded-[32px] flex items-center justify-center mx-auto mb-8">
               <AlertCircle className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">Portal Offline</h2>
            <p className="text-xs font-bold text-amber-600/60 uppercase tracking-widest leading-loose mb-10">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="h-14 px-10 bg-amber-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-black hover:text-white transition-all shadow-xl shadow-amber-200"
            >
               Retry Connection
            </button>
         </div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `₹${stats?.totalEarnings?.toLocaleString() || '0'}`, icon: DollarSign, color: "bg-green-100 text-green-600", growth: "+12%" },
    { title: "Total Bookings", value: stats?.totalBookings || '0', icon: Users, color: "bg-blue-100 text-blue-600", growth: "+5%" },
    { title: "Active Trips", value: stats?.totalTrips || '0', icon: Layers, color: "bg-amber-100 text-amber-600", growth: "0%" },
    { title: "Avg Rating", value: stats?.avgRating || '0', icon: Star, color: "bg-purple-100 text-purple-600", growth: "4.8" },
  ];
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
           <div className="space-y-2">
             <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full">Vendor Portal</span>
                <span className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest">
                  <Activity className="w-3 h-3" /> System Live
                </span>
             </div>
             <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">
                 Hello, <span className="text-amber-500">{vendor?.user?.name || user?.name || 'Vendor'}!</span>
              </h1>
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Manage your trips and track your growth</p>
           </div>
           
           <div className="flex items-center gap-3">
              {vendor && (vendor.kycStatus === 'approved' || vendor.kycStatus === 'verified') ? (
                <Link href="/vendor/trips/new">
                  <PrimaryButton className="h-14 px-8 font-black text-base shadow-xl shadow-amber-200">
                    Post New Trip <ArrowUpRight className="ml-2 w-5 h-5" />
                  </PrimaryButton>
                </Link>
              ) : (
                <PrimaryButton 
                  onClick={() => toast.error('Please complete your KYC verification to host a new trip.')}
                  className="h-14 px-8 font-black text-base shadow-xl shadow-gray-200 bg-gray-300 hover:bg-gray-400 text-gray-500 cursor-not-allowed opacity-70"
                >
                  Post New Trip <ArrowUpRight className="ml-2 w-5 h-5" />
                </PrimaryButton>
              )}
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-12">
           {statCards.map((card, idx) => (
             <div key={idx} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group">
               <div className="flex justify-between items-start mb-6">
                 <div className={`p-4 rounded-2xl ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                   <card.icon className="w-6 h-6" />
                 </div>
                 <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${card.title === 'Avg Rating' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                   {card.growth}
                 </span>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
               <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{card.value}</h3>
             </div>
           ))}
        </div>

        {/* Analytics Overview */}
        <div className="mb-12 bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl shadow-gray-200/40 transition-all hover:shadow-xl">
          <div className="flex items-center justify-between mb-10">
             <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900">Booking <span className="text-amber-500">Volume</span></h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Real-time performance analytics</p>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-amber-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reserved</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-gray-200" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Drafts</span>
                </div>
             </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart
                data={stats?.chartData?.length ? stats.chartData : [
                  { name: 'Mon', bookings: 0, draft: 0 },
                  { name: 'Tue', bookings: 0, draft: 0 },
                  { name: 'Wed', bookings: 0, draft: 0 },
                  { name: 'Thu', bookings: 0, draft: 0 },
                  { name: 'Fri', bookings: 0, draft: 0 },
                  { name: 'Sat', bookings: 0, draft: 0 },
                  { name: 'Sun', bookings: 0, draft: 0 },
                ]}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '10px',
                    fontWeight: '900',
                    textTransform: 'uppercase'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#f59e0b" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBookings)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="draft" 
                  stroke="#e5e7eb" 
                  strokeWidth={2}
                  fill="transparent" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
           {/* Recent Bookings Table */}
           <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200/50">
             <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-amber-500" /> Recent Bookings
                </h3>
                <Link href="/vendor/bookings" className="text-xs font-black text-amber-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="bg-gray-50/50">
                     <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Traveler</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Trip</th>
                     <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                     <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {recentBookings?.length > 0 ? (
                     recentBookings.map((booking: any, idx: number) => (
                       <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-8 py-6">
                           <div className="flex flex-col">
                             <span className="text-sm font-black text-gray-900 uppercase leading-none">{booking?.user?.name}</span>
                             <span className="text-[10px] font-bold text-gray-400 mt-1">{booking?.user?.email}</span>
                           </div>
                         </td>
                         <td className="px-8 py-6 text-sm font-bold text-gray-600">{booking?.trip?.title}</td>
                         <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             booking.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                           }`}>
                             {booking.status}
                           </span>
                         </td>
                         <td className="px-8 py-6 text-right text-sm font-black text-gray-900">₹{booking.vendorAmount}</td>
                         <td className="px-8 py-6 flex justify-center">
                            <Link href={`/messages?customerId=${booking.user?.id}`}>
                               <button className="h-8 w-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all" title="Message Customer">
                                  <MessageSquare size={14} />
                               </button>
                            </Link>
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={5} className="px-8 py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No bookings received yet</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>

           {/* Quick Actions & Sidebar */}
           <div className="space-y-8">
              {/* Payout Card */}
              <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse" />
                <h4 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-8">Earnings</h4>
                <div className="space-y-6">
                   <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4">
                      <CreditCard className="w-8 h-8 text-amber-400" />
                      <div>
                         <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Earned</p>
                         <p className="text-base font-black tracking-tighter">₹{stats?.totalEarnings?.toLocaleString() || '0'}</p>
                      </div>
                   </div>
                   <Link href="/vendor/payouts" className="block w-full h-14 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center">
                      View Payouts
                   </Link>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-xl shadow-gray-200/50">
                 <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Bell className="w-4 h-4 text-amber-400" /> Notifications
                 </h4>
                 <div className="space-y-4">
                    {notifications.length > 0 ? notifications.map((n: any, i: number) => (
                      <div key={i} className="flex gap-3">
                         <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                         <p className="text-xs font-bold text-gray-500 leading-relaxed">{n.message || n.title}</p>
                      </div>
                    )) : (
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No new notifications</p>
                    )}
                 </div>
                 <Link href="/vendor/messages" className="mt-6 block text-[10px] font-black text-amber-500 uppercase tracking-widest hover:underline">
                   View All
                 </Link>
              </div>
           </div>
        </div>
      </main>
  );
};

// Mock components to replace icons missing in imports if any
const Share2 = (props: any) => <ArrowUpRight {...props} />;

export default VendorDashboard;
