import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "./NotificationBell";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { Menu, ChevronDown } from "lucide-react";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useMemo } from "react";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
   onMenuClick?: () => void;
}

type Role = "ADMIN" | "TUTOR" | "STUDENT" | "PARENT";

interface NavLink {
   to: string;
   label: string;
   order?: number;
}

// ✅ Tách riêng links theo từng role
const PUBLIC_LINKS: NavLink[] = [
   {
      to: "/tutor-list",
      label: "Danh sách gia sư",
      order: 1,
   },
   {
      to: "/features",
      label: "Tính năng",
      order: 2,
   },
   {
      to: "/pricing",
      label: "Bảng giá",
      order: 3,
   },
   {
      to: "/knowledge",
      label: "Blog",
      order: 4,
   },
   // thêm link trước khi đăng nhập
];

const ADMIN_LINKS: NavLink[] = [
   {
      to: "/admin/users",
      label: "Quản lý người dùng",
      order: 1,
   },
   // thêm link cho admin
];

const TUTOR_LINKS: NavLink[] = [];

const STUDENT_LINKS: NavLink[] = [
   {
      to: "/tutor-list",
      label: "Tìm gia sư",
      order: 1,
   },
   // thêm link cho student
];

const PARENT_LINKS: NavLink[] = [
   {
      to: "/tutor-list",
      label: "Tìm gia sư",
      order: 1,
   },
   {
      to: "/parent/payments",
      label: "Thanh toán",
      order: 2,
   },
   // thêm link cho role bố mẹ
];

const COMMON_AUTH_LINKS: NavLink[] = [
   {
      to: "/features",
      label: "Tính năng",
      order: 2,
   },
   {
      to: "/pricing",
      label: "Bảng giá",
      order: 3,
   },
   {
      to: "/knowledge",
      label: "Blog",
      order: 4,
   },
   {
      to: "/help",
      label: "Trợ giúp",
      order: 5,
   },
   //thêm các link public sau khi đã đăng nhậpk
];

// ✅ Function để lấy links theo role
const getNavLinksByRole = (
   role: Role | undefined,
   isAuthenticated: boolean
): NavLink[] => {
   if (!isAuthenticated) {
      return PUBLIC_LINKS;
   }

   let roleLinks: NavLink[] = [];

   switch (role) {
      case "ADMIN":
         roleLinks = ADMIN_LINKS;
         break;
      case "TUTOR":
         roleLinks = TUTOR_LINKS;
         break;
      case "STUDENT":
         roleLinks = STUDENT_LINKS;
         break;
      case "PARENT":
         roleLinks = PARENT_LINKS;
         break;
      default:
         roleLinks = [];
   }

   // Kết hợp role-specific links với common auth links
   let combinedLinks = [...roleLinks, ...COMMON_AUTH_LINKS];

   // Sinh viên không cần xem bảng giá (chỉ dành cho tutor & guest)
   if (isAuthenticated && role === "STUDENT") {
      combinedLinks = combinedLinks.filter((link) => link.to !== "/pricing");
   }

   return combinedLinks.sort((a, b) => (a.order || 0) - (b.order || 0));
};

