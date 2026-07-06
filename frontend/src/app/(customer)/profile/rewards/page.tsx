"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { openAuthModal } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { wanderPointsService, referralsService } from "@/services/authService";
import {
  Gift,
  Copy,
  Share2,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  Star,
  Users,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

type Transaction = {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  source: string;
  description: string;
  createdAt: string;
};

type Referral = {
  id: string;
  referredUser: { name: string; email: string };
  status: string;
  createdAt: string;
};

const sourceLabel: Record<string, string> = {
  REFERRAL_SIGNUP: "Referral Bonus",
  BOOKING_MILESTONE: "Booking Reward",
  MANUAL_CREDIT: "Admin Credit",
  REDEMPTION: "Redeemed",
  SIGNUP_BONUS: "Welcome Bonus",
};

const sourceIcon: Record<string, React.ReactNode> = {
  REFERRAL_SIGNUP: <Users size={14} />,
  BOOKING_MILESTONE: <Star size={14} />,
  MANUAL_CREDIT: <Zap size={14} />,
  REDEMPTION: <ArrowDownLeft size={14} />,
  SIGNUP_BONUS: <Gift size={14} />,
};

export default function RewardsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [balance, setBalance] = useState<number | null>(null);
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [totalRedeemed, setTotalRedeemed] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referralCode, setReferralCode] = useState<string>("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [balanceRes, txRes, codeRes, referralsRes] = await Promise.allSettled([
        wanderPointsService.getBalance(),
        wanderPointsService.getTransactions(),
        referralsService.getMyCode(),
        referralsService.getMyReferrals(),
      ]);

      if (balanceRes.status === "fulfilled") {
        const balanceData = balanceRes.value?.data || balanceRes.value;
        setBalance(balanceData?.balance ?? 0);
        setTotalEarned(balanceData?.totalEarned ?? 0);
        setTotalRedeemed(balanceData?.totalRedeemed ?? 0);
      }
      if (txRes.status === "fulfilled") {
        const txData = txRes.value?.data || txRes.value;
        setTransactions(Array.isArray(txData) ? txData : []);
      }
      if (codeRes.status === "fulfilled") {
        const codeData = codeRes.value?.data || codeRes.value;
        setReferralCode(codeData?.code ?? "");
      }
      if (referralsRes.status === "fulfilled") {
        const referralsData = referralsRes.value?.data || referralsRes.value;
        setReferrals(Array.isArray(referralsData) ? referralsData : []);
      }
    } catch (err) {
      console.error("Failed to load rewards data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      setTimeout(() => dispatch(openAuthModal('login')), 100);
      return;
    }
    loadData();
  }, [isAuthenticated, router, loadData]);

  const copyCode = async () => {
    if (!referralCode) return;
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareCode = async () => {
    const shareText = `Join TripDekho and discover amazing travel experiences! Use my referral code ${referralCode} to get ₹50 Wander Points on signup. https://tripdekho.com/signup`;
    if (navigator.share) {
      await navigator.share({ text: shareText, title: "Join TripDekho" });
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Share link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Wander Points...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">

        {/* Back link */}
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Profile
        </button>

        {/* Hero Balance Card */}
        <div className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-[40px] p-8 md:p-12 overflow-hidden shadow-2xl shadow-amber-300/40">
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/5 rounded-full -ml-20 -mb-20 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Gift size={20} className="text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-100">Wander Points</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight leading-none">
                {balance ?? 0}
                <span className="text-2xl ml-2 font-bold text-amber-100">pts</span>
              </h1>
              <p className="text-sm font-bold text-amber-100">
                = <span className="text-white font-black">₹{balance ?? 0}</span> redeemable value
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-amber-100 mb-1">Total Earned</p>
                <p className="text-3xl font-black text-white">{totalEarned}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-amber-100 mb-1">Redeemed</p>
                <p className="text-3xl font-black text-white">{totalRedeemed}</p>
              </div>
            </div>
          </div>

          {/* Exchange rate badge */}
          <div className="relative z-10 mt-8 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
            <TrendingUp size={14} className="text-white" />
            <span className="text-xs font-black text-white uppercase tracking-wider">1 Wander Point = ₹1 INR</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-2xl">
              <Users size={22} className="text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Friends Referred</p>
              <p className="text-3xl font-black text-gray-900">{referrals.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-5">
            <div className="p-4 bg-green-50 rounded-2xl">
              <ArrowUpRight size={22} className="text-green-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Points Earned</p>
              <p className="text-3xl font-black text-gray-900">{totalEarned}</p>
            </div>
          </div>
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-5">
            <div className="p-4 bg-purple-50 rounded-2xl">
              <Zap size={22} className="text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cash Value</p>
              <p className="text-3xl font-black text-gray-900">₹{balance ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Referral Code Card */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-gray-100/50 space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                Your Referral <span className="text-amber-500">Code</span>
              </h2>
              <p className="text-xs text-gray-400 font-bold mt-1">
                Share and earn 100 Wander Points for every friend who joins!
              </p>
            </div>

            {/* Code display */}
            <div className="relative p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-dashed border-amber-200">
              <p className="text-center text-3xl font-black tracking-[0.4em] text-gray-900">
                {referralCode || "———"}
              </p>
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-amber-500 mt-2">
                Your unique invite code
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={copyCode}
                className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
              <button
                onClick={shareCode}
                className="flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-amber-400 text-amber-900 hover:bg-amber-500 transition-all shadow-lg shadow-amber-200"
              >
                <Share2 size={16} />
                Share Link
              </button>
            </div>

            {/* How it works */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">How it works</p>
              {[
                { step: "1", text: "Share your code with friends" },
                { step: "2", text: "Friend signs up using your code" },
                { step: "3", text: "Both get Wander Points instantly!" },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-xs font-black text-amber-600 shrink-0">
                    {step}
                  </div>
                  <p className="text-xs font-bold text-gray-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Referred Friends */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-gray-100/50 space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                Friends <span className="text-amber-500">Referred</span>
              </h2>
              <p className="text-xs text-gray-400 font-bold mt-1">
                {referrals.length} friend{referrals.length !== 1 ? "s" : ""} joined with your code
              </p>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {referrals.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <Users size={28} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="font-black text-gray-400 text-sm uppercase tracking-wider">No referrals yet</p>
                    <p className="text-xs text-gray-300 font-bold mt-1">Share your code to start earning!</p>
                  </div>
                </div>
              ) : (
                referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-amber-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center font-black text-amber-600">
                      {ref.referredUser?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate">{ref.referredUser?.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold truncate">{ref.referredUser?.email}</p>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 rounded-full">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span className="text-[10px] font-black text-green-600 uppercase">Joined</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl shadow-gray-100/50 space-y-6">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
              Point <span className="text-amber-500">History</span>
            </h2>
            <p className="text-xs text-gray-400 font-bold mt-1">All your Wander Points activity</p>
          </div>

          {transactions.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Clock size={28} className="text-gray-300" />
              </div>
              <div>
                <p className="font-black text-gray-400 text-sm uppercase tracking-wider">No transactions yet</p>
                <p className="text-xs text-gray-300 font-bold mt-1">Earn points by referring friends or completing bookings!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-3 rounded-xl ${tx.type === "CREDIT" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-400"}`}>
                    {tx.type === "CREDIT" ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xs text-gray-400">
                      {sourceIcon[tx.source] ?? <Zap size={14} />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate">
                        {sourceLabel[tx.source] ?? tx.source}
                      </p>
                      {tx.description && (
                        <p className="text-[10px] text-gray-400 font-bold truncate">{tx.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-black ${tx.type === "CREDIT" ? "text-green-600" : "text-red-500"}`}>
                      {tx.type === "CREDIT" ? "+" : "-"}{tx.amount} pts
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      {new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-6 flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-2xl shrink-0">
            <Zap size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-black text-amber-900 uppercase tracking-wide">How to redeem?</p>
            <p className="text-xs font-bold text-amber-700 mt-1 leading-relaxed">
              At checkout, you'll see an option to apply your Wander Points as a discount. 1 Point = ₹1 off your booking. Points cannot be combined with other promo codes.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
