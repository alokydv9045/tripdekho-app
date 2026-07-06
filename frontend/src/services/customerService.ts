import { axiosPrivate } from '../lib/axios';

export const customerService = {
  getProfile: async () => {
    const response = await axiosPrivate.get('/customers/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await axiosPrivate.put('/customers/profile', data);
    return response.data;
  },

  /**
   * Upload a profile picture to Cloudinary via the backend.
   * Sends the file as multipart/form-data.
   */
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append('picture', file);
    const response = await axiosPrivate.post('/customers/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete the user's profile picture.
   */
  deleteProfilePicture: async () => {
    const response = await axiosPrivate.delete('/customers/profile/picture');
    return response.data;
  },

  getBookings: async (params?: any) => {
    const response = await axiosPrivate.get('/bookings/my-bookings', { params });
    return response.data;
  },

  getBookingDetails: async (id: string) => {
    const response = await axiosPrivate.get(`/bookings/${id}`);
    return response.data;
  },

  getUpcomingTrips: async () => {
    // Currently, there's no top-level 'upcoming-trips' so I'll fallback to a filter on my-bookings
    const response = await axiosPrivate.get('/bookings/my-bookings', { params: { status: 'confirmed' } });
    return response.data;
  },

  getPastTrips: async (params?: any) => {
    const response = await axiosPrivate.get('/bookings/my-bookings', { params: { ...params, status: 'completed' } });
    return response.data;
  },

  getReviews: async (params?: any) => {
    const response = await axiosPrivate.get('/customers/reviews', { params });
    return response.data;
  },

  getWishlist: async (params?: any) => {
    const response = await axiosPrivate.get('/wishlist', { params });
    return response.data;
  },

  getStatistics: async () => {
    const response = await axiosPrivate.get('/customers/stats');
    return response.data;
  },

  deleteAccount: async (password?: string) => {
    const response = await axiosPrivate.delete('/customers/account', {
      data: { password }
    });
    return response.data;
  }
};
