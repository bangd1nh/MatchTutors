import { useUser } from "@/hooks/useUser";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Role } from "@/types/user";

interface ProtectedRouteProps {
   children: React.ReactNode;
   allowedRoles?: (Role | string)[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
   const { isAuthenticated, isLoading, user } = useUser();
   const location = useLocation();

   if (isLoading) {
      return (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
         </div>
      );
   }

   if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   // Nếu có allowedRoles, kiểm tra role của user
   if (allowedRoles && allowedRoles.length > 0) {
      const userRole = (user as any)?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
         return <Navigate to="/unauthorized" replace />;
      }
   }

   return <>{children}</>;
};

export default ProtectedRoute;
