'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Shield, 
  RefreshCw,
  Hash,
  ArrowUpRight,
  CreditCard,
  CheckCircle
} from 'lucide-react';

export const FinanceAdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [payrollStats, setPayrollStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const analyticsData = await adminService.getAnalytics();
      setData(analyticsData || null);
      
      try {
         const payrollData = await adminService.getPayroll();
         setPayrollStats(payrollData.stats || null);
      } catch (err) {
         // Payroll endpoint might not exist yet
      }
    } catch (err: any) {
      toast.error('Failed to sync financial data');
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
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Compiling Financials...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex justify-between items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <Hash className="text-black" size={28} />
               <h1 className="text-3xl font-bold tracking-tight">Financial Hub</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">Global revenue and vendor payout distribution</p>
        </div>
        <button onClick={fetchDashboard} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
           <RefreshCw size={16} /> Sync Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Platform Revenue", value: `₹${Number(data?.revenue?.total || 0).toLocaleString()}`, icon: TrendingUp, trend: "+24%", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Net Commission", value: `₹${Number(data?.revenue?.totalCommission || 0).toLocaleString()}`, icon: Shield, trend: "+18%", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Pending Payouts", value: `₹${Number(payrollStats?.totalPending || 0).toLocaleString()}`, icon: CreditCard, trend: "-2%", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Cleared Payroll", value: `₹${Number(payrollStats?.totalCleared || 0).toLocaleString()}`, icon: CheckCircle, trend: "+5%", color: "text-purple-600", bg: "bg-purple-50" }
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

      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
         <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
               <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Revenue Growth</h2>
               <p className="text-lg font-bold">Monthly Performance Overview</p>
            </div>
         </div>
         <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
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
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};
