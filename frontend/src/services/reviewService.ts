import { axiosPublic, axiosPrivate } from '../lib/axios';

export const reviewService = {
  // Create a new review (Requires completed booking)
  createReview: async (reviewData: {
    tripId: string;
    bookingId?: string;
    rating?: number;
    ratings?: {
      overall: number;
      accuracy?: number;
      communication?: number;
      cleanliness?: number;
      location?: number;
      value?: number;
    };
    comment: string;
  }) => {
    const response = await axiosPrivate.post('/reviews', reviewData);
    return response.data;
  },

  // Get reviews for a specific trip
  getReviewsByTrip: async (tripId: string, params?: any) => {
    const response = await axiosPublic.get(`/reviews/trip/${tripId}`, { params });
    return response.data;
  },

  // Get all reviews for the current vendor
  getVendorReviews: async (params?: any) => {
    const response = await axiosPrivate.get(`/reviews/vendor`, { params });
    return response.data;
  },

  // Respond to a review (Vendor only)
  respondToReview: async (reviewId: string, response: string) => {
    const responseData = await axiosPrivate.post(`/reviews/${reviewId}/respond`, { response });
    return responseData.data;
  }
};
