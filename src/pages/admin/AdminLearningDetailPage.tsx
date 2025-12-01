import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAdminLearning } from "@/hooks/useAdminLearning";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   AdminResolvedCaseLog,
   AdminDisputeLog,
   CancellationDecision,
} from "@/types/learningCommitment";

interface LocationState {
   viewMode?: "pending" | "history";
   log?: AdminResolvedCaseLog;
}

type HistoryLog = AdminResolvedCaseLog | AdminDisputeLog;

const isResolvedCaseLog = (log: HistoryLog): log is AdminResolvedCaseLog => {
   return "handledBy" in log || "logId" in log;
};

const AdminLearningDetailPage = () => {
   const { commitmentId } = useParams<{ commitmentId: string }>();
   const location = useLocation();
   const { viewMode, log: resolvedLog } =
      (location.state as LocationState) || {};
   const {
      commitmentDetail: commitment,
      isLoadingDetail,
      approve,
      reject,
      isApproving,
      isRejecting,
   } = useAdminLearning(commitmentId);
   const [adminNotes, setAdminNotes] = useState("");
   const adminDisputeLogs = commitment?.adminDisputeLogs ?? [];
   const sortedAdminLogs = [...adminDisputeLogs].sort((a, b) => {
      const timeA = new Date(a.handledAt || "").getTime();
      const timeB = new Date(b.handledAt || "").getTime();
      return timeB - timeA;
   });
   const latestAdminLog: AdminDisputeLog | undefined = sortedAdminLogs[0];
   const historyLog = resolvedLog ?? latestAdminLog;
   const isHistoryView = viewMode === "history" || (!!resolvedLog && !viewMode);

   if (isLoadingDetail) return <div>Loading details...</div>;
   if (!commitment) return <div>Commitment not found.</div>;

   const decision = commitment.cancellationDecision;
   const snapshotDecision = historyLog?.cancellationDecisionSnapshot;
   const displayDecision: CancellationDecision | undefined =
      isHistoryView && snapshotDecision ? snapshotDecision : decision;
   const absenceStats = (commitment as any).absenceStats || {};

   const handleApprove = () => {
      if (commitmentId && adminNotes) {
         approve({ id: commitmentId, notes: adminNotes });
      }
   };

   const handleReject = () => {
      if (commitmentId && adminNotes) {
         reject({ id: commitmentId, notes: adminNotes });
      }
   };

   const formatDate = (date: string | Date) => {
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

   const getStatusVariant = (status?: string) => {
      switch (status) {
         case "ACCEPTED":
            return "default";
         case "REJECTED":
            return "destructive";
         default:
            return "secondary";
      }
   };

   const getHistoryLogNotes = (log?: HistoryLog): string | undefined => {
      if (!log) return undefined;
      if (isResolvedCaseLog(log)) {
         return log.adminNotes;
      }
      return log.notes;
   };

   return (
      <div className="space-y-4">
         <Card>
            <CardHeader>
               <CardTitle>Thông tin tranh chấp</CardTitle>
               <CardDescription>
                  Xem chi tiết yêu cầu hủy học và trạng thái của đôi bên.
               </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                     <p className="text-xs uppercase text-muted-foreground mb-2">
                        Học viên
                     </p>
                     <p className="font-semibold">
                        {getPersonName(commitment.student)}
                     </p>
                     <p className="text-sm text-muted-foreground">
                        {getPersonEmail(commitment.student)}
                     </p>
                  </div>
                  <div className="rounded-lg border p-4">
                     <p className="text-xs uppercase text-muted-foreground mb-2">
                        Gia sư
                     </p>
                     <p className="font-semibold">
                        {getPersonName(commitment.tutor)}
                     </p>
                     <p className="text-sm text-muted-foreground">
                        {getPersonEmail(commitment.tutor)}
                     </p>
                  </div>
               </div>
               <div className="grid gap-4 md:grid-cols-2">
                  <div>
                     <h3 className="font-semibold">Học viên</h3>
                     <Badge variant={getStatusVariant(displayDecision?.student?.status)}>
                        {displayDecision?.student?.status ?? "N/A"}
                     </Badge>
                     <p className="text-sm text-muted-foreground mt-2">
                        Lý do: {displayDecision?.student?.reason || "Không cung cấp"}
                     </p>
                  </div>
                  <div>
                     <h3 className="font-semibold">Gia sư</h3>
                     <Badge variant={getStatusVariant(displayDecision?.tutor?.status)}>
                        {displayDecision?.tutor?.status ?? "N/A"}
                     </Badge>
                     <p className="text-sm text-muted-foreground mt-2">
                        Lý do: {displayDecision?.tutor?.reason || "Không cung cấp"}
                     </p>
                  </div>
               </div>
               <div>
                  <h3 className="font-semibold">Chi tiết yêu cầu</h3>
                  <p className="text-sm">
                     Người gửi: {displayDecision?.requestedBy ?? "Không rõ"}
                  </p>
                  <p className="text-sm">
                     Lý do chung: {displayDecision?.reason || "Không cung cấp"}
                  </p>
                  <p className="text-sm">
                     Thời gian gửi:{" "}
                     {displayDecision?.requestedAt
                        ? formatDate(displayDecision.requestedAt)
                        : "N/A"}
                  </p>
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle>Thống kê vắng học</CardTitle>
               <CardDescription>
                  Tổng hợp số buổi vắng để hỗ trợ quyết định.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-slate-50 p-4 rounded-lg">
                     <p className="text-sm text-muted-foreground">
                        Tổng số buổi
                     </p>
                     <p className="text-2xl font-bold">
                        {absenceStats.totalSessions ?? 0}
                     </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                     <p className="text-sm text-red-600 font-semibold">
                        Học viên vắng
                     </p>
                     <p className="text-2xl font-bold text-red-600">
                        {absenceStats.studentAbsent ?? 0}
                     </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                     <p className="text-sm text-orange-600 font-semibold">
                        Gia sư vắng
                     </p>
                     <p className="text-2xl font-bold text-orange-600">
                        {absenceStats.tutorAbsent ?? 0}
                     </p>
                  </div>
               </div>

               {absenceStats.sessionDetails &&
                  absenceStats.sessionDetails.length > 0 && (
                     <div className="mt-6">
                        <h4 className="font-semibold mb-3">
                           Chi tiết từng buổi
                        </h4>
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Ngày & giờ</TableHead>
                                 <TableHead>Trạng thái</TableHead>
                                 <TableHead>Học viên</TableHead>
                                 <TableHead>Gia sư</TableHead>
                                 <TableHead>Lý do</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {absenceStats.sessionDetails.map(
                                 (session: any) => {
                                    // Chỉ hiển thị attendance info khi session đã COMPLETED hoặc NOT_CONDUCTED
                                    const hasAttendanceInfo = [
                                       "COMPLETED",
                                       "NOT_CONDUCTED",
                                    ].includes(session.status);

                                    const isDisputed =
                                       session.status === "DISPUTED";

                                    return (
                                       <TableRow key={session._id}>
                                          <TableCell className="text-sm">
                                             {formatDate(session.startTime)}
                                          </TableCell>
                                          <TableCell>
                                             <Badge variant="outline">
                                                {session.status}
                                                {session.isTrial && " (Trial)"}
                                             </Badge>
                                          </TableCell>
                                          <TableCell>
                                             {isDisputed ? (
                                                <span className="text-muted-foreground text-sm">
                                                   Đang chờ xử lý
                                                </span>
                                             ) : hasAttendanceInfo ? (
                                                session.studentAbsent ? (
                                                   <Badge variant="destructive">
                                                      Vắng
                                                   </Badge>
                                                ) : (
                                                   <Badge variant="outline">
                                                      Có mặt
                                                   </Badge>
                                                )
                                             ) : (
                                                <span className="text-muted-foreground text-sm">
                                                   Chưa xác nhận
                                                </span>
                                             )}
                                          </TableCell>
                                          <TableCell>
                                             {isDisputed ? (
                                                <span className="text-muted-foreground text-sm">
                                                   Đang chờ xử lý
                                                </span>
                                             ) : hasAttendanceInfo ? (
                                                session.tutorAbsent ? (
                                                   <Badge variant="destructive">
                                                      Vắng
                                                   </Badge>
                                                ) : (
                                                   <Badge variant="outline">
                                                      Có mặt
                                                   </Badge>
                                                )
                                             ) : (
                                                <span className="text-muted-foreground text-sm">
                                                   Chưa xác nhận
                                                </span>
                                             )}
                                          </TableCell>
                                          <TableCell className="text-sm text-muted-foreground">
                                             {session.absenceReason ||
                                                "Không có"}
                                          </TableCell>
                                       </TableRow>
                                    );
                                 }
                              )}
                           </TableBody>
                        </Table>
                     </div>
                  )}
            </CardContent>
         </Card>

         {isHistoryView && historyLog && (
            <Card>
               <CardHeader>
                  <CardTitle>Kết quả đã xử lý</CardTitle>
                  <CardDescription>
                     Case này đã được admin xử lý trước đó. Bạn chỉ có thể xem
                     lại thông tin.
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-2">
                  <p className="text-sm">
                     Hành động:{" "}
                     <Badge variant="outline" className="capitalize">
                        {historyLog?.action ?? "N/A"}
                     </Badge>
                  </p>
                  <p className="text-sm capitalize">
                     Trạng thái sau xử lý: {historyLog?.statusAfter ?? "N/A"}
                  </p>
                  <p className="text-sm">
                     Thời gian xử lý: {formatDate(historyLog?.handledAt || "")}
                  </p>
                  <p className="text-sm">
                     Admin ghi chú: {getHistoryLogNotes(historyLog) || "Không có"}
                  </p>
                  {historyLog?.cancellationDecisionSnapshot && (
                     <div className="mt-4 text-sm">
                        <p className="font-semibold">
                           Snapshot tại thời điểm xử lý
                        </p>
                        <p>
                           Học viên:{" "}
                           {historyLog.cancellationDecisionSnapshot.student.status}
                        </p>
                        <p>
                           Gia sư:{" "}
                           {historyLog.cancellationDecisionSnapshot.tutor.status}
                        </p>
                        <p>
                           Lý do:{" "}
                           {historyLog.cancellationDecisionSnapshot.reason ??
                              "Không có"}
                        </p>
                     </div>
                  )}
               </CardContent>
            </Card>
         )}

         {!isHistoryView && (
            <Card>
               <CardHeader>
                  <CardTitle>Hành động của Admin</CardTitle>
               </CardHeader>
               <CardContent>
                  <Textarea
                     placeholder="Ghi chú cho quyết định của bạn..."
                     value={adminNotes}
                     onChange={(e) => setAdminNotes(e.target.value)}
                     rows={4}
                  />
               </CardContent>
               <CardFooter className="flex justify-end gap-2">
                  <Button
                     variant="destructive"
                     onClick={handleReject}
                     disabled={!adminNotes || isRejecting || isApproving}
                  >
                     {isRejecting ? "Đang từ chối..." : "Từ chối yêu cầu hủy"}
                  </Button>
                  <Button
                     onClick={handleApprove}
                     disabled={!adminNotes || isApproving || isRejecting}
                  >
                     {isApproving ? "Đang duyệt..." : "Duyệt yêu cầu hủy"}
                  </Button>
               </CardFooter>
            </Card>
         )}
      </div>
   );
};

export default AdminLearningDetailPage;
