import { useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi, type Message } from "@/api/chat";
import { useSocket } from "./useSocket";
import { useChatStore } from "@/store/useChatStore";

export const useChat = () => {
   const socket = useSocket();
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
      retry: false, //  Không retry khi lỗi
      staleTime: 5 * 60 * 1000,
   });

   useEffect(() => {
      if (messagesData?.data && activeConversationId) {
         setMessages(activeConversationId, messagesData.data);
      }
   }, [messagesData, activeConversationId, setMessages]);

   // Join conversation room khi active conversation thay đổi
   useEffect(() => {
      if (!socket || !activeConversationId) return;

      console.log(`📍 Joining chat room: ${activeConversationId}`);
      socket.emit("joinChat", activeConversationId);

      return () => {
         console.log(`📍 Leaving chat room: ${activeConversationId}`);
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
         console.log("📬 New message received in chat:", chat);

         addMessage(chat, message);
         updateConversation(chat, {
            lastMessage: message,
            lastMessageAt: message.createdAt,
         });

         // Xóa để tránh gọi API không cần thiết
         // queryClient.invalidateQueries({
         //    queryKey: ["conversations"],
         // });
      };

      socket.on("newMessage", handleNewMessage);

      return () => {
         socket.off("newMessage", handleNewMessage);
      };
   }, [socket, addMessage, updateConversation, queryClient]);

   const sendMessage = useCallback(
      (content: string) => {
         if (!socket || !activeConversationId || !content.trim()) {
            console.warn("❌ Cannot send message");
            return;
         }

         console.log("📤 Sending message via socket to:", activeConversationId);
         socket.emit("sendMessage", {
            chatId: activeConversationId,
            content: content.trim(),
         });
      },
      [socket, activeConversationId]
   );

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
   };
};
