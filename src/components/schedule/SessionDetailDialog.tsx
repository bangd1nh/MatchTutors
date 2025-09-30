import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Session } from "@/types/session";
import { useUser } from "@/hooks/useUser";
import { useUpdateSession, useDeleteSession } from "@/hooks/useSessions";
import { SessionStatus } from "@/enums/session.enum";
import moment from "moment";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../ui/select";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SessionDetailDialogProps {
   session: Session | null;
   isOpen: boolean;
   onClose: () => void;
   onEdit: (session: Session) => void;
}

export const SessionDetailDialog = ({
   session,
   isOpen,
   onClose,
   onEdit,
}: SessionDetailDialogProps) => {
   const { user } = useUser();
   const navigate = useNavigate();
   const updateMutation = useUpdateSession();
   const deleteSessionMutation = useDeleteSession();
   const [selectedStatus, setSelectedStatus] = useState<SessionStatus | null>(
      null
   );
   useEffect(() => {
      if (selectedStatus) {
         handleStatusChange(selectedStatus);
      }
   }, [selectedStatus]);

   if (!session) return null;

   const isTutor = user?.role === "TUTOR";
   const canModify =
      isTutor &&
      (session.teachingRequestId as any)?.tutorId?.userId === user?._id;
   const canDelete = canModify && session.status === SessionStatus.SCHEDULED;

   // TEMP DEBUG: force show complete button for testing.
   const FORCE_SHOW_COMPLETE_BUTTON = true;

   const now = new Date();
   const sessionEnd = new Date(session.endTime);
   const showMarkCompleted =
      isTutor &&
      canModify &&
      (session.status === SessionStatus.SCHEDULED ||
         session.status === SessionStatus.CONFIRMED) &&
      now >= sessionEnd;

   const handleStatusChange = (newStatus: SessionStatus) => {
      updateMutation.mutate(
         {
            sessionId: session._id,
            payload: { status: newStatus },
         },
         {
            onSuccess: () => {
               setSelectedStatus(null);
               onClose();
            },
         }
      );
   };

   // useEffect(() => {
   //    if (selectedStatus) {
   //       handleStatusChange(selectedStatus);
   //    }
   // }, [selectedStatus]);

   const handleDelete = () => {
      deleteSessionMutation.mutate(session._id, {
         onSuccess: onClose,
      });
   };

   // Dùng isLoading chung thay vì nhiều lần truy cập isPending
   const isLoading =
      updateMutation.isPending || deleteSessionMutation.isPending;

   const teachingRequest = session.teachingRequestId as any;
   const student = teachingRequest?.studentId?.userId;
   const tutor = teachingRequest?.tutorId?.userId;

   const isStudent = user?.role === "STUDENT";
   const showConfirm = isStudent && session.status === SessionStatus.SCHEDULED;

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Chi tiết buổi học</DialogTitle>
               <DialogDescription>
                  {teachingRequest?.subject ?? "Môn học không xác định"}
               </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
               <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <Badge
                     variant={
                        session.status === "COMPLETED" ? "default" : "secondary"
                     }
                  >
                     {session.status}
                  </Badge>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Thời gian</span>
                  <span>
                     {moment(session.startTime).format("HH:mm, DD/MM/YYYY")}
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Gia sư</span>
                  <span>{tutor?.name ?? "N/A"}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Học sinh</span>
                  <span>{student?.name ?? "N/A"}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Địa điểm</span>
                  <span>{session.location}</span>
               </div>
               {session.isTrial && (
                  <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">Loại</span>
                     <Badge variant="outline">Buổi học thử</Badge>
                  </div>
               )}
               {canModify && (
                  <div className="space-y-2">
                     <Label>Cập nhật trạng thái</Label>
                     <Select
                        onValueChange={(value) =>
                           setSelectedStatus(value as SessionStatus)
                        }
                        defaultValue={session.status}
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Chọn trạng thái mới" />
                        </SelectTrigger>
                        <SelectContent>
                           {Object.values(SessionStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                 {status}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               )}
            </div>
            <DialogFooter className="flex-row-reverse justify-between gap-2">
               <div>
                  {showConfirm && (
                     <>
                        <Button
                           onClick={() =>
                              updateMutation.mutate(
                                 {
                                    sessionId: session._id,
                                    payload: {
                                       status: SessionStatus.CONFIRMED,
                                    },
                                 },
                                 { onSuccess: onClose }
                              )
                           }
                           disabled={isLoading}
                        >
                           {isLoading && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           )}
                           Xác nhận tham gia
                        </Button>
                        <Button
                           variant="destructive"
                           onClick={() =>
                              updateMutation.mutate(
                                 {
                                    sessionId: session._id,
                                    payload: { status: SessionStatus.REJECTED },
                                 },
                                 { onSuccess: onClose }
                              )
                           }
                           disabled={isLoading}
                        >
                           {isLoading && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           )}
                           Từ chối
                        </Button>
                     </>
                  )}

                  {(FORCE_SHOW_COMPLETE_BUTTON || (isTutor && canModify)) && (
                     <Button
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() =>
                           updateMutation.mutate(
                              {
                                 sessionId: session._id,
                                 payload: { status: SessionStatus.COMPLETED },
                              },
                              { onSuccess: onClose }
                           )
                        }
                        disabled={isLoading}
                     >
                        {isLoading
                           ? "Đang xử lý..."
                           : "Đánh dấu hoàn thành (test)"}
                     </Button>
                  )}

                  {showMarkCompleted && (
                     <Button
                        onClick={() =>
                           updateMutation.mutate(
                              {
                                 sessionId: session._id,
                                 payload: { status: SessionStatus.COMPLETED },
                              },
                              { onSuccess: onClose }
                           )
                        }
                        disabled={isLoading}
                     >
                        {isLoading ? "Đang xử lý..." : "Đánh dấu hoàn thành"}
                     </Button>
                  )}

                  {canModify && (
                     <Button variant="outline" onClick={() => onEdit(session)}>
                        Chỉnh sửa
                     </Button>
                  )}
                  {canDelete && (
                     <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                     >
                        Xóa
                     </Button>
                  )}

                  <Button onClick={onClose}>Đóng</Button>
               </div>
               <Button
                  variant="link"
                  onClick={() => navigate(`/session/${session._id}`)}
                  className="p-0 h-auto"
               >
                  Xem trang chi tiết
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
