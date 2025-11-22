import React from "react";
import TutorSidebarItems from "./TutorSidebarItem";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TutorSidebar: React.FC = () => {
   const { user } = useUser();

   const name = user?.name ?? "Tutor";
   const email = user?.email ?? "student@example.com";
   const avatarUrl = (user as any)?.avatarUrl; // Giả sử user object có avatarUrl

   return (
      <aside className="w-64 overflow-auto bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-sm h-screen">
         <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
               <Avatar className="h-10 w-10">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback>
                     {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
               <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 break-words">
                     {name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                     {email}
                  </p>
               </div>
            </div>
         </div>

         <nav className="flex-1 p-2 space-y-1">
            <TutorSidebarItems />
         </nav>

         <div className="p-2">
            {/* Có thể thêm các mục footer ở đây nếu cần */}
         </div>
      </aside>
   );
};

export default TutorSidebar;
