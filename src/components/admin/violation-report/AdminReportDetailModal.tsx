import { useState, useEffect } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle, X, XCircle, Link as LinkIcon, FileText, File, Download } from "lucide-react";
import { ViolationReport, updateViolationReportStatus } from "@/api/violationReport";
import { hideTutor, getTutorIdByUserId } from "@/api/adminTutors";
import { ViolationStatusEnum, ViolationTypeEnum } from "@/enums/violationReport.enum";
import { useToast } from "@/hooks/useToast";
import { Link } from "react-router-dom";
import moment from "moment";

interface AdminReportDetailModalProps {
   report: ViolationReport;
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
}

const VIOLATION_TYPE_LABELS: Record<string, string> = {
   [ViolationTypeEnum.SCAM_TUTOR]: "Gia sư lừa đảo",
   [ViolationTypeEnum.FALSE_FEEDBACK]: "Đánh giá sai",
   [ViolationTypeEnum.SCAM_STUDENT]: "Học sinh lừa đảo",
   OTHER: "Khác",
};

const STATUS_LABELS: Record<string, string> = {
   [ViolationStatusEnum.PENDING]: "Đang chờ",
   [ViolationStatusEnum.RESOLVED]: "Đã xử lý",
   [ViolationStatusEnum.REJECTED]: "Đã từ chối",
   [ViolationStatusEnum.REVIEWED]: "Đã xem",
};

const STATUS_COLORS: Record<string, string> = {
   [ViolationStatusEnum.PENDING]: "bg-yellow-100 text-yellow-800",
   [ViolationStatusEnum.RESOLVED]: "bg-green-100 text-green-800",
   [ViolationStatusEnum.REJECTED]: "bg-red-100 text-red-800",
   [ViolationStatusEnum.REVIEWED]: "bg-blue-100 text-blue-800",
};

