// import { useState } from "react";
// import { useResolveSessionDispute } from "@/hooks/useAdminSessions";
// import {
//    Dialog,
//    DialogContent,
//    DialogHeader,
//    DialogTitle,
//    DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Session } from "@/types/session";
// import { useToast } from "@/hooks/useToast";

// interface DisputeDetailModalProps {
//    session?: Session;
//    open: boolean;
//    onOpenChange: (open: boolean) => void;
// }

// // Small inline icons (minimal, Japanese-inspired, pastel)
// const IconUser = ({ className = "" }: { className?: string }) => (
//    <svg
//       className={`h-4 w-4 ${className}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//    >
//       <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
//       <path
//          d="M4 20c0-4 4-6 8-6s8 2 8 6"
//          stroke="currentColor"
//          strokeWidth="1.5"
//          strokeLinecap="round"
//       />
//    </svg>
// );

// const IconCalendar = ({ className = "" }: { className?: string }) => (
//    <svg
//       className={`h-4 w-4 ${className}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//    >
//       <rect
//          x="3"
//          y="5"
//          width="18"
//          height="16"
//          rx="2"
//          stroke="currentColor"
//          strokeWidth="1.5"
//       />
//       <path
//          d="M16 3v4M8 3v4"
//          stroke="currentColor"
//          strokeWidth="1.5"
//          strokeLinecap="round"
//       />
//    </svg>
// );

// const IconStatus = ({ className = "" }: { className?: string }) => (
//    <svg
//       className={`h-4 w-4 ${className}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//    >
//       <path
//          d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"
//          stroke="currentColor"
//          strokeWidth="1.25"
//       />
//       <path
//          d="M9 12l2 2 4-4"
//          stroke="currentColor"
//          strokeWidth="1.5"
//          strokeLinecap="round"
//          strokeLinejoin="round"
//       />
//    </svg>
// );

// const IconDispute = ({ className = "" }: { className?: string }) => (
//    <svg
//       className={`h-4 w-4 ${className}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//    >
//       <path
//          d="M12 8v5"
//          stroke="currentColor"
//          strokeWidth="1.5"
//          strokeLinecap="round"
//       />
//       <circle cx="12" cy="15.5" r="0.5" fill="currentColor" />
//       <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.25" />
//    </svg>
// );

// export default function DisputeDetailModal({
//    session,
//    open,
//    onOpenChange,
// }: DisputeDetailModalProps) {
//    const [decision, setDecision] = useState<"COMPLETED" | "NOT_CONDUCTED">(
//       "COMPLETED"
//    );
//    const [adminNotes, setAdminNotes] = useState("");
//    const { mutate: resolve, isPending } = useResolveSessionDispute();
//    const addToast = useToast();

//    const handleResolve = () => {
//       if (!session?._id) return;

//       resolve(
//          {
//             sessionId: session._id,
//             decision,
//             adminNotes: adminNotes || undefined,
//          },
//          {
//             onSuccess: () => {
//                addToast("success", "Tranh chấp đã được giải quyết");
//                onOpenChange(false);
//                setAdminNotes("");
//                setDecision("COMPLETED");
//             },
//             onError: (err: any) => {
//                addToast(
//                   "error",
//                   err?.response?.data?.message || "Có lỗi xảy ra"
//                );
//             },
//          }
//       );
//    };

//    if (!session) return null;

//    const student = session.learningCommitmentId?.student?.userId;
//    const tutor = session.learningCommitmentId?.tutor?.userId;

//    return (
//       <Dialog open={open} onOpenChange={onOpenChange}>
//          <DialogContent className="max-w-2xl bg-white ring-1 ring-slate-100 rounded-lg shadow-sm">
//             <DialogHeader>
//                <div className="flex items-center space-x-3">
//                   <div className="rounded-full bg-slate-100 p-2 text-slate-600">
//                      {/* small emblem to give a "Japanese minimal" feel */}
//                      <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         className="text-slate-600"
//                         fill="none"
//                         aria-hidden
//                      >
//                         <circle
//                            cx="12"
//                            cy="12"
//                            r="7"
//                            stroke="currentColor"
//                            strokeWidth="1.25"
//                         />
//                      </svg>
//                   </div>
//                   <DialogTitle className="text-slate-800">
//                      Chi tiết tranh chấp buổi học
//                   </DialogTitle>
//                </div>
//             </DialogHeader>

