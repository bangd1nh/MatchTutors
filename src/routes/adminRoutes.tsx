import ProtectedRoute from "./ProtectedRoute";
import OverviewPage from "../pages/dashboard/OverviewPage";
import TutorLayout from "@/layouts/AdminLayout";
import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import BanUser from "@/pages/admin/BanUnBanUser";
import ProfilePage from "@/pages/Profilepage";

export const adminRoutes = {
   element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
         <TutorLayout />
      </ProtectedRoute>
   ),
   children: [
      { path: "/admin/dashboard", element: <OverviewPage /> },
      { path: "/ban-user", element: <BanUser /> },
      { path: "/admin/profile", element: <ProfilePage /> },
      { path: "/profile/change-password", element: <ChangePasswordPage /> },
   ],
};
