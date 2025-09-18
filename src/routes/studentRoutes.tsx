import ProtectedRoute from "./ProtectedRoute";
import OverviewPage from "../pages/dashboard/OverviewPage";
import Application from "@/pages/Jobseeker/Application";
import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import StudentLayout from "@/layouts/StudentLayout";
import ProfileForm from "@/components/user/ProfileForm";
import StudentProfile from "@/pages/Student/StudentProfile";
import CreateStudentProfile from "@/pages/Student/CreateStudentProfile";
import IsCreatedProfileRoute from "./isCreatedProfileRoute";
import FavoriteTutor from "@/pages/Student/FavoriteTutor";

export const studentRoutes = {
   element: (
      <ProtectedRoute allowedRoles={["STUDENT"]}>
         <StudentLayout />
      </ProtectedRoute>
   ),
   children: [
      // Các route cần kiểm tra profile thì wrap bằng IsCreatedProfileRoute
      {
         path: "/student/dashboard",
         element: (
            <IsCreatedProfileRoute>
               <OverviewPage />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/student/applications",
         element: (
            <IsCreatedProfileRoute>
               <Application />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/profile/change-password",
         element: (
            <IsCreatedProfileRoute>
               <ChangePasswordPage />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/student/profile",
         element: (
            <IsCreatedProfileRoute>
               <ProfileForm />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/student/student-profile",
         element: (
            <IsCreatedProfileRoute>
               <StudentProfile />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/student/favorite",
         element: (
            <IsCreatedProfileRoute>
               <FavoriteTutor />
            </IsCreatedProfileRoute>
         ),
      },
      // Route tạo profile KHÔNG được wrap!
      {
         path: "/student/create-student-profile",
         element: <CreateStudentProfile />,
      },
   ],
};
