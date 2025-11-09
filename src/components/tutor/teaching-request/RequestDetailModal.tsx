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
import moment from "moment";
import { Clock, BookOpen, BookMarked } from "lucide-react";

interface RequestDetailModalProps {
   request: TeachingRequest | null;
   isOpen: boolean;
   onClose: () => void;
}

export const RequestDetailModal = ({
   request,
   isOpen,
   onClose,
}: RequestDetailModalProps) => {
   const { user } = useUser();
   const respond = useRespondToRequest();

   if (!request) return null;

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

   const renderActions = () => {
      if (
         user?.role === "TUTOR" &&
         request.status === TeachingRequestStatus.PENDING
      ) {
         return (
            <div className="flex gap-3 pt-2">
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
         );
      }
      return null;
   };

   const student = request.studentId?.userId;

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <div className="flex items-start justify-between">
                  <div>
                     <DialogTitle className="text-2xl font-bold">
                        {request.subject}
                     </DialogTitle>
                     <DialogDescription className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4" />
                        {moment(request.createdAt).format("HH:mm - DD/MM/YYYY")}
                     </DialogDescription>
                  </div>
                  <TeachingRequestStatusBadge status={request.status} />
               </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
               {/* Student Info */}
               <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <Avatar className="h-14 w-14">
                     <AvatarImage src={student?.avatarUrl} />
                     <AvatarFallback className="bg-primary/10 text-primary">
                        {student?.name?.charAt(0).toUpperCase() || "S"}
                     </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                     <p className="font-semibold text-base">{student?.name}</p>
                     <p className="text-xs text-muted-foreground">Học sinh</p>
                  </div>
               </div>

               {/* Course Info */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                     <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                           Lớp
                        </span>
                     </div>
                     <p className="font-semibold text-sm">{request.level}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                     <div className="flex items-center gap-2 mb-1">
                        <BookMarked className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                           Môn học
                        </span>
                     </div>
                     <p className="font-semibold text-sm">{request.subject}</p>
                  </div>
               </div>

               {/* Description */}
               <div>
                  <h4 className="font-semibold text-sm mb-3 text-foreground">
                     Nội dung yêu cầu
                  </h4>
                  <div
                     className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg border border-border/50 max-h-40 overflow-y-auto"
                     style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
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
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
