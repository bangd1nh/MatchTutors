import { useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi, type Notification } from "@/api/notification";
import { useSocket } from "./useSocket";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useToast } from "./useToast";
import { useUser } from "./useUser";

export const useNotification = () => {
   const socket = useSocket("notifications");
   const queryClient = useQueryClient();
   const addToast = useToast();
   const { user } = useUser();

   const {
      notifications,
      unreadCount,
      setNotifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      setUnreadCount,
      removeNotification,
      clearNotifications,
   } = useNotificationStore();

   const {
      data: notificationsData,
      isLoading: loadingNotifications,
      refetch: refetchNotifications,
   } = useQuery({
      queryKey: ["notifications"],
      queryFn: () => notificationApi.getNotifications(1, 50),
      enabled: !!user,
   });

   useEffect(() => {
      if (notificationsData?.data?.notifications) {
         setNotifications(notificationsData.data.notifications);
      }
   }, [notificationsData, setNotifications, addNotification]);

   const { data: unreadCountData } = useQuery({
      queryKey: ["notifications-unread-count"],
      queryFn: notificationApi.getUnreadCount,
      enabled: !!user,
   });

   useEffect(() => {
      if (unreadCountData?.count !== undefined) {
         setUnreadCount(unreadCountData.count);
      }
   }, [unreadCountData, setUnreadCount]);

   const markAsReadMutation = useMutation({
      mutationFn: notificationApi.markAsRead,
      onSuccess: (_, notificationId) => {
         markNotificationAsRead(notificationId);
         queryClient.invalidateQueries({
            queryKey: ["notifications-unread-count"],
         });
      },
      onError: (error) => {
         console.error("Error marking notification as read:", error);
         addToast("error", "Không thể đánh dấu thông báo đã đọc");
      },
   });

   const markAllAsReadMutation = useMutation({
      mutationFn: notificationApi.markAllAsRead,
      onSuccess: () => {
         markAllNotificationsAsRead();
         queryClient.invalidateQueries({ queryKey: ["notifications"] });
         queryClient.invalidateQueries({
            queryKey: ["notifications-unread-count"],
         });
      },
      onError: (error) => {
         console.error("Error marking all notifications as read:", error);
         addToast("error", "Không thể đánh dấu tất cả thông báo đã đọc");
      },
   });

   const deleteNotificationMutation = useMutation({
      mutationFn: notificationApi.deleteNotification,
      onSuccess: (_, notificationId) => {
         removeNotification(notificationId);
         queryClient.invalidateQueries({
            queryKey: ["notifications-unread-count"],
         });
      },
      onError: (error) => {
         console.error("Error deleting notification:", error);
         addToast("error", "Không thể xóa thông báo");
      },
   });

   const clearAllNotificationsMutation = useMutation({
      mutationFn: notificationApi.clearAllNotifications,
      onSuccess: () => {
         clearNotifications();
         queryClient.invalidateQueries({ queryKey: ["notifications"] });
         queryClient.invalidateQueries({
            queryKey: ["notifications-unread-count"],
         });
      },
      onError: (error) => {
         console.error("Error clearing all notifications:", error);
         addToast("error", "Không thể xóa tất cả thông báo");
      },
   });

   useEffect(() => {
      if (!socket || !user) return;

      const userId = user.id || user._id;

      socket.emit("joinNotification", userId);

      return () => {
         socket.emit("leaveNotification", userId);
      };
   }, [socket, user]);

   useEffect(() => {
      if (!socket) return;

      const handleNewNotification = (data: any) => {
         if (!data.notification) {
            console.error("❌ No notification object in data");
            return;
         }

         const notification: Notification = {
            ...data.notification,
            userId:
               typeof data.notification.userId === "object"
                  ? data.notification.userId._id
                  : data.notification.userId,
            type: data.notification?.type || "system",
         };

         addNotification(notification);

         addToast("info", "Thông báo mới");

         queryClient.invalidateQueries({
            queryKey: ["notifications-unread-count"],
         });
      };

      // Register listener
      socket.on("newNotification", handleNewNotification);

      return () => {
         socket.off("newNotification", handleNewNotification);
         socket.offAny();
      };
   }, [socket, addNotification, addToast, queryClient]);

   // Helper functions
   const handleMarkAsRead = useCallback(
      (notificationId: string) => {
         markAsReadMutation.mutate(notificationId);
      },
      [markAsReadMutation]
   );

   const handleMarkAllAsRead = useCallback(() => {
      markAllAsReadMutation.mutate();
   }, [markAllAsReadMutation]);

   const handleDeleteNotification = useCallback(
      (notificationId: string) => {
         deleteNotificationMutation.mutate(notificationId);
      },
      [deleteNotificationMutation]
   );

   const handleClearAllNotifications = useCallback(() => {
      clearAllNotificationsMutation.mutate();
   }, [clearAllNotificationsMutation]);

   const getNotifications = useCallback(() => {
      refetchNotifications();
   }, [refetchNotifications]);

   return {
      // Data
      notifications,
      unreadCount,
      // Loading states
      isLoading: loadingNotifications,
      loadingNotifications,
      // Connection state
      isConnected: socket?.connected || false,
      // Actions
      markAsRead: handleMarkAsRead,
      markAllAsRead: handleMarkAllAsRead,
      deleteNotification: handleDeleteNotification,
      clearAllNotifications: handleClearAllNotifications,
      getNotifications,
      // Mutation states
      isMarkingAsRead: markAsReadMutation.isPending,
      isMarkingAllAsRead: markAllAsReadMutation.isPending,
      isDeletingNotification: deleteNotificationMutation.isPending,
      isClearingAll: clearAllNotificationsMutation.isPending,
      // Refetch function
      refetch: refetchNotifications,
   };
};
