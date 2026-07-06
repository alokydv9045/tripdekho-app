'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Search,
  Activity,
  BarChart3,
  ArrowRightLeft,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  X,
  FileText,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Filter,
  Settings,
  Save
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { exportToCsv } from '@/utils/exportCsv';
import { cn } from '@/lib/utils';

export default function FinanceManagementPage() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeView, setActiveView] = useState('wallets');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [platformFeeAmount, setPlatformFeeAmount] = useState<number>(0);
  const [isSavingFee, setIsSavingFee] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let res: any;
      
      switch (activeView) {
        case 'wallets':
          res = await adminService.getVendorWallets();
          setData(res.wallets || []);
          break;
        case 'transactions':
          res = await adminService.getPaymentAudit({ page, limit: 15, search: searchTerm });
          setData(res.payments || []);
          setTotalPages(res.totalPages || 1);
          break;
        case 'payouts':
          res = await adminService.getAllPayouts({ page, limit: 15, status: searchTerm ? undefined : 'ready' });
          setData(res.payouts || []);
          setTotalPages(res.totalPages || 1);
          break;
        case 'audit':
          res = await adminService.getAuditLogs({ page, limit: 15, search: searchTerm });
          setData(res.logs || []);
          setTotalPages(res.totalPages || 1);
          break;
      }
      
      const analytics = await adminService.getAnalytics();
      setStats(analytics);
      
      const settings = await adminService.getSystemSettings();
      setPlatformFeeAmount((settings?.commissionRates as any)?.platformFeeAmount || 0);
    } catch (err) {
      toast.error('Failed to load financial records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [activeView, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [activeView, page, searchTerm]);

  const handleSyncGateway = async () => {
    try {
      setIsSyncing(true);
      const res = await adminService.syncRazorpay();
      toast.success(`Gateway synchronized: ${res.synced} transactions updated`);
      fetchData();
    } catch (err) {
      toast.error('Failed to sync with payment gateway');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportData = () => {
    if (!data || data.length === 0) {
      toast.error('No financial data available to export');
      return;
    }
    
    exportToCsv('financial_report.csv', data.map(item => ({
      id: item.id || 'N/A',
      amount: item.amount || 0,
      status: item.status || 'N/A',
      date: item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'
    })));
    toast.success('Financial report exported');
  };

  const handleProcessPayout = async (id: string) => {
    try {
      await adminService.processPayout(id);
      toast.success('Payout processed successfully');
      fetchData();
    } catch (err) {
      toast.error('Payout processing failed');
    }
  };

  const handleSaveFee = async () => {
    try {
      setIsSavingFee(true);
      await adminService.updateSystemSettings({
        commissionRates: { platformFeeAmount }
      });
      toast.success('Platform Fee updated successfully');
    } catch (err) {
      toast.error('Failed to update platform fee');
    } finally {
      setIsSavingFee(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <Wallet className="text-black" size={24} />
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Finance Hub</h1>
            </div>
            <p className="text-sm text-gray-500">Manage vendor wallets, transactions, and platform payouts</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleSyncGateway}
            disabled={isSyncing}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all text-gray-700 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={cn(isSyncing && "animate-spin")} />
            Sync Gateway
          </button>
          <button 
            className="flex-1 md:flex-none justify-center bg-black text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2"
            onClick={handleExportData}
          >
            <FileText size={16} /> Export Data
          </button>
        </div>
      </div>

      {/* Global Fee Configuration */}
      <div className="bg-amber-400 rounded-xl border border-amber-500 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black text-amber-400 rounded-full flex items-center justify-center">
               <Settings size={24} />
            </div>
            <div>
               <h3 className="text-black font-bold text-lg">Global Platform Fee</h3>
               <p className="text-black/70 text-sm font-medium">This flat fee will be applied to all future bookings</p>
            </div>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
               <input 
                  type="number" 
                  value={platformFeeAmount}
                  onChange={(e) => setPlatformFeeAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border-none shadow-inner font-bold text-black focus:ring-2 focus:ring-black outline-none"
                  placeholder="0.00"
               />
            </div>
            <button 
               onClick={handleSaveFee}
               disabled={isSavingFee}
               className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
            >
               {isSavingFee ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
               Save
            </button>
         </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">₹{(stats?.revenue?.total || 0).toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-medium">
               <TrendingUp size={12} /> +12.5% vs last month
            </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vendor Payouts</h3>
            <p className="text-2xl font-bold text-gray-900">₹{(stats?.revenue?.vendorPayouts || 0).toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
               <Clock size={12} /> Next cycle in 2 days
            </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Platform Fees</h3>
            <p className="text-2xl font-bold text-gray-900">₹{(stats?.revenue?.platformFees || 0).toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-medium">
               <CheckCircle size={12} /> 100% processing rate
            </div>
         </div>
         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pending Refunds</h3>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 font-medium">
               <Activity size={12} /> System nominal
            </div>
         </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-4 overflow-x-auto">
          {[
            { id: 'wallets', label: 'Vendor Wallets', icon: Wallet },
            { id: 'transactions', label: 'Transactions', icon: ArrowRightLeft },
            { id: 'payouts', label: 'Payout Requests', icon: CreditCard },
            { id: 'audit', label: 'Financial Audit', icon: FileText }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                activeView === tab.id ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
         <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                  type="text" 
                  placeholder="Search records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black/5 transition-all"
              />
         </div>
         <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all">
               <Filter size={18} />
            </button>
            <button onClick={fetchData} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all">
               <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
         </div>
      </div>

      {/* Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 text-center text-gray-400 animate-pulse font-medium">Synchronizing records...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                 <tr>
                    {activeView === 'wallets' && (
                      <>
                        <th className="px-6 py-4">Vendor</th>
                        <th className="px-6 py-4">Current Balance</th>
                        <th className="px-6 py-4">Total Revenue</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </>
                    )}
                    {activeView === 'transactions' && (
                      <>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Entity</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Date</th>
                      </>
                    )}
                    {activeView === 'payouts' && (
                      <>
                        <th className="px-6 py-4">Payout ID</th>
                        <th className="px-6 py-4">Vendor</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </>
                    )}
                    {activeView === 'audit' && (
                      <>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">Context</th>
                        <th className="px-6 py-4 text-right">Timestamp</th>
                      </>
                    )}
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.length > 0 ? data.map((item: any, i) => (
                  <tr key={item.id || i} className="hover:bg-gray-50/50 transition-colors">
                    {activeView === 'wallets' && (
                      <>
                        <td className="px-6 py-4 font-semibold text-gray-900">{item.vendor?.businessName || 'N/A'}</td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-900">₹{Number(item.balance || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-gray-500">₹{Number(item.totalEarned || 0).toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <span className={cn(
                             "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                             item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                           )}>
                              {item.isActive ? 'Active' : 'Locked'}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => setSelectedLog(item)} className="text-gray-400 hover:text-black">
                              <Search size={16} />
                           </button>
                        </td>
                      </>
                    )}
                    {activeView === 'transactions' && (
                      <>
                        <td className="px-6 py-4 font-mono text-gray-400 text-xs">{item.orderId || item.id.slice(-8)}</td>
                        <td className="px-6 py-4">
                           <div className="font-semibold text-gray-900">{item.customer?.name || 'Guest'}</div>
                           <div className="text-[10px] text-gray-500">{item.customer?.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">₹{item.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <span className={cn(
                             "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                             item.status === 'captured' ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                           )}>
                              {item.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-400 tabular-nums">
                           {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </>
                    )}
                    {activeView === 'payouts' && (
                      <>
                        <td className="px-6 py-4 font-mono text-gray-400 text-xs">{item.id.slice(-8)}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{item.vendor?.businessName}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">₹{item.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <span className={cn(
                             "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase",
                             item.status === 'processed' ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                           )}>
                              {item.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           {item.status === 'ready' && (
                             <button 
                               onClick={() => handleProcessPayout(item.id)}
                               className="text-xs font-bold text-black border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition-all"
                             >
                               Process
                             </button>
                           )}
                        </td>
                      </>
                    )}
                    {activeView === 'audit' && (
                      <>
                        <td className="px-6 py-4 font-semibold text-gray-900">{item.user?.name}</td>
                        <td className="px-6 py-4 font-medium text-gray-700">{item.action}</td>
                        <td className="px-6 py-4 text-gray-500 truncate max-w-xs">{item.details}</td>
                        <td className="px-6 py-4 text-right text-gray-400 tabular-nums">
                           {new Date(item.timestamp).toLocaleString()}
                        </td>
                      </>
                    )}
                  </tr>
                )) : (
                  <tr><td colSpan={10} className="p-20 text-center text-gray-400">No records found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
           <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
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

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-gray-900">Record Details</h3>
                 <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-8 space-y-6">
                 <pre className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-xs font-mono overflow-auto max-h-[400px]">
                    {JSON.stringify(selectedLog, null, 2)}
                 </pre>
              </div>
              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                 <button 
                    onClick={() => setSelectedLog(null)}
                    className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-all"
                 >
                    Close
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
