import React, { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Import Input
import { useUser } from "@/hooks/useUser";
import {
   useConfirmParticipation,
   useConfirmAttendance,
   useDeleteSession,
   useCancelSession,
   useRejectAttendance,
} from "@/hooks/useSessions";
import { Session } from "@/types/session";
import { SessionStatus } from "@/enums/session.enum";
import { Role } from "@/types/user";
import moment from "moment";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

interface SessionDetailDialogProps {
   isOpen: boolean;
   onClose: () => void;
   session: Session | null;
   onEdit?: (session: Session) => void;
}

export const SessionDetailDialog: React.FC<SessionDetailDialogProps> = ({
   isOpen,
   onClose,
   session,
   onEdit,
}) => {
   const { user } = useUser();
   const confirmParticipationMutation = useConfirmParticipation();
   const confirmAttendanceMutation = useConfirmAttendance();
   const rejectAttendanceMutation = useRejectAttendance();
   const deleteSessionMutation = useDeleteSession();
   const cancelSessionMutation = useCancelSession();

   const [showCancelDialog, setShowCancelDialog] = useState(false);
   const [cancelReason, setCancelReason] = useState("");

   // State for dispute dialog
   const [showDisputeDialog, setShowDisputeDialog] = useState(false);
   const [disputeReason, setDisputeReason] = useState("");
   const [evidenceUrls, setEvidenceUrls] = useState("");

   if (!session || !user) return null;

   const isTutor = user.role === Role.TUTOR;
   const isStudent = user.role === Role.STUDENT;
   const learningCommitment = (session as any).learningCommitmentId as any;

   const canEdit =
      isTutor &&
      (learningCommitment?.tutor?.userId === user._id ||
         learningCommitment?.tutor?.userId?._id === user._id);

   const now = new Date();
   const sessionEnd = new Date(session.endTime);
   const isSessionEnded = now >= sessionEnd;

   const tenMinutesBeforeStart = new Date(
      new Date(session.startTime).getTime() - 10 * 60 * 1000
   );
   const canCancelSession =
      now < tenMinutesBeforeStart && session.status === SessionStatus.CONFIRMED;

   const showParticipationButtons =
      isStudent &&
      session.status === SessionStatus.SCHEDULED &&
      session.studentConfirmation?.status === "PENDING";

   const tutorHasConfirmed =
      session.attendanceConfirmation?.tutor.status === "ACCEPTED";
   const studentHasDecided =
      session.attendanceConfirmation?.student.status !== "PENDING";
   const tutorHasDecided =
      session.attendanceConfirmation?.tutor.status !== "PENDING";

   const showAttendanceButtons =
      // Temporarily enabled for testing.
      // isSessionEnded &&
      // session.status === SessionStatus.CONFIRMED &&
      (isTutor && !tutorHasDecided) || (isStudent && !studentHasDecided);

   const getStatusBadge = (status: SessionStatus | string) => {
      const statusMap: Record<string, { label: string; variant: any }> = {
         [SessionStatus.SCHEDULED]: {
            label: "Chờ xác nhận",
            variant: "secondary",
         },
         [SessionStatus.CONFIRMED]: {
            label: "Đã xác nhận",
            variant: "default",
         },
         [SessionStatus.REJECTED]: {
            label: "Đã từ chối",
            variant: "destructive",
         },
         [SessionStatus.CANCELLED]: {
            label: "Đã hủy",
            variant: "destructive",
         },
         [SessionStatus.COMPLETED]: {
            label: "Hoàn thành",
            variant: "default",
         },
         [SessionStatus.NOT_CONDUCTED]: {
            label: "Không diễn ra",
            variant: "outline",
         },
         [SessionStatus.DISPUTED]: {
            label: "Đang tranh chấp",
            variant: "destructive",
         },
      };

      const config = statusMap[status] || {
         label: status,
         variant: "outline",
      };
      return <Badge variant={config.variant}>{config.label}</Badge>;
   };

   const handleParticipationDecision = (decision: "ACCEPTED" | "REJECTED") => {
      confirmParticipationMutation.mutate(
         { sessionId: session._id, decision },
         { onSuccess: onClose }
      );
   };

   const handleAttendanceConfirm = () => {
      confirmAttendanceMutation.mutate(session._id, {
         onSuccess: onClose,
      });
   };

   const handleAttendanceReject = () => {
      // If tutor has confirmed, student must provide reason for dispute
      if (isStudent && tutorHasConfirmed) {
         setShowDisputeDialog(true);
      } else {
         // Otherwise, just reject
         rejectAttendanceMutation.mutate(
            { sessionId: session._id },
            { onSuccess: onClose }
         );
      }
   };

   const handleSubmitDispute = () => {
      if (disputeReason.trim().length < 10) {
         alert("Lý do tranh chấp phải có ít nhất 10 ký tự.");
         return;
      }
      const urls = evidenceUrls
         .split(",")
         .map((url) => url.trim())
         .filter(Boolean);
      if (urls.length === 0) {
         alert("Vui lòng cung cấp ít nhất một URL bằng chứng.");
         return;
      }

      rejectAttendanceMutation.mutate(
         {
            sessionId: session._id,
            payload: { reason: disputeReason, evidenceUrls: urls },
         },
         {
            onSuccess: () => {
               setShowDisputeDialog(false);
               setDisputeReason("");
               setEvidenceUrls("");
               onClose();
            },
         }
      );
   };

   const handleDelete = () => {
      if (window.confirm("Bạn có chắc chắn muốn xóa buổi học này?")) {
         deleteSessionMutation.mutate(session._id, {
            onSuccess: onClose,
         });
      }
   };

   const handleCancelSession = () => {
      if (cancelReason.trim().length < 10) {
         alert("Lý do hủy phải có ít nhất 10 ký tự");
         return;
      }

      cancelSessionMutation.mutate(
         { sessionId: session._id, reason: cancelReason.trim() },
         {
            onSuccess: () => {
               setShowCancelDialog(false);
               setCancelReason("");
               onClose();
            },
         }
      );
   };

   return (
      <>
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
               <DialogHeader className="pb-4 border-b">
                  <DialogTitle className="text-xl font-semibold">
                     Chi tiết buổi học
                  </DialogTitle>
                  <DialogDescription className="text-base">
                     {learningCommitment?.teachingRequest?.subject ??
                        "Môn học không xác định"}
                  </DialogDescription>
               </DialogHeader>

               <div className="py-6 space-y-6">
                  {/* Status Section */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                     <span className="text-sm font-medium text-gray-700">
                        Trạng thái
                     </span>
                     {getStatusBadge(session.status as SessionStatus)}
                  </div>

                  {/* Dispute Info */}
                  {session.dispute &&
                     session.status === SessionStatus.DISPUTED && (
                        <div className="border-t pt-6">
                           <h3 className="text-lg font-semibold text-yellow-700 mb-4">
                              Thông tin Tranh chấp
                           </h3>
                           <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                              <div>
                                 <span className="text-sm font-medium text-yellow-800">
                                    Lý do:
                                 </span>
                                 <p className="text-sm text-gray-800 mt-1">
                                    {session.dispute.reason}
                                 </p>
                              </div>
                              <div>
                                 <span className="text-sm font-medium text-yellow-800">
                                    Bằng chứng:
                                 </span>
                                 <ul className="list-disc list-inside mt-1">
                                    {session.dispute.evidenceUrls.map(
                                       (url, index) => (
                                          <li key={index} className="text-sm">
                                             <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                             >
                                                Link {index + 1}
                                             </a>
                                          </li>
                                       )
                                    )}
                                 </ul>
                              </div>
                              <p className="text-xs text-gray-500 pt-2 border-t border-yellow-100">
                                 Tranh chấp đang chờ quản trị viên xem xét.
                              </p>
                           </div>
                        </div>
                     )}

                  {/* Basic Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                           <span className="text-sm font-medium text-gray-600">
                              Môn học
                           </span>
                           <span className="text-sm font-semibold text-gray-900">
                              {learningCommitment?.teachingRequest?.subject ??
                                 "Môn học không xác định"}
                           </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                           <span className="text-sm font-medium text-gray-600">
                              Thời gian
                           </span>
                           <span className="text-sm text-gray-900">
                              {moment(session.startTime).format(
                                 "HH:mm, DD/MM/YYYY"
                              )}
                           </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                           <span className="text-sm font-medium text-gray-600">
                              Địa điểm
                           </span>
                           <span className="text-sm text-gray-900">
                              {session.location || "Chưa có"}
                           </span>
                        </div>

                        {session.isTrial && (
                           <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <span className="text-sm font-medium text-gray-600">
                                 Loại
                              </span>
                              <Badge variant="outline" className="text-xs">
                                 Buổi học thử
                              </Badge>
                           </div>
                        )}
                     </div>

                     {/* Participants Section */}
                     <div className="space-y-3">
                        {/* Tutor Info */}
                        <div className="p-3 border border-gray-200 rounded-lg">
                           <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                 Gia sư
                              </span>
                              <Badge variant="outline" className="text-xs">
                                 TUTOR
                              </Badge>
                           </div>
                           <div className="space-y-1">
                              <div className="text-sm font-semibold text-gray-900">
                                 {learningCommitment?.tutor?.userId?.name ||
                                    [
                                       learningCommitment?.tutor?.firstName,
                                       learningCommitment?.tutor?.lastName,
                                    ]
                                       .filter(Boolean)
                                       .join(" ") ||
                                    "Chưa có"}
                              </div>
                              <div className="text-xs text-gray-500">
                                 {learningCommitment?.tutor?.userId?.email ||
                                    learningCommitment?.tutor?.email ||
                                    "N/A"}
                              </div>
                           </div>
                        </div>

                        {/* Student Info */}
                        <div className="p-3 border border-gray-200 rounded-lg">
                           <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                 Học sinh
                              </span>
                              <Badge variant="outline" className="text-xs">
                                 STUDENT
                              </Badge>
                           </div>
                           <div className="space-y-1">
                              <div className="text-sm font-semibold text-gray-900">
                                 {learningCommitment?.student?.userId?.name ||
                                    [
                                       learningCommitment?.student?.firstName,
                                       learningCommitment?.student?.lastName,
                                    ]
                                       .filter(Boolean)
                                       .join(" ") ||
                                    "Chưa có"}
                              </div>
                              <div className="text-xs text-gray-500">
                                 {learningCommitment?.student?.userId?.email ||
                                    learningCommitment?.student?.email ||
                                    "N/A"}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Cancellation Info */}
                  {session.cancellation && (
                     <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                           Thông tin hủy buổi học
                        </h3>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                           {/* Cancelled By User Info */}
                           <div className="mb-4">
                              <span className="text-sm font-medium text-red-600 block mb-2">
                                 Người hủy:
                              </span>
                              {typeof session.cancellation.cancelledBy ===
                                 "object" &&
                              session.cancellation.cancelledBy ? (
                                 <div className="p-3 bg-white rounded-lg border border-red-100">
                                    <div className="space-y-1">
                                       <div className="text-sm font-semibold text-red-800">
                                          {session.cancellation.cancelledBy
                                             .name || "Người dùng"}
                                       </div>
                                       <div className="text-xs text-red-600">
                                          {session.cancellation.cancelledBy
                                             .email || "N/A"}
                                       </div>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="p-3 bg-white rounded-lg border border-red-100">
                                    <span className="text-sm text-red-800">
                                       Người dùng (ID:{" "}
                                       {session.cancellation.cancelledBy})
                                    </span>
                                 </div>
                              )}
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <span className="text-sm font-medium text-red-600">
                                    Thời gian hủy:
                                 </span>
                                 <p className="text-sm text-red-800">
                                    {moment(
                                       session.cancellation.cancelledAt
                                    ).format("HH:mm DD/MM/YYYY")}
                                 </p>
                              </div>
                              <div>
                                 <span className="text-sm font-medium text-red-600">
                                    Thời gian hủy (chi tiết):
                                 </span>
                                 <p className="text-sm text-red-800">
                                    {moment(
                                       session.cancellation.cancelledAt
                                    ).format("dddd, DD/MM/YYYY [lúc] HH:mm")}
                                 </p>
                              </div>
                           </div>

                           <div className="mt-4">
                              <span className="text-sm font-medium text-red-600">
                                 Lý do hủy:
                              </span>
                              <div className="mt-2 p-3 bg-white rounded-lg border border-red-100">
                                 <p className="text-sm text-red-800">
                                    {session.cancellation.reason}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Confirmation Status */}
                  {session.studentConfirmation && (
                     <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-700">
                           Xác nhận tham gia
                        </span>
                        <Badge
                           variant={
                              session.studentConfirmation.status === "ACCEPTED"
                                 ? "default"
                                 : session.studentConfirmation.status ===
                                   "REJECTED"
                                 ? "destructive"
                                 : "secondary"
                           }
                        >
                           {session.studentConfirmation.status === "PENDING"
                              ? "Chờ xác nhận"
                              : session.studentConfirmation.status ===
                                "ACCEPTED"
                              ? "Đã đồng ý"
                              : "Đã từ chối"}
                        </Badge>
                     </div>
                  )}

                  {/* Attendance Section */}
                  {session.attendanceConfirmation && (
                     <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                           Thông tin điểm danh
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                           {/* Tutor Attendance */}
                           <div className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                 <span className="text-sm font-medium text-gray-600">
                                    Gia sư
                                 </span>
                                 <Badge
                                    variant={
                                       session.attendanceConfirmation.tutor
                                          .status === "ACCEPTED"
                                          ? "default"
                                          : session.attendanceConfirmation.tutor
                                               .status === "REJECTED"
                                          ? "destructive"
                                          : "secondary"
                                    }
                                 >
                                    {session.attendanceConfirmation.tutor
                                       .status === "ACCEPTED"
                                       ? "✓ Đã xác nhận"
                                       : session.attendanceConfirmation.tutor
                                            .status === "REJECTED"
                                       ? "✗ Đã từ chối"
                                       : "Chờ xác nhận"}
                                 </Badge>
                              </div>
                              {session.attendanceConfirmation.tutor
                                 .decidedAt && (
                                 <div className="text-xs text-gray-500">
                                    Lúc:{" "}
                                    {moment(
                                       session.attendanceConfirmation.tutor
                                          .decidedAt
                                    ).format("HH:mm DD/MM/YYYY")}
                                 </div>
                              )}
                           </div>

                           {/* Student Attendance */}
                           <div className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                 <span className="text-sm font-medium text-gray-600">
                                    Học sinh
                                 </span>
                                 <Badge
                                    variant={
                                       session.attendanceConfirmation.student
                                          .status === "ACCEPTED"
                                          ? "default"
                                          : session.attendanceConfirmation
                                               .student.status === "REJECTED"
                                          ? "destructive"
                                          : "secondary"
                                    }
                                 >
                                    {session.attendanceConfirmation.student
                                       .status === "ACCEPTED"
                                       ? "✓ Đã xác nhận"
                                       : session.attendanceConfirmation.student
                                            .status === "REJECTED"
                                       ? "✗ Đã từ chối"
                                       : "Chờ xác nhận"}
                                 </Badge>
                              </div>
                              {session.attendanceConfirmation.student
                                 .decidedAt && (
                                 <div className="text-xs text-gray-500">
                                    Lúc:{" "}
                                    {moment(
                                       session.attendanceConfirmation.student
                                          .decidedAt
                                    ).format("HH:mm DD/MM/YYYY")}
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Overall Status */}
                        <div className="text-center">
                           {session.attendanceConfirmation.finalizedAt ? (
                              session.attendanceConfirmation.isAttended ? (
                                 <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                                    <span className="text-sm font-medium text-green-800">
                                       🎉 Buổi học đã được xác nhận thành công
                                    </span>
                                 </div>
                              ) : (
                                 <div className="inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                                    <span className="text-sm font-medium text-red-800">
                                       Buổi học được ghi nhận là không diễn ra
                                    </span>
                                 </div>
                              )
                           ) : (
                              <div className="inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                 <span className="text-sm font-medium text-yellow-800">
                                    ⏳ Chờ cả hai bên xác nhận điểm danh
                                 </span>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* No Attendance Info */}
                  {!session.attendanceConfirmation &&
                     (session.status === SessionStatus.COMPLETED ||
                        isSessionEnded) && (
                        <div className="border-t pt-6">
                           <h3 className="text-lg font-semibold text-gray-900 mb-4">
                              Thông tin điểm danh
                           </h3>
                           <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-600">
                                 Chưa có thông tin điểm danh
                              </span>
                           </div>
                        </div>
                     )}
               </div>

               <DialogFooter className="border-t pt-6">
                  <div className="w-full space-y-3">
                     {/* Action Buttons Section */}
                     <div className="space-y-3">
                        {/* Participation Buttons */}
                        {showParticipationButtons && (
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <Button
                                 onClick={() =>
                                    handleParticipationDecision("ACCEPTED")
                                 }
                                 disabled={
                                    confirmParticipationMutation.isPending
                                 }
                                 variant="default"
                              >
                                 Đồng ý tham gia
                              </Button>
                              <Button
                                 variant="destructive"
                                 onClick={() =>
                                    handleParticipationDecision("REJECTED")
                                 }
                                 disabled={
                                    confirmParticipationMutation.isPending
                                 }
                              >
                                 Từ chối
                              </Button>
                           </div>
                        )}

                        {/* Cancel Session Button */}
                        {canCancelSession && (
                           <Button
                              variant="destructive"
                              onClick={() => setShowCancelDialog(true)}
                              disabled={cancelSessionMutation.isPending}
                              className="w-full"
                           >
                              Hủy buổi học
                           </Button>
                        )}

                        {/* Attendance Button */}
                        {showAttendanceButtons && (
                           <div className="grid grid-cols-2 gap-3">
                              <Button
                                 onClick={handleAttendanceConfirm}
                                 disabled={confirmAttendanceMutation.isPending}
                                 variant="default"
                              >
                                 Xác nhận có mặt
                              </Button>
                              <Button
                                 variant="destructive"
                                 onClick={handleAttendanceReject}
                                 disabled={rejectAttendanceMutation.isPending}
                              >
                                 Báo vắng / Khiếu nại
                              </Button>
                           </div>
                        )}

                        {/* Edit/Delete Buttons for Tutor */}
                        {canEdit &&
                           session.status === SessionStatus.SCHEDULED && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                 {onEdit && (
                                    <Button
                                       variant="outline"
                                       onClick={() => {
                                          onEdit(session);
                                          onClose();
                                       }}
                                       className="w-full"
                                    >
                                       Chỉnh sửa
                                    </Button>
                                 )}
                                 <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deleteSessionMutation.isPending}
                                    className="w-full"
                                 >
                                    Xóa buổi học
                                 </Button>
                              </div>
                           )}
                     </div>

                     {/* Secondary Actions */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t">
                        <Link to={`/session/${session._id}`} className="w-full">
                           <Button
                              variant="outline"
                              className="w-full flex items-center justify-center gap-2"
                              onClick={onClose}
                           >
                              <ExternalLink className="h-4 w-4" />
                              Xem chi tiết
                           </Button>
                        </Link>

                        <Button
                           variant="outline"
                           onClick={onClose}
                           className="w-full"
                        >
                           Đóng
                        </Button>
                     </div>
                  </div>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Cancel Session Dialog */}
         <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Hủy buổi học</DialogTitle>
                  <DialogDescription>
                     Vui lòng nhập lý do hủy buổi học. Lý do phải có ít nhất 10
                     ký tự.
                  </DialogDescription>
               </DialogHeader>
               <div className="py-4">
                  <Label htmlFor="cancelReason">Lý do hủy</Label>
                  <Textarea
                     id="cancelReason"
                     placeholder="Nhập lý do hủy buổi học..."
                     value={cancelReason}
                     onChange={(e) => setCancelReason(e.target.value)}
                     rows={4}
                     className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                     Đã nhập: {cancelReason.length}/500 ký tự (tối thiểu 10 ký
                     tự)
                  </p>
               </div>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => {
                        setShowCancelDialog(false);
                        setCancelReason("");
                     }}
                  >
                     Hủy bỏ
                  </Button>
                  <Button
                     variant="destructive"
                     onClick={handleCancelSession}
                     disabled={
                        cancelReason.trim().length < 10 ||
                        cancelSessionMutation.isPending
                     }
                  >
                     {cancelSessionMutation.isPending
                        ? "Đang hủy..."
                        : "Xác nhận hủy"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Dispute Dialog */}
         <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Tạo Khiếu nại Điểm danh</DialogTitle>
                  <DialogDescription>
                     Gia sư đã xác nhận có mặt. Nếu bạn không đồng ý, vui lòng
                     cung cấp lý do và bằng chứng để quản trị viên xem xét.
                  </DialogDescription>
               </DialogHeader>
               <div className="py-4 space-y-4">
                  <div>
                     <Label htmlFor="disputeReason">Lý do khiếu nại</Label>
                     <Textarea
                        id="disputeReason"
                        placeholder="Ví dụ: Gia sư không đến, buổi học kết thúc sớm..."
                        value={disputeReason}
                        onChange={(e) => setDisputeReason(e.target.value)}
                        rows={4}
                        className="mt-2"
                     />
                     <p className="text-sm text-gray-500 mt-2">
                        Yêu cầu tối thiểu 10 ký tự.
                     </p>
                  </div>
                  <div>
                     <Label htmlFor="evidenceUrls">
                        Link bằng chứng (nếu có)
                     </Label>
                     <Input
                        id="evidenceUrls"
                        placeholder="Dán các link ảnh/video, cách nhau bởi dấu phẩy"
                        value={evidenceUrls}
                        onChange={(e) => setEvidenceUrls(e.target.value)}
                        className="mt-2"
                     />
                     <p className="text-sm text-gray-500 mt-2">
                        Cung cấp link Google Drive, Imgur, YouTube, etc.
                     </p>
                  </div>
               </div>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => setShowDisputeDialog(false)}
                  >
                     Hủy
                  </Button>
                  <Button
                     variant="destructive"
                     onClick={handleSubmitDispute}
                     disabled={
                        disputeReason.trim().length < 10 ||
                        evidenceUrls.trim().length === 0 ||
                        rejectAttendanceMutation.isPending
                     }
                  >
                     {rejectAttendanceMutation.isPending
                        ? "Đang gửi..."
                        : "Gửi khiếu nại"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
};
