"use client";

import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { User, Mail, Shield, Phone, Camera, Save, Activity, Settings2, CheckCircle2 } from 'lucide-react';
import { adminService } from '@/services/adminService';
import { customerService } from '@/services/customerService';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { clearCredentials, updateAvatar } from '@/store/slices/authSlice';
import { useRef } from 'react';

export default function AdminProfilePage() {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const roleDisplay = user?.role ? user.role.replace('_', ' ') : 'Administrator';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      await adminService.updateUser(user.id, formData);
      toast.success('Profile updated successfully! Note: You may need to log in again to see changes everywhere.');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-gray-50 rounded-xl text-black">
                  <Settings2 size={24} />
               </div>
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Profile</h1>
            </div>
            <p className="text-sm text-gray-500 font-medium">Manage your personal information, contact details, and platform preferences</p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing && (
             <button 
               onClick={() => setIsEditing(true)}
               className="bg-black text-white px-6 py-2.5 text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow-sm active:scale-95 flex items-center gap-2"
             >
               <Settings2 size={16} />
               Edit Profile
             </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden relative">
         
         {/* Cover Area */}
         <div className="h-40 bg-gray-50 border-b border-gray-100 relative w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50" />
         </div>

         {/* Avatar & Status */}
         <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-8 flex justify-between items-end">
               <div className="flex items-end gap-6">
                  <div className="w-32 h-32 bg-white rounded-3xl shadow-sm border-4 border-white flex items-center justify-center p-1 relative group overflow-hidden">
                     <div 
                        onClick={() => isEditing && fileInputRef.current?.click()}
                        className={cn("w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-50 relative group/avatar", isEditing && "cursor-pointer")}
                     >
                        {user?.avatar ? (
                           <img src={typeof user.avatar === 'string' ? user.avatar : user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                           <span className="text-3xl font-bold text-gray-300 uppercase tracking-widest">{user?.name?.substring(0, 2) || 'AD'}</span>
                        )}
                        
                        {isEditing && (
                           <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                              <Camera size={24} className="text-white mb-1" />
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                {isUploadingAvatar ? "Syncing..." : "Update"}
                              </span>
                           </div>
                        )}
                     </div>
                  </div>
                  
                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/jpeg,image/png,image/webp" 
                    onChange={handleAvatarUpload}
                  />
                  <div className="pb-2">
                     <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'Administrator'}</h2>
                     <div className="flex items-center gap-3 mt-1 text-sm font-medium">
                        <span className="text-gray-500">{user?.email}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-widest">
                           <CheckCircle2 size={12} /> Active Account
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl pt-4 border-t border-gray-50">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Name */}
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                     <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                           type="text" 
                           required
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           disabled={!isEditing}
                           placeholder="Enter full name"
                           className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-medium text-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                     </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                           type="email" 
                           value={user?.email || ''}
                           disabled
                           className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium text-gray-500 opacity-60 cursor-not-allowed transition-all"
                        />
                     </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                     <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                           type="tel" 
                           value={formData.phone}
                           onChange={(e) => {
                             const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                             setFormData({...formData, phone: val});
                           }}
                           disabled={!isEditing}
                           placeholder="10-digit mobile number"
                           maxLength={10}
                           minLength={10}
                           pattern="[0-9]{10}"
                           className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 font-medium text-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                     </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">System Role</label>
                     <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                        <input 
                           type="text" 
                           value={roleDisplay}
                           disabled
                           className="w-full pl-12 pr-5 py-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl outline-none font-bold text-blue-700 capitalize cursor-not-allowed transition-all tracking-wide"
                        />
                     </div>
                  </div>
               </div>

               {/* Action Buttons */}
               {isEditing && (
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                     <button 
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({ name: user?.name || '', phone: user?.phone || '' });
                        }}
                        className="px-6 py-3.5 text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                     >
                        Cancel
                     </button>
                     <button 
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-3.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2 active:scale-95"
                     >
                        {isSaving ? (
                          <>
                            <Activity size={18} className="animate-spin" /> Saving Changes...
                          </>
                        ) : (
                          <>
                            <Save size={18} /> Commit Changes
                          </>
                        )}
                     </button>
                  </div>
               )}
            </form>
         </div>
      </div>
    </div>
  );
}
