"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, CheckCircle, ArrowRight, X } from "lucide-react";
import Link from "next/link";

interface KycPendingBannerProps {
  kycStatus: string;
  razorpayStatus?: string;
  onDismiss?: () => void;
}

export default function KycPendingBanner({ kycStatus, razorpayStatus, onDismiss }: KycPendingBannerProps) {
  if (kycStatus === "approved" || kycStatus === "verified") {
    // If KYC is approved, check if Razorpay account is active
    if (!razorpayStatus || razorpayStatus !== "active") {
      kycStatus = "razorpay_pending";
    } else {
      return null;
    }
  }

  const config = {
    pending: {
      icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      text: "text-amber-800",
      iconBg: "bg-amber-100",
      badge: "⚠️ KYC Pending",
      badgeBg: "bg-amber-100 text-amber-700",
      message: "Your account is unverified. Complete KYC verification to unlock full access — create trips, receive bookings, and get paid.",
      cta: "Complete KYC Now",
      ctaBg: "bg-amber-500 hover:bg-amber-600 text-white",
    },
    submitted: {
      icon: <Clock className="w-5 h-5 shrink-0" />,
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      text: "text-blue-800",
      iconBg: "bg-blue-100",
      badge: "🔍 Under Review",
      badgeBg: "bg-blue-100 text-blue-700",
      message: "Your KYC documents are under review. Our team typically responds within 1-2 business days. You'll be notified via email and WhatsApp.",
      cta: "View KYC Status",
      ctaBg: "bg-blue-500 hover:bg-blue-600 text-white",
    },
    rejected: {
      icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
      bg: "from-red-50 to-rose-50",
      border: "border-red-200",
      text: "text-red-800",
      iconBg: "bg-red-100",
      badge: "❌ KYC Rejected",
      badgeBg: "bg-red-100 text-red-700",
      message: "Your KYC was not approved. Please re-upload clearer document images.",
      cta: "Resubmit Documents",
      ctaBg: "bg-red-500 hover:bg-red-600 text-white",
    },
    razorpay_pending: {
      icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
      bg: "from-purple-50 to-fuchsia-50",
      border: "border-purple-200",
      text: "text-purple-800",
      iconBg: "bg-purple-100",
      badge: "💳 Bank Details Missing",
      badgeBg: "bg-purple-100 text-purple-700",
      message: "Your KYC is approved! Now, link your bank account via Razorpay to receive payouts and accept live bookings.",
      cta: "Link Bank Account",
      ctaBg: "bg-purple-500 hover:bg-purple-600 text-white",
    },
  };

  const c = config[kycStatus as keyof typeof config] || config.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full bg-gradient-to-r ${c.bg} border-b ${c.border}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Icon + Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={`w-8 h-8 ${c.iconBg} rounded-xl flex items-center justify-center ${c.text}`}>
              {c.icon}
            </div>
            <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg ${c.badgeBg}`}>
              {c.badge}
            </span>
          </div>

          {/* Message */}
          <p className={`text-sm font-medium ${c.text} flex-1 min-w-[200px]`}>
            {c.message}
          </p>

          {/* CTA */}
          <Link
            href="/vendor/onboarding"
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 ${c.ctaBg} text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm`}
          >
            {c.cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Dismiss (only for submitted — they can't dismiss pending/rejected) */}
          {kycStatus === "submitted" && onDismiss && (
            <button
              onClick={onDismiss}
              className="shrink-0 p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
