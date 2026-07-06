'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { toast } from 'sonner';
import Link from 'next/link';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

export const OnboardingAdminDashboard = () => {
  const [pendingVendors, setPendingVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const res = await adminService.getVendors({ limit: 100 }); // fetch enough to filter locally
      const actionableVendors = (res.vendors || []).filter((v: any) => 
        v.verificationStatus === 'pending' || v.kycStatus === 'submitted'
      );
      setPendingVendors(actionableVendors);
    } catch (err) {
      toast.error('Failed to load actionable queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveVendor(id);
      toast.success('Vendor approved and onboarded successfully');
      setPendingVendors(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      toast.error('Failed to approve vendor');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectVendor(id, 'Incomplete details');
      toast.info('Vendor rejected');
      setPendingVendors(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      toast.error('Failed to reject vendor');
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Onboarding Queue...</p>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex items-center gap-2 mb-8">
         <Shield className="text-black" size={28} />
         <h1 className="text-3xl font-bold tracking-tight">Onboarding Queue</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                 <div>
                    <h2 className="text-sm font-bold text-gray-900">Pending Approvals</h2>
                    <p className="text-xs text-gray-400">{pendingVendors.length} vendors awaiting review</p>
                 </div>
              </div>
              <Link href="/admin/kyc" className="text-xs font-bold text-black hover:underline">View KYC Dashboard</Link>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-gray-100 text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                   <tr>
                      <th className="px-6 py-4">Business Entity</th>
                      <th className="px-6 py-4">Contact Details</th>
                      <th className="px-6 py-4">Applied Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {pendingVendors.length > 0 ? pendingVendors.map((vendor, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{vendor.businessName}</div>
                            <div className="text-[10px] text-gray-500 uppercase mt-0.5">ID: {vendor.id}</div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="font-medium text-gray-700">{vendor.contactEmail}</div>
                            <div className="text-[11px] text-gray-500">{vendor.contactPhone || 'N/A'}</div>
                         </td>
                         <td className="px-6 py-4 text-xs font-medium text-gray-500">
                            {new Date(vendor.createdAt || Date.now()).toLocaleDateString()}
                         </td>
                         <td className="px-6 py-4 text-right space-x-2">
                            {vendor.verificationStatus === 'pending' ? (
                              <>
                                <button 
                                   onClick={() => handleReject(vendor.id)}
                                   className="px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg transition-all"
                                >
                                   Reject Acct
                                </button>
                                <button 
                                   onClick={() => handleApprove(vendor.id)}
                                   className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-all shadow-sm"
                                >
                                   Approve Acct
                                </button>
                              </>
                            ) : vendor.kycStatus === 'submitted' ? (
                               <Link 
                                 href="/admin/kyc"
                                 className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                               >
                                 Review KYC
                               </Link>
                            ) : null}
                         </td>
                      </tr>
                   )) : (
                      <tr><td colSpan={4} className="p-20 text-center text-gray-400">The onboarding queue is fully cleared.</td></tr>
                   )}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );
};
