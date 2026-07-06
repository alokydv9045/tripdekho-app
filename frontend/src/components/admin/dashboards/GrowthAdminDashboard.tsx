'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Tag, 
  Megaphone,
  CheckCircle,
  XCircle
} from 'lucide-react';

export const GrowthAdminDashboard = () => {
  const [promos, setPromos] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrowthData = async () => {
    try {
      setLoading(true);
      const [promosData, campaignsData] = await Promise.all([
        adminService.getPromoCodes({ limit: 10 }).catch(() => ({ promos: [] })),
        adminService.getCampaigns({ limit: 10 }).catch(() => ({ campaigns: [] }))
      ]);
      setPromos(promosData.promos || []);
      setCampaigns(campaignsData.campaigns || []);
    } catch (err: any) {
      toast.error('Failed to sync growth data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowthData();
  }, []);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Growth Metrics...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex items-center gap-2 mb-8">
         <TrendingUp className="text-black" size={28} />
         <h1 className="text-3xl font-bold tracking-tight">Growth Engine</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Active Campaigns */}
         <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-6">
               <Megaphone className="text-purple-600" size={24} />
               <h2 className="text-lg font-bold">Active Campaigns</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
               {campaigns.length > 0 ? campaigns.map((campaign, i) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">{campaign.title}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded-md">Live</span>
                     </div>
                     <p className="text-xs text-gray-500 line-clamp-2">{campaign.description}</p>
                  </div>
               )) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                     <Megaphone size={40} className="opacity-20" />
                     <p className="text-sm font-medium">No active campaigns</p>
                  </div>
               )}
            </div>
         </div>

         {/* Promo Codes */}
         <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col h-[500px]">
            <div className="flex items-center gap-3 mb-6">
               <Tag className="text-blue-600" size={24} />
               <h2 className="text-lg font-bold">Promo Codes</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
               {promos.length > 0 ? promos.map((promo, i) => (
                  <div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                     <div>
                        <div className="font-bold font-mono text-gray-900">{promo.code}</div>
                        <div className="text-[10px] text-gray-500 uppercase mt-1">{promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `₹${promo.discountValue} OFF`}</div>
                     </div>
                     {promo.isActive ? <CheckCircle size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-gray-300" />}
                  </div>
               )) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                     <Tag size={40} className="opacity-20" />
                     <p className="text-sm font-medium">No promo codes found</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
