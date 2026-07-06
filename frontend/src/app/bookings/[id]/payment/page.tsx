"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { bookingService } from "@/services/bookingService";
import Header from "@/components/Header";
import { CreditCard, ShieldCheck, Lock, ChevronRight, CheckCircle2 } from "lucide-react";
import PrimaryButton from "@/components/shared/PrimaryButton";


// Helper to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingService.getBookingById(id as string);
        setBooking(data.data || data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // 1. Load Script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Check your internet connection.");
        return;
      }

      // 2. Initialize Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_your_key_id",
        amount: booking.totalPrice * 100, // Amount is in paise
        currency: "INR",
        name: "TripDekho",
        description: `Booking for ${booking.tripSnapshot?.title || "selected trip"}`,
        image: "/logo.png",
        order_id: booking.razorpayOrderId,
        handler: async function (response: any) {
          // 3. Confirm Payment on Server
          try {
            const confirmRes = await bookingService.confirmPayment(id as string, {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (confirmRes.success) {
              setSuccess(true);
              setTimeout(() => {
                router.push(`/bookings/${id}/success`);
              }, 2000);
            }
          } catch (err) {
            console.error("Confirmation error:", err);
            alert("Payment confirmation failed. Please contact support.");
          }
        },
        prefill: {
          name: booking.guestDetails?.leadGuest?.name,
          email: booking.guestDetails?.leadGuest?.email,
          contact: booking.guestDetails?.leadGuest?.phone,
        },
        notes: {
          bookingId: id,
        },
        theme: {
          color: "#fbbf24", // amber-400
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error("Payment initialization error:", err);
      alert("Failed to initialize payment modal.");
    } finally {
      setProcessing(false);
    }
  };

  const handleTestBypass = async () => {
    try {
      setProcessing(true);
      const confirmRes = await bookingService.confirmPayment(id as string, {
        razorpayPaymentId: "pay_test_" + Math.random().toString(36).substring(7),
        razorpaySignature: "test_bypass"
      });
      if (confirmRes.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/bookings/${id}/success`);
        }, 2000);
      }
    } catch (err) {
      alert("Test bypass failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <PremiumLoader />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      {/* Steps Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 opacity-30 grayscale underline decoration-green-500 decoration-2">
            <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] font-black text-white"><CheckCircle2 className="w-4 h-4" /></span>
            <span className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">Review & Guests</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-200" />
          <div className="flex items-center gap-2 group">
            <span className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-black text-black">2</span>
            <span className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">Payment</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-200" />
          <div className="flex items-center gap-2 opacity-30 grayscale pointer-events-none">
            <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">3</span>
            <span className="text-sm font-extrabold text-gray-500 uppercase tracking-wide">Confirmation</span>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white border border-gray-100 rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden">
          <div className="p-10 border-b border-gray-50 bg-gray-50/50">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                <Lock className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">SSL Encrypted</span>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Booking Total</p>
                <h2 className="text-4xl font-black text-gray-900">₹{booking?.totalPrice}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                <p className="text-sm font-extrabold text-gray-900 font-mono tracking-tighter">#{id?.toString().slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {success ? (
              <div className="py-10 text-center space-y-6 animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Payment Successful!</h3>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Redirecting to your itinerary...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Method Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-black text-gray-900 uppercase tracking-widest border-b-2 border-amber-400 pb-1">Payment Method</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center justify-between p-6 bg-amber-50 border-2 border-amber-400 rounded-2xl transition-all shadow-lg shadow-amber-50">
                      <div className="flex items-center gap-4">
                        <CreditCard className="w-6 h-6 text-amber-500" />
                        <span className="text-base font-black text-gray-900">Razorpay (Cards/UPI)</span>
                      </div>
                      <div className="w-5 h-5 rounded-full border-4 border-amber-400 bg-white" />
                    </button>
                    <button className="flex items-center justify-between p-6 bg-gray-50 border-2 border-transparent rounded-2xl hover:bg-gray-100 transition-all opacity-50 cursor-not-allowed">
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 font-black text-gray-400 flex items-center justify-center italic">EMIs</div>
                        <span className="text-base font-black text-gray-400">Available Soon</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Submission Section */}
                <div className="p-8 bg-gray-900 rounded-[28px] text-white shadow-xl shadow-gray-900/20 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-amber-400/20 transition-all duration-700" />
                   
                   <div className="space-y-6 relative z-10">
                     <div className="flex justify-between items-center mb-4">
                       <ShieldCheck className="w-10 h-10 text-amber-400" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60">Verified Secure Gateway</p>
                     </div>
                     
                     <div className="space-y-8">
                       <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Complete your payment securely with Razorpay.</p>
                       
                       <PrimaryButton 
                         fullWidth
                         className="h-14 font-black text-lg bg-amber-400 hover:bg-amber-500 text-black border-none shadow-xl shadow-amber-900/20"
                         onClick={handlePayment}
                         disabled={processing}
                       >
                         {processing ? (
                           <span className="flex items-center gap-3">
                             <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                             Contacting Razorpay...
                           </span>
                         ) : (
                           `Pay ₹${booking?.totalPrice} Now`
                         )}
                       </PrimaryButton>
                       
                       {/* Test Mode Bypass */}
                       <button
                         onClick={handleTestBypass}
                         disabled={processing}
                         className="w-full h-12 mt-4 rounded-xl border border-dashed border-gray-600 text-gray-400 font-bold hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2"
                       >
                         Bypass Payment (Test Mode)
                       </button>
                     </div>

                     <div className="flex justify-center items-center gap-6 pt-4 grayscale opacity-40 text-[10px] font-black tracking-widest">
                        <span>UPI</span>
                        <span>NETBANKING</span>
                        <span>CARDS</span>
                        <span>WALLETS</span>
                     </div>
                   </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-12 text-center p-8 border-2 border-dashed border-gray-200 rounded-3xl">
          <p className="text-xs font-bold text-gray-400 leading-relaxed uppercase tracking-wider">
            Safe Payments: Your credit card information is processed by encrypted gateways and is never stored on our servers.
            TripDekho uses industry-standard SSL encryption.
          </p>
        </div>
      </main>

      
    </div>
  );
};

export default PaymentPage;
