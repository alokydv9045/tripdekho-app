import { axiosPrivate } from "../lib/axios";

export const notificationService = {
  getNotifications: async () => {
    const response = await axiosPrivate.get("/notifications");
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await axiosPrivate.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosPrivate.patch("/notifications/read-all");
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await axiosPrivate.delete(`/notifications/${id}`);
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axiosPrivate.get("/notifications/unread-count");
    return response.data;
  },

  deleteAllNotifications: async () => {
    const response = await axiosPrivate.delete("/notifications");
    return response.data;
  },
};
