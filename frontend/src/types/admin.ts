export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendor' | 'customer';
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface IVendor {
  _id: string;
  user: IUser | string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  description?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  isVerified: boolean;
  logo?: { url: string };
  createdAt: string;
}

export interface ITrip {
  _id: string;
  title: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  vendor: { _id: string; businessName: string };
  price: { basePrice: number };
  isFeatured?: boolean;
  priorityRank?: number;
  createdAt: string;
}

export interface IPayment {
  _id: string;
  booking: string | { _id: string; bookingNumber: string };
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: string;
}

export interface IAdminStats {
  users: { total: number };
  vendors: { active: number; pending: number };
  revenue: { total: number; totalCommission: number };
  trips: { published: number };
}

export interface IDestination {
  _id: string;
  label: string;
  type: 'country' | 'state' | 'city';
  description?: string;
  image?: { url: string };
  order: number;
  isActive: boolean;
}

export interface IGlobalSetting {
  siteTitle: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  maintenanceMode: boolean;
}

export interface IVlog {
  _id: string;
  title: string;
  videoUrl: string;
  isActive: boolean;
  createdAt: string;
}

// Response Wrappers for Pagination
export interface ITripResponse {
  trips: ITrip[];
  total: number;
  totalPages: number;
  page: number;
}

export interface IVendorResponse {
  vendors: IVendor[];
  total: number;
  totalPages: number;
  page: number;
}

export interface IUserResponse {
  users: IUser[];
  total: number;
  totalPages: number;
  page: number;
}

export interface IPaymentResponse {
  payments: IPayment[];
  total: number;
  totalPages: number;
  page: number;
  aggregate?: {
    totalVolume: number;
    platformRevenue: number;
  };
}
