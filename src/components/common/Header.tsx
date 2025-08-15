// src/components/common/Header.tsx
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import NotificationBell from "./NotificationBell";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { Menu, ChevronDown, MoreVertical } from "lucide-react"; // Import MoreVertical
import { useMediaQuery } from "@/hooks/useMediaQuery"; // Import useMediaQuery
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const { isAuthenticated, logout, user } = useAuthStore();
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation(); // Destructure i18n here
    const isMobile = useMediaQuery("(max-width: 767px)"); // Define mobile breakpoint

    const getDashboardPath = () => {
        if (!user) return "/";
        switch (user.role) {
            case "ADMIN":
                return "/admin/dashboard";
            case "EMPLOYER":
                return "/employer/dashboard";
            case "JOBSEEKER":
                return "/jobseeker/dashboard";
            default:
                return "/";
        }
    };

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const renderRoleNavItems = () => {
        if (!user) return null;

        const navLinks: { to: string; label: string }[] = [];

        switch (user.role) {
            case "ADMIN":
                navLinks.push(
                    { to: "/admin/users", label: t("manage_users") },
                    { to: "/admin/reports", label: t("view_reports") }
                );
                break;
            case "EMPLOYER":
                navLinks.push(
                    { to: "/employer/jobs/new", label: t("post_a_job") },
                    { to: "/employer/jobs", label: t("my_jobs") }
                );
                break;
            case "JOBSEEKER":
                navLinks.push(
                    { to: "/jobs", label: t("find_jobs") },
                    {
                        to: "/jobseeker/applications",
                        label: t("my_applications"),
                    }
                );
                break;
            default:
                return null;
        }

        if (isMobile) {
            // Render DropdownMenu for mobile
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                            <span className="sr-only">More navigation</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {navLinks.map((link) => (
                            <DropdownMenuItem key={link.to} asChild>
                                <Link to={link.to} className="w-full">
                                    {link.label}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        } else {
            // Render direct links for desktop
            return (
                <div className="flex gap-6 items-center">
                    {navLinks.map((link) => (
                        <Link key={link.to} to={link.to} className="nav-link">
                            {link.label}
                        </Link>
                    ))}
                </div>
            );
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md px-4 sm:px-6 py-4 flex justify-between items-center z-10 w-full">
            <div className="flex items-center">
                {onMenuClick && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMenuClick}
                        className="md:hidden mr-2"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                )}
                <Link
                    to="/"
                    className="text-xl sm:text-2xl font-bold text-primary"
                >
                    {t("job_board")}
                </Link>
            </div>

            <nav className="flex-1 ml-6 sm:ml-10 flex justify-end md:justify-start">
                {" "}
                {/* Adjust justify for mobile dropdown */}
                {renderRoleNavItems()}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
                {isAuthenticated && (
                    <>
                        <Link
                            to={getDashboardPath()}
                            className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            {t("dashboard")}
                        </Link>
                        <NotificationBell />
                        <Button onClick={logout} variant="ghost" size="sm">
                            {t("logout")}
                        </Button>
                    </>
                )}

                {!isAuthenticated && (
                    <>
                        <Link
                            to="/login"
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            {t("login")}
                        </Link>
                        <Link
                            to="/map"
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            {t("a")}
                        </Link>
                        <Link
                            to="/tutor-list"
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            {t("tutor list")}
                        </Link>
                        <Link
                            to="/tutor-detail/1"
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            {t("tutor detail")}
                        </Link>

                    </>
                )}

                {/* Language Toggle Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                            {i18n.language.toUpperCase()}
                            <ChevronDown className="ml-1 h-4 w-4" />
                            <span className="sr-only">Change language</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => changeLanguage("en")}>
                            English
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeLanguage("vi")}>
                            Tiếng Việt
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-8 w-8 sm:h-9 sm:w-9"
                >
                    {theme === "light" ? "🌙" : "☀️"}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </div>
        </header>
    );
};

export default Header;
