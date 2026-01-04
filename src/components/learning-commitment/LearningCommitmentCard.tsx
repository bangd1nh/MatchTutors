import { format } from "date-fns";
import { getSubjectLabelVi } from "@/utils/educationDisplay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LearningCommitment } from "@/types/learningCommitment";
import {
   useInitiatePayment,
   // useInitiateTopUp,
} from "@/hooks/useLearningCommitment";
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
// import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
   Calendar,
   Users,
   BookOpen,
   DollarSign,
   Clock,
   Info,
   AlertCircle,
   CheckCircle2,
   XCircle,
   ChevronDown,
   ChevronUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Props {
   commitment: LearningCommitment;
}

export const LearningCommitmentCard = ({ commitment }: Props) => {
   const navigate = useNavigate();
   const { user } = useUser();
   const { mutate: initiatePayment, isPending } = useInitiatePayment();
   // const { mutate: initiateTopUp, isPending: isTopUpPending } =
   //    useInitiateTopUp();
   const requestCancellation = useRequestCancellation();
   const rejectCancellation = useRejectCancellation();
   const rejectCommitment = useRejectLearningCommitment();

   const [reason, setReason] = useState("");
   const [linkUrl, setLinkUrl] = useState("");
   const [dialogOpen, setDialogOpen] = useState(false);
   const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
   const [expandedHistoryIndex, setExpandedHistoryIndex] = useState<
      number | null
   >(null);
   // const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
   // const [topUpSessions, setTopUpSessions] = useState<number>(1);
   // const [topUpAmount, setTopUpAmount] = useState<number>(0);

   const getStatusColor = (status: string) => {
      // use semantic classes that adapt to dark mode via tokens
      switch (status) {
         case "pending_agreement":
            return "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
         case "active":
            return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
         case "completed":
            return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
         case "cancelled":
            return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800";
         case "cancellation_pending":
            return "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800";
         case "admin_review":
            return "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800";
         case "rejected":
            return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800";
         default:
            return "bg-muted text-muted-foreground border border-border";
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
         rejected: "Đã Từ Chối",
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

   const canViewReason =
      commitment.status === "cancellation_pending" ||
      commitment.status === "cancelled" ||
      commitment.status === "admin_review";

   // const canTopUp =
   //    isStudentRole &&
   //    isStudentOwner &&
   //    ["active", "pending_agreement"].includes(commitment.status);

   const getCancellationDetails = () => {
      const decision = commitment.cancellationDecision;
      const history = commitment.cancellationDecisionHistory;

      if (commitment.status === "cancelled" && history && history.length > 0) {
         const lastRecord = history[history.length - 1];
         return {
            reason: lastRecord.reason || "Không có lý do được cung cấp.",
            requestedBy: lastRecord.requestedBy || "unknown",
            requestedAt: lastRecord.requestedAt || lastRecord.resolvedDate,
            resolvedAt: lastRecord.resolvedDate,
            studentStatus: lastRecord.student.status,
            tutorStatus: lastRecord.tutor.status,
            adminNotes: lastRecord.adminNotes,
            adminResolvedBy: lastRecord.adminResolvedBy,
         };
      }

      if (
         commitment.status === "admin_review" &&
         history &&
         history.length > 0
      ) {
         const lastRecord = history[history.length - 1];
         return {
            reason:
               lastRecord.reason ||
               decision?.reason ||
               "Không có lý do được cung cấp.",
            requestedBy:
               lastRecord.requestedBy || decision?.requestedBy || "unknown",
            requestedAt: lastRecord.requestedAt || decision?.requestedAt,
            resolvedAt: lastRecord.resolvedDate || new Date().toISOString(),
            studentStatus: lastRecord.student.status,
            tutorStatus: lastRecord.tutor.status,
            studentReason: lastRecord.student.reason,
            tutorReason: lastRecord.tutor.reason,
            adminReviewRequired: lastRecord.adminReviewRequired,
            adminNotes: lastRecord.adminNotes,
         };
      }

      if (commitment.status === "cancellation_pending" && decision) {
         return {
            reason: decision.reason || "Không có lý do được cung cấp.",
            requestedBy: decision.requestedBy || "unknown",
            requestedAt: decision.requestedAt,
            studentStatus: decision.student.status,
            tutorStatus: decision.tutor.status,
            studentReason: decision.student.reason,
            tutorReason: decision.tutor.reason,
         };
      }

      return null;
   };

   const cancellationDetails = getCancellationDetails();

   const getRequesterName = (role: string) => {
      if (role === "student") {
         return commitment.student.userId.name;
      } else if (role === "tutor") {
         return commitment.tutor.userId.name;
      }
      return "Unknown";
   };

   const getStatusBadgeColor = (status: string) => {
      // token-based bg/text to support dark mode
      switch (status) {
         case "PENDING":
            return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200";
         case "ACCEPTED":
            return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200";
         case "REJECTED":
            return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
         default:
            return "bg-muted text-muted-foreground";
      }
   };

   const subjectRaw =
      typeof commitment.teachingRequest === "object"
         ? commitment.teachingRequest.subject || "Unknown Subject"
         : String(commitment.teachingRequest || "Unknown Subject");
   const subject = getSubjectLabelVi(subjectRaw);

   const remainingAmount =
      (commitment.totalAmount ?? 0) - (commitment.studentPaidAmount ?? 0);
   const progressPercent =
      ((commitment.completedSessions ?? 0) / (commitment.totalSessions ?? 1)) *
      100;

   const handleRequest = () => {
      if (!reason.trim() || !linkUrl.trim()) return;
      requestCancellation.mutate({ id: commitment._id, reason, linkUrl });
      setDialogOpen(false);
      setReason("");
      setLinkUrl("");
   };

   const handleReject = () => {
      if (!reason.trim() || !linkUrl.trim()) return;
      rejectCancellation.mutate({ id: commitment._id, reason, linkUrl });
      setDialogOpen(false);
      setReason("");
      setLinkUrl("");
   };

   // const handleTopUp = () => {
   //    if (
   //       !topUpSessions ||
   //       topUpSessions <= 0 ||
   //       !topUpAmount ||
   //       topUpAmount <= 0
   //    )
   //       return;
   //    initiateTopUp(
   //       {
   //          id: String(commitment._id),
   //          additionalSessions: topUpSessions,
   //          amount: topUpAmount,
   //       },
   //       {
   //          onSuccess: () => {
   //             setTopUpDialogOpen(false);
   //             setTopUpSessions(1);
   //             setTopUpAmount(0);
   //          },
   //       }
   //    );
   // };

   const hasMultipleCancellations =
      commitment.cancellationDecisionHistory &&
      commitment.cancellationDecisionHistory.length > 1;

   return (
      <Card className="w-full hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-card text-card-foreground">
         {/* Header */}
         <CardHeader className="pb-4 bg-muted">
            <div className="flex items-start justify-between gap-4">
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                     <BookOpen className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                     <h3 className="text-lg font-semibold text-foreground truncate">
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
            {/* Tutor & Student */}
            <div className="space-y-3">
               <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Gia Sư
                     </p>
                     <p className="text-sm font-medium text-foreground truncate">
                        {commitment.tutor.userId.name}
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                     <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Học Viên
                     </p>
                     <p className="text-sm font-medium text-foreground truncate">
                        {commitment.student.userId.name}
                     </p>
                  </div>
               </div>
            </div>

            {/* Sessions Progress */}
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Clock className="w-4 h-4 text-muted-foreground" />
                     <p className="text-sm font-medium text-foreground">
                        Tiến Độ Buổi Học
                     </p>
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                     {commitment.completedSessions ?? 0}/
                     {commitment.totalSessions ?? "-"}
                  </span>
               </div>
               <Progress
                  value={Math.min(progressPercent, 100)}
                  className="h-2"
               />

               {/* <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="text-sm">Buổi / tuần</span>
                  <span className="text-lg font-semibold text-foreground">
                     {commitment.sessionsPerWeek ?? "-"}
                  </span>
               </div> */}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-3">
               <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                     <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Bắt Đầu
                     </p>
                     <p className="text-sm font-medium text-foreground">
                        {commitment.startDate
                           ? format(new Date(commitment.startDate), "dd/MM/yy")
                           : "-"}
                     </p>
                  </div>
               </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-2 p-3 bg-muted rounded-lg border border-border">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <DollarSign className="w-4 h-4 text-muted-foreground" />
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Tổng Tiền
                     </span>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                     {(commitment.totalAmount ?? 0).toLocaleString("vi-VN")} VND
                  </span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                     Đã Thanh Toán
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                     {(commitment.studentPaidAmount ?? 0).toLocaleString(
                        "vi-VN"
                     )}{" "}
                     VND
                  </span>
               </div>
               {remainingAmount > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Còn Lại
                     </span>
                     <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {remainingAmount.toLocaleString("vi-VN")} VND
                     </span>
                  </div>
               )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
               {/* NEW: View Sessions Button */}
               {/* Role-aware navigation to sessions list */}
               <Button
                  onClick={() => {
                     const base =
                        String(user?.role || "").toUpperCase() === "TUTOR"
                           ? "/tutor"
                           : "/student";
                     navigate(
                        `${base}/learning-commitment/${commitment._id}/sessions`
                     );
                  }}
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-accent"
               >
                  <Calendar className="w-4 h-4 mr-2" />
                  Xem Danh Sách Buổi Học ({commitment.totalSessions || 0})
               </Button>

               {canViewReason && cancellationDetails && (
                  <Dialog
                     open={reasonDialogOpen}
                     onOpenChange={setReasonDialogOpen}
                  >
                     <DialogTrigger asChild>
                        <Button
                           variant="outline"
                           className="w-full border-border text-foreground hover:bg-accent"
                        >
                           <Info className="w-4 h-4 mr-2 text-muted-foreground" />
                           Xem Chi Tiết Hủy
                           {hasMultipleCancellations && (
                              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-destructive text-destructive-foreground rounded-full">
                                 {
                                    commitment.cancellationDecisionHistory
                                       ?.length
                                 }
                              </span>
                           )}
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-popover text-popover-foreground">
                        <DialogHeader>
                           <DialogTitle className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                              Chi Tiết Yêu Cầu Hủy Cam Kết
                              {hasMultipleCancellations && (
                                 <Badge variant="outline" className="ml-auto">
                                    {
                                       commitment.cancellationDecisionHistory
                                          ?.length
                                    }{" "}
                                    lần hủy
                                 </Badge>
                              )}
                           </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                           {/* History list and single detail blocks */}
                           {/* Replace hardcoded bg-* with token-aware classes */}
                           {hasMultipleCancellations ? (
                              <div className="space-y-3">
                                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm font-semibold text-blue-900">
                                       📋 Lịch Sử Hủy (
                                       {
                                          commitment.cancellationDecisionHistory
                                             ?.length
                                       }{" "}
                                       lần)
                                    </p>
                                 </div>

                                 {commitment.cancellationDecisionHistory?.map(
                                    (record, index) => (
                                       <div
                                          key={index}
                                          className="border rounded-lg overflow-hidden"
                                       >
                                          <button
                                             onClick={() =>
                                                setExpandedHistoryIndex(
                                                   expandedHistoryIndex ===
                                                      index
                                                      ? null
                                                      : index
                                                )
                                             }
                                             className="w-full px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 flex items-center justify-between transition-colors"
                                          >
                                             <div className="flex items-center gap-3 flex-1 text-left">
                                                <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-slate-300 text-slate-900 rounded-full">
                                                   {index + 1}
                                                </span>
                                                <div className="min-w-0">
                                                   <p className="text-sm font-semibold text-slate-900">
                                                      Lần Hủy #{index + 1}
                                                   </p>
                                                   <p className="text-xs text-slate-600">
                                                      {record.requestedAt
                                                         ? format(
                                                              new Date(
                                                                 record.requestedAt
                                                              ),
                                                              "HH:mm dd/MM/yyyy"
                                                           )
                                                         : "Không có thời gian"}
                                                   </p>
                                                </div>
                                             </div>
                                             {expandedHistoryIndex === index ? (
                                                <ChevronUp className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                             ) : (
                                                <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                             )}
                                          </button>

                                          {expandedHistoryIndex === index && (
                                             <div className="px-4 py-4 space-y-4 bg-white border-t">
                                                {/* Lý do hủy */}
                                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                                   <p className="text-xs font-semibold text-orange-900 mb-1 uppercase tracking-wide">
                                                      Lý Do Hủy
                                                   </p>
                                                   <p className="text-sm text-orange-800">
                                                      {record.reason ||
                                                         "Không có lý do được cung cấp."}
                                                   </p>
                                                </div>

                                                {/* Người yêu cầu */}
                                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                                   <p className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                                                      Yêu Cầu Từ
                                                   </p>
                                                   <p className="text-sm font-medium text-slate-900">
                                                      {getRequesterName(
                                                         record.requestedBy ||
                                                            "unknown"
                                                      )}
                                                   </p>
                                                </div>

                                                {/* Quyết định học viên */}
                                                <div
                                                   className={`border rounded-lg p-3 ${
                                                      record.student.status ===
                                                      "ACCEPTED"
                                                         ? "bg-green-50 border-green-200"
                                                         : record.student
                                                              .status ===
                                                           "REJECTED"
                                                         ? "bg-red-50 border-red-200"
                                                         : "bg-yellow-50 border-yellow-200"
                                                   }`}
                                                >
                                                   <div className="flex items-center gap-2 mb-2">
                                                      {record.student.status ===
                                                      "ACCEPTED" ? (
                                                         <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                      ) : record.student
                                                           .status ===
                                                        "REJECTED" ? (
                                                         <XCircle className="w-4 h-4 text-red-600" />
                                                      ) : (
                                                         <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                      )}
                                                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                         Học Viên
                                                      </p>
                                                   </div>
                                                   <Badge
                                                      className={`text-xs ${getStatusBadgeColor(
                                                         record.student.status
                                                      )}`}
                                                   >
                                                      {record.student.status ===
                                                      "ACCEPTED"
                                                         ? "Đã Chấp Nhận"
                                                         : record.student
                                                              .status ===
                                                           "REJECTED"
                                                         ? "Đã Từ Chối"
                                                         : "Chờ Phản Hồi"}
                                                   </Badge>
                                                   {record.student.reason && (
                                                      <p className="text-xs text-slate-600 mt-2">
                                                         <span className="font-semibold">
                                                            Lý do:
                                                         </span>{" "}
                                                         {record.student.reason}
                                                      </p>
                                                   )}
                                                </div>

                                                {/* Quyết định gia sư */}
                                                <div
                                                   className={`border rounded-lg p-3 ${
                                                      record.tutor.status ===
                                                      "ACCEPTED"
                                                         ? "bg-green-50 border-green-200"
                                                         : record.tutor
                                                              .status ===
                                                           "REJECTED"
                                                         ? "bg-red-50 border-red-200"
                                                         : "bg-yellow-50 border-yellow-200"
                                                   }`}
                                                >
                                                   <div className="flex items-center gap-2 mb-2">
                                                      {record.tutor.status ===
                                                      "ACCEPTED" ? (
                                                         <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                      ) : record.tutor
                                                           .status ===
                                                        "REJECTED" ? (
                                                         <XCircle className="w-4 h-4 text-red-600" />
                                                      ) : (
                                                         <AlertCircle className="w-4 h-4 text-yellow-600" />
                                                      )}
                                                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                                                         Gia Sư
                                                      </p>
                                                   </div>
                                                   <Badge
                                                      className={`text-xs ${getStatusBadgeColor(
                                                         record.tutor.status
                                                      )}`}
                                                   >
                                                      {record.tutor.status ===
                                                      "ACCEPTED"
                                                         ? "Đã Chấp Nhận"
                                                         : record.tutor
                                                              .status ===
                                                           "REJECTED"
                                                         ? "Đã Từ Chối"
                                                         : "Chờ Phản Hồi"}
                                                   </Badge>
                                                   {record.tutor.reason && (
                                                      <p className="text-xs text-slate-600 mt-2">
                                                         <span className="font-semibold">
                                                            Lý do:
                                                         </span>{" "}
                                                         {record.tutor.reason}
                                                      </p>
                                                   )}
                                                </div>

                                                {/* Admin Review Info */}
                                                {record.adminReviewRequired && (
                                                   <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                                      <p className="text-xs font-semibold text-purple-900 mb-1 uppercase tracking-wide">
                                                         Xử Lý Admin
                                                      </p>
                                                      <p className="text-sm text-purple-800">
                                                         Yêu cầu hủy đã được
                                                         chuyển cho admin xử lý
                                                         vì có sự bất đồng giữa
                                                         hai bên.
                                                      </p>
                                                   </div>
                                                )}

                                                {/* Admin Notes */}
                                                {record.adminNotes && (
                                                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                      <p className="text-xs font-semibold text-blue-900 mb-1 uppercase tracking-wide">
                                                         Ghi Chú Admin
                                                      </p>
                                                      <p className="text-sm text-blue-800">
                                                         {record.adminNotes}
                                                      </p>
                                                   </div>
                                                )}

                                                {/* Ngày xử lý */}
                                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                                   <p className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                                                      Ngày Xử Lý
                                                   </p>
                                                   <p className="text-sm text-slate-700">
                                                      {record.resolvedDate
                                                         ? format(
                                                              new Date(
                                                                 record.resolvedDate
                                                              ),
                                                              "HH:mm dd/MM/yyyy"
                                                           )
                                                         : "Chưa xử lý"}
                                                   </p>
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    )
                                 )}
                              </div>
                           ) : (
                              // Hiển thị chi tiết hủy đơn lẻ nếu chỉ có 1 lần
                              <>
                                 {/* Main Reason Section */}
                                 <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                       <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                       <div className="flex-1">
                                          <p className="font-semibold text-orange-900 mb-2">
                                             Lý Do Hủy
                                          </p>
                                          <p className="text-sm text-orange-800">
                                             {cancellationDetails.reason}
                                          </p>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Request Information */}
                                 <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                                    <div>
                                       <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                          Yêu Cầu Từ
                                       </p>
                                       <p className="text-sm font-medium text-slate-900">
                                          {getRequesterName(
                                             cancellationDetails.requestedBy
                                          )}
                                       </p>
                                    </div>

                                    {cancellationDetails.requestedAt && (
                                       <div>
                                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                             Thời Gian Yêu Cầu
                                          </p>
                                          <p className="text-sm text-slate-700">
                                             {format(
                                                new Date(
                                                   cancellationDetails.requestedAt
                                                ),
                                                "HH:mm dd/MM/yyyy"
                                             )}
                                          </p>
                                       </div>
                                    )}
                                 </div>

                                 {/* Decision Status */}
                                 <div className="grid grid-cols-2 gap-3">
                                    {/* Student Decision */}
                                    <div
                                       className={`border rounded-lg p-3 ${
                                          cancellationDetails.studentStatus ===
                                          "ACCEPTED"
                                             ? "bg-green-50 border-green-200"
                                             : cancellationDetails.studentStatus ===
                                               "REJECTED"
                                             ? "bg-red-50 border-red-200"
                                             : "bg-yellow-50 border-yellow-200"
                                       }`}
                                    >
                                       <div className="flex items-center gap-2 mb-2">
                                          {cancellationDetails.studentStatus ===
                                          "ACCEPTED" ? (
                                             <CheckCircle2 className="w-4 h-4 text-green-600" />
                                          ) : cancellationDetails.studentStatus ===
                                            "REJECTED" ? (
                                             <XCircle className="w-4 h-4 text-red-600" />
                                          ) : (
                                             <AlertCircle className="w-4 h-4 text-yellow-600" />
                                          )}
                                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                             Học Viên
                                          </p>
                                       </div>
                                       <Badge
                                          className={`text-xs ${getStatusBadgeColor(
                                             cancellationDetails.studentStatus
                                          )}`}
                                       >
                                          {cancellationDetails.studentStatus ===
                                          "ACCEPTED"
                                             ? "Đã Chấp Nhận"
                                             : cancellationDetails.studentStatus ===
                                               "REJECTED"
                                             ? "Đã Từ Chối"
                                             : "Chờ Phản Hồi"}
                                       </Badge>
                                       {cancellationDetails.studentReason && (
                                          <p className="text-xs text-slate-600 mt-2">
                                             {cancellationDetails.studentReason}
                                          </p>
                                       )}
                                    </div>

                                    {/* Tutor Decision */}
                                    <div
                                       className={`border rounded-lg p-3 ${
                                          cancellationDetails.tutorStatus ===
                                          "ACCEPTED"
                                             ? "bg-green-50 border-green-200"
                                             : cancellationDetails.tutorStatus ===
                                               "REJECTED"
                                             ? "bg-red-50 border-red-200"
                                             : "bg-yellow-50 border-yellow-200"
                                       }`}
                                    >
                                       <div className="flex items-center gap-2 mb-2">
                                          {cancellationDetails.tutorStatus ===
                                          "ACCEPTED" ? (
                                             <CheckCircle2 className="w-4 h-4 text-green-600" />
                                          ) : cancellationDetails.tutorStatus ===
                                            "REJECTED" ? (
                                             <XCircle className="w-4 h-4 text-red-600" />
                                          ) : (
                                             <AlertCircle className="w-4 h-4 text-yellow-600" />
                                          )}
                                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                             Gia Sư
                                          </p>
                                       </div>
                                       <Badge
                                          className={`text-xs ${getStatusBadgeColor(
                                             cancellationDetails.tutorStatus
                                          )}`}
                                       >
                                          {cancellationDetails.tutorStatus ===
                                          "ACCEPTED"
                                             ? "Đã Chấp Nhận"
                                             : cancellationDetails.tutorStatus ===
                                               "REJECTED"
                                             ? "Đã Từ Chối"
                                             : "Chờ Phản Hồi"}
                                       </Badge>
                                       {cancellationDetails.tutorReason && (
                                          <p className="text-xs text-slate-600 mt-2">
                                             {cancellationDetails.tutorReason}
                                          </p>
                                       )}
                                    </div>
                                 </div>

                                 {/* Admin Review Section */}
                                 {commitment.status === "admin_review" &&
                                    cancellationDetails.adminReviewRequired && (
                                       <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                          <div className="flex items-start gap-3">
                                             <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                             <div className="flex-1">
                                                <p className="font-semibold text-purple-900 mb-2">
                                                   Chờ Xử Lý Của Admin
                                                </p>
                                                <p className="text-sm text-purple-800">
                                                   Yêu cầu hủy đang chờ xét
                                                   duyệt từ quản trị viên vì có
                                                   sự bất đồng giữa học viên và
                                                   gia sư.
                                                </p>
                                             </div>
                                          </div>
                                       </div>
                                    )}

                                 {/* Admin Notes */}
                                 {cancellationDetails.adminNotes && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                       <div className="flex items-start gap-3">
                                          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                          <div className="flex-1">
                                             <p className="font-semibold text-blue-900 mb-2">
                                                Ghi Chú Từ Admin
                                             </p>
                                             <p className="text-sm text-blue-800">
                                                {cancellationDetails.adminNotes}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 )}

                                 {/* Timeline */}
                                 {cancellationDetails.resolvedAt && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                       <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                          Ngày Xử Lý
                                       </p>
                                       <p className="text-sm text-slate-700">
                                          {format(
                                             new Date(
                                                cancellationDetails.resolvedAt
                                             ),
                                             "HH:mm dd/MM/yyyy"
                                          )}
                                       </p>
                                    </div>
                                 )}
                              </>
                           )}

                           <Button
                              onClick={() => setReasonDialogOpen(false)}
                              className="w-full"
                           >
                              Đóng
                           </Button>
                        </div>
                     </DialogContent>
                  </Dialog>
               )}

               {canPay && (
                  <Button
                     onClick={() => initiatePayment(String(commitment._id))}
                     disabled={isPending}
                     className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
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
                     className="w-full text-destructive border-destructive/40 hover:bg-destructive/10"
                  >
                     {rejectCommitment.isPending ? "Đang Xử Lý..." : "Từ Chối"}
                  </Button>
               )}

               {canRequestCancel && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                     <DialogTrigger asChild>
                        <Button
                           variant="outline"
                           className="w-full text-destructive border-destructive/40 hover:bg-destructive/10"
                        >
                           Yêu Cầu Hủy
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="bg-popover text-popover-foreground">
                        <DialogHeader>
                           <DialogTitle>Yêu Cầu Hủy Cam Kết</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                           <p className="text-sm text-muted-foreground">
                              Vui lòng cung cấp lý do hủy cam kết này:
                           </p>
                           <Textarea
                              placeholder="Nhập lý do hủy..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              className="resize-none"
                              rows={4}
                           />
                           <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                 Link (bắt buộc)
                              </p>
                              <input
                                 type="url"
                                 placeholder="https://..."
                                 value={linkUrl}
                                 onChange={(e) => setLinkUrl(e.target.value)}
                                 className="w-full rounded-md border px-3 py-2 text-sm"
                              />
                           </div>
                           <Button
                              onClick={handleRequest}
                              disabled={!reason.trim() || !linkUrl.trim()}
                              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium dark:bg-emerald-500 dark:hover:bg-emerald-600"
                     >
                        Chấp Nhận
                     </Button>
                     <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                           <Button
                              variant="outline"
                              className="flex-1 text-destructive border-destructive/40 hover:bg-destructive/10"
                           >
                              Từ Chối
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-popover text-popover-foreground">
                           <DialogHeader>
                              <DialogTitle>Từ Chối Hủy Cam Kết</DialogTitle>
                           </DialogHeader>
                           <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                 Vui lòng cung cấp lý do từ chối:
                              </p>
                              <Textarea
                                 placeholder="Nhập lý do từ chối..."
                                 value={reason}
                                 onChange={(e) => setReason(e.target.value)}
                                 className="resize-none"
                                 rows={4}
                              />
                              <div>
                                 <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Link (bắt buộc)
                                 </p>
                                 <input
                                    type="url"
                                    placeholder="https://..."
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    className="w-full rounded-md border px-3 py-2 text-sm"
                                 />
                              </div>
                              <Button
                                 onClick={handleReject}
                                 disabled={!reason.trim() || !linkUrl.trim()}
                                 className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              >
                                 Gửi Từ Chối
                              </Button>
                           </div>
                        </DialogContent>
                     </Dialog>
                  </div>
               )}

               {/* {canTopUp && (
                  <Dialog
                     open={topUpDialogOpen}
                     onOpenChange={setTopUpDialogOpen}
                  >
                     <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                           Thêm Buổi
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="bg-popover text-popover-foreground">
                        <DialogHeader>
                           <DialogTitle> Thêm buổi học</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                           <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                 Số buổi thêm
                              </p>
                              <Input
                                 type="number"
                                 min={1}
                                 value={topUpSessions}
                                 onChange={(e) =>
                                    setTopUpSessions(
                                       Math.max(
                                          1,
                                          parseInt(e.target.value || "1")
                                       )
                                    )
                                 }
                              />
                           </div>
                           <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                 Số tiền (VND)
                              </p>
                              <Input
                                 type="number"
                                 min={0}
                                 value={topUpAmount}
                                 onChange={(e) =>
                                    setTopUpAmount(
                                       parseFloat(e.target.value || "0")
                                    )
                                 }
                              />
                           </div>

                           <Button
                              onClick={handleTopUp}
                              disabled={
                                 isTopUpPending ||
                                 !topUpSessions ||
                                 topUpSessions <= 0 ||
                                 !topUpAmount ||
                                 topUpAmount <= 0
                              }
                              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                           >
                              {isTopUpPending
                                 ? "Đang xử lý..."
                                 : "Thanh toán Top-up"}
                           </Button>
                           <Button
                              onClick={() => setTopUpDialogOpen(false)}
                              className="w-full"
                           >
                              Đóng
                           </Button>
                        </div>
                     </DialogContent>
                  </Dialog>
               )} */}
            </div>
         </CardContent>
      </Card>
   );
};
