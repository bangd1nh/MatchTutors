import { useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { chatApi, type Message } from "@/api/chat";
import { useSocket } from "./useSocket";
import { useChatStore } from "@/store/useChatStore";

export const useChat = () => {
   const socket = useSocket("chat");
   const queryClient = useQueryClient();

   const {
      conversations,
      activeConversationId,
      messages,
      setConversations,
      updateConversation,
      setMessages,
      addMessage,
   } = useChatStore();

   // decode current user id from JWT token (client-side)
   const currentUserId = useMemo(() => {
      try {
         const token = localStorage.getItem("token");
         if (!token) return null;
         const raw = token.split(".")[1];
         if (!raw) return null;
         const payload = JSON.parse(atob(raw));
         return payload.id || payload.userId || payload._id || null;
      } catch {
         return null;
      }
   }, []);

   // Lấy danh sách conversations
   const { data: conversationsData, isLoading: loadingConversations } =
      useQuery({
         queryKey: ["conversations"],
         queryFn: () => chatApi.getConversations(),
         refetchOnWindowFocus: false,
      });

   useEffect(() => {
      if (conversationsData?.data) {
         setConversations(conversationsData.data);
      }
   }, [conversationsData, setConversations]);

   // Lấy messages của conversation hiện tại
   const { data: messagesData, isLoading: loadingMessages } = useQuery({
      queryKey: ["messages", activeConversationId],
      queryFn: () =>
         activeConversationId
            ? chatApi.getMessages(activeConversationId)
            : null,
      enabled: !!activeConversationId,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
   });

   useEffect(() => {
      if (messagesData?.data && activeConversationId) {
         setMessages(activeConversationId, messagesData.data);
      }
   }, [messagesData, activeConversationId, setMessages]);

   // Join/leave rooms
   useEffect(() => {
      if (!socket || !activeConversationId) return;

      socket.emit("joinChat", activeConversationId);

      return () => {
         socket.emit("leaveChat", activeConversationId);
      };
   }, [socket, activeConversationId]);

   // Socket listeners
   useEffect(() => {
      if (!socket) return;

      const handleNewMessage = ({
         message,
         chat,
      }: {
         message: Message;
         chat: string;
      }) => {
         addMessage(chat, message);
         updateConversation(chat, {
            lastMessage: message,
            lastMessageAt: message.createdAt,
         });

         // Only mark read automatically if incoming message is from the other user (not self)
         if (
            chat === activeConversationId &&
            message?.sender &&
            currentUserId &&
            String(message.sender._id) !== String(currentUserId)
         ) {
            try {
               socket.emit("markRead", {
                  chatId: chat,
                  messageIds: [message._id],
               });
            } catch (e) {
               // ignore
            }
         }
      };

      const handleMessagesRead = (payload: {
         chatId: string;
         userId: string;
         messageIds: string[];
         messages?: Message[];
      }) => {
         // If server returns full updated messages, MERGE them into existing messages (don't replace)
         if (payload?.messages && payload.chatId) {
            const current = messages[payload.chatId] || [];
            const updatedMap: Record<string, Message> = {};
            payload.messages.forEach((m) => {
               updatedMap[String((m as any)._id)] = m;
            });

            // merge keeping original order, replace items that are present in updatedMap
            const merged = current.map(
               (m) => updatedMap[String((m as any)._id)] ?? m
            );

            // append any updated messages not present in current
            payload.messages.forEach((m) => {
               const exists = current.find(
                  (c) => String((c as any)._id) === String((m as any)._id)
               );
               if (!exists) merged.push(m);
            });

            setMessages(payload.chatId, merged);
         } else if (payload?.chatId && payload?.messageIds) {
            // fallback: cập nhật isReadBy trong messages hiện tại
            const current = messages[payload.chatId] || [];
            if (current.length > 0) {
               const updated = current.map((m) => {
                  if (payload.messageIds.includes(String((m as any)._id))) {
                     const isReadBy = Array.isArray((m as any).isReadBy)
                        ? [...(m as any).isReadBy]
                        : [];
                     if (
                        !isReadBy.map(String).includes(String(payload.userId))
                     ) {
                        isReadBy.push(payload.userId);
                     }
                     return { ...(m as any), isReadBy };
                  }
                  return m;
               });
               setMessages(payload.chatId, updated);
            }
         }
      };

      socket.on("newMessage", handleNewMessage);
      socket.on("messagesRead", handleMessagesRead);

      return () => {
         socket.off("newMessage", handleNewMessage);
         socket.off("messagesRead", handleMessagesRead);
      };
   }, [
      socket,
      addMessage,
      updateConversation,
      queryClient,
      activeConversationId,
      messages,
      setMessages,
      currentUserId,
   ]);

   const sendMessage = useCallback(
      (content: string, imageUrls?: string[]) => {
         if (!socket || !activeConversationId) {
            console.warn("❌ Cannot send message");
            return;
         }

         // Phải có ít nhất content hoặc imageUrls
         if (!content.trim() && (!imageUrls || imageUrls.length === 0)) {
            console.warn("❌ Message must contain text or image");
            return;
         }

         socket.emit("sendMessage", {
            chatId: activeConversationId,
            content: content.trim() || undefined,
            imageUrls:
               imageUrls && imageUrls.length > 0 ? imageUrls : undefined,
         });
      },
      [socket, activeConversationId]
   );

   // Upload nhiều ảnh mutation
   const uploadImagesMutation = useMutation({
      mutationFn: (files: File[]) => chatApi.uploadChatImages(files),
      onError: (error) => {
         console.error("Upload images error:", error);
      },
   });

   // When user opens a conversation, mark all messages as read for that chat
   useEffect(() => {
      if (!socket || !activeConversationId) return;

      try {
         socket.emit("markRead", { chatId: activeConversationId });
      } catch (e) {
         // ignore
      }
   }, [socket, activeConversationId]);

   // Thêm hook để search conversations
   const searchConversations = useCallback(
      (keyword: string) => {
         if (!keyword.trim()) {
            setConversations(conversationsData?.data || []);
            return;
         }
         return chatApi.searchConversations(keyword);
      },
      [conversationsData, setConversations]
   );

   return {
      conversations,
      activeConversationId,
      messages: activeConversationId
         ? messages[activeConversationId] || []
         : [],
      loadingConversations,
      loadingMessages,
      sendMessage,
      sendingMessage: false,
      searchConversations,
      currentUserId,
      uploadImages: uploadImagesMutation.mutateAsync,
      uploadingImages: uploadImagesMutation.isPending,
   };
};
