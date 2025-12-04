import { useState } from "react";
import { useTutorTeachingRequests } from "@/hooks/useTeachingRequest";
import {
   Card,
   CardHeader,
   CardTitle,
   CardContent,
   CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
   Loader2,
   ArrowRight,
   BookOpen,
   Users,
   CheckCircle,
   XCircle,
   Clock,
} from "lucide-react";
import { TeachingRequestStatusBadge } from "@/components/common/TeachingRequestStatusBadge";
import { TeachingRequest } from "@/types/teachingRequest";
import { RequestDetailModal } from "@/components/tutor/teaching-request/RequestDetailModal";
import { TeachingRequestStatus } from "@/enums/teachingRequest.enum";
import { getSubjectLabelVi, getLevelLabelVi } from "@/utils/educationDisplay";
import { Pagination } from "@/components/common/Pagination";

export default function TeachingRequestsList() {
   const [page, setPage] = useState(1);
   const [limit] = useState(9); // thay đổi nếu muốn
   const {
      data: listData,
      isLoading,
      isError,
   } = useTutorTeachingRequests(page, limit);
   const requests = listData?.data ?? [];
   const pagination = listData?.pagination;

   const [selectedRequest, setSelectedRequest] =
      useState<TeachingRequest | null>(null);

   const handleViewRequest = (request: TeachingRequest) => {
      setSelectedRequest(request);
   };

   const handleCloseModal = () => {
      setSelectedRequest(null);
   };

   if (isLoading)
      return (
         <div className="flex items-center justify-center py-32">
            <div className="text-center">
               <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
               <p className="text-muted-foreground">Đang tải yêu cầu...</p>
            </div>
         </div>
      );

   if (isError)
      return (
         <div className="p-8 text-center">
            <div className="inline-block p-4 bg-red-50 rounded-lg">
               <p className="text-red-600 font-medium">
                  Không thể tải yêu cầu dạy học
               </p>
               <p className="text-red-500 text-sm mt-1">Vui lòng thử lại sau</p>
            </div>
         </div>
      );

   const pendingRequests = (requests || []).filter(
      (r) => r.status === TeachingRequestStatus.PENDING
   );
   const acceptedRequests = (requests || []).filter(
      (r) => r.status === TeachingRequestStatus.ACCEPTED
   );
   const rejectedRequests = (requests || []).filter(
      (r) => r.status === TeachingRequestStatus.REJECTED
   );

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
         <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                     <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900">
                     Yêu cầu dạy học
                  </h1>
               </div>
               <p className="text-slate-600 ml-11">
                  Quản lý và phản hồi các yêu cầu từ học sinh của bạn
               </p>
            </div>

            {/* Stats Section */}
            {(requests || []).length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm text-slate-600">
                              Tổng yêu cầu
                           </p>
                           <p className="text-2xl font-bold text-slate-900 mt-1">
                              {pagination?.total ?? requests.length}
                           </p>
                        </div>
                        <Users className="h-8 w-8 text-slate-300" />
                     </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200 hover:border-amber-300 transition-colors">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm text-slate-600">Chờ xử lý</p>
                           <p className="text-2xl font-bold text-amber-600 mt-1">
                              {pendingRequests.length}
                           </p>
                        </div>
                        <Clock className="h-8 w-8 text-amber-300" />
                     </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200 hover:border-green-300 transition-colors">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm text-slate-600">
                              Đã chấp nhận
                           </p>
                           <p className="text-2xl font-bold text-green-600 mt-1">
                              {acceptedRequests.length}
                           </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-300" />
                     </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200 hover:border-red-300 transition-colors">
                     <div className="flex items-center justify-between">
                        <div>
                           <p className="text-sm text-slate-600">Từ chối</p>
                           <p className="text-2xl font-bold text-red-600 mt-1">
                              {rejectedRequests.length}
                           </p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-300" />
                     </div>
                  </div>
               </div>
            )}

            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
               <div className="mb-8">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                     <Clock className="h-5 w-5 text-amber-500" />
                     Yêu cầu chưa xử lý ({pendingRequests.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {pendingRequests.map((r) => (
                        <RequestCard
                           key={r._id}
                           request={r}
                           onViewRequest={handleViewRequest}
                        />
                     ))}
                  </div>
               </div>
            )}

            {/* Accepted Requests Section */}
            {acceptedRequests.length > 0 && (
               <div className="mb-8">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                     <CheckCircle className="h-5 w-5 text-green-500" />
                     Đã chấp nhận ({acceptedRequests.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {acceptedRequests.map((r) => (
                        <RequestCard
                           key={r._id}
                           request={r}
                           onViewRequest={handleViewRequest}
                        />
                     ))}
                  </div>
               </div>
            )}

            {/* Rejected Requests Section */}
            {rejectedRequests.length > 0 && (
               <div className="mb-8">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                     <XCircle className="h-5 w-5 text-red-500" />
                     Từ chối ({rejectedRequests.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {rejectedRequests.map((r) => (
                        <RequestCard
                           key={r._id}
                           request={r}
                           onViewRequest={handleViewRequest}
                        />
                     ))}
                  </div>
               </div>
            )}

            {/* Empty State */}
            {(requests || []).length === 0 && (
               <div className="text-center py-16 bg-white rounded-lg border border-slate-200">
                  <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                     Không có yêu cầu nào
                  </h3>
                  <p className="text-slate-600">
                     Bạn sẽ nhận được thông báo khi học sinh gửi yêu cầu dạy học
                  </p>
               </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages >= 1 && (
               <div className="mt-6 flex items-center justify-center">
                  <Pagination
                     currentPage={pagination.page}
                     totalPages={pagination.totalPages}
                     onPageChange={(p) => setPage(p)}
                     maxVisiblePages={5}
                  />
               </div>
            )}
         </div>

         {/* Render Modal */}
         <RequestDetailModal
            isOpen={!!selectedRequest}
            onClose={handleCloseModal}
            request={selectedRequest}
         />
      </div>
   );
}

// Component con để render từng card yêu cầu
interface RequestCardProps {
   request: TeachingRequest;
   onViewRequest: (request: TeachingRequest) => void;
}

function RequestCard({ request: r, onViewRequest }: RequestCardProps) {
   return (
      <Card className="group hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden">
         <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
               <div className="flex-1">
                  <CardTitle className="text-base text-slate-900 line-clamp-1">
                     Môn học - {getSubjectLabelVi(r.subject)}
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-1">
                     Lớp - {getLevelLabelVi(r.level)}
                  </p>
               </div>
               <TeachingRequestStatusBadge status={r.status} />
            </div>
         </CardHeader>

         <CardContent className="pb-4">
            {/* Student Info */}
            <div className="flex items-center gap-3 mb-4">
               <Avatar className="h-10 w-10 ring-2 ring-slate-100">
                  <AvatarImage
                     src={
                        typeof r.studentId === "object"
                           ? r.studentId.userId.avatarUrl
                           : "/placeholder.svg"
                     }
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                     {typeof r.studentId === "object"
                        ? r.studentId.userId.name?.charAt(0)
                        : "S"}
                  </AvatarFallback>
               </Avatar>
               <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">
                     {typeof r.studentId === "object"
                        ? r.studentId.userId.name
                        : "Student"}
                  </p>
                  <p className="text-xs text-slate-500">Học sinh</p>
               </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-3 rounded-md">
               {r.description || "Không có mô tả"}
            </p>
         </CardContent>

         <CardFooter>
            <Button
               onClick={() => onViewRequest(r)}
               className="w-full bg-primary hover:bg-primary/90 text-white group-hover:gap-2 transition-all"
            >
               Xem chi tiết <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
         </CardFooter>
      </Card>
   );
}
