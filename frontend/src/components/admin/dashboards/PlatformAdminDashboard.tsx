'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { 
  Users, 
  Building2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

export const PlatformAdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const analyticsData = await adminService.getAnalytics();
      setData(analyticsData || null);
    } catch (err: any) {
      toast.error('Failed to sync platform data');
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
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Platform Scale...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex items-center gap-2 mb-8">
         <Users className="text-black" size={28} />
         <h1 className="text-3xl font-bold tracking-tight">Platform Scale</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Distribution */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
               <div className="space-y-1">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">User Distribution</h2>
                  <p className="text-lg font-bold">Role Breakdown</p>
               </div>
               <PieChartIcon size={18} className="text-gray-300" />
            </div>
            <div className="flex-1 min-h-[300px] relative">
               <ResponsiveContainer width="100%" height={300}>
                 <PieChart>
                    <Pie
                       data={data?.userDistribution || [
                          { name: 'Customers', value: Number(data?.users?.total || 0) },
                          { name: 'Vendors', value: Number(data?.vendors?.total || 0) }
                       ]}
                       cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={10} dataKey="value" stroke="none"
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
                     <div className="text-3xl font-bold tracking-tight text-gray-900">{(Number(data?.users?.total || 0) + Number(data?.vendors?.total || 0)).toLocaleString()}</div>
                     <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Total Accounts</div>
                  </div>
               </div>
            </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-black text-white rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Customer Base</h2>
                        <p className="text-xs text-gray-500 font-medium">Registered travellers</p>
                    </div>
                </div>
                <div className="text-4xl font-black">{Number(data?.users?.total || 0).toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Vendor Network</h2>
                        <p className="text-xs text-gray-500 font-medium">Approved partners</p>
                    </div>
                </div>
                <div className="text-4xl font-black">{Number(data?.vendors?.active || 0).toLocaleString()}</div>
                <div className="mt-4 flex items-center gap-2">
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold uppercase rounded-md">
                        {Number(data?.vendors?.total || 0) - Number(data?.vendors?.active || 0)} Pending
                    </span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
