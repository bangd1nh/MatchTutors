import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/store/useChatStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Conversation } from "@/api/chat";
import { chatApi } from "@/api/chat";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function ChatPage() {
   const [searchParams] = useSearchParams();

   const {
      conversations,
      activeConversationId,
      messages,
      loadingConversations,
      loadingMessages,
      sendMessage,
      sendingMessage,
      searchConversations,
   } = useChat();

   const { setActiveConversation } = useChatStore();
   const [messageInput, setMessageInput] = useState("");
   const [searchInput, setSearchInput] = useState("");
   const [searchQuery, setSearchQuery] = useState("");
   const [isSearching, setIsSearching] = useState(false);
   const [hasCreatedConversation, setHasCreatedConversation] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   // Xử lý userId từ URL params
   const conversationIdParam = searchParams.get("conversationId");
   const userIdParam = searchParams.get("userId");

   // Thêm mutation để tạo conversation
   const createConversationMutation = useMutation({
      mutationFn: (userId: string) => chatApi.getOrCreateConversation(userId),
      onSuccess: (data) => {
         setActiveConversation(data.data._id);
      },
      onError: (error) => {
         console.error("Lỗi tạo conversation:", error);
      },
   });

   // Search conversations - chỉ khi có searchQuery
   const { data: searchResults, isFetching } = useQuery({
      queryKey: ["searchConversations", searchQuery],
      queryFn: () => searchConversations(searchQuery),
      enabled: searchQuery.trim().length > 0,
      refetchOnWindowFocus: false,
   });

   useEffect(() => {
      // Nếu có conversationId từ URL, set activeConversationId ngay
      if (conversationIdParam && !activeConversationId) {
         setActiveConversation(conversationIdParam);
      } else if (
         userIdParam &&
         !activeConversationId &&
         !hasCreatedConversation
      ) {
         // Fallback: Tạo nếu chỉ có userId (cho trường hợp cũ)
         setHasCreatedConversation(true);
         createConversationMutation.mutate(userIdParam);
      }
   }, [
      conversationIdParam,
      userIdParam,
      activeConversationId,
      hasCreatedConversation,
      createConversationMutation,
   ]);

   // Auto scroll to bottom
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   const activeConversation = conversations.find(
      (c) => c._id === activeConversationId
   );

   // Use search results if available
   const filteredConversations: Conversation[] = isSearching
      ? searchResults?.data || []
      : conversations;

   const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!messageInput.trim() || sendingMessage) return;

      sendMessage(messageInput);
      setMessageInput("");
   };

   const handleSearchClick = () => {
      if (searchInput.trim()) {
         setSearchQuery(searchInput);
         setIsSearching(true);
      }
   };

   const handleClearSearch = () => {
      setSearchInput("");
      setSearchQuery("");
      setIsSearching(false);
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         handleSearchClick();
      }
   };

   const formatMessageTime = (date: string) => {
      return formatDistanceToNow(new Date(date), {
         addSuffix: true,
         locale: vi,
      });
   };

   if (loadingConversations) {
      return (
         <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600" />
         </div>
      );
   }

   return (
      <div className="flex h-screen bg-[#FBFBFA] text-gray-800">
         {/* Sidebar */}
         <aside className="w-72 border-r border-gray-100 bg-white flex flex-col shadow-sm">
            <div className="p-5 border-b border-gray-100">
               <h2 className="text-lg font-semibold mb-3 tracking-wide">
                  Tin nhắn
               </h2>
               <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                     <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     <Input
                        placeholder="Tìm kiếm..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-11 py-2 bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-blue-100"
                     />
                  </div>
                  <button
                     onClick={handleSearchClick}
                     disabled={!searchInput.trim()}
                     className="flex items-center gap-2 px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                     Tìm
                  </button>
                  {isSearching && (
                     <button
                        onClick={handleClearSearch}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Xóa tìm kiếm"
                     >
                        <X className="h-4 w-4" />
                     </button>
                  )}
               </div>
               {isSearching && (
                  <p className="text-xs text-gray-500 mt-2">
                     Kết quả cho:{" "}
                     <span className="italic">"{searchInput}"</span>
                  </p>
               )}
            </div>

            <ScrollArea className="flex-1">
               {isFetching ? (
                  <div className="p-6 text-center text-gray-500">
                     <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-sky-400" />
                     <p className="mt-2 text-sm">Đang tìm kiếm...</p>
                  </div>
               ) : filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                     {isSearching
                        ? "Không tìm thấy cuộc trò chuyện nào"
                        : "Chưa có cuộc trò chuyện nào"}
                  </div>
               ) : (
                  filteredConversations.map((conv: Conversation) => (
                     <button
                        key={conv._id}
                        onClick={() => setActiveConversation(conv._id)}
                        className={`w-full text-left p-4 border-b border-gray-50 flex gap-3 items-start hover:bg-[#F7FAFC] transition-colors ${
                           activeConversationId === conv._id
                              ? "bg-[#F0F8FF]"
                              : "bg-white"
                        }`}
                     >
                        <Avatar className="h-10 w-10 flex-shrink-0">
                           <AvatarImage
                              src={conv.otherUser.avatarUrl}
                              alt={conv.otherUser.name}
                           />
                           <AvatarFallback>
                              {conv.otherUser.name.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-sm truncate">
                                 {conv.otherUser.name}
                              </p>
                              {conv.lastMessage && (
                                 <span className="text-xs text-gray-400">
                                    {formatMessageTime(
                                       conv.lastMessage.createdAt
                                    )}
                                 </span>
                              )}
                           </div>
                           <div className="flex items-center justify-between gap-3">
                              <p className="text-xs text-gray-500 truncate">
                                 {conv.lastMessage
                                    ? conv.lastMessage.content
                                    : conv.otherUser.role === "TUTOR"
                                    ? "Gia sư"
                                    : "Học sinh"}
                              </p>
                           </div>
                        </div>
                     </button>
                  ))
               )}
            </ScrollArea>
         </aside>

         {/* Chat Area */}
         <main className="flex-1 flex flex-col">
            {activeConversation ? (
               <>
                  {/* Header */}
                  <div className="border-b border-gray-100 p-4 bg-white flex items-center gap-3 sticky top-0 z-10">
                     <Avatar className="h-12 w-12">
                        <AvatarImage
                           src={activeConversation?.otherUser?.avatarUrl}
                           alt={activeConversation?.otherUser?.name}
                        />
                        <AvatarFallback>
                           {activeConversation?.otherUser?.name?.charAt(0)}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <h2 className="text-base font-semibold text-gray-900">
                           {activeConversation?.otherUser?.name || "Chat"}
                        </h2>
                        <p className="text-xs text-gray-500">
                           {activeConversation?.otherUser?.role === "TUTOR"
                              ? "Gia sư"
                              : "Học sinh"}
                        </p>
                     </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FBFBFA]">
                     {loadingMessages ? (
                        <div className="flex justify-center items-center h-full">
                           <span className="text-gray-500">
                              Đang tải tin nhắn...
                           </span>
                        </div>
                     ) : messages && messages.length > 0 ? (
                        messages.map((msg) => {
                           if (!msg || !msg._id || !msg.sender) {
                              return null;
                           }

                           const isOwn =
                              msg.sender?._id !==
                              activeConversation?.otherUser?._id;

                           return (
                              <div
                                 key={msg._id}
                                 className={`flex gap-3 ${
                                    isOwn ? "justify-end" : "justify-start"
                                 }`}
                              >
                                 {!isOwn && (
                                    <Avatar className="h-9 w-9 flex-shrink-0 mt-1">
                                       <AvatarImage
                                          src={msg.sender?.avatarUrl}
                                          alt={msg.sender?.name}
                                       />
                                       <AvatarFallback>
                                          {msg.sender?.name?.charAt(0)}
                                       </AvatarFallback>
                                    </Avatar>
                                 )}

                                 <div
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                                       isOwn
                                          ? "bg-sky-600 text-white rounded-br-none"
                                          : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
                                    }`}
                                 >
                                    <p className="text-sm leading-relaxed break-words">
                                       {msg.content}
                                    </p>
                                    <p
                                       className={`text-xs mt-2 ${
                                          isOwn
                                             ? "text-sky-100"
                                             : "text-gray-400"
                                       }`}
                                    >
                                       {formatMessageTime(msg.createdAt)}
                                    </p>
                                 </div>

                                 {isOwn && (
                                    <Avatar className="h-9 w-9 flex-shrink-0 mt-1">
                                       <AvatarImage
                                          src={msg.sender?.avatarUrl}
                                          alt={msg.sender?.name}
                                       />
                                       <AvatarFallback>
                                          {msg.sender?.name?.charAt(0)}
                                       </AvatarFallback>
                                    </Avatar>
                                 )}
                              </div>
                           );
                        })
                     ) : (
                        <div className="flex justify-center items-center h-full">
                           <span className="text-gray-500">
                              Không có tin nhắn nào
                           </span>
                        </div>
                     )}
                     <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form
                     onSubmit={handleSendMessage}
                     className="border-t border-gray-100 p-4 bg-white flex items-center gap-3"
                  >
                     <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-4 py-3 border border-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-100 bg-gray-50"
                        disabled={sendingMessage}
                     />
                     <button
                        type="submit"
                        disabled={sendingMessage || !messageInput.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:opacity-50 transition-colors"
                     >
                        <Send className="h-4 w-4" />
                        <span className="text-sm">
                           {sendingMessage ? "Đang gửi..." : "Gửi"}
                        </span>
                     </button>
                  </form>
               </>
            ) : (
               <div className="flex-1 flex items-center justify-center bg-[#FBFBFA]">
                  <div className="text-center">
                     <h3 className="text-lg font-medium text-gray-700">
                        Chọn một cuộc trò chuyện
                     </h3>
                     <p className="text-sm text-gray-500 mt-2">
                        Bắt đầu cuộc trò chuyện với học sinh hoặc gia sư
                     </p>
                  </div>
               </div>
            )}
         </main>
      </div>
   );
}
