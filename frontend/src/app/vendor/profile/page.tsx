"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import { vendorService } from "@/services/vendorService";
import { axiosPrivate } from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";
import {
  Mail, Phone, Globe, Camera, ImagePlus, Trash2,
  Save, Loader2, User, CheckCircle, Upload,
  Eye, ExternalLink, ShieldCheck, Calendar, Copy
} from "lucide-react";
import PrimaryButton from "@/components/shared/PrimaryButton";


const VendorProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [saved, setSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchVendorProfile();
  }, []);

  const fetchVendorProfile = async () => {
    try {
      setLoading(true);
      const res = await vendorService.getCurrentVendor();
      const data = res?.data;
      if (data) {
        setVendor(data);
        setFormData({
          name: data.user?.name || data.businessName || "",
          description: data.description || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
        });
        setLogoUrl(
          typeof data.logo === "string" ? data.logo : data.logo?.url || null
        );
        setBannerUrl(
          typeof data.banner === "string"
            ? data.banner
            : data.banner?.url || null
        );
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ── Copy Shareable Link ── */
  const handleCopyLink = () => {
    if (!vendor?.id) return;
    const url = `${window.location.origin}/vendors/${vendor.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Shareable link copied to clipboard!");
  };

  /* ── Logo Upload ── */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !vendor?.id) return;
    setUploadingLogo(true);
    try {
      const res = await vendorService.uploadLogo(vendor.id, file);
      const url = res?.data?.logo?.url || res?.data?.logo || "";
      setLogoUrl(url);
      toast.success("Logo updated!");
    } catch (err: any) {
      toast.error(
        "Logo upload failed: " +
          (err?.response?.data?.message || err.message)
      );
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  /* ── Banner Upload ── */
  const handleBannerUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !vendor?.id) return;
    setUploadingBanner(true);
    try {
      const fd = new FormData();
      fd.append("banner", file);
      const res = await axiosPrivate.post(
        `/vendors/${vendor.id}/banner`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const url =
        res.data?.data?.banner?.url || res.data?.data?.banner || "";
      setBannerUrl(url);
      toast.success("Banner updated!");
    } catch (err: any) {
      toast.error(
        "Banner upload failed: " +
          (err?.response?.data?.message || err.message)
      );
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  /* ── Remove Banner ── */
  const handleRemoveBanner = async () => {
    if (!vendor?.id) return;
    try {
      await axiosPrivate.put(`/vendors/${vendor.id}`, { banner: null } as any);
      setBannerUrl(null);
      toast.success("Banner removed");
    } catch {
      toast.error("Failed to remove banner");
    }
  };

  /* ── Save Profile ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor?.id) return;
    setSaving(true);
    try {
      await axiosPrivate.put(`/vendors/${vendor.id}`, {
        name: formData.name,
        description: formData.description,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      });

      // Sync Redux so dashboard greeting etc. update instantly
      if (user) {
        dispatch(setCredentials({ user: { ...user, name: formData.name } }));
      }

      setSaved(true);
      toast.success("Profile saved — your public page is updated!");
      setTimeout(() => setSaved(false), 3000);
      fetchVendorProfile();
    } catch (err: any) {
      toast.error(
        "Failed to save: " +
          (err?.response?.data?.message || "Please try again")
      );
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading State ── */
  if (loading) return <PremiumLoader />;

  const getKycBadge = () => {
    if (!vendor?.kycStatus) return null;
    
    switch (vendor.kycStatus) {
      case 'approved':
      case 'verified':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/15 border border-green-500/25 rounded-full">
            <ShieldCheck className="w-3 h-3 text-green-600" />
            <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">
              Verified
            </span>
          </div>
        );
      case 'submitted':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/15 border border-blue-500/25 rounded-full">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">
              Under Review
            </span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/15 border border-red-500/25 rounded-full">
            <ShieldCheck className="w-3 h-3 text-red-600" />
            <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">
              KYC Rejected
            </span>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/15 border border-amber-500/25 rounded-full">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest">
              KYC Pending
            </span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-1">
              Edit <span className="text-amber-500">Public Profile</span>
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Changes here update your public vendor page at /vendors/{vendor?.id?.slice(0, 8)}…
            </p>
          </div>
          {vendor?.id && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-5 py-3 bg-white text-gray-900 border border-gray-200 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-50 hover:border-amber-200 transition-all shadow-sm"
              >
                <Copy className="w-4 h-4 text-amber-500" /> Share Link
              </button>
              <Link
                href={`/vendors/${vendor.id}`}
                target="_blank"
                className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-500 hover:text-black transition-all shadow-lg"
              >
                <Eye className="w-4 h-4" /> View Live Page
                <ExternalLink className="w-3 h-3 opacity-50" />
              </Link>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ─────────── BANNER SECTION ─────────── */}
          <section className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <ImagePlus className="w-5 h-5 text-amber-500" /> Hero Banner
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                This appears as the background of your public profile header
              </p>
            </div>

            {/* Banner Preview */}
            <div className="relative group">
              <div
                className="w-full h-48 md:h-64 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center overflow-hidden"
                style={
                  bannerUrl
                    ? {
                        backgroundImage: `url(${bannerUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}
                }
              >
                {uploadingBanner ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                      Uploading banner…
                    </p>
                  </div>
                ) : !bannerUrl ? (
                  <div className="flex flex-col items-center gap-3 text-center px-4">
                    <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm">
                      <ImagePlus className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-xs font-bold text-gray-400">
                      No banner yet — upload a landscape image (1920 × 600 recommended)
                    </p>
                  </div>
                ) : null}

                {/* Overlay Buttons */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="px-5 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {bannerUrl ? "Change Banner" : "Upload Banner"}
                  </button>
                  {bannerUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      className="px-4 py-3 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all shadow-lg flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
            </div>

            {/* Profile Preview inside banner */}
            <div className="px-6 md:px-10 -mt-12 pb-6 relative z-10">
              <div className="flex items-end gap-5">
                {/* Logo in context */}
                <div className="relative group/logo shrink-0">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                    {uploadingLogo ? (
                      <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                    ) : logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                        <span className="text-3xl font-black text-white">
                          {formData.name?.charAt(0) || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors shadow-lg opacity-0 group-hover/logo:opacity-100"
                  >
                    <Camera className="w-4 h-4 text-black" />
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                      {formData.name || "Your Business Name"}
                    </h2>
                    {getKycBadge()}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">
                    This is how your profile header looks to customers
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─────────── BUSINESS INFO ─────────── */}
          <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3">
              <User className="w-5 h-5 text-amber-500" /> Business Info
            </h3>

            {/* Name */}
            <div className="space-y-2 mb-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">
                Business / Vendor Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Himalayan Bro"
                  className="w-full h-14 pl-14 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-amber-400 focus:bg-white transition-all text-sm font-bold placeholder:text-gray-300"
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 ml-4">
                Shows on your public page header, trip cards, and search results
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">
                About / Tagline
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. Pioneers in high-altitude trekking, mountaineering expeditions, and wilderness camping in Northern India."
                rows={4}
                className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-amber-400 focus:bg-white transition-all text-sm font-bold placeholder:text-gray-300 resize-none"
              />
              <p className="text-[10px] font-bold text-gray-400 ml-4">
                Displayed below your name on your public profile page
              </p>
            </div>
          </section>

          {/* ─────────── CONTACT DETAILS ─────────── */}
          <section className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-8 flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-500" /> Contact Details
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6 -mt-4">
              These are shown publicly on your vendor page so customers can reach you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">
                  Public Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@yourcompany.com"
                    className="w-full h-14 pl-14 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-amber-400 focus:bg-white transition-all text-sm font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="w-full h-14 pl-14 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-amber-400 focus:bg-white transition-all text-sm font-bold placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ─────────── ACCOUNT INFO (read-only) ─────────── */}
          <section className="bg-amber-50/60 p-6 rounded-[28px] border border-amber-100/60">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
                    Account Email
                  </p>
                  <p className={`text-sm font-bold mt-0.5 ${user?.email || vendor?.user?.email ? "text-gray-500" : "text-gray-400 italic"}`}>
                    {user?.email || vendor?.user?.email || "Not Added"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">
                    Member Since
                  </p>
                  <p className="text-sm font-bold text-gray-500 mt-0.5">
                    {vendor?.createdAt
                      ? new Date(vendor.createdAt).toLocaleDateString("en-IN", {
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ─────────── SAVE ─────────── */}
          <footer className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {vendor?.id && (
              <Link
                href={`/vendors/${vendor.id}`}
                target="_blank"
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-amber-500 transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview public page
              </Link>
            )}
            <PrimaryButton
              type="submit"
              disabled={saving}
              className="px-12 h-16 text-sm shadow-2xl shadow-amber-500/20 group"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : saved ? (
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              ) : (
                <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              )}
              {saving
                ? "Saving..."
                : saved
                ? "Saved!"
                : "Save Public Profile"}
            </PrimaryButton>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default VendorProfilePage;
