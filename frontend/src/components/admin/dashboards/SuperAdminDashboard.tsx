'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, 
  Shield, 
  Search, 
  TrendingUp, 
  ArrowUpRight, 
  RefreshCw,
  Database,
  LayoutDashboard,
  Building2,
  Activity,
  CheckCircle,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SuperAdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [contentStats, setContentStats] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [analyticsData, vendorsData] = await Promise.all([
        adminService.getAnalytics(),
        adminService.getVendors({ limit: 5, status: 'pending' })
      ]);

      setData(analyticsData || null);
      setPendingVendors(vendorsData?.vendors || []);
      
      const { axiosPrivate } = await import('@/lib/axios');
      try {
        const contentRes = await axiosPrivate.get('/cms/vlogs');
        if (contentRes.data?.success) {
            const vlogs = contentRes.data.data;
            const totalViews = vlogs.reduce((sum: number, v: any) => sum + (v.views || 0), 0);
            const totalLikes = vlogs.reduce((sum: number, v: any) => sum + (v.likes || 0), 0);
            setContentStats({ totalVlogs: vlogs.length, totalViews, totalLikes });
        }
      } catch (err) {
        // CMS endpoint might not exist yet
      }

      setLastSynced(new Date());
    } catch (err: any) {
      toast.error('Failed to sync dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveVendor(id);
      toast.success('Vendor approved successfully');
      setPendingVendors(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      toast.error('Failed to approve vendor');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const results = await adminService.universalSearch(searchTerm);
      setSearchResults(results);
    } catch (err) {
      toast.error('Search failed');
    }
  };

  if (loading && !data) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Synchronizing Data...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20 px-2 md:px-4">
      
      {/* Header */}
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <LayoutDashboard className="text-black" size={24} />
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Super Admin Control</h1>
            </div>
            <div className="flex items-center gap-4 mt-1">
               <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  System Live
               </div>
               <p className="text-xs text-gray-400">Last updated: {lastSynced?.toLocaleTimeString()}</p>
            </div>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search anything..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all w-full shadow-sm"
            />
            {searchResults && (
               <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 p-2 overflow-hidden">
                  <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search Results</span>
                     <button onClick={() => setSearchResults(null)} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase">Close</button>
                  </div>
                  <div className="py-2">
                     {searchResults.users?.length > 0 && (
                        <Link href="/admin/users" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-all group">
                           <span className="text-sm font-semibold text-gray-700">{searchResults.users.length} Users Found</span>
                           <ArrowUpRight size={14} className="text-gray-300 group-hover:text-black" />
                        </Link>
                     )}
                     {searchResults.vendors?.length > 0 && (
                        <Link href="/admin/vendors" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-all group">
                           <span className="text-sm font-semibold text-gray-700">{searchResults.vendors.length} Vendors Found</span>
                           <ArrowUpRight size={14} className="text-gray-300 group-hover:text-black" />
                        </Link>
                     )}
                     {searchResults.trips?.length > 0 && (
                        <Link href="/admin/trips" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-all group">
                           <span className="text-sm font-semibold text-gray-700">{searchResults.trips.length} Trips Found</span>
                           <ArrowUpRight size={14} className="text-gray-300 group-hover:text-black" />
                        </Link>
                     )}
                     {(!searchResults.users?.length && !searchResults.vendors?.length && !searchResults.trips?.length) && (
                        <div className="px-4 py-8 text-center text-sm text-gray-400">No records match your search</div>
                     )}
                  </div>
               </div>
            )}
        </form>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
          { label: "Total Users", value: Number(data?.users?.total || 0), icon: Users, trend: data?.trends?.users || "+12%", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Vendors", value: Number(data?.vendors?.active || 0), icon: Building2, trend: data?.trends?.vendors || "+5%", color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Total Revenue", value: `₹${Number(data?.revenue?.total || 0).toLocaleString()}`, icon: TrendingUp, trend: data?.trends?.revenue || "+24%", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Commission", value: `₹${Number(data?.revenue?.totalCommission || 0).toLocaleString()}`, icon: Shield, trend: data?.trends?.commission || "+18%", color: "text-amber-600", bg: "bg-amber-50" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                   <div className={cn("p-2 rounded-lg", kpi.bg)}>
                      <kpi.icon size={20} className={kpi.color} />
                   </div>
                   <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ArrowUpRight size={12} /> {kpi.trend}
                   </div>
                </div>
                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{kpi.label}</div>
                 <div className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 tabular-nums">{kpi.value}</div>
             </div>
          </div>
        ))}
      </div>

      {/* Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                 <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Revenue Growth</h2>
                 <p className="text-lg font-bold">Monthly Performance Overview</p>
              </div>
              <button onClick={fetchDashboard} className="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-400">
                 <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
           </div>
           <div className="h-56 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                 <AreaChart data={data?.revenueByMonth?.map((s: any) => ({ 
                    date: s.id ? `${s.id.month}/${s.id.year}` : 'N/A', 
                    amount: Number(s.revenue || 0) 
                 })) || []}>
                    <defs>
                       <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                          <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-2xl p-4 md:p-8 border border-gray-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <div className="space-y-1">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">User Distribution</h2>
                  <p className="text-lg font-bold">Role Breakdown</p>
               </div>
               <Users size={18} className="text-gray-300" />
            </div>
            <div className="flex-1 min-h-[250px] relative">
               <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                 <PieChart>
                    <Pie
                       data={data?.userDistribution || [
                          { name: 'Customers', value: Number(data?.users?.total || 0) },
                          { name: 'Vendors', value: Number(data?.vendors?.total || 0) }
                       ]}
                       cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={10} dataKey="value" stroke="none"
                    >
                       {(data?.userDistribution || ['#000', '#64748b']).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#000' : index === 1 ? '#94a3b8' : '#e2e8f0'} />
                       ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #eee', fontSize: '11px' }} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                     <div className="text-2xl font-bold tracking-tight text-gray-900">{(Number(data?.users?.total || 0) + Number(data?.vendors?.total || 0)).toLocaleString()}</div>
                     <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Total</div>
                  </div>
               </div>
            </div>
            <div className="mt-8 space-y-3">
               <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-black rounded-full" />
                     <span className="font-semibold text-gray-500">Customers</span>
                  </div>
                  <span className="font-bold text-gray-900">{(Number(data?.users?.total || 0)).toLocaleString()}</span>
               </div>
               <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-slate-400 rounded-full" />
                     <span className="font-semibold text-gray-500">Vendors</span>
                  </div>
                  <span className="font-bold text-gray-900">{(Number(data?.vendors?.total || 0)).toLocaleString()}</span>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};
