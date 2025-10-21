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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import moment from "moment";
import {
   AdminTeachingRequest,
   useResolveAdminReview,
   // useGetAdminReviewHistory,
} from "@/hooks/useAdminTeachingRequests";
import {
   CheckCircleIcon,
   XCircleIcon,
   AlertTriangleIcon,
   UserIcon,
   BookOpenIcon,
   DollarSignIcon,
   ChevronDownIcon,
   HistoryIcon,
} from "lucide-react";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdminRequestDetailModalProps {
   request: AdminTeachingRequest | null;
   isOpen: boolean;
   onClose: () => void;
}

export const AdminRequestDetailModal = ({
   request,
   isOpen,
   onClose,
}: AdminRequestDetailModalProps) => {
   const [adminNotes, setAdminNotes] = useState("");
   const [showResolveForm, setShowResolveForm] = useState(false);
   const [selectedDecision, setSelectedDecision] = useState<
      "ACCEPTED" | "REJECTED" | null
   >(null);

   const resolveRequestMutation = useResolveAdminReview();

   const historyData = {
      cancellationHistory: request?.cancellationDecisionHistory || [],
      completionHistory: request?.complete_pendingHistory || [],
   };

   if (!request) return null;

   const handleResolve = (decision: "ACCEPTED" | "REJECTED") => {
      setSelectedDecision(decision);
      setShowResolveForm(true);
   };

   const handleConfirmResolve = () => {
      if (!selectedDecision) return;

      resolveRequestMutation.mutate(
         {
            requestId: request._id,
            payload: {
               decision: selectedDecision,
               adminNotes: adminNotes.trim() || undefined,
            },
         },
         {
            onSuccess: () => {
               onClose();
               setShowResolveForm(false);
               setSelectedDecision(null);
               setAdminNotes("");
            },
         }
      );
   };

   const handleCancelResolve = () => {
      setShowResolveForm(false);
      setSelectedDecision(null);
      setAdminNotes("");
   };

   const getStatusBadge = (status: string) => {
      const statusMap: Record<string, { label: string; className: string }> = {
         ADMIN_REVIEW: {
            label: "Cần xem xét",
            className: "bg-orange-100 text-orange-800",
         },
         CANCELLATION_PENDING: {
            label: "Chờ hủy",
            className: "bg-yellow-100 text-yellow-800",
         },
         COMPLETE_PENDING: {
            label: "Chờ hoàn thành",
            className: "bg-blue-100 text-blue-800",
         },
      };

      const statusInfo = statusMap[status] || {
         label: status,
         className: "bg-gray-100 text-gray-800",
      };
      return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
   };

   const getConflictType = () => {
      if (request.cancellationDecision?.adminReviewRequired) {
         return "Tranh chấp về hủy khóa học";
      }
      if (request.complete_pending?.adminReviewRequired) {
         return "Tranh chấp về hoàn thành khóa học";
      }
      return "Không xác định";
   };

   const getConflictDetails = () => {
      // helper to safely extract decision from either a string or an object shape
      const normalizeDecision = (party: any) => {
         if (!party) return "PENDING";
         if (typeof party === "string") return party;
         if (typeof party === "object" && "decision" in party)
            return party.decision;
         return "PENDING";
      };

      if (request.cancellationDecision?.adminReviewRequired) {
         const { requestedBy, reason, requestedAt, student, tutor } =
            request.cancellationDecision as any;
         return {
            type: "cancellation" as const,
            requestedBy,
            reason,
            requestedAt,
            studentDecision: normalizeDecision(student),
            tutorDecision: normalizeDecision(tutor),
         };
      }
      if (request.complete_pending?.adminReviewRequired) {
         const { requestedBy, reason, requestedAt, student, tutor } =
            request.complete_pending as any;
         return {
            type: "completion" as const,
            requestedBy,
            reason,
            requestedAt,
            studentDecision: normalizeDecision(student),
            tutorDecision: normalizeDecision(tutor),
         };
      }
      return null;
   };

   const conflictDetails = getConflictDetails();

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-6 w-6 text-orange-500" />
                  Chi tiết yêu cầu cần xem xét
               </DialogTitle>
               <DialogDescription>
                  Yêu cầu được tạo lúc:{" "}
                  {moment(request.createdAt).format("HH:mm DD/MM/YYYY")}
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
               {/* Basic Information */}
               <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                     <BookOpenIcon className="h-5 w-5" />
                     Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label className="text-sm font-medium">Môn học</Label>
                        <p className="text-sm">{request.subject}</p>
                     </div>
                     <div>
                        <Label className="text-sm font-medium">Lớp</Label>
                        <p className="text-sm">{request.level}</p>
                     </div>
                     <div>
                        <Label className="text-sm font-medium">
                           Học phí/giờ
                        </Label>
                        <p className="text-sm flex items-center gap-1">
                           <DollarSignIcon className="h-4 w-4" />
                           {request.hourlyRate?.toLocaleString("vi-VN")} VNĐ
                        </p>
                     </div>
                     <div>
                        <Label className="text-sm font-medium">
                           Trạng thái
                        </Label>
                        <div className="mt-1">
                           {getStatusBadge(request.status)}
                        </div>
                     </div>
                  </div>
                  {request.description && (
                     <div className="mt-4">
                        <Label className="text-sm font-medium">Mô tả</Label>
                        <p className="text-sm mt-1">{request.description}</p>
                     </div>
                  )}
               </div>

               {/* Participants */}
               <div className="grid grid-cols-2 gap-4">
                  {/* Student */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                     <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-blue-500" />
                        Học sinh
                     </h4>
                     <div className="flex items-center gap-3">
                        <Avatar>
                           <AvatarImage
                              src={request.studentId.userId.avatarUrl}
                           />
                           <AvatarFallback>
                              {request.studentId.userId.name?.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                        <div>
                           <p className="font-medium">
                              {request.studentId.userId.name}
                           </p>
                           <p className="text-sm text-gray-600">
                              {request.studentId.userId.email}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Tutor */}
                  <div className="bg-green-50 p-4 rounded-lg">
                     <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-green-500" />
                        Gia sư
                     </h4>
                     <div className="flex items-center gap-3">
                        <Avatar>
                           <AvatarImage
                              src={request.tutorId.userId.avatarUrl}
                           />
                           <AvatarFallback>
                              {request.tutorId.userId.name?.charAt(0)}
                           </AvatarFallback>
                        </Avatar>
                        <div>
                           <p className="font-medium">
                              {request.tutorId.userId.name}
                           </p>
                           <p className="text-sm text-gray-600">
                              {request.tutorId.userId.email}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Conflict Details */}
               {conflictDetails && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                     <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangleIcon className="h-5 w-5 text-red-500" />
                        Chi tiết tranh chấp - {getConflictType()}
                     </h3>

                     <div className="space-y-4">
                        {conflictDetails.requestedBy && (
                           <div>
                              <Label className="text-sm font-medium">
                                 Người yêu cầu
                              </Label>
                              <p className="text-sm capitalize">
                                 {conflictDetails.requestedBy === "student"
                                    ? "Học sinh"
                                    : "Gia sư"}{" "}
                                 lúc{" "}
                                 {moment(conflictDetails.requestedAt).format(
                                    "HH:mm DD/MM/YYYY"
                                 )}
                              </p>
                           </div>
                        )}

                        {conflictDetails.reason && (
                           <div>
                              <Label className="text-sm font-medium">
                                 Lý do ban đầu
                              </Label>
                              <p className="text-sm">
                                 {conflictDetails.reason}
                              </p>
                           </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <Label className="text-sm font-medium">
                                 Quyết định học sinh
                              </Label>
                              <Badge
                                 className={
                                    conflictDetails.studentDecision ===
                                    "ACCEPTED"
                                       ? "bg-green-100 text-green-800"
                                       : conflictDetails.studentDecision ===
                                         "REJECTED"
                                       ? "bg-red-100 text-red-800"
                                       : "bg-yellow-100 text-yellow-800"
                                 }
                              >
                                 {conflictDetails.studentDecision}
                              </Badge>
                              {/* Xóa phần hiển thị reason vì không có thuộc tính này */}
                           </div>
                           <div>
                              <Label className="text-sm font-medium">
                                 Quyết định gia sư
                              </Label>
                              <Badge
                                 className={
                                    conflictDetails.tutorDecision === "ACCEPTED"
                                       ? "bg-green-100 text-green-800"
                                       : conflictDetails.tutorDecision ===
                                         "REJECTED"
                                       ? "bg-red-100 text-red-800"
                                       : "bg-yellow-100 text-yellow-800"
                                 }
                              >
                                 {conflictDetails.tutorDecision}
                              </Badge>
                              {/* Xóa phần hiển thị reason vì không có thuộc tính này */}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Resolve Form */}
               {showResolveForm && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                     <h3 className="font-semibold mb-3">
                        Xử lý yêu cầu -{" "}
                        {selectedDecision === "ACCEPTED"
                           ? "Chấp nhận"
                           : "Từ chối"}
                     </h3>
                     <div className="space-y-3">
                        <div>
                           <Label htmlFor="adminNotes">
                              Ghi chú của Admin (tùy chọn)
                           </Label>
                           <Textarea
                              id="adminNotes"
                              placeholder="Nhập ghi chú về quyết định của bạn..."
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              rows={4}
                              className="mt-2"
                           />
                        </div>
                     </div>
                  </div>
               )}
            </div>

            {/* Thêm section lịch sử trước DialogFooter */}
            {historyData &&
               (historyData.cancellationHistory.length > 0 ||
                  historyData.completionHistory.length > 0) && (
                  <div className="space-y-4">
                     <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
                           <HistoryIcon className="h-4 w-4" />
                           Lịch sử xử lý Admin
                           <ChevronDownIcon className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-3 mt-3">
                           {historyData.cancellationHistory.map(
                              (history, index) => (
                                 <div
                                    key={index}
                                    className="bg-red-50 p-3 rounded border border-red-200"
                                 >
                                    <div className="text-sm font-medium text-red-800">
                                       Lịch sử xử lý hủy khóa #{index + 1}
                                    </div>
                                    <div className="text-xs text-red-600 mt-1">
                                       Xử lý lúc:{" "}
                                       {moment(history.adminResolvedAt).format(
                                          "HH:mm DD/MM/YYYY"
                                       )}
                                    </div>
                                    {history.adminNotes && (
                                       <div className="text-sm mt-2">
                                          <strong>Ghi chú:</strong>{" "}
                                          {history.adminNotes}
                                       </div>
                                    )}
                                 </div>
                              )
                           )}

                           {historyData.completionHistory.map(
                              (history, index) => (
                                 <div
                                    key={index}
                                    className="bg-blue-50 p-3 rounded border border-blue-200"
                                 >
                                    <div className="text-sm font-medium text-blue-800">
                                       Lịch sử xử lý hoàn thành #{index + 1}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">
                                       Xử lý lúc:{" "}
                                       {moment(history.adminResolvedAt).format(
                                          "HH:mm DD/MM/YYYY"
                                       )}
                                    </div>
                                    {history.adminNotes && (
                                       <div className="text-sm mt-2">
                                          <strong>Ghi chú:</strong>{" "}
                                          {history.adminNotes}
                                       </div>
                                    )}
                                 </div>
                              )
                           )}
                        </CollapsibleContent>
                     </Collapsible>
                  </div>
               )}

            <DialogFooter className="flex gap-2">
               {!showResolveForm ? (
                  <>
                     <Button
                        variant="outline"
                        onClick={() => handleResolve("ACCEPTED")}
                        className="flex items-center gap-2"
                     >
                        <CheckCircleIcon className="h-4 w-4" />
                        Chấp nhận
                     </Button>
                     <Button
                        variant="destructive"
                        onClick={() => handleResolve("REJECTED")}
                        className="flex items-center gap-2"
                     >
                        <XCircleIcon className="h-4 w-4" />
                        Từ chối
                     </Button>
                     <Button variant="ghost" onClick={onClose}>
                        Đóng
                     </Button>
                  </>
               ) : (
                  <>
                     <Button
                        onClick={handleConfirmResolve}
                        disabled={resolveRequestMutation.isPending}
                        className="flex items-center gap-2"
                        variant={
                           selectedDecision === "ACCEPTED"
                              ? "default"
                              : "destructive"
                        }
                     >
                        {selectedDecision === "ACCEPTED" ? (
                           <CheckCircleIcon className="h-4 w-4" />
                        ) : (
                           <XCircleIcon className="h-4 w-4" />
                        )}
                        {resolveRequestMutation.isPending
                           ? "Đang xử lý..."
                           : "Xác nhận"}
                     </Button>
                     <Button variant="outline" onClick={handleCancelResolve}>
                        Hủy
                     </Button>
                  </>
               )}
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
