'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';
import { cn } from '@/lib/utils';
import { 
  Ticket, 
  Trash2, 
  Plus, 
  CheckCircle,
  Tag,
  Percent,
  Hash,
  X,
  Calendar,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
  Activity,
  RefreshCw
} from "lucide-react";

const PromoCodesPage = () => {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    usageLimit: 100,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPromoCodes({ page, limit: 12 });
      setPromos(res.promos || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      toast.error('Failed to load promo codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await adminService.createPromoCode({
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        usageLimit: Number(formData.usageLimit)
      });
      toast.success('Promo code created successfully');
      setShowAddModal(false);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        usageLimit: 100,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      fetchData();
    } catch (err) {
      toast.error('Failed to create promo code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      await adminService.deletePromoCode(id);
      toast.success('Promo code deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete promo code');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <Ticket className="text-black" size={24} />
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Promo Codes</h1>
            </div>
            <p className="text-sm text-gray-500">Create and manage platform-wide discount vouchers and offers</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2"
        >
          <Plus size={16} /> Create New Code
        </button>
      </div>

      {/* Grid of Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {loading ? (
           Array(6).fill(0).map((_, i) => (
             <div key={i} className="bg-white border border-gray-100 rounded-2xl h-48 animate-pulse" />
           ))
         ) : promos.length > 0 ? promos.map((promo) => (
           <div key={promo.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-black transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Tag size={60} />
              </div>
              
              <div className="flex justify-between items-start mb-6">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Voucher</span>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{promo.code}</h3>
                 </div>
                 <button 
                    onClick={() => handleDelete(promo.id)}
                    className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                 >
                    <Trash2 size={16} />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Discount</p>
                    <p className="text-lg font-black text-gray-900">
                       {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `₹${promo.discountValue}`}
                    </p>
                 </div>
                 <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Usage</p>
                    <p className="text-lg font-black text-gray-900">{promo.usedCount || 0} / {promo.usageLimit}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                 <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <Calendar size={12} />
                    Expires {new Date(promo.validUntil).toLocaleDateString()}
                 </div>
                 <span className={cn(
                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                    new Date(promo.validUntil) > new Date() ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                 )}>
                    {new Date(promo.validUntil) > new Date() ? 'Valid' : 'Expired'}
                 </span>
              </div>
           </div>
         )) : (
           <div className="col-span-full py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <Ticket className="mx-auto text-gray-300 mb-4" size={40} />
              <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">No active vouchers found</p>
           </div>
         )}
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

      {/* Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Create Promo Voucher</h3>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                    <X size={20} />
                 </button>
              </div>
              <form onSubmit={handleCreate} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Voucher Code</label>
                    <input 
                       required
                       type="text" 
                       value={formData.code}
                       onChange={(e) => setFormData({...formData, code: e.target.value})}
                       placeholder="e.g. SUMMER2026"
                       className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-black transition-all"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                       <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, discountType: 'percentage'})}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-xs font-bold border transition-all",
                              formData.discountType === 'percentage' ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200"
                            )}
                          >
                             <Percent className="inline mr-1" size={12} /> Percent
                          </button>
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, discountType: 'fixed'})}
                            className={cn(
                              "flex-1 py-2 rounded-lg text-xs font-bold border transition-all",
                              formData.discountType === 'fixed' ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200"
                            )}
                          >
                             <Hash className="inline mr-1" size={12} /> Fixed
                          </button>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Value</label>
                       <input 
                          required
                          type="number" 
                          value={formData.discountValue}
                          onChange={(e) => setFormData({...formData, discountValue: e.target.value === '' ? '' as any : parseInt(e.target.value)})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valid From</label>
                       <input 
                          type="date" 
                          value={formData.validFrom}
                          onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valid Until</label>
                       <input 
                          type="date" 
                          value={formData.validUntil}
                          onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Usage Limit</label>
                    <input 
                       type="number" 
                       value={formData.usageLimit}
                       onChange={(e) => setFormData({...formData, usageLimit: e.target.value === '' ? '' as any : parseInt(e.target.value)})}
                       className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                    />
                 </div>
              </form>
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-black">Discard</button>
                 <button 
                    onClick={handleCreate}
                    disabled={isSubmitting}
                    className="px-10 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/5 disabled:opacity-50"
                 >
                    {isSubmitting ? 'Creating...' : 'Issue Voucher'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodesPage;
