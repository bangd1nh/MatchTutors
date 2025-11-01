import { useLearningCommitments } from "@/hooks/useLearningCommitment";
import { LearningCommitmentCard } from "@/components/learning-commitment/LearningCommitmentCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";

export const LearningCommitmentsPage = () => {
   const { user } = useUser();
   // Normalize role to string to avoid TypeScript enum/union mismatch when comparing with literals
   const isTutor = String(user?.role).toLowerCase() === "tutor";
   const [page] = useState(1);
   const {
      data: commitments,
      isLoading,
      error,
   } = useLearningCommitments(page, 10);

   if (isLoading) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading...</div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="text-center text-red-600">
               Error loading learning commitments
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="flex justify-between items-center mb-8">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">
                  Learning Commitments
               </h1>
               <p className="text-gray-600 mt-2">
                  {isTutor
                     ? "Manage your learning commitments with students"
                     : "View and pay for your learning commitments"}
               </p>
            </div>

            {isTutor && (
               <Link to="/tutor/commitments/create">
                  <Button>
                     <Plus className="w-4 h-4 mr-2" />
                     Create Commitment
                  </Button>
               </Link>
            )}
         </div>

         {commitments && commitments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {commitments.map((commitment) => (
                  <LearningCommitmentCard
                     key={commitment._id}
                     commitment={commitment}
                  />
               ))}
            </div>
         ) : (
            <div className="text-center py-12">
               <p className="text-gray-500 text-lg">
                  No learning commitments found
               </p>
               {isTutor && (
                  <Link
                     to="/tutor/commitments/create"
                     className="mt-4 inline-block"
                  >
                     <Button>Create Your First Commitment</Button>
                  </Link>
               )}
            </div>
         )}
      </div>
   );
};
