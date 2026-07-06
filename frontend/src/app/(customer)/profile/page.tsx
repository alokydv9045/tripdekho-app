"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { authService, customerService, vendorService } from "@/services/index";
import { authUtils } from "@/lib/authUtils";
import { setCredentials, clearCredentials, updateAvatar, openAuthModal } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  User, Mail, Phone, MapPin, X, LogOut, 
  ChevronRight, Plane, Building2, Star, 
  Award, Calendar, Smartphone, Users, Save, Shield, Compass, Camera
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export default function ProfilePage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal State
  const [activeField, setActiveField] = useState<string | null>(null);
  const [fieldLabel, setFieldLabel] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editStateValue, setEditStateValue] = useState(""); // extra field for location state
  
  const [liveStats, setLiveStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/");
      setTimeout(() => dispatch(openAuthModal('login')), 100);
    } else if (!user) {
      authService.getMe().then((res: any) => {
        const userData = res.data || res;
        dispatch(setCredentials({ user: userData }));
        fetchStats(userData);
      }).catch((e: any) => {
        console.error("Failed getting profile", e);
        setStatsLoading(false);
      });
    } else {
      fetchStats(user);
    }
  }, [isAuthenticated, user, router, dispatch]);

  const fetchStats = async (userData: any) => {
    try {
      if (userData.role === 'vendor') {
        const vendorRes = await vendorService.getCurrentVendor();
        const vendorId = vendorRes.data.id;
        const dashRes = await vendorService.getDashboard(vendorId);
        setLiveStats(dashRes.data.stats);
      } else {
        const res = await customerService.getStatistics();
        setLiveStats(res.data);
      }
    } catch (e) {
      console.error("Failed to fetch stats", e);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout API call failed:', e);
    }
    
    // Centralized "Full Purge" of all storage layers
    authUtils.clearAuthData();
    
    dispatch(clearCredentials());
    
    // Force a full reload to the home page to reset all states & clear memory cache
    window.location.href = "/";
  };

  const openEditModal = (field: string, label: string, value: string) => {
    setActiveField(field);
    setFieldLabel(label);
    setEditValue(value || "");
    if (field === "city") {
      setEditStateValue(user?.location?.state || "");
    }
  };

  const closeEditModal = () => {
    setActiveField(null);
    setFieldLabel("");
    setEditValue("");
    setEditStateValue("");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const res = await customerService.uploadProfilePicture(file);
      if (res.success && res.data?.avatar) {
        dispatch(updateAvatar(res.data.avatar));
        toast.success("Profile picture updated!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload picture");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSaving(true);
      let updatePayload: any = {};

      if (activeField === "name") {
        updatePayload.name = editValue;
      } else if (activeField === "phone") {
        updatePayload.phone = editValue;
      } else if (activeField === "nickname") {
        updatePayload.nickname = editValue;
      } else if (activeField === "email") {
        updatePayload.email = editValue;
      } else if (activeField === "dateOfBirth") {
        updatePayload.dateOfBirth = editValue ? new Date(editValue) : null;
      } else if (activeField === "gender") {
        updatePayload.gender = editValue;
      } else if (activeField === "city") {
        updatePayload.location = {
          ...user.location,
          city: editValue,
          state: editStateValue
        };
      }

      const response = await customerService.updateProfile(updatePayload);
      const updatedUser = response.data || response;
      dispatch(setCredentials({ user: { ...user, ...updatedUser } }));
      toast.success(`${fieldLabel} updated successfully!`);
      closeEditModal();
    } catch (error) {
      console.error("Save profile field error:", error);
      toast.error(`Failed to update ${fieldLabel}.`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 min-h-screen bg-gray-50 text-gray-900">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  // Derived date of birth string
  const dobFormatted = user.dateOfBirth
    ? new Date(user.dateOfBirth).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50/30 via-slate-50/80 to-zinc-100/50 text-gray-900 pb-28 md:pb-20 overflow-hidden flex flex-col justify-between">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-300/10 blur-[150px] pointer-events-none z-0" />
      
      {/* Background Watermark (Follow your light) */}
      <div 
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl h-56 pointer-events-none opacity-[0.15] select-none bg-contain bg-no-repeat bg-center z-0"
        style={{ backgroundImage: `url('/images/follow-your-light.avif')` }}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16 flex flex-col gap-10 md:gap-16 relative z-10 w-full">
        {/* Profile Card Section */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-0.5">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.25em] font-mono">
              {user?.role === "vendor" ? "Vendor Identification" : "Personal Travel Logs"}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase relative select-none">
              <span className="font-caveat font-normal capitalize text-amber-500 tracking-normal block text-4xl md:text-5xl -mb-2 md:-mb-3 pl-1 rotate-[-2deg]">My</span>
              <span className="font-marker font-normal tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.15)] text-5xl md:text-7xl">
                {user?.role === "vendor" ? "BUSINESS ID" : "PASSPORT"}
              </span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-12 xl:gap-16 w-full mt-4">
            
            {user?.role === "vendor" ? (
              <div className="flex flex-col gap-6 w-full lg:max-w-[340px]">
                {/* Vendor Business Card Container */}
                <div className="perspective-1000 group/passport shrink-0 w-full">
                  <div className="w-full max-w-[340px] mx-auto h-[200px] sm:h-[220px] bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] rounded-[16px] p-4 sm:p-5 flex flex-col justify-between text-white relative shadow-[0_20px_50px_rgba(217,119,6,0.25)] border-2 border-yellow-400/25 select-none overflow-hidden transition-all duration-700 ease-out transform-gpu group-hover/passport:scale-[1.04] group-hover/passport:shadow-[0_25px_60px_rgba(217,119,6,0.4)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover/passport:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                    
                    {/* Header */}
                    <div className="flex justify-between items-start z-10 w-full">
                      <div>
                        <p className="text-[14px] font-black uppercase tracking-[0.15em] text-white leading-none font-jakarta drop-shadow-md">OFFICIAL VENDOR</p>
                        <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-yellow-200 font-mono mt-1">TRIPDEKHO PARTNER NETWORK</p>
                      </div>
                      <Building2 className="text-yellow-200 w-8 h-8 opacity-80" />
                    </div>
                    
                    {/* Identity Biodata Form */}
                    <div className="w-full z-10 flex gap-4 items-end mt-4">
                      {/* Avatar */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded-xl border-2 border-yellow-300 bg-yellow-100 flex items-center justify-center overflow-hidden shadow-lg z-20 cursor-pointer relative group/avatar shrink-0"
                      >
                        {user?.avatar ? (
                          <img src={typeof user.avatar === 'string' ? user.avatar : user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-black text-amber-700 font-jakarta">{user?.name?.charAt(0)}</span>
                        )}
                        {isUploadingAvatar ? (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/40 hidden group-hover/avatar:flex items-center justify-center text-white backdrop-blur-sm transition-all">
                            <Camera size={14} />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 font-mono text-white pb-1 border-b border-yellow-500/30">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                          <div className="col-span-2">
                            <span className="text-[7px] text-yellow-100/70 block tracking-wider leading-none uppercase font-semibold">BUSINESS NAME</span>
                            <span className="text-[12px] font-black text-white tracking-wide block truncate max-w-[180px] leading-tight font-jakarta">{user?.name}</span>
                          </div>
                          <div>
                            <span className="text-[7px] text-yellow-100/70 block tracking-wider leading-none uppercase font-semibold">LICENSE NO.</span>
                            <span className="text-[9px] font-black text-yellow-100 tracking-wider block leading-tight">VN-{user?.id ? user.id.slice(-6).toUpperCase() : "8924DK"}</span>
                          </div>
                          <div>
                            <span className="text-[7px] text-yellow-100/70 block tracking-wider leading-none uppercase font-semibold">STATUS</span>
                            <span className="text-[9px] font-black text-white block tracking-wider leading-tight">VERIFIED</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Vendor Live Stats */}
                <div className="flex flex-col gap-3">
                  {statsLoading ? (
                    <div className="animate-pulse flex flex-col gap-3">
                      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white rounded-xl shadow-sm border border-gray-100" />)}
                    </div>
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                         <span className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Plane size={14} className="text-amber-500" /> Total Trips</span>
                         <span className="text-xl font-black text-gray-900">{liveStats?.totalTrips || 0}</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                         <span className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Users size={14} className="text-indigo-500" /> Total Bookings</span>
                         <span className="text-xl font-black text-gray-900">{liveStats?.totalBookings || 0}</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                         <span className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Star size={14} className="text-emerald-500" /> Total Revenue</span>
                         <span className="text-xl font-black text-emerald-600">₹{liveStats?.totalRevenue || 0}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
            <div className="flex flex-col gap-6 w-full lg:max-w-[300px]">
              {/* Passport Container with 3D perspective and gold reflection */}
              <div className="perspective-1000 group/passport shrink-0 w-full">
                <div className="w-full max-w-[300px] mx-auto h-[420px] sm:h-[450px] bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] rounded-[24px] p-5 sm:p-6 flex flex-col items-center justify-between text-black relative shadow-[0_20px_50px_rgba(217,119,6,0.22)] border-2 border-yellow-400/25 select-none overflow-hidden transition-all duration-700 ease-out transform-gpu group-hover/passport:scale-[1.04] group-hover/passport:shadow-[0_25px_60px_rgba(217,119,6,0.38)]">
                  
                  {/* Shiny gloss effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full group-hover/passport:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                  
                  {/* Inside borders */}
                  <div className="absolute inset-2.5 border border-yellow-200/40 rounded-[16px] pointer-events-none" />
                  <div className="absolute inset-3 border border-yellow-200/20 rounded-[14px] pointer-events-none" />
                  
                  {/* Header */}
                  <div className="text-center mt-2.5 z-10 flex flex-col items-center">
                    <p className="text-[8px] font-black uppercase tracking-[0.35em] text-yellow-100/90 font-mono">REPUBLIC OF TRIPDEKHO</p>
                    <p className="text-[20px] font-black uppercase tracking-[0.12em] text-yellow-50 leading-none mt-1 font-jakarta drop-shadow-md">PASSPORT • PASSEPORT</p>
                  </div>
                  
                  {/* Globe Emblem SVG with profile avatar in center */}
                  <div className="relative w-32 h-32 flex items-center justify-center z-10 my-2 filter drop-shadow-[0_0_8px_rgba(253,230,138,0.4)]">
                    {/* Globe lines */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-yellow-50/40">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
                      <path d="M10 50 H90" stroke="currentColor" strokeWidth="1" />
                      <path d="M50 10 V90" stroke="currentColor" strokeWidth="1" />
                      <path d="M50 10 C 25 30, 25 70, 50 90 C 75 70, 75 30, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                      <path d="M50 10 C 37 30, 37 70, 50 90 C 63 70, 63 30, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    {/* Profile Avatar in center */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-full border-2 border-yellow-300 bg-yellow-100 flex items-center justify-center overflow-hidden shadow-lg z-20 transition-transform group-hover/passport:scale-105 duration-500 cursor-pointer relative group/avatar"
                    >
                      {user?.avatar ? (
                        <img src={typeof user.avatar === 'string' ? user.avatar : user.avatar.url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-black text-amber-700 font-jakarta">{user?.name?.charAt(0)}</span>
                      )}
                      
                      {/* Upload Loading Overlay - always visible while uploading */}
                      {isUploadingAvatar ? (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm rounded-full">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-1" />
                          <span className="text-[7px] font-bold tracking-wider uppercase font-mono">Uploading...</span>
                        </div>
                      ) : (
                        /* Hover Overlay */
                        <div className="absolute inset-0 bg-black/40 hidden group-hover/avatar:flex flex-col items-center justify-center text-white backdrop-blur-sm transition-all">
                          <Camera size={20} className="mb-0.5" />
                          <span className="text-[8px] font-bold tracking-wider uppercase font-mono text-center leading-tight">
                            Update Photo
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Hidden file input */}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/webp" 
                      onChange={handleAvatarUpload}
                    />
                    {/* Stamp */}
                    <div className="absolute -right-2 -bottom-2 w-14 h-14 rounded-full border-2 border-dashed border-yellow-300/40 flex flex-col items-center justify-center rotate-[-15deg] bg-amber-500/10 pointer-events-none select-none z-30">
                      <span className="font-marker text-[8px] text-yellow-200/80 tracking-widest uppercase leading-none">APPROVED</span>
                      <span className="font-mono text-[5px] text-yellow-300/60 uppercase mt-0.5">VISA OFFICIER</span>
                    </div>
                  </div>
                  
                  {/* Identity Biodata Form */}
                  <div className="w-full px-3 z-10 flex flex-col items-center gap-2">
                    <div className="w-full text-left space-y-2.5 z-10 px-1 border-t border-yellow-300/25 pt-3.5 font-mono text-black">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                        <div>
                          <span className="text-[8px] text-yellow-100/70 block tracking-wider leading-none uppercase font-semibold">SURNAME / NOM</span>
                          <span className="text-[13px] font-black text-white tracking-wide block truncate max-w-[105px] leading-tight font-jakarta">{user?.name?.split(" ")[1] || user?.name}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-yellow-100/70 block tracking-wider leading-none uppercase font-semibold">GIVEN NAMES</span>
                          <span className="text-[13px] font-black text-white tracking-wide block truncate max-w-[105px] leading-tight font-jakarta">{user?.name?.split(" ")[0] || "EXPLORER"}</span>
                        </div>
                        
                        <div>
                          <span className="text-[8px] text-yellow-100/70 block tracking-wider leading-none uppercase font-semibold">PASSPORT NO.</span>
                          <span className="text-[11px] font-black text-yellow-100 tracking-wider block leading-tight">TD-{user?.id ? user.id.slice(-6).toUpperCase() : "8924DK"}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-yellow-100/70 block tracking-wider leading-none uppercase font-semibold">NATIONALITY</span>
                          <span className="text-[11px] font-black text-yellow-100 block tracking-wider leading-tight font-mono">IND</span>
                        </div>
                        
                        <div>
                          <span className="text-[8px] text-yellow-100/70 block tracking-wider leading-none uppercase font-semibold">SIGNATURE</span>
                          <span className="text-[20px] font-bold text-yellow-200 font-caveat tracking-wider block leading-none pt-0.5 drop-shadow">{user?.name}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-yellow-100/70 block tracking-wider leading-none uppercase font-semibold">AUTHORITY</span>
                          <span className="text-[10px] font-black text-amber-200 tracking-wide block leading-tight font-mono">TRIPDEKHO</span>
                        </div>
                      </div>
                      
                      {/* Machine Readable Zone (MRZ) */}
                      <div className="w-full text-center mt-3.5 pt-2.5 border-t border-yellow-300/15 font-mono text-[8px] text-yellow-200/40 tracking-[0.18em] uppercase select-none leading-none truncate">
                        P&lt;IND&lt;&lt;{user?.name?.toUpperCase()?.replace(/\s+/g, "&lt;")}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Live Stats */}
              <div className="flex flex-col gap-3">
                {statsLoading ? (
                  <div className="animate-pulse flex flex-col gap-3">
                    {[1, 2].map(i => <div key={i} className="h-16 bg-white rounded-xl shadow-sm border border-amber-100/50" />)}
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100/50 flex items-center justify-between">
                       <span className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Plane size={14} className="text-amber-500" /> Completed Trips</span>
                       <span className="text-xl font-black text-gray-900">{liveStats?.completedTrips || liveStats?.totalTrips || 0}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100/50 flex items-center justify-between">
                       <span className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Star size={14} className="text-amber-500" /> Reviews Written</span>
                       <span className="text-xl font-black text-gray-900">{liveStats?.totalReviews || 0}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            )}

            {/* My Information Card */}
            <div className="flex flex-col gap-6 w-full lg:max-w-xl">
              
              {/* Glassmorphic details panel */}
              <div className="bg-white border border-amber-200/30 rounded-[32px] p-6 md:p-8 shadow-xl">
                <h3 className="text-[20px] font-black text-gray-900 uppercase tracking-tight mb-6">My Information</h3>
                
                <div className="divide-y divide-amber-100/50">
                  {/* Full Name */}
                  <button 
                    onClick={() => openEditModal("name", "Full Name", user.name)}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50/50 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Full Name</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{user.name}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                  
                  {/* Nickname */}
                  <button 
                    onClick={() => openEditModal("nickname", "Nickname", user.nickname || "")}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50/50 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <User size={18} className="rotate-12" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Nickname</p>
                        <p className={`text-sm font-bold leading-tight ${user.nickname ? "text-gray-900" : "text-gray-400 italic"}`}>
                          {user.nickname || "Set Nickname"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Date of Birth */}
                  <button 
                    onClick={() => openEditModal("dateOfBirth", "Date of Birth", user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "")}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50/50 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Date of Birth</p>
                        <p className={`text-sm font-bold leading-tight ${user.dateOfBirth ? "text-gray-900" : "text-gray-400 italic"}`}>
                          {dobFormatted || "Set Date of Birth"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Gender */}
                  <button 
                    onClick={() => openEditModal("gender", "Gender", user.gender || "")}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50/50 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Gender</p>
                        <p className={`text-sm font-bold leading-tight capitalize ${user.gender ? "text-gray-900" : "text-gray-400 italic"}`}>
                          {user.gender || "Set Gender"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Location */}
                  <button 
                    onClick={() => openEditModal("city", "Location (City)", user.location?.city || "")}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50/50 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">I am from</p>
                        <p className={`text-sm font-bold leading-tight ${user.location?.city ? "text-gray-900" : "text-gray-400 italic"}`}>
                          {user.location?.city ? `${user.location.city}${user.location?.state ? `, ${user.location.state}` : ""}` : "Set Location"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Email */}
                  <button 
                    onClick={() => openEditModal("email", "Email Address", user.email && !user.email.includes('guest_') ? user.email : "")}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50/50 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Address</p>
                        <p className={`text-sm font-bold leading-tight truncate max-w-[190px] md:max-w-xs ${user.email && !user.email.includes('guest_') ? "text-gray-950" : "text-gray-400 italic"}`}>
                          {user.email && !user.email.includes('guest_') ? user.email : "Set Email Address"}
                        </p>
                      </div>
                    </div>
                    {user.email && !user.email.includes('guest_') ? (
                      <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded shrink-0">Verified</span>
                    ) : (
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    )}
                  </button>

                  {/* Phone */}
                  <button 
                    onClick={() => openEditModal("phone", "Phone Number", user.phone || "")}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50/50 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Phone Number</p>
                        <p className={`text-sm font-bold leading-tight ${user.phone ? "text-gray-900" : "text-gray-400 italic"}`}>
                          {user.phone || "Set Phone Number"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Saved Trips */}
                  <button 
                    onClick={() => router.push("/wishlist")}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50/50 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <Star size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 tracking-widest leading-none mb-1">Favorites</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">Saved Trips</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Transaction History */}
                  <button 
                    onClick={() => router.push("/bookings")}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-50/50 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 tracking-widest leading-none mb-1">History</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">Transaction History</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Log Out */}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between py-3.5 text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shrink-0">
                        <LogOut size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">Session</p>
                        <p className="text-sm font-bold text-red-500 group-hover:text-red-300 leading-tight">Log Out</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-red-300 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Field Editor Modal */}
      {activeField && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white border border-amber-100 rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl w-full sm:max-w-md animate-slide-up sm:animate-in sm:zoom-in-95 duration-200 relative text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeEditModal}
              className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Modify {fieldLabel}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Update your account detail below</p>

            <form onSubmit={handleSaveField} className="space-y-6">
              {activeField === "gender" ? (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Select Gender</label>
                  <select 
                    value={editValue || ""} 
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-amber-400 font-bold text-sm cursor-pointer text-gray-900"
                  >
                    <option value="" className="bg-white">Select Gender</option>
                    <option value="male" className="bg-white">Male</option>
                    <option value="female" className="bg-white">Female</option>
                    <option value="other" className="bg-white">Other</option>
                  </select>
                </div>
              ) : activeField === "dateOfBirth" ? (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Date of Birth</label>
                  <input 
                    type="date"
                    value={editValue || ""}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-amber-400 font-bold text-sm text-gray-900"
                  />
                </div>
              ) : activeField === "city" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">City</label>
                    <input 
                      type="text"
                      value={editValue || ""}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="e.g. Delhi"
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-amber-400 font-bold text-sm text-gray-900"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">State</label>
                    <input 
                      type="text"
                      value={editStateValue || ""}
                      onChange={(e) => setEditStateValue(e.target.value)}
                      placeholder="e.g. Delhi"
                      className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-amber-400 font-bold text-sm text-gray-900"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Enter Value</label>
                  <input 
                    type={activeField === "phone" ? "tel" : activeField === "email" ? "email" : "text"}
                    value={editValue || ""}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-amber-400 font-bold text-sm text-gray-900"
                    required
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 h-12 bg-amber-400 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"} <Save size={14} />
                </button>
                <button 
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 h-12 bg-gray-50 text-gray-400 hover:text-gray-900 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
