"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { bookingService } from "@/services/bookingService";
import ReviewModal from "./ReviewModal";

export const ReviewPopupManager = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [pendingBooking, setPendingBooking] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Slight delay so it doesn't interrupt immediate initial load of the homepage
    const timer = setTimeout(() => {
      const checkBookings = async () => {
        try {
          const response = await bookingService.getMyBookings();
          let bookings = response?.data?.data || response?.data || response || [];
          if (!Array.isArray(bookings)) {
            bookings = bookings.bookings || bookings.data || [];
          }
          if (!Array.isArray(bookings)) bookings = [];
          
          // Find first booking that is completed and NOT reviewed
          const unreviewed = bookings.find((b: any) => 
            b.status?.toLowerCase() === 'completed' && !b.reviewed
          );
          
          if (unreviewed) {
            setPendingBooking(unreviewed);
          }
        } catch (err) {
          console.error("Failed to check pending reviews:", err);
        }
      };
      
      checkBookings();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  if (!pendingBooking) return null;

  return (
    <ReviewModal
      tripId={pendingBooking.trip?.id || pendingBooking.trip?._id || pendingBooking.trip}
      tripTitle={pendingBooking.tripSnapshot?.title || pendingBooking.trip?.title || "your trip"}
      bookingId={pendingBooking.id}
      onClose={() => setPendingBooking(null)}
      onSuccess={() => {
        setPendingBooking(null);
      }}
    />
  );
};
