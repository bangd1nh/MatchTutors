import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   DollarSign,
   Send,
   Phone,
   Mail,
   Lock,
   Copy,
   MessageCircle,
} from "lucide-react";
import type { Tutor } from "@/types/tutorListandDetail";
import { useUser } from "@/hooks/useUser";
import { TeachingRequestDialog } from "./TeachingRequestDialog";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { chatApi } from "@/api/chat";

interface TutorContactCardProps {
   tutor: Tutor;
}

export function TutorContactCard({ tutor }: TutorContactCardProps) {
   const { user, isAuthenticated } = useUser();
   const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
   const [showContactDetails, setShowContactDetails] = useState(false);
   const navigate = useNavigate();

   const isFullyBooked = tutor.maxStudents === 0;

   const handleRequestClick = () => {
      if (!isAuthenticated) {
         navigate("/login");
         return;
      }
      if (user?.role === "STUDENT") {
         setIsRequestDialogOpen(true);
      }
   };

   // Thêm mutation để tạo conversation
   const createConversationMutation = useMutation({
      mutationFn: (userId: string) => chatApi.getOrCreateConversation(userId),
      onSuccess: (data) => {
         // Navigate với conversationId thay vì userId
         navigate(`/student/chat?conversationId=${data.data._id}`);
      },
      onError: (error) => {
         console.error("Lỗi tạo conversation:", error);
         // Có thể hiển thị toast lỗi nếu cần
      },
   });

   // Thêm handler cho nút nhắn tin
   const handleMessageClick = () => {
      if (!isAuthenticated) {
         navigate("/login");
         return;
      }
      const userId =
         typeof tutor.userId === "string" ? tutor.userId : tutor.userId._id;
      // Gọi mutation để tạo conversation trước
      createConversationMutation.mutate(userId);
   };

   const maskContact = (contact: string, type: "phone" | "email"): string => {
      if (type === "phone") {
         const digitsOnly = contact.replace(/\D/g, "");

         if (digitsOnly.length <= 7) {
            return `${digitsOnly.slice(0, 3)}****`;
         } else {
            return `${digitsOnly.slice(0, 3)}****${digitsOnly.slice(-3)}`;
         }
      }

      const [local, domain] = contact.split("@");
      if (!local || !domain) return "****@****";
      return `${local.slice(0, 2)}****@${domain}`;
   };

   return (
      <>
         <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
               <div className="space-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-2">
                     <DollarSign className="h-8 w-8 text-gray-700" />
                  </div>
                  <CardTitle className="text-3xl font-light text-gray-900 tracking-tight">
                     {tutor.hourlyRate?.toLocaleString("vi-VN")}đ
                  </CardTitle>
                  <p className="text-sm text-gray-600">mỗi giờ học</p>
               </div>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
               {/* Chỉ hiển thị nút này cho Student */}
               {user?.role === "STUDENT" && (
                  <>
                     <Button
                        size="lg"
                        disabled={isFullyBooked}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white border-0 h-12 text-base font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={handleRequestClick}
                        title={
                           isFullyBooked ? "Gia sư này hiện tại đã hết chỗ" : ""
                        }
                     >
                        <Send className="mr-2 h-4 w-4" />
                        {isFullyBooked ? "Hết chỗ" : "Gửi yêu cầu học"}
                     </Button>
                     {isFullyBooked && (
                        <p className="text-xs text-center text-red-500 font-medium">
                           Gia sư này hiện tại đã hết chỗ
                        </p>
                     )}
                  </>
               )}

               <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 h-12 text-base font-medium"
                  onClick={handleMessageClick}
               >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Nhắn tin
               </Button>
            </CardContent>
         </Card>

         {/* Dialog sẽ được render khi isRequestDialogOpen là true */}
         {isRequestDialogOpen && (
            <TeachingRequestDialog
               tutor={tutor}
               isOpen={isRequestDialogOpen}
               onClose={() => setIsRequestDialogOpen(false)}
            />
         )}

         {/* Contact Details */}
         <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
               <CardTitle className="text-lg font-medium text-gray-900">
                  Thông tin liên hệ
               </CardTitle>
               <p className="text-sm text-gray-600 mt-1">
                  {showContactDetails
                     ? "Thông tin liên hệ đầy đủ"
                     : "Thông tin được bảo mật"}
               </p>
            </CardHeader>

            <CardContent className="space-y-4">
               {!showContactDetails ? (
                  <div className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                 <Phone className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                 Điện thoại
                              </span>
                           </div>
                           <span className="text-sm font-mono bg-white px-3 py-1 rounded-lg text-gray-600 border">
                              {maskContact(tutor.contact.phone, "phone")}
                           </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                 <Mail className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                 Email
                              </span>
                           </div>
                           <span className="text-sm font-mono bg-white px-3 py-1 rounded-lg text-gray-600 border">
                              {maskContact(tutor.contact.email, "email")}
                           </span>
                        </div>
                     </div>

                     <Button
                        onClick={() => setShowContactDetails(true)}
                        className="w-full bg-sky-600 hover:bg-sky-700 text-white border-0 h-11"
                     >
                        <Lock className="w-4 h-4 mr-2" />
                        Mở khóa thông tin liên hệ
                     </Button>

                     <p className="text-xs text-center text-gray-500">
                        Đăng nhập để xem thông tin liên hệ đầy đủ
                     </p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded-xl">
                           <div className="flex items-center gap-2 mb-2">
                              <Phone className="w-4 h-4 text-gray-700" />
                              <span className="text-sm font-medium text-gray-700">
                                 Số điện thoại
                              </span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                 {tutor.contact.phone}
                              </span>
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 px-2 hover:bg-gray-200 rounded-lg"
                              >
                                 <Copy className="w-4 h-4 text-gray-500" />
                              </Button>
                           </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl">
                           <div className="flex items-center gap-2 mb-2">
                              <Mail className="w-4 h-4 text-gray-700" />
                              <span className="text-sm font-medium text-gray-700">
                                 Địa chỉ email
                              </span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                 {tutor.contact.email}
                              </span>
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 px-2 hover:bg-gray-200 rounded-lg"
                              >
                                 <Copy className="w-4 h-4 text-gray-500" />
                              </Button>
                           </div>
                        </div>
                     </div>

                     <Button
                        variant="outline"
                        onClick={() => setShowContactDetails(false)}
                        className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 h-11"
                     >
                        <Lock className="w-4 h-4 mr-2 text-gray-500" />
                        Ẩn thông tin
                     </Button>
                  </div>
               )}
            </CardContent>
         </Card>
      </>
   );
}
