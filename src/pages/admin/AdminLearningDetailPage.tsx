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
