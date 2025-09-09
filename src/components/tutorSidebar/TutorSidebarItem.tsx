import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export type SidebarItem = {
   to: string;
   label: string;
   exact?: boolean;
   icon?: React.ReactNode;
};

// Thêm item mới chỉ cần thêm object { to, label, icon? }
export const tutorSidebarConfig: SidebarItem[] = [
   { to: "/tutor/dashboard", label: "Dashboard" },
   { to: "/tutor/jobs", label: "My Profile" },
   { to: "/tutor/profile", label: "My profile" },

   // ví dụ: { to: "/tutor/new", label: "New Feature", icon: <YourIcon /> }
];

const TutorSidebarItems: React.FC<{
   onLinkClick?: () => void;
   collapsed?: boolean;
}> = ({ onLinkClick, collapsed = false } = {}) => {
   const location = useLocation();
   const { logout } = useAuth();

   const isActive = (path: string, exact = false) =>
      exact ? location.pathname === path : location.pathname.startsWith(path);
   const homeActive = isActive("/", true);

   const handleLogout = () => {
      try {
         logout();
      } finally {
         onLinkClick?.();
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="space-y-1">
            <Link
               to="/"
               onClick={() => onLinkClick?.()}
               className={`flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${
                     homeActive
                        ? "bg-green-500/20 text-gray-900 dark:text-white border-l-4 border-green-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
               `}
               title="Trang chủ"
            >
               <Home className="h-4 w-4 flex-none" />
               <span className={`${collapsed ? "sr-only" : "inline-block"}`}>
                  Trang chủ
               </span>
            </Link>
            {tutorSidebarConfig.map((item) => {
               const label = item.label || item.to;
               const active = isActive(item.to, item.exact);
               return (
                  <Link
                     key={item.to}
                     to={item.to}
                     onClick={() => onLinkClick?.()}
                     className={`flex items-center gap-2 p-2 rounded-md text-sm font-medium transition-colors duration-200
                        ${
                           active
                              ? "bg-green-500/20 text-gray-900 dark:text-white border-l-4 border-green-500"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }
                     `}
                     title={label}
                  >
                     {item.icon && (
                        <span className="flex-none">{item.icon}</span>
                     )}
                     <span
                        className={`${collapsed ? "sr-only" : "inline-block"}`}
                     >
                        {label}
                     </span>
                  </Link>
               );
            })}
            {/* Trở về trang chủ */}
         </div>

         {/* Footer area with logout button kept at bottom */}
         <div className="mt-auto pt-3 border-t border-transparent dark:border-slate-800">
            <Button
               variant="ghost"
               className="w-full justify-start text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-800"
               onClick={handleLogout}
               title="Đăng xuất"
            >
               <LogOut className="h-4 w-4 mr-2" />
               <span className={`${collapsed ? "sr-only" : "inline-block"}`}>
                  Đăng xuất
               </span>
            </Button>
         </div>
      </div>
   );
};

export default TutorSidebarItems;
