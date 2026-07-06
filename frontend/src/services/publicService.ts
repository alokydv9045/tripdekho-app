import { axiosPublic } from '../lib/axios';

export const publicService = {
  getGlobalSettings: async (): Promise<any> => {
    const response = await axiosPublic.get('/cms/settings');
    return response.data.data;
  }
};
