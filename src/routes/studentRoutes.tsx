import ProtectedRoute from "./ProtectedRoute";

import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import StudentLayout from "@/layouts/StudentLayout";
import ProfileForm from "@/components/user/ProfileForm";
import StudentProfile from "@/pages/Student/StudentProfile";
import CreateStudentProfile from "@/pages/Student/CreateStudentProfile";
import IsCreatedProfileRoute from "./isCreatedProfileRoute";
import ViewFlashcardQuizQuestion from "@/pages/Flashcard/ViewFlashcardQuizQuestion";
import FavoriteTutor from "@/pages/Student/FavoriteTutor";
import MyApplicationsPage from "@/pages/Student/MyApplicationsPage";
import SchedulePage from "@/pages/SchedulePage";
import TeachingRequestDetail from "@/pages/Tutor/TeachingRequestDetail";
import RejectedSessionsPage from "@/pages/RejectedSessionsPage";
import AbsenceSessionPage from "@/pages/absenceSession";
import { StudentReviewHistory } from "@/pages/Review/StudentReviewHistory";
import SessionDetailPage from "@/pages/SessionDetailPage";
import { LearningCommitmentsPage } from "@/pages/Student/LearningCommitmentsPage";

import WalletManagement from "@/pages/wallet/walletManagement";
import MyViolationReportsPage from "@/pages/Student/MyViolationReportsPage";
import DoMCQ from "@/pages/MultipleChoice/DoMCQ";
import ViewMCQHistoryList from "@/pages/MultipleChoice/ViewMCQHistoryList";
import ViewMCQHistory from "@/pages/MultipleChoice/ViewMCQHistory";
import PaymentHistoryPage from "@/pages/paymentTutor/paymentStudent";
import DoSAQ from "@/pages/ShortAnswer/DoSAQ";
import ViewSAQHistory from "@/pages/ShortAnswer/ViewSAQHistory";
import ViewSAQHistoryList from "@/pages/ShortAnswer/ViewSAQHistoryList";

// import SessionDetailPage from "@/pages/SessionDetailPage"; // Moved to sharedRoutes
import ChatPage from "@/pages/chat/chatPage";
import StudentDashboardPage from "@/pages/Student/StudentDashboardPage";

export const studentRoutes = {
   element: (
      <ProtectedRoute allowedRoles={["STUDENT"]}>
         <StudentLayout />
      </ProtectedRoute>
   ),
   children: [
      {
         path: "/student/dashboard",
         element: (
            <IsCreatedProfileRoute>
               <StudentDashboardPage />,
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/student/applications",
         element: (
            <IsCreatedProfileRoute>
               <MyApplicationsPage />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/student/applications/:id",
         element: (
            <IsCreatedProfileRoute>
               <TeachingRequestDetail />
            </IsCreatedProfileRoute>
         ),
      },
      {
         path: "/student/schedule",
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
         path: "/student/absence-sessions",
         element: (
            <IsCreatedProfileRoute>
               <AbsenceSessionPage />
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
      {
         path: "/student/create-student-profile",
         element: <CreateStudentProfile />,
      },
      {
         path: "/student/learning-commitments",
         element: <LearningCommitmentsPage />,
      },
      {
         path: "/student/payment-history",
         element: <PaymentHistoryPage />,
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
         path: "/student/doSAQ",
         element: <DoSAQ />,
      },
      {
         path: "/student/MCQHistory",
         element: <ViewMCQHistoryList />,
      },
      {
         path: "/student/doneMCQ",
         element: <ViewMCQHistory />,
      },
      {
         path: "/student/SAQHistory",
         element: <ViewSAQHistoryList />,
      },
      {
         path: "/student/doneSAQ",
         element: <ViewSAQHistory />,
      },
      {
         path: "/student/chat",
         element: <ChatPage />,
      },
      {
         path: "/student/violation-reports",
         element: <MyViolationReportsPage />,
      },
      { path: "/student/change-password", element: <ChangePasswordPage /> },
   ],
};
