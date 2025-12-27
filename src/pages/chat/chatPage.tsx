import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/store/useChatStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Conversation } from "@/api/chat";
import { chatApi } from "@/api/chat";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
      currentUserId,
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

   // Sort conversations: unread (other user's lastMessage not read by current user) first,
   // then by lastMessageAt desc.
   const sortedConversations = useMemo(() => {
      const isUnread = (conv: any) => {
         const lm = conv?.lastMessage;
         if (!lm) return false;
         if (!currentUserId) return false;
         const senderId = lm?.sender?._id || lm?.sender;
         if (!senderId) return false;
         if (String(senderId) === String(currentUserId)) return false; // own message
         const readBy = Array.isArray(lm?.isReadBy)
            ? lm.isReadBy.map(String)
            : [];
         return !readBy.includes(String(currentUserId));
      };

      return (filteredConversations || []).slice().sort((a: any, b: any) => {
         const aUnread = isUnread(a);
         const bUnread = isUnread(b);
         if (aUnread !== bUnread) return aUnread ? -1 : 1;
         const aTime = a?.lastMessageAt
            ? new Date(a.lastMessageAt).getTime()
            : 0;
         const bTime = b?.lastMessageAt
            ? new Date(b.lastMessageAt).getTime()
            : 0;
         return bTime - aTime;
      });
   }, [filteredConversations, currentUserId]);

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
         <div className="flex items-center justify-center h-screen bg-background">
            <div
               className="animate-spin rounded-full h-8 w-8 border-b-2"
               style={{ borderColor: "hsl(var(--primary))" }}
            />
         </div>
      );
   }

   return (
      <div className="flex h-[calc(100dvh-112px)] bg-background text-foreground">
         {/* Sidebar */}
         <aside className="w-72 border-r border-border bg-card text-card-foreground flex flex-col shadow-sm">
            <div className="p-5 border-b border-border">
               <h2 className="text-lg font-semibold mb-3 tracking-wide">
                  Tin nhắn
               </h2>
               <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                        placeholder="Tìm kiếm..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-11 py-2 bg-muted border border-border"
                     />
                  </div>
                  <Button
                     onClick={handleSearchClick}
                     disabled={!searchInput.trim()}
                     className="px-3 py-2"
                     size="sm"
                  >
                     Tìm
                  </Button>
                  {isSearching && (
                     <Button
                        onClick={handleClearSearch}
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        title="Xóa tìm kiếm"
                     >
                        <X className="h-4 w-4" />
                     </Button>
                  )}
               </div>
               {isSearching && (
                  <p className="text-xs text-muted-foreground mt-2">
                     Kết quả cho:{" "}
                     <span className="italic">"{searchInput}"</span>
                  </p>
               )}
            </div>

            <ScrollArea className="flex-1">
               {isFetching ? (
                  <div className="p-6 text-center text-muted-foreground">
                     <div
                        className="inline-block animate-spin rounded-full h-6 w-6 border-b-2"
                        style={{ borderColor: "hsl(var(--primary))" }}
                     />
                     <p className="mt-2 text-sm">Đang tìm kiếm...</p>
                  </div>
               ) : filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                     {isSearching
                        ? "Không tìm thấy cuộc trò chuyện nào"
                        : "Chưa có cuộc trò chuyện nào"}
                  </div>
               ) : (
                  sortedConversations.map((conv: any) => {
                     const lm = conv?.lastMessage;
                     const isConvUnread =
                        lm &&
                        currentUserId &&
                        String(lm?.sender?._id || lm?.sender) !==
                           String(currentUserId) &&
                        !(lm?.isReadBy || [])
                           .map(String)
                           .includes(String(currentUserId));

                     return (
                        <div
                           key={conv._id}
                           className={`flex items-center gap-3 p-3 hover:bg-accent/50 cursor-pointer ${
                              isConvUnread ? "bg-accent/20" : ""
                           }`}
                           onClick={() => setActiveConversation(conv._id)}
                        >
                           <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage
                                 src={conv.otherUser?.avatarUrl}
                                 alt={
                                    conv.otherUser?.name ||
                                    conv.otherUser?.email
                                 }
                              />
                              <AvatarFallback>
                                 {(
                                    conv.otherUser?.name ||
                                    conv.otherUser?.email ||
                                    "?"
                                 )
                                    .charAt(0)
                                    .toUpperCase()}
                              </AvatarFallback>
                           </Avatar>

                           <div className="flex-1">
                              <div className="flex justify-between items-center">
                                 <p
                                    className={` ${
                                       isConvUnread
                                          ? "font-semibold"
                                          : "font-medium"
                                    }`}
                                 >
                                    {conv.otherUser?.name ||
                                       conv.otherUser?.email}
                                 </p>
                                 <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(
                                       new Date(
                                          conv.lastMessageAt ||
                                             conv.updatedAt ||
                                             Date.now()
                                       ),
                                       {
                                          addSuffix: true,
                                          locale: vi,
                                       }
                                    )}
                                 </p>
                              </div>
                              <p
                                 className={`text-sm truncate ${
                                    isConvUnread
                                       ? "font-semibold"
                                       : "text-muted-foreground"
                                 }`}
                              >
                                 {conv.lastMessage?.content || ""}
                              </p>
                           </div>
                        </div>
                     );
                  })
               )}
            </ScrollArea>
         </aside>

         {/* Chat Area */}
         <main className="flex-1 flex flex-col">
            {activeConversation ? (
               <>
                  {/* Header */}
                  <div className="border-b border-border p-4 bg-card text-card-foreground flex items-center gap-3 sticky top-0 z-10">
                     <Avatar className="h-12 w-12">
                        <AvatarImage
                           src={activeConversation?.otherUser?.avatarUrl}
                           alt={
                              activeConversation?.otherUser?.name ||
                              activeConversation?.otherUser?.email
                           }
                        />
                        <AvatarFallback>
                           {(
                              activeConversation?.otherUser?.name ||
                              activeConversation?.otherUser?.email ||
                              "?"
                           )
                              .charAt(0)
                              .toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <h2 className="text-base font-semibold text-foreground">
                           {activeConversation?.otherUser?.name ||
                              activeConversation?.otherUser?.email ||
                              "Chat"}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                           {activeConversation?.otherUser?.role === "TUTOR"
                              ? "Gia sư"
                              : "Học sinh"}
                        </p>
                     </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                     {loadingMessages ? (
                        <div className="flex justify-center items-center h-full">
                           <span className="text-muted-foreground">
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

                           // Kiểm tra đã seen bởi người kia chưa
                           const isSeen =
                              isOwn &&
                              Array.isArray(msg.isReadBy) &&
                              msg.isReadBy
                                 .map(String)
                                 .includes(
                                    String(activeConversation?.otherUser?._id)
                                 );

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
                                          alt={
                                             msg.sender?.name ||
                                             msg.sender?.email
                                          }
                                       />
                                       <AvatarFallback>
                                          {(
                                             msg.sender?.name ||
                                             msg.sender?.email ||
                                             "?"
                                          )
                                             .charAt(0)
                                             .toUpperCase()}
                                       </AvatarFallback>
                                    </Avatar>
                                 )}

                                 <div
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                                       isOwn
                                          ? "bg-primary text-primary-foreground rounded-br-none"
                                          : "bg-card text-card-foreground rounded-bl-none border border-border"
                                    }`}
                                 >
                                    <p className="text-sm leading-relaxed break-words">
                                       {msg.content}
                                    </p>
                                    <div className="flex items-center gap-2">
                                       <p
                                          className={`text-xs mt-2 ${
                                             isOwn
                                                ? "text-primary-foreground/70"
                                                : "text-muted-foreground"
                                          }`}
                                       >
                                          {formatMessageTime(msg.createdAt)}
                                       </p>

                                       {isOwn && isSeen && (
                                          <span className="text-xs mt-2 text-muted-foreground italic">
                                             Đã xem
                                          </span>
                                       )}
                                    </div>
                                 </div>

                                 {isOwn && (
                                    <Avatar className="h-9 w-9 flex-shrink-0 mt-1">
                                       <AvatarImage
                                          src={msg.sender?.avatarUrl}
                                          alt={
                                             msg.sender?.name ||
                                             msg.sender?.email
                                          }
                                       />
                                       <AvatarFallback>
                                          {(
                                             msg.sender?.name ||
                                             msg.sender?.email ||
                                             "?"
                                          )
                                             .charAt(0)
                                             .toUpperCase()}
                                       </AvatarFallback>
                                    </Avatar>
                                 )}
                              </div>
                           );
                        })
                     ) : (
                        <div className="flex justify-center items-center h-full">
                           <span className="text-muted-foreground">
                              Không có tin nhắn nào
                           </span>
                        </div>
                     )}
                     <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form
                     onSubmit={handleSendMessage}
                     className="border-t border-border p-4 bg-card text-card-foreground flex items-center gap-3"
                  >
                     <Input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-4 py-3 rounded-full bg-muted border border-border"
                        disabled={sendingMessage}
                     />
                     <Button
                        type="submit"
                        disabled={sendingMessage || !messageInput.trim()}
                        className="rounded-full"
                     >
                        <Send className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                           {sendingMessage ? "Đang gửi..." : "Gửi"}
                        </span>
                     </Button>
                  </form>
               </>
            ) : (
               <div className="flex-1 flex items-center justify-center bg-background">
                  <div className="text-center">
                     <h3 className="text-lg font-medium text-foreground">
                        Chọn một cuộc trò chuyện
                     </h3>
                     <p className="text-sm text-muted-foreground mt-2">
                        Bắt đầu cuộc trò chuyện với học sinh hoặc gia sư
                     </p>
                  </div>
               </div>
            )}
         </main>
      </div>
   );
}
