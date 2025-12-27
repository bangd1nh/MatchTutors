import { useParams, useNavigate } from "react-router-dom";
import { useSessionsByCommitment } from "@/hooks/useSessions";
import { Session } from "@/types/session";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Users, Clock } from "lucide-react";
import { translateSessionStatus } from "@/utils/statusTranslations";
import { useUser } from "@/hooks/useUser";

type Props = {
   commitmentId?: string;
};

const getStatusBadgeClasses = (status: string) => {
   const s = status?.toLowerCase?.() || "";
   if (s.includes("completed")) return "bg-green-100 text-green-800";
   if (s.includes("cancel") || s.includes("rejected"))
      return "bg-red-100 text-red-800";
   if (s.includes("dispute")) return "bg-purple-100 text-purple-800";
   if (s.includes("confirmed")) return "bg-blue-100 text-blue-800";
   if (s.includes("scheduled") || s.includes("pending"))
      return "bg-yellow-100 text-yellow-800";
   return "bg-muted text-muted-foreground";
};

export default function SessionByLearningCommitment({
   commitmentId: propId,
}: Props) {
   const navigate = useNavigate();
   const { user } = useUser();
   const params = useParams<{ commitmentId: string }>();
   const commitmentId = propId || params.commitmentId;
   const {
      data: sessions,
      isLoading,
      isError,
   } = useSessionsByCommitment(commitmentId);

   const sessionDetailPath = (sessionId: string) => {
      const role = String(user?.role || "").toUpperCase();
      if (role === "TUTOR") return `/tutor/session/${sessionId}`;
      if (role === "STUDENT") return `/student/session/${sessionId}`;
      return `/session/${sessionId}`;
   };

   if (!commitmentId) return <div>Commitment ID is required</div>;
   if (isLoading)
      return (
         <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">
               Đang tải...
            </div>
         </div>
      );
   if (isError)
      return (
         <div className="text-center py-8 text-destructive">
            Lỗi khi tải danh sách buổi học
         </div>
      );

   return (
      <div className="space-y-6">
         <div className="flex items-center gap-3">
            <Button
               variant="ghost"
               size="sm"
               onClick={() => navigate(-1)}
               className="text-muted-foreground hover:text-foreground"
            >
               <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold">
               Danh sách buổi học của cam kết{" "}
            </h2>
         </div>

         <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted">
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Buổi học theo cam kết</span>
               </div>
               <div className="text-sm text-muted-foreground">
                  Tổng: {Array.isArray(sessions) ? sessions.length : 0}
               </div>
            </div>

            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-border bg-muted text-sm font-medium text-muted-foreground">
               <div className="col-span-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Gia sư
               </div>
               <div className="col-span-3 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Sinh viên
               </div>
               <div className="col-span-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Thời gian
               </div>
               <div className="col-span-2 text-right flex items-center justify-end gap-2">
                  <Calendar className="w-4 h-4" /> Trạng thái
               </div>
            </div>

            {Array.isArray(sessions) && sessions.length > 0 ? (
               <ul className="divide-y">
                  {sessions.map((s: Session) => {
                     const start = s.startTime ? new Date(s.startTime) : null;
                     const end = s.endTime ? new Date(s.endTime) : null;
                     const statusLabel = translateSessionStatus(
                        String(s.status)
                     );
                     const tutorName =
                        (s.learningCommitmentId as any)?.tutor?.userId?.name ||
                        (s.learningCommitmentId as any)?.tutor ||
                        "—";
                     const studentName =
                        (s.learningCommitmentId as any)?.student?.userId
                           ?.name ||
                        (s.learningCommitmentId as any)?.student ||
                        "—";

                     return (
                        <li
                           key={(s as any)._id}
                           className="px-4 py-4 hover:bg-muted/50 transition-colors cursor-pointer"
                           onClick={() =>
                              navigate(sessionDetailPath((s as any)._id))
                           }
                        >
                           {/* Desktop row */}
                           <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-3">
                                 <div className="text-sm font-medium text-foreground truncate flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />{" "}
                                    {tutorName}
                                 </div>
                              </div>
                              <div className="col-span-3">
                                 <div className="text-sm text-foreground truncate flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted-foreground" />{" "}
                                    {studentName}
                                 </div>
                              </div>
                              <div className="col-span-4">
                                 <div className="text-sm text-muted-foreground truncate flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    {start
                                       ? format(
                                            start,
                                            "EEEE, dd/MM/yyyy HH:mm",
                                            { locale: vi }
                                         )
                                       : "—"}{" "}
                                    - {end ? format(end, "HH:mm") : "—"}
                                 </div>
                              </div>
                              <div className="col-span-2 text-right">
                                 <span
                                    className={
                                       "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium " +
                                       getStatusBadgeClasses(String(s.status))
                                    }
                                 >
                                    {statusLabel}
                                 </span>
                              </div>
                           </div>

                           {/* Mobile stacked */}
                           <div className="md:hidden flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                 <div className="text-sm font-medium text-foreground truncate">
                                    {start
                                       ? format(
                                            start,
                                            "EEEE, dd/MM/yyyy HH:mm",
                                            { locale: vi }
                                         )
                                       : "—"}
                                 </div>
                                 <span
                                    className={
                                       "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium " +
                                       getStatusBadgeClasses(String(s.status))
                                    }
                                 >
                                    {statusLabel}
                                 </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                 <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-foreground truncate">
                                       {tutorName}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 mt-1">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-foreground truncate">
                                       {studentName}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </li>
                     );
                  })}
               </ul>
            ) : (
               <div className="text-center py-8 text-muted-foreground">
                  Không có buổi học nào.
               </div>
            )}
         </div>
      </div>
   );
}
