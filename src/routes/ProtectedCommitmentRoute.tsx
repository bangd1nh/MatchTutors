import { ReactNode } from "react";
import { useTutorProfile } from "@/hooks/useTutorProfile";
import { Navigate } from "react-router-dom";

interface ProtectedCommitmentRouteProps {
   children: ReactNode;
}

const ProtectedCommitmentRoute = ({
   children,
}: ProtectedCommitmentRouteProps) => {
   const { tutorProfile, isLoading } = useTutorProfile();

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
               <p className="text-slate-600 font-medium">Đang tải...</p>
            </div>
         </div>
      );
   }

   // Nếu tutor không được approved, redirect về trang learning commitments
   if (!tutorProfile?.isApproved) {
      return <Navigate to="/tutor/learning-commitments" replace />;
   }

   return <>{children}</>;
};

export default ProtectedCommitmentRoute;
