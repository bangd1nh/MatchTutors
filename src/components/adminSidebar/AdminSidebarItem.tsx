import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	LogOut,
	Home,
	User,
	LayoutDashboard,
	BookOpen,
	GraduationCap,
	MessageSquare,
	FileText,
	Key,
	Package as PackageIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export type SidebarItem = {
	to: string;
	label: string;
	exact?: boolean;
	icon?: React.ReactNode;
};

const personalItems: SidebarItem[] = [
	{ to: "/admin/dashboard", label: "Tổng quan", icon: <LayoutDashboard className="h-5 w-5" /> },
	{ to: "/admin/profile", label: "Hồ sơ cá nhân", icon: <User className="h-5 w-5" /> },
	{ to: "/profile/change-password", label: "Đổi mật khẩu", icon: <Key className="h-5 w-5" /> },
];

const managementItems: SidebarItem[] = [
	{ to: "/admin/tutor-profile", label: "Hồ sơ Gia sư", icon: <FileText className="h-5 w-5" /> },
	{ to: "/admin/tutors", label: "Tài khoản Gia sư", icon: <BookOpen className="h-5 w-5" /> },
	{ to: "/admin/students", label: "Tài khoản Học sinh", icon: <GraduationCap className="h-5 w-5" /> },
	{ to: "/admin/teaching-requests", label: "Yêu cầu dạy", icon: <MessageSquare className="h-5 w-5" /> },
	{ to: "/admin/packages", label: "Gói dịch vụ", icon: <PackageIcon className="h-5 w-5" /> },
];

const AdminSidebarItems: React.FC<{
	onLinkClick?: () => void;
	collapsed?: boolean;
}> = (props) => {
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

	const baseItemClass =
		"group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200";
	const activeClass =
		"bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md";
	const inactiveClass =
		"text-gray-700 hover:bg-gray-50";

	const renderGroup = (title: string, items: SidebarItem[]) => (
		<div>
			<div className={`px-3 pt-3 pb-2 text-[10px] tracking-wide uppercase text-gray-400 ${collapsed ? "sr-only" : "block"}`}>
				{title}
			</div>
			<nav className="space-y-1">
				{items.map((item) => {
					const active = isActive(item.to, item.exact);
					return (
						<Link
							key={item.to}
							to={item.to}
							onClick={() => onLinkClick?.()}
							className={`${baseItemClass} ${active ? activeClass : inactiveClass}`}
							aria-current={active ? "page" : undefined}
							title={item.label}
						>
							{item.icon && <span className={`flex-none ${active ? "text-white" : "text-gray-500 group-hover:text-inherit"}`}>{item.icon}</span>}
							<span className={`${collapsed ? "sr-only" : "inline-block"}`}>{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);

	return (
		<div className="flex flex-col h-full">
			<div className="space-y-1 flex-grow">
				<Link
					to="/"
					onClick={() => onLinkClick?.()}
					className={`${baseItemClass} ${isActive("/", true) ? activeClass : inactiveClass}`}
					title="Trang chủ"
				>
					<Home className={`h-5 w-5 flex-none ${isActive("/", true) ? "text-white" : "text-gray-500 group-hover:text-inherit"}`} />
					<span className={`${collapsed ? "sr-only" : "inline-block"}`}>Trang chủ</span>
				</Link>

				{renderGroup("Tài khoản cá nhân", personalItems)}

				<div className="px-3 py-2">
					<div className="h-px bg-gray-200 dark:bg-gray-800" />
				</div>

				{renderGroup("Quản trị hệ thống", managementItems)}
			</div>

			<div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-800">
				<Button
					variant="ghost"
					className="w-full justify-start text-sm font-semibold text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
					onClick={handleLogout}
					title="Đăng xuất"
				>
					<LogOut className="h-5 w-5 mr-3" />
					<span className={`${collapsed ? "sr-only" : "inline-block"}`}>Đăng xuất</span>
				</Button>
			</div>
		</div>
	);
};

export default AdminSidebarItems;
