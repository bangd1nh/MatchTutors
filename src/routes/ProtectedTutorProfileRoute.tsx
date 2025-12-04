import { useTutorProfile } from "@/hooks/useTutorProfile";
import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedTutorProfileRouteProps {
   children: React.ReactNode;
   requireApproval?: boolean;
}

const ProtectedTutorProfileRoute = ({
   children,
   requireApproval = false,
}: ProtectedTutorProfileRouteProps) => {
   const { tutorProfile, isLoading } = useTutorProfile();
   const location = useLocation();

   if (isLoading) {
      return (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
         </div>
      );
   }

   // Nếu tutor chưa có profile, redirect về trang create profile
   if (!tutorProfile) {
      return (
         <Navigate
            to="/tutor/create-profile"
            state={{ from: location }}
            replace
         />
      );
   }

   // Nếu cần approval và tutor chưa được duyệt, redirect về dashboard
   if (requireApproval && !tutorProfile.isApproved) {
      return (
         <Navigate to="/tutor/dashboard" state={{ from: location }} replace />
      );
   }

   return <>{children}</>;
};

export default ProtectedTutorProfileRoute;
