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
import { User, Users, Calendar, CheckCircle, XCircle } from "lucide-react";

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

   if (isLoadingDetail) return <div>Đang tải chi tiết...</div>;
   if (!commitment) return <div>Không tìm thấy cam kết học.</div>;

   const decision = commitment.cancellationDecision;
   const snapshotDecision = historyLog?.cancellationDecisionSnapshot;
   const displayDecision: CancellationDecision | undefined =
      isHistoryView && snapshotDecision ? snapshotDecision : decision;

   const detailedStats = (() => {
      const explicitAbsence = (commitment as any).absenceStats;
      const stats = (commitment as any).stats;
      const sessionsAll: any[] = [];

      // collect helper ids/names
      const studentIds = new Set<string>();
      const tutorIds = new Set<string>();
      const studentNames = new Set<string>();
      const tutorNames = new Set<string>();
      try {
         const st = (commitment as any).student;
         if (st) {
            if (st._id) studentIds.add(st._id);
            if (st.userId?._id) studentIds.add(st.userId._id);
            if (st.userId?.name) studentNames.add(st.userId.name);
            if (st.name) studentNames.add(st.name);
         }
         const tu = (commitment as any).tutor;
         if (tu) {
            if (tu._id) tutorIds.add(tu._id);
            if (tu.userId?._id) tutorIds.add(tu.userId._id);
            if (tu.userId?.name) tutorNames.add(tu.userId.name);
            if (tu.name) tutorNames.add(tu.name);
         }
      } catch (e) {}

      // helper to infer role from cancelledBy / notConducted reporter
      const inferRole = (who: any): "student" | "tutor" | "unknown" => {
         if (!who) return "unknown";
         if (typeof who === "string") {
            if (
               studentIds.has(who) ||
               Array.from(studentNames).some((n) => who.includes(n))
            )
               return "student";
            if (
               tutorIds.has(who) ||
               Array.from(tutorNames).some((n) => who.includes(n))
            )
               return "tutor";
            return "unknown";
         }
         const id = who._id || who.userId?._id;
         const name = who.name || who.userId?.name;
         if (id && studentIds.has(id)) return "student";
         if (id && tutorIds.has(id)) return "tutor";
         if (name && studentNames.has(name)) return "student";
         if (name && tutorNames.has(name)) return "tutor";
         return "unknown";
      };

      // Build sessions list from either explicit absenceStats.sessionDetails or stats.*.sessions
      if (explicitAbsence && Array.isArray(explicitAbsence.sessionDetails)) {
         explicitAbsence.sessionDetails.forEach((s: any) => {
            sessionsAll.push(s);
         });
      } else if (stats) {
         [
            "completed",
            "cancelled",
            "notConducted",
            "dispute",
            "rejected",
         ].forEach((cat) => {
            const catObj = stats[cat];
            if (!catObj) return;
            const arr = catObj.sessions || [];
            arr.forEach((s: any) => {
               // normalize session object
               const statusMap: Record<string, string> = {
                  completed: "COMPLETED",
                  cancelled: "CANCELLED",
                  notConducted: "NOT_CONDUCTED",
                  dispute: "DISPUTED",
                  rejected: "REJECTED",
               };
               const normalized = {
                  _id: s._id,
                  startTime: s.startTime,
                  endTime: s.endTime,
                  status: statusMap[cat] || s.status || cat.toUpperCase(),
                  isTrial: !!s.isTrial,
                  // infer who cancelled / caused notConducted if possible
                  cancelledBy: s.cancelledBy ?? s.cancelledByName ?? null,
                  studentAbsent:
                     typeof s.studentAbsent !== "undefined"
                        ? !!s.studentAbsent
                        : undefined,
                  tutorAbsent:
                     typeof s.tutorAbsent !== "undefined"
                        ? !!s.tutorAbsent
                        : undefined,
                  absenceReason:
                     s.reason || s.absenceReason || s.cancelledBy || undefined,
               };
               sessionsAll.push(normalized);
            });
         });
      }

      // assemble buckets
      const result = {
         totalSessions: commitment?.totalSessions ?? sessionsAll.length,
         completed: { total: 0, sessions: [] as any[] },
         cancelled: {
            total: 0,
            tutorCancelled: 0,
            studentCancelled: 0,
            sessions: [] as any[],
         },
         notConducted: {
            total: 0,
            tutorNotConducted: 0,
            studentNotConducted: 0,
            sessions: [] as any[],
         },
         dispute: { total: 0, sessions: [] as any[] },
         rejected: { total: 0, sessions: [] as any[] },
      };

      sessionsAll.forEach((s) => {
         const st = {
            _id: s._id,
            startTime: s.startTime,
            endTime: s.endTime,
            isTrial: s.isTrial,
            reason: s.absenceReason || "Không có",
            // ensure UI can display status label correctly
            status: (s.status || "").toString(),
         };

         switch ((s.status || "").toUpperCase()) {
            case "COMPLETED":
               result.completed.total++;
               result.completed.sessions.push(st);
               break;
            case "CANCELLED": {
               result.cancelled.total++;
               // infer who cancelled: prefer explicit studentAbsent/tutorAbsent flags, else use cancelledBy
               let role: "student" | "tutor" | "unknown" = "unknown";
               if (typeof s.studentAbsent !== "undefined" && s.studentAbsent)
                  role = "student";
               else if (typeof s.tutorAbsent !== "undefined" && s.tutorAbsent)
                  role = "tutor";
               else role = inferRole(s.cancelledBy);
               if (role === "student") result.cancelled.studentCancelled++;
               else if (role === "tutor") result.cancelled.tutorCancelled++;
               result.cancelled.sessions.push({ ...st, cancelledByRole: role });
               break;
            }
            case "NOT_CONDUCTED": {
               result.notConducted.total++;
               let role: "student" | "tutor" | "unknown" = "unknown";
               if (typeof s.studentAbsent !== "undefined" && s.studentAbsent)
                  role = "student";
               else if (typeof s.tutorAbsent !== "undefined" && s.tutorAbsent)
                  role = "tutor";
               else role = inferRole(s.cancelledBy || s.recordedBy);
               if (role === "student")
                  result.notConducted.studentNotConducted++;
               else if (role === "tutor")
                  result.notConducted.tutorNotConducted++;
               result.notConducted.sessions.push({
                  ...st,
                  notConductedByRole: role,
               });
               break;
            }
            case "DISPUTED":
            case "DISPUTE":
               result.dispute.total++;
               result.dispute.sessions.push(st);
               break;
            case "REJECTED":
               result.rejected.total++;
               result.rejected.sessions.push(st);
               break;
            default:
               // put unknown statuses into rejected as fallback
               result.rejected.total++;
               result.rejected.sessions.push(st);
               break;
         }
      });

      // sort each sessions list by startTime desc
      Object.values(result).forEach((bucket: any) => {
         if (bucket && Array.isArray(bucket.sessions)) {
            bucket.sessions.sort(
               (a: any, b: any) =>
                  new Date(b.startTime).getTime() -
                  new Date(a.startTime).getTime()
            );
         }
      });

      return result;
   })();

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
      if (!date) return "Không xác định";
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
   }) =>
      person?.userId?.name ?? person?.name ?? person?._id ?? "Không xác định";

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

   const getStatusLabel = (status?: string): string => {
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

   const getHistoryLogNotes = (log?: HistoryLog): string | undefined => {
      if (!log) return undefined;
      if (isResolvedCaseLog(log)) {
         return log.adminNotes;
      }
      return log.notes;
   };

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
      <div className="space-y-4">
         <Card className="bg-gradient-to-b from-white to-slate-50 border-gray-100 shadow-sm">
            <CardHeader>
               <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-rose-400" />
                  <CardTitle className="text-slate-800">
                     Thông tin tranh chấp
                  </CardTitle>
               </div>
               <CardDescription className="text-slate-500">
                  Xem chi tiết yêu cầu hủy học và trạng thái của đôi bên.
               </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4 bg-white/60">
                     <p className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-sky-400" /> Học viên
                     </p>
                     <p className="font-semibold">
                        {getPersonName(commitment.student)}
                     </p>
                     <p className="text-sm text-muted-foreground">
                        {getPersonEmail(commitment.student)}
                     </p>
                  </div>
                  <div className="rounded-lg border p-4 bg-white/60">
                     <p className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" /> Gia sư
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
                     <h3 className="font-semibold flex items-center gap-2">
                        <span className="text-sky-500">Học viên</span>
                        <Badge
                           variant={getStatusVariant(
                              displayDecision?.student?.status
                           )}
                           className="capitalize bg-sky-100 text-sky-700"
                        >
                           {getStatusLabel(displayDecision?.student?.status)}
                        </Badge>
                     </h3>
                     <div className="mt-2 overflow-hidden">
                        <p className="text-sm text-muted-foreground break-words whitespace-normal">
                           Lý do:{" "}
                           {displayDecision?.student?.reason ||
                              "Không cung cấp"}
                        </p>
                        {(displayDecision?.student as any)?.linkUrl && (
                           <p className="text-sm mt-1">
                              Liên kết:{" "}
                              <a
                                 href={
                                    (displayDecision?.student as any).linkUrl
                                 }
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-sky-600 underline"
                              >
                                 {(displayDecision?.student as any).linkUrl}
                              </a>
                           </p>
                        )}
                     </div>
                  </div>
                  <div>
                     <h3 className="font-semibold flex items-center gap-2">
                        <span className="text-amber-500">Gia sư</span>
                        <Badge
                           variant={getStatusVariant(
                              displayDecision?.tutor?.status
                           )}
                           className="capitalize bg-rose-100 text-rose-700"
                        >
                           {getStatusLabel(displayDecision?.tutor?.status)}
                        </Badge>
                     </h3>
                     <div className="mt-2 overflow-hidden">
                        <p className="text-sm text-muted-foreground break-words whitespace-normal">
                           Lý do:{" "}
                           {displayDecision?.tutor?.reason || "Không cung cấp"}
                        </p>
                        {(displayDecision?.tutor as any)?.linkUrl && (
                           <p className="text-sm mt-1">
                              Liên kết:{" "}
                              <a
                                 href={(displayDecision?.tutor as any).linkUrl}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-rose-600 underline"
                              >
                                 {(displayDecision?.tutor as any).linkUrl}
                              </a>
                           </p>
                        )}
                     </div>
                  </div>
               </div>
               <div>
                  <h3 className="font-semibold flex items-center gap-2">
                     <Calendar className="w-4 h-4 text-slate-400" /> Chi tiết
                     yêu cầu
                  </h3>
                  <p className="text-sm">
                     Người gửi:{" "}
                     {displayDecision?.requestedBy === "student"
                        ? "Học viên"
                        : displayDecision?.requestedBy === "tutor"
                        ? "Gia sư"
                        : "Không rõ"}
                  </p>
                  <div className="overflow-hidden">
                     <p className="text-sm break-words whitespace-normal">
                        Lý do chung:{" "}
                        {displayDecision?.reason || "Không cung cấp"}
                     </p>
                  </div>
                  <p className="text-sm">
                     Thời gian gửi:{" "}
                     {displayDecision?.requestedAt
                        ? formatDate(displayDecision.requestedAt)
                        : "Không xác định"}
                  </p>
               </div>
            </CardContent>
         </Card>

         <Card className="bg-white border-gray-100 shadow-sm">
            <CardHeader>
               <CardTitle className="text-slate-800">
                  Thống kê vắng học
               </CardTitle>
               <CardDescription className="text-slate-500">
                  Tổng hợp số buổi vắng để hỗ trợ quyết định.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-4 md:grid-cols-5">
                  <div className="bg-slate-50 p-4 rounded-lg">
                     <p className="text-sm text-muted-foreground">
                        Tổng số buổi
                     </p>
                     <p className="text-2xl font-bold text-slate-800">
                        {detailedStats.totalSessions}
                     </p>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg">
                     <p className="text-sm text-emerald-600 font-semibold">
                        Hoàn thành
                     </p>
                     <p className="text-2xl font-bold text-emerald-700">
                        {detailedStats.completed.total}
                     </p>
                  </div>

                  <div className="bg-rose-50 p-4 rounded-lg">
                     <p className="text-sm text-rose-600 font-semibold">
                        Đã huỷ
                     </p>
                     <p className="text-lg font-semibold text-rose-600">
                        Tổng: {detailedStats.cancelled.total}
                     </p>
                     <p className="text-sm text-rose-500">
                        Học viên: {detailedStats.cancelled.studentCancelled}
                     </p>
                     <p className="text-sm text-rose-500">
                        Gia sư: {detailedStats.cancelled.tutorCancelled}
                     </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                     <p className="text-sm text-amber-600 font-semibold">
                        Không diễn ra
                     </p>
                     <p className="text-lg font-semibold text-amber-700">
                        Tổng: {detailedStats.notConducted.total}
                     </p>
                     <p className="text-sm text-amber-600">
                        Học viên:{" "}
                        {detailedStats.notConducted.studentNotConducted}
                     </p>
                     <p className="text-sm text-amber-600">
                        Gia sư: {detailedStats.notConducted.tutorNotConducted}
                     </p>
                  </div>

                  <div className="bg-sky-50 p-4 rounded-lg">
                     <p className="text-sm text-sky-600 font-semibold">
                        Tranh chấp
                     </p>
                     <p className="text-2xl font-bold text-sky-700">
                        {detailedStats.dispute.total}
                     </p>
                  </div>
               </div>

               {/* Combined single table for all sessions (sorted desc) */}
               {(() => {
                  const allSessions = [
                     ...detailedStats.cancelled.sessions.map((s) => ({
                        ...s,
                        _group: "cancelled",
                     })),
                     ...detailedStats.notConducted.sessions.map((s) => ({
                        ...s,
                        _group: "notConducted",
                     })),
                     ...detailedStats.completed.sessions.map((s) => ({
                        ...s,
                        _group: "completed",
                     })),
                     ...detailedStats.dispute.sessions.map((s) => ({
                        ...s,
                        _group: "dispute",
                     })),
                     ...detailedStats.rejected.sessions.map((s) => ({
                        ...s,
                        _group: "rejected",
                     })),
                  ].sort(
                     (a: any, b: any) =>
                        new Date(b.startTime).getTime() -
                        new Date(a.startTime).getTime()
                  );

                  if (allSessions.length === 0) {
                     return (
                        <div className="mt-6">
                           <h4 className="font-semibold mb-3">
                              Chi tiết từng buổi
                           </h4>
                           <p className="text-sm text-muted-foreground">
                              Không có buổi
                           </p>
                        </div>
                     );
                  }

                  const renderSideCell = (
                     session: any,
                     side: "student" | "tutor"
                  ) => {
                     const reason = session.reason ?? "Không có";
                     if (session._group === "cancelled") {
                        if (session.cancelledByRole === side)
                           return (
                              <span className="text-sm text-rose-700">
                                 {reason}
                              </span>
                           );
                     }
                     if (session._group === "notConducted") {
                        if (session.notConductedByRole === side)
                           return (
                              <span className="text-sm text-amber-700">
                                 {reason}
                              </span>
                           );
                     }
                     if (session._group === "completed")
                        return (
                           <Badge className="bg-emerald-50 text-emerald-700">
                              Hoàn thành
                           </Badge>
                        );
                     return (
                        <span className="text-muted-foreground text-sm">
                           Chưa xác nhận
                        </span>
                     );
                  };

                  const statusLabelOf = (session: any) => {
                     const s = (session.status || "").toUpperCase();
                     switch (s) {
                        case "CANCELLED":
                           return "Đã huỷ";
                        case "NOT_CONDUCTED":
                           return "Không diễn ra";
                        case "COMPLETED":
                           return "Hoàn thành";
                        case "DISPUTED":
                        case "DISPUTE":
                           return "Tranh chấp";
                        case "REJECTED":
                           return "Từ chối";
                        default:
                           return session._group
                              ? session._group
                              : session.status ?? "Không xác định";
                     }
                  };

                  return (
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
                              {allSessions.map((session: any) => {
                                 const reason = session.reason ?? "Không có";
                                 return (
                                    <TableRow key={session._id}>
                                       <TableCell className="text-sm">
                                          {formatDate(session.startTime)}
                                       </TableCell>
                                       <TableCell>
                                          <Badge
                                             variant="outline"
                                             className="bg-white/50"
                                          >
                                             {statusLabelOf(session)}
                                             {session.isTrial ? " (Thử)" : ""}
                                          </Badge>
                                       </TableCell>
                                       <TableCell>
                                          {renderSideCell(session, "student")}
                                       </TableCell>
                                       <TableCell>
                                          {renderSideCell(session, "tutor")}
                                       </TableCell>
                                       <TableCell className="text-sm text-muted-foreground">
                                          {reason}
                                       </TableCell>
                                    </TableRow>
                                 );
                              })}
                           </TableBody>
                        </Table>
                     </div>
                  );
               })()}
            </CardContent>
         </Card>

         {isHistoryView && historyLog && (
            <Card className="bg-white border-gray-100 shadow-sm">
               <CardHeader>
                  <CardTitle className="text-slate-800">
                     Kết quả đã xử lý
                  </CardTitle>
                  <CardDescription className="text-slate-500">
                     Case này đã được admin xử lý trước đó. Bạn chỉ có thể xem
                     lại thông tin.
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-2">
                  <p className="text-sm">
                     Hành động:{" "}
                     <Badge
                        variant="outline"
                        className="capitalize bg-white/50 text-slate-700"
                     >
                        {getActionLabel(historyLog?.action)}
                     </Badge>
                  </p>
                  <p className="text-sm">
                     Thời gian xử lý: {formatDate(historyLog?.handledAt || "")}
                  </p>
                  <p className="text-sm">
                     Admin ghi chú:{" "}
                     {getHistoryLogNotes(historyLog) || "Không có"}
                  </p>
                  {historyLog?.cancellationDecisionSnapshot && (
                     <div className="mt-4 text-sm">
                        <p className="font-semibold">
                           Snapshot tại thời điểm xử lý
                        </p>
                        <p>
                           Học viên:{" "}
                           {getStatusLabel(
                              historyLog.cancellationDecisionSnapshot.student
                                 .status
                           )}
                        </p>
                        {(
                           historyLog.cancellationDecisionSnapshot
                              .student as any
                        )?.linkUrl && (
                           <p>
                              Liên kết học viên:{" "}
                              <a
                                 href={
                                    (
                                       historyLog.cancellationDecisionSnapshot
                                          .student as any
                                    ).linkUrl
                                 }
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-sky-600 underline"
                              >
                                 {
                                    (
                                       historyLog.cancellationDecisionSnapshot
                                          .student as any
                                    ).linkUrl
                                 }
                              </a>
                           </p>
                        )}
                        <p>
                           Gia sư:{" "}
                           {getStatusLabel(
                              historyLog.cancellationDecisionSnapshot.tutor
                                 .status
                           )}
                        </p>
                        {(historyLog.cancellationDecisionSnapshot.tutor as any)
                           ?.linkUrl && (
                           <p>
                              Liên kết gia sư:{" "}
                              <a
                                 href={
                                    (
                                       historyLog.cancellationDecisionSnapshot
                                          .tutor as any
                                    ).linkUrl
                                 }
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-rose-600 underline"
                              >
                                 {
                                    (
                                       historyLog.cancellationDecisionSnapshot
                                          .tutor as any
                                    ).linkUrl
                                 }
                              </a>
                           </p>
                        )}
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
            <Card className="bg-white border-gray-100 shadow-sm">
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
                     {isRejecting ? (
                        <>
                           <XCircle className="w-4 h-4 mr-2 inline" /> Đang từ
                           chối...
                        </>
                     ) : (
                        <>
                           <XCircle className="w-4 h-4 mr-2 inline" /> Từ chối
                           yêu cầu hủy
                        </>
                     )}
                  </Button>
                  <Button
                     onClick={handleApprove}
                     disabled={!adminNotes || isApproving || isRejecting}
                  >
                     {isApproving ? (
                        <>
                           <CheckCircle className="w-4 h-4 mr-2 inline" /> Đang
                           duyệt...
                        </>
                     ) : (
                        <>
                           <CheckCircle className="w-4 h-4 mr-2 inline" /> Duyệt
                           yêu cầu hủy
                        </>
                     )}
                  </Button>
               </CardFooter>
            </Card>
         )}
      </div>
   );
};

export default AdminLearningDetailPage;
