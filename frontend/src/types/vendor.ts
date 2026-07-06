import { User } from './user';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'revoked';

export interface Vendor {
  _id: string;
  user: string | User;
  businessName: string;
  businessType: 'individual' | 'company';
  contactEmail: string;
  contactPhone: string;
  
  description?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  rejectionReason?: string;
  
  // Financial (Razorpay Route)
  razorpayAccountId?: string;
  razorpayOnboardingComplete?: boolean;
  razorpayPaymentsEnabled?: boolean;
  razorpayTransfersEnabled?: boolean;
  
  stats: {
    avgRating: number;
    totalReviews: number;
    totalBookings: number;
    totalEarnings: number;
    activeTrips: number;
  };
  
  createdAt?: string;
  updatedAt?: string;
}
