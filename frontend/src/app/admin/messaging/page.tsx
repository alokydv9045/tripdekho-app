'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';
import { cn } from '@/lib/utils';
import { 
  Mail, 
  Search, 
  MessageSquare, 
  Clock, 
  RefreshCw, 
  Eye, 
  UserPlus,
  Send,
  X,
  Archive,
  Star,
  Users,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const InquiriesManagementPage = () => {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'inquiries') {
        const res = await adminService.getInquiries({ page, limit: 15, search: searchTerm });
        setInquiries(res.inquiries || []);
        setTotalPages(res.totalPages || 1);
      } else {
        const res = await adminService.getNewsletterSubscribers({ page, limit: 50 });
        setSubscribers(res.subscribers || []);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load inquiries data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, activeTab]);

  const handleUpdateInquiry = async (id: string, updates: any) => {
    try {
      await adminService.updateInquiry(id, updates);
      toast.success('Inquiry updated');
      fetchData();
      if(selectedItem && selectedItem.id === id) {
         setSelectedItem({ ...selectedItem, ...updates });
      }
    } catch (err) {
      toast.error('Failed to update inquiry');
    }
  };

  const handleReply = (entity: any) => {
     const email = entity.email;
     const subject = `Re: ${entity.subject || 'TripDekho Inquiry'}`;
     window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
     toast.info("Opening email client...");
     handleUpdateInquiry(entity.id, { status: 'replied' });
  };

  const handleArchive = async (id: string) => {
     if(!confirm("Are you sure you want to archive this inquiry?")) return;
     try {
       await adminService.updateInquiry(id, { status: 'archived' });
       toast.success('Inquiry archived');
       setSelectedItem(null);
       fetchData();
     } catch (err) {
       toast.error('Failed to archive inquiry');
     }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <MessageSquare className="text-black" size={24} />
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inquiries</h1>
            </div>
            <p className="text-sm text-gray-500">Manage customer messages and newsletter subscribers</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-2 hidden lg:block">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Engagement Rate</p>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-tight">88.5% Replied</p>
          </div>
          <button 
            onClick={fetchData}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
          >
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-4 overflow-x-auto">
          {[
            { id: 'inquiries', label: 'Contact Inquiries', icon: MessageSquare },
            { id: 'newsletter', label: 'Newsletter Subscribers', icon: UserPlus }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPage(1); setSelectedItem(null); }}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                activeTab === tab.id ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Side: List */}
         <div className="lg:col-span-1 space-y-4">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                  type="text" 
                  placeholder={activeTab === 'inquiries' ? "Search inquiries..." : "Search subscribers..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm"
               />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
               <div className="flex-1 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
                  {loading ? (
                    <div className="p-10 text-center text-gray-400 font-medium">Loading records...</div>
                  ) : activeTab === 'inquiries' ? (
                     inquiries.length > 0 ? inquiries.map((item) => (
                       <button 
                         key={item.id}
                         onClick={() => setSelectedItem(item)}
                         className={cn(
                           "w-full p-6 text-left hover:bg-gray-50 transition-all border-l-4 group",
                           selectedItem?.id === item.id ? "border-black bg-gray-50" : "border-transparent"
                         )}
                       >
                          <div className="flex justify-between items-start mb-2">
                             <span className={cn(
                               "text-[9px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded",
                               item.status === 'replied' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                             )}>{item.status}</span>
                             <span className="text-[10px] text-gray-400 font-medium">
                                {new Date(item.createdAt).toLocaleDateString()}
                             </span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:translate-x-1 transition-transform">{item.subject || 'Platform Inquiry'}</h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{item.name} &bull; {item.email}</p>
                       </button>
                     )) : (
                       <div className="p-20 text-center flex flex-col items-center gap-4">
                          <CheckCircle2 className="text-emerald-500" size={32} />
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inbox Clean</p>
                       </div>
                     )
                  ) : (
                     subscribers.length > 0 ? subscribers.map((sub) => (
                       <div key={sub.id} className="p-6 flex items-center justify-between group hover:bg-gray-50 transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                <Mail size={14} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-gray-900">{sub.email}</p>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Active Subscriber</p>
                             </div>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium">{new Date(sub.subscribedAt || Date.now()).toLocaleDateString()}</span>
                       </div>
                     )) : (
                       <div className="p-20 text-center text-gray-400">No subscribers found</div>
                     )
                  )}
               </div>
               
               {/* List Pagination */}
               <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-1 text-gray-400 hover:text-black disabled:opacity-30"
                  >
                     <ChevronLeft size={20} />
                  </button>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page {page} of {totalPages}</span>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-1 text-gray-400 hover:text-black disabled:opacity-30"
                  >
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
         </div>

         {/* Right Side: Details View */}
         <div className="lg:col-span-2">
            {selectedItem ? (
               <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[670px]">
                  <div className="px-8 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
                           <Users size={24} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h2 className="text-xl font-black text-gray-900 tracking-tight">{selectedItem.name}</h2>
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Inquiry_Node</span>
                           </div>
                           <p className="text-sm text-gray-500 font-medium">{selectedItem.email}</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button 
                          onClick={() => handleArchive(selectedItem.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                           <Archive size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                           <Star size={20} />
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 p-10 overflow-y-auto space-y-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat">
                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-black rounded-full" />
                           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subject</h3>
                        </div>
                        <p className="text-lg font-bold text-gray-900 leading-tight">{selectedItem.subject || 'General platform inquiry regarding services'}</p>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-black rounded-full" />
                           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Message Payload</h3>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-gray-700 leading-relaxed italic relative">
                           <div className="absolute top-4 right-6 opacity-5">
                              <MessageSquare size={40} />
                           </div>
                           {selectedItem.message}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6 pt-6">
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Timestamp</p>
                           <p className="text-sm font-bold text-gray-900">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Source Trace</p>
                           <p className="text-sm font-bold text-gray-900">Contact_Form_v1.2</p>
                        </div>
                     </div>
                  </div>

                  <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                     <button 
                        onClick={() => setSelectedItem(null)}
                        className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-black transition-all"
                     >
                        Discard
                     </button>
                     <button 
                        onClick={() => handleReply(selectedItem)}
                        className="px-10 py-3 bg-black text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-black/5 flex items-center gap-3"
                     >
                        Launch Reply <Send size={16} />
                     </button>
                  </div>
               </div>
            ) : (
               <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] h-[670px] flex flex-col items-center justify-center text-center p-12">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center text-gray-200 mb-8">
                     <Mail size={48} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-4">No Inquiry Selected</h3>
                  <p className="text-sm text-gray-400 max-w-xs leading-relaxed font-medium">
                     Select a message from the queue to view full details and perform administrative actions.
                  </p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default InquiriesManagementPage;
