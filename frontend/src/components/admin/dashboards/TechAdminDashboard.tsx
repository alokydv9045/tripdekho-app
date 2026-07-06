'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Cpu, 
  Clock, 
  HardDrive,
  Network,
  Terminal,
  Activity as PulseIcon,
  CheckCircle2,
  Info
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

export const TechAdminDashboard = () => {
  const [health, setHealth] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const data = await adminService.getPlatformHealth();
      setHealth(data);
      
      const logsData = await adminService.getAuditLogs();
      setAuditLogs(logsData.logs || []);
      
      setHistory(prev => {
        const newPoint = {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: data.dbstatus === 'connected' ? 100 : 20,
            uptime: data.uptime || 0
        };
        const newHistory = [...prev, newPoint].slice(-20);
        return newHistory;
      });
    } catch (err) {
      toast.error('Failed to fetch system metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 45000); 
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    if (!seconds) return '0.00s';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Connecting to Infrastructure...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
         <PulseIcon className="text-black" size={28} />
         <h1 className="text-3xl font-bold tracking-tight">Tech Admin Pulse</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-emerald-50 rounded-lg">
                  <Database className="text-emerald-600" size={20} />
               </div>
               <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Database Cluster</h3>
            <p className="text-2xl font-bold text-gray-900">{health?.dbstatus === 'connected' ? 'Connected' : 'Offline'}</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-blue-50 rounded-lg">
                  <Cpu className="text-blue-600" size={20} />
               </div>
               <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Nominal</span>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CPU Utilization</h3>
            <p className="text-2xl font-bold text-gray-900">{health?.cpuUsage ?? 'N/A'}%</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-purple-50 rounded-lg">
                  <Clock className="text-purple-600" size={20} />
               </div>
               <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">System Uptime</h3>
            <p className="text-2xl font-bold text-gray-900">{formatUptime(health?.uptime)}</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-amber-50 rounded-lg">
                  <Network className="text-amber-600" size={20} />
               </div>
               <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Synced</span>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Memory Usage</h3>
            <p className="text-2xl font-bold text-gray-900">{health?.memoryUsage ?? 'N/A'} GB</p>
         </div>
      </div>

      {/* Stability Chart & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-black rounded-full" />
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Stability Index</h2>
                    <p className="text-xs text-gray-400 font-medium">Real-time connection reliability</p>
                  </div>
               </div>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                     <defs>
                        <linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                           <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10}} dy={10} />
                     <YAxis hide domain={[0, 120]} />
                     <Tooltip />
                     <Area type="monotone" dataKey="status" stroke="#000" strokeWidth={2} fillOpacity={1} fill="url(#colorStatus)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
               <Terminal size={18} className="text-gray-400" />
               <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">System Audit Logs</h2>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar">
               {auditLogs.map((log: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start group">
                     <span className="text-[10px] font-mono text-gray-400 mt-0.5">
                       {new Date(log.createdAt).toLocaleTimeString()}
                     </span>
                     <p className={cn(
                        "text-[11px] font-medium leading-relaxed flex-1",
                        log.type === 'success' ? 'text-emerald-700' : 
                        log.type === 'warning' ? 'text-amber-700' : 'text-gray-600'
                     )}>
                        {log.event}
                     </p>
                  </div>
               ))}
               {auditLogs.length === 0 && <p className="text-xs text-center text-gray-400 py-4 italic">No recent logs.</p>}
            </div>
         </div>
      </div>
    </div>
  );
};
