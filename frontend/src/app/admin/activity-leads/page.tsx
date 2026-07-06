"use client";

import React, { useState, useEffect } from 'react';
import { axiosPrivate } from '@/lib/axios';
import { toast } from 'sonner';
import { Loader2, Search, Eye, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityLog {
  id: string;
  userId: string;
  action: 'SEARCH' | 'VIEW_TRIP' | 'VIEW_PAGE';
  details: any;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}

export default function ActivityLeadsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAction, setFilterAction] = useState<string>('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = `/activity/logs?page=${page}&limit=50${filterAction ? `&action=${filterAction}` : ''}`;
      const res = await axiosPrivate.get(url);
      setLogs(res.data.data.items);
      setTotalPages(res.data.data.lastPage);
    } catch (error) {
      toast.error('Failed to load activity leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filterAction]);

  const renderDetails = (log: ActivityLog) => {
    if (log.action === 'SEARCH') {
      return (
        <div className="flex flex-col gap-1">
          {log.details.q && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Query: {log.details.q}</span>}
          {log.details.city && <span className="text-xs bg-gray-100 px-2 py-1 rounded">City: {log.details.city}</span>}
          {log.details.category && <span className="text-xs bg-gray-100 px-2 py-1 rounded">Category: {log.details.category}</span>}
        </div>
      );
    }
    if (log.action === 'VIEW_TRIP') {
      return (
        <a href={`/trip/${log.details.tripSlug}`} target="_blank" rel="noreferrer" className="text-xs text-amber-600 underline hover:text-amber-800">
          {log.details.tripTitle || 'View Trip'}
        </a>
      );
    }
    return <span className="text-xs text-gray-500">No details</span>;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Activity Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Track what customers are searching for and viewing in real-time.</p>
        </div>
        
        <div className="flex gap-4">
          <select 
            value={filterAction} 
            onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
            className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:border-amber-400"
          >
            <option value="">All Activities</option>
            <option value="SEARCH">Searches</option>
            <option value="VIEW_TRIP">Trip Views</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Date & Time</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Customer</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Contact</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Action</th>
                <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                    <p className="text-sm font-semibold text-gray-400">Loading leads...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm font-semibold text-gray-500">
                    No activity found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
                      {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                    </td>
                    <td className="p-4">
                      {log.user ? (
                        <div>
                          <p className="text-sm font-bold text-gray-900">{log.user.name || 'Anonymous'}</p>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-gray-400">Guest</span>
                      )}
                    </td>
                    <td className="p-4">
                      {log.user ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-600">{log.user.phone || 'N/A'}</span>
                          <span className="text-xs text-gray-400">{log.user.email && !log.user.email.includes('guest_') ? log.user.email : 'Phone Authenticated'}</span>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-widest ${
                        log.action === 'SEARCH' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {log.action === 'SEARCH' ? <Search size={12} /> : <Eye size={12} />}
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      {renderDetails(log)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-sm font-semibold text-gray-500">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
