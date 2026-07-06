"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { vendorService } from '@/services/vendorService';
import { axiosPrivate } from '@/lib/axios';
import { toast } from 'sonner';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Trash2,
  Eye,
  FileIcon
} from 'lucide-react';
import Image from 'next/image';

type DocType = 'panCard' | 'aadharFront' | 'aadharBack' | 'gstCertificate' | 'businessRegistration';

interface DocumentInfo {
  id: DocType;
  label: string;
  icon: any;
  required: boolean;
  desc: string;
}

const DOCUMENTS: DocumentInfo[] = [
  { id: 'panCard', label: 'PAN Card', icon: CreditCard, required: true, desc: 'Company or Director PAN' },
  { id: 'aadharFront', label: 'Aadhar Card (Front)', icon: FileText, required: true, desc: 'Authorized Signatory' },
  { id: 'aadharBack', label: 'Aadhar Card (Back)', icon: FileText, required: true, desc: 'Authorized Signatory' },
  { id: 'gstCertificate', label: 'GST Certificate', icon: FileText, required: false, desc: 'If applicable' },
  { id: 'businessRegistration', label: 'Business Registration', icon: Building2, required: true, desc: 'Incorporation cert, MSME, etc.' },
];

export default function VendorOnboardingPage() {
  const router = useRouter();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<string>('pending');
  const [razorpayStatus, setRazorpayStatus] = useState<string>('pending');
  
  // State for uploaded documents (URLs from backend)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { url: string; publicId: string }>>({});
  
  // State for files currently being uploaded
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  
  const [loading, setLoading] = useState(true);
  const [activePreview, setActivePreview] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchVendorKyc();
  }, []);

  const fetchVendorKyc = async () => {
    try {
      const res = await vendorService.getCurrentVendor();
      if (res.data) {
        setVendorId(res.data.id);
        setKycStatus(res.data.kycStatus);
        setRazorpayStatus(res.data.razorpayLinkedAccountStatus || 'pending');
        
        // Fetch current documents
        const docsRes = await axiosPrivate.get(`/vendors/${res.data.id}/kyc-documents`);
        if (docsRes.data?.data?.kycDocuments) {
          setUploadedDocs(docsRes.data.data.kycDocuments);
        }
      }
    } catch (err) {
      console.error("Failed to fetch vendor", err);
      toast.error("Failed to load KYC status");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (docId: DocType, file: File) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Only images and PDFs are allowed');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    if (!vendorId) return;

    setUploading(prev => ({ ...prev, [docId]: true }));
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axiosPrivate.post(`/vendors/${vendorId}/kyc-documents/${docId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`${DOCUMENTS.find(d => d.id === docId)?.label} uploaded successfully`);
      
      // Update local state with the new URL
      setUploadedDocs(prev => ({
        ...prev,
        [docId]: { url: res.data.data.url, publicId: res.data.data.publicId }
      }));
      
      setKycStatus(res.data.data.kycStatus); // Usually becomes 'submitted'
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to upload document`);
    } finally {
      setUploading(prev => ({ ...prev, [docId]: false }));
      // Reset input
      if (fileInputRefs.current[docId]) {
        fileInputRefs.current[docId]!.value = '';
      }
    }
  };

  const isAllRequiredUploaded = DOCUMENTS.filter(d => d.required).every(d => !!uploadedDocs[d.id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const handleLinkRazorpay = async () => {
    try {
      setLoading(true);
      // Create linked account
      const createRes = await vendorService.createRazorpayAccount(vendorId!);
      if (createRes.success) {
        // Get Onboarding link
        const linkRes = await vendorService.getRazorpayOnboardingLink(vendorId!);
        if (linkRes.success && linkRes.data?.url) {
          window.location.href = linkRes.data.url;
          return;
        }
      }
      toast.error('Failed to initiate bank linking');
    } catch (err) {
      toast.error('Failed to initiate bank linking');
    } finally {
      setLoading(false);
    }
  };

  // If approved, check Razorpay status
  if (kycStatus === 'approved' || kycStatus === 'verified') {
    if (razorpayStatus !== 'active') {
      return (
        <div className="max-w-3xl mx-auto py-12 px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-12 text-center shadow-xl border border-gray-100"
          >
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-purple-500" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Link Bank Account</h1>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Your KYC is verified! Now, link your bank account via Razorpay Route to receive payouts and accept live bookings. This step is mandatory.
            </p>
            <button 
              onClick={handleLinkRazorpay}
              className="px-8 py-4 bg-purple-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-lg shadow-purple-500/20 hover:bg-purple-600 transition-colors"
            >
              Setup Payouts with Razorpay
            </button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[32px] p-12 text-center shadow-xl border border-gray-100"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">KYC & Payouts Verified</h1>
          <p className="text-gray-500 max-w-md mx-auto mb-8">
            Your documents and bank details have been verified. You have full access to all TripDekho vendor features.
          </p>
          <button 
            onClick={() => router.push('/vendor/dashboard')}
            className="px-8 py-4 bg-amber-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-10">
        <button 
          onClick={() => router.push('/vendor/dashboard')}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-3">
          Document Verification
        </h1>
        <p className="text-gray-500 text-lg">
          Upload your business documents to verify your identity and start accepting bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Upload Section */}
        <div className="lg:col-span-2 space-y-4">
          {kycStatus === 'rejected' && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl flex gap-4 text-red-800">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold">Verification Failed</h3>
                <p className="text-sm mt-1">Some documents were rejected. Please re-upload clearer images for the rejected documents.</p>
              </div>
            </div>
          )}

          {DOCUMENTS.map((doc, idx) => {
            const isUploaded = !!uploadedDocs[doc.id];
            const isUploading = uploading[doc.id];
            const url = uploadedDocs[doc.id]?.url;
            const isPdf = url?.toLowerCase().endsWith('.pdf');

            return (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${isUploaded ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-500'}`}>
                  {isUploaded ? <CheckCircle2 className="w-6 h-6" /> : <doc.icon className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-lg">{doc.label}</h3>
                    {doc.required ? (
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Required</span>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">Optional</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{doc.desc}</p>
                </div>

                <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  <input 
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    ref={el => { fileInputRefs.current[doc.id] = el; }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileSelect(doc.id, e.target.files[0]);
                    }}
                  />
                  
                  {isUploading ? (
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-500 bg-amber-50 px-4 py-2 rounded-xl w-full justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </div>
                  ) : isUploaded ? (
                    <div className="flex items-center gap-2 w-full">
                      <button 
                        onClick={() => setActivePreview(url)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button 
                        onClick={() => fileInputRefs.current[doc.id]?.click()}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 text-sm font-bold rounded-xl transition-colors"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-gray-900/20"
                    >
                      <UploadCloud className="w-4 h-4" /> Upload
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="bg-amber-50 p-6 rounded-[24px] border border-amber-100 sticky top-24">
            <ShieldCheck className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Secure Verification</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Your documents are encrypted and stored securely. They are only used for identity verification in compliance with government regulations.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Supported formats: JPG, PNG, PDF</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Maximum file size: 10MB</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Ensure text is clearly visible and readable</p>
              </div>
            </div>

            <div className="pt-6 border-t border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-700">Verification Status</span>
                <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                  kycStatus === 'submitted' ? 'bg-blue-100 text-blue-700' :
                  kycStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                  kycStatus === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700'
                }`}>
                  {kycStatus}
                </span>
              </div>
              
              <button 
                disabled={!isAllRequiredUploaded || kycStatus === 'submitted'}
                onClick={() => router.push('/vendor/dashboard')}
                className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {kycStatus === 'submitted' ? 'Under Review' : 'Return to Dashboard'}
                {!isAllRequiredUploaded && kycStatus !== 'submitted' && <span className="text-[10px] lowercase normal-case">(Upload required docs)</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {activePreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActivePreview(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
                <h3 className="text-white font-bold">Document Preview</h3>
                <button 
                  onClick={() => setActivePreview(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-900 min-h-[50vh]">
                {activePreview.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={activePreview} className="w-full h-[70vh] rounded-xl bg-white" />
                ) : (
                  <img src={activePreview} alt="Document Preview" className="max-w-full max-h-[70vh] object-contain rounded-xl" />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
