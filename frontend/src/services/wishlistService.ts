import { axiosPrivate } from "../lib/axios";

export interface WishlistItem {
  id: string;
  user: string;
  trip: {
    id: string;
    title: string;
    slug: string;
    thumbnail: { url: string };
    price: { amount: number; currency: string };
    location: { city: string; country: string };
    duration: { days: number; nights: number };
    category: string;
    vendor: {
      id: string;
      businessName: string;
    };
  };
  notes?: string;
  createdAt: string;
}

export interface WishlistResponse {
  items: WishlistItem[];
  total: number;
  pages: number;
  currentPage: number;
}

export const wishlistService = {
  getWishlist: async (page = 1, limit = 20): Promise<WishlistResponse> => {
    const response = await axiosPrivate.get(`/wishlist?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  toggleWishlist: async (tripId: string, notes = ""): Promise<{ added: boolean }> => {
    const response = await axiosPrivate.post(`/wishlist/${tripId}`, { notes });
    return response.data.data;
  },

  checkStatus: async (tripId: string): Promise<boolean> => {
    const response = await axiosPrivate.get(`/wishlist/check/${tripId}`);
    return response.data.data.inWishlist;
  },

  removeFromWishlist: async (tripId: string): Promise<void> => {
    await axiosPrivate.delete(`/wishlist/${tripId}`);
  },

  clearWishlist: async (): Promise<void> => {
    await axiosPrivate.delete("/wishlist");
  }
};
