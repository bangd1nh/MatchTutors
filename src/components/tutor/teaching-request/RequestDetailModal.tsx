import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TeachingRequestStatusBadge } from "@/components/common/TeachingRequestStatusBadge";
import { TeachingRequest } from "@/types/teachingRequest";
import { TeachingRequestStatus } from "@/enums/teachingRequest.enum";
import { useUser } from "@/hooks/useUser";
import { useRespondToRequest } from "@/hooks/useTeachingRequest";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { getSubjectLabelVi, getLevelLabelVi } from "@/utils/educationDisplay";
import { Clock, BookOpen, BookMarked, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import SuggestionSchedules from "@/components/tutor/teaching-request/SuggestionSchedules";
import { SuggestionScheduleResponse } from "@/components/student/SuggestionScheduleResponse";

interface RequestDetailModalProps {
   request: TeachingRequest | null;
   isOpen: boolean;
   onClose: () => void;
   canReport?: boolean;
   hasReported?: boolean;
   onOpenReport?: (
      tutorId: string,
      tutorName: string,
      teachingRequestId: string
   ) => void;
}

export const RequestDetailModal = ({
   request,
   isOpen,
   onClose,
   canReport,
   hasReported,
   onOpenReport,
}: RequestDetailModalProps) => {
   const { user } = useUser();
   const respond = useRespondToRequest();
   const navigate = useNavigate();

   console.log(request);

   const [isShowSuggest, setIsShowSuggest] = useState(false);
   const [isShowStudentResponse, setIsShowStudentResponse] = useState(false);

   if (!request) return null;

   const tutor = request.tutorId?.userId;
   const tutorId =
      typeof request.tutorId === "object"
         ? request.tutorId._id
         : request.tutorId;

   const handleReportClick = () => {
      if (tutorId && tutor?.name && onOpenReport) {
         onOpenReport(tutorId, tutor.name, request._id);
      }
   };

   const handleRespond = (decision: "ACCEPTED" | "REJECTED") => {
      respond.mutate(
         { requestId: request._id, decision },
         {
            onSuccess: () => {
               onClose();
            },
            onError: (err: any) => {
               console.error("Failed to respond to request", err);
            },
         }
      );
   };

   const handleViewProfile = () => {
      const studentId = request.studentId?._id;
      if (studentId) {
         navigate(`/tutor/student-profile/${studentId}`);
         onClose();
      }
   };

   const renderActions = () => {
      if (
         user?.role === "TUTOR" &&
         request.status === TeachingRequestStatus.PENDING
      ) {
         return (
            <div className="flex flex-col gap-3 pt-2">
               <div className="flex gap-3">
                  <Button
                     onClick={() => handleRespond("ACCEPTED")}
                     disabled={respond.isPending}
                     className="flex-1"
                  >
                     Chấp nhận dạy
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() => handleRespond("REJECTED")}
                     disabled={respond.isPending}
                     className="flex-1"
                  >
                     Từ chối
                  </Button>
               </div>
               <Button
                  variant="secondary"
                  onClick={handleViewProfile}
                  className="w-full"
               >
                  Xem hồ sơ học sinh
               </Button>
            </div>
         );
      }
      return (
         <Button
            variant="secondary"
            onClick={handleViewProfile}
            className="w-full"
         >
            Xem hồ sơ học sinh
         </Button>
      );
   };

   const student = request.studentId?.userId;

   return (
      <>
         <SuggestionSchedules
            TRId={request._id}
            isOpen={isShowSuggest}
            onClose={() => setIsShowSuggest(false)}
         />
         {user?.role === "STUDENT" && (
            <SuggestionScheduleResponse
               teachingRequestId={request._id}
               isOpen={isShowStudentResponse}
               onClose={() => setIsShowStudentResponse(false)}
            />
         )}
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <div className="flex items-start justify-between">
                     <div>
                        <DialogTitle className="text-2xl font-bold">
                           {getSubjectLabelVi(request.subject)}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-2 mt-2">
                           <Clock className="w-4 h-4" />
                           {moment(request.createdAt).format(
                              "HH:mm - DD/MM/YYYY"
                           )}
                        </DialogDescription>
                     </div>
                     <TeachingRequestStatusBadge status={request.status} />
                  </div>
               </DialogHeader>

               <div className="space-y-6 py-4">
                  {/* Student/Tutor Info */}
                  {user?.role === "STUDENT" && tutor ? (
                     <div className="flex items-center gap-4 pb-4 border-b border-border">
                        <Avatar className="h-14 w-14">
                           <AvatarImage src={tutor?.avatarUrl} />
                           <AvatarFallback className="bg-primary/10 text-primary">
                              {tutor?.name?.charAt(0).toUpperCase() || "T"}
                           </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                           <p className="font-semibold text-base">
                              {tutor?.name}
                           </p>
                           <p className="text-xs text-muted-foreground">
                              Gia sư
                           </p>
                        </div>
                        {hasReported ? (
                           <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-300"
                           >
                              <Flag className="h-4 w-4 mr-2" />
                              Đã báo cáo
                           </Badge>
                        ) : canReport ? (
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={handleReportClick}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                           >
                              <Flag className="h-4 w-4 mr-2" />
                              Báo cáo gia sư
                           </Button>
                        ) : null}
                     </div>
                  ) : (
                     <div className="flex items-center gap-4 pb-4 border-b border-border">
                        <Avatar className="h-14 w-14">
                           <AvatarImage src={student?.avatarUrl} />
                           <AvatarFallback className="bg-primary/10 text-primary">
                              {student?.name?.charAt(0).toUpperCase() || "S"}
                           </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                           <p className="font-semibold text-base">
                              {student?.name}
                           </p>
                           <p className="text-xs text-muted-foreground">
                              Học sinh
                           </p>
                        </div>
                     </div>
                  )}

                  {/* Course Info */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                           <BookOpen className="w-4 h-4 text-muted-foreground" />
                           <span className="text-xs font-medium text-muted-foreground">
                              Lớp
                           </span>
                        </div>
                        <p className="font-semibold text-sm">
                           {getLevelLabelVi(request.level)}
                        </p>
                     </div>
                     <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                           <BookMarked className="w-4 h-4 text-muted-foreground" />
                           <span className="text-xs font-medium text-muted-foreground">
                              Môn học
                           </span>
                        </div>
                        <p className="font-semibold text-sm">
                           {getSubjectLabelVi(request.subject)}
                        </p>
                     </div>
                  </div>

                  {/* Description */}
                  <div>
                     <h4 className="font-semibold text-sm mb-3 text-foreground">
                        Nội dung yêu cầu
                     </h4>
                     <div
                        className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg border border-border/50 max-h-40 overflow-y-auto"
                        style={{
                           wordBreak: "break-word",
                           whiteSpace: "pre-wrap",
                        }}
                     >
                        {request.description || "Không có nội dung mô tả"}
                     </div>
                  </div>

                  {renderActions()}
               </div>

               <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={onClose}>
                     Đóng
                  </Button>
                  {user?.role === "TUTOR" &&
                     request.status !== TeachingRequestStatus.REJECTED && (
                        <Button onClick={() => setIsShowSuggest(true)}>
                           lên lịch học
                        </Button>
                     )}
                  {user?.role === "STUDENT" &&
                     request.status === TeachingRequestStatus.ACCEPTED && (
                        <Button onClick={() => setIsShowStudentResponse(true)}>
                           Xem lịch đề xuất
                        </Button>
                     )}
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
};
