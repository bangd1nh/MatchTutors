import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, BookOpen } from "lucide-react";
import type { NextSessionDTO } from "@/types/studentDashboard";
import { getSubjectLabelVi } from "@/utils/educationDisplay";
import { translateStatus } from "@/utils/studentDashboard";

interface NextSessionCardProps {
   session: NextSessionDTO | null;
}

export function NextSessionCard({ session }: NextSessionCardProps) {
   if (!session) {
      return (
         <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg text-gray-800">
                  Buổi học tiếp theo
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Không có buổi học sắp tới</p>
               </div>
            </CardContent>
         </Card>
      );
   }

   const startTime = new Date(session.startTime);
   const endTime = new Date(session.endTime);

   const dateString = startTime.toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
   });

   const timeString = `${startTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
   })} - ${endTime.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
   })}`;

   const statusColor =
      {
         confirmed: "bg-green-500",
         pending: "bg-yellow-500",
         scheduled: "bg-blue-500",
         default: "bg-gray-500",
      }[session.status.toLowerCase()] || "bg-gray-500";

   return (
      <Card className="border border-gray-200 shadow-sm h-full flex flex-col">
         <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
               <CardTitle className="text-lg text-gray-800">
                  Buổi học tiếp theo
               </CardTitle>
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                  <span className="text-sm text-gray-600 capitalize">
                     {translateStatus("SESSION", session.status)}
                  </span>
               </div>
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            {/* Ngày & thời gian */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
               <Calendar className="h-5 w-5 text-blue-600" />
               <div>
                  <p className="font-semibold text-blue-900">{dateString}</p>
                  <p className="text-sm text-blue-700">{timeString}</p>
               </div>
            </div>

            {/* Gia sư & Môn học */}
            <div className="grid grid-cols-2 gap-3">
               <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                  <User className="h-4 w-4 text-purple-600" />
                  <div>
                     <p className="text-xs text-purple-700">Gia sư</p>
                     <p className="font-semibold text-purple-900 text-sm">
                        {session.tutorName}
                     </p>
                  </div>
               </div>
               <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <div>
                     <p className="text-xs text-green-700">Môn học</p>
                     <p className="font-semibold text-green-900 text-sm">
                        {getSubjectLabelVi(session.subject)}
                     </p>
                  </div>
               </div>
            </div>

            {/* Xác nhận của học viên */}
            {session.studentConfirmation && (
               <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Xác nhận của bạn</p>
                  <Badge
                     className={
                        session.studentConfirmation.status === "accepted"
                           ? "bg-green-100 text-green-800 hover:bg-green-100"
                           : session.studentConfirmation.status === "rejected"
                           ? "bg-red-100 text-red-800 hover:bg-red-100"
                           : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                     }
                  >
                     {translateStatus(
                        "STUDENT_CONFIRMATION",
                        session.studentConfirmation.status
                     )}
                  </Badge>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
