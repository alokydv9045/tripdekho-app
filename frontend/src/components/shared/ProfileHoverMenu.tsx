"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  User,
  LogOut,
  ChevronDown,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fixImageUrl } from "@/lib/utils/formatters";

export interface ProfileMenuUser {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string | { url?: string };
}

interface ProfileHoverMenuProps {
  user: ProfileMenuUser | null;
  onLogout: () => void | Promise<void>;
  variant?: "default" | "admin";
  className?: string;
}

export function ProfileHoverMenu({
  user,
  onLogout,
  variant = "default",
  className,
}: ProfileHoverMenuProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const isAdmin =
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role?.includes("admin");
  const isVendor = user?.role === "vendor";

  const avatarUrlRaw =
    user?.avatar &&
    (typeof user.avatar === "string" ? user.avatar : user.avatar.url);

  const avatarUrl = fixImageUrl(avatarUrlRaw || "");

  const triggerClass =
    variant === "admin"
      ? "flex items-center gap-3 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
      : "flex items-center gap-2 pl-2 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:border-amber-400 transition-all group shadow-sm";

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {variant === "admin" ? (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-gray-900">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-emerald-600 font-medium capitalize">
                {user?.role?.replace(/_/g, " ") || "Active Now"}
              </p>
            </div>
            <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border border-gray-200 overflow-hidden uppercase font-bold text-sm">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={16} />
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-black font-bold text-sm shadow-inner overflow-hidden uppercase tracking-tighter">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0) || <User className="w-4 h-4" />
              )}
            </div>
            <span className="text-sm font-bold text-gray-700 group-hover:text-amber-600">
              {user?.name?.split(" ")[0] || "Profile"}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full pt-2 w-56 z-50"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-xs font-semibold text-gray-400">
                {variant === "admin" ? "Admin Account" : "Account"}
              </p>
              <p className="text-sm font-extrabold text-gray-900 truncate">
                {user?.name || "User"}
              </p>
              {user?.email && !user.email.includes('guest_') && (
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {user.email}
                </p>
              )}
            </div>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-amber-600 bg-amber-50/50 hover:bg-amber-50 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}

            {isVendor && (
              <Link
                href="/vendor/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
              >
                <Building2 className="w-4 h-4" /> Vendor Portal
              </Link>
            )}

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
            >
              <User className="w-4 h-4" /> My Profile
            </Link>

            {variant === "default" && (
              <>
                <Link
                  href="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  <Heart className="w-4 h-4 text-red-500" /> My Wishlist
                </Link>
                <Link
                  href="/bookings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> My Bookings
                </Link>
              </>
            )}

            <div className="border-t border-gray-50 mt-1 pt-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
