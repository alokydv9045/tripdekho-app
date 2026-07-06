export type UserRole = 
  | 'customer' 
  | 'vendor' 
  | 'super_admin' 
  | 'tech_admin' 
  | 'platform_admin' 
  | 'finance_admin' 
  | 'growth_admin' 
  | 'support_admin' 
  | 'operations_admin' 
  | 'onboarding_admin' 
  | 'content_admin';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  nickname?: string;
  dateOfBirth?: string;
  gender?: string;
  isVerified?: boolean;
  isActive?: boolean;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    address?: string;
  };
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerProfile extends User {
  preferences?: {
    categories?: string[];
    regions?: string[];
    vibe?: string[];
  };
  stats?: {
    bookingsCount?: number;
    totalSpent?: number;
    reviewsCount?: number;
  };
}
