import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";

import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import TutorManagement from "@/pages/admin/TutorManagement";
import TutorProfilePage from "@/pages/admin/TutorProfilePage";
import TutorProfileListPage from "@/pages/admin/TutorProfileListPage";
import StudentManagement from "@/pages/admin/StudentManagement";
import TeachingRequestManagement from "@/pages/admin/TeachingRequestManagement";
import AdminLearningManagement from "@/pages/admin/AdminLearningManagement"; // Import new page
import AdminLearningDetailPage from "@/pages/admin/AdminLearningDetailPage"; // Import new page

import DisputeDetailPage from "@/pages/admin/DisputeDetailPage";
import ProfilePage from "@/pages/Profilepage";
import AdminLayout from "@/layouts/AdminLayout";
import SessionDisputeManagement from "@/pages/admin/SessionDisputeManagement";
import PackageManagement from "@/pages/admin/PackageManagement";
import AdminViolationReportManagement from "@/pages/admin/AdminViolationReportManagement";

export const adminRoutes = {
   element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
         <AdminLayout />
      </ProtectedRoute>
   ),
   children: [
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/tutors", element: <TutorManagement /> },
      { path: "/admin/tutors/:tutorId", element: <TutorProfilePage /> },
      { path: "/admin/tutor-profile", element: <TutorProfileListPage /> },
      { path: "/admin/students", element: <StudentManagement /> },
      {
         path: "/admin/teaching-requests",
         element: <TeachingRequestManagement />,
      },
      {
         path: "/admin/learning", // Add route for listing
         element: <AdminLearningManagement />,
      },
      {
         path: "/admin/learning/:commitmentId", // Add route for detail
         element: <AdminLearningDetailPage />,
      },
      {
         path: "/admin/disputes",
         element: <SessionDisputeManagement />,
      },
      {
         path: "/admin/disputes/:sessionId",
         element: <DisputeDetailPage />,
      },
      { path: "/admin/packages", element: <PackageManagement /> },
      {
         path: "/admin/violation-reports",
         element: <AdminViolationReportManagement />,
      },
      { path: "/admin/profile", element: <ProfilePage /> },
      { path: "/profile/change-password", element: <ChangePasswordPage /> },
   ],
};
