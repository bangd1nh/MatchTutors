import apiClient from "@/lib/api";

export interface Conversation {
   _id: string;
   participants: Array<{
      _id: string;
      name: string;
      email: string;
      avatarUrl?: string;
      role: string;
   }>;
   lastMessage?: {
      _id: string;
      content: string;
      sender: {
         _id: string;
         name: string;
         avatarUrl?: string;
      };
      createdAt: string;
      imageUrl?: string;
      imageUrls?: string[]; // Thêm array
   };
   lastMessageAt?: string;
   otherUser: {
      _id: string;
      name: string;
      email: string;
      avatarUrl?: string;
      role: string;
   };
}

export interface Message {
   _id: string;
   conversationId: string;
   sender: {
      _id: string;
      name: string;
      avatarUrl?: string;
      email: string;
      role: string;
   };
   content: string;
   imageUrl?: string;
   imageUrls?: string[]; // Thêm array
   isReadBy: string[];
   createdAt: string;
}

export const chatApi = {
   // Lấy danh sách conversations
   getConversations: async (page = 1, limit = 20) => {
      const { data } = await apiClient.get("/chat/conversations", {
         params: { page, limit },
      });
      return data;
   },

   // Lấy hoặc tạo conversation với user
   getOrCreateConversation: async (userId: string) => {
      const { data } = await apiClient.get(`/chat/conversations/${userId}`);
      return data;
   },

   // Lấy messages trong conversation
   getMessages: async (conversationId: string, page = 1, limit = 50) => {
      const { data } = await apiClient.get(
         `/chat/conversations/${conversationId}/messages`,
         {
            params: { page, limit },
         }
      );
      return data;
   },

   // Gửi message
   sendMessage: async (conversationId: string, content: string) => {
      const { data } = await apiClient.post(
         `/chat/conversations/${conversationId}/messages`,
         { content }
      );
      return data;
   },

   // Tìm kiếm conversations
   searchConversations: async (keyword: string) => {
      const { data } = await apiClient.get("/chat/search", {
         params: { keyword },
      });
      return data;
   },

   // Upload ảnh chat (single)
   uploadChatImage: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await apiClient.post("/chat/upload-image", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });
      return data;
   },

   // Upload nhiều ảnh chat (multiple)
   uploadChatImages: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
         formData.append("images", file);
      });

      const { data } = await apiClient.post("/chat/upload-images", formData, {
         headers: {
            "Content-Type": "multipart/form-data",
         },
      });
      return data;
   },
};
