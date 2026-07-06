'use client';
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  BarChart3, 
  Download, 
  RefreshCw,
  Target,
  Globe,
  PieChart as PieChartIcon,
  ChevronRight,
  ArrowUpRight,
  Activity,
  CheckCircle,
  Clock
} from "lucide-react";
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { exportToCsv } from '@/utils/exportCsv';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { cn } from "@/lib/utils";


const AnalyticalReportsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('');

  const fetchAnalytics = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const analytics = await adminService.getAnalytics();
      setData(analytics);
      setLastSynced(new Date().toLocaleTimeString());
      if (showToast) toast.success("Analytics data updated successfully");
    } catch (error) {
      toast.error('Failed to refresh metrics');
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleExportData = () => {
    if (!data) {
      toast.error('No analytical data available to export');
      return;
    }
    
    const kpiRow = {
      users: data.users || 0,
      vendors: data.vendors || 0,
      trips: data.trips || 0,
      bookings: data.bookings || 0,
      totalRevenue: data.revenue?.total || 0,
      platformFees: data.revenue?.platformFees || 0
    };

    exportToCsv('analytics_report.csv', [kpiRow]);
    toast.success('Analytical report exported');
  };

  const kpis = [
    { 
      label: "Total Users", 
      value: data?.users?.total || 0, 
      icon: Users, 
      sub: "Registered Accounts", 
      trend: "+12.5%", 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "Active Trips", 
      value: data?.trips?.published || 0, 
      icon: Target, 
      sub: "Verified Listings", 
      trend: "+5.2%", 
      color: "text-emerald-600", 
      bg: "bg-emerald-50" 
    },
    { 
      label: "Gross Revenue", 
      value: `₹${((data?.revenue?.total || 0) / 1000).toFixed(1)}K`, 
      icon: CreditCard, 
      sub: "Total Platform Earnings", 
      trend: "+24.8%", 
      color: "text-amber-600", 
      bg: "bg-amber-50" 
    },
    { 
      label: "Total Bookings", 
      value: data?.bookings?.total || 0, 
      icon: TrendingUp, 
      sub: "Successful Reservations", 
      trend: "+18.1%", 
      color: "text-purple-600", 
      bg: "bg-purple-50" 
    },
  ];

  const revenueChartData = data?.revenueByMonth?.map((item: any) => ({
    date: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][item.id.month - 1]} ${item.id.year}`,
    amount: item.revenue
  })) || [];

  const bookingChartData = data?.bookings?.trends?.map((item: any) => ({
    date: `${item.id.day}/${item.id.month}`,
    count: item.count
  })) || [];

  if (loading) return <PremiumLoader />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <BarChart3 className="text-black" size={24} />
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytical Reports</h1>
            </div>
            <p className="text-sm text-gray-500">Comprehensive overview of platform growth and performance metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-2 hidden lg:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Updated</p>
            <p className="text-xs font-bold text-gray-900">{lastSynced || '--:--:--'}</p>
          </div>
          <button 
            onClick={() => fetchAnalytics(true)}
            disabled={isRefreshing}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
          >
            <RefreshCw size={18} className={cn(isRefreshing && "animate-spin")} />
          </button>
          <button 
            className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2"
            onClick={handleExportData}
          >
            <Download size={16} /> Export Reports
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {kpis.map((stat, i) => (
           <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-black transition-all group">
               <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-2.5 rounded-lg", stat.bg)}>
                      <stat.icon className={stat.color} size={20} />
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ArrowUpRight size={10} /> {stat.trend}
                    </div>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                 <p className="text-3xl font-bold text-gray-900 tabular-nums tracking-tight">{stat.value}</p>
                 <p className="text-[11px] text-gray-500 mt-2 font-medium flex items-center gap-1">
                   {stat.sub} <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                 </p>
               </div>
           </div>
         ))}
      </div>

      {/* Primary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Revenue Trends */}
         <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-black rounded-full" />
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Revenue Trends</h2>
                    <p className="text-xs text-gray-400 font-medium">Monthly performance overview</p>
                  </div>
               </div>
               <CheckCircle size={16} className="text-emerald-500" />
            </div>
            <div className="h-[320px] w-full">
               <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={revenueChartData}>
                     <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                           <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                     <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: '600', fill: '#94a3b8'}} 
                        dy={10}
                     />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                     />
                     <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#000" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Booking Volume */}
         <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-black rounded-full" />
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Booking Volume</h2>
                    <p className="text-xs text-gray-400 font-medium">Daily reservation density</p>
                  </div>
               </div>
               <Activity size={16} className="text-blue-500" />
            </div>
            <div className="h-[320px] w-full">
               <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={bookingChartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                     <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '600', fill: '#94a3b8'}} dy={10} />
                     <YAxis hide />
                     <Tooltip 
                        cursor={{fill: '#f8fafc', radius: 6}}
                        contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                     />
                     <Bar dataKey="count" fill="#000" radius={[6, 6, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* User Distribution */}
         <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">User Distribution</h2>
                <PieChartIcon size={16} className="text-gray-300" />
            </div>
            <div className="h-56 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                        <Pie
                            data={[
                                { name: 'Travelers', value: data?.users?.total || 0 },
                                { name: 'Vendors', value: data?.vendors?.total || 0 },
                                { name: 'Admins', value: 1 }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell fill="#000" />
                            <Cell fill="#94a3b8" />
                            <Cell fill="#cbd5e1" />
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-3">
                {[
                  { label: 'Travelers', count: data?.users?.total || 0, color: 'bg-black' },
                  { label: 'Vendors', count: data?.vendors?.total || 0, color: 'bg-slate-400' },
                  { label: 'Admins', count: 1, color: 'bg-slate-300' }
                ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-3">
                         <div className={cn("w-2 h-2 rounded-full", item.color)} />
                         <span className="text-xs font-semibold text-gray-500">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-900">{item.count}</span>
                   </div>
                ))}
            </div>
         </div>

         {/* Regional Performance */}
         <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Regional Performance</h2>
                <Globe size={16} className="text-gray-300" />
            </div>
            <div className="space-y-3">
               {[
                 { sector: 'Northern Region', activity: 'High', status: 'Optimal', yield: '+14.2%', color: 'bg-blue-500' },
                 { sector: 'Coastal Areas', activity: 'Medium', status: 'Steady', yield: '+18.5%', color: 'bg-emerald-500' },
                 { sector: 'Southern Hub', activity: 'Stable', status: 'Active', yield: '+4.1%', color: 'bg-amber-500' },
                 { sector: 'Eastern Sector', activity: 'Emerging', status: 'Growth', yield: '+22.9%', color: 'bg-purple-500' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-xl hover:border-gray-200 transition-all group">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 w-40">
                          <div className={cn("w-1 h-8 rounded-full", item.color)} />
                          <span className="text-xs font-bold text-gray-900">{item.sector}</span>
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Activity</span>
                            <span className="text-xs font-semibold text-gray-600">{item.activity}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Growth</span>
                           <div className="text-emerald-600 text-sm font-bold">{item.yield}</div>
                        </div>
                        <div className="p-2 rounded-lg bg-white border border-gray-100 text-gray-300 group-hover:text-black transition-all">
                           <ArrowUpRight size={16} />
                        </div>
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
               <button className="text-[10px] font-bold text-black hover:underline uppercase tracking-wider flex items-center gap-1">
                  Access Detailed System Logs <ChevronRight size={12} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnalyticalReportsPage;
