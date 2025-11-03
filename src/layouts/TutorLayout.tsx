import { Outlet } from "react-router-dom";
import TutorSidebar from "@/components/tutorSidebar/TutorSidebar";
import Header from "@/components/common/Header";

const TutorLayout = () => {
   return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
         <header className="fixed top-0 left-0 w-full z-40">
            <Header />
         </header>

         <div className="fixed top-16 left-0 bottom-0 w-64">
            <TutorSidebar />
         </div>

         <div className="flex-1 ml-64 pt-16">
            <main className="p-6">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default TutorLayout;
