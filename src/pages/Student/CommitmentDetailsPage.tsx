import { useParams, Link } from "react-router-dom";
import { useLearningCommitment } from "@/hooks/useLearningCommitment";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export const CommitmentDetailsPage = () => {
   const { id } = useParams<{ id: string }>();
   const {
      data: commitment,
      isLoading,
      error,
   } = useLearningCommitment(id ?? "");

   if (isLoading)
      return <div className="container mx-auto p-8">Loading...</div>;
   if (error || !commitment)
      return (
         <div className="container mx-auto p-8 text-red-600">
            Cannot load commitment
         </div>
      );

   return (
      <div className="container mx-auto p-8">
         <h1 className="text-2xl font-bold mb-4">Commitment Details</h1>

         <div className="space-y-4">
            <div>
               <strong>Subject:</strong> {commitment.teachingRequest.subject}
            </div>
            <div>
               <strong>Tutor:</strong> {commitment.tutor.userId.name}
            </div>
            <div>
               <strong>Student:</strong> {commitment.student.userId.name}
            </div>
            <div>
               <strong>Start:</strong>{" "}
               {format(new Date(commitment.startDate), "MMM dd, yyyy")}
            </div>
            <div>
               <strong>End:</strong>{" "}
               {format(new Date(commitment.endDate), "MMM dd, yyyy")}
            </div>
            <div>
               <strong>Total Amount:</strong>{" "}
               {commitment.totalAmount.toLocaleString("vi-VN")} VND
            </div>
            <div>
               <strong>Status:</strong> {commitment.status}
            </div>
         </div>

         <div className="mt-6">
            <Link to="/commitments">
               <Button>Back to list</Button>
            </Link>
         </div>
      </div>
   );
};
