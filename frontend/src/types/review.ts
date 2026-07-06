import { User } from './user';

export interface Review {
  _id: string;
  booking: string;
  trip: string;
  customer: string | User;
  vendor: string | User;
  
  ratings: {
    overall: number;
    accuracy?: number;
    communication?: number;
    cleanliness?: number;
    location?: number;
    value?: number;
  };
  
  title?: string;
  content: string;
  images?: string[];
  
  vendorResponse?: {
    content: string;
    respondedAt: string;
  };
  
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  createdAt: string;
  updatedAt: string;
}
