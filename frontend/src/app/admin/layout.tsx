"use client";

import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { GlobalBanner } from '@/components/admin/GlobalBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';



export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, platformSettings } = useAppSelector(state => state.auth);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.push('/?auth=login');
      return;
    }

    // Dynamic Permission Lookup from DB Settings
    const dynamicPermissions = platformSettings?.adminModulePermissions || {};
    
    // Identify the specific module based on pathname prefix (longest match first)
    const activeModule = Object.keys(dynamicPermissions)
      .sort((a, b) => b.length - a.length)
      .find(path => pathname.startsWith(path));
    
    if (activeModule) {
      const allowedRoles = dynamicPermissions[activeModule];
      if (!allowedRoles.includes(user.role)) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    } else {
      // General admin paths (like /admin dashboard) are accessible to all admins
      setIsAuthorized(true);
    }
  }, [pathname, user, isAuthenticated, isLoading, router, platformSettings]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="flex bg-white min-h-screen text-gray-900 font-sans">
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        <div className="flex flex-col flex-1 min-w-0 bg-gray-50">
           <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
           <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="max-w-md w-full bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                 <div className="mb-8 flex justify-center">
                    <div className="p-6 bg-red-50 rounded-full text-red-500">
                       <ShieldAlert size={48} />
                    </div>
                 </div>
                 <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-4 uppercase italic">Access Denied</h1>
                 <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">
                    Your current role (**{user?.role.toUpperCase()}**) is not authorized to access this module. Please contact the security administrator for access.
                 </p>
                 <div className="flex flex-col gap-4">
                    <button 
                       onClick={() => router.push('/admin')}
                       className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95"
                    >
                       <ArrowLeft size={16} /> Return to Dashboard
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-300 tracking-widest mt-4">
                       <Lock size={12} /> Registry Protocol 4.0 // Secured
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen text-gray-900 font-sans">
      {/* Sidebar - Desktop (always visible) */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Sidebar - Mobile (slide-over drawer) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 z-50 md:hidden h-full"
            >
              <AdminSidebar onClose={() => setSidebarOpen(false)} isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        <GlobalBanner />
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-8 bg-gray-50">
          <AnimatePresence mode="wait">
            <motion.div
               key={pathname}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 10 }}
               transition={{ duration: 0.2 }}
            >
               {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
