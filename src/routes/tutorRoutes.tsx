import EmployerLayout from "../layouts/TutorLayout";
import ProtectedRoute from "./ProtectedRoute";
import OverviewPage from "../pages/dashboard/OverviewPage";
import JobManage from "@/pages/Employer/JobManage";
import ProfilePage from "@/pages/Profilepage";
import TutorProfile from "@/pages/TutorProfile/TutorProfile";
import TutorProfileForm from "@/pages/TutorProfile/TutorProfileForm";

export const tutorRoutes = {
   element: (
      <ProtectedRoute allowedRoles={["TUTOR"]}>
         <EmployerLayout />
      </ProtectedRoute>
   ),
   children: [
      { path: "/tutor/dashboard", element: <OverviewPage /> },
      { path: "/tutor/profile", element: <TutorProfileForm /> },
      { path: "/tutor-profile/page", element: <TutorProfile /> },
      {
         path: "/tutor/jobs",
         element: <JobManage />,
      },
   ],
};
