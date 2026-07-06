"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { customerService } from "@/services/index";
import { clearCredentials } from "@/store/slices/authSlice";
import { Settings, Shield, Bell, Trash2, ShieldAlert, Key, ToggleLeft, ToggleRight, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Settings States
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Delete State
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    setIsUpdatingPassword(true);
    setTimeout(() => {
      toast.success("Security settings updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsUpdatingPassword(false);
    }, 1000);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmPassword !== "DELETE") {
      toast.error("Please type DELETE to confirm account deletion.");
      return;
    }

    try {
      setIsDeleting(true);
      await customerService.deleteAccount();
      toast.success("Your account has been successfully deleted.");
      dispatch(clearCredentials());
      router.push("/");
    } catch (error: any) {
      console.error("Account deletion failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete account.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/10 via-stone-50/50 to-zinc-100/30 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col gap-12">
        
        {/* Header */}
        <div className="mb-4 relative">
          <p className="text-amber-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2 font-mono">Preferences</p>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase relative select-none">
            <span className="font-caveat font-normal capitalize text-amber-500 tracking-normal block text-4xl md:text-5xl -mb-3 md:-mb-5 pl-1 rotate-[-2deg]">My</span>
            <span className="font-marker font-normal tracking-wide text-gray-900 text-5xl md:text-7xl">SETTINGS</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation/Intro */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white border border-amber-200/20 p-6 rounded-[28px] shadow-lg">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Account Overview</h3>
              <p className="text-xs text-gray-500 font-bold leading-relaxed mb-4">Logged in as:</p>
              <div className="space-y-1">
                <p className="text-sm font-black text-gray-900 leading-none">{user?.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
                  {user?.email && !user.email.includes('guest_') ? user.email : "Phone Authenticated"}
                </p>
              </div>
            </div>
          </div>

          {/* Settings Options */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Notification Preferences */}
            <div className="bg-white border border-amber-200/20 rounded-[32px] p-8 shadow-xl shadow-gray-100/30">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="text-amber-500" size={20} />
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Notifications</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "Email Alerts", desc: "Receive email updates about bookings and itinerary details.", value: emailAlerts, setValue: setEmailAlerts },
                  { label: "SMS Alerts", desc: "Get real-time trip check-in updates and vendor responses via text message.", value: smsAlerts, setValue: setSmsAlerts },
                  { label: "Promo & Marketing", desc: "Stay informed about exclusive flight and hotel discounts.", value: marketingEmails, setValue: setMarketingEmails }
                ].map((pref, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="pr-6">
                      <p className="text-sm font-black text-gray-800 leading-none mb-1">{pref.label}</p>
                      <p className="text-xs text-gray-400 font-bold">{pref.desc}</p>
                    </div>
                    <button 
                      onClick={() => pref.setValue(!pref.value)}
                      className="text-amber-500 transition-colors focus:outline-none shrink-0"
                    >
                      {pref.value ? <ToggleRight size={38} className="fill-current text-amber-500" /> : <ToggleLeft size={38} className="text-gray-300" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>



            {/* Danger Zone */}
            <div className="bg-red-50/50 border border-red-200/50 rounded-[32px] p-8 shadow-xl shadow-red-100/10">
              <div className="flex items-center gap-3 mb-4 text-red-600">
                <ShieldAlert size={20} />
                <h3 className="text-lg font-black uppercase tracking-tight">Danger Zone</h3>
              </div>
              
              <p className="text-xs text-red-600/70 font-bold leading-relaxed mb-6">
                Deleting your account is permanent. All of your trip bookings, itinerary history, and passport stamps will be deleted forever.
              </p>
              
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="px-8 py-3 bg-red-50/80 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 font-black rounded-2xl text-[10px] tracking-widest uppercase transition-all flex items-center gap-2"
              >
                <Trash2 size={14} /> Close Account
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Delete Account Password Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-red-100 rounded-[32px] p-8 shadow-2xl max-w-md w-full relative">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <h4 className="text-lg font-black text-red-600 uppercase tracking-tight mb-2 flex items-center gap-2">
              <ShieldAlert size={20} /> Confirm Deletion
            </h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed mb-6">
              Type <strong>DELETE</strong> below to finalize deletion. This action cannot be undone.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Confirmation</label>
                <input 
                  type="text"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  placeholder="DELETE"
                  className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-red-400 font-bold text-sm text-gray-900 uppercase"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit"
                  disabled={isDeleting}
                  className="flex-1 h-11 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={14} />} Confirm Delete
                </button>
                <button 
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 h-11 bg-gray-50 text-gray-400 hover:text-gray-900 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-gray-100 transition-all"
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
