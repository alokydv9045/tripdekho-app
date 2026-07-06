"use client";

import React, { useEffect, useState } from 'react';
import { Bell, User, ChevronDown, Settings, LogOut, UserCircle, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { socketService } from '@/services/socketService';
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { clearCredentials } from '@/store/slices/authSlice';
import { authUtils } from '@/lib/authUtils';
import { authService } from '@/services/authService';
import { fixImageUrl } from '@/lib/utils/formatters';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleDisplay = user?.role ? user.role.replace('_', ' ') : 'Administrator';

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Continue local logout even if API fails
    }

    authUtils.clearAuthData();
    dispatch(clearCredentials());
    router.replace("/");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    socketService.on("vendor-registered", (data) => {
      setNotifications(prev => [{
        id: Date.now(),
        message: `New vendor registered: ${data.businessName}`,
        time: new Date(),
        read: false
      }, ...prev]);
      toast.info(`New Vendor Registration: ${data.businessName}`);
    });

    return () => {
      socketService.off("vendor-registered");
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-14 md:h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      
      {/* Left Section - Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Hamburger menu - mobile only */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>
        )}
        
        <div className="relative group flex-1 hidden sm:block">
          <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-2 px-4 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-all font-medium text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Action Section */}
      <div className="flex items-center gap-3 md:gap-6 relative">
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
            }}
            className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-72 md:w-80 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl overflow-hidden z-50">
              <div className="p-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <span className="text-xs font-bold uppercase text-gray-500">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                    className="text-[10px] text-blue-500 font-bold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-xs">No new notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={cn("p-3 text-sm border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer", n.read ? "opacity-60" : "bg-blue-50/30 dark:bg-blue-900/10")}>
                       <p className="text-gray-800 dark:text-gray-200">{n.message}</p>
                       <p className="text-[10px] text-gray-400 mt-1">{n.time.toLocaleTimeString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          className="flex items-center gap-2 md:gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 md:p-2 rounded-lg transition-colors"
          onClick={() => {
            setShowDropdown(!showDropdown);
            setShowNotifications(false);
          }}
        >
            <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-gray-900 dark:text-white capitalize">{roleDisplay}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{(user as any)?.isActive !== false ? 'Active Now' : 'Offline'}</p>
            </div>
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500 border border-gray-200 dark:border-gray-700 overflow-hidden">
                {user?.avatar ? (
                    <img src={fixImageUrl(typeof user.avatar === 'string' ? user.avatar : user.avatar.url)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   <User size={16} />
                )}
            </div>
            <ChevronDown size={14} className={cn("text-gray-400 transition-transform hidden sm:block", showDropdown && "rotate-180")} />
        </div>

        {showDropdown && (
          <div className="absolute top-14 right-0 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl py-1.5 z-50 overflow-hidden">
             <Link href="/admin/profile" className="block px-4 py-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
               <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'Admin User'}</p>
               <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
             </Link>
             
             <div className="py-1">
                 <Link href="/admin/profile" className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition-colors font-medium">
                   <UserCircle size={14} className="text-gray-400" /> My Profile
                 </Link>
                 <Link href="/admin/profile" className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2.5 transition-colors font-medium">
                   <Settings size={14} className="text-gray-400" /> Account Settings
                 </Link>
             </div>
             
             <div className="border-t border-gray-50 dark:border-gray-700 py-1">
                 <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2.5 transition-colors font-medium"
                 >
                   <LogOut size={14} className="text-red-500" /> Sign Out
                 </button>
             </div>
          </div>
        )}
      </div>
    </header>
  );
}
