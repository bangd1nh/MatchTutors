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
import React, { useState } from "react";
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

const NavLinks = ({
    isMobile = false,
    onLinkClick,
}: {
    isMobile?: boolean;
    onLinkClick?: () => void;
}) => {
    const links = [
        { to: "/tutor-list", label: "Danh sách gia sư " },
        { to: "/features", label: "Tính năng" },
        { to: "/pricing", label: "Bảng giá" },
        { to: "/knowledge", label: "Blog" },
    ];

    const linkClass = isMobile
        ? "text-lg font-medium text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 py-2 block"
        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition whitespace-nowrap";

    return (
        <>
            {links.map((link) => (
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

    type Role = "ADMIN" | "TUTOR" | "STUDENT" | "PARENT";

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

    return (
        <header className="w-full sticky top-0 z-50 bg-sky-50/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <NavLinks />
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
                                        <span className="truncate">
                                            Welcome, {user.email}
                                        </span>
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
                            <>
                                <NotificationBell />
                                {/* Xóa bỏ DropdownMenu của user */}
                            </>
                        ) : (
                            <>
                                <div className="hidden md:flex items-center gap-2">
                                    <Link to="/login">
                                        <Button
                                            variant="ghost"
                                            className="px-5 py-2 rounded-full text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-800 transition"
                                        >
                                            {t("login") || "Login"}
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:opacity-95 transition">
                                            Đăng ký
                                        </Button>
                                    </Link>
                                </div>
                            </>
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
                                        <SheetTitle>Menu</SheetTitle>
                                    </SheetHeader>
                                    <div className="py-4 flex flex-col h-full">
                                        <nav className="flex flex-col gap-2">
                                            <NavLinks
                                                isMobile
                                                onLinkClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            />
                                        </nav>
                                        <div className="mt-auto space-y-4">
                                            <hr className="dark:border-slate-800" />
                                            {isAuthenticated ? (
                                                <Button
                                                    className="w-full"
                                                    onClick={() => {
                                                        logout();
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                >
                                                    {t("logout") || "Đăng xuất"}
                                                </Button>
                                            ) : (
                                                !isAuthenticated && (
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
                                                                {t("login") || "Login"}
                                                            </Button>
                                                        </Link>
                                                        <Link
                                                            to="/register"
                                                            onClick={() =>
                                                                setIsMobileMenuOpen(false)
                                                            }
                                                        >
                                                            <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                                                                Bắt đầu miễn phí
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                )
                                            )}
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
