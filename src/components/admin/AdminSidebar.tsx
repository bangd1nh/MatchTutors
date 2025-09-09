import { useUser } from "@/hooks/useUser";
import AdminSidebarItems from "./AdminSidebarItems";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
   className?: string;
   onLinkClick?: () => void;
}

const AdminSidebar = ({ className, onLinkClick }: AdminSidebarProps) => {
   const { user } = useUser();

   return (
      <aside
         className={cn(
            "bg-gray-200 dark:bg-gray-800 p-4 flex flex-col",
            className
         )}
      >
         <div className="mb-4">
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-red-500 font-bold">{user?.role}</p>
         </div>
         <nav className="flex-grow">
            <AdminSidebarItems onLinkClick={onLinkClick} />
         </nav>
      </aside>
   );
};

export default AdminSidebar;
