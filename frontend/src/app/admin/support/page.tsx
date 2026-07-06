'use client';

import React, { useState, useEffect } from 'react';
import { 
  Ticket as TicketIcon, 
  Clock, 
  CheckCircle2, 
  Search, 
  MessageSquare,
  ChevronRight,
  Send,
  X,
  User as UserIcon,
  LifeBuoy,
  Filter,
  ChevronLeft,
  Activity,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface Ticket {
  id: string;
  subject: string;
  customer: { name: string; email: string };
  priority: string;
  status: string;
  createdAt: string;
  messages?: any[];
}

export default function SupportManagementPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page,
        limit: 15,
        search: debouncedSearch
      };
      if (filter !== 'all') params.status = filter;
      const response = await adminService.getTickets(params);
      setTickets((response.tickets as unknown as Ticket[]) || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load support tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch]);

  useEffect(() => {
    fetchTickets();
  }, [filter, debouncedSearch, page]);

  const handleViewTicket = async (ticket: Ticket) => {
    try {
      const details = await adminService.getTicketDetail(ticket.id);
      setSelectedTicket(details as unknown as Ticket);
    } catch (err) {
      toast.error('Failed to load ticket details');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    try {
      await adminService.addTicketMessage(selectedTicket.id, replyText);
      toast.success('Reply sent successfully');
      setReplyText('');
      handleViewTicket(selectedTicket);
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedTicket) return;
    try {
      await adminService.updateTicket(selectedTicket.id, { status: newStatus });
      toast.success(`Ticket marked as ${newStatus}`);
      setSelectedTicket({...selectedTicket, status: newStatus});
      fetchTickets();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <LifeBuoy className="text-black" size={24} />
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Support System</h1>
            </div>
            <p className="text-sm text-gray-500">Resolve platform inquiries and traveler support requests</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-2 hidden lg:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Queue Health</p>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-tight">System Nominal</p>
          </div>
          <button 
            onClick={fetchTickets}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
          >
            <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
               <Clock size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Tickets</p>
               <p className="text-3xl font-bold text-gray-900">{tickets.filter(t => t.status === 'open').length}</p>
            </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
               <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Resolution Rate</p>
               <p className="text-3xl font-bold text-gray-900">94.2%</p>
            </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center gap-6">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
               <MessageSquare size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Response</p>
               <p className="text-3xl font-bold text-gray-900">1.4h</p>
            </div>
         </div>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
         
         {/* Sidebar: Ticket List */}
         <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-2">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by subject or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-black/10 transition-all"
                  />
               </div>
               <button className="p-2 text-gray-400 hover:text-black">
                  <Filter size={18} />
               </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
               <div className="flex border-b border-gray-100">
                  {['all', 'open', 'closed'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setFilter(t)}
                      className={cn(
                        "flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2",
                        filter === t ? "border-black text-black bg-gray-50/50" : "border-transparent text-gray-400 hover:text-black"
                      )}
                    >
                      {t}
                    </button>
                  ))}
               </div>

               <div className="flex-1 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
                  {isLoading ? (
                    <div className="p-10 text-center text-gray-400 font-medium">Syncing queue...</div>
                  ) : tickets.length > 0 ? tickets.map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => handleViewTicket(t)}
                      className={cn(
                        "w-full p-6 text-left hover:bg-gray-50 transition-all group border-l-4",
                        selectedTicket?.id === t.id ? "border-black bg-gray-50/80" : "border-transparent"
                      )}
                    >
                       <div className="flex justify-between items-start mb-2">
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded",
                            t.priority === 'high' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                          )}>{t.priority}</span>
                          <span className="text-[10px] text-gray-400 font-medium">
                             {new Date(t.createdAt).toLocaleDateString()}
                          </span>
                       </div>
                       <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:translate-x-1 transition-transform">{t.subject}</h3>
                       <p className="text-xs text-gray-500 line-clamp-1">{t.customer.name}</p>
                    </button>
                  )) : (
                    <div className="p-20 text-center flex flex-col items-center gap-4">
                       <CheckCircle2 className="text-emerald-500" size={32} />
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inbox Clean</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Content Area: Ticket Conversation */}
         <div className="lg:col-span-2 space-y-6">
            {selectedTicket ? (
               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[670px] overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
                           <UserIcon size={20} />
                        </div>
                        <div>
                           <h2 className="text-lg font-bold text-gray-900 tracking-tight">{selectedTicket.subject}</h2>
                           <p className="text-xs text-gray-500 font-medium">{selectedTicket.customer.name} &bull; {selectedTicket.customer.email}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        {selectedTicket.status === 'open' ? (
                          <button 
                            onClick={() => updateStatus('closed')}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                          >
                             Close Ticket
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateStatus('open')}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                          >
                             Reopen Ticket
                          </button>
                        )}
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
                     {selectedTicket.messages?.map((msg: any, i: number) => (
                        <div key={i} className={cn(
                          "flex max-w-[85%] flex-col",
                          msg.role === 'admin' ? 'ml-auto items-end' : 'mr-auto items-start'
                        )}>
                           <div className={cn(
                             "p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                             msg.role === 'admin' ? 'bg-black text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                           )}>
                              {msg.text}
                           </div>
                           <span className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-tight px-2">
                              {msg.role === 'admin' ? 'Support Agent' : selectedTicket.customer.name} &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                     ))}
                  </div>

                  <form onSubmit={handleSendReply} className="p-6 bg-white border-t border-gray-100">
                     <div className="flex gap-4">
                        <textarea 
                           placeholder="Type your response here..."
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                           className="flex-1 bg-gray-50 border border-transparent rounded-xl p-4 text-sm outline-none focus:bg-white focus:border-black/10 transition-all resize-none h-24"
                        />
                        <button 
                           disabled={!replyText.trim() || selectedTicket.status === 'closed'}
                           className="bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 flex flex-col items-center justify-center gap-1 shadow-lg shadow-black/5"
                        >
                           <Send size={18} />
                           <span className="text-[9px] uppercase tracking-widest">Reply</span>
                        </button>
                     </div>
                  </form>
               </div>
            ) : (
               <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] h-[670px] flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center text-gray-200 mb-8">
                     <MessageSquare size={48} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-4">No Conversation Selected</h3>
                  <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                     Select a support request from the queue to view details and communicate with the traveler.
                  </p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
