import { Star, Calendar, BookOpen, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import type { Review } from "@/types/review";
import { getLevelLabelVi, getSubjectLabelVi } from "@/utils/educationDisplay";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReviewManagementCardProps {
   review: Review;
   onRequestHide?: (reviewId: string, reason?: string) => Promise<void>;
   loading?: boolean;
}

export function ReviewManagementCard({ review, onRequestHide, loading }: ReviewManagementCardProps) {
   const [isExpanded, setIsExpanded] = useState(false);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [reason, setReason] = useState("");
   const maxLength = 150;

   const getInitials = (name: string) =>
      name
         .split(" ")
         .map((n) => n[0])
         .join("")
         .toUpperCase();

   const getTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) return "Hôm nay";
      if (diffInDays === 1) return "Hôm qua";
      if (diffInDays < 7) return `${diffInDays} ngày trước`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} tháng trước`;
      return `${Math.floor(diffInDays / 365)} năm trước`;
   };

   const comment = review.comment || "";
   const shouldTruncate = comment.length > maxLength;
   const displayComment =
      isExpanded || !shouldTruncate
         ? comment
         : `${comment.slice(0, maxLength)}...`;

   const studentName = review.reviewerId?.name || "Học viên ẩn danh";
   const studentAvatar = review.reviewerId?.avatarUrl;
   const subject = review.teachingRequestId?.subject || "Môn học không xác định";
   const level = review.teachingRequestId?.level || "Trình độ không xác định";
   const visibilityStatus = review.visibilityRequestStatus;
   const isPending = visibilityStatus === "PENDING";
   const isApproved = visibilityStatus === "APPROVED";
   const isHidden = review.isVisible === false || isApproved;

   const canRequestHide = !!onRequestHide && !isPending && !isApproved;

   const handleSubmit = async () => {
      if (!onRequestHide) return;
      await onRequestHide(review._id, reason.trim() || undefined);
      setIsDialogOpen(false);
      setReason("");
   };

   return (
      <Card className="rounded-2xl border p-6 shadow-sm transition-all">
         <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Phần bên trái: Thông tin học viên & Đánh giá */}
            <div className="flex-1 space-y-4">
               {/* Tiêu đề học viên */}
               <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-border">
                     <AvatarImage
                        src={studentAvatar || "/placeholder.svg"}
                        alt={studentName}
                     />
                     <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(studentName)}
                     </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                           {studentName}
                        </h3>
                        {isPending && (
                           <Badge variant="secondary" className="text-xs">Chờ duyệt ẩn</Badge>
                        )}
                        {isHidden && !isPending && (
                           <Badge variant="outline" className="text-xs">Đã ẩn</Badge>
                        )}
                        {visibilityStatus === "REJECTED" && (
                           <Badge variant="destructive" className="text-xs">Từ chối ẩn</Badge>
                        )}
                     </div>

                     {/* Sao đánh giá */}
                     <div className="mt-1 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating
                                 ? "fill-[#FACC15] text-[#FACC15]"
                                 : "fill-muted text-muted"
                                 }`}
                           />
                        ))}
                        <span className="ml-1 text-sm font-medium text-foreground">
                           {review.rating.toFixed(1)}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Bình luận đánh giá */}
               <div className="space-y-2">
                  <p className="text-pretty text-sm leading-relaxed text-foreground">
                     {displayComment || "Không có bình luận nào."}
                  </p>
                  {shouldTruncate && (
                     <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm font-medium text-primary hover:underline"
                     >
                        {isExpanded ? "Thu gọn" : "Xem thêm"}
                     </button>
                  )}
               </div>

               {/* Thông tin yêu cầu giảng dạy */}
               <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                     <BookOpen className="h-4 w-4" />
                     <span className="font-medium">{getSubjectLabelVi(subject)}</span>
                  </div>
                  <span className="text-muted">•</span>
                  <span>{getLevelLabelVi(level)}</span>
                  <span className="text-muted">•</span>
                  <div className="flex items-center gap-1.5">
                     <Calendar className="h-4 w-4" />
                     <span>{getTimeAgo(review.createdAt)}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Nút yêu cầu ẩn */}
         {canRequestHide && (
            <div className="mt-4">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-2"
               >
                  <EyeOff className="h-4 w-4" />
                  Yêu cầu ẩn
               </Button>
            </div>
         )}

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Yêu cầu ẩn đánh giá</DialogTitle>
                  <DialogDescription>
                     Lý do (tùy chọn, tối đa 1000 ký tự)
                  </DialogDescription>
               </DialogHeader>
               <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value.slice(0, 1000))}
                  placeholder="Nhập lý do (tùy chọn)"
                  maxLength={1000}
                  className="min-h-[120px]"
               />
               <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                     Hủy
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                     Gửi yêu cầu
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </Card>
   );
}