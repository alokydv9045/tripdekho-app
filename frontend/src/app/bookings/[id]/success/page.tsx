"use client";
import PremiumLoader from '@/components/shared/PremiumLoader';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { bookingService } from "@/services/bookingService";
import Header from "@/components/Header";
import { CheckCircle2, Calendar, MapPin, Users, ArrowRight, Download, Share2, MessageSquare } from "lucide-react";
import Link from "next/link";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { toast } from "react-toastify";
import { useAppSelector } from "@/store/hooks";

const BookingSuccessPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAppSelector((state) => state.auth);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My TripDekho Booking",
        text: `I just booked a trip to ${booking?.trip?.location?.city || 'somewhere awesome'}! Booking Ref: ${booking?.bookingNumber}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) return <PremiumLoader />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-20 text-center">
        {/* Success Animation Area */}
        <div className="mb-12 space-y-6">
          <div className="w-32 h-32 bg-green-100 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-green-100/50 animate-bounce">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">Pack Your Bags!</h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-sm">Your booking is confirmed</p>
          </div>
        </div>

        {/* Card Data */}
        <div className="bg-white border border-gray-100 rounded-[48px] shadow-2xl shadow-gray-200/50 overflow-hidden text-left mb-12">
          <div className="p-12 md:flex gap-12 items-center border-b border-gray-50">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                  {booking?.trip?.title || "Your Upcoming Adventure"}
                </h2>
                <div className="flex items-center gap-2 text-amber-600 font-extrabold uppercase tracking-widest text-xs">
                  <MapPin className="w-3 h-3" />
                  {booking?.trip?.location?.city || "Destination Unlocked"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                  <div className="flex items-center gap-2 text-gray-900 font-black">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    {booking?.departure?.startDate ? new Date(booking.departure.startDate).toLocaleDateString() : "TBD"}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Travelers</p>
                  <div className="flex items-center gap-2 text-gray-900 font-black">
                    <Users className="w-4 h-4 text-amber-500" />
                    {booking?.totalGuests} Person(s)
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-px h-24 bg-gray-100 md:block hidden" />

            <div className="md:w-64 space-y-4 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Booking ID</p>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-3xl font-mono text-xl font-black text-amber-600 tracking-tighter">
                {booking?.bookingNumber || `#${id?.toString().slice(-8).toUpperCase()}`}
              </div>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={handleDownloadInvoice}
                  className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-colors shadow-lg shadow-gray-200"
                  title="Download Invoice"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-3 bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl hover:bg-white transition-colors shadow-lg shadow-gray-200"
                  title="Share Booking"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-12 py-8 bg-amber-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-sm font-bold text-gray-600 max-w-sm text-center md:text-left">
               A confirmation email has been sent to your registered address with the complete itinerary and vendor contact details.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
               {user?.role === 'vendor' && (booking?.vendor?.user?.id === user?.id || booking?.vendor?.id === (user as any)?.vendorId) ? (
                 <button
                   onClick={() => {
                     if (booking?.user?.id) {
                       router.push(`/messages?customerId=${booking.user.id}`);
                     } else {
                       toast.error("Customer chat is not available right now.");
                     }
                   }}
                   className="h-14 px-8 bg-white border border-amber-200 text-amber-600 rounded-[20px] font-black text-base shadow-lg shadow-amber-100 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                 >
                   <MessageSquare className="w-5 h-5" /> Chat with Customer
                 </button>
               ) : (
                 <button
                   onClick={() => {
                     if (booking?.vendor?.user?.id) {
                       router.push(`/messages?vendorId=${booking.vendor.user.id}`);
                     } else {
                       toast.error("Vendor chat is not available right now.");
                     }
                   }}
                   className="h-14 px-8 bg-white border border-amber-200 text-amber-600 rounded-[20px] font-black text-base shadow-lg shadow-amber-100 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                 >
                   <MessageSquare className="w-5 h-5" /> Chat with Vendor
                 </button>
               )}
               <Link href={`/bookings/${id}`}>
                 <PrimaryButton className="h-14 px-8 font-black text-base shadow-xl shadow-amber-200 w-full sm:w-auto flex items-center justify-center whitespace-nowrap">
                   View Full Details <ArrowRight className="ml-2 w-5 h-5" />
                 </PrimaryButton>
               </Link>
             </div>
          </div>
        </div>

        <Link href="/trips" className="text-sm font-black text-gray-400 hover:text-amber-500 uppercase tracking-widest transition-colors mb-20 block">
          Book Another Adventure
        </Link>
      </main>

      
    </div>
  );
};

export default BookingSuccessPage;
