'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LogOut, ChevronRight, Activity, Shield, Hash, HelpCircle, BarChart, Settings, Users, Briefcase, Map, PenTool, LayoutDashboard, Youtube, Plane, CloudRain, Sun, Snowflake, Wind, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCredentials } from '@/store/slices/authSlice';
import { authUtils } from '@/lib/authUtils';
import { toast } from 'sonner';

interface AdminSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["super_admin", "tech_admin", "platform_admin", "finance_admin", "growth_admin", "support_admin", "operations_admin", "onboarding_admin", "content_admin"] },
  { name: "Users", href: "/admin/users", icon: Users, roles: ["super_admin", "tech_admin", "platform_admin"] },
  { name: "Vendors", href: "/admin/vendors", icon: Briefcase, roles: ["super_admin", "tech_admin", "platform_admin", "onboarding_admin"] },
  { name: "Trips", href: "/admin/trips", icon: Map, roles: ["super_admin", "tech_admin", "platform_admin", "operations_admin"] },
  { name: "Bookings", href: "/admin/bookings", icon: Briefcase, roles: ["super_admin", "tech_admin", "operations_admin"] },
  { name: "Finance Hub", href: "/admin/finance", icon: Hash, roles: ["super_admin", "tech_admin", "finance_admin"] },
  { name: "Growth Engine", href: "/admin/growth", icon: Activity, roles: ["super_admin", "growth_admin"] },
  { name: "Careers", href: "/admin/careers", icon: Briefcase, roles: ["super_admin", "growth_admin"] },
  { name: "Promo Codes", href: "/admin/promo-codes", icon: Hash, roles: ["super_admin", "tech_admin", "growth_admin"] },
  { name: "Support System", href: "/admin/support", icon: HelpCircle, roles: ["super_admin", "tech_admin", "support_admin"] },
  { name: "Inquiries", href: "/admin/messaging", icon: HelpCircle, roles: ["super_admin", "tech_admin", "support_admin"] },
  { name: "Activity Leads", href: "/admin/activity-leads", icon: Activity, roles: ["super_admin", "tech_admin", "support_admin", "platform_admin"] },
  { name: "Reviews", href: "/admin/reviews", icon: PenTool, roles: ["super_admin", "tech_admin", "operations_admin", "platform_admin"] },
  { name: "Vibe Manager", href: "/admin/content/vibe", icon: Youtube, roles: ["super_admin", "content_admin"] },
  { name: "Vlog Manager", href: "/admin/content/vlogs", icon: PenTool, roles: ["super_admin", "content_admin"] },
  { name: "Blog Manager", href: "/admin/content/blogs", icon: PenTool, roles: ["super_admin", "content_admin"] },
  { name: "KYC Check", href: "/admin/kyc", icon: Shield, roles: ["super_admin", "tech_admin", "onboarding_admin"] },
  { name: "Analytical Reports", href: "/admin/reports", icon: BarChart, roles: ["super_admin", "tech_admin", "finance_admin", "platform_admin"] },
  { name: "Control Panel", href: "/admin/settings", icon: Settings, roles: ["super_admin", "tech_admin"] },
];

const SYSTEM_NAV = [
    { name: "Audit Trail", href: "/admin/system/audit-logs", icon: Shield, roles: ["super_admin", "tech_admin"] },
    { name: "System Integrity", href: "/admin/system/pulse", icon: Activity, roles: ["super_admin", "tech_admin"] },
];

