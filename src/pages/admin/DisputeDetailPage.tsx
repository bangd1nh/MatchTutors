import { useParams, useNavigate } from "react-router-dom";
import { useSessionDispute } from "@/hooks/useAdminSessions";
import DisputeDetailModal from "@/components/admin/session-dispute/DisputeDetailModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";

export default function DisputeDetailPage() {
   const { sessionId } = useParams<{ sessionId: string }>();
   const navigate = useNavigate();
   const { data: session, isLoading } = useSessionDispute(sessionId);
   const [openModal, setOpenModal] = useState(false);

   if (isLoading) {
      return <div className="p-4">Đang tải...</div>;
   }

   if (!session) {
      return (
         <div className="p-4">
            <p>Không tìm thấy tranh chấp</p>
            <Button
               onClick={() => navigate("/admin/disputes")}
               className="mt-4"
            >
               Quay lại
            </Button>
         </div>
      );
   }

   const student = session.learningCommitmentId?.student?.userId;
   const tutor = session.learningCommitmentId?.tutor?.userId;

   return (
      <div className="container mx-auto p-6">
         <div className="mb-6">
            <Button
               variant="outline"
               onClick={() => navigate("/admin/disputes")}
            >
               ← Quay lại
            </Button>
         </div>

         <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h1 className="text-3xl font-bold mb-2">
                     Chi tiết tranh chấp buổi học
                  </h1>
                  <Badge
                     variant={
                        session.dispute?.status === "OPEN"
                           ? "destructive"
                           : "secondary"
                     }
                  >
                     {session.dispute?.status === "OPEN"
                        ? "Đang mở"
                        : "Đã giải quyết"}
                  </Badge>
               </div>
               {session.dispute?.status === "OPEN" && (
                  <Button onClick={() => setOpenModal(true)}>
                     Giải quyết tranh chấp
                  </Button>
               )}
            </div>

            {/* Thông tin buổi học */}
            <div className="grid grid-cols-2 gap-8 mb-8">
               <div>
                  <h2 className="text-lg font-semibold mb-4">
                     Thông tin buổi học
                  </h2>
                  <div className="space-y-3">
                     <div>
                        <p className="text-sm text-gray-600">
                           Ngày giờ buổi học
                        </p>
                        <p className="font-medium">
                           {format(
                              new Date(session.startTime),
                              "dd/MM/yyyy HH:mm"
                           )}
                           {" - "}
                           {format(new Date(session.endTime), "HH:mm")}
                        </p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Trạng thái</p>
                        <p className="font-medium">{session.status}</p>
                     </div>
                  </div>
               </div>

               <div>
                  <h2 className="text-lg font-semibold mb-4">
                     Thông tin người tham gia
                  </h2>
                  <div className="space-y-3">
                     <div>
                        <p className="text-sm text-gray-600">Học sinh</p>
                        <p className="font-medium">{student?.name}</p>
                        <p className="text-sm text-gray-500">
                           {student?.email}
                        </p>
                     </div>
                     <div>
                        <p className="text-sm text-gray-600">Gia sư</p>
                        <p className="font-medium">{tutor?.name}</p>
                        <p className="text-sm text-gray-500">{tutor?.email}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Thông tin tranh chấp */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
               <h2 className="text-lg font-semibold text-red-900 mb-4">
                  Thông tin tranh chấp
               </h2>
               <div className="space-y-3 text-red-800">
                  <div>
                     <p className="text-sm text-red-700">Lý do</p>
                     <p className="font-medium">{session.dispute?.reason}</p>
                  </div>
                  <div>
                     <p className="text-sm text-red-700">Mở tranh chấp lúc</p>
                     <p className="font-medium">
                        {format(
                           new Date(session.dispute?.openedAt || ""),
                           "dd/MM/yyyy HH:mm"
                        )}
                     </p>
                  </div>
               </div>
            </div>

            {/* Thông tin giải quyết (nếu đã giải quyết) */}
            {session.dispute?.status === "RESOLVED" && (
               <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
                  <h2 className="text-lg font-semibold text-green-900 mb-4">
                     Thông tin giải quyết
                  </h2>
                  <div className="space-y-3 text-green-800">
                     <div>
                        <p className="text-sm text-green-700">Quyết định</p>
                        <p className="font-medium">
                           {session.dispute.decision === "COMPLETED"
                              ? "Xác nhận buổi học đã diễn ra"
                              : "Buổi học không diễn ra"}
                        </p>
                     </div>
                     {session.dispute.adminNotes && (
                        <div>
                           <p className="text-sm text-green-700">
                              Ghi chú của quản trị viên
                           </p>
                           <p className="font-medium">
                              {session.dispute.adminNotes}
                           </p>
                        </div>
                     )}
                     <div>
                        <p className="text-sm text-green-700">Giải quyết lúc</p>
                        <p className="font-medium">
                           {format(
                              new Date(session.dispute.resolvedAt || ""),
                              "dd/MM/yyyy HH:mm"
                           )}
                        </p>
                     </div>
                  </div>
               </div>
            )}
         </div>

         <DisputeDetailModal
            session={session}
            open={openModal}
            onOpenChange={setOpenModal}
         />
      </div>
   );
}
