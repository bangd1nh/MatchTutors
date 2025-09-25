import AdminSidebar from "@/components/adminSidebar/adminSidebar";
import Header from "@/components/common/Header";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
   return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
         <Header />
         <div className="fixed top-0 left-0 h-full">
            <AdminSidebar />
         </div>
         <div className="flex-grow flex flex-col ml-64">
            {/* Thêm ml-64 để tạo khoảng trống cho sidebar */}
            <main className="flex-grow p-6">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default AdminLayout;