export function AdminSidebar({ onClose, isMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { user, platformSettings } = useAppSelector(state => state.auth);
  const dynamicPermissions = platformSettings?.adminModulePermissions || {};

  const [destIndex, setDestIndex] = useState(0);
  const [liveWeather, setLiveWeather] = useState<{temp: string, weather: string} | null>(null);

  const baseDestinations = [
    { name: "Manali Peak", query: "Manali", temp: "14°C", weather: "Sunny", desc: "🏔️ Trekking Season active", icon: Sun, color: "text-amber-800 bg-amber-100 border-amber-200 hover:bg-amber-200" },
    { name: "Goa Coast", query: "Goa", temp: "30°C", weather: "Breezy", desc: "🌊 Coastal Getaways crowded", icon: Wind, color: "text-blue-800 bg-blue-100 border-blue-200 hover:bg-blue-200" },
    { name: "Jaipur Heritage", query: "Jaipur", temp: "36°C", weather: "Warm", desc: "🏰 Fort Walk seasons open", icon: Sun, color: "text-orange-800 bg-orange-100 border-orange-200 hover:bg-orange-200" },
    { name: "Munnar Hills", query: "Munnar", temp: "22°C", weather: "Misty", desc: "🌿 Tea Garden bookings up", icon: CloudRain, color: "text-emerald-800 bg-emerald-100 border-emerald-200 hover:bg-emerald-200" },
    { name: "Gulmarg Snow", query: "Gulmarg", temp: "4°C", weather: "Snowy", desc: "❄️ Ski resorts open", icon: Snowflake, color: "text-cyan-800 bg-cyan-100 border-cyan-200 hover:bg-cyan-200" }
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      setLiveWeather(null); // Reset while loading
      const dest = baseDestinations[destIndex];
      try {
        const res = await fetch(`https://wttr.in/${dest.query}?format=j1`);
        const data = await res.json();
        if (data.current_condition && data.current_condition.length > 0) {
          const condition = data.current_condition[0];
          const temp = `${condition.temp_C}°C`;
          let weatherDesc = condition.weatherDesc[0].value;
          
          if (weatherDesc.toLowerCase().includes('clear') || weatherDesc.toLowerCase().includes('sun')) weatherDesc = 'Sunny';
          else if (weatherDesc.toLowerCase().includes('cloud') || weatherDesc.toLowerCase().includes('overcast')) weatherDesc = 'Cloudy';
          else if (weatherDesc.toLowerCase().includes('rain') || weatherDesc.toLowerCase().includes('drizzle')) weatherDesc = 'Rainy';
          else if (weatherDesc.toLowerCase().includes('snow') || weatherDesc.toLowerCase().includes('ice')) weatherDesc = 'Snowy';
          else if (weatherDesc.toLowerCase().includes('storm') || weatherDesc.toLowerCase().includes('thunder')) weatherDesc = 'Stormy';
          else if (weatherDesc.toLowerCase().includes('mist') || weatherDesc.toLowerCase().includes('fog')) weatherDesc = 'Misty';

          setLiveWeather({ temp, weather: weatherDesc });
        }
      } catch (e) {
        console.error("Failed to fetch weather", e);
      }
    };
    fetchWeather();
  }, [destIndex]);

  const currentDest = {
    ...baseDestinations[destIndex],
    ...(liveWeather ? { temp: liveWeather.temp, weather: liveWeather.weather } : {})
  };
  const WeatherIcon = currentDest.icon;

  const cycleDestination = () => {
    const nextIndex = (destIndex + 1) % baseDestinations.length;
    setDestIndex(nextIndex);
    toast.info(`Inspecting live weather for ${baseDestinations[nextIndex].name}!`);
  };

  const handleLogout = () => {
    // 1. Centralized Cleanup (LocalStorage & Cookies)
    authUtils.clearAuthData();

    // 2. Clear Redux Store
    dispatch(clearCredentials());

    // 3. Redirect to login
    router.replace('/?auth=login');
    toast.success('Admin session terminated');
  };

  const filteredNav = NAV_ITEMS.filter(item => {
    const allowedRoles = dynamicPermissions[item.href] || item.roles;
    const currentRole = user?.role || 'customer';
    return allowedRoles.includes(currentRole);
  });

  const filteredSystem = SYSTEM_NAV.filter(item => {
    const allowedRoles = dynamicPermissions[item.href] || item.roles;
    const currentRole = user?.role || 'customer';
    return allowedRoles.includes(currentRole);
  });

  return (
    <div className={cn(
      "w-64 bg-white border-r border-amber-200 flex flex-col h-screen select-none",
      isMobile ? "shadow-2xl" : "sticky top-0"
    )}>
      {/* Brand Section */}
      <div className="p-4 md:p-6 border-b border-amber-200 bg-amber-100 flex flex-col gap-3 relative overflow-hidden shrink-0">
         {/* Decorative clouds in background */}
         <div className="absolute right-[-20px] top-2 opacity-5 pointer-events-none">
            <CloudRain size={72} />
         </div>
         <div className="flex items-center justify-between">
           <Link 
             href="/" 
             className="flex items-center gap-2 group/logo transition-all hover:scale-[1.02] active:scale-95 duration-300"
             title="Go to Homepage"
           >
              <div className="relative h-12 w-32 filter drop-shadow-sm group-hover/logo:drop-shadow-[0_4px_12px_rgba(255,209,51,0.25)] transition-all duration-300">
                 <Image
                   src="/bg-logo.png"
                   alt="TripDekho Admin"
                   fill
                   className="object-contain"
                   priority
                 />
              </div>
              {/* Sliding Airplane Icon */}
              <Plane 
                size={16} 
                className="text-amber-500 opacity-0 -translate-x-4 group-hover/logo:opacity-100 group-hover/logo:translate-x-0 transition-all duration-500 ease-out" 
              />
           </Link>
           {/* Close button for mobile */}
           {isMobile && onClose && (
             <button 
               onClick={onClose}
               className="p-2 text-gray-400 hover:text-black hover:bg-amber-100 rounded-xl transition-all"
             >
               <X size={20} />
             </button>
           )}
         </div>
         <div className="flex items-center gap-1.5 px-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-505 font-bold uppercase tracking-wider capitalize">
              {user?.role?.replace('_', ' ') || 'Administrator'}
            </span>
         </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col pt-4 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-200 hover:[&::-webkit-scrollbar-thumb]:bg-amber-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Travel Weather Center Widget */}
        <div className="hidden md:block px-6 mb-4 shrink-0">
         <div 
           onClick={cycleDestination}
           className={cn(
             "p-4 rounded-2xl border transition-all duration-500 cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95 group flex flex-col gap-2.5",
             currentDest.color
           )}
         >
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Weather Monitor</span>
               <AnimatePresence mode="wait">
                 <motion.div
                   key={`icon-${destIndex}`}
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0, opacity: 0 }}
                   transition={{ duration: 0.2 }}
                 >
                   <WeatherIcon size={16} />
                 </motion.div>
               </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${destIndex}`}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-sm font-bold text-gray-950 flex items-baseline gap-1.5">
                   <span>{currentDest.name}</span>
                   <span className="text-xs font-black text-gray-450">{currentDest.temp}</span>
                </div>
                <p className="text-[10px] font-semibold text-gray-505 mt-0.5">{currentDest.desc}</p>
              </motion.div>
            </AnimatePresence>
            <div className="text-[9px] font-black uppercase tracking-widest text-amber-600 group-hover:underline flex items-center gap-0.5">
               Tap to explore next 📍
            </div>
         </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 py-2 px-6 space-y-1">
        <p className="text-xs font-semibold text-gray-400 mb-4 ml-2">Dashboard Menu</p>
        {filteredNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center justify-between group px-4 py-3 text-sm font-medium transition-all rounded-lg relative z-10",
                isActive 
                  ? "text-amber-950 font-bold bg-amber-100" 
                  : "text-gray-500 hover:text-black hover:bg-amber-50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={isMobile ? "admin-nav-indicator-mobile" : "admin-nav-indicator"}
                  className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-l-lg shadow-sm z-0"
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <div className="flex items-center gap-3 relative z-10">
                 <item.icon size={14} className={isActive ? "text-amber-950 font-bold" : "text-gray-400 group-hover:text-amber-800"} />
                 {item.name}
              </div>
              {isActive && <ChevronRight size={14} className="text-amber-950 font-bold relative z-10" />}
            </Link>
          );
        })}

        {filteredSystem.length > 0 && (
            <>
                <p className="text-xs font-semibold text-gray-400 mt-8 mb-4 ml-2">System Settings</p>
                {filteredSystem.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={isMobile ? onClose : undefined}
                            className={cn(
                                "flex items-center justify-between group px-4 py-3 text-sm font-medium transition-all rounded-lg border-l-2",
                                isActive 
                                    ? "bg-amber-100 text-amber-950 border-amber-500 font-bold" 
                                    : "text-gray-500 hover:text-black hover:bg-amber-50 border-transparent"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={14} className={isActive ? "text-amber-950 font-bold" : "text-gray-400 group-hover:text-amber-800"} />
                                {item.name}
                            </div>
                        </Link>
                    );
                })}
            </>
        )}
      </nav>
      </div>

      {/* Presence Tracking */}
      <div className="p-4 md:p-6 border-t border-amber-200 bg-amber-100 shrink-0">
          <div className="flex items-center justify-between mb-4 text-xs font-medium text-gray-400">
             <span className="capitalize">{user?.role?.replace('_', ' ') || 'Admin Panel'}</span>
             <span className="text-emerald-500 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Connected
             </span>
          </div>
          
          <button 
            className="w-full text-left py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all text-sm font-semibold flex items-center gap-2 group border-t border-amber-100 pt-6"
            onClick={handleLogout}
          >
             <LogOut size={14} className="group-hover:translate-x-1 transition-transform" /> Logout
          </button>
      </div>
    </div>
  );
}
