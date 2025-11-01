import { useState } from "react";
import { useResolveSessionDispute } from "@/hooks/useAdminSessions";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Session } from "@/types/session";
import { useToast } from "@/hooks/useToast";

interface DisputeDetailModalProps {
   session?: Session;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export default function DisputeDetailModal({
   session,
   open,
   onOpenChange,
}: DisputeDetailModalProps) {
   const [decision, setDecision] = useState<"COMPLETED" | "NOT_CONDUCTED">(
      "COMPLETED"
   );
   const [adminNotes, setAdminNotes] = useState("");
   const { mutate: resolve, isPending } = useResolveSessionDispute();
   const addToast = useToast();

   const handleResolve = () => {
      if (!session?._id) return;

      resolve(
         {
            sessionId: session._id,
            decision,
            adminNotes: adminNotes || undefined,
         },
         {
            onSuccess: () => {
               addToast("success", "Tranh chấp đã được giải quyết");
               onOpenChange(false);
               setAdminNotes("");
               setDecision("COMPLETED");
            },
            onError: (err: any) => {
               addToast(
                  "error",
                  err?.response?.data?.message || "Có lỗi xảy ra"
               );
            },
         }
      );
   };

   if (!session) return null;

   const student = session.learningCommitmentId?.student?.userId;
   const tutor = session.learningCommitmentId?.tutor?.userId;

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle>Chi tiết tranh chấp buổi học</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
               {/* Thông tin buổi học */}
               <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                     <p className="text-sm text-gray-600">Học sinh</p>
                     <p className="font-medium">{student?.name}</p>
                     <p className="text-xs text-gray-500">{student?.email}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Gia sư</p>
                     <p className="font-medium">{tutor?.name}</p>
                     <p className="text-xs text-gray-500">{tutor?.email}</p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">Thời gian buổi học</p>
                     <p className="font-medium">
                        {new Date(session.startTime).toLocaleString("vi-VN")}
                     </p>
                  </div>
                  <div>
                     <p className="text-sm text-gray-600">
                        Trạng thái buổi học
                     </p>
                     <p className="font-medium">{session.status}</p>
                  </div>
               </div>

               {/* Thông tin tranh chấp */}
               {session.dispute && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                     <p className="text-sm font-semibold text-red-900 mb-2">
                        Thông tin tranh chấp
                     </p>
                     <p className="text-sm text-red-800 mb-2">
                        <strong>Lý do:</strong> {session.dispute.reason}
                     </p>
                     <p className="text-xs text-red-700">
                        <strong>Mở tranh chấp lúc:</strong>{" "}
                        {new Date(session.dispute.openedAt).toLocaleString(
                           "vi-VN"
                        )}
                     </p>
                  </div>
               )}

               {/* Xác nhận / Từ chối */}
               <div className="space-y-4">
                  <p className="font-semibold">Quyết định</p>
                  <RadioGroup
                     value={decision}
                     onValueChange={(val: any) => setDecision(val)}
                  >
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="COMPLETED" id="completed" />
                        <Label htmlFor="completed" className="cursor-pointer">
                           Xác nhận buổi học đã diễn ra
                        </Label>
                     </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem
                           value="NOT_CONDUCTED"
                           id="not-conducted"
                        />
                        <Label
                           htmlFor="not-conducted"
                           className="cursor-pointer"
                        >
                           Buổi học không diễn ra
                        </Label>
                     </div>
                  </RadioGroup>
               </div>

               {/* Ghi chú */}
               <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú của quản trị viên</Label>
                  <Textarea
                     id="notes"
                     placeholder="Nhập ghi chú (tùy chọn)..."
                     value={adminNotes}
                     onChange={(e) => setAdminNotes(e.target.value)}
                     className="min-h-[100px]"
                  />
               </div>
            </div>

            <DialogFooter>
               <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
               >
                  Hủy
               </Button>
               <Button onClick={handleResolve} disabled={isPending}>
                  {isPending ? "Đang xử lý..." : "Giải quyết tranh chấp"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
