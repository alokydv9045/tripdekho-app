import { axiosPrivate } from '../lib/axios';
import { 
  IUser, IVendor, ITrip, IPayment, IAdminStats,
  IUserResponse, IVendorResponse, ITripResponse, IPaymentResponse 
} from '../types/admin';

export const adminService = {
  // Analytics
  getAnalytics: async (startDate?: string, endDate?: string): Promise<IAdminStats> => {
    const response = await axiosPrivate.get('/admin/system/analytics', { params: { startDate, endDate } });
    return response.data.data;
  },

  // Users
  getUsers: async (params?: { search?: string; page?: number; limit?: number; role?: string; isVerified?: boolean; isActive?: boolean }): Promise<IUserResponse> => {
    const response = await axiosPrivate.get('/admin/users', { params });
    return response.data.data;
  },

  getUser: async (id: string): Promise<{ user: IUser; stats: Record<string, unknown> }> => {
    const response = await axiosPrivate.get(`/admin/users/${id}`);
    return response.data.data;
  },

  createUser: async (userData: Partial<IUser>): Promise<{ user: IUser }> => {
    const response = await axiosPrivate.post('/admin/users', userData);
    return response.data.data;
  },

  updateUser: async (id: string, userData: Partial<IUser>): Promise<{ user: IUser }> => {
    const response = await axiosPrivate.patch(`/admin/users/${id}`, userData);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.delete(`/admin/users/${id}`);
    return response.data.data;
  },

  // Vendors
  getVendors: async (params?: { search?: string; page?: number; limit?: number; status?: string }): Promise<IVendorResponse> => {
    const response = await axiosPrivate.get('/admin/vendors', { params });
    return response.data.data;
  },

  getVendorDetail: async (id: string): Promise<{ vendor: IVendor; stats: Record<string, unknown> }> => {
    const response = await axiosPrivate.get(`/admin/vendors/${id}`);
    return response.data.data;
  },

  approveVendor: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.patch(`/admin/vendors/${id}/approve`);
    return response.data.data;
  },

  verifyKYC: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.patch(`/admin/vendors/${id}/verify-kyc`);
    return response.data.data;
  },

  rejectKYC: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.patch(`/admin/vendors/${id}/reject-kyc`);
    return response.data.data;
  },

  createVendor: async (vendorData: Partial<IVendor> & { password?: string }): Promise<{ user: IUser; vendor: IVendor }> => {
    const response = await axiosPrivate.post('/admin/vendors', vendorData);
    return response.data.data;
  },

  rejectVendor: async (id: string, reason: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.patch(`/admin/vendors/${id}/reject`, { reason });
    return response.data.data;
  },

  updateVendor: async (id: string, vendorData: Partial<IVendor>): Promise<{ vendor: IVendor }> => {
    const response = await axiosPrivate.patch(`/admin/vendors/${id}`, vendorData);
    return response.data.data;
  },

  deleteVendor: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.delete(`/admin/vendors/${id}`);
    return response.data.data;
  },

  // Trips
  getTrips: async (params?: { search?: string; page?: number; limit?: number; status?: string; category?: string; featured?: string }): Promise<ITripResponse> => {
    const response = await axiosPrivate.get('/admin/trips', { params });
    return response.data.data;
  },

  updateTrip: async (id: string, tripData: Partial<ITrip>): Promise<{ success: boolean; data: ITrip }> => {
    const response = await axiosPrivate.patch(`/admin/trips/${id}`, tripData);
    return response.data.data;
  },

  forceUpdateTrip: async (id: string, tripData: Partial<ITrip>): Promise<{ trip: ITrip }> => {
    const response = await axiosPrivate.put(`/admin/trips/${id}/force-admin`, tripData);
    return response.data.data;
  },

  auditTrips: async (): Promise<{ count: number; defectiveTrips: ITrip[] }> => {
    const response = await axiosPrivate.get('/admin/trips/audit');
    return response.data.data;
  },

  updateTripStatus: async (id: string, status: string, reason?: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.patch(`/admin/trips/${id}/status`, { status, reason });
    return response.data.data;
  },


  deleteTrip: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.delete(`/admin/trips/${id}`);
    return response.data.data;
  },

  // Finance
  getPaymentAudit: async (params?: { search?: string; page?: number; limit?: number; status?: string }): Promise<IPaymentResponse> => {
    const response = await axiosPrivate.get('/admin/finance/payments', { params });
    return response.data.data;
  },

  syncRazorpay: async (): Promise<{ synced: number }> => {
    const response = await axiosPrivate.post('/admin/finance/payments/sync-razorpay');
    return response.data.data;
  },

  getPayroll: async (): Promise<{ balances: Record<string, unknown>[]; stats: Record<string, unknown> }> => {
    const response = await axiosPrivate.get('/admin/finance/payroll');
    return response.data.data;
  },

  settlePayrollAccount: async (vendorId: string, data: { amount: number; note?: string }): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.post(`/admin/finance/payroll/${vendorId}/settle`, data);
    return response.data.data;
  },

  getAllPayouts: async (params?: Record<string, unknown>): Promise<{ payouts: Record<string, unknown>[]; total: number; totalPages: number; page: number }> => {
    const response = await axiosPrivate.get('/admin/finance/payouts', { params });
    return response.data.data;
  },

  processPayout: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.post(`/admin/finance/payouts/${id}/process`);
    return response.data.data;
  },

  // Reviews
  getReviews: async (params?: { search?: string; page?: number; limit?: number; status?: string }): Promise<{ reviews: Record<string, unknown>[]; total: number; totalPages: number }> => {
    const response = await axiosPrivate.get('/admin/reviews', { params });
    return response.data.data;
  },

  updateReviewStatus: async (id: string, status: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.patch(`/admin/reviews/${id}`, { status });
    return response.data.data;
  },

  updateReview: async (id: string, data: { comment?: string; rating?: number; status?: string }): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.patch(`/admin/reviews/${id}`, data);
    return response.data.data;
  },

  deleteReview: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.delete(`/admin/reviews/${id}`);
    return response.data.data;
  },

  // Marketing (Promo Codes)
  getPromoCodes: async (params?: { search?: string; page?: number; limit?: number }): Promise<{ promos: Record<string, unknown>[]; total: number; totalPages: number; page: number }> => {
    const response = await axiosPrivate.get('/admin/promo-codes', { params });
    return response.data.data;
  },

  getPromoCode: async (id: string): Promise<{ promo: Record<string, unknown> }> => {
    const response = await axiosPrivate.get(`/admin/promo-codes/${id}`);
    return response.data.data;
  },

  createPromoCode: async (data: Record<string, unknown>): Promise<{ promo: Record<string, unknown> }> => {
    const response = await axiosPrivate.post('/admin/promo-codes', data);
    return response.data.data;
  },

  updatePromoCode: async (id: string, promoData: Record<string, unknown>): Promise<{ promo: Record<string, unknown> }> => {
    const response = await axiosPrivate.patch(`/admin/promo-codes/${id}`, promoData);
    return response.data.data;
  },

  deletePromoCode: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosPrivate.delete(`/admin/promo-codes/${id}`);
    return response.data.data;
  },

  // System Settings (CMS)
  getSystemSettings: async (): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.get('/admin/system/settings');
    return response.data.data;
  },

  updateSystemSettings: async (settingsData: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.put('/admin/system/settings', settingsData);
    return response.data.data;
  },

  universalSearch: async (query: string): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.get('/admin/system/search/universal', { params: { search: query } });
    return response.data.data;
  },

  // System Health
  getPlatformHealth: async (): Promise<{ dbstatus: string; uptime: number }> => {
    const response = await axiosPrivate.get('/admin/system/health');
    return response.data.data;
  },

  // Support System
  getTickets: async (params?: Record<string, unknown>): Promise<{ tickets: Record<string, unknown>[]; total: number; totalPages: number }> => {
    const response = await axiosPrivate.get('/admin/support/tickets', { params });
    return response.data.data;
  },

  getTicketDetail: async (id: string): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.get(`/admin/support/tickets/${id}`);
    return response.data.data;
  },

  updateTicket: async (id: string, data: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.patch(`/admin/support/tickets/${id}`, data);
    return response.data.data;
  },

  addTicketMessage: async (id: string, text: string, attachments?: Record<string, unknown>[]): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.post(`/admin/support/tickets/${id}/messages`, { text, attachments });
    return response.data.data;
  },

  // Growth & Campaigns
  getCampaigns: async (params?: Record<string, unknown>): Promise<{ campaigns: Record<string, unknown>[]; total: number; totalPages: number; page: number }> => {
    const response = await axiosPrivate.get('/admin/growth/campaigns', { params });
    return response.data.data;
  },

  createCampaign: async (data: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.post('/admin/growth/campaigns', data);
    return response.data.data;
  },

  updateCampaign: async (id: string, data: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.patch(`/admin/growth/campaigns/${id}`, data);
    return response.data.data;
  },

  featureTripPriority: async (id: string, isFeatured: boolean, priority: number): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.patch(`/admin/growth/trips/${id}/feature`, { isFeatured, priority });
    return response.data.data;
  },

  // Careers (Work With Us)
  getCareerPositions: async (params?: Record<string, unknown>): Promise<{ positions: Record<string, unknown>[]; total: number; totalPages: number; page: number }> => {
    const response = await axiosPrivate.get('/admin/careers/positions', { params });
    return response.data.data;
  },

  createCareerPosition: async (data: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.post('/admin/careers/positions', data);
    return response.data.data;
  },

  updateCareerPosition: async (id: string, data: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.patch(`/admin/careers/positions/${id}`, data);
    return response.data.data;
  },

  toggleCareerPosition: async (id: string): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.patch(`/admin/careers/positions/${id}/toggle`);
    return response.data.data;
  },

  deleteCareerPosition: async (id: string): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.delete(`/admin/careers/positions/${id}`);
    return response.data.data;
  },

  getCareerApplications: async (params?: Record<string, unknown>): Promise<{ applications: Record<string, unknown>[]; total: number; totalPages: number; page: number }> => {
    const response = await axiosPrivate.get('/admin/careers/applications', { params });
    return response.data.data;
  },

  updateApplicationStatus: async (id: string, status: string): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.patch(`/admin/careers/applications/${id}/status`, { status });
    return response.data.data;
  },

  // Careers Gallery
  getCareerGallery: async (): Promise<{ images: Record<string, unknown>[] }> => {
    const response = await axiosPrivate.get('/admin/careers/gallery');
    return response.data.data;
  },

  createGalleryImage: async (data: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.post('/admin/careers/gallery', data);
    return response.data.data;
  },

  toggleGalleryImage: async (id: string): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.patch(`/admin/careers/gallery/${id}/toggle`);
    return response.data.data;
  },

  deleteGalleryImage: async (id: string): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.delete(`/admin/careers/gallery/${id}`);
    return response.data.data;
  },

  // System Integrity & Finance
  getAuditLogs: async (params?: Record<string, unknown>): Promise<{ logs: Record<string, unknown>[]; total: number; totalPages: number; currentPage: number }> => {
    const response = await axiosPrivate.get('/admin/system/audit-logs', { params });
    return response.data.data;
  },
  
  getAuditLogDetail: async (id: string): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.get(`/admin/system/audit-logs/${id}`);
    return response.data.data;
  },

  clearAuditLogs: async (period: string): Promise<{ deleted: number }> => {
    const response = await axiosPrivate.delete(`/admin/system/audit-logs?period=${period}`);
    return response.data.data;
  },

  getVendorWallets: async (): Promise<{ wallets: Record<string, unknown>[]; total: number }> => {
    const response = await axiosPrivate.get('/admin/finance/wallets');
    return response.data.data;
  },

  // Bookings Logistics
  getBookings: async (params?: { search?: string; page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }): Promise<{ bookings: Record<string, unknown>[]; total: number; totalPages: number; page: number }> => {
    const response = await axiosPrivate.get('/admin/bookings', { params });
    return response.data.data;
  },

  updateBookingStatus: async (id: string, status: string): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.patch(`/admin/bookings/${id}/status`, { status });
    return response.data.data;
  },

  // Messaging & CRM
  getInquiries: async (params?: Record<string, unknown>): Promise<{ inquiries: Record<string, unknown>[]; total: number; totalPages: number }> => {
    const response = await axiosPrivate.get('/admin/messaging/inquiries', { params });
    return response.data.data;
  },

  updateInquiry: async (id: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> => {
    const response = await axiosPrivate.patch(`/admin/messaging/inquiries/${id}`, updates);
    return response.data.data;
  },


  getNewsletterSubscribers: async (params?: Record<string, unknown>): Promise<{ subscribers: Record<string, unknown>[]; total: number; totalPages: number }> => {
    const response = await axiosPrivate.get('/admin/messaging/newsletter', { params });
    return response.data.data;
  }
};
