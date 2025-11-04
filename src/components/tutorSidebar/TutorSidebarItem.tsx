import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
   LogOut,
   Home,
   User,
   LayoutDashboard,
   Calendar,
   BookHeart,
   BookPlus,
   BookCopy,
   XCircle,
   FileUp,
   FolderKanban,
   Wallet,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export type SidebarItem = {
   to: string;
   label: string;
   exact?: boolean;
   icon?: React.ReactNode;
};

export const tutorSidebarConfig: SidebarItem[] = [
   {
      to: "/tutor/dashboard",
      label: "Bảng điều khiển",
      icon: <LayoutDashboard className="h-4 w-4" />,
   },
   {
      to: "/tutor/profile-page",
      label: "Hồ sơ của tôi",
      icon: <User className="h-4 w-4" />,
   },
   {
      to: "/tutor/teaching-requests",
      label: "Yêu cầu dạy học",
      icon: <BookHeart className="h-4 w-4" />,
   },
   {
      to: "/tutor/schedule",
      label: "Lịch dạy",
      icon: <Calendar className="h-4 w-4" />,
   },
   {
      to: "/tutor/learning-commitments",
      label: "Learning Commitments",
      icon: <BookCopy className="h-4 w-4" />,
   },
   {
      to: "/tutor/createFlashcardQuiz",
      label: "Tạo bộ câu hỏi Flashcard",
      icon: <BookPlus className="h-4 w-4" />,
   },
   {
      to: "/tutor/createMultipleChoiceQuiz",
      label: "Tạo bộ câu hỏi Trắc nghiệm",
      icon: <BookPlus className="h-4 w-4" />,
   },
   {
      to: "/tutor/createShortAnswerQuiz",
      label: "Tạo bộ câu hỏi Short Answer",
      icon: <BookPlus className="h-4 w-4" />,
   },
   {
      to: "/tutor/flashcardList",
      label: "Xem bộ câu hỏi Flashcard",
      icon: <BookCopy className="h-4 w-4" />,
   },
   {
      to: "/tutor/MultipleChoiceList",
      label: "Xem bộ câu hỏi Trắc nghiệm",
      icon: <BookCopy className="h-4 w-4" />,
   },
   {
      to: "/tutor/ShortAnswerList",
      label: "Xem bộ câu hỏi Short Answer",
      icon: <BookCopy className="h-4 w-4" />,
   },
   {
      to: "/tutor/rejected-sessions",
      label: "Buổi học bị từ chối",
      icon: <XCircle className="h-4 w-4" />,
   },
   {
      to: "/tutor/review-list",
      label: "Quản lý đánh giá",
      icon: <BookCopy className="h-4 w-4" />,
   },
   {
      to: "/tutor/create-material",
      label: "Tải lên tài liệu",
      icon: <FileUp className="h-4 w-4" />,
   },
   {
      to: "/tutor/material-management",
      label: "Quản lý tài liệu",
      icon: <FolderKanban className="h-4 w-4" />,
   },

   {
      to: "/tutor/wallet",
      label: "Ví của tôi",
      icon: <Wallet className="h-4 w-4" />,
   },

   // Thêm các mục khác ở đây
];

const TutorSidebarItems: React.FC<{
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

            {tutorSidebarConfig.map((item) => {
               const active = isActive(item.to, item.exact);
               return (
                  <Link
                     key={item.to}
                     to={item.to}
                     onClick={() => onLinkClick?.()}
                     className={`flex items-center gap-3 p-2 rounded-md text-sm font-medium transition-colors duration-200
                        ${active
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

export default TutorSidebarItems;
