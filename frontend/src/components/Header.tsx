"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearCredentials, openAuthModal } from "@/store/slices/authSlice";
import { authUtils } from "@/lib/authUtils";
import { authService } from "@/services/authService";
import { notificationService } from "@/services/notificationService";
import { chatService } from "@/services/chatService";
import { useRouter } from "next/navigation";
import PrimaryButton from "./shared/PrimaryButton";
import { fixImageUrl } from "@/lib/utils/formatters";
import { 
  User, LogOut, ChevronDown, ChevronRight, Smartphone, Play, 
  Search, Menu, ShoppingBag, Heart, Bell, X, 
  Users, ShieldCheck, Building2, MapPin, Briefcase, Plane
} from "lucide-react";
import NotificationDropdown from "./shared/NotificationDropdown";
import { ProfileHoverMenu } from "./shared/ProfileHoverMenu";
import { motion, AnimatePresence } from "framer-motion";
import { variants } from "@/lib/motion";
import AnimatedButton from "./shared/AnimatedButton";
import { toast } from "sonner";

const POPULAR_DESTINATIONS = [
  { name: "Manali, Himachal Pradesh", category: "Hill Station" },
  { name: "Leh Ladakh", category: "Adventure" },
  { name: "Goa beaches", category: "Beach & Party" },
  { name: "Kerala Backwaters", category: "Nature & Wellness" },
  { name: "Srinagar, Kashmir", category: "Scenic Lakes" },
  { name: "Jaipur, Rajasthan", category: "Heritage & Palaces" },
  { name: "Rishikesh, Uttarakhand", category: "Adventure & Spiritual" },
  { name: "Sikkim & Darjeeling", category: "Himalayas & Tea Gardens" },
  { name: "Munnar, Kerala", category: "Tea Plantation" },
  { name: "Shimla, Himachal Pradesh", category: "Hill Station" },
];

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const [joinUsOpen, setJoinUsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Search Autocomplete States
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof POPULAR_DESTINATIONS>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Refs for outside click handling
  const joinUsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // Search autocomplete filter logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions(POPULAR_DESTINATIONS.slice(0, 5));
    } else {
      const filtered = POPULAR_DESTINATIONS.filter((dest) =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    }
  }, [searchQuery]);

  // Unread Notifications Count Logic + Global socket init
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    let isSubscribed = true;

    // Init socket globally so real-time works everywhere, not just on /messages
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) chatService.init(token);
    }

    const fetchCounts = async () => {
      try {
        const notifRes = await notificationService.getUnreadCount();
        const baseCount = notifRes.count || 0;

        const conversations = await chatService.fetchConversations();
        let unreadChatMsgs = 0;
        conversations.forEach((c: any) => {
          if (c.lastMessage && !c.lastMessage.isRead && c.lastMessage.sender.id !== user.id) {
            unreadChatMsgs += 1;
          }
        });

        if (isSubscribed) {
          setUnreadCount(baseCount + unreadChatMsgs);
        }
      } catch (error) {
        console.error("Failed to fetch unread counts");
      }
    };

    fetchCounts();

    // Listen for incoming chat messages to increment the counter immediately
    const unsubscribeChat = chatService.onNewMessage((data) => {
      if (data.message.sender.id !== user.id) {
        setUnreadCount(prev => prev + 1);
        
        // Show real-time global toast if not on messages page
        if (!window.location.pathname.includes('/messages')) {
          toast(
            <div className="flex flex-col gap-1">
              <span className="font-bold text-sm text-gray-900">New message from {data.message.sender?.name || 'User'}</span>
              <span className="text-xs text-gray-500 line-clamp-1">{data.message.content}</span>
            </div>,
            {
              duration: 4000,
              action: {
                label: 'Reply',
                onClick: () => router.push(user.role === 'vendor' ? '/vendor/messages' : '/messages')
              }
            }
          );
        }
      }
    });

    // Poll every 30 seconds for standard notifications
    const interval = setInterval(fetchCounts, 30000);

    return () => {
      isSubscribed = false;
      unsubscribeChat();
      clearInterval(interval);
    };
  }, [isAuthenticated, user]);

  // Handle hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (joinUsOpen && joinUsRef.current && !joinUsRef.current.contains(target)) {
        setJoinUsOpen(false);
      }
      if (notificationsOpen && notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (suggestionsRef.current && !suggestionsRef.current.contains(target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [joinUsOpen, notificationsOpen]);

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

  return (
    <>
      <header className="w-full bg-amber-50/95 border-b border-amber-100/80 sticky top-0 z-50 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px] transition-all duration-300">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants.fadeInLeft}
            className="flex-shrink-0"
          >
            <Link 
              href="/" 
              className="flex items-center gap-2 group/logo transition-all hover:scale-[1.02] active:scale-95 duration-300"
              title="Go to Homepage"
            >
              <div className="relative h-10 md:h-12 w-28 md:w-32 filter drop-shadow-sm group-hover/logo:drop-shadow-[0_4px_12px_rgba(255,209,51,0.25)] transition-all duration-300">
                <Image
                  src="/bg-logo.png"
                  alt="TripDekho"
                  fill
                  sizes="(max-width: 768px) 150px, 200px"
                  className="object-contain"
                  priority
                  loading="eager"
                />
              </div>
              {/* Sliding Airplane Icon */}
              <Plane 
                size={16} 
                className="text-amber-500 opacity-0 -translate-x-4 group-hover/logo:opacity-100 group-hover/logo:translate-x-0 transition-all duration-500 ease-out" 
              />
            </Link>
          </motion.div>

          {/* Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                setShowSuggestions(false);
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
            className="hidden md:flex items-center ml-4 lg:ml-8 flex-1 max-w-sm lg:max-w-md"
          >
            <div className="relative w-full" ref={suggestionsRef}>
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                                placeholder="Search your next Destination"
                className="w-full h-10 pl-4 pr-10 text-sm text-gray-600 bg-white/80 border border-amber-200/60 rounded-full outline-none transition-all duration-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 placeholder:text-gray-400 font-medium"
                autoComplete="off"
              />
              <button
                type="submit" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-white hover:bg-amber-400 rounded-full transition-colors duration-200 group border border-amber-200/40 shadow-sm"
              >
                <Search className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
              </button>

              {/* Autocomplete Suggestions Panel */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 py-3 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-1.5 mb-1">
                    <p className="text-[10px] font-black tracking-widest text-amber-500 uppercase">
                      {searchQuery ? "Matching Destinations" : "🔥 Popular Destinations"}
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {!searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSuggestions(false);
                          router.push('/search');
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-amber-50 hover:text-amber-600 transition-colors group border-b border-gray-50 bg-amber-50/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                            Trips Near Me
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            Explore adventures around your current location
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                      </button>
                    )}
                    {suggestions.map((dest, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchQuery(dest.name);
                          setShowSuggestions(false);
                          router.push(`/search?q=${encodeURIComponent(dest.name)}`);
                        }}
                        className="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-amber-50 hover:text-amber-600 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-amber-500 group-hover:bg-white transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-700 group-hover:text-amber-600 transition-colors">
                            {dest.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            {dest.category}
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Right Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-4 ml-auto">
            {/* Get the App */}
            <Link
              href="/app"
              className="hidden xl:flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 hover:text-amber-500 transition-colors duration-200 rounded-lg hover:bg-amber-50 group"
            >
              <Smartphone className="h-4 w-4 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span className="whitespace-nowrap">Get the App</span>
            </Link>

            {/* Vlog */}
            <Link
              href="/vlog"
              className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 hover:text-amber-500 transition-colors duration-200 rounded-lg hover:bg-amber-50 relative group"
            >
              <Play className="h-4 w-4 text-amber-500 fill-current" />
              Vlog
              <span className="absolute -top-1 -right-1 flex h-4 w-10 items-center justify-center rounded-full bg-amber-500 text-[8px] font-black uppercase text-black ring-2 ring-white animate-pulse shadow-sm shadow-amber-500/20">NEW</span>
            </Link>

            {/* Join Us Dropdown */}
            <div className="relative" ref={joinUsRef}>
              <button
                onClick={() => {
                  setJoinUsOpen(!joinUsOpen);
                  setNotificationsOpen(false);
                }}
                className="nav-dropdown-trigger flex items-center gap-1 px-3 py-2 text-sm font-bold text-gray-700 hover:text-amber-500 transition-colors duration-200 rounded-lg hover:bg-amber-50"
              >
                Join us
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${joinUsOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {joinUsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-amber-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50 overflow-hidden">
                  <Link 
                    href="/agents" 
                    onClick={() => setJoinUsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                      <Users className="w-4 h-4 text-amber-500" />
                    </div>
                    Vendor Network
                  </Link>
                  <Link 
                    href="/hotels" 
                    onClick={() => setJoinUsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                      <Building2 className="w-4 h-4 text-amber-500" />
                    </div>
                    Hotel Vendor
                  </Link>
                  <Link 
                    href="/about" 
                    onClick={() => setJoinUsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                    </div>
                    About Us
                  </Link>
                  <Link 
                    href="/work-with-us" 
                    onClick={() => setJoinUsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-all group/item border-t border-gray-50 mt-1 pt-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover/item:bg-white transition-colors">
                      <Briefcase className="w-4 h-4 text-amber-500" />
                    </div>
                    Work With Us
                  </Link>
                </div>
              )}
            </div>

            {/* User Auth / Profile */}
            {(!mounted || isLoading) ? (
              <div className="ml-2 w-24 h-10 bg-gray-50 animate-pulse rounded-full" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="relative" ref={notificationsRef}>
                  <motion.button 
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setJoinUsOpen(false);
                      // Clear red dot optimistically when opening
                      if (!notificationsOpen) {
                        setUnreadCount(0);
                      }
                    }}
                    className="nav-dropdown-trigger p-2.5 rounded-full border border-gray-100 bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-amber-500 hover:border-amber-400 transition-colors relative shadow-sm"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
                    )}
                  </motion.button>
                  {notificationsOpen && <NotificationDropdown userRole={user?.role || "customer"} onClose={() => setNotificationsOpen(false)} />}
                </div>

                <ProfileHoverMenu
                  user={user}
                  onLogout={handleLogout}
                />
              </div>
            ) : (
              <button onClick={() => dispatch(openAuthModal('login'))} className="ml-2">
                <AnimatedButton 
                  className="px-8 py-2.5 bg-gold-primary hover:bg-black hover:text-white text-black font-black text-xs uppercase tracking-widest rounded-full transition-colors duration-300 shadow-button group flex items-center gap-2"
                >
                  Login
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </AnimatedButton>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center h-10 w-10 bg-gray-50 rounded-xl text-gray-600 hover:bg-amber-100 hover:text-amber-600 transition-colors ml-auto relative z-[60]"
          >
            {mounted && mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      </header>

      {/* Mobile Menu — Pure CSS transitions, always in DOM, no Framer Motion */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[99] bg-black transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-60 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`lg:hidden fixed right-0 top-0 bottom-0 z-[100] w-[85%] max-w-sm bg-white shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="relative h-10 w-28">
              <Image src="/bg-logo.png" alt="TripDekho" fill sizes="150px" className="object-contain" priority />
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <nav className="flex flex-col gap-2">
            <Link href="/app" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 text-gray-900">
              <div className="p-3 rounded-xl bg-white shadow-sm shrink-0">
                <Smartphone size={20} className="text-amber-500" />
              </div>
              <span className="font-black uppercase tracking-widest text-xs">Get the App</span>
            </Link>
            <Link href="/vlog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 text-gray-900">
              <div className="p-3 rounded-xl bg-white shadow-sm shrink-0">
                <Play size={20} className="text-amber-500 fill-current" />
              </div>
              <span className="font-black uppercase tracking-widest text-xs">Watch Vlogs</span>
            </Link>
          </nav>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Join Our Network</p>
            <div className="grid grid-cols-3 gap-2">
              <Link href="/agents" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-gray-100 bg-white hover:bg-amber-50 transition-colors gap-2 text-center">
                <Users size={20} className="text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-tight">Network<br />Vendor</span>
              </Link>
              <Link href="/hotels" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-gray-100 bg-white hover:bg-amber-50 transition-colors gap-2 text-center">
                <Building2 size={20} className="text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-tight">Hotel<br />Vendor</span>
              </Link>
              <Link href="/work-with-us" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-gray-100 bg-white hover:bg-amber-50 transition-colors gap-2 text-center">
                <Briefcase size={20} className="text-amber-500" />
                <span className="text-[9px] font-black uppercase tracking-widest leading-tight">Work<br />With Us</span>
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            {!mounted || isLoading ? (
              <div className="h-16 w-full bg-gray-100 animate-pulse rounded-2xl" />
            ) : isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-11 h-11 rounded-full bg-amber-400 flex items-center justify-center text-black font-black text-base overflow-hidden shrink-0">
                    {user?.avatar ? (
                      <img
                        src={fixImageUrl(typeof user.avatar === "string" ? user.avatar : user.avatar.url)}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0) || <User />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-gray-900">{user?.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Elite Member</p>
                  </div>
                </div>
                {(user?.role === "admin" || user?.role === "super_admin" || user?.role?.includes("admin")) && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center h-14 w-full bg-amber-500 text-black rounded-2xl font-bold text-sm">
                    Admin Dashboard
                  </Link>
                )}
                {user?.role === "vendor" && (
                  <Link href="/vendor/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center h-14 w-full bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">
                    Vendor Portal
                  </Link>
                )}
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center h-14 w-full bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">
                  My Profile
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-center text-xs font-black uppercase tracking-widest text-red-500 py-3"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); dispatch(openAuthModal("login")); }}
                className="flex items-center justify-center h-16 w-full bg-amber-500 hover:bg-black hover:text-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg transition-all duration-300"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
