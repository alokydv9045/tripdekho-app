"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { bookingService } from "@/services/bookingService";
import Header from "@/components/Header";
import { 
  Calendar, MapPin, Users, ArrowLeft, Download, 
  CreditCard, ShieldCheck, AlertCircle, Clock, 
  Map as MapIcon, MessageSquare, Phone, Share2, CheckCircle2, Star
} from "lucide-react";
import Link from "next/link";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ReviewModal from "@/components/shared/ReviewModal";
import { toast } from "sonner";
import { axiosPublic } from "@/lib/axios";
import { useAppSelector } from "@/store/hooks";


const BookingDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [platformSettings, setPlatformSettings] = useState<any>(null);
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosPublic.get('/cms/settings');
        setPlatformSettings(res.data?.data || res.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

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

  const handleVerify = async () => {
    try {
      setVerifying(true);
      // Re-fetch to check if webhook confirmed it
      const response = await bookingService.getBookingById(id as string);
      const data = response.data || response;
      setBooking(data);
      if (data.status === 'confirmed' || data.paymentStatus === 'paid') {
        toast.success("Payment verified and booking confirmed!");
      } else {
        toast.error("Payment not found yet. If you have paid, please contact support with the reference ID.");
      }
    } catch (err) {
      toast.error("Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking? Refund will be processed as per policy.")) return;
    
    try {
      setCancelling(true);
      await bookingService.cancelBooking(id as string);
      // Refresh data
      const data = await bookingService.getBookingById(id as string);
      setBooking(data.data || data);
      toast.success("Booking cancelled successfully.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const res = await bookingService.downloadInvoice(id as string);
      if (res.data?.url) {
         const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v2', '') || '';
         window.open(`${baseUrl}${res.data.url}`, '_blank');
      } else {
         toast.error("Invoice not available.");
      }
    } catch(err) {
      toast.error("Failed to download invoice.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Booking: ${booking?.trip?.title}`,
          text: `Check out my booking for ${booking?.trip?.title}!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch(err) {
      console.log(err);
    }
  };

  if (loading) return <PremiumLoader />;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-600 border-green-200";
      case "pending": return "bg-amber-100 text-amber-600 border-amber-200";
      case "cancelled": return "bg-red-100 text-red-600 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      
      {reviewBooking && (
        <ReviewModal 
          tripId={reviewBooking.trip?.id}
          tripTitle={reviewBooking.trip?.title}
          bookingId={reviewBooking.id}
          onClose={() => setReviewBooking(null)}
          onSuccess={async () => {
            setReviewBooking(null);
            const data = await bookingService.getBookingById(id as string);
            setBooking(data.data || data);
          }}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-amber-500 uppercase tracking-widest transition-colors mb-2"
            >
              <ArrowLeft className="w-3 h-3" /> Back to My Bookings
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Booking Detail</h1>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(booking?.status)}`}>
                {booking?.status}
              </span>
            </div>
            <p className="text-gray-500 font-bold font-mono text-sm">Reference: #{id?.toString().slice(-12).toUpperCase()}</p>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={handleDownloadInvoice} className="h-12 px-6 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
               <Download className="w-4 h-4" /> Invoice
             </button>
             <button onClick={handleShare} className="h-12 px-6 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
               <Share2 className="w-4 h-4" /> Share
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Snapshot */}
            <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/50">
               <div className="relative h-64 w-full">
                 <img 
                   src={booking?.trip?.images?.[0]?.url || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"} 
                   alt={booking?.trip?.title}
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute bottom-8 left-8 text-white">
                   <h2 className="text-3xl font-black mb-2 uppercase">{booking?.trip?.title}</h2>
                   <div className="flex items-center gap-4 text-sm font-bold opacity-80 uppercase tracking-widest">
                     <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-amber-400" /> {booking?.trip?.location?.city}</span>
                     <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-amber-400" /> {booking?.trip?.durationDays || booking?.trip?.duration?.days} Days</span>
                   </div>
                 </div>
               </div>

               <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Check-In</p>
                    <p className="text-xl font-black text-gray-900">{booking?.departure?.startDate ? new Date(booking.departure.startDate).toLocaleDateString() : "TBD"}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase">{booking?.trip?.startLocation || "Standard Entry"}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Check-Out</p>
                    <p className="text-xl font-black text-gray-900">{booking?.departure?.endDate ? new Date(booking.departure.endDate).toLocaleDateString() : "TBD"}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase">{booking?.trip?.endLocation || "Standard Exit"}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Guests</p>
                    <p className="text-xl font-black text-gray-900">{booking.numberOfGuests} Traveler(s)</p>
                    <p className="text-xs font-bold text-gray-500 uppercase">1 Primary, {booking.numberOfGuests - 1} Additional</p>
                 </div>
               </div>
            </div>

            {/* Traveler Details */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-gray-200/50">
               <h3 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight flex items-center gap-3">
                 <Users className="w-6 h-6 text-amber-500" /> Traveler Details
               </h3>
               
               <div className="space-y-6">
                  {/* Lead Guest */}
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                       <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest">Primary Contact</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
                       <div>
                         <p className="text-[10px] text-gray-400 uppercase mb-1">Name</p>
                         <p className="text-gray-900">{booking?.guestDetails?.leadGuest?.name}</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-gray-400 uppercase mb-1">Contact</p>
                         <p className="text-gray-900">{booking?.user?.email || "Not provided"}</p>
                       </div>
                    </div>
                  </div>

                  {/* Additional Guests */}
                  {booking?.guestDetails?.additionalGuests?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {booking.guestDetails.additionalGuests.map((guest: any, idx: number) => (
                         <div key={idx} className="p-4 border border-gray-100 rounded-xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400 text-xs">
                              {idx + 1}
                            </div>
                            <div>
                               <p className="text-sm font-black text-gray-900 uppercase leading-none">{guest.name}</p>
                               <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{guest.relationship || "Traveler"}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>

            {/* Vendor & Support */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                  <h4 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Vendor Info</h4>
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 overflow-hidden relative">
                       {booking?.vendor?.logo?.url ? (
                         <img src={booking.vendor.logo.url} alt={booking.vendor.businessName} className="w-full h-full object-cover" />
                       ) : (
                         <ShieldCheck className="w-6 h-6" />
                       )}
                     </div>
                     <div>
                        <p className="text-base font-black text-gray-900 uppercase leading-tight">{booking?.vendor?.businessName || "TripDekho Partner"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Vendor</p>
                          <span className="text-xs font-black text-amber-500 flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {booking?.vendor?.avgRating > 0 ? booking.vendor.avgRating : "New"}</span>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     {user?.role === 'vendor' && (booking?.vendor?.user?.id === user?.id || booking?.vendor?.id === (user as any)?.vendorId) ? (
                       <button 
                         onClick={() => {
                           if (booking?.user?.id) {
                             router.push(`/messages?customerId=${booking.user.id}`);
                           } else {
                             alert('Customer chat is not available right now.');
                           }
                         }}
                         className="w-full h-12 border border-gray-200 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                       >
                         <MessageSquare className="w-4 h-4 text-amber-500" /> Chat with Customer
                       </button>
                     ) : (
                       <button 
                         onClick={() => {
                           if (booking?.vendor?.user?.id) {
                             router.push(`/messages?vendorId=${booking.vendor.user.id}`);
                           } else {
                             alert('Vendor chat is not available right now.');
                           }
                         }}
                         className="w-full h-12 border border-gray-200 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                       >
                         <MessageSquare className="w-4 h-4 text-amber-500" /> Chat with Vendor
                       </button>
                     )}
                     <a href={`tel:${booking?.vendor?.phone || platformSettings?.brandPhone || ''}`} className="w-full h-12 border border-gray-200 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                       <Phone className="w-4 h-4 text-amber-500" /> Call Vendor
                     </a>
                     {booking?.status === 'completed' && !booking?.reviewed && (
                       <button onClick={() => setReviewBooking(booking)} className="w-full h-12 bg-amber-400 text-black shadow-xl shadow-amber-400/20 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all">
                         <Star className="w-4 h-4" /> Rate Vendor
                       </button>
                     )}
                     {booking?.status === 'completed' && booking?.reviewed && (
                       <div className="w-full h-12 bg-green-50 text-green-600 border border-green-100 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                         <Star className="w-4 h-4 fill-current" /> Organizer Reviewed
                       </div>
                     )}
                  </div>
               </div>

               <div className="bg-gray-900 rounded-[32px] p-8 text-white shadow-xl shadow-gray-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <div className="relative z-10 space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-amber-400">Need Help?</h4>
                    <p className="text-sm font-bold text-gray-400 leading-relaxed">Our concierge team is available 24/7 to assist with your journey.</p>
                    <div className="space-y-2">
                       <div className="text-2xl font-black text-white">{platformSettings?.brandPhone || "+91 1800-TRIP-DEKHO"}</div>
                       <div className="text-xs font-bold text-amber-400/60 uppercase tracking-widest">{platformSettings?.brandEmail || "support@tripdekho.com"}</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar: Payment & Policy Column */}
          <div className="space-y-8">
            {/* Payment Summary */}
            <div className="bg-amber-400 rounded-[32px] p-8 shadow-xl shadow-amber-200/50">
               <div className="flex items-center gap-2 text-black/40 mb-8">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Payment Summary</span>
               </div>
               
               <div className="space-y-4 text-black">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold opacity-60">Base Amount</span>
                     <span className="text-lg font-black">₹{Number(booking.basePrice).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold opacity-60">Platform Fee</span>
                     <span className="text-lg font-black">₹{Number(booking.platformFee).toLocaleString('en-IN')}</span>
                  </div>
                  {booking.discount > 0 && (
                    <div className="flex justify-between items-center text-green-700">
                       <span className="text-sm font-bold">Discount Applied</span>
                       <span className="text-lg font-black">-₹{Number(booking.discount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="pt-6 border-t border-black/10 flex justify-between items-end">
                     <span className="text-xs font-black uppercase tracking-widest opacity-40">Total Paid</span>
                     <span className="text-3xl font-black leading-none">₹{Number(booking.totalPrice).toLocaleString('en-IN')}</span>
                  </div>
               </div>

               {booking.status === 'pending' && (
                  <div className="mt-8 space-y-4 pt-8 border-t border-black/10">
                     <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Paid but not confirmed?</p>
                     <button 
                       onClick={handleVerify}
                       disabled={verifying}
                       className="w-full h-12 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black/90 transition-all flex items-center justify-center gap-2"
                     >
                       <ShieldCheck className="w-4 h-4 text-amber-400" /> 
                       {verifying ? "Verifying..." : "Verify Payment Status"}
                     </button>
                     <Link 
                       href={`/bookings/${id}/payment`}
                       className="w-full h-12 bg-white text-black border-2 border-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center"
                     >
                       Retry Payment
                     </Link>
                  </div>
               )}
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
               <h4 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 text-red-500" /> Cancellation Policy
               </h4>
               
               <div className="space-y-4">
                  <div className="p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                     <p className="text-xs font-bold text-red-700 leading-relaxed uppercase tracking-wider">
                       {booking?.status === 'confirmed' ? "Flexible: Full refund if cancelled 7 days before trip starts." : "This booking is non-refundable or already processed."}
                     </p>
                  </div>
                  
                  {booking?.status === 'confirmed' && (
                    <button 
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="w-full h-12 bg-white border border-red-100 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      {cancelling ? "Requesting Cancellation..." : "Cancel Booking"}
                    </button>
                  )}
               </div>
            </div>

            {/* Next Steps / Prep */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
               <h4 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                 <MapIcon className="w-4 h-4 text-amber-500" /> Prep For Trip
               </h4>
               <ul className="space-y-4">
                 <li className="flex gap-3">
                   <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><CheckCircle2 className="w-3 h-3 text-green-500" /></div>
                   <p className="text-xs font-bold text-gray-500 leading-tight">Verify identity proofs for all travelers before departure.</p>
                 </li>
                 <li className="flex gap-3">
                   <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /></div>
                   <p className="text-xs font-bold text-gray-500 leading-tight">Check weather forecasts for {booking?.trip?.location?.city} 48 hours prior.</p>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default BookingDetailPage;