export const AdminReportDetailModal = ({
   report,
   isOpen,
   onClose,
   onSuccess,
}: AdminReportDetailModalProps) => {
   const [isProcessing, setIsProcessing] = useState(false);
   const [tutorId, setTutorId] = useState<string | null>(null);
   const [isLoadingTutorId, setIsLoadingTutorId] = useState(false);
   const toast = useToast();

   const getReporterName = () => {
      if (typeof report.reporterId === "object") {
         return report.reporterId.name;
      }
      return "N/A";
   };

   const getReporterEmail = () => {
      if (typeof report.reporterId === "object") {
         return report.reporterId.email;
      }
      return "N/A";
   };

   const getReportedUserId = () => {
      if (typeof report.reportedUserId === "object") {
         return report.reportedUserId._id;
      }
      return report.reportedUserId || report.tutorId || "";
   };

   const getReportedUserName = () => {
      if (typeof report.reportedUserId === "object") {
         return report.reportedUserId.name;
      }
      return "N/A";
   };

   const getReportedUserEmail = () => {
      if (typeof report.reportedUserId === "object") {
         return report.reportedUserId.email;
      }
      return "N/A";
   };

   // Load tutorId khi modal mở
   useEffect(() => {
      if (isOpen && report) {
         const loadTutorId = async () => {
            const reportedUserId = getReportedUserId();
            if (reportedUserId) {
               setIsLoadingTutorId(true);
               try {
                  const id = await getTutorIdByUserId(reportedUserId);
                  setTutorId(id);
               } catch (error) {
                  console.error("Error loading tutorId:", error);
                  setTutorId(null);
               } finally {
                  setIsLoadingTutorId(false);
               }
            }
         };
         loadTutorId();
      } else {
         setTutorId(null);
      }
   }, [isOpen, report]);

   const handleHideTutor = async () => {
      const confirmed = window.confirm(
         "Bạn có chắc muốn ẩn gia sư này? Hành động này sẽ:\n" +
            "- Hủy tất cả learning commitments đang active\n" +
            "- Hủy tất cả sessions chưa học\n" +
            "- Từ chối tất cả teaching requests đang pending"
      );

      if (!confirmed) return;

      setIsProcessing(true);
      try {
         // 1. Lấy tutorId từ userId
         const reportedUserId = getReportedUserId();
         if (!reportedUserId) {
            throw new Error("Không tìm thấy thông tin tutor");
         }

         const tutorId = await getTutorIdByUserId(reportedUserId);
         if (!tutorId) {
            throw new Error("Không tìm thấy tutorId. Gia sư này có thể chưa có profile.");
         }

         // 2. Ẩn tutor
         await hideTutor(tutorId);

         // 3. Cập nhật status report thành RESOLVED
         await updateViolationReportStatus(report._id, "RESOLVED");

         toast("success", "Đã ẩn gia sư và xử lý báo cáo thành công");
         onSuccess();
      } catch (error: any) {
         console.error("Error hiding tutor:", error);
         toast(
            "error",
            error?.response?.data?.message ||
               error?.message ||
               "Có lỗi xảy ra khi xử lý"
         );
      } finally {
         setIsProcessing(false);
      }
   };

   const handleRejectReport = async () => {
      const confirmed = window.confirm("Bạn có chắc muốn từ chối báo cáo này?");
      if (!confirmed) return;

      setIsProcessing(true);
      try {
         await updateViolationReportStatus(report._id, "REJECTED");
         toast("success", "Đã từ chối báo cáo");
         onSuccess();
      } catch (error: any) {
         console.error("Error rejecting report:", error);
         toast(
            "error",
            error?.response?.data?.message ||
               error?.message ||
               "Có lỗi xảy ra khi từ chối báo cáo"
         );
      } finally {
         setIsProcessing(false);
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  Chi tiết báo cáo vi phạm
               </DialogTitle>
               <DialogDescription>
                  Xem thông tin chi tiết và xử lý báo cáo
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
               {/* Status Badge */}
               <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Trạng thái:</span>
                  <Badge
                     className={
                        STATUS_COLORS[report.status] || "bg-gray-100 text-gray-800"
                     }
                  >
                     {STATUS_LABELS[report.status] || report.status}
                  </Badge>
               </div>

               <Separator />

               {/* Reporter Info */}
               <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Người báo cáo</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                     <p>
                        <span className="font-medium">Tên:</span> {getReporterName()}
                     </p>
                     <p>
                        <span className="font-medium">Email:</span> {getReporterEmail()}
                     </p>
                  </div>
               </div>

               {/* Reported User Info */}
               <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Tutor bị report</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                     <p>
                        <span className="font-medium">Tên:</span> {getReportedUserName()}
                     </p>
                     <p>
                        <span className="font-medium">Email:</span> {getReportedUserEmail()}
                     </p>
                     {tutorId ? (
                        <div className="pt-2">
                           <Link
                              to={`/admin/tutors/${tutorId}`}
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                           >
                              <LinkIcon className="h-4 w-4" />
                              Xem chi tiết tài khoản gia sư
                           </Link>
                        </div>
                     ) : isLoadingTutorId ? (
                        <div className="pt-2 text-sm text-muted-foreground">
                           Đang tải...
                        </div>
                     ) : (
                        <div className="pt-2">
                           <Link
                              to="/admin/tutors"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                           >
                              <LinkIcon className="h-4 w-4" />
                              Xem danh sách gia sư
                           </Link>
                        </div>
                     )}
                  </div>
               </div>

               <Separator />

               {/* Report Details */}
               <div className="space-y-4">
                  <div>
                     <h3 className="font-semibold mb-2">Loại vi phạm</h3>
                     <Badge variant="outline" className="text-base px-3 py-1">
                        {VIOLATION_TYPE_LABELS[report.type] || report.type}
                     </Badge>
                  </div>

                  <div>
                     <h3 className="font-semibold mb-2">Lý do báo cáo</h3>
                     <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">{report.reason}</p>
                     </div>
                  </div>

                  {/* Evidence Files */}
                  {report.evidenceFiles && report.evidenceFiles.length > 0 && (
                     <div>
                        <h3 className="font-semibold mb-2">Bằng chứng</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {report.evidenceFiles.map((url, index) => {
                              // Detect file type from URL
                              const getFileType = (fileUrl: string) => {
                                 const extension = fileUrl.split('.').pop()?.toLowerCase() || '';
                                 if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
                                    return 'image';
                                 } else if (extension === 'pdf') {
                                    return 'pdf';
                                 } else if (['doc', 'docx'].includes(extension)) {
                                    return 'word';
                                 }
                                 return 'file';
                              };

                              const getFileName = (fileUrl: string) => {
                                 const parts = fileUrl.split('/');
                                 return parts[parts.length - 1] || `Evidence ${index + 1}`;
                              };

                              const fileType = getFileType(url);
                              const fileName = getFileName(url);

                              return (
                                 <div
                                    key={index}
                                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                 >
                                    {fileType === 'image' ? (
                                       // Image preview
                                       <div className="relative group">
                                          <img
                                             src={url}
                                             alt={fileName}
                                             className="w-full h-48 object-cover"
                                             onError={(e) => {
                                                // Fallback nếu không load được ảnh
                                                (e.target as HTMLImageElement).style.display = 'none';
                                             }}
                                          />
                                          <a
                                             href={url}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity"
                                          >
                                             <span className="text-white opacity-0 group-hover:opacity-100 text-sm">
                                                Xem toàn màn hình
                                             </span>
                                          </a>
                                       </div>
                                    ) : (
                                       // File card for PDF, Word, etc.
                                       <div className="p-4 bg-gray-50">
                                          <div className="flex items-center gap-3">
                                             <div className="flex-shrink-0">
                                                {fileType === 'pdf' ? (
                                                   <FileText className="h-10 w-10 text-red-600" />
                                                ) : fileType === 'word' ? (
                                                   <FileText className="h-10 w-10 text-blue-600" />
                                                ) : (
                                                   <File className="h-10 w-10 text-gray-600" />
                                                )}
                                             </div>
                                             <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate" title={fileName}>
                                                   {fileName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                   {fileType === 'pdf' ? 'PDF Document' : 
                                                    fileType === 'word' ? 'Word Document' : 
                                                    'File'}
                                                </p>
                                             </div>
                                          </div>
                                       </div>
                                    )}
                                    {/* Download button for all files */}
                                    <div className="p-2 bg-white border-t">
                                       <a
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                       >
                                          <Download className="h-4 w-4" />
                                          {fileType === 'image' ? 'Xem ảnh' : 'Tải xuống'}
                                       </a>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}

                  {/* Related Teaching Request */}
                  {report.relatedTeachingRequestId && (
                     <div>
                        <h3 className="font-semibold mb-2">Teaching Request liên quan</h3>
                        <div className="bg-blue-50 p-4 rounded-lg">
                           {typeof report.relatedTeachingRequestId === "object" ? (
                              <div className="space-y-2">
                                 <p>
                                    <span className="font-medium">Môn học:</span>{" "}
                                    {report.relatedTeachingRequestId.subject}
                                 </p>
                                 <p>
                                    <span className="font-medium">Trình độ:</span>{" "}
                                    {report.relatedTeachingRequestId.level}
                                 </p>
                                 <Link
                                    to={`/admin/teaching-requests`}
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                 >
                                    <LinkIcon className="h-4 w-4" />
                                    Xem chi tiết teaching request
                                 </Link>
                              </div>
                           ) : (
                              <p>ID: {report.relatedTeachingRequestId}</p>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Timestamps */}
                  <div className="text-sm text-muted-foreground space-y-1">
                     <p>
                        <span className="font-medium">Ngày tạo:</span>{" "}
                        {moment(report.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                     </p>
                     {report.updatedAt && (
                        <p>
                           <span className="font-medium">Cập nhật lần cuối:</span>{" "}
                           {moment(report.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
                        </p>
                     )}
                  </div>
               </div>
            </div>

            <DialogFooter className="gap-2">
               {/* Actions chỉ hiển thị khi status là PENDING */}
               {report.status === ViolationStatusEnum.PENDING && (
                  <>
                     <Button
                        variant="destructive"
                        onClick={handleHideTutor}
                        disabled={isProcessing}
                        className="bg-red-600 hover:bg-red-700"
                     >
                        {isProcessing ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang xử lý...
                           </>
                        ) : (
                           <>
                              <X className="mr-2 h-4 w-4" />
                              Ẩn gia sư (Đồng ý báo cáo)
                           </>
                        )}
                     </Button>
                     <Button
                        variant="outline"
                        onClick={handleRejectReport}
                        disabled={isProcessing}
                     >
                        {isProcessing ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang xử lý...
                           </>
                        ) : (
                           <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Từ chối báo cáo
                           </>
                        )}
                     </Button>
                  </>
               )}
               <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                  Đóng
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

