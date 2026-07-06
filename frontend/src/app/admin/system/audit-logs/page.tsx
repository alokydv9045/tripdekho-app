'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  User as UserIcon, 
  Clock, 
  Search,
  Filter,
  Eye,
  RotateCcw,
  History,
  ChevronLeft,
  ChevronRight,
  FileCode,
  ShieldCheck,
  Server,
  Activity,
  X,
  Database,
  Calendar,
  MoreHorizontal,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const AuditTrailPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [lastSynced, setLastSynced] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [limit] = useState(25);

  const [showClearModal, setShowClearModal] = useState(false);
  const [clearPeriod, setClearPeriod] = useState('30days');
  const [isClearing, setIsClearing] = useState(false);

  const fetchLogs = useCallback(async (pageTarget = page) => {
    try {
      setLoading(true);
      const params: any = { 
        page: pageTarget, 
        limit,
        moduleName: moduleFilter === 'all' ? undefined : moduleFilter,
        search: searchQuery || undefined
      };
      
      const response = await adminService.getAuditLogs(params);
      setLogs(response.logs || []);
      setTotalPages(response.totalPages || 1);
      setTotalResults(response.total || response.logs?.length || 0);
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  }, [page, moduleFilter, limit]);

  useEffect(() => {
    fetchLogs(1);
    setPage(1);
  }, [moduleFilter]);

  useEffect(() => {
     if (page > 1) fetchLogs(page);
  }, [page]);

  const handleClearLogs = async () => {
    try {
      setIsClearing(true);
      await adminService.clearAuditLogs(clearPeriod);
      toast.success('Audit logs cleared successfully');
      setShowClearModal(false);
      fetchLogs(1);
    } catch (err) {
      toast.error('Failed to clear logs');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <History className="text-black" size={24} />
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Audit Trail</h1>
            </div>
            <p className="text-sm text-gray-500">History of administrative activities and system modifications</p>
        </div>

        <div className="flex items-center gap-4">
            <div className="text-right hidden lg:block">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sync Integrity</p>
               <p className="text-sm font-bold text-emerald-600 uppercase tracking-tight">Active Connection</p>
            </div>
            <button 
              onClick={() => setShowClearModal(true)}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-all font-bold text-sm shadow-sm flex items-center gap-2"
            >
              <Trash2 size={16} />
              Clear Logs
            </button>
            <button 
              onClick={() => fetchLogs()} 
              disabled={loading}
              className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
            >
              <RotateCcw size={20} className={cn(loading && "animate-spin")} />
            </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-6">
            <div className="p-4 bg-gray-50 rounded-2xl text-black">
               <Database size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Log Entries</p>
               <p className="text-3xl font-bold text-gray-900">{totalResults}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-6">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
               <ShieldCheck size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Security Events</p>
               <p className="text-3xl font-bold text-gray-900">100% Verified</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-6">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
               <Activity size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Daily Operations</p>
               <p className="text-3xl font-bold text-gray-900">{totalResults > 0 ? `${totalResults} Tracked` : '0'}</p>
            </div>
          </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
         <div className="flex border-b md:border-b-0 border-gray-200 w-full md:w-auto gap-1">
            {['all', 'admin', 'vendor', 'system'].map(t => (
              <button 
                key={t}
                onClick={() => setModuleFilter(t)}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg",
                  moduleFilter === t ? "bg-black text-white" : "text-gray-400 hover:text-black"
                )}
              >
                {t}
              </button>
            ))}
         </div>
         <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchLogs(1)}
                  placeholder="Filter by admin identity or action..." 
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
              />
         </div>
      </div>

      {/* Log List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                   <th className="px-6 py-4">Identity</th>
                   <th className="px-6 py-4">Activity Description</th>
                   <th className="px-6 py-4">Module</th>
                   <th className="px-6 py-4">Timestamp</th>
                   <th className="px-6 py-4 text-right">Payload</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {loading ? (
                   Array(10).fill(0).map((_, i) => (
                     <tr key={i}><td colSpan={5} className="px-6 py-8 animate-pulse bg-gray-50/20" /></tr>
                   ))
                ) : logs.length > 0 ? logs.map((log) => (
                   <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                               <UserIcon size={14} />
                            </div>
                            <div>
                               <p className="font-bold text-gray-900">{log.user?.name || log.admin?.name || 'Platform System'}</p>
                               <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{log.user?.email || log.admin?.email || 'automated_agent'}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-gray-900 font-bold">{log.event || log.action}</p>
                         <p className="text-[10px] text-gray-400 uppercase tracking-tight italic mt-1">{log.ipAddress || 'Internal Loopback'}</p>
                      </td>
                      <td className="px-6 py-4">
                         <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[9px] font-black uppercase tracking-widest">
                            {log.moduleName || 'system'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                         <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {new Date(log.createdAt).toLocaleString()}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => setSelectedLog(log)}
                           className="p-2 text-gray-300 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                         >
                            <FileCode size={18} />
                         </button>
                      </td>
                   </tr>
                )) : (
                   <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-medium">No activity records found</td></tr>
                )}
             </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page {page} of {totalPages}</span>
           <div className="flex gap-2">
              <button 
                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button 
                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
           </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-8 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
                       <Shield size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-gray-900 tracking-tight">{selectedLog.event || selectedLog.action}</h2>
                       <p className="text-sm text-gray-500 font-medium">Action Payload & Data Trace</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-10 space-y-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Subject Identity</p>
                       <p className="text-sm font-bold text-gray-900">{selectedLog.user?.name || selectedLog.admin?.name || 'System'}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Event Timestamp</p>
                       <p className="text-sm font-bold text-gray-900">{new Date(selectedLog.createdAt).toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modification Data (JSON)</p>
                    <div className="bg-gray-900 rounded-2xl p-6 overflow-x-auto shadow-xl">
                       <pre className="text-emerald-400 text-xs font-mono">
                          {typeof selectedLog.details === 'string' 
                            ? (() => {
                                try { return JSON.stringify(JSON.parse(selectedLog.details), null, 2); }
                                catch(e) { return selectedLog.details; }
                              })()
                            : JSON.stringify(selectedLog.details || {}, null, 2)}
                       </pre>
                    </div>
                 </div>
              </div>

              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                 <button 
                    onClick={() => setSelectedLog(null)}
                    className="px-10 py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
                 >
                    Close Entry
                 </button>
              </div>
           </div>
        </div>
      )}
      
      {/* Clear Logs Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-red-100 text-red-600 rounded-full">
                    <AlertTriangle size={24} />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-gray-900">Clear Audit Logs</h3>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                 </div>
              </div>
              
              <div className="space-y-4 mb-8">
                 <label className="block text-sm font-bold text-gray-700">Select Time Period to Clear</label>
                 <select 
                    value={clearPeriod}
                    onChange={(e) => setClearPeriod(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm font-medium outline-none focus:border-red-500 transition-colors"
                 >
                    <option value="30days">Older than 30 Days</option>
                    <option value="60days">Older than 60 Days</option>
                    <option value="90days">Older than 90 Days</option>
                    <option value="all">Wipe Entire Audit Trail (DANGER)</option>
                 </select>
                 
                 {clearPeriod === 'all' && (
                   <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                     Warning: This will permanently delete ALL system audit logs and database traces. Use with extreme caution.
                   </p>
                 )}
              </div>
              
              <div className="flex justify-end gap-3">
                 <button 
                    onClick={() => setShowClearModal(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-all"
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={handleClearLogs}
                    disabled={isClearing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
                 >
                    {isClearing ? <RotateCcw size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    {isClearing ? 'Clearing...' : 'Confirm Deletion'}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default AuditTrailPage;
