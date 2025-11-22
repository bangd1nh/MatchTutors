import { useParams } from "react-router-dom";
import { useAdminLearning } from "@/hooks/useAdminLearning";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
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

const AdminLearningDetailPage = () => {
   const { commitmentId } = useParams<{ commitmentId: string }>();
   const {
      commitmentDetail: commitment,
      isLoadingDetail,
      approve,
      reject,
      isApproving,
      isRejecting,
   } = useAdminLearning(commitmentId);
   const [adminNotes, setAdminNotes] = useState("");

   if (isLoadingDetail) return <div>Loading details...</div>;
   if (!commitment) return <div>Commitment not found.</div>;

   const decision = commitment.cancellationDecision;
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
      return new Date(date).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   return (
      <div className="space-y-4">
         <Card>
            <CardHeader>
               <CardTitle>Dispute Details</CardTitle>
               <CardDescription>
                  Review the cancellation request and make a decision.
               </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
               <div>
                  <h3 className="font-semibold">Student's Decision</h3>
                  <Badge
                     variant={
                        decision?.student.status === "ACCEPTED"
                           ? "default"
                           : "destructive"
                     }
                  >
                     {decision?.student.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                     Reason: {decision?.student.reason || "N/A"}
                  </p>
               </div>
               <div>
                  <h3 className="font-semibold">Tutor's Decision</h3>
                  <Badge
                     variant={
                        decision?.tutor.status === "ACCEPTED"
                           ? "default"
                           : "destructive"
                     }
                  >
                     {decision?.tutor.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                     Reason: {decision?.tutor.reason || "N/A"}
                  </p>
               </div>
               <div className="md:col-span-2">
                  <h3 className="font-semibold">Request Details</h3>
                  <p className="text-sm">
                     Requested by: {decision?.requestedBy}
                  </p>
                  <p className="text-sm">Reason: {decision?.reason || "N/A"}</p>
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle>Absence Statistics</CardTitle>
               <CardDescription>
                  Summary of session absences for this learning commitment.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-slate-50 p-4 rounded-lg">
                     <p className="text-sm text-muted-foreground">
                        Total Sessions
                     </p>
                     <p className="text-2xl font-bold">
                        {absenceStats.totalSessions ?? 0}
                     </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                     <p className="text-sm text-red-600 font-semibold">
                        Student Absent
                     </p>
                     <p className="text-2xl font-bold text-red-600">
                        {absenceStats.studentAbsent ?? 0}
                     </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                     <p className="text-sm text-orange-600 font-semibold">
                        Tutor Absent
                     </p>
                     <p className="text-2xl font-bold text-orange-600">
                        {absenceStats.tutorAbsent ?? 0}
                     </p>
                  </div>
               </div>

               {absenceStats.sessionDetails &&
                  absenceStats.sessionDetails.length > 0 && (
                     <div className="mt-6">
                        <h4 className="font-semibold mb-3">Session Details</h4>
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Date & Time</TableHead>
                                 <TableHead>Status</TableHead>
                                 <TableHead>Student Absent</TableHead>
                                 <TableHead>Tutor Absent</TableHead>
                                 <TableHead>Reason</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {absenceStats.sessionDetails.map(
                                 (session: any) => (
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
                                          {session.studentAbsent ? (
                                             <Badge variant="destructive">
                                                Absent
                                             </Badge>
                                          ) : (
                                             <Badge variant="outline">
                                                Present
                                             </Badge>
                                          )}
                                       </TableCell>
                                       <TableCell>
                                          {session.tutorAbsent ? (
                                             <Badge variant="destructive">
                                                Absent
                                             </Badge>
                                          ) : (
                                             <Badge variant="outline">
                                                Present
                                             </Badge>
                                          )}
                                       </TableCell>
                                       <TableCell className="text-sm text-muted-foreground">
                                          {session.absenceReason || "N/A"}
                                       </TableCell>
                                    </TableRow>
                                 )
                              )}
                           </TableBody>
                        </Table>
                     </div>
                  )}
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle>Admin Action</CardTitle>
            </CardHeader>
            <CardContent>
               <Textarea
                  placeholder="Provide notes for your decision..."
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
                  {isRejecting ? "Rejecting..." : "Reject Cancellation"}
               </Button>
               <Button
                  onClick={handleApprove}
                  disabled={!adminNotes || isApproving || isRejecting}
               >
                  {isApproving ? "Approving..." : "Approve Cancellation"}
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
};

export default AdminLearningDetailPage;