const NavLinks = ({
   isMobile = false,
   onLinkClick,
   userRole,
   isAuthenticated,
}: {
   isMobile?: boolean;
   onLinkClick?: () => void;
   userRole?: Role;
   isAuthenticated: boolean;
}) => {
   const visibleLinks = useMemo(() => {
      return getNavLinksByRole(userRole, isAuthenticated);
   }, [userRole, isAuthenticated]);

   const linkClass = isMobile
      ? "text-lg font-medium text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 py-2 block"
      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition whitespace-nowrap";

   return (
      <>
         {visibleLinks.map((link) => (
            <Link
               key={link.to}
               to={link.to}
               className={linkClass}
               onClick={onLinkClick}
            >
               {link.label}
            </Link>
         ))}
      </>
   );
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
   const { user: userData, isAuthenticated } = useUser();
   const { logout } = useAuth();
   const user = userData;

   const navigate = useNavigate();
   const { theme, toggleTheme } = useTheme();
   const { t, i18n } = useTranslation();

   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

   const getDashboardPath = () => {
      if (!user) return "/";
      switch (user.role as unknown as Role) {
         case "ADMIN":
            return "/admin/dashboard";
         case "TUTOR":
            return "/tutor/dashboard";
         case "STUDENT":
            return "/student/dashboard";
         case "PARENT":
            return "/parent/dashboard";
         default:
            return "/";
      }
   };

   // ✅ Lấy role name để hiển thị
   const getRoleName = (role: Role) => {
      const roleNames = {
         ADMIN: "Quản trị viên",
         TUTOR: "Gia sư",
         STUDENT: "Học sinh",
         PARENT: "Phụ huynh",
      };
      return roleNames[role] || role;
   };

   return (
      <header className="w-full sticky top-0 z-40 bg-sky-50/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
         <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
               {/* Left: logo + admin mobile menu */}
               <div className="flex items-center gap-3 min-w-0">
                  {onMenuClick && (
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMenuClick}
                        className="md:hidden"
                     >
                        <Menu className="h-5 w-5 text-sky-800 dark:text-sky-200" />
                     </Button>
                  )}

                  <Link to="/" className="flex items-center gap-3 min-w-0">
                     <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden p-1">
                        <img
                           src="/tutor.png"
                           alt="TutorMatch"
                           className="h-full w-full object-contain"
                        />
                     </div>
                     <div className="hidden sm:flex flex-col leading-none whitespace-nowrap">
                        <span className="text-sky-900 dark:text-white font-semibold text-lg">
                           TutorMatch
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400 -mt-0.5">
                           Kết nối gia sư & học sinh
                        </span>
                     </div>
                  </Link>
               </div>

               {/* Center: nav (desktop) */}
               <nav className="hidden md:flex items-center justify-center flex-1 gap-8 px-6">
                  <NavLinks
                     userRole={user?.role as Role}
                     isAuthenticated={isAuthenticated}
                  />
               </nav>

               {/* Right: actions */}
               <div className="flex items-center justify-end gap-2">
                  {isAuthenticated && user && (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <button
                              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mr-2"
                              aria-label="Open user menu"
                           >
                              <div className="text-right">
                                 <div className="truncate">
                                    {user.name || user.email}
                                 </div>
                                 <div className="text-xs text-slate-500 dark:text-slate-400">
                                    {getRoleName(user.role as Role)}
                                 </div>
                              </div>
                              <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                           </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem
                              onClick={() => {
                                 navigate(getDashboardPath());
                              }}
                           >
                              {t("dashboard") || "Dashboard"}
                           </DropdownMenuItem>
                           {/* <DropdownMenuItem
                              onClick={() => {
                                 navigate("/tutor/profile-page");
                              }}
                           >
                              Hồ sơ cá nhân
                           </DropdownMenuItem> */}
                        </DropdownMenuContent>
                     </DropdownMenu>
                  )}

                  {/* Desktop explicit logout button (visible when authenticated) */}
                  {isAuthenticated && (
                     <Button
                        variant="ghost"
                        className="hidden md:inline-flex px-4 py-2"
                        onClick={logout}
                     >
                        {t("logout") || "Đăng xuất"}
                     </Button>
                  )}

                  {isAuthenticated ? (
                     <NotificationBell />
                  ) : (
                     <div className="hidden md:flex items-center gap-2">
                        <Link to="/login">
                           <Button
                              variant="ghost"
                              className="px-5 py-2 rounded-full text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-800 transition"
                           >
                              {t("login") || "Đăng nhập"}
                           </Button>
                        </Link>
                        <Link to="/register">
                           <Button className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:opacity-95 transition">
                              Đăng ký
                           </Button>
                        </Link>
                     </div>
                  )}

                  {/* Language & Theme Toggle */}
                  <div className="hidden md:flex items-center">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                           >
                              <span className="text-xs font-semibold">
                                 {i18n.language?.toUpperCase?.() || "EN"}
                              </span>
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem
                              onClick={() => changeLanguage("en")}
                           >
                              English
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              onClick={() => changeLanguage("vi")}
                           >
                              Tiếng Việt
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="h-9 w-9"
                     >
                        {theme === "light" ? "🌙" : "☀️"}
                        <span className="sr-only">Toggle theme</span>
                     </Button>
                  </div>

                  {/* Mobile Menu Trigger */}
                  <div className="md:hidden">
                     <Sheet
                        open={isMobileMenuOpen}
                        onOpenChange={setIsMobileMenuOpen}
                     >
                        <SheetTrigger asChild>
                           <Button variant="ghost" size="icon">
                              <Menu className="h-5 w-5" />
                           </Button>
                        </SheetTrigger>
                        <SheetContent
                           side="right"
                           className="w-full sm:w-[320px] bg-white dark:bg-slate-950"
                        >
                           <SheetHeader>
                              <SheetTitle>
                                 {isAuthenticated && user
                                    ? `${getRoleName(user.role as Role)} - ${
                                         user.name || user.email
                                      }`
                                    : "Menu"}
                              </SheetTitle>
                           </SheetHeader>
                           <div className="py-4 flex flex-col h-full">
                              <nav className="flex flex-col gap-2">
                                 <NavLinks
                                    isMobile
                                    onLinkClick={() =>
                                       setIsMobileMenuOpen(false)
                                    }
                                    userRole={user?.role as Role}
                                    isAuthenticated={isAuthenticated}
                                 />
                              </nav>
                              <div className="mt-auto space-y-4">
                                 <hr className="dark:border-slate-800" />
                                 {isAuthenticated ? (
                                    <div className="space-y-2">
                                       <Button
                                          variant="outline"
                                          className="w-full"
                                          onClick={() => {
                                             navigate(getDashboardPath());
                                             setIsMobileMenuOpen(false);
                                          }}
                                       >
                                          Dashboard
                                       </Button>
                                       <Button
                                          className="w-full"
                                          onClick={() => {
                                             logout();
                                             setIsMobileMenuOpen(false);
                                          }}
                                       >
                                          {t("logout") || "Đăng xuất"}
                                       </Button>
                                    </div>
                                 ) : (
                                    <div className="flex flex-col gap-3">
                                       <Link
                                          to="/login"
                                          onClick={() =>
                                             setIsMobileMenuOpen(false)
                                          }
                                       >
                                          <Button
                                             variant="outline"
                                             className="w-full"
                                          >
                                             {t("login") || "Đăng nhập"}
                                          </Button>
                                       </Link>
                                       <Link
                                          to="/register"
                                          onClick={() =>
                                             setIsMobileMenuOpen(false)
                                          }
                                       >
                                          <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                                             Đăng ký
                                          </Button>
                                       </Link>
                                    </div>
                                 )}

                                 {/* Language & Theme controls for mobile */}
                                 <div className="flex justify-center items-center gap-2">
                                    <p className="text-sm text-slate-500">
                                       Ngôn ngữ:
                                    </p>
                                    <Button
                                       variant={
                                          i18n.language === "vi"
                                             ? "secondary"
                                             : "ghost"
                                       }
                                       size="sm"
                                       onClick={() => changeLanguage("vi")}
                                    >
                                       VI
                                    </Button>
                                    <Button
                                       variant={
                                          i18n.language === "en"
                                             ? "secondary"
                                             : "ghost"
                                       }
                                       size="sm"
                                       onClick={() => changeLanguage("en")}
                                    >
                                       EN
                                    </Button>
                                 </div>
                                 <div className="flex justify-center items-center gap-2">
                                    <p className="text-sm text-slate-500">
                                       Giao diện:
                                    </p>
                                    <Button
                                       variant="ghost"
                                       size="icon"
                                       onClick={toggleTheme}
                                    >
                                       {theme === "light" ? "🌙" : "☀️"}
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </SheetContent>
                     </Sheet>
                  </div>
               </div>
            </div>
         </div>
      </header>
   );
};

export default Header;
