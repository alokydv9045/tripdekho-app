import { axiosPublic, axiosPrivate } from '../lib/axios';

export const authService = {
  // Register a new user
  register: async (userData: any) => {
    const response = await axiosPublic.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials: any) => {
    const response = await axiosPublic.post('/auth/login', credentials);
    return response.data;
  },

  // Login with Phone (Mock OTP)
  loginWithPhone: async (credentials: { phone: string }) => {
    const response = await axiosPublic.post('/auth/login-with-phone', credentials);
    return response.data;
  },

  // Get current user profile
  getMe: async () => {
    const response = await axiosPrivate.get('/auth/me');
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await axiosPrivate.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    const response = await axiosPublic.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  // Forgot Password (Send OTP)
  forgotPassword: async (identifier: string) => {
    const response = await axiosPublic.post('/auth/forgot-password', { identifier });
    return response.data;
  },

  // Reset Password (Validate OTP)
  resetPassword: async (data: { identifier: string; otp: string; newPassword: string }) => {
    const response = await axiosPublic.post('/auth/reset-password', data);
    return response.data;
  },
};

export const referralsService = {
  getMyCode: async () => {
    const response = await axiosPrivate.get('/referrals/my-code');
    return response.data;
  },
  getMyReferrals: async () => {
    const response = await axiosPrivate.get('/referrals/my-referrals');
    return response.data;
  },
  validateCode: async (code: string) => {
    const response = await axiosPublic.post('/referrals/validate', { code });
    return response.data;
  },
};

export const wanderPointsService = {
  getBalance: async () => {
    const response = await axiosPrivate.get('/rewards/balance');
    return response.data;
  },
  getTransactions: async () => {
    const response = await axiosPrivate.get('/rewards/transactions');
    return response.data;
  },
};
