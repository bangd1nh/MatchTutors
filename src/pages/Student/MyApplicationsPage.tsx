import { useMyTeachingRequests } from "@/hooks/useTeachingRequest";
import { TeachingRequest } from "@/types/teachingRequest";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { TeachingRequestStatusBadge } from "@/components/common/TeachingRequestStatusBadge";
import { Link } from "react-router-dom";
import moment from "moment";
import { useState } from "react";
import { RequestDetailModal } from "@/components/tutor/teaching-request/RequestDetailModal";

const MyApplicationsPage = () => {
   const { data: requests, isLoading, isError } = useMyTeachingRequests();
   const [selectedRequest, setSelectedRequest] =
      useState<TeachingRequest | null>(null);

   const handleViewRequest = (request: TeachingRequest) => {
      setSelectedRequest(request);
   };

   const handleCloseModal = () => {
      setSelectedRequest(null);
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">
               Đang tải các lớp học của bạn...
            </p>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="mt-4 text-red-700 font-semibold">
               Đã xảy ra lỗi khi tải dữ liệu.
            </p>
            <p className="mt-1 text-sm text-red-600">Vui lòng thử lại sau.</p>
         </div>
      );
   }

   if (!requests || requests.length === 0) {
      return (
         <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">Chưa có lớp học nào</h2>
            <p className="mt-2 text-muted-foreground">
               Bạn chưa gửi yêu cầu học cho gia sư nào.
            </p>
            <Button asChild className="mt-6">
               <Link to="/tutor-list">Tìm gia sư ngay</Link>
            </Button>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">
               Lớp học của tôi
            </h1>
            <p className="text-muted-foreground mt-1">
               Quản lý tất cả các yêu cầu dạy học bạn đã gửi.
            </p>
         </div>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
               <ApplicationCard
                  key={request._id}
                  request={request}
                  onViewDetail={handleViewRequest}
               />
            ))}
         </div>
         <RequestDetailModal
            isOpen={!!selectedRequest}
            onClose={handleCloseModal}
            request={selectedRequest}
         />
      </div>
   );
};

const ApplicationCard = ({
   request,
   onViewDetail,
}: {
   request: TeachingRequest;
   onViewDetail: (request: TeachingRequest) => void;
}) => {
   const tutor = request.tutorId?.userId;
   return (
      <Card className="flex flex-col h-full transition-all hover:shadow-md">
         <CardHeader>
            <div className="flex items-start justify-between">
               <CardTitle className="text-lg">Môn: {request.subject}</CardTitle>
               <TeachingRequestStatusBadge status={request.status} />
            </div>
            <CardDescription>Lớp {request.level}</CardDescription>
         </CardHeader>
         <CardContent className="flex-grow">
            <div className="flex items-center space-x-4">
               <Avatar>
                  <AvatarImage src={tutor?.avatarUrl} alt={tutor?.name} />
                  <AvatarFallback>
                     {tutor?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
               <div>
                  <p className="font-semibold">{tutor?.name}</p>
                  <p className="text-sm text-muted-foreground">Gia sư</p>
               </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
               Gửi lúc: {moment(request.createdAt).format("HH:mm DD/MM/YYYY")}
            </div>
         </CardContent>
         <CardFooter>
            <Button
               variant="outline"
               className="w-full"
               onClick={() => onViewDetail(request)}
            >
               Xem chi tiết <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
         </CardFooter>
      </Card>
   );
};

export default MyApplicationsPage;
