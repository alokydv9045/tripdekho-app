"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";

import { vendorService } from "@/services/vendorService";
import { 
  BarChart3, TrendingUp, Users, 
  Calendar, Star, ArrowUpRight, 
  ArrowDownRight, ChevronRight,
  Filter, Download, LayoutDashboard
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from "recharts";
import Link from "next/link";


const VendorAnalyticsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [earningsData, setEarningsData] = useState<any[]>([]);
  const [vendorTrips, setVendorTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const vendorData = await vendorService.getCurrentVendor();
        const vendorId = vendorData.data.id;

        const [dashboardData, analyticsData, tripsData] = await Promise.all([
          vendorService.getDashboard(vendorId),
          vendorService.getEarnings(vendorId),
          vendorService.getVendorTrips(vendorId)
        ]);

        setStats(dashboardData.data.stats);
        
        const rawEarnings = analyticsData.data || [];
        const chartData = rawEarnings.map((item: any) => ({
          name: item.month || item.id,
          revenue: item.amount || item.total || 0,
          bookings: item.count || 0
        }));
        
        setEarningsData(chartData);
        setVendorTrips((tripsData.data || []).slice(0, 3));
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PremiumLoader />;

  const mainStats = [
    { title: "Total Revenue", value: `â‚¹${stats?.totalEarnings?.toLocaleString() || '0'}`, icon: TrendingUp, trend: "+12.5%", isUp: true },
    { title: "Total Bookings", value: stats?.totalBookings || '0', icon: Users, trend: "+8.2%", isUp: true },
    { title: "Avg Rating", value: stats?.avgRating || '4.8', icon: Star, trend: "0.2", isUp: true },
    { title: "Conversion Rate", value: "3.2%", icon: ActivityIcon, trend: "-0.4%", isUp: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">


      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Link href="/vendor/dashboard" className="hover:text-amber-500">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900">Analytics</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-[0.9]">
              Performance <span className="text-amber-500">Insights</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Deep dive into your business metrics</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="h-12 px-6 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
                <Filter size={14} /> Last 30 Days
             </button>
             <button className="h-12 w-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-900/20 hover:scale-105 transition-all">
                <Download size={18} />
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {mainStats.map((stat, idx) => (
             <div key={idx} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-gray-200/50 group hover:border-amber-200 transition-all">
               <div className="flex justify-between items-start mb-6">
                 <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-amber-500 group-hover:bg-amber-50 transition-all">
                   <stat.icon className="w-6 h-6" />
                 </div>
                 <div className={`flex items-center gap-1 text-[10px] font-black ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.trend}
                 </div>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
               <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
             </div>
           ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
           {/* Revenue Chart */}
           <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-2xl shadow-gray-200/50">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Revenue Trend</h3>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-amber-400" />
                       <span className="text-[10px] font-black uppercase text-gray-400">Total Revenue</span>
                    </div>
                 </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px'}}
                      itemStyle={{fontWeight: 900, textTransform: 'uppercase', fontSize: '10px'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#fbbf24" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Bookings Chart */}
           <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-2xl shadow-gray-200/50">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Booking Volume</h3>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-900" />
                    <span className="text-[10px] font-black uppercase text-gray-400">New Bookings</span>
                 </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}}
                      dx={-10}
                    />
                    <Tooltip 
                      cursor={{fill: '#f9fafb'}}
                      contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px'}}
                      itemStyle={{fontWeight: 900, textTransform: 'uppercase', fontSize: '10px'}}
                    />
                    <Bar 
                      dataKey="bookings" 
                      fill="#111827" 
                      radius={[10, 10, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[40px] p-10 shadow-2xl shadow-gray-200/50">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Trip Performance</h3>
              <div className="space-y-6">
                 {vendorTrips.length > 0 ? vendorTrips.map((trip: any, idx: number) => (
                   <div key={trip.id || idx} className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] group hover:bg-amber-400 transition-all cursor-pointer">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:text-amber-500 transition-all">
                            0{idx + 1}
                         </div>
                         <div>
                            <h4 className="font-black text-gray-900 uppercase tracking-tight group-hover:text-black">
                               {trip.title}
                            </h4>
                            <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-black/60">
                               <span>{trip.status || 'Active'}</span>
                               <span>{trip.durationDays || 0}D / {trip.durationNights || 0}N</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-black tracking-tighter group-hover:text-black">₹{trip.price?.amount?.toLocaleString() || '—'}</p>
                         <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest group-hover:text-black/60">{trip.status === 'published' ? 'Live' : trip.status}</p>
                      </div>
                   </div>
                 )) : (
                   <p className="text-sm font-bold text-gray-400 text-center py-8">No trips yet — <a href="/vendor/trips/new" className="text-amber-500 underline">Create your first trip</a></p>
                 )}
              </div>
           </div>

           <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl shadow-gray-900/20 flex flex-col justify-between">
              <div>
                 <h4 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-8">Quick Advice</h4>
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Optimized Pricing</p>
                       <p className="text-sm font-bold leading-relaxed">Lowering your "Kasol" trip price by 5% could increase bookings by 15% based on seasonal trends.</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer Focus</p>
                       <p className="text-sm font-bold leading-relaxed">Respond to your 4 pending reviews to improve your profile trust score by 8%.</p>
                    </div>
                 </div>
              </div>
              <button className="mt-12 w-full py-5 bg-amber-400 text-black font-black text-sm uppercase tracking-widest rounded-3xl hover:bg-white transition-all">
                 Upgrade to Pro
              </button>
           </div>
        </div>
      </main>

      
    </div>
  );
};

const ActivityIcon = (props: any) => <BarChart3 {...props} />;

export default VendorAnalyticsPage;

