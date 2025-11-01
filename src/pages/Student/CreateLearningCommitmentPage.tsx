import { CreateLearningCommitmentForm } from "@/components/learning-commitment/CreateLearningCommitmentForm";

import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Role } from "@/enums/role.enum";

export const CreateLearningCommitmentPage = () => {
   const { user } = useUser();

   if (!user || user.role !== Role.TUTOR) {
      return <Navigate to="/auth/login" replace />;
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
               Create Learning Commitment
            </h1>
            <p className="text-gray-600 mt-2">
               Create a new learning commitment with a student
            </p>
         </div>

         <CreateLearningCommitmentForm
            onSuccess={() => {
               // TODO: Navigate to commitments list or show success message
            }}
         />
      </div>
   );
};
