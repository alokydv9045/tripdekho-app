import { axiosPrivate, axiosPublic } from '../lib/axios';

export const vendorService = {
  // Get current vendor profile
  getCurrentVendor: async () => {
    const response = await axiosPrivate.get('/vendors/me');
    return response.data;
  },

  // Get vendor dashboard data
  getDashboard: async (vendorId: string) => {
    const response = await axiosPrivate.get(`/vendors/${vendorId}/dashboard`);
    return response.data;
  },

  // Get vendor earnings analytics
  getEarnings: async (vendorId: string) => {
    const response = await axiosPrivate.get(`/vendors/${vendorId}/earnings`);
    return response.data;
  },

  // Get vendor trips
  getVendorTrips: async (vendorId: string, params?: any) => {
    const response = await axiosPrivate.get(`/vendors/${vendorId}/trips`, { params });
    return response.data;
  },

  // Get vendor bookings
  getVendorBookings: async (vendorId: string, params?: any) => {
    const response = await axiosPrivate.get(`/vendors/${vendorId}/bookings`, { params });
    return response.data;
  },

  // Create vendor profile
  createVendorProfile: async (vendorData: any) => {
    const response = await axiosPrivate.post('/vendors', vendorData);
    return response.data;
  },

  // Update vendor profile
  updateVendorProfile: async (vendorId: string, vendorData: any) => {
    const response = await axiosPrivate.put(`/vendors/${vendorId}`, vendorData);
    return response.data;
  },

  // Upload vendor logo
  uploadLogo: async (vendorId: string, file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await axiosPrivate.post(`/vendors/${vendorId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Create Razorpay linked account
  createRazorpayAccount: async (vendorId: string) => {
    const response = await axiosPrivate.post(`/vendors/${vendorId}/razorpay-account`);
    return response.data;
  },

  // Get Razorpay onboarding link
  getRazorpayOnboardingLink: async (vendorId: string) => {
    const response = await axiosPrivate.get(`/vendors/${vendorId}/razorpay-onboarding-link`);
    return response.data;
  },

  // Get public vendor profile (no auth required)
  getPublicVendorProfile: async (vendorId: string) => {
    const response = await axiosPublic.get(`/vendors/${vendorId}/public-profile`);
    return response.data;
  }
};
