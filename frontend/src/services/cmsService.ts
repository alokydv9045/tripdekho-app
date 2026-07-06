import { axiosPrivate, axiosPublic } from '../lib/axios';

export const cmsService = {
  // --- Vibe Videos (Instagram Reels) ---
  getVibeVideos: async (homepageOnly: boolean = false) => {
    const response = await axiosPublic.get('/cms/vibe-videos', {
      params: { homepageOnly }
    });
    return response.data;
  },
  createVibeVideo: async (data: any) => {
    const response = await axiosPrivate.post('/cms/vibe-videos', data);
    return response.data;
  },
  updateVibeVideo: async (id: string, data: any) => {
    const response = await axiosPrivate.put(`/cms/vibe-videos/${id}`, data);
    return response.data;
  },
  reorderVibeVideos: async (orders: { id: string; order: number }[]) => {
    const response = await axiosPrivate.put('/cms/vibe-videos/reorder', { orders });
    return response.data;
  },
  deleteVibeVideo: async (id: string) => {
    const response = await axiosPrivate.delete(`/cms/vibe-videos/${id}`);
    return response.data;
  },

  // --- Vlog CRUD ---
  getVlogs: async (params?: { featured?: boolean; grouped?: boolean }) => {
    const response = await axiosPublic.get('/cms/vlogs', { params });
    return response.data;
  },
  getVlogCategories: async () => {
    const response = await axiosPublic.get('/cms/vlogs/categories');
    return response.data;
  },
  createVlog: async (data: any) => {
    const response = await axiosPrivate.post('/cms/vlogs', data);
    return response.data;
  },
  updateVlog: async (id: string, data: any) => {
    const response = await axiosPrivate.put(`/cms/vlogs/${id}`, data);
    return response.data;
  },
  deleteVlog: async (id: string) => {
    const response = await axiosPrivate.delete(`/cms/vlogs/${id}`);
    return response.data;
  },

  // --- Blog CRUD ---
  getBlogs: async () => {
    const response = await axiosPublic.get('/cms/blogs');
    return response.data;
  },
  getAllBlogsAdmin: async () => {
    const response = await axiosPrivate.get('/cms/blogs/admin/all');
    return response.data;
  },
  getBlogBySlug: async (slug: string) => {
    const response = await axiosPublic.get(`/cms/blogs/${slug}`);
    return response.data;
  },
  createBlog: async (data: any) => {
    const response = await axiosPrivate.post('/cms/blogs', data);
    return response.data;
  },
  updateBlog: async (id: string, data: any) => {
    const response = await axiosPrivate.put(`/cms/blogs/${id}`, data);
    return response.data;
  },
  deleteBlog: async (id: string) => {
    const response = await axiosPrivate.delete(`/cms/blogs/${id}`);
    return response.data;
  },

  // --- Destinations ---
  getDestinations: async (type?: string) => {
    const response = await axiosPublic.get('/cms/destinations', { params: { type } });
    return response.data;
  },
  createDestination: async (data: any) => {
    const response = await axiosPrivate.post('/cms/destinations', data);
    return response.data;
  },
  updateDestination: async (id: string, data: any) => {
    const response = await axiosPrivate.put(`/cms/destinations/${id}`, data);
    return response.data;
  },
  deleteDestination: async (id: string) => {
    const response = await axiosPrivate.delete(`/cms/destinations/${id}`);
    return response.data;
  },

  // --- Global Settings ---
  getSettings: async () => {
    const response = await axiosPublic.get('/cms/settings');
    return response.data;
  },
  updateSettings: async (data: any) => {
    const response = await axiosPrivate.put('/cms/settings', data);
    return response.data;
  }
};
