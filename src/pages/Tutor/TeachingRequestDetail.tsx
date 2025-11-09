import { useParams, useNavigate } from "react-router-dom";
import {
   useTeachingRequestDetail,
   useRespondToRequest,
} from "@/hooks/useTeachingRequest";
import { useUser } from "@/hooks/useUser";
import { TeachingRequestStatus } from "@/enums/teachingRequest.enum";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardContent,
   CardFooter,
   CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { TeachingRequest } from "@/types/teachingRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeachingRequestStatusBadge } from "@/components/common/TeachingRequestStatusBadge";
import moment from "moment";

export default function TeachingRequestDetail() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();

   const { user } = useUser();
   const { data: req, isLoading, isError } = useTeachingRequestDetail(id ?? "");
   const respond = useRespondToRequest();

   const renderActions = (req: TeachingRequest) => {
      if (!user) return null;

      // Tutor can respond to a pending request
      if (
         req.status === TeachingRequestStatus.PENDING &&
         user.role === "TUTOR"
      ) {
         return (
            <>
               <Button
                  onClick={() =>
                     respond.mutate({
                        requestId: req._id,
                        decision: "ACCEPTED",
                     })
                  }
                  disabled={respond.isPending}
               >
                  Chấp nhận dạy
               </Button>
               <Button
                  variant="destructive"
                  onClick={() =>
                     respond.mutate({
                        requestId: req._id,
                        decision: "REJECTED",
                     })
                  }
                  disabled={respond.isPending}
               >
                  Từ chối
               </Button>
            </>
         );
      }

      return null;
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
         </div>
      );
   }

   if (isError || !req) {
      return (
         <div className="p-6 text-center text-red-500">
            <p>Yêu cầu không tồn tại hoặc đã có lỗi xảy ra.</p>
            <Button
               variant="outline"
               className="mt-4"
               onClick={() => navigate(-1)}
            >
               Quay lại
            </Button>
         </div>
      );
   }

   const student = req.studentId?.userId;

   return (
      <Card className="max-w-3xl mx-auto">
         <CardHeader>
            <CardTitle>
               Yêu cầu dạy: {req.subject} - Lớp {req.level}
            </CardTitle>
            <CardDescription>
               Gửi lúc: {moment(req.createdAt).format("HH:mm DD/MM/YYYY")}
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
               <Avatar className="h-16 w-16">
                  <AvatarImage src={student?.avatarUrl} />
                  <AvatarFallback>
                     {student?.name?.charAt(0).toUpperCase() || "S"}
                  </AvatarFallback>
               </Avatar>
               <div>
                  <p className="font-semibold text-lg">{student?.name}</p>
                  <p className="text-sm text-muted-foreground">Học sinh</p>
               </div>
            </div>

            <div>
               <h4 className="font-semibold mb-2 text-base">
                  Nội dung yêu cầu:
               </h4>
               <p className="text-sm text-muted-foreground p-4 bg-secondary rounded-md whitespace-pre-wrap">
                  {req.description}
               </p>
            </div>

            <div className="flex items-center gap-2">
               <h4 className="font-semibold text-base">Trạng thái:</h4>
               <TeachingRequestStatusBadge status={req.status} />
            </div>
         </CardContent>
         <CardFooter className="flex justify-between items-center">
            <div className="flex gap-3">{renderActions(req)}</div>
            <Button variant="ghost" onClick={() => navigate(-1)}>
               Quay lại
            </Button>
         </CardFooter>
      </Card>
   );
}
