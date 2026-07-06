"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";

import { payrollService } from "@/services/payrollService";
import { vendorService } from "@/services/vendorService";
import { 
  Wallet, ArrowUpRight, TrendingUp, 
  History, Download, AlertCircle,
  CreditCard, CheckCircle2, Clock, 
  ChevronRight, ArrowRight
} from "lucide-react";
import PrimaryButton from "@/components/shared/PrimaryButton";
import Link from "next/link";
import { toast } from "sonner";


const VendorPayoutsPage = () => {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [payoutsData, summaryData] = await Promise.all([
          payrollService.getVendorPayouts(),
          payrollService.getFinancialSummary()
        ]);
        setPayouts(payoutsData.data || []);
        setSummary(summaryData.data);
      } catch (err) {
        console.error("Payouts fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRequestPayout = async () => {
    if (summary?.balance < 1000) {
      toast.error("Minimum payout amount is ₹1,000");
      return;
    }
    
    try {
      setRequesting(true);
      await payrollService.requestPayout({ amount: summary.balance });
      toast.success("Payout request submitted successfully!");
      // Refresh data
      const [payoutsData, summaryData] = await Promise.all([
        payrollService.getVendorPayouts(),
        payrollService.getFinancialSummary()
      ]);
      setPayouts(payoutsData.data || []);
      setSummary(summaryData.data);
    } catch (err) {
      toast.error("Failed to submit payout request");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <PremiumLoader />;

  const statCards = [
    { 
      title: "Available Balance", 
      value: `₹${summary?.balance?.toLocaleString() || '0'}`, 
      icon: Wallet, 
      color: "bg-amber-100 text-amber-600",
      description: "Ready for withdrawal" 
    },
    { 
      title: "Total Withdrawn", 
      value: `₹${summary?.totalWithdrawn?.toLocaleString() || '0'}`, 
      icon: ArrowUpRight, 
      color: "bg-green-100 text-green-600",
      description: "Successfully processed" 
    },
    { 
      title: "Pending Payouts", 
      value: `₹${summary?.pendingPayouts?.toLocaleString() || '0'}`, 
      icon: Clock, 
      color: "bg-blue-100 text-blue-600",
      description: "Under processing" 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">


      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Link href="/vendor/dashboard" className="hover:text-amber-500">Dashboard</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900">Payouts</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase leading-[0.9]">
              Earnings & <span className="text-amber-500">Payouts</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Manage your funds and withdrawal history</p>
          </div>
          
          <PrimaryButton 
            onClick={handleRequestPayout}
            disabled={requesting || (summary?.balance || 0) < 1000}
            className="h-14 px-10 font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-200"
          >
            {requesting ? "Requesting..." : "Withdraw Funds"} <ArrowRight className="ml-2 w-5 h-5" />
          </PrimaryButton>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {statCards.map((card, idx) => (
             <div key={idx} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-gray-200/50 group">
               <div className="flex justify-between items-start mb-6">
                 <div className={`p-4 rounded-2xl ${card.color} group-hover:scale-110 transition-transform duration-500`}>
                   <card.icon className="w-6 h-6" />
                 </div>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{card.title}</p>
               <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">{card.value}</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{card.description}</p>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Transaction History */}
           <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200/50">
             <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                  <History className="w-6 h-6 text-amber-500" /> Withdrawal History
                </h3>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors text-gray-600">
                  <Download size={18} />
                </button>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-gray-50/50">
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Date</th>
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                     <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                     <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {payouts.length > 0 ? (
                     payouts.map((payout, idx) => (
                       <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-amber-600 leading-none">#{payout.id?.substring(0, 8)}</span>
                              <span className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-tighter">
                                {new Date(payout.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-sm font-black text-gray-900 tracking-tight">₹{payout.amount?.toLocaleString()}</span>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                              payout.status === 'completed' ? 'bg-green-100 text-green-600' : 
                              payout.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                            }`}>
                               {payout.status === 'completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                               {payout.status}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                           <div className="flex flex-col items-end">
                              <span className="text-xs font-bold text-gray-900 uppercase">Bank Transfer</span>
                              <span className="text-[10px] font-medium text-gray-400">HDFC **** 4392</span>
                           </div>
                         </td>
                       </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={4} className="px-8 py-12 text-center">
                          <div className="flex flex-col items-center gap-3 opacity-20">
                             <TrendingUp size={48} className="text-gray-400" />
                             <p className="text-xs font-black uppercase tracking-widest">No withdrawal record yet</p>
                          </div>
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>

           {/* Sidebar: Method & FAQ */}
           <div className="space-y-8">
              <div className="bg-gray-900 rounded-[40px] p-10 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                <h4 className="text-sm font-black uppercase tracking-widest text-amber-400 mb-8 flex items-center gap-2">
                   <CreditCard size={18} /> Payout Method
                </h4>
                <div className="space-y-6">
                   <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-all cursor-pointer">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Active Account</p>
                      <p className="text-lg font-black tracking-tighter">HDFC BANK Ltd.</p>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">**** **** 4392</p>
                   </div>
                   <button className="w-full py-4 border-2 border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-black transition-all">
                      Change Details
                   </button>
                </div>
              </div>

              <div className="bg-amber-50 rounded-[40px] p-8 border border-amber-100/50">
                 <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <AlertCircle size={14} className="text-amber-600" /> Important Info
                 </h4>
                 <div className="space-y-5">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-amber-700 uppercase">Processing Time</p>
                       <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-wider">Withdrawals are processed within 3-5 business days after approval.</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-amber-700 uppercase">Minimum Amount</p>
                       <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-wider">You can request a withdrawal once your balance exceeds ₹1,000.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      
    </div>
  );
};

export default VendorPayoutsPage;

