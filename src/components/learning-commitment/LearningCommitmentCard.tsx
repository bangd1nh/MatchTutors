import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LearningCommitment } from "@/types/learningCommitment";
import { useInitiatePayment } from "@/hooks/useLearningCommitment";
import { useUser } from "@/hooks/useUser";
import {
   useRequestCancellation,
   useRejectCancellation,
} from "@/hooks/useLearningCommitment";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"; // Giả định có Dialog component
import { Textarea } from "@/components/ui/textarea"; // Giả định có Textarea
import { useState } from "react";

interface Props {
   commitment: LearningCommitment;
}

export const LearningCommitmentCard = ({ commitment }: Props) => {
   const { user } = useUser();
   const { mutate: initiatePayment, isPending } = useInitiatePayment();
   const requestCancellation = useRequestCancellation();
   const rejectCancellation = useRejectCancellation();

   const [reason, setReason] = useState("");
   const [dialogOpen, setDialogOpen] = useState(false);

   const getStatusColor = (status: string) => {
      switch (status) {
         case "pending_agreement":
            return "bg-yellow-100 text-yellow-800";
         case "active":
            return "bg-green-100 text-green-800";
         case "completed":
            return "bg-blue-100 text-blue-800";
         case "cancelled":
            return "bg-red-100 text-red-800";
         default:
            return "bg-gray-100 text-gray-800";
      }
   };

   // allow match by either student.userId (auth user id) or profile _id
   const studentObj: any = commitment.student;
   const isStudentOwner = Boolean(
      studentObj &&
         (String(studentObj.userId?._id || studentObj.userId) ===
            String(user?.id || user?._id) ||
            String(studentObj._id) === String(user?.id || user?._id))
   );

   const isStudentRole = String(user?.role || "").toLowerCase() === "student";
   const isTutorRole = String(user?.role).toLowerCase() === "tutor";

   const canPay =
      isStudentRole &&
      isStudentOwner &&
      commitment.status === "pending_agreement" &&
      (commitment.studentPaidAmount ?? 0) < (commitment.totalAmount ?? 0);

   const canRequestCancel = commitment.status === "active";
   const canRespondCancel =
      commitment.status === "cancellation_pending" &&
      ((isStudentRole &&
         commitment.cancellationDecision?.student.status === "PENDING") ||
         (isTutorRole &&
            commitment.cancellationDecision?.tutor.status === "PENDING"));

   const subject =
      typeof commitment.teachingRequest === "object"
         ? commitment.teachingRequest.subject || "Unknown Subject"
         : String(commitment.teachingRequest || "Unknown Subject");

   const handleRequest = () => {
      if (!reason.trim()) return;
      requestCancellation.mutate({ id: commitment._id, reason });
      setDialogOpen(false);
      setReason("");
   };

   const handleReject = () => {
      if (!reason.trim()) return;
      rejectCancellation.mutate({ id: commitment._id, reason });
      setDialogOpen(false);
      setReason("");
   };

   return (
      <Card className="w-full">
         <CardHeader>
            <div className="flex justify-between items-start">
               <CardTitle className="text-lg">
                  Learning Commitment - {subject}
               </CardTitle>
               <Badge className={getStatusColor(commitment.status)}>
                  {String(commitment.status).replace("_", " ").toUpperCase()}
               </Badge>
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-sm font-medium text-gray-600">Tutor</p>
                  <p className="text-sm">{commitment.tutor.userId.name}</p>
                  <p className="text-xs text-gray-400 font-mono">
                     {commitment.tutor.userId.email}
                  </p>
               </div>
               <div>
                  <p className="text-sm font-medium text-gray-600">Student</p>
                  <p className="text-sm">{commitment.student.userId.name}</p>
                  <p className="text-xs text-gray-400 font-mono">
                     {commitment.student.userId.email}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-sm font-medium text-gray-600">
                     Total Sessions
                  </p>
                  <p className="text-sm">{commitment.totalSessions ?? "-"}</p>
               </div>
               <div>
                  <p className="text-sm font-medium text-gray-600">
                     Completed Sessions
                  </p>
                  <p className="text-sm">{commitment.completedSessions ?? 0}</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-sm font-medium text-gray-600">
                     Start Date
                  </p>
                  <p className="text-sm">
                     {commitment.startDate
                        ? format(new Date(commitment.startDate), "MMM dd, yyyy")
                        : "-"}
                  </p>
               </div>
               <div>
                  <p className="text-sm font-medium text-gray-600">End Date</p>
                  <p className="text-sm">
                     {commitment.endDate
                        ? format(new Date(commitment.endDate), "MMM dd, yyyy")
                        : "-"}
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-sm font-medium text-gray-600">
                     Total Amount
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                     {(commitment.totalAmount ?? 0).toLocaleString("vi-VN")} VND
                  </p>
               </div>
               <div>
                  <p className="text-sm font-medium text-gray-600">
                     Paid Amount
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                     {(commitment.studentPaidAmount ?? 0).toLocaleString(
                        "vi-VN"
                     )}{" "}
                     VND
                  </p>
               </div>
            </div>

            {canPay && (
               <div className="pt-4 border-t">
                  <Button
                     onClick={() => initiatePayment(String(commitment._id))}
                     disabled={isPending}
                     className="w-full"
                  >
                     {isPending ? "Processing..." : "Pay Now"}
                  </Button>
               </div>
            )}

            {canRequestCancel && (
               <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                     <Button variant="destructive">Request Cancellation</Button>
                  </DialogTrigger>
                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>Request Cancellation</DialogTitle>
                     </DialogHeader>
                     <Textarea
                        placeholder="Enter reason for cancellation"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                     />
                     <Button onClick={handleRequest} disabled={!reason.trim()}>
                        Submit Request
                     </Button>
                  </DialogContent>
               </Dialog>
            )}

            {canRespondCancel && (
               <div className="flex gap-2">
                  <Button
                     onClick={() =>
                        requestCancellation.mutate({
                           id: commitment._id,
                           reason: "Accepted",
                        })
                     }
                  >
                     Accept Cancellation
                  </Button>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                     <DialogTrigger asChild>
                        <Button variant="outline">Reject Cancellation</Button>
                     </DialogTrigger>
                     <DialogContent>
                        <DialogHeader>
                           <DialogTitle>Reject Cancellation</DialogTitle>
                        </DialogHeader>
                        <Textarea
                           placeholder="Enter reason for rejection"
                           value={reason}
                           onChange={(e) => setReason(e.target.value)}
                        />
                        <Button
                           onClick={handleReject}
                           disabled={!reason.trim()}
                        >
                           Submit Rejection
                        </Button>
                     </DialogContent>
                  </Dialog>
               </div>
            )}
         </CardContent>
      </Card>
   );
};
