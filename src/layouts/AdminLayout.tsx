import AdminSidebar from "@/components/adminSidebar/adminSidebar";
import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
   return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
         <header className="fixed top-0 left-0 w-full z-30">
            <Header />
         </header>

         <div className="fixed top-16 left-0 bottom-0 w-64">
            <AdminSidebar />
         </div>

         <div className="flex-1 ml-64 pt-16">
            <main className="p-6">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default AdminLayout;
