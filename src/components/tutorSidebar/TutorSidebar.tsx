import React from "react";
import TutorSidebarItems from "./TutorSidebarItem";
import { useUser } from "@/hooks/useUser";

const TutorSidebar: React.FC = () => {
   const { user } = useUser();

   const email = user?.email ?? "—";
   const role = user?.role ?? "—";

   return (
      <aside className="w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex flex-col shadow-sm">
         <div className="mb-6">
            <h3 className="text-sm font-medium text-sky-700">Xin chào</h3>
            <p className="mt-1 text-sm text-slate-900 dark:text-slate-100 font-semibold break-words">
               {email}
            </p>
            <div className="mt-3">
               <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                  {role}
               </span>
            </div>
         </div>

         <nav className="flex-1 space-y-1">
            <TutorSidebarItems />
         </nav>
      </aside>
   );
};

export default TutorSidebar;
