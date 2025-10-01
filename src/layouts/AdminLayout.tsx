import AdminSidebar from "@/components/adminSidebar/adminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
   return (
      <div className="h-screen flex bg-gray-50 dark:bg-gray-950 overflow-hidden">
         {/* Sidebar */}
         <div className="w-64 flex-shrink-0">
            <AdminSidebar />
         </div>

         {/* Main Content */}
         <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 overflow-auto p-4 md:p-6">
               <div className="max-w-full">
                  <Outlet />
               </div>
            </main>
         </div>
      </div>
   );
};

export default AdminLayout;
