import { create } from "zustand";
import type { Conversation, Message } from "@/api/chat";

interface ChatState {
   conversations: Conversation[];
   activeConversationId: string | null;
   messages: Record<string, Message[]>;
   unreadCount: number;

   setConversations: (conversations: Conversation[]) => void;
   addConversation: (conversation: Conversation) => void;
   updateConversation: (
      conversationId: string,
      updates: Partial<Conversation>
   ) => void;

   setActiveConversation: (conversationId: string | null) => void;

   setMessages: (conversationId: string, messages: Message[]) => void;
   addMessage: (conversationId: string, message: Message) => void;
   prependMessages: (conversationId: string, messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
   conversations: [],
   activeConversationId: null,
   messages: {},
   unreadCount: 0,

   setConversations: (conversations) => {
      set({ conversations });
   },

   addConversation: (conversation) => {
      set((state) => ({
         conversations: [conversation, ...state.conversations],
      }));
   },

   updateConversation: (conversationId, updates) => {
      set((state) => ({
         conversations: state.conversations.map((conv) =>
            conv._id === conversationId ? { ...conv, ...updates } : conv
         ),
      }));
   },

   setActiveConversation: (conversationId) => {
      set({ activeConversationId: conversationId });
   },

   setMessages: (conversationId, messages) => {
      set((state) => ({
         messages: {
            ...state.messages,
            [conversationId]: messages,
         },
      }));
   },

   addMessage: (conversationId, message) => {
      set((state) => ({
         messages: {
            ...state.messages,
            [conversationId]: [
               ...(state.messages[conversationId] || []),
               message,
            ],
         },
      }));
   },

   prependMessages: (conversationId, messages) => {
      set((state) => ({
         messages: {
            ...state.messages,
            [conversationId]: [
               ...messages,
               ...(state.messages[conversationId] || []),
            ],
         },
      }));
   },
}));
