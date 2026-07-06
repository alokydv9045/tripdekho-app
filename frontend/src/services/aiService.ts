import { axiosPrivate } from '../lib/axios';

export const aiService = {
  /**
   * Generate trip description, shortDescription, and catchphrase from a trip title
   */
  generateTripDetails: async (title: string, destination?: string): Promise<{
    description: string;
    shortDescription: string;
    catchphrase: string;
  }> => {
    const response = await axiosPrivate.post('/ai/generate-trip-details', { title, destination });
    return response.data.data;
  },

  /**
   * Generate a full day-by-day itinerary
   */
  generateItinerary: async (params: {
    destination: string;
    days: number;
    budget: string;
    interests: string[];
  }) => {
    const response = await axiosPrivate.post('/ai/generate', params);
    return response.data.data;
  },

  /**
   * Generate a route map image
   */
  generateRouteMap: async (locations: string[], title: string): Promise<string> => {
    const response = await axiosPrivate.post('/ai/generate-map', { locations, title });
    return response.data.data.url;
  },

  /**
   * Generate a trip thumbnail image
   */
  generateTripImage: async (title: string, destination: string, vibe?: string): Promise<string> => {
    const response = await axiosPrivate.post('/ai/generate-trip-image', { title, destination, vibe });
    return response.data.data.url;
  },
};
