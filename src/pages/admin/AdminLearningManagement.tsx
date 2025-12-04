import { useState } from "react";
import { useAdminLearning } from "@/hooks/useAdminLearning";
import {
   LearningCommitment,
   AdminResolvedCaseLog,
   CancellationDecisionStatus,
} from "@/types/learningCommitment";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/common/Pagination";

const AdminLearningManagement = () => {
   // Pagination states for pending and history
   const [pendingPage, setPendingPage] = useState(1);
   const [historyPage, setHistoryPage] = useState(1);
   const pendingLimit = 10;
   const historyLimit = 10;

   const {
      disputedCommitments,
      resolvedCommitments,
      isLoadingDisputes,
      isLoadingResolved,
   } = useAdminLearning(undefined, {
      disputedPage: pendingPage,
      disputedLimit: pendingLimit,
      resolvedPage: historyPage,
      resolvedLimit: historyLimit,
   });
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

   const pendingCommitments: LearningCommitment[] =
      disputedCommitments?.data ?? [];
   const resolvedLogs: AdminResolvedCaseLog[] = resolvedCommitments?.data ?? [];

   const pendingTotal =
      disputedCommitments?.pagination?.total ?? pendingCommitments.length;
   const historyTotal =
      resolvedCommitments?.pagination?.total ?? resolvedLogs.length;

   const pendingPages = Math.max(
      1,
      disputedCommitments?.pagination?.pages ?? 1
   );
   const historyPages = Math.max(
      1,
      resolvedCommitments?.pagination?.pages ?? 1
   );

   const formatDate = (date?: string) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("vi-VN", {
         day: "2-digit",
         month: "2-digit",
         year: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   const getPersonName = (person?: {
      userId?: { name?: string };
      name?: string;
      _id?: string;
   }) => person?.userId?.name ?? person?.name ?? person?._id ?? "N/A";

   const getPersonEmail = (person?: {
      userId?: { email?: string };
      email?: string;
   }) => person?.userId?.email ?? person?.email ?? "—";

   const getDecisionLabel = (status?: CancellationDecisionStatus | string) => {
      switch (status) {
         case "ACCEPTED":
            return "Chấp nhận";
         case "REJECTED":
            return "Từ chối";
         case "PENDING":
            return "Chờ xử lý";
         default:
            return status ?? "Không xác định";
      }
   };

   const renderPendingTable = () => {
      if (isLoadingDisputes) {
         return (
            <div className="py-10 text-center text-sm text-muted-foreground">
               Đang tải danh sách tranh chấp...
            </div>
         );
      }

      if (!pendingCommitments.length) {
         return (
            <div className="py-10 text-center text-sm text-muted-foreground">
               Hiện không có tranh chấp nào cần xử lý.
            </div>
         );
      }

      return (
         <>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Học viên</TableHead>
                     <TableHead>Gia sư</TableHead>
                     <TableHead>Trạng thái đôi bên</TableHead>
                     <TableHead>Thống kê vắng</TableHead>
                     <TableHead>Yêu cầu lúc</TableHead>
                     <TableHead>Thao tác</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {pendingCommitments.map((item) => (
                     <TableRow key={item._id}>
                        <TableCell>
                           <p className="font-medium">
                              {getPersonName(item.student)}
                           </p>
                           <p className="text-xs text-muted-foreground">
                              {getPersonEmail(item.student)}
                           </p>
                        </TableCell>
                        <TableCell>
                           <p className="font-medium">
                              {getPersonName(item.tutor)}
                           </p>
                           <p className="text-xs text-muted-foreground">
                              {getPersonEmail(item.tutor)}
                           </p>
                        </TableCell>
                        <TableCell>
                           <div className="space-y-1 text-xs">
                              <Badge variant="secondary" className="capitalize">
                                 HS:{" "}
                                 {getDecisionLabel(
                                    item.cancellationDecision?.student.status
                                 )}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                 GS:{" "}
                                 {getDecisionLabel(
                                    item.cancellationDecision?.tutor.status
                                 )}
                              </Badge>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="text-xs leading-5">
                              <p>
                                 Tổng: {item.absenceStats?.totalSessions ?? 0}
                              </p>
                              <p className="text-red-600">
                                 Học viên:{" "}
                                 {item.absenceStats?.studentAbsent ?? 0}
                              </p>
                              <p className="text-orange-600">
                                 Gia sư: {item.absenceStats?.tutorAbsent ?? 0}
                              </p>
                           </div>
                        </TableCell>
                        <TableCell>
                           {formatDate(item.cancellationDecision?.requestedAt)}
                        </TableCell>
                        <TableCell>
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                 navigate(`/admin/learning/${item._id}`)
                              }
                           >
                              Xử lý
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>

            <div className="mt-4 flex justify-end">
               <Pagination
                  currentPage={pendingPage}
                  totalPages={pendingPages}
                  onPageChange={(p) => setPendingPage(p)}
               />
            </div>
         </>
      );
   };

   const renderHistoryTable = () => {
      if (isLoadingResolved) {
         return (
            <div className="py-10 text-center text-sm text-muted-foreground">
               Đang tải lịch sử xử lý...
            </div>
         );
      }

      if (!resolvedLogs.length) {
         return (
            <div className="py-10 text-center text-sm text-muted-foreground">
               Chưa có tranh chấp nào được xử lý.
            </div>
         );
      }

      const getActionLabel = (action?: string): string => {
         switch (action) {
            case "resolve_disagreement":
               return "Giải quyết bất đồng";
            case "approve_cancellation":
               return "Phê duyệt hủy";
            case "reject_cancellation":
               return "Từ chối hủy";
            default:
               return action ?? "Không xác định";
         }
      };

      return (
         <>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Học viên</TableHead>
                     <TableHead>Gia sư</TableHead>
                     <TableHead>Hành động</TableHead>
                     <TableHead>Ghi chú admin</TableHead>
                     <TableHead>Người xử lý</TableHead>
                     <TableHead>Thời gian</TableHead>
                     <TableHead>Thao tác</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {resolvedLogs.map((item) => (
                     <TableRow
                        key={
                           item.logId ??
                           `${item.commitmentId}-${item.handledAt}`
                        }
                     >
                        <TableCell>
                           <p className="font-medium">
                              {getPersonName(item.student)}
                           </p>
                           <p className="text-xs text-muted-foreground">
                              {getPersonEmail(item.student)}
                           </p>
                        </TableCell>
                        <TableCell>
                           <p className="font-medium">
                              {getPersonName(item.tutor)}
                           </p>
                           <p className="text-xs text-muted-foreground">
                              {getPersonEmail(item.tutor)}
                           </p>
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline">
                              {getActionLabel(item.action)}
                           </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs text-sm">
                           {item.adminNotes ?? "Không có ghi chú"}
                        </TableCell>
                        <TableCell>
                           {typeof item.handledBy === "string"
                              ? item.handledBy
                              : item.handledBy?.name ??
                                item.handledBy?.email ??
                                item.handledBy?._id ??
                                "Unknown"}
                        </TableCell>
                        <TableCell>{formatDate(item.handledAt)}</TableCell>
                        <TableCell>
                           <Button
                              variant="outline"
                              size="sm"
                              disabled={!item.commitmentId}
                              onClick={() =>
                                 item.commitmentId &&
                                 navigate(
                                    `/admin/learning/${item.commitmentId}`,
                                    {
                                       state: {
                                          viewMode: "history",
                                          log: item,
                                       },
                                    }
                                 )
                              }
                           >
                              Xem chi tiết
                           </Button>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>

            <div className="mt-4 flex justify-end">
               <Pagination
                  currentPage={historyPage}
                  totalPages={historyPages}
                  onPageChange={(p) => setHistoryPage(p)}
               />
            </div>
         </>
      );
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Learning Commitment Management</CardTitle>
            <CardDescription>
               Theo dõi các yêu cầu hủy đang chờ xử lý và lịch sử các case đã
               giải quyết.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Tabs
               value={activeTab}
               onValueChange={(value) =>
                  setActiveTab(value as "pending" | "history")
               }
            >
               <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pending">
                     Đang cần xử lý ({pendingTotal})
                  </TabsTrigger>
                  <TabsTrigger value="history">
                     Lịch sử ({historyTotal})
                  </TabsTrigger>
               </TabsList>

               <TabsContent value="pending" className="mt-6">
                  {renderPendingTable()}
               </TabsContent>
               <TabsContent value="history" className="mt-6">
                  {renderHistoryTable()}
               </TabsContent>
            </Tabs>
         </CardContent>
      </Card>
   );
};

export default AdminLearningManagement;
