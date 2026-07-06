'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Fingerprint, 
  FileText, 
  Check, 
  X,
  Search,
  Eye,
  Clock,
  Shield,
  Activity,
  AlertCircle,
  FileCheck,
  Lock,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const KYCVerificationPage = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedDocs, setSelectedDocs] = useState<any>(null);
  const [kycDocs, setKycDocs] = useState<any>(null);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const fetchKYCVendors = async () => {
    try {
      setLoading(true);
      const response = await adminService.getVendors({ limit: 50, status: 'approved' });
      
      const allVendors = response.vendors || [];
      const filtered = filter === 'all' 
        ? allVendors 
        : allVendors.filter((v: any) => {
            const status = (v.kycStatus || 'pending').toLowerCase();
            // 'pending' tab should show 'submitted' (docs uploaded waiting for review)
            if (filter === 'pending') return status === 'submitted';
            return status === filter.toLowerCase();
          });
        
      setVendors(filtered);
    } catch (err) {
      toast.error('Failed to load verification queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCVendors();
  }, [filter]);

  const handleVerify = async (id: string) => {
    try {
      await adminService.verifyKYC(id);
      toast.success('Vendor identity verified');
      fetchKYCVendors();
      setSelectedDocs(null);
    } catch (err) {
      toast.error('Verification failed');
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;
    try {
      await adminService.rejectVendor(id, reason);
      toast.success('KYC application rejected');
      fetchKYCVendors();
      setSelectedDocs(null);
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
               <ShieldCheck className="text-black" size={24} />
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">KYC Check</h1>
            </div>
            <p className="text-sm text-gray-500">Review and verify vendor identification documents for compliance</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Queue Active</span>
          </div>
          <button 
            onClick={fetchKYCVendors}
            className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
          >
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Verification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-6">
            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
               <Clock size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Awaiting Review</p>
               <p className="text-3xl font-bold text-gray-900">{vendors.filter(v => (v.kycStatus || 'pending') === 'submitted').length}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-6">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
               <ShieldCheck size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Verified</p>
               <p className="text-3xl font-bold text-gray-900">142</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-6">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
               <FileCheck size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Platform Trust Score</p>
               <p className="text-3xl font-bold text-gray-900">98.4</p>
            </div>
          </div>
      </div>

      {/* Filter Bar */}
      <div className="flex border-b border-gray-200 gap-4 overflow-x-auto">
          {[
            { id: 'pending', label: 'Pending Review' },
            { id: 'verified', label: 'Verified Accounts' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'all', label: 'All Records' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                filter === tab.id ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black"
              )}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {/* Verification List */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                   <th className="px-6 py-4">Vendor Entity</th>
                   <th className="px-6 py-4">Verification Level</th>
                   <th className="px-6 py-4">Submission Date</th>
                   <th className="px-6 py-4">KYC Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {loading ? (
                   Array(5).fill(0).map((_, i) => (
                     <tr key={i}><td colSpan={5} className="px-6 py-8 animate-pulse bg-gray-50/20" /></tr>
                   ))
                ) : vendors.length > 0 ? vendors.map((vendor) => (
                   <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                         <div className="font-bold text-gray-900">{vendor.businessName}</div>
                         <div className="text-[10px] text-gray-500 uppercase tracking-tight">{vendor.contactEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                            <Fingerprint size={14} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-700">Level 2 (Business Identity)</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-medium">
                         {new Date(vendor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                         <span className={cn(
                           "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                           vendor.kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' : 
                           vendor.kycStatus === 'pending' ? 'bg-amber-50 text-amber-700' : 
                           'bg-red-50 text-red-700'
                         )}>
                            {vendor.kycStatus || 'pending'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button 
                           onClick={async () => {
                             setSelectedDocs(vendor);
                             setKycDocs(null);
                             try {
                               const { axiosPrivate } = await import('@/lib/axios');
                               const docsRes = await axiosPrivate.get(`/vendors/${vendor.id}/kyc-documents`);
                               if (docsRes.data?.data?.kycDocuments) {
                                 setKycDocs(docsRes.data.data.kycDocuments);
                               }
                             } catch (err) {
                               toast.error('Failed to load KYC documents');
                             }
                           }}
                           className="px-4 py-2 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-sm"
                         >
                            Review Docs
                         </button>
                      </td>
                   </tr>
                )) : (
                   <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-medium">No records found in this queue</td></tr>
                )}
             </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedDocs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
           <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30 shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
                       <Shield size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-black text-gray-900 tracking-tight">{selectedDocs.businessName}</h2>
                       <p className="text-sm text-gray-500 font-medium">Identity & Compliance Audit</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedDocs(null)} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-8 space-y-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat overflow-y-auto flex-1">
                 {kycDocs && Object.keys(kycDocs).length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {Object.entries(kycDocs).map(([docType, doc]: [string, any]) => (
                       <div key={docType} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                             <FileText size={16} className="text-blue-500" />
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{docType.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                          <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden relative group">
                             {doc.url.toLowerCase().endsWith('.pdf') ? (
                               <iframe src={doc.url} className="w-full h-full pointer-events-none" />
                             ) : (
                               <img src={doc.url} alt={docType} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                             )}
                             <button 
                               onClick={() => setPreviewDoc(doc.url)}
                               className="absolute inset-0 m-auto w-12 h-12 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                             >
                               <Eye size={20} />
                             </button>
                          </div>
                          <button 
                            onClick={() => setPreviewDoc(doc.url)}
                            className="w-full py-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                          >
                            View Full Resolution
                          </button>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
                     <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                     <p className="text-sm text-gray-500 font-medium">No documents uploaded</p>
                   </div>
                 )}

                 <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
                    <AlertCircle className="text-amber-600 shrink-0" size={20} />
                    <div>
                       <p className="text-xs font-bold text-amber-900 uppercase tracking-tight">Compliance Checklist</p>
                       <ul className="text-xs text-amber-800/70 mt-2 space-y-1">
                          <li>&bull; Business name matches registration document</li>
                          <li>&bull; Document expiry dates are within valid range</li>
                          <li>&bull; Signatory authority is clearly visible</li>
                       </ul>
                    </div>
                 </div>
              </div>

              <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                 <button 
                   onClick={() => handleReject(selectedDocs.id)}
                   className="px-6 py-3 border border-red-200 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                 >
                    Flag Compliance Issue
                 </button>
                 <button 
                   onClick={() => handleVerify(selectedDocs.id)}
                   className="px-10 py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
                 >
                    Verify Identity
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewDoc(null)} />
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl z-[70] flex flex-col h-[85vh]">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <h3 className="text-white font-bold">Document Preview</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-white transition-colors">
                 <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-900">
              {previewDoc.toLowerCase().endsWith('.pdf') ? (
                <iframe src={previewDoc} className="w-full h-full bg-white rounded-xl" />
              ) : (
                <img src={previewDoc} alt="Document Preview" className="max-w-full max-h-full object-contain rounded-xl" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCVerificationPage;
