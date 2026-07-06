import { axiosPrivate } from '../lib/axios';

export interface Payout {
  id: string;
  vendor: any;
  booking: {
    id: string;
    bookingId: string;
    trip: any;
    startDate: string;
  };
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: string;
  processedAt?: string;
  razorpayTransferId?: string;
  failureReason?: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  vendor: string;
  booking: any;
  payout: any;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  balance: number;
  createdAt: string;
}

export interface FinancialSummary {
  period: string;
  totalRevenue: number;
  platformFees: number;
  netEarnings: number;
  payouts: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  totalBookings: number;
}

export const payrollService = {
  getVendorPayouts: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await axiosPrivate.get('/payroll/payouts', { params });
    return response.data;
  },

  getPayoutDetails: async (id: string) => {
    const response = await axiosPrivate.get(`/payroll/payouts/${id}`);
    return response.data;
  },

  getLedger: async (params?: { startDate?: string; endDate?: string; page?: number; limit?: number }) => {
    const response = await axiosPrivate.get('/payroll/ledger', { params });
    return response.data;
  },

  requestPayout: async (data: string | { amount: number; bookingId?: string }) => {
    const payload = typeof data === 'string' ? { bookingId: data } : data;
    const response = await axiosPrivate.post('/payroll/request-payout', payload);
    return response.data;
  },

  getSummary: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await axiosPrivate.get('/payroll/summary', { params: { period } });
    return response.data;
  },

  getFinancialSummary: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await axiosPrivate.get('/payroll/summary', { params: { period } });
    return response.data;
  },

  // Admin methods
  getAllPayouts: async (params?: { status?: string; vendor?: string; page?: number; limit?: number }) => {
    const response = await axiosPrivate.get('/payroll/admin/payouts', { params });
    return response.data;
  },

  processPayout: async (id: string) => {
    const response = await axiosPrivate.post(`/payroll/process/${id}`);
    return response.data;
  }
};

