"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Map,  CalendarCheck,
  LogOut,
  LineChart,
  MessageSquare,
  Settings,
  Menu,
  X,
  Banknote,
  UserCircle,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { chatService } from "@/services/chatService";

const VendorSidebar = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [unreadChatCount, setUnreadChatCount] = React.useState(0);

  React.useEffect(() => {
    if (!isAuthenticated || !user) return;
    let isSubscribed = true;

    const fetchCounts = async () => {
      try {
        const conversations = await chatService.fetchConversations();
        let unread = 0;
        conversations.forEach((c: any) => {
          if (c.lastMessage && !c.lastMessage.isRead && c.lastMessage.sender.id !== user.id) {
            unread += 1;
          }
        });
        if (isSubscribed) setUnreadChatCount(unread);
      } catch (error) {
        console.error("Failed to fetch unread chat counts", error);
      }
    };

    fetchCounts();

    const unsubscribeChat = chatService.onNewMessage((data) => {
      if (data.message.sender.id !== user.id) {
        setUnreadChatCount(prev => prev + 1);
      }
    });

    return () => {
      isSubscribed = false;
      unsubscribeChat();
    };
  }, [isAuthenticated, user]);

  const links = [
    { name: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
    { name: "My Trips", href: "/vendor/trips", icon: Map },
    { name: "Bookings", href: "/vendor/bookings", icon: CalendarCheck },
    { name: "Reviews", href: "/vendor/reviews", icon: Star },
    { name: "Earnings", href: "/vendor/earnings", icon: Banknote },
    { name: "Analytics", href: "/vendor/analytics", icon: LineChart },
    { name: "Messages", href: "/vendor/messages", icon: MessageSquare },
    { name: "Public Profile", href: "/vendor/profile", icon: UserCircle },
    { name: "Settings", href: "/vendor/settings", icon: Settings },
  ];

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="w-64 bg-white border-r border-gray-100 h-[calc(100vh-4rem)] md:h-[calc(100vh-72px)] flex flex-col p-4 flex-shrink-0 hidden md:flex sticky top-[72px]">
        <div className="mb-8 px-4 mt-4 shrink-0">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Vendor Menu</h2>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-200/60 hover:[&::-webkit-scrollbar-thumb]:bg-amber-300 [&::-webkit-scrollbar-thumb]:rounded-full pr-1 pb-4">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/vendor/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative z-10 ${
                  isActive 
                    ? "text-black font-black" 
                    : "text-gray-500 font-bold hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="vendor-nav-indicator"
                    className="absolute inset-0 bg-amber-400 rounded-2xl shadow-lg shadow-amber-200 z-0"
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <div className="relative z-10">
                  <link.icon className={`w-5 h-5 ${isActive ? "text-black" : "text-gray-400"}`} />
                  {link.name === "Messages" && unreadChatCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 border-2 border-white" />
                  )}
                </div>
                <span className="text-sm tracking-tight relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ─── MOBILE BOTTOM NAV BAR ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] animate-nav-appear">
        <div className="bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex items-stretch overflow-x-auto no-scrollbar pt-1 pb-2 px-1" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/vendor/dashboard" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[72px] tap-scale relative transition-all duration-200 ${
                    isActive ? "text-amber-500" : "text-gray-400"
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-b-lg" />
                  )}
                  <div className={`p-1.5 rounded-xl transition-all duration-200 shrink-0 relative ${isActive ? "bg-amber-50 mt-1" : "mt-1"}`}>
                    <link.icon className={`w-5 h-5 transition-all ${isActive ? "text-amber-500 scale-110" : "text-gray-500"}`} />
                    {link.name === "Messages" && unreadChatCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 border border-white" />
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider leading-none text-center whitespace-nowrap ${isActive ? "text-amber-500" : "text-gray-500"}`}>
                    {link.name.replace("Public ", "")}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default VendorSidebar;
