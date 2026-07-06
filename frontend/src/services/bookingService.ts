import { axiosPrivate } from '../lib/axios';

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData: any) => {
    const response = await axiosPrivate.post('/bookings', bookingData);
    return response.data;
  },

  // Get user bookings
  getMyBookings: async (params?: any) => {
    const response = await axiosPrivate.get('/bookings/my-bookings', { params });
    return response.data;
  },

  // Get single booking by ID
  getBookingById: async (id: string) => {
    const response = await axiosPrivate.get(`/bookings/${id}`);
    return response.data;
  },

  // Calculate booking price
  calculatePrice: async (data: any) => {
    const response = await axiosPrivate.post('/bookings/calculate', data);
    return response.data;
  },

  // Confirm payment
  confirmPayment: async (id: string, paymentData?: { razorpayPaymentId: string, razorpaySignature: string }) => {
    const response = await axiosPrivate.post(`/bookings/${id}/confirm-payment`, paymentData || {});
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string) => {
    const response = await axiosPrivate.delete(`/bookings/${id}`);
    return response.data;
  },

  // Download invoice
  downloadInvoice: async (id: string) => {
    const response = await axiosPrivate.get(`/bookings/${id}/invoice`);
    return response.data;
  },

  // Update booking
  updateBooking: async (id: string, data: any) => {
    const response = await axiosPrivate.patch(`/bookings/${id}`, data);
    return response.data;
  },

  // Request refund
  requestRefund: async (id: string) => {
    const response = await axiosPrivate.post(`/bookings/${id}/request-refund`);
    return response.data;
  },

  // Send message on booking
  sendMessage: async (id: string, messageData: { message: string, files?: File[] }) => {
    const formData = new FormData();
    formData.append('message', messageData.message);
    if (messageData.files) {
      messageData.files.forEach(file => formData.append('attachments', file));
    }
    const response = await axiosPrivate.post(`/bookings/${id}/message`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get booking messages
  getMessages: async (id: string, params?: any) => {
    const response = await axiosPrivate.get(`/bookings/${id}/messages`, { params });
    return response.data;
  },

  // Validate promo code
  validatePromoCode: async (code: string, amount: number, vendorId?: string) => {
    const response = await axiosPrivate.post('/promo-codes/validate', { code, amount, vendorId });
    return response.data;
  }
};
