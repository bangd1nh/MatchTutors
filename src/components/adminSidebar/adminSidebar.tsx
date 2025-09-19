import React from "react";

import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminSidebarItems from "./AdminSidebarItem";

const AdminSidebar: React.FC = () => {
   const { user } = useUser();

   const name = user?.name ?? "Admin";
   const email = user?.email ?? "student@example.com";
   const avatarUrl = (user as any)?.avatarUrl; // Giả sử user object có avatarUrl

   return (
      <aside className="h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm">
         {/* Header */}
         <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
               <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback>
                     {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
               <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                     {name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                     {email}
                  </p>
               </div>
            </div>
         </div>

         {/* Navigation */}
         <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            <AdminSidebarItems />
         </nav>

         {/* Footer */}
         <div className="p-2 flex-shrink-0">
            {/* Có thể thêm các mục footer ở đây nếu cần */}
         </div>
      </aside>
   );
};

export default AdminSidebar;
