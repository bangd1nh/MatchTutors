import { useParams, useNavigate } from "react-router-dom";
import {
   useTeachingRequestDetail,
   useRespondToRequest,
   useMakeTrialDecision,
   useRequestCancellation,
   useRequestCompletion,
   useConfirmAction,
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
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { TeachingRequest } from "@/types/teachingRequest";

export default function TeachingRequestDetail() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();

   // ✅ DI CHUYỂN TẤT CẢ HOOKS LÊN ĐÂY - TOP LEVEL
   const { user } = useUser();
   const { data: req, isLoading } = useTeachingRequestDetail(id ?? "");
   const respond = useRespondToRequest();
   const makeDecision = useMakeTrialDecision();
   const requestCancel = useRequestCancellation();
   const requestComplete = useRequestCompletion();
   const confirmAction = useConfirmAction();

   // ✅ TẠO HÀM RENDER ACTIONS KHÔNG DÙNG HOOKS
   const renderActions = (req: TeachingRequest) => {
      if (!user) return null;

      // 1. Tutor phản hồi yêu cầu ban đầu
      if (
         req.status === TeachingRequestStatus.PENDING &&
         user.role === "TUTOR" // <<< THÊM KIỂM TRA VAI TRÒ Ở ĐÂY
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
               >
                  Chấp nhận dạy thử
               </Button>
               <Button
                  variant="destructive"
                  onClick={() =>
                     respond.mutate({
                        requestId: req._id,
                        decision: "REJECTED",
                     })
                  }
               >
                  Từ chối
               </Button>
            </>
         );
      }

      // 2. Cả 2 đưa ra quyết định sau khi học thử
      if (req.status === TeachingRequestStatus.TRIAL_COMPLETED) {
         const decisionMade =
            user.role === "STUDENT"
               ? req.trialDecision?.student !== "PENDING"
               : req.trialDecision?.tutor !== "PENDING";
         if (decisionMade) {
            return <p>Đã gửi quyết định. Chờ phản hồi từ phía bên kia.</p>;
         }
         return (
            <>
               <Button
                  onClick={() =>
                     makeDecision.mutate({
                        requestId: req._id,
                        decision: "ACCEPTED",
                     })
                  }
               >
                  Tiếp tục học
               </Button>
               <Button
                  variant="destructive"
                  onClick={() =>
                     makeDecision.mutate({
                        requestId: req._id,
                        decision: "REJECTED",
                     })
                  }
               >
                  Không tiếp tục
               </Button>
            </>
         );
      }

      // 3. Yêu cầu hủy/hoàn thành khi đang học
      if (req.status === TeachingRequestStatus.IN_PROGRESS) {
         return (
            <>
               <Button
                  onClick={() => {
                     const reason = prompt(
                        "Nhập lý do muốn hoàn thành khóa học (không bắt buộc):"
                     );
                     if (reason !== null)
                        requestComplete.mutate({ requestId: req._id, reason });
                  }}
               >
                  Yêu cầu hoàn thành
               </Button>
               <Button
                  variant="destructive"
                  onClick={() => {
                     const reason = prompt("Nhập lý do muốn hủy khóa học:");
                     if (reason)
                        requestCancel.mutate({ requestId: req._id, reason });
                  }}
               >
                  Yêu cầu hủy
               </Button>
            </>
         );
      }

      // 4. Xác nhận yêu cầu hủy
      if (
         req.status === TeachingRequestStatus.CANCELLATION_PENDING &&
         req.cancellationDecision?.requestedBy !== user.role.toLowerCase()
      ) {
         return (
            <>
               <p>Bên kia đã yêu cầu hủy khóa học. Bạn có đồng ý không?</p>
               <Button
                  onClick={() =>
                     confirmAction.mutate({
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
                     confirmAction.mutate({
                        requestId: req._id,
                        action: "cancellation",
                        decision: "REJECTED",
                     })
                  }
               >
                  Từ chối (Cần Admin xử lý)
               </Button>
            </>
         );
      }

      // 5. Xác nhận yêu cầu hoàn thành
      if (
         req.status === TeachingRequestStatus.COMPLETE_PENDING &&
         req.complete_pending?.requestedBy !== user.role.toLowerCase()
      ) {
         return (
            <>
               <p>
                  Bên kia đã yêu cầu hoàn thành khóa học. Bạn có đồng ý không?
               </p>
               <Button
                  onClick={() =>
                     confirmAction.mutate({
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
                     confirmAction.mutate({
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

      return null; // Không có hành động nào
   };

   if (isLoading)
      return (
         <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
         </div>
      );
   if (!req)
      return <div className="p-6 text-red-500">Yêu cầu không tồn tại.</div>;

   if (req?.status === TeachingRequestStatus.TRIAL_COMPLETED) {
      return (
         <>
            <p>Học thử đã hoàn tất. Mời bạn ra quyết định:</p>
            <div className="space-x-2">
               <Button
                  onClick={() =>
                     makeDecision.mutate({
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
                     makeDecision.mutate({
                        requestId: req._id,
                        decision: "REJECTED",
                     })
                  }
                  disabled={makeDecision.isPending}
               >
                  Hủy khóa
               </Button>
            </div>
         </>
      );
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>
               {req.subject} — Lớp {req.level}
            </CardTitle>
         </CardHeader>
         <CardContent>
            <p className="mb-4">{req.description}</p>
            <div className="mb-4">
               <strong>Học sinh:</strong>{" "}
               {typeof req.studentId === "object"
                  ? req.studentId.userId.name
                  : "Student"}
            </div>
            <div className="mb-4">
               <strong>Trạng thái:</strong> {req.status}
            </div>
         </CardContent>
         <CardFooter className="flex gap-3">
            {renderActions(req)}
            <Button variant="ghost" onClick={() => navigate(-1)}>
               Quay lại
            </Button>
         </CardFooter>
      </Card>
   );
}
