import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Calendar,
   Clock,
   User,
   BookOpen,
   XCircle,
   AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Session } from "@/types/session";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

interface SessionCardProps {
   session: Session;
   type: "rejected" | "cancelled";
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

   const getStatusBadge = () => {
      if (type === "rejected") {
         return <Badge variant="destructive">Đã từ chối</Badge>;
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
      <Card className="hover:shadow-md transition-shadow">
         <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
               <CardTitle className="text-lg">
                  {subjectInfo.subject} - {subjectInfo.level}
               </CardTitle>
               {getStatusBadge()}
            </div>
         </CardHeader>
         <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                     <Calendar className="h-4 w-4" />
                     <span>{formatDate(session.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                     <Clock className="h-4 w-4" />
                     <span>
                        {formatTime(session.startTime)} -{" "}
                        {formatTime(session.endTime)}
                     </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                     <User className="h-4 w-4" />
                     <span>
                        {participant.name} ({participant.role})
                     </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                     <BookOpen className="h-4 w-4" />
                     <span>
                        {session.isTrial
                           ? "Buổi học thử"
                           : "Buổi học chính thức"}
                     </span>
                  </div>
               </div>

               <div className="space-y-2">
                  {type === "rejected" && session.studentConfirmation && (
                     <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                           Xác nhận của học sinh:{" "}
                        </span>
                        <Badge
                           variant={
                              session.studentConfirmation.status === "REJECTED"
                                 ? "destructive"
                                 : "default"
                           }
                        >
                           {session.studentConfirmation.status === "REJECTED"
                              ? "Từ chối"
                              : "Chấp nhận"}
                        </Badge>
                     </div>
                  )}

                  {type === "rejected" && session.deletedAt && (
                     <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span>Xóa lúc: {formatDate(session.deletedAt)}</span>
                     </div>
                  )}

                  {type === "cancelled" && session.cancellation && (
                     <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                           {getStatusIcon()}
                           <span>Lý do hủy: {session.cancellation.reason}</span>
                        </div>
                        <div className="mt-1">
                           <span>
                              Hủy lúc:{" "}
                              {formatDate(session.cancellation.cancelledAt)}
                           </span>
                        </div>
                        {session.cancellation.cancelledBy && (
                           <div className="mt-1">
                              <span>
                                 Hủy bởi:{" "}
                                 {(session.cancellation.cancelledBy as any)
                                    ?.name || "Người dùng"}
                              </span>
                           </div>
                        )}
                     </div>
                  )}

                  {session.createdBy && (
                     <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span>
                           Tạo bởi:{" "}
                           {(session.createdBy as any)?.name || "Người dùng"}
                        </span>
                     </div>
                  )}
               </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/session/${session._id}`)}
                  className="w-full"
               >
                  Xem chi tiết
               </Button>
            </div>
         </CardContent>
      </Card>
   );
};

export default SessionCard;
