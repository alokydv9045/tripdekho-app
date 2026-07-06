"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  ArrowLeft,
  Activity,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Settings,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";


export default function UserDetailAdminPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUser(userId);
      if (data && data.user) {
        setUserData(data.user);
        setStats(data.stats);
      } else if (data) {
        setUserData(data);
        setStats(data.stats);
      }
    } catch (error) {
      toast.error("Failed to load user details");
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const toggleStatus = async () => {
    try {
      const newStatus = !userData.isActive;
      await adminService.updateUser(userId, { isActive: newStatus });
      toast.success(newStatus ? "User unbanned successfully" : "User suspended successfully");
      fetchUserDetail();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <PremiumLoader />;

  if (!userData) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/users')}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500 hover:text-black"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold text-xl overflow-hidden shadow-sm border border-gray-200">
               {userData.avatar ? (
                 <img 
                    src={typeof userData.avatar === 'string' ? userData.avatar : userData.avatar.url} 
                    alt={userData.name || 'User'} 
                    className="w-full h-full object-cover"
                 />
               ) : (
                 (userData.name || 'U').charAt(0).toUpperCase()
               )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{userData.name || 'Unknown User'}</h1>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  userData.role === 'customer' ? 'bg-blue-50 text-blue-600' : 
                  userData.role === 'vendor' ? 'bg-purple-50 text-purple-600' : 
                  'bg-amber-50 text-amber-600'
                )}>
                  {userData.role}
                </span>
                {!userData.isActive && (
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <ShieldAlert size={12} /> Suspended
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium mt-1">User ID: {userData.id}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={toggleStatus}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2",
              userData.isActive ? "bg-white border border-red-200 text-red-600 hover:bg-red-50" : "bg-black text-white hover:bg-gray-800"
            )}
          >
            {userData.isActive ? "Suspend Account" : "Unban Account"}
          </button>
          <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Personal Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Mail size={16} /></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                  <div className="flex justify-between items-center w-full">
                     <p className="text-sm font-medium text-gray-900">{userData.email}</p>
                     {userData.isVerified ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Phone size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900">{userData.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><MapPin size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-medium text-gray-900">{userData.profile?.city ? `${userData.profile.city}, ${userData.profile.country}` : 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Calendar size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Joined Date</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(userData.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 text-blue-500 mb-4">
                   <Briefcase size={16} />
                   <h3 className="text-xs font-bold uppercase tracking-wider">Total Bookings</h3>
                </div>
                <p className="text-4xl font-black text-blue-600">{stats?.totalBookings || 0}</p>
             </div>
             <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                   <Activity size={16} />
                   <h3 className="text-xs font-bold uppercase tracking-wider">Platform Activity</h3>
                </div>
                <p className="text-4xl font-black">{stats?.activityScore || 'Low'}</p>
             </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
               <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Bookings</h2>
               <button className="text-xs font-bold text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="p-8 text-center">
               <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-3">
                  <Calendar size={24} />
               </div>
               <p className="text-sm text-gray-500 font-medium">No booking history available for this user.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
