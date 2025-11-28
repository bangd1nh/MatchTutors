import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Loader2, Eye, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { AdminReportDetailModal } from "@/components/admin/violation-report/AdminReportDetailModal";
import {
   getAdminViolationReports,
   type ViolationReport,
} from "@/api/violationReport";
import { ViolationStatusEnum, ViolationTypeEnum } from "@/enums/violationReport.enum";
import { useToast } from "@/hooks/useToast";
import moment from "moment";

const ITEMS_PER_PAGE = 20;

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

export default function AdminViolationReportManagement() {
   const [reports, setReports] = useState<ViolationReport[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [selectedReport, setSelectedReport] = useState<ViolationReport | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [filters, setFilters] = useState({
      page: 1,
      limit: ITEMS_PER_PAGE,
      status: "PENDING" as string | null,
      type: null as string | null,
   });
   const [pagination, setPagination] = useState({
      page: 1,
      limit: ITEMS_PER_PAGE,
      total: 0,
      pages: 1,
   });
   const toast = useToast();

   const loadReports = useCallback(async () => {
      setIsLoading(true);
      try {
         const result = await getAdminViolationReports({
            page: filters.page,
            limit: filters.limit,
            status: filters.status || undefined,
            type: filters.type || undefined,
         });
         // Đảm bảo reports là array và pagination có đầy đủ fields
         setReports(Array.isArray(result?.reports) ? result.reports : []);
         setPagination({
            page: result?.pagination?.page || filters.page,
            limit: result?.pagination?.limit || filters.limit,
            total: result?.pagination?.total || 0,
            pages: result?.pagination?.pages || 1,
         });
      } catch (error: any) {
         console.error("Error loading reports:", error);
         console.error("Error details:", {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
         });
         toast("error", error?.response?.data?.message || error?.message || "Không thể tải danh sách báo cáo");
         // Set empty state on error
         setReports([]);
         setPagination({
            page: filters.page,
            limit: filters.limit,
            total: 0,
            pages: 1,
         });
      } finally {
         setIsLoading(false);
      }
   }, [filters, toast]);

   useEffect(() => {
      loadReports();
   }, [loadReports]);

   const handleViewDetail = (report: ViolationReport) => {
      setSelectedReport(report);
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedReport(null);
   };

   const handleModalSuccess = () => {
      loadReports(); // Refresh danh sách
      handleCloseModal();
   };

   const getReporterName = (report: ViolationReport) => {
      if (typeof report.reporterId === "object") {
         return report.reporterId.name;
      }
      return "N/A";
   };

   const getReporterEmail = (report: ViolationReport) => {
      if (typeof report.reporterId === "object") {
         return report.reporterId.email;
      }
      return "N/A";
   };

   const getReportedUserName = (report: ViolationReport) => {
      if (typeof report.reportedUserId === "object") {
         return report.reportedUserId.name;
      }
      return "N/A";
   };

   const getReportedUserEmail = (report: ViolationReport) => {
      if (typeof report.reportedUserId === "object") {
         return report.reportedUserId.email;
      }
      return "N/A";
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Quản lý báo cáo vi phạm</h1>
               <p className="text-muted-foreground mt-1">
                  Xem và xử lý các báo cáo vi phạm từ học sinh
               </p>
            </div>
         </div>

         {/* Filters */}
         <Card>
            <CardHeader>
               <CardTitle>Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Trạng thái</label>
                     <Select
                        value={filters.status || "all"}
                        onValueChange={(value) =>
                           setFilters({ ...filters, status: value === "all" ? null : value, page: 1 })
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Tất cả trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">Tất cả</SelectItem>
                           <SelectItem value={ViolationStatusEnum.PENDING}>
                              Đang chờ
                           </SelectItem>
                           <SelectItem value={ViolationStatusEnum.RESOLVED}>
                              Đã xử lý
                           </SelectItem>
                           <SelectItem value={ViolationStatusEnum.REJECTED}>
                              Đã từ chối
                           </SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium">Loại vi phạm</label>
                     <Select
                        value={filters.type || "all"}
                        onValueChange={(value) =>
                           setFilters({ ...filters, type: value === "all" ? null : value, page: 1 })
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Tất cả loại" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all">Tất cả</SelectItem>
                           <SelectItem value={ViolationTypeEnum.SCAM_TUTOR}>
                              Gia sư lừa đảo
                           </SelectItem>
                           <SelectItem value={ViolationTypeEnum.FALSE_FEEDBACK}>
                              Đánh giá sai
                           </SelectItem>
                           <SelectItem value={ViolationTypeEnum.SCAM_STUDENT}>
                              Học sinh lừa đảo
                           </SelectItem>
                           <SelectItem value="OTHER">Khác</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Reports Table */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danh sách báo cáo ({pagination.total})
               </CardTitle>
            </CardHeader>
            <CardContent>
               {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                     <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
               ) : reports.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                     Không có báo cáo nào
                  </div>
               ) : (
                  <>
                     <div className="rounded-md border">
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Người báo cáo</TableHead>
                                 <TableHead>Tutor bị report</TableHead>
                                 <TableHead>Loại</TableHead>
                                 <TableHead>Lý do</TableHead>
                                 <TableHead>Trạng thái</TableHead>
                                 <TableHead>Ngày tạo</TableHead>
                                 <TableHead>Hành động</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {reports.map((report) => {
                                 if (!report || !report._id) {
                                    console.warn("Invalid report data:", report);
                                    return null;
                                 }
                                 return (
                                    <TableRow key={report._id}>
                                       <TableCell>
                                          <div>
                                             <p className="font-medium">
                                                {getReporterName(report)}
                                             </p>
                                             <p className="text-xs text-muted-foreground">
                                                {getReporterEmail(report)}
                                             </p>
                                          </div>
                                       </TableCell>
                                       <TableCell>
                                          <div>
                                             <p className="font-medium">
                                                {getReportedUserName(report)}
                                             </p>
                                             <p className="text-xs text-muted-foreground">
                                                {getReportedUserEmail(report)}
                                             </p>
                                          </div>
                                       </TableCell>
                                       <TableCell>
                                          {VIOLATION_TYPE_LABELS[report.type] || report.type || "N/A"}
                                       </TableCell>
                                       <TableCell className="max-w-xs truncate">
                                          {report.reason || "N/A"}
                                       </TableCell>
                                       <TableCell>
                                          <Badge
                                             className={
                                                STATUS_COLORS[report.status] ||
                                                "bg-gray-100 text-gray-800"
                                             }
                                          >
                                             {STATUS_LABELS[report.status] || report.status || "N/A"}
                                          </Badge>
                                       </TableCell>
                                       <TableCell>
                                          {report.createdAt
                                             ? moment(report.createdAt).format("DD/MM/YYYY HH:mm")
                                             : "N/A"}
                                       </TableCell>
                                       <TableCell>
                                          <Button
                                             variant="outline"
                                             size="sm"
                                             onClick={() => handleViewDetail(report)}
                                          >
                                             <Eye className="h-4 w-4 mr-2" />
                                             Xem chi tiết
                                          </Button>
                                       </TableCell>
                                    </TableRow>
                                 );
                              })}
                           </TableBody>
                        </Table>
                     </div>

                     {/* Pagination */}
                     {pagination.pages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                           <div className="text-sm text-muted-foreground">
                              Trang {pagination.page} / {pagination.pages} (Tổng:{" "}
                              {pagination.total})
                           </div>
                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() =>
                                    setFilters({ ...filters, page: filters.page - 1 })
                                 }
                                 disabled={filters.page <= 1 || isLoading}
                              >
                                 <ChevronLeft className="h-4 w-4" />
                                 Trước
                              </Button>
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() =>
                                    setFilters({ ...filters, page: filters.page + 1 })
                                 }
                                 disabled={
                                    filters.page >= pagination.pages || isLoading
                                 }
                              >
                                 Sau
                                 <ChevronRight className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                     )}
                  </>
               )}
            </CardContent>
         </Card>

         {/* Detail Modal */}
         {selectedReport && (
            <AdminReportDetailModal
               report={selectedReport}
               isOpen={isModalOpen}
               onClose={handleCloseModal}
               onSuccess={handleModalSuccess}
            />
         )}
      </div>
   );
}

