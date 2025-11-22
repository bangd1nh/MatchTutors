import { useNotification } from "@/hooks/useNotification";
import { Bell, Trash2, CheckCheck, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Popover,
   PopoverTrigger,
   PopoverContent,
} from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useState, useEffect } from "react";

const NotificationBell = () => {
   const {
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAllNotifications,
      getNotifications,
      isLoading,
      isMarkingAllAsRead,
      isClearingAll,
      isConnected,
   } = useNotification();

   const [isOpen, setIsOpen] = useState(false);

   // Load notifications when connected or popover opens
   useEffect(() => {
      if (isConnected || isOpen) {
         getNotifications(1, 50);
      }
   }, [isConnected, isOpen, getNotifications]);

   const handleMarkAsRead = (notificationId: string, isRead: boolean) => {
      if (!isRead) {
         markAsRead(notificationId);
      }
   };

   const handleMarkAllAsRead = () => {
      if (unreadCount > 0) {
         markAllAsRead();
      }
   };

   const handleClearAll = () => {
      clearAllNotifications();
      setIsOpen(false);
   };

   return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
         <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
               <Bell className="h-5 w-5" />
               {unreadCount > 0 && (
                  <Badge
                     variant="destructive"
                     className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                     {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
               )}
               {/* Socket connection indicator */}
               <div
                  className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
                     isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
               />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b bg-muted/50">
               <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                     {unreadCount > 0 && (
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={handleMarkAllAsRead}
                           disabled={isMarkingAllAsRead}
                           className="h-8 px-2"
                           title="Đánh dấu tất cả đã đọc"
                        >
                           {isMarkingAllAsRead ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                           ) : (
                              <CheckCheck className="h-3 w-3" />
                           )}
                        </Button>
                     )}
                     {notifications.length > 0 && (
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={handleClearAll}
                           disabled={isClearingAll}
                           className="h-8 px-2 text-red-600 hover:text-red-700"
                           title="Xóa tất cả thông báo"
                        >
                           {isClearingAll ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                           ) : (
                              <Trash2 className="h-3 w-3" />
                           )}
                        </Button>
                     )}
                  </div>
               </div>
               {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                     {unreadCount} thông báo chưa đọc
                  </p>
               )}
            </div>

            <ScrollArea className="h-96">
               {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                     <Loader2 className="h-6 w-6 animate-spin" />
                     <span className="ml-2 text-sm text-muted-foreground">
                        Đang tải...
                     </span>
                  </div>
               ) : notifications.length > 0 ? (
                  <div className="divide-y">
                     {notifications.map((notification) => (
                        <div
                           key={notification._id}
                           className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors group ${
                              !notification.isRead
                                 ? "bg-blue-50 dark:bg-blue-950/30"
                                 : ""
                           }`}
                           onClick={() =>
                              handleMarkAsRead(
                                 notification._id,
                                 notification.isRead
                              )
                           }
                        >
                           <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                       <h4
                                          className={`text-sm font-medium line-clamp-1 ${
                                             !notification.isRead
                                                ? "text-blue-900 dark:text-blue-100"
                                                : ""
                                          }`}
                                       >
                                          {notification.title}
                                       </h4>
                                       <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                          {notification.message}
                                       </p>
                                       <p className="text-xs text-muted-foreground mt-1">
                                          {formatDistanceToNow(
                                             new Date(notification.createdAt),
                                             {
                                                addSuffix: true,
                                                locale: vi,
                                             }
                                          )}
                                       </p>
                                    </div>

                                    <div className="flex items-center gap-1 flex-shrink-0">
                                       {!notification.isRead && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                       )}
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             deleteNotification(
                                                notification._id
                                             );
                                          }}
                                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                                          title="Xóa thông báo"
                                       >
                                          <Trash2 className="h-3 w-3" />
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                     <Bell className="h-12 w-12 text-muted-foreground mb-3" />
                     <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Không có thông báo
                     </h4>
                     <p className="text-xs text-muted-foreground">
                        Thông báo mới sẽ xuất hiện ở đây
                     </p>
                  </div>
               )}
            </ScrollArea>
         </PopoverContent>
      </Popover>
   );
};

export default NotificationBell;
