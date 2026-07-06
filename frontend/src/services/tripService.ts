import { axiosPublic, axiosPrivate } from '../lib/axios';

export const tripService = {
  // Get all trips (with optional filters)
  getAllTrips: async (params?: Record<string, any>) => {
    const response = await axiosPublic.get('/trips', { params });
    return response.data;
  },

  // Get vendor's own trips
  getMyTrips: async (params?: Record<string, any>) => {
    const response = await axiosPrivate.get('/trips/my-trips', { params });
    return response.data;
  },

  // Get single trip by slug or ID
  getTripById: async (idOrSlug: string) => {
    const response = await axiosPublic.get(`/trips/${idOrSlug}`);
    return response.data;
  },

  // Create a new trip (vendor/admin only)
  createTrip: async (tripData: any) => {
    const response = await axiosPrivate.post('/trips', tripData);
    return response.data;
  },

  // Update a trip (vendor/admin only)
  updateTrip: async (id: string, tripData: any) => {
    const response = await axiosPrivate.put(`/trips/${id}`, tripData);
    return response.data;
  },

  // Delete a trip (vendor/admin only)
  deleteTrip: async (id: string) => {
    const response = await axiosPrivate.delete(`/trips/${id}`);
    return response.data;
  },

  // Get reviews for a trip
  getTripReviews: async (tripId: string, params?: any) => {
    const response = await axiosPublic.get(`/trips/${tripId}/reviews`, { params });
    return response.data;
  },

  // Upload images to a trip
  uploadImages: async (id: string, formData: FormData) => {
    const response = await axiosPrivate.post(`/trips/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete an image from a trip
  deleteImage: async (id: string, imageId: string) => {
    const response = await axiosPrivate.delete(`/trips/${id}/images/${imageId}`);
    return response.data;
  },

  // Publish a trip
  publishTrip: async (id: string) => {
    const response = await axiosPrivate.patch(`/trips/${id}/publish`);
    return response.data;
  },

  // Unpublish a trip
  unpublishTrip: async (id: string) => {
    const response = await axiosPrivate.patch(`/trips/${id}/unpublish`);
    return response.data;
  },

  // Check trip availability
  checkAvailability: async (id: string, departureId: string, guests: number) => {
    const response = await axiosPublic.get(`/trips/${id}/availability`, {
      params: { departureId, guests }
    });
    return response.data;
  },

  // Get similar trips
  getSimilarTrips: async (id: string, limit?: number) => {
    const response = await axiosPublic.get(`/trips/${id}/similar`, {
      params: limit ? { limit } : undefined
    });
    return response.data;
  }
};
