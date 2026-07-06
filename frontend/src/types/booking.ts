import { User } from './user';
import { Vendor } from './vendor';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'completed';
export type PaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded' | 'paid';

export interface PriceCalculation {
  subtotal: number;
  addOnsTotal: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  totalAmount: number;
}

export interface Booking {
  _id: string;
  bookingNumber: string;
  customer: string | User;
  vendor: string | Vendor;
  trip: string;
  
  tripSnapshot: {
    title: string;
    slug: string;
    duration: {
      days: number;
      nights: number;
    };
    location: {
      city: string;
      country: string;
    };
    image?: string;
  };
  
  departure: {
    startDate: string;
    endDate: string;
    departureId?: string;
  };
  
  // Pricing fields from DB
  basePrice: number;
  serviceFee: number;
  taxes: number;
  platformFee: number;
  discount: number;
  totalPrice: number;
  vendorAmount: number;
  
  totalGuests: number;
  guestDetails: {
    leadGuest: {
      name: string;
      email: string;
      phone: string;
      dateOfBirth: string;
      nationality: string;
    };
    additionalGuests: Array<{
      name: string;
      dateOfBirth: string;
      relationship: string;
    }>;
    specialRequests?: string;
  };
  
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  
  refundStatus: 'none' | 'requested' | 'pending' | 'processed' | 'failed' | 'not_applicable';
  refundAmount?: number;
  cancellationDate?: string;
  
  appliedPromoCode?: string;
  
  createdAt: string;
  updatedAt: string;
}
