import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LearningCommitment } from "@/types/learningCommitment";
import { useInitiatePayment } from "@/hooks/useLearningCommitment";
import { useUser } from "@/hooks/useUser";
import {
   useRequestCancellation,
   useRejectCancellation,
   useRejectLearningCommitment,
} from "@/hooks/useLearningCommitment";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Calendar, Users, BookOpen, DollarSign, Clock } from "lucide-react";

interface Props {
   commitment: LearningCommitment;
}

export const LearningCommitmentCard = ({ commitment }: Props) => {
   const { user } = useUser();
   const { mutate: initiatePayment, isPending } = useInitiatePayment();
   const requestCancellation = useRequestCancellation();
   const rejectCancellation = useRejectCancellation();
   const rejectCommitment = useRejectLearningCommitment();

   const [reason, setReason] = useState("");
   const [dialogOpen, setDialogOpen] = useState(false);

   const getStatusColor = (status: string) => {
      switch (status) {
         case "pending_agreement":
            return "bg-amber-50 text-amber-700 border border-amber-200";
         case "active":
            return "bg-emerald-50 text-emerald-700 border border-emerald-200";
         case "completed":
            return "bg-blue-50 text-blue-700 border border-blue-200";
         case "cancelled":
            return "bg-red-50 text-red-700 border border-red-200";
         case "cancellation_pending":
            return "bg-orange-50 text-orange-700 border border-orange-200";
         case "admin_review":
            return "bg-purple-50 text-purple-700 border border-purple-200";
         default:
            return "bg-gray-50 text-gray-700 border border-gray-200";
      }
   };

   const getStatusLabel = (status: string) => {
      const labels: { [key: string]: string } = {
         pending_agreement: "Chờ Xác Nhận",
         active: "Đang Hoạt Động",
         completed: "Hoàn Thành",
         cancelled: "Đã Hủy",
         cancellation_pending: "Chờ Phê Duyệt Hủy",
         admin_review: "Kiểm Duyệt",
      };
      return labels[status] || status;
   };

   // allow match by either student.userId (auth user id) or profile _id
   const studentObj: any = commitment.student;
   const isStudentOwner = Boolean(
      studentObj &&
         (String(studentObj.userId?._id || studentObj.userId) ===
            String(user?.id || user?._id) ||
            String(studentObj._id) === String(user?.id || user?._id))
   );

   const isStudentRole = String(user?.role || "").toLowerCase() === "student";
   const isTutorRole = String(user?.role).toLowerCase() === "tutor";

   const canPay =
      isStudentRole &&
      isStudentOwner &&
      commitment.status === "pending_agreement" &&
      (commitment.studentPaidAmount ?? 0) < (commitment.totalAmount ?? 0);

   const canReject =
      isStudentRole &&
      isStudentOwner &&
      commitment.status === "pending_agreement";

   const canRequestCancel = commitment.status === "active";
   const canRespondCancel =
      commitment.status === "cancellation_pending" &&
      ((isStudentRole &&
         commitment.cancellationDecision?.student.status === "PENDING") ||
         (isTutorRole &&
            commitment.cancellationDecision?.tutor.status === "PENDING"));

   const subject =
      typeof commitment.teachingRequest === "object"
         ? commitment.teachingRequest.subject || "Unknown Subject"
         : String(commitment.teachingRequest || "Unknown Subject");

   const remainingAmount =
      (commitment.totalAmount ?? 0) - (commitment.studentPaidAmount ?? 0);
   const progressPercent =
      ((commitment.completedSessions ?? 0) / (commitment.totalSessions ?? 1)) *
      100;

   const handleRequest = () => {
      if (!reason.trim()) return;
      requestCancellation.mutate({ id: commitment._id, reason });
      setDialogOpen(false);
      setReason("");
   };

   const handleReject = () => {
      if (!reason.trim()) return;
      rejectCancellation.mutate({ id: commitment._id, reason });
      setDialogOpen(false);
      setReason("");
   };

   return (
      <Card className="w-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
         {/* Header với Subject và Status */}
         <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-start justify-between gap-4">
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                     <BookOpen className="w-5 h-5 text-slate-600 flex-shrink-0" />
                     <h3 className="text-lg font-semibold text-slate-900 truncate">
                        {subject}
                     </h3>
                  </div>
               </div>
               <Badge
                  className={`flex-shrink-0 font-medium text-xs ${getStatusColor(
                     commitment.status
                  )}`}
               >
                  {getStatusLabel(commitment.status)}
               </Badge>
            </div>
         </CardHeader>

         <CardContent className="space-y-5 pt-4">
            {/* Tutor và Student */}
            <div className="space-y-3">
               <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Gia Sư
                     </p>
                     <p className="text-sm font-medium text-slate-900 truncate">
                        {commitment.tutor.userId.name}
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Học Viên
                     </p>
                     <p className="text-sm font-medium text-slate-900 truncate">
                        {commitment.student.userId.name}
                     </p>
                  </div>
               </div>
            </div>

            {/* Sessions Progress */}
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Clock className="w-4 h-4 text-slate-500" />
                     <p className="text-sm font-medium text-slate-700">
                        Tiến Độ Buổi Học
                     </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-900">
                     {commitment.completedSessions ?? 0}/
                     {commitment.totalSessions ?? "-"}
                  </span>
               </div>
               <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                     className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                     style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
               </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
               <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Bắt Đầu
                     </p>
                     <p className="text-sm font-medium text-slate-900">
                        {commitment.startDate
                           ? format(new Date(commitment.startDate), "dd/MM/yy")
                           : "-"}
                     </p>
                  </div>
               </div>
               <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Kết Thúc
                     </p>
                     <p className="text-sm font-medium text-slate-900">
                        {commitment.endDate
                           ? format(new Date(commitment.endDate), "dd/MM/yy")
                           : "-"}
                     </p>
                  </div>
               </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <DollarSign className="w-4 h-4 text-slate-500" />
                     <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Tổng Tiền
                     </span>
                  </div>
                  <span className="font-semibold text-emerald-600">
                     {(commitment.totalAmount ?? 0).toLocaleString("vi-VN")} VND
                  </span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                     Đã Thanh Toán
                  </span>
                  <span className="font-semibold text-blue-600">
                     {(commitment.studentPaidAmount ?? 0).toLocaleString(
                        "vi-VN"
                     )}{" "}
                     VND
                  </span>
               </div>
               {remainingAmount > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                     <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Còn Lại
                     </span>
                     <span className="font-semibold text-orange-600">
                        {remainingAmount.toLocaleString("vi-VN")} VND
                     </span>
                  </div>
               )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
               {canPay && (
                  <Button
                     onClick={() => initiatePayment(String(commitment._id))}
                     disabled={isPending}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                     {isPending ? "Đang Xử Lý..." : "Thanh Toán Ngay"}
                  </Button>
               )}

               {canReject && (
                  <Button
                     onClick={() =>
                        rejectCommitment.mutate(String(commitment._id))
                     }
                     disabled={rejectCommitment.isPending}
                     variant="outline"
                     className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  >
                     {rejectCommitment.isPending ? "Đang Xử Lý..." : "Từ Chối"}
                  </Button>
               )}

               {canRequestCancel && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                     <DialogTrigger asChild>
                        <Button
                           variant="outline"
                           className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                           Yêu Cầu Hủy
                        </Button>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Yêu Cầu Hủy Cam Kết</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                           <p className="text-sm text-slate-600">
                              Vui lòng cung cấp lý do hủy cam kết này:
                           </p>
                           <Textarea
                              placeholder="Nhập lý do hủy..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              className="resize-none"
                              rows={4}
                           />
                           <Button
                              onClick={handleRequest}
                              disabled={!reason.trim()}
                              className="w-full bg-red-600 hover:bg-red-700"
                           >
                              Gửi Yêu Cầu
                           </Button>
                        </div>
                     </DialogContent>
                  </Dialog>
               )}

               {canRespondCancel && (
                  <div className="flex gap-3">
                     <Button
                        onClick={() =>
                           requestCancellation.mutate({
                              id: commitment._id,
                              reason: "Accepted",
                           })
                        }
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                     >
                        Chấp Nhận
                     </Button>
                     <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                           <Button
                              variant="outline"
                              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                           >
                              Từ Chối
                           </Button>
                        </DialogTrigger>
                        <DialogContent>
                           <DialogHeader>
                              <DialogTitle>Từ Chối Hủy Cam Kết</DialogTitle>
                           </DialogHeader>
                           <div className="space-y-4">
                              <p className="text-sm text-slate-600">
                                 Vui lòng cung cấp lý do từ chối:
                              </p>
                              <Textarea
                                 placeholder="Nhập lý do từ chối..."
                                 value={reason}
                                 onChange={(e) => setReason(e.target.value)}
                                 className="resize-none"
                                 rows={4}
                              />
                              <Button
                                 onClick={handleReject}
                                 disabled={!reason.trim()}
                                 className="w-full bg-red-600 hover:bg-red-700"
                              >
                                 Gửi Từ Chối
                              </Button>
                           </div>
                        </DialogContent>
                     </Dialog>
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
};
