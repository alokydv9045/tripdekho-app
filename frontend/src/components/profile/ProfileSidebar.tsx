"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, CalendarCheck, Heart, 
  MessageSquare, Settings, Star
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fixImageUrl } from "@/lib/utils/formatters";
import { chatService } from "@/services/chatService";

const ProfileSidebar = () => {
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

  const customerLinks = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "My Bookings", href: "/bookings", icon: CalendarCheck },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Reviews", href: "/profile/reviews", icon: Star },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Vendors only see Profile and Settings here — their portal has the rest
  const vendorLinks = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const links = user?.role === 'vendor' ? vendorLinks : customerLinks;

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="w-64 bg-white border-r border-gray-100 h-[calc(100vh-4rem)] md:h-[calc(100vh-72px)] flex flex-col p-4 flex-shrink-0 hidden md:flex sticky top-[72px] z-20">
        {/* Mini Passport Profile Card */}
        {pathname !== "/profile" && (
          <div className="mb-8 px-2 mt-4 flex flex-col items-center shrink-0">
            <div className="w-full max-w-[210px] h-[310px] bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309] border-yellow-400/20 rounded-[20px] p-5 pb-6 flex flex-col items-center justify-between text-white relative shadow-lg border select-none overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              <div className="absolute inset-2 border border-yellow-200/30 rounded-[16px] pointer-events-none" />
              <div className="text-center mt-2.5 z-10 flex flex-col items-center">
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-yellow-100/90 font-mono">
                  {user?.role === 'vendor' ? 'BUSINESS ID • IDENTITÉ' : 'PASSPORT • PASSEPORT'}
                </p>
                <p className="text-[17px] font-black uppercase tracking-[0.12em] text-yellow-50 leading-none mt-0.5 font-jakarta drop-shadow-sm">TRIPDEKHO</p>
              </div>
              <div className="relative w-24 h-24 flex items-center justify-center z-10 my-1">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-yellow-100/30">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
                  <path d="M10 50 H90" stroke="currentColor" strokeWidth="1" />
                  <path d="M50 10 V90" stroke="currentColor" strokeWidth="1" />
                  <path d="M50 10 C 25 30, 25 70, 50 90 C 75 70, 75 30, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
                <div className="w-14 h-14 rounded-full border-2 border-yellow-300 bg-yellow-100 text-amber-700 flex items-center justify-center overflow-hidden shadow-md z-20 transition-transform group-hover:scale-105 duration-500 relative">
                  {user?.avatar ? (
                    <img src={fixImageUrl(typeof user.avatar === 'string' ? user.avatar : user.avatar.url)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black font-jakarta">{user?.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute -right-3 -bottom-1 w-11 h-11 rounded-full border-2 border-dashed border-yellow-300/40 bg-amber-500/10 flex flex-col items-center justify-center rotate-[-12deg] pointer-events-none select-none z-30">
                  <span className="font-marker text-[7px] text-yellow-200/90 tracking-wider uppercase leading-none">PASSED</span>
                  <span className="font-mono text-[4px] text-yellow-300/60 uppercase">TD-OFFICE</span>
                </div>
              </div>
              <div className="w-full text-left space-y-2 z-10 px-1 border-t border-yellow-300/20 pt-2 font-mono">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[7.5px] text-yellow-200/70 block tracking-wider leading-none uppercase">NAME / NOM</span>
                    <span className="text-[13px] font-black text-white tracking-wide block truncate max-w-[110px] leading-tight font-jakarta">{user?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[7.5px] text-yellow-200/70 block tracking-wider leading-none uppercase">ORIGIN</span>
                    <span className="text-[10px] font-black text-white block tracking-wider leading-none">IND</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[7.5px] text-yellow-200/70 block tracking-wider leading-none uppercase">SIGNATURE</span>
                    <span className="text-[19px] text-yellow-200 font-caveat font-bold tracking-wider block leading-none pt-0.5 drop-shadow">{user?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[7.5px] text-yellow-200/70 block tracking-wider leading-none uppercase">ROLE</span>
                    <span className="text-[9px] font-black text-amber-200 tracking-wider block leading-none">{user?.role === 'vendor' ? 'VENDOR' : 'TRAVELLER'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <nav className="flex-1 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-200/60 hover:[&::-webkit-scrollbar-thumb]:bg-amber-300 [&::-webkit-scrollbar-thumb]:rounded-full pr-1 pb-4">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/profile" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive 
                    ? "bg-amber-400 text-black font-black shadow-lg shadow-amber-200" 
                    : "text-gray-500 font-bold hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="relative">
                  <link.icon className={`w-5 h-5 ${isActive ? "text-black" : "text-gray-400"}`} />
                  {link.name === "Messages" && unreadChatCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 border-2 border-white" />
                  )}
                </div>
                <span className="text-sm tracking-tight">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ─── MOBILE BOTTOM NAV BAR ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] animate-nav-appear">
        <div className="bg-white border-t border-gray-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex items-stretch justify-around pt-1 pb-2 px-1" style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/profile" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex flex-col items-center justify-center gap-1 py-2 px-2 flex-1 tap-scale relative transition-all duration-200 ${
                    isActive ? "text-amber-500" : "text-gray-400"
                  }`}
                >
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-b-lg" />
                  )}
                  <div className={`p-1.5 rounded-xl transition-all duration-200 relative shrink-0 ${isActive ? "bg-amber-50 mt-1" : "mt-1"}`}>
                    <link.icon className={`w-5 h-5 transition-all ${isActive ? "text-amber-500 scale-110" : "text-gray-500"}`} />
                    {link.name === "Messages" && unreadChatCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 border border-white" />
                    )}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider leading-none ${isActive ? "text-amber-500" : "text-gray-500"}`}>
                    {link.name.replace("My ", "")}
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

export default ProfileSidebar;
