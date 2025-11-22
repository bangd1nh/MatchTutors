import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Notification } from "@/api/notification"; // Import from API

interface NotificationState {
   notifications: Notification[];
   unreadCount: number;

   // Actions
   setNotifications: (notifications: Notification[]) => void;
   addNotification: (notification: Notification) => void;
   markNotificationAsRead: (notificationId: string) => void;
   markAllNotificationsAsRead: () => void;
   removeNotification: (notificationId: string) => void;
   clearNotifications: () => void;
   setUnreadCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>()(
   persist(
      (set) => ({
         notifications: [],
         unreadCount: 0,

         setNotifications: (notifications) => {
            const unreadCount = notifications.filter((n) => !n.isRead).length;
            set({ notifications, unreadCount });
         },

         addNotification: (notification) => {
            set((state) => {
               const existingIndex = state.notifications.findIndex(
                  (n) => n._id === notification._id
               );

               if (existingIndex >= 0) {
                  // Update existing notification
                  const updatedNotifications = [...state.notifications];
                  updatedNotifications[existingIndex] = notification;
                  return {
                     notifications: updatedNotifications,
                     unreadCount:
                        !notification.isRead &&
                        state.notifications[existingIndex].isRead
                           ? state.unreadCount + 1
                           : state.unreadCount,
                  };
               } else {
                  // Add new notification
                  return {
                     notifications: [notification, ...state.notifications],
                     unreadCount: !notification.isRead
                        ? state.unreadCount + 1
                        : state.unreadCount,
                  };
               }
            });
         },

         markNotificationAsRead: (notificationId) => {
            set((state) => {
               const notification = state.notifications.find(
                  (n) => n._id === notificationId
               );
               if (!notification || notification.isRead) return state;

               return {
                  notifications: state.notifications.map((n) =>
                     n._id === notificationId ? { ...n, isRead: true } : n
                  ),
                  unreadCount: Math.max(0, state.unreadCount - 1),
               };
            });
         },

         markAllNotificationsAsRead: () => {
            set((state) => ({
               notifications: state.notifications.map((n) => ({
                  ...n,
                  isRead: true,
               })),
               unreadCount: 0,
            }));
         },

         removeNotification: (notificationId) => {
            set((state) => {
               const notification = state.notifications.find(
                  (n) => n._id === notificationId
               );
               const wasUnread = notification && !notification.isRead;

               return {
                  notifications: state.notifications.filter(
                     (n) => n._id !== notificationId
                  ),
                  unreadCount: wasUnread
                     ? Math.max(0, state.unreadCount - 1)
                     : state.unreadCount,
               };
            });
         },

         clearNotifications: () => {
            set({ notifications: [], unreadCount: 0 });
         },

         setUnreadCount: (count) => {
            set({ unreadCount: count });
         },
      }),
      {
         name: "notification-storage",
         partialize: (state) => ({
            notifications: state.notifications,
            unreadCount: state.unreadCount,
         }),
      }
   )
);
