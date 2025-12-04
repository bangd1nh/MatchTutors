import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Calendar,
   Clock,
   BookOpen,
   XCircle,
   AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Session } from "@/types/session";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { getSubjectLabelVi, getLevelLabelVi } from "@/utils/educationDisplay";

// Tìm interface SessionCardProps trong SessionCard.tsx và update:
interface SessionCardProps {
   session: Session;
   type: "rejected" | "cancelled" | "absence"; // Thêm "absence"
}

const SessionCard: React.FC<SessionCardProps> = ({ session, type }) => {
   const navigate = useNavigate();
   const { user } = useUser();

   const formatDate = (date: string | Date) => {
      return format(new Date(date), "dd/MM/yyyy", { locale: vi });
   };

   const formatTime = (date: string | Date) => {
      return format(new Date(date), "HH:mm", { locale: vi });
   };

   const getParticipantInfo = (session: Session) => {
      const lc: any = (session as any).learningCommitmentId;
      const isStudent = user?.role === "STUDENT";

      if (isStudent) {
         return {
            name:
               lc?.tutor?.userId?.name ||
               [lc?.tutor?.firstName, lc?.tutor?.lastName]
                  .filter(Boolean)
                  .join(" ") ||
               "Gia sư",
            avatar: lc?.tutor?.userId?.avatarUrl,
            role: "Gia sư",
         };
      } else {
         return {
            name:
               lc?.student?.userId?.name ||
               [lc?.student?.firstName, lc?.student?.lastName]
                  .filter(Boolean)
                  .join(" ") ||
               "Học sinh",
            avatar: lc?.student?.userId?.avatarUrl,
            role: "Học sinh",
         };
      }
   };

   const getSubjectInfo = (session: Session) => {
      const lc: any = (session as any).learningCommitmentId;
      return {
         subject: lc?.teachingRequest?.subject || "Môn học",
         level: lc?.teachingRequest?.level || "Cấp độ",
      };
   };

   const participant = getParticipantInfo(session);
   const subjectInfo = getSubjectInfo(session);

   // route prefix based on role: TUTOR -> /tutor, STUDENT -> /student, fallback -> ''
   const routePrefix =
      user?.role === "TUTOR"
         ? "/tutor"
         : user?.role === "STUDENT"
         ? "/student"
         : "";

   const getStatusBadge = () => {
      if (type === "rejected") {
         return <Badge variant="destructive">Đã từ chối</Badge>;
      } else if (type === "absence") {
         return <Badge variant="outline">Vắng mặt</Badge>;
      } else {
         return <Badge variant="secondary">Đã hủy</Badge>;
      }
   };

   const getStatusIcon = () => {
      if (type === "rejected") {
         return <XCircle className="h-4 w-4" />;
      } else {
         return <AlertTriangle className="h-4 w-4" />;
      }
   };

   return (
      <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-transparent dark:border-neutral-800">
         <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-amber-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-800 p-4">
            <div className="flex items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="leading-tight">
                     <div className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                        {getSubjectLabelVi(subjectInfo.subject)}
                     </div>
                     <div className="text-xs text-amber-800 dark:text-amber-300">
                        {getLevelLabelVi(subjectInfo.level)}
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <div className="text-xs text-neutral-600 dark:text-neutral-400 mr-2">
                     {getStatusBadge()}
                  </div>
               </div>
            </div>
         </div>

         <CardContent className="p-4 bg-white dark:bg-neutral-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                     <Calendar className="h-4 w-4 text-rose-400" />
                     <span className="font-medium">
                        {formatDate(session.startTime)}
                     </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                     <Clock className="h-4 w-4 text-amber-400" />
                     <span className="font-medium">
                        {formatTime(session.startTime)} —{" "}
                        {formatTime(session.endTime)}
                     </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                     <span className="font-medium">{participant.name}</span>{" "}
                     <span className="text-xs text-neutral-500">
                        ({participant.role})
                     </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                     <BookOpen className="h-4 w-4 text-sky-400" />
                     <span className="italic text-sm">
                        {session.isTrial
                           ? "Buổi học thử"
                           : "Buổi học chính thức"}
                     </span>
                  </div>
               </div>

               <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                  {type === "rejected" && session.studentConfirmation && (
                     <div className="flex flex-col gap-2 bg-rose-50/60 dark:bg-neutral-800 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                           <div className="text-xs text-neutral-600">
                              Xác nhận của học sinh
                           </div>
                           <Badge
                              variant={
                                 session.studentConfirmation.status ===
                                 "REJECTED"
                                    ? "destructive"
                                    : "default"
                              }
                           >
                              {session.studentConfirmation.status === "REJECTED"
                                 ? "Từ chối"
                                 : "Chấp nhận"}
                           </Badge>
                        </div>
                     </div>
                  )}

                  {type === "rejected" && session.deletedAt && (
                     <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        <span className="text-xs">Xóa lúc: </span>
                        <span className="font-medium">
                           {formatDate(session.deletedAt)}
                        </span>
                     </div>
                  )}

                  {type === "cancelled" && session.cancellation && (
                     <div className="flex flex-col gap-2 bg-amber-50/50 dark:bg-neutral-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                           {getStatusIcon()}
                           <span className="font-medium">Lý do hủy:</span>
                           <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 ml-2">
                              {session.cancellation.reason}
                           </span>
                        </div>
                        <div className="text-xs text-neutral-500">
                           Hủy lúc:{" "}
                           <span className="font-medium">
                              {formatDate(session.cancellation.cancelledAt)}
                           </span>
                        </div>
                        {session.cancellation.cancelledBy && (
                           <div className="text-xs text-neutral-500">
                              Hủy bởi:{" "}
                              <span className="font-medium">
                                 {(session.cancellation.cancelledBy as any)
                                    ?.name || "Người dùng"}
                              </span>
                           </div>
                        )}
                     </div>
                  )}

                  {type === "absence" && session.absence && (
                     <div className="flex flex-col gap-2 bg-sky-50/40 dark:bg-neutral-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                           <AlertTriangle className="h-4 w-4 text-sky-500" />
                           <span className="font-medium">
                              {session.absence.tutorAbsent && "Gia sư vắng"}
                              {session.absence.tutorAbsent &&
                                 session.absence.studentAbsent &&
                                 ", "}
                              {session.absence.studentAbsent && "Học sinh vắng"}
                           </span>
                        </div>
                        {session.absence.reason && (
                           <div className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                              Lý do:{" "}
                              <span className="font-medium">
                                 {session.absence.reason}
                              </span>
                           </div>
                        )}
                     </div>
                  )}

                  {session.createdBy && (
                     <div className="text-xs text-neutral-500">
                        Tạo bởi:{" "}
                        <span className="font-medium">
                           {(session.createdBy as any)?.name || "Người dùng"}
                        </span>
                     </div>
                  )}
               </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                     navigate(`${routePrefix}/session/${session._id}`)
                  }
                  className="w-full rounded-xl"
               >
                  Xem chi tiết
               </Button>
            </div>
         </CardContent>
      </Card>
   );
};

export default SessionCard;
