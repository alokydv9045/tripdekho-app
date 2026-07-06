'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Shield, 
  TrendingUp, 
  Building2,
  ArrowUpRight,
  LayoutDashboard
} from 'lucide-react';

export const GeneralAdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const analyticsData = await adminService.getAnalytics();
      setData(analyticsData || null);
    } catch (err: any) {
      toast.error('Failed to sync dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !data) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Synchronizing Overview...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex items-center gap-2 mb-8">
         <LayoutDashboard className="text-black" size={28} />
         <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: Number(data?.users?.total || 0), icon: Users, trend: "+12%", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Vendors", value: Number(data?.vendors?.active || 0), icon: Building2, trend: "+5%", color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Total Revenue", value: `₹${Number(data?.revenue?.total || 0).toLocaleString()}`, icon: TrendingUp, trend: "+24%", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Commission", value: `₹${Number(data?.revenue?.totalCommission || 0).toLocaleString()}`, icon: Shield, trend: "+18%", color: "text-amber-600", bg: "bg-amber-50" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
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
                <div className="text-3xl font-bold tracking-tight text-gray-900 tabular-nums">{kpi.value}</div>
             </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-8 border border-gray-200 bg-gray-50 rounded-xl">
         <p className="text-sm text-gray-500 font-medium">
            You are logged in with standard access. For deeper analytics, please navigate to your authorized modules from the sidebar.
         </p>
      </div>
    </div>
  );
};
