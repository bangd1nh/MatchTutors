import AdminSidebar from "@/components/adminSidebar/adminSidebar";
import { Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
   const location = useLocation();
   const showSidebar = location.pathname !== "/";

   return (
      <div className="min-h-screen flex h-screen overflow-hidden">
         {showSidebar && <AdminSidebar />}
         <div className="flex-grow flex flex-col">
            <main className="flex-grow bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default AdminLayout;
