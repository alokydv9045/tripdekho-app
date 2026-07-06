'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { 
  HelpCircle,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const SupportAdminDashboard = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await adminService.getTickets({ limit: 20 });
      setTickets(res.tickets || []);
    } catch (err: any) {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Support Queue...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex items-center gap-2 mb-8">
         <HelpCircle className="text-black" size={28} />
         <h1 className="text-3xl font-bold tracking-tight">Support Queue</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold text-gray-900">Recent Tickets</h2>
              <p className="text-xs text-gray-400">Manage user and vendor inquiries</p>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                   <tr>
                      <th className="px-6 py-4">Ticket Info</th>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {tickets.length > 0 ? tickets.map((ticket, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 line-clamp-1">{ticket.subject || 'No Subject'}</div>
                            <div className="text-[10px] text-gray-500 uppercase mt-0.5">ID: {ticket.id}</div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="font-medium text-gray-700">{ticket.user?.firstName || 'Unknown'} {ticket.user?.lastName || ''}</div>
                            <div className="text-[11px] text-gray-500">{ticket.user?.email || 'N/A'}</div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={cn(
                               "px-2 py-1 text-[10px] font-bold uppercase rounded-md",
                               ticket.status === 'open' ? 'bg-amber-50 text-amber-600' :
                               ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' :
                               'bg-gray-100 text-gray-600'
                            )}>
                               {ticket.status || 'open'}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold rounded-lg transition-all">
                               Review
                            </button>
                         </td>
                      </tr>
                   )) : (
                      <tr><td colSpan={4} className="p-20 text-center text-gray-400">The support queue is empty. Great job!</td></tr>
                   )}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );
};
