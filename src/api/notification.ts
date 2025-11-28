import apiClient from "@/lib/api";
import { BaseAPIResponse } from "@/types/response";

export interface Notification {
   _id: string;
   userId: string;
   title: string;
   message: string;
   isRead: boolean;
   createdAt: string;
   updatedAt: string;
}

export interface NotificationResponse extends BaseAPIResponse {
   data: {
      notifications: Notification[];
      pagination: {
         page: number;
         limit: number;
         total: number;
         pages: number;
      };
   };
}

export const notificationApi = {
   getNotifications: async (
      page = 1,
      limit = 20
   ): Promise<NotificationResponse> => {
      const response = await apiClient.get("/notifications", {
         params: { page, limit },
      });
      return response.data;
   },

   markAsRead: async (
      notificationId: string
   ): Promise<{ success: boolean }> => {
      const response = await apiClient.patch(
         `/notifications/${notificationId}/read`
      );
      return response.data;
   },

   markAllAsRead: async (): Promise<any> => {
      const response = await apiClient.patch("/notifications/mark-all-read");
      return response.data;
   },

   getUnreadCount: async (): Promise<{ count: number }> => {
      const response = await apiClient.get("/notifications/unread-count");
      return response.data;
   },

   deleteNotification: async (
      notificationId: string
   ): Promise<{ success: boolean }> => {
      const response = await apiClient.delete(
         `/notifications/${notificationId}`
      );
      return response.data;
   },

   clearAllNotifications: async (): Promise<{ success: boolean }> => {
      const response = await apiClient.delete("/notifications");
      return response.data;
   },
};
