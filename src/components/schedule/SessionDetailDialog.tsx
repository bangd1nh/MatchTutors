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
import { useUser } from "@/hooks/useUser";
import {
   useConfirmParticipation,
   useConfirmAttendance,
   useDeleteSession,
   useCancelSession,
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
   const deleteSessionMutation = useDeleteSession();
   const cancelSessionMutation = useCancelSession();

   // show confirmation modal before calling confirmAttendance
   const [showAttendanceConfirmDialog, setShowAttendanceConfirmDialog] =
      useState(false);

   const [showCancelDialog, setShowCancelDialog] = useState(false);
   const [cancelReason, setCancelReason] = useState("");

   if (!session || !user) return null;

   const isTutor = user.role === Role.TUTOR;
   const isStudent = user.role === Role.STUDENT;
   const teachingRequest = session.teachingRequestId as any;

   // Debug: Log the session data to understand the structure
   console.log("Session data:", session);
   console.log("TeachingRequest data:", teachingRequest);
   console.log("Tutor data:", teachingRequest?.tutorId);
   console.log("Tutor user data:", teachingRequest?.tutorId?.userId);

   // Kiểm tra quyền chỉnh sửa
   const canEdit = isTutor && teachingRequest?.tutorId?.userId === user._id;

   // Kiểm tra trạng thái buổi học đã kết thúc chưa
   const now = new Date();
   const sessionEnd = new Date(session.endTime);
   const isSessionEnded = now >= sessionEnd;

   // Kiểm tra có thể hủy buổi học không (trước 10 phút)
   const tenMinutesBeforeStart = new Date(
      new Date(session.startTime).getTime() - 10 * 60 * 1000
   );
   const canCancelSession =
      now < tenMinutesBeforeStart && session.status === SessionStatus.CONFIRMED;

   // Hiển thị nút xác nhận tham gia cho học sinh
   const showParticipationButtons =
      isStudent &&
      session.status === SessionStatus.SCHEDULED &&
      session.studentConfirmation?.status === "PENDING";

   // Hiển thị nút điểm danh sau buổi học
   /*
    const showAttendanceButton =
      isSessionEnded &&
      session.status === SessionStatus.CONFIRMED &&
      ((isTutor && !session.attendanceConfirmation?.tutorConfirmed) ||
         (isStudent && !session.attendanceConfirmation?.studentConfirmed));
    */

   // TEST: Luôn hiển thị nút điểm danh để test (bỏ qua isSessionEnded)
   const showAttendanceButton =
      // isSessionEnded && // Tạm thời bỏ qua điều kiện này
      (isTutor && !session.attendanceConfirmation?.tutorConfirmed) ||
      (isStudent && !session.attendanceConfirmation?.studentConfirmed);

   const getStatusBadge = (status: SessionStatus) => {
      const statusMap = {
         [SessionStatus.SCHEDULED]: {
            label: "Chờ xác nhận",
            variant: "secondary" as const,
         },
         [SessionStatus.CONFIRMED]: {
            label: "Đã xác nhận",
            variant: "default" as const,
         },
         [SessionStatus.REJECTED]: {
            label: "Đã từ chối",
            variant: "destructive" as const,
         },
         [SessionStatus.CANCELLED]: {
            label: "Đã hủy",
            variant: "destructive" as const,
         },
         [SessionStatus.COMPLETED]: {
            label: "Hoàn thành",
            variant: "default" as const,
         },
         [SessionStatus.NOT_CONDUCTED]: {
            label: "Không diễn ra",
            variant: "outline" as const,
         },
      };

      const config = statusMap[status] || {
         label: status,
         variant: "outline" as const,
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
                     {teachingRequest?.subject ?? "Môn học không xác định"}
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

                  {/* Basic Info Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                           <span className="text-sm font-medium text-gray-600">
                              Môn học
                           </span>
                           <span className="text-sm font-semibold text-gray-900">
                              {teachingRequest?.subject ??
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
                                 {teachingRequest?.tutorId?.userId?.name ||
                                    "Chưa có"}
                              </div>
                              <div className="text-xs text-gray-500">
                                 {teachingRequest?.tutorId?.userId?.email ||
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
                                 {teachingRequest?.studentId?.userId?.name ||
                                    "Chưa có"}
                              </div>
                              <div className="text-xs text-gray-500">
                                 {teachingRequest?.studentId?.userId?.email ||
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
                                 {session.attendanceConfirmation
                                    .tutorConfirmed ? (
                                    <Badge
                                       variant="default"
                                       className="text-xs bg-green-100 text-green-800"
                                    >
                                       ✓ Đã điểm danh
                                    </Badge>
                                 ) : (
                                    <Badge
                                       variant="secondary"
                                       className="text-xs bg-red-100 text-red-800"
                                    >
                                       ✗ Chưa điểm danh
                                    </Badge>
                                 )}
                              </div>
                              {session.attendanceConfirmation
                                 .tutorConfirmedAt && (
                                 <div className="text-xs text-gray-500">
                                    Lúc:{" "}
                                    {moment(
                                       session.attendanceConfirmation
                                          .tutorConfirmedAt
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
                                 {session.attendanceConfirmation
                                    .studentConfirmed ? (
                                    <Badge
                                       variant="default"
                                       className="text-xs bg-green-100 text-green-800"
                                    >
                                       ✓ Đã điểm danh
                                    </Badge>
                                 ) : (
                                    <Badge
                                       variant="secondary"
                                       className="text-xs bg-red-100 text-red-800"
                                    >
                                       ✗ Chưa điểm danh
                                    </Badge>
                                 )}
                              </div>
                              {session.attendanceConfirmation
                                 .studentConfirmedAt && (
                                 <div className="text-xs text-gray-500">
                                    Lúc:{" "}
                                    {moment(
                                       session.attendanceConfirmation
                                          .studentConfirmedAt
                                    ).format("HH:mm DD/MM/YYYY")}
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Overall Status */}
                        <div className="text-center">
                           {session.attendanceConfirmation.isAttended ? (
                              <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                                 <span className="text-sm font-medium text-green-800">
                                    🎉 Buổi học đã được xác nhận thành công
                                 </span>
                              </div>
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
                                 className="w-full bg-green-600 hover:bg-green-700"
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
                                 className="w-full"
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
                        {showAttendanceButton && (
                           <Button
                              onClick={() =>
                                 setShowAttendanceConfirmDialog(true)
                              }
                              disabled={confirmAttendanceMutation.isPending}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                           >
                              Xác nhận điểm danh
                           </Button>
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

         {/* Attendance Confirmation Dialog */}
         <Dialog
            open={showAttendanceConfirmDialog}
            onOpenChange={setShowAttendanceConfirmDialog}
         >
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Xác nhận điểm danh</DialogTitle>
                  <DialogDescription>
                     Bạn có chắc chắn muốn xác nhận điểm danh cho buổi học này?
                     Hành động này sẽ ghi nhận trạng thái điểm danh.
                  </DialogDescription>
               </DialogHeader>
               <div className="py-4">
                  <p className="text-sm text-gray-700">
                     Vui lòng xác nhận — hành động này không thể hoàn tác.
                  </p>
               </div>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => setShowAttendanceConfirmDialog(false)}
                  >
                     Hủy
                  </Button>
                  <Button
                     onClick={() => {
                        setShowAttendanceConfirmDialog(false);
                        handleAttendanceConfirm();
                     }}
                     disabled={confirmAttendanceMutation.isPending}
                  >
                     {confirmAttendanceMutation.isPending
                        ? "Đang xác nhận..."
                        : "Xác nhận điểm danh"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
};
