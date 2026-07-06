"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Clock,
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  Paperclip
} from "lucide-react";
import { cn } from "@/lib/utils";


export default function TicketDetailAdminPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");

  const fetchTicketDetail = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTicketDetail(ticketId);
      setTicket(data.ticket || data);
    } catch (error) {
      toast.error("Failed to load ticket details");
      router.push('/admin/support');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetail();
    }
  }, [ticketId]);

  const handleUpdateStatus = async (status: string) => {
    try {
      await adminService.updateTicket(ticketId, { status });
      toast.success(`Ticket marked as ${status}`);
      fetchTicketDetail();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      await adminService.addTicketMessage(ticketId, replyMessage);
      toast.success("Reply sent successfully");
      setReplyMessage("");
      fetchTicketDetail();
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  if (loading) return <PremiumLoader />;

  if (!ticket) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/support')}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">{ticket.subject}</h1>
            <p className="text-sm text-gray-500">Ticket #{ticketId.substring(0, 8).toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={ticket.status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl border outline-none cursor-pointer",
              ticket.status === 'open' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              ticket.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            )}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row gap-8 justify-between">
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
               <User size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</p>
               <p className="text-sm font-bold text-gray-900">{ticket.user?.name || ticket.name || 'Unknown User'}</p>
               <p className="text-xs text-gray-500">{ticket.user?.email || ticket.email || ''}</p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
               <ShieldCheck size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Priority</p>
               <p className={cn(
                 "text-sm font-bold",
                 ticket.priority === 'high' ? 'text-red-600' : 'text-gray-900'
               )}>
                 {ticket.priority?.toUpperCase() || 'NORMAL'}
               </p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
               <Clock size={20} />
            </div>
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Created At</p>
               <p className="text-sm font-bold text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>
         </div>
      </div>

      {/* Chat Thread */}
      <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden flex flex-col h-[500px]">
         <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
            <MessageSquare size={16} className="text-gray-400" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Conversation History</h2>
         </div>
         
         <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Initial Message */}
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
               <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-sm text-sm text-gray-800 max-w-[80%]">
                  <p className="whitespace-pre-wrap">{ticket.message}</p>
                  <span className="text-[10px] text-gray-400 font-bold uppercase mt-2 block">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
               </div>
            </div>

            {/* Replies */}
            {ticket.messages?.map((msg: any, i: number) => (
              <div key={i} className={cn("flex gap-4", msg.isAdmin ? "flex-row-reverse" : "")}>
                 <div className={cn(
                    "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold",
                    msg.isAdmin ? "bg-black" : "bg-gray-200"
                 )}>
                    {msg.isAdmin ? 'A' : 'U'}
                 </div>
                 <div className={cn(
                    "p-4 rounded-2xl text-sm max-w-[80%]",
                    msg.isAdmin 
                      ? "bg-black text-white rounded-tr-sm" 
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
                 )}>
                    <p className="whitespace-pre-wrap">{msg.text || msg.message}</p>
                    <span className={cn(
                       "text-[10px] font-bold uppercase mt-2 block",
                       msg.isAdmin ? "text-gray-400" : "text-gray-400"
                    )}>
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                 </div>
              </div>
            ))}
         </div>

         {/* Reply Box */}
         <div className="p-4 bg-gray-50/50 border-t border-gray-100">
            <form onSubmit={handleReply} className="flex items-end gap-3">
               <button type="button" className="p-3 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all">
                  <Paperclip size={20} />
               </button>
               <div className="flex-1 relative">
                  <textarea 
                     placeholder="Type your reply to the customer..."
                     value={replyMessage}
                     onChange={(e) => setReplyMessage(e.target.value)}
                     className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 resize-none h-[80px]"
                  />
               </div>
               <button 
                  type="submit"
                  disabled={!replyMessage.trim()}
                  className="bg-black text-white p-3 md:px-6 md:py-3 rounded-xl font-bold text-sm shadow-md hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[48px]"
               >
                  <span className="hidden md:block">Send Reply</span>
                  <Send size={18} />
               </button>
            </form>
         </div>
      </div>
    </div>
  );
}
