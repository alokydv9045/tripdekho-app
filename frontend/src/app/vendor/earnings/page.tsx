"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  AlertCircle,
  Banknote
} from "lucide-react";
import { payrollService, FinancialSummary, Payout, LedgerEntry } from "@/services/payrollService";
import { useAppSelector } from "@/store/hooks";
import { formatPrice } from "@/lib/utils/formatters";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { toast } from "sonner";

export default function VendorEarningsPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, payRes, ledRes] = await Promise.all([
          payrollService.getSummary(period),
          payrollService.getVendorPayouts({ limit: 5 }),
          payrollService.getLedger({ limit: 10 })
        ]);
        
        setSummary(sumRes?.data || null);
        setPayouts(payRes?.data?.payouts || []);
        setLedger(ledRes?.data?.ledgerEntries || []);
      } catch (error) {
        console.error("Failed to fetch financial data:", error);
        toast.error("Could not sync financial data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const stats = [
    { 
      label: "Gross Revenue", 
      value: summary ? formatPrice(summary.totalRevenue) : "$0.00", 
      icon: DollarSign, 
      color: "text-blue-400", 
      bg: "bg-blue-400/10" 
    },
    { 
      label: "Platform Fees", 
      value: summary ? formatPrice(summary.platformFees) : "$0.00", 
      icon: TrendingUp, 
      color: "text-rose-400", 
      bg: "bg-rose-400/10" 
    },
    { 
      label: "Net Earnings", 
      value: summary ? formatPrice(summary.netEarnings) : "$0.00", 
      icon: CheckCircle2, 
      color: "text-emerald-400", 
      bg: "bg-emerald-400/10" 
    },
    { 
      label: "Withdrawable", 
      value: summary ? formatPrice(summary.payouts.pending) : "$0.00", 
      icon: Banknote, 
      color: "text-amber-400", 
      bg: "bg-amber-400/10" 
    },
  ];

  const chartData = [
    { name: "Mon", revenue: 4000, earnings: 2400 },
    { name: "Tue", revenue: 3000, earnings: 1398 },
    { name: "Wed", revenue: 2000, earnings: 9800 },
    { name: "Thu", revenue: 2780, earnings: 3908 },
    { name: "Fri", revenue: 1890, earnings: 4800 },
    { name: "Sat", revenue: 2390, earnings: 3800 },
    { name: "Sun", revenue: 3490, earnings: 4300 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-500 tracking-widest mb-1">
              <Banknote size={14} />
              Financial Hub
            </div>
            <h1 className="text-4xl font-black text-gray-900">Earnings & Payouts</h1>
            <p className="text-gray-500 text-sm font-medium">Manage your revenue, inspect transactions, and request settlements.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white p-1 rounded-2xl border border-gray-200">
              {['week', 'month', 'year'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as any)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    period === p ? "bg-amber-500 text-gray-900" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:text-gray-900 transition-all">
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className="p-6 bg-white border border-gray-200 rounded-[32px] group hover:hover:bg-gray-50 transition-all duration-500"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                <TrendingUp size={12} />
                +12.4% from last {period}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-2 p-8 bg-white border border-gray-200 rounded-[40px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900">Revenue Analysis</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  Gross
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  Net
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d91212" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#d91212" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(0,0,0,0.3)', fontSize: 10, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis 
                    hide 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '16px', fontSize: '12px' }}
                    itemStyle={{ color: '#000' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#d91212" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions / Recent Payouts */}
          <div className="p-8 bg-white border border-gray-200 rounded-[40px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-900">Latest Payouts</h3>
              <Link href="/vendor/payouts" className="text-[10px] font-black uppercase text-amber-500 tracking-widest hover:underline decoration-2">See All</Link>
            </div>
            <div className="flex-1 space-y-6">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse flex justify-between">
                    <div className="w-2/3 h-10 bg-white rounded-2xl" />
                    <div className="w-1/4 h-10 bg-white rounded-2xl" />
                  </div>
                ))
              ) : (!payouts || payouts.length === 0) ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                  <DollarSign size={40} className="mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">No payout history</p>
                </div>
              ) : (
                payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                        payout.status === 'completed' ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
                      )}>
                        {payout.status === 'completed' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-sm tracking-tight">{formatPrice(payout.amount)}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          {new Date(payout.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter",
                      payout.status === 'completed' ? "bg-emerald-400/20 text-emerald-400" : "bg-amber-400/20 text-amber-400"
                    )}>
                      {payout.status}
                    </div>
                  </div>
                ))
              )}
            </div>
            <button className="mt-8 w-full py-4 bg-amber-500 hover:bg-amber-500-600 text-gray-900 rounded-3xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-xl shadow-primary/20">
              Request Settlement
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="p-8 bg-white border border-gray-200 rounded-[40px] space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-gray-900">Full Transaction Ledger</h3>
              <p className="text-gray-400 text-xs mt-1 font-medium">Historical record of all credits, debits, and adjustments.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase text-gray-500 hover:text-gray-900 transition-all">
                <Filter size={12} />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Entity / Description</th>
                  <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Transaction Type</th>
                  <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Amount</th>
                  <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Platform Fee</th>
                  <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4">Final Ledger</th>
                  <th className="pb-4 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(6)].map((_, j) => (
                        <td key={j} className="py-6 px-4">
                          <div className="h-4 bg-white rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (!ledger || ledger.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                      No matching records found in ledger
                    </td>
                  </tr>
                ) : (
                  ledger.map((entry) => (
                    <tr key={entry.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-3 font-bold text-gray-900 tracking-tight">
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center",
                            entry.type === 'credit' ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"
                          )}>
                            {entry.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                          </div>
                          {entry.description}
                        </div>
                      </td>
                      <td className="py-6 px-4 text-sm font-black uppercase tracking-tighter text-gray-500">
                        {entry.type}
                      </td>
                      <td className="py-6 px-4 text-sm font-bold text-gray-900">
                        {formatPrice(entry.amount)}
                      </td>
                      <td className="py-6 px-4 text-sm font-bold text-rose-400/80">
                        -{formatPrice(entry.amount * 0.1)}
                      </td>
                      <td className="py-6 px-4">
                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-black text-gray-900">
                          {formatPrice(entry.balance)}
                        </span>
                      </td>
                      <td className="py-6 px-4 text-right text-[10px] font-black text-gray-400 uppercase">
                        {new Date(entry.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
