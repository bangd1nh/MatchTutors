import { Link } from "react-router-dom";
// import { useAuthStore } from "@/store/useAuthStore";

const Sidebar = () => {
   const { user } = useAuthStore();

   return (
      <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-4 flex flex-col">
         <div className="mb-4">
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.role}</p>
         </div>
         <nav className="flex-grow">
            <ul>
               <li>
                  <Link
                     to="/dashboard"
                     className="block py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                     Dashboard
                  </Link>
               </li>

               {/* Admin Routes */}
               {user?.role === "ADMIN" && (
                  <li>
                     <Link
                        to="/admin"
                        className="block py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                     >
                        User Management
                     </Link>
                  </li>
               )}

               {/* Employer Routes */}
               {user?.role === "EMPLOYER" && (
                  <li>
                     <Link
                        to="/employer/jobs"
                        className="block py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                     >
                        Post a Job
                     </Link>
                  </li>
               )}

               {/* Job Seeker Routes */}
               {user?.role === "JOBSEEKER" && (
                  <li>
                     <Link
                        to="/jobseeker/applications"
                        className="block py-2 px-4 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                     >
                        My Applications
                     </Link>
                  </li>
               )}
            </ul>
         </nav>
      </aside>
   );
};

export default Sidebar;
