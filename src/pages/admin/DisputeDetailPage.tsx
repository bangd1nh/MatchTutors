import { useParams, useNavigate } from "react-router-dom";
import {
   useSessionDispute,
   useResolveSessionDispute,
} from "@/hooks/useAdminSessions";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useState } from "react";
import { AlertTriangle, Calendar, Info, User } from "lucide-react";
import { translateSessionStatus } from "@/utils/statusTranslations";

export default function DisputeDetailPage() {
   const { sessionId } = useParams<{ sessionId: string }>();
   const navigate = useNavigate();
   const { data: session, isLoading } = useSessionDispute(sessionId);
   const { mutate: resolve, isPending } = useResolveSessionDispute();
   const addToast = useToast();

   // Form state moved into page
   const [decision, setDecision] = useState<"COMPLETED" | "NOT_CONDUCTED">(
      "COMPLETED"
   );
   const [adminNotes, setAdminNotes] = useState("");

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

   const handleCancelResolve = () => {
      // Reset to defaults like a cancel action; stays on the page.
      setAdminNotes("");
      setDecision("COMPLETED");
   };

   if (isLoading) {
      return <div className="p-4">Đang tải...</div>;
   }

   if (!session) {
      return (
         <div className="p-4">
            <p>Không tìm thấy tranh chấp</p>
            <Button
               onClick={() => navigate("/admin/disputes")}
               className="mt-4"
            >
               Quay lại
            </Button>
         </div>
      );
   }

   const student = session.learningCommitmentId?.student?.userId;
   const tutor = session.learningCommitmentId?.tutor?.userId;

   return (
      <div className="container mx-auto p-6">
         <div className="mb-6">
            <Button
               variant="outline"
               onClick={() => navigate("/admin/disputes")}
               className="flex items-center gap-2 text-slate-700 border-slate-200 hover:bg-slate-50"
            >
               <svg
                  className="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
               >
                  <path d="M15 18l-6-6 6-6"></path>
               </svg>
               ← Quay lại
            </Button>
         </div>

         <div className="bg-white rounded-lg shadow-sm p-8 ring-1 ring-slate-100">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
               <div>
                  <h1 className="text-3xl font-bold mb-2 text-slate-900">
                     Chi tiết tranh chấp buổi học
                  </h1>
                  <Badge
                     className={`px-3 py-1 text-sm rounded-lg ${
                        session.dispute?.status === "OPEN"
                           ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                           : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                     }`}
                  >
                     {session.dispute?.status === "OPEN"
                        ? "Đang mở"
                        : "Đã giải quyết"}
                  </Badge>
               </div>
               {session.dispute?.status === "OPEN" && (
                  <div className="flex items-center gap-2">
                     <Button
                        onClick={() =>
                           window.scrollTo({ top: 9999, behavior: "smooth" })
                        }
                        className="flex items-center gap-2"
                     >
                        <svg
                           className="w-4 h-4"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="1.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           aria-hidden
                        >
                           <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                           <polyline points="7 10 12 5 17 10"></polyline>
                           <line x1="12" y1="5" x2="12" y2="19"></line>
                        </svg>
                        Giải quyết tranh chấp
                     </Button>
                  </div>
               )}
            </div>

            {/* Thông tin buổi học */}
            <div className="grid grid-cols-2 gap-8 mb-8">
               <div>
                  <h2 className="text-lg font-semibold mb-4 text-slate-800">
                     <span className="inline-flex items-center text-slate-700">
                        <Calendar className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                        Thông tin buổi học
                     </span>
                  </h2>
                  <div className="space-y-3">
                     <div>
                        <p className="text-sm text-slate-500">
                           Ngày giờ buổi học
                        </p>
                        <p className="font-medium text-slate-800">
                           {format(
                              new Date(session.startTime),
                              "dd/MM/yyyy HH:mm"
                           )}
                           {" - "}
                           {format(new Date(session.endTime), "HH:mm")}
                        </p>
                     </div>
                     <div>
                        <p className="text-sm text-slate-500">Trạng thái</p>
                        <p className="font-medium text-slate-800">
                           {translateSessionStatus(session.status)}
                        </p>
                     </div>
                  </div>
               </div>

               <div>
                  <h2 className="text-lg font-semibold mb-4 text-slate-800">
                     <span className="inline-flex items-center text-slate-700">
                        <User className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                        Thông tin người tham gia
                     </span>
                  </h2>
                  <div className="space-y-3">
                     <div>
                        <p className="text-sm text-slate-500">Học sinh</p>
                        <p className="font-medium text-slate-800">
                           {student?.name}
                        </p>
                        <p className="text-sm text-slate-500">
                           {student?.email}
                        </p>
                     </div>
                     <div>
                        <p className="text-sm text-slate-500">Gia sư</p>
                        <p className="font-medium text-slate-800">
                           {tutor?.name}
                        </p>
                        <p className="text-sm text-slate-500">{tutor?.email}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Thông tin tranh chấp */}
            <div className="bg-rose-50 border-l-4 border-rose-100 p-6 rounded-lg mb-8">
               <h2 className="text-lg font-semibold text-rose-900 mb-4 flex items-center">
                  <AlertTriangle className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                  Thông tin tranh chấp
               </h2>
               <div className="space-y-3 text-rose-800">
                  <div>
                     <p className="text-sm text-rose-700">Lý do</p>
                     <p className="font-medium">{session.dispute?.reason}</p>
                  </div>
                  <div>
                     <p className="text-sm text-rose-700">Mở tranh chấp lúc</p>
                     <p className="font-medium">
                        {format(
                           new Date(session.dispute?.openedAt || ""),
                           "dd/MM/yyyy HH:mm"
                        )}
                     </p>
                  </div>

                  {/* NEW: show evidenceUrls as thumbnails/links */}
                  {session.dispute?.evidenceUrls?.length ? (
                     <div>
                        <p className="text-sm text-rose-700">Chứng cứ</p>
                        <div className="mt-2 grid grid-cols-3 gap-3">
                           {session.dispute.evidenceUrls.map((url, idx) => (
                              <a
                                 key={idx}
                                 href={url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="block rounded-md overflow-hidden border border-slate-100 bg-white"
                              >
                                 {isImageUrl(url) ? (
                                    <img
                                       src={url}
                                       alt={`evidence-${idx + 1}`}
                                       className="w-full h-24 object-cover"
                                    />
                                 ) : (
                                    <div className="px-3 py-2 text-sm text-rose-700 flex items-center gap-2">
                                       <svg
                                          className="w-4 h-4 inline-block text-rose-700"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          aria-hidden
                                       >
                                          <path d="M10 14l2-2 4 4" />
                                          <path d="M7 21h10a2 2 0 0 0 2-2V7" />
                                       </svg>
                                       <span className="underline">
                                          {filenameFromUrl(url)}
                                       </span>
                                    </div>
                                 )}
                              </a>
                           ))}
                        </div>
                     </div>
                  ) : null}
               </div>
            </div>

            {/* Thông tin giải quyết (nếu đã giải quyết) */}
            {session.dispute?.status === "RESOLVED" && (
               <div className="bg-emerald-50 border-l-4 border-emerald-100 p-6 rounded-lg mb-8">
                  <h2 className="text-lg font-semibold text-emerald-900 mb-4">
                     Thông tin giải quyết
                  </h2>
                  <div className="space-y-3 text-emerald-800">
                     <div>
                        <p className="text-sm text-emerald-700">Quyết định</p>
                        <p className="font-medium">
                           {session.dispute.decision === "COMPLETED"
                              ? "Xác nhận buổi học đã diễn ra"
                              : "Buổi học không diễn ra"}
                        </p>
                     </div>
                     {session.dispute.adminNotes && (
                        <div>
                           <p className="text-sm text-emerald-700">
                              Ghi chú của quản trị viên
                           </p>
                           <p className="font-medium">
                              {session.dispute.adminNotes}
                           </p>
                        </div>
                     )}
                     <div>
                        <p className="text-sm text-emerald-700">
                           Giải quyết lúc
                        </p>
                        <p className="font-medium">
                           {format(
                              new Date(session.dispute.resolvedAt || ""),
                              "dd/MM/yyyy HH:mm"
                           )}
                        </p>
                     </div>
                  </div>
               </div>
            )}

            {/* Inline dispute resolution form (moved from modal) */}
            {session.dispute?.status === "OPEN" && (
               <div className="p-6 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                     <span className="rounded-full bg-slate-100 p-2 text-slate-600">
                        <svg
                           width="16"
                           height="16"
                           viewBox="0 0 24 24"
                           fill="none"
                           aria-hidden
                        >
                           <circle
                              cx="12"
                              cy="12"
                              r="7"
                              stroke="currentColor"
                              strokeWidth="1.25"
                           />
                        </svg>
                     </span>
                     Xử lý tranh chấp
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                           <User className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                           <span>Học sinh</span>
                        </p>
                        <p className="font-medium text-slate-800">
                           {student?.name}
                        </p>
                        <p className="text-xs text-slate-500">
                           {student?.email}
                        </p>
                     </div>

                     <div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                           <User className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                           <span>Gia sư</span>
                        </p>
                        <p className="font-medium text-slate-800">
                           {tutor?.name}
                        </p>
                        <p className="text-xs text-slate-500">{tutor?.email}</p>
                     </div>

                     <div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                           <Calendar className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                           <span>Thời gian buổi học</span>
                        </p>
                        <p className="font-medium text-slate-800">
                           {format(
                              new Date(session.startTime),
                              "dd/MM/yyyy HH:mm"
                           )}
                        </p>
                     </div>

                     <div>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                           <svg
                              className="w-4 h-4 inline-block mr-2 -mt-0.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                           >
                              <path d="M9 12l2 2 4-4"></path>
                           </svg>
                           <span>Trạng thái buổi học</span>
                        </p>
                        <p className="font-medium text-slate-800">
                           {translateSessionStatus(session.status)}
                        </p>
                     </div>
                  </div>

                  <div className="p-4 bg-rose-50 rounded-lg border border-rose-100 text-rose-800 mb-4">
                     <div className="flex items-start gap-2">
                        <span className="rounded-full bg-rose-100 p-1 text-rose-700">
                           <Info className="w-4 h-4 inline-block" />
                        </span>
                        <div>
                           <p className="text-sm font-semibold text-rose-900 mb-1">
                              Thông tin tranh chấp
                           </p>
                           <p className="text-sm text-rose-800 mb-1">
                              <strong className="font-medium">Lý do:</strong>{" "}
                              {session.dispute.reason}
                           </p>
                           <p className="text-xs text-rose-700">
                              <strong>Mở tranh chấp lúc:</strong>{" "}
                              {format(
                                 new Date(session.dispute.openedAt || ""),
                                 "dd/MM/yyyy HH:mm"
                              )}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3 mb-4">
                     <p className="font-semibold text-slate-700">Quyết định</p>
                     <RadioGroup
                        value={decision}
                        onValueChange={(val: any) => setDecision(val)}
                     >
                        <div className="flex items-center space-x-2">
                           <RadioGroupItem value="COMPLETED" id="completed" />
                           <Label
                              htmlFor="completed"
                              className="cursor-pointer flex items-center space-x-2"
                           >
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span>Xác nhận buổi học đã diễn ra</span>
                           </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                           <RadioGroupItem
                              value="NOT_CONDUCTED"
                              id="not-conducted"
                           />
                           <Label
                              htmlFor="not-conducted"
                              className="cursor-pointer flex items-center space-x-2"
                           >
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              <span>Buổi học không diễn ra</span>
                           </Label>
                        </div>
                     </RadioGroup>
                  </div>

                  <div className="space-y-2 mb-4">
                     <Label
                        htmlFor="notes"
                        className="flex items-center space-x-2"
                     >
                        <span className="text-slate-500">
                           <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                           >
                              <path
                                 stroke="currentColor"
                                 strokeWidth="1.25"
                                 d="M7 7h10M7 11h5"
                              />
                           </svg>
                        </span>
                        <span>Ghi chú của quản trị viên</span>
                     </Label>
                     <Textarea
                        id="notes"
                        placeholder="Nhập ghi chú (tùy chọn)..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="min-h-[100px] bg-white border border-slate-100"
                     />
                  </div>

                  <div className="flex items-center gap-2">
                     <Button
                        variant="outline"
                        onClick={handleCancelResolve}
                        disabled={isPending}
                        className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                     >
                        Hủy
                     </Button>

                     <Button
                        onClick={handleResolve}
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                     >
                        {isPending ? "Đang xử lý..." : "Giải quyết tranh chấp"}
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

// Helper to detect an image URL and to extract filename for non-image links.
function isImageUrl(url: string) {
   return /\.(jpe?g|png|gif|webp|bmp|svg)(?:\?.*)?$/i.test(url || "");
}
function filenameFromUrl(url?: string) {
   if (!url) return "";
   try {
      return decodeURIComponent(
         new URL(url, window.location.origin).pathname.split("/").pop() || url
      );
   } catch {
      return url;
   }
}
