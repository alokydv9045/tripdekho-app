"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { tripService } from "@/services/tripService";
import { bookingService } from "@/services/bookingService";
import Header from "@/components/Header";
import GuestDetailsForm from "@/components/Booking/GuestDetailsForm";
import BookingSummary from "@/components/Booking/BookingSummary";
import { ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import PremiumLoader from "@/components/shared/PremiumLoader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { wanderPointsService } from "@/services/authService";

const BookingContent = () => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = searchParams.get("tripId");
  const fallbackDate = React.useMemo(() => new Date().toISOString(), []);
  const selectedDate = searchParams.get("date") || fallbackDate;
  const guestCount = parseInt(searchParams.get("guests") || "1", 10);

  const [trip, setTrip] = useState<any>(null);
  const [guests, setGuests] = useState<any[]>(
    Array(guestCount).fill(null).map(() => ({ name: "", age: "", gender: "" }))
  );
  
  const initialOccupancy = searchParams.get("occupancy") 
    ? searchParams.get("occupancy")! 
    : "";
  const [selectedOccupancy, setSelectedOccupancy] = useState<string>(initialOccupancy);

  const [pricing, setPricing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("Please login to continue with booking.");
      router.push(`/login?redirect=${encodeURIComponent(`/bookings/new?tripId=${tripId}&date=${selectedDate}&guests=${guestCount}`)}`);
    }
  }, [user, isLoading, router, tripId, selectedDate, guestCount]);

  useEffect(() => {
    const fetchTripAndPrice = async () => {
      if (!tripId) {
        setError("No trip selected. Please go back and select a trip.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const tripDataRaw = await tripService.getTripById(tripId);
        const tripData = tripDataRaw.data || tripDataRaw;
        setTrip(tripData);

        const tripDates = tripData.dates || [];
        if (tripDates.length === 0) {
          throw new Error("This trip has no available departure dates.");
        }
        
        // Auto select first option if none selected
        if (!initialOccupancy && tripData.price?.occupancyOptions?.length > 0) {
          setSelectedOccupancy(tripData.price.occupancyOptions[0].type);
        } else if (!initialOccupancy) {
          setSelectedOccupancy("Standard Room");
        }

        const matchedDate = tripDates.find((d: any) => d.startDate === selectedDate || d.id === selectedDate);
        const departureId = matchedDate ? matchedDate.id : tripDates[0].id;

        // Initial price calculation
        const priceData = await bookingService.calculatePrice({
          tripId,
          departureId,
          numberOfGuests: guestCount
        });
        setPricing(priceData.data);

        // Fetch Wander Points Balance
        if (user) {
          try {
            const pointsData = await wanderPointsService.getBalance();
            setAvailablePoints(pointsData.balance || 0);
          } catch (e) {
            console.error("Failed to fetch wander points", e);
          }
        }
      } catch (err: any) {
        console.error("Error fetching booking data:", err);
        const errorMsg = err?.response?.data?.message || err?.message || "Failed to load booking details. Please try again.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchTripAndPrice();
  }, [tripId, guestCount, selectedDate, user]);

  // Recalculate price when points to redeem change
  useEffect(() => {
    if (!tripId || !trip || !selectedOccupancy) return;
    
    const recalculatePrice = async () => {
      try {
        const tripDates = trip?.dates || [];
        const matchedDate = tripDates.find((d: any) => d.startDate === selectedDate || d.id === selectedDate);
        const departureId = matchedDate ? matchedDate.id : tripDates[0]?.id;

        if (!departureId) return;

        let calculatedBasePrice = 0;
        let finalGuestCount = guestCount;
        
        if (trip?.price?.occupancyOptions?.length > 0) {
           const opt = trip.price.occupancyOptions.find((o: any) => o.type === selectedOccupancy);
           if (opt) {
             calculatedBasePrice = Number(opt.price) * finalGuestCount;
           } else {
             calculatedBasePrice = (matchedDate?.price || trip.price?.amount || 0) * finalGuestCount;
           }
        }

        const priceData = await bookingService.calculatePrice({
          tripId,
          departureId,
          numberOfGuests: finalGuestCount,
          pointsToRedeem
        });
        
        // Override with occupancy based price if available
        if (calculatedBasePrice > 0) {
           const data = priceData.data;
           data.basePrice = calculatedBasePrice;
           // simple recalculation for platform fees if needed, otherwise use backend
           // for now just update base and total
           data.totalPrice = calculatedBasePrice + (data.platformFee || 0) - (data.discount || 0);
           setPricing(data);
        } else {
           setPricing(priceData.data);
        }

      } catch (err) {
        console.error("Failed to recalculate price", err);
      }
    };

    // Use a small timeout to avoid spamming the API on every keystroke
    const timeout = setTimeout(() => {
      recalculatePrice();
    }, 500);

    return () => clearTimeout(timeout);
  }, [pointsToRedeem, tripId, guestCount, selectedDate, selectedOccupancy, trip]);

  const handleGuestChange = (index: number, field: string, value: string) => {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  };

  const handleBooking = async () => {
    // Validate all fields with proper rules
    for (let i = 0; i < guests.length; i++) {
      const g = guests[i];
      const label = i === 0 ? "Primary Traveler" : `Traveler ${i + 1}`;

      if (!g.name.trim()) {
        toast.warning(`${label}: Full name is required`);
        return;
      }
      if (!/^[a-zA-Z\s]+$/.test(g.name)) {
        toast.warning(`${label}: Only alphabets are allowed in the name`);
        return;
      }
      if (!g.age) {
        toast.warning(`${label}: Age is required`);
        return;
      }
      const age = parseInt(g.age, 10);
      if (isNaN(age) || age <= 0 || age > 115) {
        toast.warning(`${label}: Age must be between 1 and 115`);
        return;
      }
      if (!g.gender) {
        toast.warning(`${label}: Please select a gender`);
        return;
      }
    }

    try {
      setBookingLoading(true);
      
      const guestDetails = {
        leadGuest: {
          name: guests[0].name.trim() || "",
          email: user?.email || "guest@tripdekho.com",
          phone: user?.phone || "0000000000",
          dateOfBirth: new Date(new Date().getFullYear() - parseInt(guests[0].age), 0, 1),
          nationality: "Indian"
        },
        additionalGuests: guests.slice(1).map(g => ({
          name: g.name.trim() || "",
          dateOfBirth: new Date(new Date().getFullYear() - parseInt(g.age), 0, 1),
          relationship: "Traveler"
        })),
        specialRequests: "" // Could be linked to textarea
      };

      const tripDates = trip?.dates || [];
      if (tripDates.length === 0) {
        toast.error("This trip has no available departure dates.");
        setBookingLoading(false);
        return;
      }
      const matchedDate = tripDates.find((d: any) => d.startDate === selectedDate || d.id === selectedDate);
      const departureId = matchedDate ? matchedDate.id : tripDates[0].id;

      const bookingData = {
        tripId: tripId,
        departureId: departureId,
        numberOfGuests: guestCount,
        guestDetails,
        paymentMethod: "card",
        pointsToRedeem: pointsToRedeem || 0
      };

      const result = await bookingService.createBooking(bookingData);
      
      // If payment is required, we'd handle Stripe here. 
      // For now, redirect to success or wait for payment confirmation.
      if (result.success) {
        const bookingId = result.data.booking?.id || result.data.id;
        router.push(`/bookings/${bookingId}/payment`);
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      // Global axios interceptor already shows the error toast
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || isLoading) {
    return <PremiumLoader text="Secure Checkout" subText="Initializing Checkout..." />;
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Booking Error</h2>
          <p className="text-gray-500 font-bold mb-8 leading-relaxed">{error || "Trip not found."}</p>
          <Link href="/trips">
            <button className="bg-amber-400 hover:bg-amber-500 text-black font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-amber-100">
              Back to Explore
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      
      {/* Checkout Steps Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-amber-500 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Trip
          </button>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group">
              <span className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-black text-black">1</span>
              <span className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">Review & Guests</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-200" />
            <div className="flex items-center gap-2 opacity-30 grayscale pointer-events-none">
              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">2</span>
              <span className="text-sm font-extrabold text-gray-500 uppercase tracking-wide">Payment</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-200" />
            <div className="flex items-center gap-2 opacity-30 grayscale pointer-events-none">
              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500">3</span>
              <span className="text-sm font-extrabold text-gray-500 uppercase tracking-wide">Confirmation</span>
            </div>
          </div>
          
          <div className="w-24 md:block hidden" /> {/* Spacer */}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Guest Details */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Who's Traveling?</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Enter traveler details precisely as they appear on ID proof</p>
            </div>
            
            <GuestDetailsForm 
              guests={guests} 
              onChange={handleGuestChange} 
            />

            {/* Occupancy & Transportation Selection */}
            {trip && (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-3">
                  Occupancy & Transportation
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Select room sharing type and transportation</p>
                <div className="space-y-4">
                  {(trip?.price?.occupancyOptions?.length > 0 
                     ? trip.price.occupancyOptions 
                     : [{ type: "Standard Room", price: trip?.price?.amount || 0, originalPrice: trip?.price?.originalPrice }]
                  ).map((opt: any, i: number) => {
                    const isSelected = selectedOccupancy === opt.type;
                    
                    return (
                      <div 
                        key={i} 
                        onClick={() => setSelectedOccupancy(opt.type)}
                        className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                          isSelected ? 'border-amber-400 bg-amber-50/30 shadow-sm' : 'border-gray-100 bg-gray-50/50 hover:border-amber-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-amber-500' : 'border-gray-300'}`}>
                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">{opt.type}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-bold text-gray-800">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(opt.price)} / Person
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white border border-gray-100 px-4 py-2 rounded-lg">
                           <span className="text-sm font-black text-gray-900">
                             {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(opt.price * guestCount)}
                           </span>
                           <span className="text-[10px] font-bold text-gray-400 block text-right mt-0.5 uppercase tracking-widest">Total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Special Requests Placeholder */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mt-8">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3">
                Any Special Requests? <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">Optional</span>
              </h3>
              <textarea 
                placeholder="Dietary requirements, medical assistance, or any other requests..."
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 font-medium resize-none"
              />
            </div>
          </div>

          {/* Right Column: Checkout Summary */}
          <div className="lg:col-span-1">
            <BookingSummary 
              trip={trip}
              numberOfGuests={guestCount}
              selectedDate={selectedDate}
              totalAmount={pricing?.totalPrice || 0}
              basePrice={pricing?.basePrice || 0}
              platformFee={pricing?.platformFee || 0}
              discount={pricing?.discount || 0}
              availablePoints={availablePoints}
              pointsToRedeem={pointsToRedeem}
              onPointsChange={setPointsToRedeem}
              isLoading={bookingLoading}
              onConfirm={handleBooking}
            />
          </div>
        </div>
      </main>

      
    </div>
  );
};

const NewBookingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
};

export default NewBookingPage;

