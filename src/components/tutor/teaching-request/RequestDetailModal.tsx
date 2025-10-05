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
   useMakeTrialDecision,
   useRequestCancellation,
   useRequestCompletion,
   useConfirmAction,
} from "@/hooks/useTeachingRequest";
import moment from "moment";

interface RequestDetailModalProps {
   request: TeachingRequest | null;
   isOpen: boolean;
   onClose: () => void;
}

// Helper function để render các nút hành động
const renderActions = (
   req: TeachingRequest,
   user: any,
   onClose: () => void,
   // Nhận các mutation làm tham số
   mutations: {
      respond: any;
      makeDecision: any;
      requestCancel: any;
      requestComplete: any;
      confirmAction: any;
   }
) => {
   const {
      respond,
      makeDecision,
      requestCancel,
      requestComplete,
      confirmAction,
   } = mutations;

   const handleMutation = (mutation: any, params: any) => {
      // Dùng mutate (không await) và cung cấp onSuccess/onError cục bộ.
      // Hook bên trong (useTeachingRequest) sẽ hiển thị toast; chúng ta chỉ đóng modal khi thành công.
      mutation.mutate(params, {
         onSuccess: () => {
            onClose();
         },
         onError: (err: any) => {
            console.error("Mutation failed", err);
            // Không cần hiển thị toast ở đây — hook sẽ xử lý onError và hiển thị toast.
         },
      });
   };

   // 3. Khi đang trong quá trình học (IN_PROGRESS): cho phép yêu cầu hoàn thành / hủy
   if (req.status === TeachingRequestStatus.IN_PROGRESS) {
      return (
         <>
            <Button
               onClick={() => {
                  const reason = prompt(
                     "Nhập lý do muốn hoàn thành khóa học (không bắt buộc):"
                  );
                  // null = user bấm Cancel, empty string là chấp nhận rỗng
                  if (reason !== null) {
                     handleMutation(requestComplete, {
                        requestId: req._id,
                        reason,
                     });
                  }
               }}
               disabled={requestComplete.isPending}
            >
               Yêu cầu hoàn thành
            </Button>
            <Button
               variant="destructive"
               onClick={() => {
                  const reason = prompt("Nhập lý do muốn hủy khóa học:");
                  if (reason) {
                     handleMutation(requestCancel, {
                        requestId: req._id,
                        reason,
                     });
                  }
               }}
               disabled={requestCancel.isPending}
            >
               Yêu cầu hủy
            </Button>
         </>
      );
   }

   // 1. Tutor phản hồi yêu cầu ban đầu
   if (req.status === TeachingRequestStatus.PENDING && user.role === "TUTOR") {
      return (
         <>
            <Button
               onClick={() =>
                  handleMutation(respond, {
                     requestId: req._id,
                     decision: "ACCEPTED",
                  })
               }
               disabled={respond.isPending}
            >
               Chấp nhận học thử
            </Button>
            <Button
               variant="destructive"
               onClick={() =>
                  handleMutation(respond, {
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

   // 2. Sau khi đã hoàn thành 2 buổi thử: cả 2 bên (Student / Tutor) đưa ra quyết định
   if (req.status === TeachingRequestStatus.TRIAL_COMPLETED) {
      const role = String(user.role).toUpperCase();
      const studentDecision = req.trialDecision?.student ?? "PENDING";
      const tutorDecision = req.trialDecision?.tutor ?? "PENDING";

      // Student chưa quyết => hiện nút cho student
      if (role === "STUDENT" && studentDecision === "PENDING") {
         return (
            <>
               <Button
                  onClick={() =>
                     handleMutation(makeDecision, {
                        requestId: req._id,
                        decision: "ACCEPTED",
                     })
                  }
                  disabled={makeDecision.isPending}
               >
                  Tiếp tục khóa chính thức
               </Button>
               <Button
                  variant="destructive"
                  onClick={() =>
                     handleMutation(makeDecision, {
                        requestId: req._id,
                        decision: "REJECTED",
                     })
                  }
                  disabled={makeDecision.isPending}
               >
                  Không tiếp tục
               </Button>
            </>
         );
      }

      // Tutor chưa quyết => hiện nút cho tutor
      if (role === "TUTOR" && tutorDecision === "PENDING") {
         return (
            <>
               <Button
                  onClick={() =>
                     handleMutation(makeDecision, {
                        requestId: req._id,
                        decision: "ACCEPTED",
                     })
                  }
                  disabled={makeDecision.isPending}
               >
                  Xác nhận tiếp tục
               </Button>
               <Button
                  variant="destructive"
                  onClick={() =>
                     handleMutation(makeDecision, {
                        requestId: req._id,
                        decision: "REJECTED",
                     })
                  }
                  disabled={makeDecision.isPending}
               >
                  Từ chối tiếp tục
               </Button>
            </>
         );
      }

      // Nếu đã có quyết định từ người hiện tại, hiển thị thông báo trạng thái
      return (
         <div className="text-sm text-muted-foreground">
            Đã gửi quyết định. Chờ phản hồi.
         </div>
      );
   }

   // 4. Nếu có yêu cầu hủy đang chờ xác nhận từ bên kia
   if (
      req.status === TeachingRequestStatus.CANCELLATION_PENDING &&
      req.cancellationDecision?.requestedBy !== user.role?.toLowerCase()
   ) {
      return (
         <>
            <Button
               onClick={() =>
                  handleMutation(confirmAction, {
                     requestId: req._id,
                     action: "cancellation",
                     decision: "ACCEPTED",
                  })
               }
            >
               Đồng ý hủy
            </Button>
            <Button
               variant="destructive"
               onClick={() =>
                  handleMutation(confirmAction, {
                     requestId: req._id,
                     action: "cancellation",
                     decision: "REJECTED",
                  })
               }
            >
               Từ chối
            </Button>
         </>
      );
   }

   // 5. Nếu có yêu cầu hoàn thành đang chờ xác nhận từ bên kia
   if (
      req.status === TeachingRequestStatus.COMPLETE_PENDING &&
      req.complete_pending?.requestedBy !== user.role?.toLowerCase()
   ) {
      return (
         <>
            <Button
               onClick={() =>
                  handleMutation(confirmAction, {
                     requestId: req._id,
                     action: "completion",
                     decision: "ACCEPTED",
                  })
               }
            >
               Đồng ý hoàn thành
            </Button>
            <Button
               variant="destructive"
               onClick={() =>
                  handleMutation(confirmAction, {
                     requestId: req._id,
                     action: "completion",
                     decision: "REJECTED",
                  })
               }
            >
               Từ chối (Cần Admin xử lý)
            </Button>
         </>
      );
   }

   // Các logic hành động khác có thể thêm vào đây...

   return null; // Không có hành động nào
};

export const RequestDetailModal = ({
   request,
   isOpen,
   onClose,
}: RequestDetailModalProps) => {
   const { user } = useUser();

   // *** SỬA Ở ĐÂY: Gọi tất cả các hook ở cấp cao nhất ***
   const respond = useRespondToRequest();
   const makeDecision = useMakeTrialDecision();
   const requestCancel = useRequestCancellation();
   const requestComplete = useRequestCompletion();
   const confirmAction = useConfirmAction();
   // *****************************************************

   if (!request) return null;

   const student = request.studentId?.userId;

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
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
            </div>

            <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
               {/* Truyền các mutation vào hàm renderActions */}
               {user &&
                  renderActions(request, user, onClose, {
                     respond,
                     makeDecision,
                     requestCancel,
                     requestComplete,
                     confirmAction,
                  })}
               <Button variant="outline" onClick={onClose}>
                  Đóng
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
