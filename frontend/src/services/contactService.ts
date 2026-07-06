import { axiosPublic } from "../lib/axios";

export const contactService = {
  subscribeNewsletter: async (email: string) => {
    const response = await axiosPublic.post('/contacts/newsletter', { email });
    return response.data;
  },

  submitContact: async (contactData: any) => {
    const response = await axiosPublic.post('/contacts', contactData);
    return response.data;
  },

  unsubscribeNewsletter: async (email: string) => {
    const response = await axiosPublic.post('/contacts/newsletter/unsubscribe', { email });
    return response.data;
  },
};
