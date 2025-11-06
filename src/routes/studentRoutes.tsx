import ProtectedRoute from "./ProtectedRoute";
import OverviewPage from "../pages/dashboard/OverviewPage";

import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import StudentLayout from "@/layouts/StudentLayout";
import ProfileForm from "@/components/user/ProfileForm";
import StudentProfile from "@/pages/Student/StudentProfile";
import CreateStudentProfile from "@/pages/Student/CreateStudentProfile";
import IsCreatedProfileRoute from "./isCreatedProfileRoute";
import ViewFlashcardQuizQuestion from "@/pages/Flashcard/ViewFlashcardQuizQuestion";
import FavoriteTutor from "@/pages/Student/FavoriteTutor";
import MyApplicationsPage from "@/pages/Student/MyApplicationsPage";
import SchedulePage from "@/pages/SchedulePage"; // Import trang mới
import TeachingRequestDetail from "@/pages/Tutor/TeachingRequestDetail"; // Import component detail
import RejectedSessionsPage from "@/pages/RejectedSessionsPage"; // Import trang rejected sessions
import { StudentReviewHistory } from "@/pages/Review/StudentReviewHistory";
import SessionDetailPage from "@/pages/SessionDetailPage";
import { LearningCommitmentsPage } from "@/pages/Student/LearningCommitmentsPage";
import WalletManagement from "@/pages/wallet/walletManagement";
import DoMCQ from "@/pages/MultipleChoice/DoMCQ";
import ViewMCQHistoryList from "@/pages/MultipleChoice/ViewMCQHistoryList";
import ViewMCQHistory from "@/pages/MultipleChoice/ViewMCQHistory";

// import SessionDetailPage from "@/pages/SessionDetailPage"; // Moved to sharedRoutes

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
         element: <MyApplicationsPage />,
      },
      // Thêm route detail để student xem chi tiết và ra quyết định
      {
         path: "/student/applications/:id",
         element: <TeachingRequestDetail />, // tái sử dụng component detail
      },
      {
         path: "/student/schedule", // Thêm route mới
         element: (
            <IsCreatedProfileRoute>
               <SchedulePage />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "student/review-history",
         element: <StudentReviewHistory />,
      },
      {
         // Session detail route moved to sharedRoutes (accessible by both roles)
         // path: "/session/:id",
         // element: <SessionDetailPage />,
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
         path: "/student/viewQuiz",
         element: (
            <IsCreatedProfileRoute>
               <ViewFlashcardQuizQuestion />
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
      {
         path: "/student/rejected-sessions",
         element: (
            <IsCreatedProfileRoute>
               <RejectedSessionsPage />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/student/flashcard",
         element: (
            <IsCreatedProfileRoute>
               <ViewFlashcardQuizQuestion />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/student/session/:id",
         element: (
            <IsCreatedProfileRoute>
               <SessionDetailPage />
            </IsCreatedProfileRoute>
         ),
      },
      // Route tạo profile KHÔNG được wrap!
      {
         path: "/student/create-student-profile",
         element: <CreateStudentProfile />,
      },
      {
         path: "/student/learning-commitments",
         element: <LearningCommitmentsPage />,
      },
      {
         path: "/student/wallet",
         element: <WalletManagement />,
      },
      {
         path: "/student/doMCQ",
         element: <DoMCQ />,
      },
      {
         path: "/student/MCQHistory",
         element: <ViewMCQHistoryList />,
      },
      {
         path: "/student/doneMCQ",
         element: <ViewMCQHistory />,
      },
   ],
};
