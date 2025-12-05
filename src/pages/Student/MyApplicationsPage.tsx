import {
   AlertCircle,
   ArrowRight,
   BookOpen,
   CheckCircle,
   Clock,
   Flag,
   Loader2,
   XCircle,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { checkCanReport, CheckCanReportResponse, submitViolationReport } from "@/api/violationReport";
import {
   Avatar,
   AvatarFallback,
   AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { useMyTeachingRequests } from "@/hooks/useTeachingRequest";

import { TeachingRequestStatus } from "@/enums/teachingRequest.enum";
import { ViolationTypeEnum } from "@/enums/violationReport.enum";
import { TeachingRequest } from "@/types/teachingRequest";
import { Pagination } from "@/components/common/Pagination";
import { RequestDetailModal } from "@/components/tutor/teaching-request/RequestDetailModal";
import { ReportModal } from "@/components/student/ReportModal";
import { getLevelLabelVi, getSubjectLabelVi } from "@/utils/educationDisplay";
import { TeachingRequestStatusBadge } from "@/components/common/TeachingRequestStatusBadge";

const MyApplicationsPage = () => {
   const [page, setPage] = useState(1);
   const [limit] = useState(9);
   const {
      data: listData,
      isLoading,
      isError,
   } = useMyTeachingRequests(page, limit);
   const requests = listData?.data ?? [];
   const pagination = listData?.pagination;

   const [selectedRequest, setSelectedRequest] =
      useState<TeachingRequest | null>(null);
   const [reportStatusMap, setReportStatusMap] = useState<
      Record<string, CheckCanReportResponse>
   >({});
   const [reportModalOpen, setReportModalOpen] = useState(false);
   const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
   const [selectedTutorName, setSelectedTutorName] = useState<string | null>(
      null
   );
   const [selectedTeachingRequestId, setSelectedTeachingRequestId] = useState<
      string | null
   >(null);
   const toast = useToast();

   // Check report status for each tutor when requests load
   useEffect(() => {
      if (requests && requests.length > 0) {
         const checkReports = async () => {
            const newReportStatusMap: Record<string, CheckCanReportResponse> =
               {};
            const checkedTutorIds = new Set<string>();

            for (const request of requests) {
               const tutorId =
                  typeof request.tutorId === "object"
                     ? request.tutorId._id
                     : request.tutorId;

               if (tutorId && !checkedTutorIds.has(tutorId)) {
                  checkedTutorIds.add(tutorId);
                  try {
                     const reportStatus = await checkCanReport(tutorId);
                     newReportStatusMap[tutorId] = reportStatus;
                  } catch (error) {
                     console.error(
                        `Error checking reports for tutor ${tutorId}:`,
                        error
                     );
                     newReportStatusMap[tutorId] = {
                        canReport: false,
                        hasReported: false,
                     };
                  }
               }
            }

            setReportStatusMap(newReportStatusMap);
         };

         checkReports();
      }
   }, [requests]);

   const handleViewRequest = (request: TeachingRequest) => {
      setSelectedRequest(request);
   };

   const handleCloseModal = () => {
      setSelectedRequest(null);
   };

   const handleOpenReportModal = (
      tutorId: string,
      tutorName: string,
      teachingRequestId?: string
   ) => {
      setSelectedTutorId(tutorId);
      setSelectedTutorName(tutorName);
      setSelectedTeachingRequestId(teachingRequestId || null);
      setReportModalOpen(true);
   };

   const handleCloseReportModal = () => {
      setReportModalOpen(false);
      setSelectedTutorId(null);
      setSelectedTutorName(null);
      setSelectedTeachingRequestId(null);
   };

   const handleSubmitReport = async (data: {
      type: ViolationTypeEnum;
      reason: string;
      evidenceFiles: File[];
   }) => {
      if (!selectedTutorId) return;

      try {
         console.log("Submitting report with data:", {
            tutorId: selectedTutorId,
            type: data.type,
            reason: data.reason,
            evidenceFilesCount: data.evidenceFiles.length,
            relatedTeachingRequestId: selectedTeachingRequestId,
         });

         const result = await submitViolationReport({
            tutorId: selectedTutorId,
            type: data.type,
            reason: data.reason,
            evidenceFiles: data.evidenceFiles,
            relatedTeachingRequestId: selectedTeachingRequestId || undefined,
         });

         console.log("Report submitted successfully:", result);
         toast("success", "Báo cáo đã được gửi thành công");

         // Refresh report status from API
         if (selectedTutorId) {
            try {
               const reportStatus = await checkCanReport(selectedTutorId);
               setReportStatusMap((prev) => ({
                  ...prev,
                  [selectedTutorId]: reportStatus,
               }));
            } catch (error) {
               console.error("Error refreshing reports:", error);
               // Fallback: set to default if API call fails
               setReportStatusMap((prev) => ({
                  ...prev,
                  [selectedTutorId]: {
                     canReport: false,
                     hasReported: false,
                  },
               }));
            }
         }

         handleCloseReportModal();
      } catch (error: any) {
         console.error("Error submitting report:", error);
         toast(
            "error",
            error?.response?.data?.message ||
               "Gửi báo cáo thất bại. Vui lòng thử lại sau."
         );
         throw error;
      }
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">
               Đang tải các lớp học của bạn...
            </p>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="flex flex-col items-center justify-center h-64 bg-red-50 dark:bg-destructive/10 border border-red-200 dark:border-destructive/20 rounded-lg p-6">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            <p className="mt-4 text-red-700 dark:text-red-300 font-semibold">
               Đã xảy ra lỗi khi tải dữ liệu.
            </p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
               Vui lòng thử lại sau.
            </p>
         </div>
      );
   }

   if (!requests || requests.length === 0) {
      return (
         <Card className="text-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-card-foreground">
               Chưa có lớp học nào
            </h2>
            <p className="mt-2 text-muted-foreground">
               Bạn chưa gửi yêu cầu học cho gia sư nào.
            </p>
            <Button asChild className="mt-6">
               <Link to="/tutor-list">Tìm gia sư ngay</Link>
            </Button>
         </Card>
      );
   }

   const pendingRequests = (requests || []).filter(
      (r) => r.status === TeachingRequestStatus.PENDING
   );
   const acceptedRequests = (requests || []).filter(
      (r) => r.status === TeachingRequestStatus.ACCEPTED
   );
   const rejectedRequests = (requests || []).filter(
      (r) => r.status === TeachingRequestStatus.REJECTED
   );

   return (
      <div className="min-h-screen bg-background p-6 md:p-8">
         <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
               <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                     <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">
                     Lớp học của tôi
                  </h1>
               </div>
               <p className="text-muted-foreground ml-11">
                  Quản lý tất cả các yêu cầu dạy học bạn đã gửi
               </p>
            </div>

            {/* Stats Section */}
            {requests.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="hover:border-muted-foreground/50 transition-colors">
                     <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm text-muted-foreground">
                                 Tổng yêu cầu
                              </p>
                              <p className="text-2xl font-bold">
                                 {requests.length}
                              </p>
                           </div>
                           <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="hover:border-amber-400 dark:hover:border-amber-500/50 transition-colors">
                     <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm text-muted-foreground">
                                 Đang chờ
                              </p>
                              <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                                 {pendingRequests.length}
                              </p>
                           </div>
                           <Clock className="h-8 w-8 text-amber-400 dark:text-amber-500/50" />
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="hover:border-green-400 dark:hover:border-green-500/50 transition-colors">
                     <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm text-muted-foreground">
                                 Chấp nhận
                              </p>
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                 {acceptedRequests.length}
                              </p>
                           </div>
                           <CheckCircle className="h-8 w-8 text-green-400 dark:text-green-500/50" />
                        </div>
                     </CardContent>
                  </Card>

                  <Card className="hover:border-red-400 dark:hover:border-red-500/50 transition-colors">
                     <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-sm text-muted-foreground">
                                 Từ chối
                              </p>
                              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                 {rejectedRequests.length}
                              </p>
                           </div>
                           <XCircle className="h-8 w-8 text-red-400 dark:text-red-500/50" />
                        </div>
                     </CardContent>
                  </Card>
               </div>
            )}

            {/* Pending Requests Section */}
            {pendingRequests.length > 0 && (
               <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                     <Clock className="h-5 w-5 text-amber-500" />
                     Yêu cầu chờ xử lý ({pendingRequests.length})
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {pendingRequests.map((request) => {
                        const tutorId =
                           typeof request.tutorId === "object"
                              ? request.tutorId._id
                              : request.tutorId;
                        return (
                           <ApplicationCard
                              key={request._id}
                              request={request}
                              onViewDetail={handleViewRequest}
                              hasReported={
                                 tutorId
                                    ? reportStatusMap[tutorId]?.hasReported
                                    : false
                              }
                              canReport={
                                 tutorId
                                    ? reportStatusMap[tutorId]?.canReport
                                    : false
                              }
                              onOpenReport={handleOpenReportModal}
                           />
                        );
                     })}
                  </div>
               </div>
            )}

            {/* Accepted Requests Section */}
            {acceptedRequests.length > 0 && (
               <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                     <CheckCircle className="h-5 w-5 text-green-500" />
                     Đã chấp nhận ({acceptedRequests.length})
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {acceptedRequests.map((request) => {
                        const tutorId =
                           typeof request.tutorId === "object"
                              ? request.tutorId._id
                              : request.tutorId;
                        return (
                           <ApplicationCard
                              key={request._id}
                              request={request}
                              onViewDetail={handleViewRequest}
                              hasReported={
                                 tutorId
                                    ? reportStatusMap[tutorId]?.hasReported
                                    : false
                              }
                              canReport={
                                 tutorId
                                    ? reportStatusMap[tutorId]?.canReport
                                    : false
                              }
                              onOpenReport={handleOpenReportModal}
                           />
                        );
                     })}
                  </div>
               </div>
            )}

            {/* Rejected Requests Section */}
            {rejectedRequests.length > 0 && (
               <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                     <XCircle className="h-5 w-5 text-red-500" />
                     Từ chối ({rejectedRequests.length})
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {rejectedRequests.map((request) => {
                        const tutorId =
                           typeof request.tutorId === "object"
                              ? request.tutorId._id
                              : request.tutorId;
                        return (
                           <ApplicationCard
                              key={request._id}
                              request={request}
                              onViewDetail={handleViewRequest}
                              hasReported={
                                 tutorId
                                    ? reportStatusMap[tutorId]?.hasReported
                                    : false
                              }
                              canReport={
                                 tutorId
                                    ? reportStatusMap[tutorId]?.canReport
                                    : false
                              }
                              onOpenReport={handleOpenReportModal}
                           />
                        );
                     })}
                  </div>
               </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages >= 1 && (
               <div className="mt-6 flex items-center justify-center">
                  <Pagination
                     currentPage={pagination.page}
                     totalPages={pagination.totalPages}
                     onPageChange={(p) => setPage(p)}
                     maxVisiblePages={5}
                  />
               </div>
            )}
         </div>

         <RequestDetailModal
            isOpen={!!selectedRequest}
            onClose={handleCloseModal}
            request={selectedRequest}
            canReport={
               selectedRequest
                  ? (() => {
                       const tutorId =
                          typeof selectedRequest.tutorId === "object"
                             ? selectedRequest.tutorId._id
                             : selectedRequest.tutorId;
                       return tutorId
                          ? reportStatusMap[tutorId]?.canReport
                          : false;
                    })()
                  : false
            }
            hasReported={
               selectedRequest
                  ? (() => {
                       const tutorId =
                          typeof selectedRequest.tutorId === "object"
                             ? selectedRequest.tutorId._id
                             : selectedRequest.tutorId;
                       return tutorId
                          ? reportStatusMap[tutorId]?.hasReported
                          : false;
                    })()
                  : false
            }
            onOpenReport={handleOpenReportModal}
         />

         {selectedTutorId && (
            <ReportModal
               isOpen={reportModalOpen}
               onClose={handleCloseReportModal}
               tutorId={selectedTutorId}
               tutorName={selectedTutorName || undefined}
               onSubmit={handleSubmitReport}
            />
         )}
      </div>
   );
};

const ApplicationCard = ({
   request,
   onViewDetail,
   canReport,
   hasReported,
   onOpenReport,
}: {
   request: TeachingRequest;
   onViewDetail: (request: TeachingRequest) => void;
   canReport?: boolean;
   hasReported?: boolean;
   onOpenReport?: (
      tutorId: string,
      tutorName: string,
      teachingRequestId: string
   ) => void;
}) => {
   const tutor = request.tutorId?.userId;
   const tutorId =
      typeof request.tutorId === "object"
         ? request.tutorId._id
         : request.tutorId;

   const handleReportClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (tutorId && tutor?.name && onOpenReport) {
         onOpenReport(tutorId, tutor.name, request._id);
      }
   };

   return (
      <Card className="group flex flex-col h-full transition-all hover:shadow-lg hover:border-primary/50 overflow-hidden">
         <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
               <div className="flex-1">
                  <CardTitle className="text-base text-card-foreground line-clamp-1">
                     {getSubjectLabelVi(request.subject)}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                     {getLevelLabelVi(request.level)}
                  </p>
               </div>
               <TeachingRequestStatusBadge status={request.status} />
            </div>
         </CardHeader>

         <CardContent className="flex-grow pb-4">
            {/* Tutor Info */}
            <div className="flex items-center gap-3 mb-4">
               <Avatar className="h-10 w-10 ring-2 ring-background">
                  <AvatarImage src={tutor?.avatarUrl} alt={tutor?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                     {tutor?.name?.charAt(0).toUpperCase() || "T"}
                  </AvatarFallback>
               </Avatar>
               <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground text-sm truncate">
                     {tutor?.name || "Gia sư"}
                  </p>
                  <p className="text-xs text-muted-foreground">Gia sư</p>
               </div>
               {hasReported ? (
                  <Badge
                     variant="outline"
                     className="h-8 px-2 text-xs bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50"
                  >
                     <Flag className="h-3 w-3 mr-1" />
                     Đã báo cáo
                  </Badge>
               ) : canReport ? (
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={handleReportClick}
                     className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:border-red-400/50 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                  >
                     <Flag className="h-3 w-3 mr-1" />
                     Báo cáo
                  </Button>
               ) : null}
            </div>

            {/* Submitted Time */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-md">
               Gửi lúc: {moment(request.createdAt).format("HH:mm DD/MM/YYYY")}
            </div>
         </CardContent>

         <CardFooter className="pt-4">
            <Button
               onClick={() => onViewDetail(request)}
               className="w-full relative h-10 group/btn"
            >
               <span className="relative z-10 flex items-center justify-center gap-2">
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
               </span>
            </Button>
         </CardFooter>
      </Card>
   );
};

export default MyApplicationsPage;
