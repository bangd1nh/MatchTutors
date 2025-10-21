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
import {
   useRespondToRequest,
   useRequestCancellation,
   useRequestCompletion,
   useConfirmAction,
} from "@/hooks/useTeachingRequest";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon, HistoryIcon } from "lucide-react";
import moment from "moment";
import { useState } from "react";

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

   // Di chuyển tất cả hooks lên component level
   const respond = useRespondToRequest();
   const requestCancel = useRequestCancellation();
   const requestComplete = useRequestCompletion();
   const confirmAction = useConfirmAction();

   // Di chuyển state management lên component level
   const [showReasonForm, setShowReasonForm] = useState(false);
   const [reasonAction, setReasonAction] = useState<
      "complete" | "cancel" | null
   >(null);
   const [reason, setReason] = useState("");

   if (!request) return null;

   const handleMutation = (mutation: any, params: any) => {
      mutation.mutate(params, {
         onSuccess: () => {
            onClose();
            // Reset state
            setShowReasonForm(false);
            setReasonAction(null);
            setReason("");
         },
         onError: (err: any) => {
            console.error("Mutation failed", err);
         },
      });
   };

   const handleReasonSubmit = () => {
      if (reasonAction === "complete") {
         handleMutation(requestComplete, {
            requestId: request._id,
            reason: reason.trim() || undefined,
         });
      } else if (reasonAction === "cancel") {
         if (!reason.trim()) {
            alert("Vui lòng nhập lý do hủy khóa học");
            return;
         }
         handleMutation(requestCancel, {
            requestId: request._id,
            reason: reason.trim(),
         });
      }
   };

   const handleRequestAction = (action: "complete" | "cancel") => {
      setReasonAction(action);
      setReason("");
      setShowReasonForm(true);
   };

   const handleCancelReasonForm = () => {
      setShowReasonForm(false);
      setReasonAction(null);
      setReason("");
   };

   // Helper function để render các nút hành động
   const renderActions = () => {
      if (!user) return null;

      // Nếu đang hiển thị form lý do, hiển thị form thay vì các nút action
      if (showReasonForm) {
         return (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
               <div>
                  <h3 className="font-semibold mb-2">
                     {reasonAction === "complete"
                        ? "Yêu cầu hoàn thành khóa học"
                        : "Yêu cầu hủy khóa học"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                     {reasonAction === "complete"
                        ? "Nhập lý do muốn hoàn thành khóa học (không bắt buộc)"
                        : "Vui lòng nhập lý do muốn hủy khóa học"}
                  </p>
               </div>

               <div>
                  <Label htmlFor="reason">
                     Lý do {reasonAction === "complete" ? "hoàn thành" : "hủy"}
                     {reasonAction === "cancel" && " *"}
                  </Label>
                  <Textarea
                     id="reason"
                     placeholder={
                        reasonAction === "complete"
                           ? "Nhập lý do hoàn thành khóa học (không bắt buộc)..."
                           : "Nhập lý do hủy khóa học..."
                     }
                     value={reason}
                     onChange={(e) => setReason(e.target.value)}
                     rows={4}
                     className="mt-2"
                     maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                     {reason.length}/500 ký tự
                     {reasonAction === "cancel" && reason.length === 0 && (
                        <span className="text-red-500"> (Bắt buộc)</span>
                     )}
                  </p>
               </div>

               <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={handleCancelReasonForm}>
                     Hủy
                  </Button>
                  <Button
                     onClick={handleReasonSubmit}
                     disabled={
                        (reasonAction === "cancel" && !reason.trim()) ||
                        requestComplete.isPending ||
                        requestCancel.isPending
                     }
                     variant={
                        reasonAction === "cancel" ? "destructive" : "default"
                     }
                  >
                     {reasonAction === "complete"
                        ? "Yêu cầu hoàn thành"
                        : "Yêu cầu hủy"}
                  </Button>
               </div>
            </div>
         );
      }

      // 3. Khi đang trong quá trình học (IN_PROGRESS): cho phép yêu cầu hoàn thành / hủy
      if (request.status === TeachingRequestStatus.IN_PROGRESS) {
         return (
            <div className="flex gap-2">
               <Button
                  onClick={() => handleRequestAction("complete")}
                  disabled={requestComplete.isPending}
               >
                  Yêu cầu hoàn thành
               </Button>
               <Button
                  variant="destructive"
                  onClick={() => handleRequestAction("cancel")}
                  disabled={requestCancel.isPending}
               >
                  Yêu cầu hủy
               </Button>
            </div>
         );
      }

      // 1. Tutor phản hồi yêu cầu ban đầu
      if (
         request.status === TeachingRequestStatus.PENDING &&
         user.role === "TUTOR"
      ) {
         return (
            <div className="flex gap-2">
               <Button
                  onClick={() =>
                     handleMutation(respond, {
                        requestId: request._id,
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
                     handleMutation(respond, {
                        requestId: request._id,
                        decision: "REJECTED",
                     })
                  }
                  disabled={respond.isPending}
               >
                  Từ chối
               </Button>
            </div>
         );
      }

      // 2. Sau khi đã hoàn thành 2 buổi thử: cả 2 bên (Student / Tutor) đưa ra quyết định - BỎ QUA
      // if (request.status === TeachingRequestStatus.TRIAL_COMPLETED) { ... }

      // 4. Nếu có yêu cầu hủy đang chờ xác nhận từ bên kia
      if (
         request.status === TeachingRequestStatus.CANCELLATION_PENDING &&
         request.cancellationDecision?.requestedBy !== user.role?.toLowerCase()
      ) {
         return (
            <div className="flex gap-2">
               <Button
                  onClick={() => {
                     const reason = prompt("Nhập lý do đồng ý hủy (tùy chọn):");
                     handleMutation(confirmAction, {
                        requestId: request._id,
                        action: "cancellation",
                        decision: "ACCEPTED",
                        reason: reason || undefined,
                     });
                  }}
               >
                  Đồng ý hủy
               </Button>
               <Button
                  variant="destructive"
                  onClick={() => {
                     const reason = prompt("Nhập lý do từ chối hủy:");
                     if (reason) {
                        handleMutation(confirmAction, {
                           requestId: request._id,
                           action: "cancellation",
                           decision: "REJECTED",
                           reason: reason,
                        });
                     }
                  }}
               >
                  Từ chối
               </Button>
            </div>
         );
      }

      // 5. Nếu có yêu cầu hoàn thành đang chờ xác nhận từ bên kia
      if (
         request.status === TeachingRequestStatus.COMPLETE_PENDING &&
         request.complete_pending?.requestedBy !== user.role?.toLowerCase()
      ) {
         return (
            <div className="flex gap-2">
               <Button
                  onClick={() => {
                     const reason = prompt(
                        "Nhập lý do đồng ý hoàn thành (tùy chọn):"
                     );
                     handleMutation(confirmAction, {
                        requestId: request._id,
                        action: "completion",
                        decision: "ACCEPTED",
                        reason: reason || undefined,
                     });
                  }}
               >
                  Đồng ý hoàn thành
               </Button>
               <Button
                  variant="destructive"
                  onClick={() => {
                     const reason = prompt("Nhập lý do từ chối hoàn thành:");
                     if (reason) {
                        handleMutation(confirmAction, {
                           requestId: request._id,
                           action: "completion",
                           decision: "REJECTED",
                           reason: reason,
                        });
                     }
                  }}
               >
                  Từ chối (Cần Admin xử lý)
               </Button>
            </div>
         );
      }

      return null; // Không có hành động nào
   };

   // Helper function để kiểm tra có lý do hủy nào không
   const hasCancellationReasons = () => {
      return (
         request.cancellationDecision?.reason ||
         request.cancellationDecision?.student?.reason ||
         request.cancellationDecision?.tutor?.reason
      );
   };

   // Helper function để kiểm tra có lý do hoàn thành nào không
   const hasCompletionReasons = () => {
      return (
         request.complete_pending?.reason ||
         request.complete_pending?.student?.reason ||
         request.complete_pending?.tutor?.reason
      );
   };

   const student = request.studentId?.userId;

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle>
                  Chi tiết Yêu cầu: {request.subject} - Lớp {request.level}
               </DialogTitle>
               <DialogDescription>
                  Gửi lúc:{" "}
                  {moment(request.createdAt).format("HH:mm DD/MM/YYYY")}
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
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
                  <h4 className="font-semibold mb-2">Nội dung yêu cầu:</h4>
                  <p
                     className="text-sm text-muted-foreground p-3 bg-secondary rounded-md
                                break-words whitespace-pre-wrap max-w-full overflow-auto"
                     style={{ wordBreak: "break-word" }}
                  >
                     {request.description}
                  </p>
               </div>

               <div className="flex items-center gap-2">
                  <h4 className="font-semibold">Trạng thái:</h4>
                  <TeachingRequestStatusBadge status={request.status} />
               </div>

               {/* Lịch sử lý do hủy - Dropdown riêng */}
               {hasCancellationReasons() && (
                  <div className="space-y-4">
                     <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-red-600">
                           <HistoryIcon className="h-4 w-4" />
                           Lịch sử lý do hủy khóa học
                           <ChevronDownIcon className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-3 mt-3">
                           {/* Lý do hủy chính */}
                           {request.cancellationDecision?.reason && (
                              <div className="bg-orange-50 p-3 rounded border border-orange-200">
                                 <div className="text-sm font-medium text-orange-800">
                                    Yêu cầu hủy khóa học
                                 </div>
                                 <div className="text-xs text-orange-600 mt-1">
                                    {request.cancellationDecision
                                       .requestedBy && (
                                       <span>
                                          Yêu cầu bởi:{" "}
                                          {String(
                                             request.cancellationDecision
                                                .requestedBy
                                          ).toUpperCase()}
                                       </span>
                                    )}
                                    {request.cancellationDecision
                                       .requestedAt && (
                                       <>
                                          <span className="mx-2">•</span>
                                          <span>
                                             Lúc:{" "}
                                             {moment(
                                                request.cancellationDecision
                                                   .requestedAt
                                             ).format("HH:mm DD/MM/YYYY")}
                                          </span>
                                       </>
                                    )}
                                 </div>
                                 <div className="text-sm mt-2">
                                    <strong>Lý do:</strong>{" "}
                                    {request.cancellationDecision.reason}
                                 </div>
                                 {request.cancellationDecision.adminNotes && (
                                    <div className="text-sm mt-2">
                                       <strong>Ghi chú Admin:</strong>{" "}
                                       {request.cancellationDecision.adminNotes}
                                    </div>
                                 )}
                              </div>
                           )}

                           {/* Lý do từ học sinh - hủy */}
                           {request.cancellationDecision?.student?.reason && (
                              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                 <div className="text-sm font-medium text-blue-800">
                                    Phản hồi từ học sinh (Hủy khóa)
                                 </div>
                                 <div className="text-sm mt-2">
                                    <strong>Lý do:</strong>{" "}
                                    {
                                       request.cancellationDecision.student
                                          .reason
                                    }
                                 </div>
                              </div>
                           )}

                           {/* Lý do từ gia sư - hủy */}
                           {request.cancellationDecision?.tutor?.reason && (
                              <div className="bg-green-50 p-3 rounded border border-green-200">
                                 <div className="text-sm font-medium text-green-800">
                                    Phản hồi từ gia sư (Hủy khóa)
                                 </div>
                                 <div className="text-sm mt-2">
                                    <strong>Lý do:</strong>{" "}
                                    {request.cancellationDecision.tutor.reason}
                                 </div>
                              </div>
                           )}
                        </CollapsibleContent>
                     </Collapsible>
                  </div>
               )}

               {/* Lịch sử lý do hoàn thành - Dropdown riêng */}
               {hasCompletionReasons() && (
                  <div className="space-y-4">
                     <Collapsible>
                        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-green-600">
                           <HistoryIcon className="h-4 w-4" />
                           Lịch sử lý do hoàn thành khóa học
                           <ChevronDownIcon className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-3 mt-3">
                           {/* Lý do hoàn thành chính */}
                           {request.complete_pending?.reason && (
                              <div className="bg-lime-50 p-3 rounded border border-lime-200">
                                 <div className="text-sm font-medium text-lime-800">
                                    Yêu cầu hoàn thành khóa học
                                 </div>
                                 <div className="text-xs text-lime-600 mt-1">
                                    {request.complete_pending.requestedBy && (
                                       <span>
                                          Yêu cầu bởi:{" "}
                                          {String(
                                             request.complete_pending
                                                .requestedBy
                                          ).toUpperCase()}
                                       </span>
                                    )}
                                    {request.complete_pending.requestedAt && (
                                       <>
                                          <span className="mx-2">•</span>
                                          <span>
                                             Lúc:{" "}
                                             {moment(
                                                request.complete_pending
                                                   .requestedAt
                                             ).format("HH:mm DD/MM/YYYY")}
                                          </span>
                                       </>
                                    )}
                                 </div>
                                 <div className="text-sm mt-2">
                                    <strong>Lý do:</strong>{" "}
                                    {request.complete_pending.reason}
                                 </div>
                                 {request.complete_pending.adminNotes && (
                                    <div className="text-sm mt-2">
                                       <strong>Ghi chú Admin:</strong>{" "}
                                       {request.complete_pending.adminNotes}
                                    </div>
                                 )}
                              </div>
                           )}

                           {/* Lý do từ học sinh - hoàn thành */}
                           {request.complete_pending?.student?.reason && (
                              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                 <div className="text-sm font-medium text-blue-800">
                                    Phản hồi từ học sinh (Hoàn thành khóa)
                                 </div>
                                 <div className="text-sm mt-2">
                                    <strong>Lý do:</strong>{" "}
                                    {request.complete_pending.student.reason}
                                 </div>
                              </div>
                           )}

                           {/* Lý do từ gia sư - hoàn thành */}
                           {request.complete_pending?.tutor?.reason && (
                              <div className="bg-green-50 p-3 rounded border border-green-200">
                                 <div className="text-sm font-medium text-green-800">
                                    Phản hồi từ gia sư (Hoàn thành khóa)
                                 </div>
                                 <div className="text-sm mt-2">
                                    <strong>Lý do:</strong>{" "}
                                    {request.complete_pending.tutor.reason}
                                 </div>
                              </div>
                           )}
                        </CollapsibleContent>
                     </Collapsible>
                  </div>
               )}

               {/* Render actions hoặc reason form */}
               {renderActions()}
            </div>

            <DialogFooter>
               <Button variant="outline" onClick={onClose}>
                  Đóng
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
