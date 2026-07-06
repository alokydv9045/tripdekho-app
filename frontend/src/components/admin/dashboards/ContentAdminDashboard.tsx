'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Users, Youtube, PenTool } from 'lucide-react';

export const ContentAdminDashboard = () => {
  const [contentStats, setContentStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { axiosPrivate } = await import('@/lib/axios');
      const contentRes = await axiosPrivate.get('/cms/vlogs');
      if (contentRes.data?.success) {
         const vlogs = contentRes.data.data;
         const totalViews = vlogs.reduce((sum: number, v: any) => sum + (v.views || 0), 0);
         const totalLikes = vlogs.reduce((sum: number, v: any) => sum + (v.likes || 0), 0);
         setContentStats({ totalVlogs: vlogs.length, totalViews, totalLikes });
      }
    } catch (err) {
      // Endpoint might be missing
      setContentStats({ totalVlogs: 0, totalViews: 0, totalLikes: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Content Engine...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex items-center gap-2 mb-8">
         <Youtube className="text-black" size={28} />
         <h1 className="text-3xl font-bold tracking-tight">Content Footprint</h1>
      </div>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
         <div className="bg-emerald-900 text-white rounded-xl p-6 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Content Footprint</p>
               <div className="flex items-end gap-2">
                  <span className="text-4xl font-black">{contentStats?.totalVlogs || 0}</span>
                  <span className="text-xs font-bold text-emerald-400 mb-1.5">ACTIVE VLOGS</span>
               </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Activity size={80} />
            </div>
         </div>
         <div className="bg-blue-900 text-white rounded-xl p-6 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Global Reach</p>
               <div className="flex items-end gap-2">
                  <span className="text-4xl font-black">{((contentStats?.totalViews || 0) / 1000).toFixed(1)}k</span>
                  <span className="text-xs font-bold text-blue-400 mb-1.5">TOTAL VIEWS</span>
               </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <TrendingUp size={80} />
            </div>
         </div>
         <div className="bg-amber-600 text-white rounded-xl p-6 shadow-xl border border-white/10 relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200 mb-4">Engagement Index</p>
               <div className="flex items-end gap-2">
                  <span className="text-4xl font-black">{contentStats?.totalLikes || 0}</span>
                  <span className="text-xs font-bold text-amber-200 mb-1.5">PLATFORM LIKES</span>
               </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Users size={80} />
            </div>
         </div>
      </motion.div>
    </div>
  );
};
