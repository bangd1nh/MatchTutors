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

const MyApplicationsPage = () => {
   const { data: requests, isLoading, isError } = useMyTeachingRequests();

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">
               Đang tải danh sách yêu cầu...
            </p>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-8">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-xl font-semibold text-red-700">Lỗi!</h3>
            <p className="mt-2 text-red-600">
               Không thể tải danh sách yêu cầu. Vui lòng thử lại sau.
            </p>
         </div>
      );
   }

   if (!requests || requests.length === 0) {
      return (
         <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">Chưa có yêu cầu nào</h2>
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
               <ApplicationCard key={request._id} request={request} />
            ))}
         </div>
      </div>
   );
};

const ApplicationCard = ({ request }: { request: TeachingRequest }) => {
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
            <Button asChild variant="outline" className="w-full">
               <Link to={`/student/applications/${request._id}`}>
                  Xem chi tiết <ArrowRight className="ml-2 h-4 w-4" />
               </Link>
            </Button>
         </CardFooter>
      </Card>
   );
};

export default MyApplicationsPage;
