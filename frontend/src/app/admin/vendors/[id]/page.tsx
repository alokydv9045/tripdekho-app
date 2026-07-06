"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  AlertCircle,
  Briefcase,
  ArrowLeft,
  Calendar,
  Wallet,
  Activity,
  CheckCircle2,
  XCircle,
  Settings,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";


export default function VendorDetailAdminPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [vendorData, setVendorData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [kycDocs, setKycDocs] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const fetchVendorDetail = async () => {
    try {
      setLoading(true);
      const data = await adminService.getVendorDetail(vendorId);
      if (data && data.vendor) {
        setVendorData(data.vendor);
        setStats(data.stats);
      } else if (data) {
        setVendorData(data);
        setStats(data.stats);
      }
      
      // Fetch KYC docs via custom call since admin service doesn't have it mapped yet
      const { axiosPrivate } = await import('@/lib/axios');
      const docsRes = await axiosPrivate.get(`/vendors/${vendorId}/kyc-documents`);
      if (docsRes.data?.data?.kycDocuments) {
        setKycDocs(docsRes.data.data.kycDocuments);
      }
    } catch (error) {
      toast.error("Failed to load vendor details");
      router.push('/admin/vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchVendorDetail();
    }
  }, [vendorId]);

  const handleVerificationStatus = async (status: boolean) => {
    try {
      if (status) {
        await adminService.approveVendor(vendorId);
        toast.success("Vendor approved successfully");
      } else {
        await adminService.rejectVendor(vendorId, "Rejected by administrator");
        toast.error("Vendor rejected");
      }
      fetchVendorDetail();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  if (loading) return <PremiumLoader />;

  if (!vendorData) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/vendors')}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500 hover:text-black"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{vendorData.businessName || 'Unknown Vendor'}</h1>
              {vendorData.isVerified ? (
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle2 size={14} /> Verified
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <AlertCircle size={14} /> Unverified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium mt-1">Vendor ID: {vendorData.id}</p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Account Verification (Overall) */}
          {!vendorData.isVerified && vendorData.verificationStatus !== 'approved' ? (
            <button 
              onClick={() => handleVerificationStatus(true)}
              className="bg-black text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              <ShieldCheck size={16} /> Approve Account
            </button>
          ) : (
            <button 
              onClick={() => handleVerificationStatus(false)}
              className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <XCircle size={16} /> Revoke Account
            </button>
          )}

          {/* KYC Specific Actions */}
          {vendorData.kycStatus === 'submitted' && (
            <div className="flex gap-2 ml-4 pl-4 border-l border-gray-200">
               <button 
                 onClick={async () => {
                   await adminService.verifyKYC(vendorId);
                   toast.success("KYC Approved");
                   fetchVendorDetail();
                 }}
                 className="bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-600 transition-all flex items-center gap-2"
               >
                 <ShieldCheck size={16} /> Approve KYC
               </button>
               <button 
                 onClick={async () => {
                   await adminService.rejectKYC(vendorId);
                   toast.success("KYC Rejected");
                   fetchVendorDetail();
                 }}
                 className="bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-red-600 transition-all flex items-center gap-2"
               >
                 <XCircle size={16} /> Reject KYC
               </button>
            </div>
          )}

          <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 ml-2">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Business Profile</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Building2 size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Registration Number</p>
                  <p className="text-sm font-medium text-gray-900">{vendorData.registrationNumber || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><MapPin size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Address</p>
                  <p className="text-sm font-medium text-gray-900">{vendorData.businessAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Phone size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Support Phone</p>
                  <p className="text-sm font-medium text-gray-900">{vendorData.supportPhone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Mail size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Support Email</p>
                  <p className="text-sm font-medium text-gray-900">{vendorData.supportEmail || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financials Card */}
          <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Financial Tier</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Commission Rate</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{vendorData.commissionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Data & KYC Docs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                   <Briefcase size={16} />
                   <h3 className="text-xs font-bold uppercase tracking-wider">Total Trips</h3>
                </div>
                <p className="text-3xl font-black">{stats?.totalTrips || 0}</p>
             </div>
             <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 text-blue-500 mb-4">
                   <Calendar size={16} />
                   <h3 className="text-xs font-bold uppercase tracking-wider">Total Bookings</h3>
                </div>
                <p className="text-3xl font-black text-blue-600">{stats?.totalBookings || 0}</p>
             </div>
             <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 text-emerald-500 mb-4">
                   <Activity size={16} />
                   <h3 className="text-xs font-bold uppercase tracking-wider">Revenue Gen</h3>
                </div>
                <p className="text-3xl font-black text-emerald-600">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
             </div>
          </div>

          {/* KYC Documents Viewer */}
          <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
               <div className="flex items-center gap-3">
                 <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">KYC Documents</h2>
                 <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest",
                    vendorData.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                    vendorData.kycStatus === 'submitted' ? 'bg-blue-100 text-blue-700' :
                    vendorData.kycStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                 )}>{vendorData.kycStatus}</span>
               </div>
            </div>
            <div className="p-6">
              {kycDocs && Object.keys(kycDocs).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(kycDocs).map(([docType, doc]: [string, any]) => (
                    <div key={docType} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">{docType.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <button 
                            onClick={() => setPreviewDoc(doc.url)}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest mt-1 flex items-center gap-1"
                          >
                            <Eye size={12} /> View Document
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">No KYC documents uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewDoc(null)} />
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col h-[85vh]">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <h3 className="text-white font-bold">Document Preview</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-white transition-colors">Close</button>
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
}
