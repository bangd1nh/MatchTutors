import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyViolationReports, ViolationReport } from "@/api/violationReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   Loader2,
   AlertCircle,
   ShieldAlert,
   Flag,
   FileText,
   Calendar,
   User,
   BookOpen,
   ExternalLink,
} from "lucide-react";
import moment from "moment";
import {
   ViolationTypeEnum,
   ViolationStatusEnum,
   VIOLATION_TYPE_LABELS_VI,
   VIOLATION_STATUS_LABELS_VI,
} from "@/enums/violationReport.enum";
import { SUBJECT_LABELS_VI } from "@/enums/subject.enum";
import { LEVEL_LABELS_VI } from "@/enums/level.enum";
import { TeachingRequestStatus } from "@/enums/teachingRequest.enum";
import { Pagination } from "@/components/common/Pagination";

const TEACHING_REQUEST_STATUS_LABELS_VI: Record<string, string> = {
   [TeachingRequestStatus.PENDING]: "Chờ phản hồi",
   [TeachingRequestStatus.ACCEPTED]: "Đã chấp nhận",
   [TeachingRequestStatus.REJECTED]: "Đã từ chối",
};

// Preserve hues; add dark variants for contrast
const STATUS_CLASSES: Record<ViolationStatusEnum, string> = {
   [ViolationStatusEnum.PENDING]:
      "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800",
   [ViolationStatusEnum.REVIEWED]:
      "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800",
   [ViolationStatusEnum.RESOLVED]:
      "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800",
   [ViolationStatusEnum.REJECTED]:
      "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800",
};

export default function MyViolationReportsPage() {
   const [page, setPage] = useState(1);
   const limit = 10;

   const { data, isLoading, isError } = useQuery({
      queryKey: ["myViolationReports", page, limit],
      queryFn: () => getMyViolationReports(page, limit),
   });

   if (isLoading) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center">
               <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
               <p className="text-muted-foreground">
                  Đang tải danh sách báo cáo...
               </p>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-destructive font-semibold text-lg">
               Đã xảy ra lỗi khi tải dữ liệu
            </p>
            <p className="text-destructive/80 text-sm mt-2">
               Vui lòng thử lại sau
            </p>
         </div>
      );
   }

   const reports = data?.reports ?? [];
   const pagination = data?.pagination;

   return (
      <div className="min-h-screen bg-background p-6 md:p-8">
         <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                     <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-300" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">
                     Báo cáo vi phạm của tôi
                  </h1>
               </div>
               <p className="text-muted-foreground ml-11">
                  Xem lại tất cả các báo cáo vi phạm bạn đã gửi
               </p>
            </div>

            {/* Stats */}
            {pagination && pagination.total > 0 && (
               <div className="mb-6 bg-card rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">
                     Tổng cộng{" "}
                     <span className="font-semibold text-foreground">
                        {pagination.total}
                     </span>{" "}
                     báo cáo
                  </p>
               </div>
            )}

            {/* Reports List */}
            {reports.length === 0 ? (
               <div className="text-center py-16 bg-card rounded-lg border border-border">
                  <ShieldAlert className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                     Chưa có báo cáo nào
                  </h3>
                  <p className="text-muted-foreground">
                     Bạn chưa gửi báo cáo vi phạm nào
                  </p>
               </div>
            ) : (
               <div className="space-y-4">
                  {reports.map((report) => (
                     <ViolationReportCard key={report._id} report={report} />
                  ))}
               </div>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
               <div className="mt-8">
                  <Pagination
                     currentPage={page}
                     totalPages={pagination.pages}
                     onPageChange={setPage}
                  />
               </div>
            )}
         </div>
      </div>
   );
}

interface ViolationReportCardProps {
   report: ViolationReport;
}

function ViolationReportCard({ report }: ViolationReportCardProps) {
   const tutor =
      typeof report.reportedUserId === "object" ? report.reportedUserId : null;

   const teachingRequest =
      typeof report.relatedTeachingRequestId === "object"
         ? report.relatedTeachingRequestId
         : null;

   const status = report.status as ViolationStatusEnum;
   const statusLabel =
      VIOLATION_STATUS_LABELS_VI[status] || (report.status as string);
   const statusClass =
      STATUS_CLASSES[status] ||
      "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/30 dark:text-gray-200 dark:border-gray-800";

   return (
      <Card className="bg-card text-card-foreground border border-border hover:shadow-lg transition-shadow">
         <CardHeader>
            <div className="flex items-start justify-between gap-4">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                     <Flag className="h-5 w-5 text-red-600 dark:text-red-300" />
                     <CardTitle className="text-lg">
                        {VIOLATION_TYPE_LABELS_VI[
                           report.type as ViolationTypeEnum
                        ] ||
                           report.type ||
                           "Khác"}
                     </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <Calendar className="h-4 w-4" />
                     <span>
                        {moment(report.createdAt).format("DD/MM/YYYY HH:mm")}
                     </span>
                  </div>
               </div>
               <Badge className={`border ${statusClass}`}>{statusLabel}</Badge>
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            {/* Tutor Info */}
            {tutor && (
               <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                     <p className="font-medium text-foreground">{tutor.name}</p>
                     <p className="text-xs text-muted-foreground">
                        {tutor.email}
                     </p>
                  </div>
               </div>
            )}

            {/* Teaching Request Info */}
            {teachingRequest && (
               <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                     <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                     <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                        Yêu cầu dạy học liên quan
                     </span>
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                     <p>
                        <span className="font-medium">Môn:</span>{" "}
                        {SUBJECT_LABELS_VI[teachingRequest.subject] ||
                           teachingRequest.subject}
                     </p>
                     <p>
                        <span className="font-medium">Lớp:</span>{" "}
                        {LEVEL_LABELS_VI[teachingRequest.level] ||
                           teachingRequest.level}
                     </p>
                     <p>
                        <span className="font-medium">Trạng thái:</span>{" "}
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-white/50 dark:bg-white/10">
                           {TEACHING_REQUEST_STATUS_LABELS_VI[
                              teachingRequest.status
                           ] || teachingRequest.status}
                        </span>
                     </p>
                  </div>
               </div>
            )}

            {/* Reason */}
            <div>
               <p className="text-sm font-medium text-foreground mb-1">
                  Lý do báo cáo:
               </p>
               <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  {report.reason}
               </p>
            </div>

            {/* Evidence Files */}
            {report.evidenceFiles && report.evidenceFiles.length > 0 && (
               <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                     Tài liệu bằng chứng ({report.evidenceFiles.length}):
                  </p>
                  <div className="space-y-2">
                     {report.evidenceFiles.map((fileUrl, index) => {
                        const fileName =
                           fileUrl.split("/").pop() || `File ${index + 1}`;
                        return (
                           <a
                              key={index}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 rounded-lg transition-colors group bg-muted hover:bg-muted/70"
                           >
                              <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                              <span className="text-sm text-foreground flex-1 truncate">
                                 {fileName}
                              </span>
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                           </a>
                        );
                     })}
                  </div>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
