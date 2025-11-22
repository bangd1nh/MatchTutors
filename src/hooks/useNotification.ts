import { useEffect, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useToast } from "./useToast";
import { useUser } from "./useUser";
import { notificationApi, type Notification } from "@/api/notification";

interface NotificationData {
   _id: string;
   title: string;
   message: string;
   type?: "message" | "booking" | "payment" | "system" | "reminder";
   isRead: boolean;
   createdAt: string;
   userId: string;
   data?: any;
}

interface UseNotificationReturn {
   socket: Socket | null;
   isConnected: boolean;
   notifications: NotificationData[];
   unreadCount: number;
   sendNotification: (
      userId: string,
      data: { title: string; message: string }
   ) => void;
   markAsRead: (notificationId: string) => void;
   markAllAsRead: () => void;
   deleteNotification: (notificationId: string) => void;
   clearAllNotifications: () => void;
   getNotifications: (page?: number, limit?: number) => void;
   error: string | null;
   isLoading: boolean;
   refetch: () => void;
   // Mutation states
   isMarkingAsRead: boolean;
   isMarkingAllAsRead: boolean;
   isDeletingNotification: boolean;
   isClearingAll: boolean;
}

const NOTIFICATION_SOCKET_URL = "ws://localhost:3002";

export const useNotification = (): UseNotificationReturn => {
   const { user } = useUser();
   const queryClient = useQueryClient();
   const addToast = useToast();

   const [socket, setSocket] = useState<Socket | null>(null);
   const [isConnected, setIsConnected] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const {
      notifications: storeNotifications,
      unreadCount: storeUnreadCount,
      setNotifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      setUnreadCount,
      removeNotification,
      clearNotifications,
   } = useNotificationStore();

   // Get token from localStorage or your auth store
   const token = localStorage.getItem("token");

   // Fetch notifications query (fallback)
   const {
      data: notificationsData,
      isLoading: isLoadingNotifications,
      error: notificationsError,
      refetch: refetchNotifications,
   } = useQuery({
      queryKey: ["notifications"],
      queryFn: () => notificationApi.getNotifications(1, 50),
      enabled: !!user && !isConnected, // Only fetch when not connected via socket
      staleTime: 30000,
      refetchOnWindowFocus: false,
   });

   // Mutations
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
      },
      onError: (error) => {
         console.error("Error clearing all notifications:", error);
         addToast("error", "Không thể xóa tất cả thông báo");
      },
   });

   // Socket connection effect
   useEffect(() => {
      if (!token || !user) {
         return;
      }

      // Create socket connection with multiple fallback methods
      const newSocket = io(NOTIFICATION_SOCKET_URL, {
         // Method 1: Auth object (recommended)
         auth: {
            token: token,
         },
         // Method 2: Query parameter (fallback)
         query: {
            token: token,
         },
         // Method 3: Headers (fallback)
         extraHeaders: {
            Authorization: `Bearer ${token}`,
         },
         // Connection options
         transports: ["websocket", "polling"],
         timeout: 20000,
         reconnection: true,
         reconnectionDelay: 1000,
         reconnectionAttempts: 5,
         forceNew: true,
      });

      // Connection event handlers
      newSocket.on("connect", () => {
         setIsConnected(true);
         setError(null);
      });

      newSocket.on("notification_connected", () => {
         // Request initial data
         newSocket.emit("getUnreadCount");
         newSocket.emit("getNotifications", { page: 1, limit: 50 });
      });

      newSocket.on("disconnect", () => {
         setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
         setError(`Connection failed: ${error.message}`);
         setIsConnected(false);
      });

      // Notification event handlers
      newSocket.on("newNotification", (data) => {
         const notification: Notification = {
            ...data.notification,
            type: data.notification.type || "system",
         };

         addNotification(notification);

         // Show toast for new notification
         // addToast("info", notification.title || "Thông báo mới", {
         //    description: notification.message,
         // });
      });

      newSocket.on("unreadCount", (data) => {
         setUnreadCount(data.count);
      });

      newSocket.on("notificationList", (data) => {
         const mappedNotifications = data.notifications.map((n: any) => ({
            ...n,
            type: n.type || n.data?.type || "system",
         }));
         setNotifications(mappedNotifications);
      });

      newSocket.on("notificationMarkedRead", (data) => {
         markNotificationAsRead(data.notificationId);
      });

      newSocket.on("allNotificationsMarkedRead", () => {
         markAllNotificationsAsRead();
      });

      newSocket.on("notificationDeleted", (data) => {
         removeNotification(data.notificationId);
      });

      newSocket.on("allNotificationsCleared", () => {
         clearNotifications();
      });

      // Error handlers
      newSocket.on("notification_error", (error) => {
         console.error("🚨 Notification error:", error);
         setError(error.message || "Notification error occurred");
      });

      setSocket(newSocket);

      // Cleanup function
      return () => {
         newSocket.disconnect();
         setSocket(null);
         setIsConnected(false);
      };
   }, [token, user]);

   // Update store when API data changes (fallback when socket not connected)
   useEffect(() => {
      if (notificationsData?.data?.notifications && !isConnected) {
         const mappedNotifications = notificationsData.data.notifications.map(
            (n: any) => ({
               ...n,
               type: n.type ?? n.data?.type ?? "system",
            })
         );
         setNotifications(mappedNotifications);
      }
   }, [notificationsData, setNotifications, isConnected]);

   // Helper functions
   const sendNotification = useCallback(
      (userId: string, data: { title: string; message: string }) => {
         if (socket?.connected) {
            socket.emit("sendNotification", { userId, ...data });
         }
      },
      [socket]
   );

   const handleMarkAsRead = useCallback(
      (notificationId: string) => {
         if (socket?.connected) {
            socket.emit("markNotificationRead", notificationId);
         } else {
            // Fallback to API call
            markAsReadMutation.mutate(notificationId);
         }
      },
      [socket, markAsReadMutation]
   );

   const handleMarkAllAsRead = useCallback(() => {
      if (socket?.connected) {
         socket.emit("markAllNotificationsRead");
      } else {
         // Fallback to API call
         markAllAsReadMutation.mutate();
      }
   }, [socket, markAllAsReadMutation]);

   const handleDeleteNotification = useCallback(
      (notificationId: string) => {
         if (socket?.connected) {
            socket.emit("deleteNotification", notificationId);
         } else {
            // Fallback to API call
            deleteNotificationMutation.mutate(notificationId);
         }
      },
      [socket, deleteNotificationMutation]
   );

   const handleClearAllNotifications = useCallback(() => {
      if (socket?.connected) {
         socket.emit("clearAllNotifications");
      } else {
         // Fallback to API call
         clearAllNotificationsMutation.mutate();
      }
   }, [socket, clearAllNotificationsMutation]);

   const getNotifications = useCallback(
      (page = 1, limit = 50) => {
         if (socket?.connected) {
            socket.emit("getNotifications", { page, limit });
         } else {
            // Fallback to refetch API
            refetchNotifications();
         }
      },
      [socket, refetchNotifications]
   );

   return {
      socket,
      isConnected,
      notifications: storeNotifications,
      unreadCount: storeUnreadCount,
      sendNotification,
      markAsRead: handleMarkAsRead,
      markAllAsRead: handleMarkAllAsRead,
      deleteNotification: handleDeleteNotification,
      clearAllNotifications: handleClearAllNotifications,
      getNotifications,
      error,
      isLoading: isLoadingNotifications && !isConnected,
      refetch: refetchNotifications,
      // Mutation states
      isMarkingAsRead: markAsReadMutation.isPending,
      isMarkingAllAsRead: markAllAsReadMutation.isPending,
      isDeletingNotification: deleteNotificationMutation.isPending,
      isClearingAll: clearAllNotificationsMutation.isPending,
   };
};
