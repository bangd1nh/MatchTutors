import ProtectedRoute from "./ProtectedRoute";
import OverviewPage from "../pages/dashboard/OverviewPage";

import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import TutorManagement from "@/pages/admin/TutorManagement";
import StudentManagement from "@/pages/admin/StudentManagement";
import ProfilePage from "@/pages/Profilepage";
import AdminLayout from "@/layouts/AdminLayout";

export const adminRoutes = {
   element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
         <AdminLayout />
      </ProtectedRoute>
   ),
   children: [
      { path: "/admin/dashboard", element: <OverviewPage /> },
      { path: "/admin/tutors", element: <TutorManagement /> },
      { path: "/admin/students", element: <StudentManagement /> },
      { path: "/admin/profile", element: <ProfilePage /> },
      { path: "/profile/change-password", element: <ChangePasswordPage /> },
   ],
};