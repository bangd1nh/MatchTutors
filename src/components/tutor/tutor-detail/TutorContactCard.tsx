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

  const createConversationMutation = useMutation({
    mutationFn: (userId: string) => chatApi.getOrCreateConversation(userId),
    onSuccess: (data) => {
      navigate(`/student/chat?conversationId=${data.data._id}`);
    },
    onError: (error) => {
      console.error("Lỗi tạo conversation:", error);
    },
  });

  const handleMessageClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const userId =
      typeof tutor.userId === "string" ? tutor.userId : tutor.userId._id;
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

  const handleUnlockContact = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowContactDetails(true);
  };

  return (
    <>
      {/* Pricing + primary actions */}
      <Card className="bg-card text-card-foreground border border-border shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 bg-muted">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl font-light tracking-tight text-foreground">
              {tutor.hourlyRate?.toLocaleString("vi-VN")}đ
            </CardTitle>
            <p className="text-sm text-muted-foreground">mỗi giờ học</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-6 pb-6">
          {user?.role === "STUDENT" && (
            <>
              <Button
                size="lg"
                disabled={isFullyBooked}
                className="w-full h-12 text-base font-medium"
                onClick={handleRequestClick}
              >
                <Send className="mr-2 h-4 w-4" />
                {isFullyBooked ? "Hết chỗ" : "Gửi yêu cầu học"}
              </Button>
              {isFullyBooked && (
                <p className="text-xs text-center text-destructive font-medium">
                  Gia sư này hiện tại đã hết chỗ
                </p>
              )}
            </>
          )}

          <Button
            size="lg"
            variant="outline"
            className="w-full h-12 text-base font-medium"
            onClick={handleMessageClick}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Nhắn tin
          </Button>
        </CardContent>
      </Card>

      {/* Teaching request dialog */}
      {isRequestDialogOpen && (
        <TeachingRequestDialog
          tutor={tutor}
          isOpen={isRequestDialogOpen}
          onClose={() => setIsRequestDialogOpen(false)}
        />
      )}

      {/* Contact Details */}
      <Card className="bg-card text-card-foreground border border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground">
            Thông tin liên hệ
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {showContactDetails
              ? "Thông tin liên hệ đầy đủ"
              : "Thông tin được bảo mật"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {!showContactDetails ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-card border border-border">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      Điện thoại
                    </span>
                  </div>
                  <span className="text-sm font-mono px-3 py-1 rounded-lg bg-card text-muted-foreground border border-border">
                    {maskContact(tutor.contact.phone, "phone")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-card border border-border">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      Email
                    </span>
                  </div>
                  <span className="text-sm font-mono px-3 py-1 rounded-lg bg-card text-muted-foreground border border-border">
                    {maskContact(tutor.contact.email, "email")}
                  </span>
                </div>
              </div>

              <Button onClick={handleUnlockContact} className="w-full h-11">
                <Lock className="w-4 h-4 mr-2" />
                Mở khóa thông tin liên hệ
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Đăng nhập để xem thông tin liên hệ đầy đủ
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Số điện thoại
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {tutor.contact.phone}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Địa chỉ email
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {tutor.contact.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowContactDetails(false)}
                className="w-full h-11"
              >
                <Lock className="w-4 h-4 mr-2" />
                Ẩn thông tin
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
