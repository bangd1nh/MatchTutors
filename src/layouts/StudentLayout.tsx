import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentSidebar from "@/components/studentSidebar/StudentSidebar";
import Header from "@/components/common/Header";

const StudentLayout = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth >= 768) {
            setIsSidebarOpen(false);
         }
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
         <header className="fixed top-0 left-0 w-full z-40">
            <Header onMenuClick={() => setIsSidebarOpen((v) => !v)} />
         </header>

         <div
            className={`fixed top-16 left-0 bottom-0 z-50 transition-transform duration-300 md:translate-x-0 md:w-64 md:block ${
               isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
            }`}
         >
            <StudentSidebar />
         </div>

         {isSidebarOpen && (
            <div
               className="fixed inset-0 z-40 bg-black/40 md:hidden"
               onClick={() => setIsSidebarOpen(false)}
            />
         )}

         <div className="flex-1 pt-16 md:ml-64">
            <main className="p-6">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default StudentLayout;
