import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Home, User, LayoutDashboard, BookOpen, GraduationCap, FileText, Key } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export type SidebarItem = {
   to: string;
   label: string;
   exact?: boolean;
   icon?: React.ReactNode;
};

export const adminSidebarConfig: SidebarItem[] = [
   {
      to: "/admin/dashboard",
      label: "Bảng điều khiển",
      icon: <LayoutDashboard className="h-4 w-4" />,
   },
   {
      to: "/admin/profile",
      label: "Hồ sơ của tôi",
      icon: <User className="h-4 w-4" />,
   },
   {
      to: "/admin/tutor-profile",
      label: "Hồ sơ gia sư",
      icon: <FileText className="h-4 w-4" />,
   },
   {
      to: "/admin/tutors",
      label: "Tài khoản gia sư",
      icon: <BookOpen className="h-4 w-4" />,
   },
   {
      to: "/admin/students",
      label: "Tài khoản học sinh",
      icon: <GraduationCap className="h-4 w-4" />,
   },
   {
      to: "/profile/change-password",
      label: "Đổi mật khẩu",
      icon: <Key className="h-4 w-4" />,
   },
];

const AdminSidebarItems: React.FC<{
   onLinkClick?: () => void;
   collapsed?: boolean;
}> = (props = {}) => {
   const { onLinkClick, collapsed = false } = props;
   const location = useLocation();
   const navigate = useNavigate();
   const { logout } = useAuth();

   const isActive = (path: string, exact = false) =>
      exact ? location.pathname === path : location.pathname.startsWith(path);

   const handleLogout = () => {
      logout();
      navigate("/login");
      onLinkClick?.();
   };

   return (
      <div className="flex flex-col h-full">
         <div className="space-y-1 flex-grow">
            <Link
               to="/"
               onClick={() => onLinkClick?.()}
               className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
               title="Trang chủ"
            >
               <Home className="h-4 w-4 flex-none" />
               <span className={`${collapsed ? "sr-only" : "inline-block"}`}>
                  Trang chủ
               </span>
            </Link>

            {adminSidebarConfig.map((item) => {
               const active = isActive(item.to, item.exact);
               return (
                  <Link
                     key={item.to}
                     to={item.to}
                     onClick={() => onLinkClick?.()}
                     className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors duration-200
                        ${
                           active
                              ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                     `}
                     title={item.label}
                  >
                     {item.icon && (
                        <span className="flex-none">{item.icon}</span>
                     )}
                     <span
                        className={`${collapsed ? "sr-only" : "inline-block"}`}
                     >
                        {item.label}
                     </span>
                  </Link>
               );
            })}
         </div>

         <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-800">
            <Button
               variant="ghost"
               className="w-full justify-start text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
               onClick={handleLogout}
               title="Đăng xuất"
            >
               <LogOut className="h-4 w-4 mr-3" />
               <span className={`${collapsed ? "sr-only" : "inline-block"}`}>
                  Đăng xuất
               </span>
            </Button>
         </div>
      </div>
   );
};

export default AdminSidebarItems;
