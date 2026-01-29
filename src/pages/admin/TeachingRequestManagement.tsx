import React, { useState } from "react";
import {
   useGetPendingRequests,
   useGetResolvedRequests,
   useGetRecentlyResolvedRequests, // Import the new hook
   AdminTeachingRequest,
} from "@/hooks/useAdminTeachingRequests";
import { AdminRequestDetailModal } from "@/components/admin/teaching-request/AdminRequestDetailModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   AlertTriangleIcon,
   CheckCircleIcon,
   EyeIcon,
   BookOpenIcon,
   CalendarIcon,
   MessageSquareIcon,
   Loader2,
} from "lucide-react";
import moment from "moment";

const TeachingRequestManagement: React.FC = () => {
   const [selectedRequest, setSelectedRequest] =
      useState<AdminTeachingRequest | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [activeTab, setActiveTab] = useState("pending");

   // Fetch data
   const {
      data: pendingData,
      isLoading: isPendingLoading,
      error: pendingError,
   } = useGetPendingRequests({ page: 1, limit: 20 });

   const {
      data: resolvedData,
      isLoading: isResolvedLoading,
      error: resolvedError,
   } = useGetResolvedRequests({ page: 1, limit: 20 });

   // NEW: Fetch recently resolved requests
   const {
      data: recentlyResolvedData,
      isLoading: isRecentlyResolvedLoading,
      error: recentlyResolvedError,
   } = useGetRecentlyResolvedRequests({ page: 1, limit: 20 });

   const handleViewDetail = (request: AdminTeachingRequest) => {
      setSelectedRequest(request);
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedRequest(null);
   };

   const getConflictType = (request: AdminTeachingRequest) => {
      if (request.cancellationDecision?.adminReviewRequired) {
         return {
            type: "Tranh chấp hủy khóa",
            color: "bg-red-100 text-red-800",
         };
      }
      if (request.complete_pending?.adminReviewRequired) {
         return {
            type: "Tranh chấp hoàn thành",
            color: "bg-blue-100 text-blue-800",
         };
      }
      return { type: "Không xác định", color: "bg-gray-100 text-gray-800" };
   };

   const getResolvedInfo = (request: AdminTeachingRequest) => {
      const cancellation = request.cancellationDecision;
      const completion = request.complete_pending;

      if (cancellation?.adminResolvedAt) {
         return {
            resolvedAt: cancellation.adminResolvedAt,
            notes: cancellation.adminNotes,
            type: "hủy khóa học",
         };
      }

      if (completion?.adminResolvedAt) {
         return {
            resolvedAt: completion.adminResolvedAt,
            notes: completion.adminNotes,
            type: "hoàn thành khóa học",
         };
      }

      return null;
   };

   const PendingRequestCard = ({
      request,
   }: {
      request: AdminTeachingRequest;
   }) => {
      const conflict = getConflictType(request);
      const studentUser = request.studentId?.userId || {};
      const tutorUser = request.tutorId?.userId || {};
      const studentName = studentUser.name || studentUser.email || "Chưa có tên";
      const tutorName = tutorUser.name || tutorUser.email || "Chưa có tên";
      const studentInitial = (studentUser.name?.charAt(0) || studentUser.email?.charAt(0) || "H").toUpperCase();
      const tutorInitial = (tutorUser.name?.charAt(0) || tutorUser.email?.charAt(0) || "G").toUpperCase();
      const subject = request.subject || "Chưa có môn";
      const level = request.level || "Chưa có";

      return (
         <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                     <BookOpenIcon className="h-5 w-5" />
                     {subject} - Lớp {level}
                  </CardTitle>
                  <Badge className={conflict.color}>{conflict.type}</Badge>
               </div>
            </CardHeader>

            <CardContent className="space-y-4">
               {/* Participants */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={studentUser.avatarUrl} />
                        <AvatarFallback>
                           {studentInitial}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <p className="text-sm font-medium">
                           {studentName}
                        </p>
                        <p className="text-xs text-gray-500">Học sinh</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={tutorUser.avatarUrl} />
                        <AvatarFallback>
                           {tutorInitial}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <p className="text-sm font-medium">
                           {tutorName}
                        </p>
                        <p className="text-xs text-gray-500">Gia sư</p>
                     </div>
                  </div>
               </div>

               {/* Conflict reason */}
               {(request.cancellationDecision?.reason ||
                  request.complete_pending?.reason) && (
                  <div className="bg-gray-50 p-3 rounded">
                     <div className="flex items-start gap-2">
                        <MessageSquareIcon className="h-4 w-4 mt-0.5 text-gray-500" />
                        <div>
                           <p className="text-xs text-gray-600 mb-1">Lý do:</p>
                           <p className="text-sm">
                              {request.cancellationDecision?.reason ||
                                 request.complete_pending?.reason}
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {/* Timeline */}
               <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                     Tạo: {moment(request.createdAt).format("DD/MM/YYYY HH:mm")}
                  </span>
                  <span>•</span>
                  <span>
                     Cập nhật:{" "}
                     {moment(request.updatedAt).format("DD/MM/YYYY HH:mm")}
                  </span>
               </div>

               {/* Action button */}
               <Button
                  onClick={() => handleViewDetail(request)}
                  className="w-full"
                  variant="outline"
               >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Xem chi tiết & Xử lý
               </Button>
            </CardContent>
         </Card>
      );
   };

   const ResolvedRequestCard = ({
      request,
   }: {
      request: AdminTeachingRequest;
   }) => {
      const resolvedInfo = getResolvedInfo(request);
      const studentUser = request.studentId?.userId || {};
      const tutorUser = request.tutorId?.userId || {};
      const studentName = studentUser.name || studentUser.email || "Chưa có tên";
      const tutorName = tutorUser.name || tutorUser.email || "Chưa có tên";
      const studentInitial = (studentUser.name?.charAt(0) || studentUser.email?.charAt(0) || "H").toUpperCase();
      const tutorInitial = (tutorUser.name?.charAt(0) || tutorUser.email?.charAt(0) || "G").toUpperCase();
      const subject = request.subject || "Chưa có môn";
      const level = request.level || "Chưa có";
      // const conflict = getConflictType(request);

      return (
         <Card className="hover:shadow-md transition-shadow border-green-200">
            <CardHeader className="pb-3">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                     <BookOpenIcon className="h-5 w-5" />
                     {subject} - Lớp {level}
                  </CardTitle>
                  <div className="flex gap-2">
                     <Badge className="bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Đã xử lý
                     </Badge>
                  </div>
               </div>
            </CardHeader>

            <CardContent className="space-y-4">
               {/* Participants */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={studentUser.avatarUrl} />
                        <AvatarFallback>
                           {studentInitial}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <p className="text-sm font-medium">
                           {studentName}
                        </p>
                        <p className="text-xs text-gray-500">Học sinh</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     <Avatar className="h-8 w-8">
                        <AvatarImage src={tutorUser.avatarUrl} />
                        <AvatarFallback>
                           {tutorInitial}
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <p className="text-sm font-medium">
                           {tutorName}
                        </p>
                        <p className="text-xs text-gray-500">Gia sư</p>
                     </div>
                  </div>
               </div>

               {/* Resolution info */}
               {resolvedInfo && (
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <CheckCircleIcon className="h-4 w-4 text-green-600" />
                           <p className="text-sm font-medium">
                              Đã xử lý tranh chấp {resolvedInfo.type}
                           </p>
                        </div>
                        <p className="text-xs text-gray-600">
                           Xử lý lúc:{" "}
                           {moment(resolvedInfo.resolvedAt).format(
                              "DD/MM/YYYY HH:mm"
                           )}
                        </p>
                        {resolvedInfo.notes && (
                           <div>
                              <p className="text-xs text-gray-600 mb-1">
                                 Ghi chú Admin:
                              </p>
                              <p className="text-sm">{resolvedInfo.notes}</p>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {/* Timeline */}
               <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                     Tạo: {moment(request.createdAt).format("DD/MM/YYYY HH:mm")}
                  </span>
               </div>

               {/* Action button */}
               <Button
                  onClick={() => handleViewDetail(request)}
                  className="w-full"
                  variant="outline"
               >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Xem chi tiết
               </Button>
            </CardContent>
         </Card>
      );
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h1 className="text-3xl font-bold">Quản lý yêu cầu dạy học</h1>
            <p className="text-muted-foreground mt-2">
               Xem và xử lý các tranh chấp về yêu cầu dạy học giữa học sinh và
               gia sư
            </p>
         </div>

         {/* Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
               <TabsTrigger value="pending" className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-4 w-4" />
                  Cần xử lý ({pendingData?.data?.pagination?.total || 0})
               </TabsTrigger>
               {/* NEW: Recently Resolved Tab Trigger */}
               <TabsTrigger
                  value="recently-resolved"
                  className="flex items-center gap-2"
               >
                  <CheckCircleIcon className="h-4 w-4" />
                  Vừa xử lý (
                  {recentlyResolvedData?.data?.pagination?.total || 0})
               </TabsTrigger>
               <TabsTrigger
                  value="resolved"
                  className="flex items-center gap-2"
               >
                  <BookOpenIcon className="h-4 w-4" />
                  Lịch sử xử lý ({resolvedData?.data?.pagination?.total || 0})
               </TabsTrigger>
            </TabsList>

            {/* Pending Requests Tab */}
            <TabsContent value="pending" className="space-y-4">
               {isPendingLoading ? (
                  <div className="flex items-center justify-center py-20">
                     <Loader2 className="h-8 w-8 animate-spin" />
                     <p className="ml-4">Đang tải dữ liệu...</p>
                  </div>
               ) : pendingError ? (
                  <div className="text-center py-20">
                     <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold text-red-700">
                        Có lỗi xảy ra
                     </h3>
                     <p className="text-red-600">
                        Không thể tải danh sách yêu cầu cần xử lý
                     </p>
                  </div>
               ) : !pendingData?.data?.requests?.length ? (
                  <div className="text-center py-20">
                     <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold">Tuyệt vời!</h3>
                     <p className="text-muted-foreground">
                        Hiện tại không có yêu cầu nào cần xử lý
                     </p>
                  </div>
               ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {pendingData.data.requests.map((request) => (
                        <PendingRequestCard
                           key={request._id}
                           request={request}
                        />
                     ))}
                  </div>
               )}
            </TabsContent>

            {/* NEW: Recently Resolved Tab Content */}
            <TabsContent value="recently-resolved" className="space-y-4">
               {isRecentlyResolvedLoading ? (
                  <div className="flex items-center justify-center py-20">
                     <Loader2 className="h-8 w-8 animate-spin" />
                     <p className="ml-4">Đang tải dữ liệu...</p>
                  </div>
               ) : recentlyResolvedError ? (
                  <div className="text-center py-20">
                     <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold text-red-700">
                        Có lỗi xảy ra
                     </h3>
                     <p className="text-red-600">
                        Không thể tải danh sách yêu cầu vừa xử lý
                     </p>
                  </div>
               ) : !recentlyResolvedData?.data?.requests?.length ? (
                  <div className="text-center py-20">
                     <MessageSquareIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold">
                        Chưa có yêu cầu nào vừa được xử lý
                     </h3>
                     <p className="text-muted-foreground">
                        Các yêu cầu bạn vừa xử lý sẽ hiển thị ở đây.
                     </p>
                  </div>
               ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {recentlyResolvedData.data.requests.map((request) => (
                        <ResolvedRequestCard
                           key={request._id}
                           request={request}
                        />
                     ))}
                  </div>
               )}
            </TabsContent>

            {/* Resolved Requests Tab */}
            <TabsContent value="resolved" className="space-y-4">
               {isResolvedLoading ? (
                  <div className="flex items-center justify-center py-20">
                     <Loader2 className="h-8 w-8 animate-spin" />
                     <p className="ml-4">Đang tải dữ liệu...</p>
                  </div>
               ) : resolvedError ? (
                  <div className="text-center py-20">
                     <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold text-red-700">
                        Có lỗi xảy ra
                     </h3>
                     <p className="text-red-600">
                        Không thể tải danh sách yêu cầu đã xử lý
                     </p>
                  </div>
               ) : !resolvedData?.data?.requests?.length ? (
                  <div className="text-center py-20">
                     <MessageSquareIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                     <h3 className="text-lg font-semibold">
                        Chưa có yêu cầu nào được xử lý
                     </h3>
                     <p className="text-muted-foreground">
                        Lịch sử các yêu cầu đã xử lý sẽ hiển thị ở đây
                     </p>
                  </div>
               ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {resolvedData.data.requests.map((request) => (
                        <ResolvedRequestCard
                           key={request._id}
                           request={request}
                        />
                     ))}
                  </div>
               )}
            </TabsContent>
         </Tabs>

         {/* Detail Modal */}
         <AdminRequestDetailModal
            request={selectedRequest}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
         />
      </div>
   );
};

export default TeachingRequestManagement;
