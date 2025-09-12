import { fetchStudentProfile } from "@/api/studentProfile";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface IsCreatedProfileRouteProps {
   children: React.ReactNode;
}

const IsCreatedProfileRoute = ({ children }: IsCreatedProfileRouteProps) => {
   const [isLoading, setIsLoading] = useState(true);
   const [isError, setIsError] = useState(false);
   const location = useLocation();

   useEffect(() => {
      fetchStudentProfile()
         .then(() => {
            setIsLoading(false);
         })
         .catch((error) => {
            if (error?.response?.status === 404) {
               setIsError(true);
            }
            setIsLoading(false);
         });
   }, []);

   if (isLoading) {
      return (
         <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-600" />
         </div>
      );
   }
   if (isError) {
      return (
         <Navigate
            to="/student/create-student-profile"
            state={{ from: location }}
            replace
         />
      );
   }
   return <>{children}</>;
};

export default IsCreatedProfileRoute;
