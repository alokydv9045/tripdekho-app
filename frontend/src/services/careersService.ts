import { axiosPublic } from '../lib/axios';

export interface CareerPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements?: string;
  salary?: string;
  isActive: boolean;
  createdAt: string;
}

export const careersService = {
  // Public Methods
  getActivePositions: async (): Promise<{ positions: CareerPosition[] }> => {
    const response = await axiosPublic.get('/careers');
    return response.data.data;
  },

  getGalleryImages: async (): Promise<{ images: { id: string; imageUrl: string; sortOrder: number }[] }> => {
    const response = await axiosPublic.get('/careers/gallery');
    return response.data.data;
  },

  getPositionById: async (id: string): Promise<{ position: CareerPosition }> => {
    const response = await axiosPublic.get(`/careers/${id}`);
    return response.data.data;
  },

  submitApplication: async (data: any): Promise<{ success: boolean; message?: string }> => {
    const response = await axiosPublic.post('/careers/apply', data);
    return response.data;
  }
};