//             <div className="space-y-6 py-4">
//                {/* Thông tin buổi học */}
//                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
//                   <div>
//                      <p className="text-sm text-slate-500 flex items-center space-x-2">
//                         <IconUser className="text-slate-500" />
//                         <span>Học sinh</span>
//                      </p>
//                      <p className="font-medium text-slate-800">
//                         {student?.name}
//                      </p>
//                      <p className="text-xs text-slate-500">{student?.email}</p>
//                   </div>
//                   <div>
//                      <p className="text-sm text-slate-500 flex items-center space-x-2">
//                         <IconUser className="text-slate-500" />
//                         <span>Gia sư</span>
//                      </p>
//                      <p className="font-medium text-slate-800">{tutor?.name}</p>
//                      <p className="text-xs text-slate-500">{tutor?.email}</p>
//                   </div>
//                   <div>
//                      <p className="text-sm text-slate-500 flex items-center space-x-2">
//                         <IconCalendar className="text-slate-500" />
//                         <span>Thời gian buổi học</span>
//                      </p>
//                      <p className="font-medium text-slate-800">
//                         {new Date(session.startTime).toLocaleString("vi-VN")}
//                      </p>
//                   </div>
//                   <div>
//                      <p className="text-sm text-slate-500 flex items-center space-x-2">
//                         <IconStatus className="text-slate-500" />
//                         <span>Trạng thái buổi học</span>
//                      </p>
//                      <p className="font-medium text-slate-800">
//                         {session.status}
//                      </p>
//                   </div>
//                </div>

//                {/* Thông tin tranh chấp */}
//                {session.dispute && (
//                   <div className="p-4 bg-rose-50 rounded-lg border border-rose-100 text-rose-800">
//                      <div className="flex items-start gap-2">
//                         <span className="rounded-full bg-rose-100 p-1 text-rose-700">
//                            <IconDispute className="text-rose-700" />
//                         </span>
//                         <div>
//                            <p className="text-sm font-semibold text-rose-900 mb-1">
//                               Thông tin tranh chấp
//                            </p>
//                            <p className="text-sm text-rose-800 mb-1">
//                               <strong className="font-medium">Lý do:</strong>{" "}
//                               {session.dispute.reason}
//                            </p>
//                            <p className="text-xs text-rose-700">
//                               <strong>Mở tranh chấp lúc:</strong>{" "}
//                               {new Date(
//                                  session.dispute.openedAt
//                               ).toLocaleString("vi-VN")}
//                            </p>
//                         </div>
//                      </div>
//                   </div>
//                )}

//                {/* Xác nhận / Từ chối */}
//                <div className="space-y-4">
//                   <p className="font-semibold text-slate-700">Quyết định</p>
//                   <RadioGroup
//                      value={decision}
//                      onValueChange={(val: any) => setDecision(val)}
//                   >
//                      <div className="flex items-center space-x-2">
//                         <RadioGroupItem value="COMPLETED" id="completed" />
//                         <Label
//                            htmlFor="completed"
//                            className="cursor-pointer flex items-center space-x-2"
//                         >
//                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
//                            <span>Xác nhận buổi học đã diễn ra</span>
//                         </Label>
//                      </div>
//                      <div className="flex items-center space-x-2">
//                         <RadioGroupItem
//                            value="NOT_CONDUCTED"
//                            id="not-conducted"
//                         />
//                         <Label
//                            htmlFor="not-conducted"
//                            className="cursor-pointer flex items-center space-x-2"
//                         >
//                            <span className="w-2 h-2 rounded-full bg-amber-400" />
//                            <span>Buổi học không diễn ra</span>
//                         </Label>
//                      </div>
//                   </RadioGroup>
//                </div>

//                {/* Ghi chú */}
//                <div className="space-y-2">
//                   <Label
//                      htmlFor="notes"
//                      className="flex items-center space-x-2"
//                   >
//                      <span className="text-slate-500">
//                         <svg
//                            className="h-4 w-4"
//                            viewBox="0 0 24 24"
//                            fill="none"
//                         >
//                            <path
//                               stroke="currentColor"
//                               strokeWidth="1.25"
//                               d="M7 7h10M7 11h5"
//                            />
//                         </svg>
//                      </span>
//                      <span>Ghi chú của quản trị viên</span>
//                   </Label>
//                   <Textarea
//                      id="notes"
//                      placeholder="Nhập ghi chú (tùy chọn)..."
//                      value={adminNotes}
//                      onChange={(e) => setAdminNotes(e.target.value)}
//                      className="min-h-[100px] bg-white border border-slate-100"
//                   />
//                </div>
//             </div>

//             <DialogFooter className="flex items-center gap-2">
//                <Button
//                   variant="outline"
//                   onClick={() => onOpenChange(false)}
//                   disabled={isPending}
//                   className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
//                >
//                   Hủy
//                </Button>
//                <Button
//                   onClick={handleResolve}
//                   disabled={isPending}
//                   className="bg-emerald-600 hover:bg-emerald-700 text-white"
//                >
//                   {isPending ? "Đang xử lý..." : "Giải quyết tranh chấp"}
//                </Button>
//             </DialogFooter>
//          </DialogContent>
//       </Dialog>
//    );
// }
