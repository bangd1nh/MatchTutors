import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/common/Header";
import StudentSidebar from "@/components/studentSidebar/StudentSidebar";

const JobSeekerLayout = () => {
   const location = useLocation();
   const showSidebar = location.pathname !== "/";

   return (
      <div className="min-h-screen flex h-screen overflow-hidden">
         {showSidebar && <StudentSidebar />}
         <div className="flex-grow flex flex-col">
            <main className="flex-grow bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default JobSeekerLayout;
