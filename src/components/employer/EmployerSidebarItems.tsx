import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EmployerSidebarItems = () => {
    const location = useLocation();
    const { t } = useTranslation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="space-y-1">
            <Link
                to="/employer/dashboard"
                className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors duration-200 rounded-s-none
                    ${
                        isActive("/employer/dashboard")
                            ? "bg-blue-500/20 text-gray-900 dark:text-white border-l-4 border-blue-500"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }
                `}
            >
                {t("dashboard")}
            </Link>
            <Link
                to="/employer/jobs"
                className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors duration-200 rounded-s-none
                    ${
                        isActive("/employer/jobs")
                            ? "bg-blue-500/20 text-gray-900 dark:text-white border-l-4 border-blue-500"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }
                `}
            >
                {t("manage_jobs")}
            </Link>
            <Link
                to="/employer/map"
                className={`flex items-center p-2 rounded-md text-sm font-medium transition-colors duration-200 rounded-s-none
                    ${
                        isActive("/employer/jobs")
                            ? "bg-blue-500/20 text-gray-900 dark:text-white border-l-4 border-blue-500"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }
                `}
            >
                {t("map")}
            </Link>
        </div>
    );
};

export default EmployerSidebarItems;
