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
import { Loader2, ArrowRight } from "lucide-react";
import { TeachingRequestStatusBadge } from "@/components/common/TeachingRequestStatusBadge";
import { TeachingRequest } from "@/types/teachingRequest";
import { RequestDetailModal } from "@/components/tutor/teaching-request/RequestDetailModal"; // Import modal

export default function TeachingRequestsList() {
   const { data: requests, isLoading, isError } = useTutorTeachingRequests();
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
         <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
         </div>
      );
   if (isError)
      return <div className="p-6 text-red-500">Không thể tải yêu cầu.</div>;

   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-2xl font-bold">
               Yêu cầu dạy học — Dành cho tôi
            </h1>
            <p className="text-muted-foreground">
               Xem và phản hồi các yêu cầu từ học sinh.
            </p>
         </div>
         <div className="grid md:grid-cols-2 gap-4">
            {(requests || []).map((r) => (
               <Card key={r._id}>
                  <CardHeader>
                     <div className="flex items-center justify-between">
                        <CardTitle>
                           {r.subject} — Lớp {r.level}
                        </CardTitle>
                        <TeachingRequestStatusBadge status={r.status} />
                     </div>
                  </CardHeader>
                  <CardContent>
                     <div className="flex items-center gap-3">
                        <Avatar>
                           <AvatarImage
                              src={
                                 typeof r.studentId === "object"
                                    ? r.studentId.userId.avatarUrl
                                    : "/placeholder.svg"
                              }
                           />
                           <AvatarFallback>
                              {typeof r.studentId === "object"
                                 ? r.studentId.userId.name?.charAt(0)
                                 : "S"}
                           </AvatarFallback>
                        </Avatar>
                        <div>
                           <div className="font-medium">
                              {typeof r.studentId === "object"
                                 ? r.studentId.userId.name
                                 : "Student"}
                           </div>
                           <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {r.description}
                           </div>
                        </div>
                     </div>
                  </CardContent>
                  <CardFooter>
                     <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewRequest(r)}
                     >
                        Xem & Phản hồi <ArrowRight className="ml-2 w-4 h-4" />
                     </Button>
                  </CardFooter>
               </Card>
            ))}
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
