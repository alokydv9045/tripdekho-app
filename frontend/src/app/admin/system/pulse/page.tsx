'use client';
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { exportToCsv } from '@/utils/exportCsv';
import { axiosPrivate } from '@/lib/axios';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  Database, 
  Cpu, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  Network,
  Terminal,
  Server,
  BarChart3,
  Lock,
  Activity as PulseIcon,
  ShieldAlert,
  Settings,
  Shield,
  Info
} from 'lucide-react';
import { 

  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const SystemIntegrityPage = () => {
  const [health, setHealth] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshInterval = useRef<any>(null);

  const fetchHealth = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const data = await adminService.getPlatformHealth();
      setHealth(data);
      
      const logsData = await adminService.getAuditLogs({ limit: 10 });
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

      if (showToast) toast.success('System metrics updated successfully');
    } catch (err) {
      if (showToast) toast.error('Failed to connect to system services');
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    refreshInterval.current = setInterval(() => fetchHealth(), 45000); 
    return () => clearInterval(refreshInterval.current);
  }, [fetchHealth]);

  const formatUptime = (seconds: number) => {
    if (!seconds) return '0.00s';
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  if (loading) return <PremiumLoader />;

  const handleGenerateReport = () => {
    if (!auditLogs.length && !health) {
      toast.error('No data available to export');
      return;
    }
    
    if (health) {
      exportToCsv('system_health.csv', [health]);
    }
    if (auditLogs.length > 0) {
      exportToCsv('system_audit_logs.csv', auditLogs.map(l => ({
        id: l.id,
        event: l.event,
        type: l.type,
        moduleName: l.moduleName,
        ipAddress: l.ipAddress,
        userName: l.user?.name || 'System',
        userEmail: l.user?.email || 'N/A',
        createdAt: new Date(l.createdAt).toLocaleString(),
      })));
    }
    
    toast.success('Integrity reports downloaded');
  };

  const handleMaintenance = async () => {
    try {
      await axiosPrivate.post('/admin/system/maintenance');
      toast.success('Maintenance mode toggled');
    } catch (e) {
      toast.error('Failed to toggle maintenance mode');
    }
  };

  const handleLockdown = async () => {
    if (!confirm('Are you sure you want to engage lockdown? All non-admin sessions will be invalidated immediately.')) return;
    try {
      await axiosPrivate.post('/admin/system/lockdown');
      toast.warning('Security lockdown engaged');
    } catch (e) {
      toast.error('Failed to engage lockdown');
    }
  };

  const handlePurgeCache = async () => {
    try {
      await axiosPrivate.post('/admin/system/purge-cache');
      toast.success('Cache purged successfully');
    } catch (e) {
      toast.error('Failed to purge cache');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <PulseIcon className="text-black" size={24} />
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Integrity</h1>
            </div>
            <p className="text-sm text-gray-500">Real-time infrastructure health and service status overview</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchHealth(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all text-gray-700 shadow-sm"
          >
            <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
            Sync Metrics
          </button>
          <button 
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Core Status Cards */}
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
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
               <Zap size={12} className="text-amber-500" /> Latency: 1.2ms
            </div>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div className="p-2 bg-blue-50 rounded-lg">
                  <Cpu className="text-blue-600" size={20} />
               </div>
               <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                  Number(health?.cpuUsage) < 70 ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50'
               )}>{Number(health?.cpuUsage) < 70 ? 'Nominal' : 'High'}</span>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">CPU Utilization</h3>
            <p className="text-2xl font-bold text-gray-900">{health?.cpuUsage ?? 'N/A'}%</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
               <HardDrive size={12} /> {health?.cpuCores || '—'} Cores
            </div>
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
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
               <CheckCircle2 size={12} className="text-emerald-500" /> Stable Session
            </div>
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
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
               <Info size={12} /> Total {health?.totalMemory || '—'} GB
            </div>
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
               <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={history}>
                     <defs>
                        <linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#000" stopOpacity={0.05}/>
                           <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                     <XAxis 
                        dataKey="time" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: '600', fill: '#94a3b8'}} 
                        dy={10}
                     />
                     <YAxis hide domain={[0, 120]} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                     />
                     <Area 
                        type="monotone" 
                        dataKey="status" 
                        stroke="#000" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#colorStatus)" 
                        isAnimationActive={false}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
               <Terminal size={18} className="text-gray-400" />
               <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Recent Events</h2>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
               {auditLogs.map((log: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start group">
                     <span className="text-[10px] font-mono text-gray-400 mt-0.5">
                       {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                     </span>
                     <div className="flex-1">
                        <p className={cn(
                           "text-[11px] font-medium leading-relaxed",
                           log.type === 'success' ? 'text-emerald-700' : 
                           log.type === 'warning' ? 'text-amber-700' : 'text-gray-600'
                        )}>
                           {log.event}
                        </p>
                     </div>
                  </div>
               ))}
               {auditLogs.length === 0 && (
                 <p className="text-xs text-gray-400 font-medium italic text-center py-4">No recent events.</p>
               )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
               <button className="w-full py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:text-black hover:border-black transition-all uppercase tracking-widest">
                  View Full Audit Log
               </button>
            </div>
         </div>
      </div>

      {/* Critical Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
         <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="flex items-center gap-3">
               <ShieldAlert className="text-black" size={20} />
               <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Administrative Controls</h2>
            </div>
         </div>
         
         <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-gray-900">
                  <Server size={18} className="text-gray-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Service Maintenance</h3>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Toggle platform maintenance mode to restrict public access while performing critical infrastructure updates.
               </p>
               <button 
                  onClick={handleMaintenance}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
               >
                  Toggle Maintenance
               </button>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 text-gray-900">
                  <Shield size={18} className="text-gray-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Security Lockdown</h3>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Immediately terminate all active sessions and block new authentication requests across the platform.
               </p>
               <button 
                  onClick={handleLockdown}
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
               >
                  Engage Lockdown
               </button>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 text-gray-900">
                  <RefreshCw size={18} className="text-gray-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Cache Purge</h3>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Clear all global CDN and application level cache buffers to force immediate data consistency.
               </p>
               <button 
                  onClick={handlePurgeCache}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
               >
                  Purge Cache
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SystemIntegrityPage;
