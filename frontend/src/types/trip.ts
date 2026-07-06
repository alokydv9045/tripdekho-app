import { Vendor } from './vendor';

export interface Trip extends TripPreview {
  description?: string;
  shortDescription?: string;
  images: {
    url: string;
    publicId?: string;
    caption?: string;
    isPrimary?: boolean;
  }[];
  itinerary: {
    day: number;
    title: string;
    description: string;
    meals?: string[];
    activities?: string[];
  }[];
  inclusions: string[];
  exclusions: string[];
  requirements?: string[];
  thingsToCarry?: string[];
  reviews?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TripPreview {
  id?: string;
  _id: string;
  title: string;
  slug: string;
  thumbnail: {
    url: string;
    publicId?: string;
  };
  duration: {
    nights: number;
    days: number;
  };
  price: {
    amount: number;
    currency: string;
    discountedAmount?: number;
    discountPercentage?: number;
  };
  originalPrice?: number;
  dates: (string | {
    startDate: string;
    endDate: string;
    price: number;
    seats: number;
    availableSeats: number;
    status: 'available' | 'full' | 'completed' | 'cancelled';
  })[];
  
  isFeatured: boolean;
  isPublished: boolean;
  status: 'draft' | 'pending' | 'published' | 'rejected' | 'inactive';
  hasFreeGoodies?: boolean;
  category: string;
  location: {
    city: string;
    state?: string;
    country: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  groupSize: {
    min: number;
    max: number;
  };
  vendor: string | Vendor;
  stats: {
    rating: number;
    reviewsCount: number;
    bookingsCount: number;
  };
  updatedAt?: string;
}
