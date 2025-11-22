import { CreateLearningCommitmentForm } from "@/components/learning-commitment/CreateLearningCommitmentForm";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { Role } from "@/enums/role.enum";

export const CreateLearningCommitmentPage = () => {
   const { user } = useUser();
   const navigate = useNavigate();

   if (!user || user.role !== Role.TUTOR) {
      return <Navigate to="/auth/login" replace />;
   }

   return (
      <div className="px-4">
         <CreateLearningCommitmentForm
            onSuccess={() => {
               navigate("/tutor/learning-commitments");
            }}
         />
      </div>
   );
};
