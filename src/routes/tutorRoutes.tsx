import ProtectedRoute from "./ProtectedRoute";
import ProtectedCommitmentRoute from "./ProtectedCommitmentRoute";
import ProtectedTutorProfileRoute from "./ProtectedTutorProfileRoute";

import ProfilePage from "@/pages/Profilepage";
import TutorProfile from "@/pages/TutorProfile/TutorProfile";
import TutorLayout from "@/layouts/TutorLayout";
import CreateFlashcardQuiz from "@/pages/Flashcard/CreateFlashcardQuiz";
import FlashcardQuizList from "@/pages/Flashcard/FlashcardQuizList";
import ViewFlashcardQuizQuestion from "@/pages/Flashcard/ViewFlashcardQuizQuestion";
import EditFlashcardQuiz from "@/pages/Flashcard/EditFlashcardQuiz";
import TutorProfilePage from "@/pages/TutorProfile/TutorProfilePage";
import TeachingRequestsList from "@/pages/Tutor/TeachingRequestsList";
import TeachingRequestDetail from "@/pages/Tutor/TeachingRequestDetail";
import StudentProfileForTutor from "@/pages/Tutor/StudentProfileForTutor";
import SchedulePage from "@/pages/SchedulePage"; // Import trang mới
import RejectedSessionsPage from "@/pages/RejectedSessionsPage"; // Import trang rejected sessions
import AbsenceSessionPage from "@/pages/absenceSession";
import CreateMultipleChoiceQuiz from "@/pages/MultipleChoice/CreateMultipleChoiceQuiz";
import ViewMultipleQuizList from "@/pages/MultipleChoice/ViewMultipleQuizList";
import ViewMultipleChoiceQuiz from "@/pages/MultipleChoice/ViewMultipleChoiceQuiz";
import EditMultipleChoiceQuiz from "@/pages/MultipleChoice/EditMultipleChoiceQuiz";
import { ReviewList } from "@/pages/Review/TutorReviewList";
import { CreateLearningCommitmentPage } from "@/pages/Student/CreateLearningCommitmentPage";
import { LearningCommitmentsPage } from "@/pages/Student/LearningCommitmentsPage";
import WalletManagement from "@/pages/wallet/walletManagement";
import SessionDetailPage from "@/pages/SessionDetailPage";
import CreateMaterialPage from "@/pages/material/createMaterial"; // Import trang mới
import MaterialManagementPage from "@/pages/material/materialManagement"; // Import trang mới
import ViewShortAnswerQuizList from "@/pages/ShortAnswer/ViewShortAnswerQuizList";
import ViewShortAnswerQuiz from "@/pages/ShortAnswer/ViewShortAnswerQuiz";
import EditShortAnswerQuiz from "@/pages/ShortAnswer/EditShortAnswerQuiz";
import CreateShortAnswerQuiz from "@/pages/ShortAnswer/CreateShortAnswerQuiz";
import ViewStudentMCQHistoryList from "@/pages/MultipleChoice/ViewStudentMCQHistoryList";
import ViewMCQHistory from "@/pages/MultipleChoice/ViewMCQHistory";
import PaymentTutorPage from "@/pages/paymentTutor/paymentTutor";
import ChatPage from "@/pages/chat/chatPage";
import DashboardTutorPage from "@/pages/dashboardTutor/dashboardTutorPage";
import ViewSAQHistory from "@/pages/ShortAnswer/ViewSAQHistory";
import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import { PayoutHistoryList } from "@/pages/paymentTutor/payoutHistory";
import SessionByLearningCommitment from "@/components/learning-commitment/SessionByLearningCommitment";

export const tutorRoutes = {
   element: (
      <ProtectedRoute allowedRoles={["TUTOR"]}>
         <TutorLayout />
      </ProtectedRoute>
   ),
   children: [
      {
         path: "/tutor/dashboard",
         element: (
            <ProtectedTutorProfileRoute>
               <DashboardTutorPage />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/wallet",
         element: <WalletManagement />,
      },
      {
         path: "/tutor/payout-history",
         element: <PayoutHistoryList />,
      },
      { path: "/tutor/profile", element: <ProfilePage /> },
      { path: "/tutor/create-profile", element: <TutorProfilePage /> },
      { path: "/tutor/change-password", element: <ChangePasswordPage /> },
      {
         path: "/tutor/profile-page",
         element: (
            <ProtectedTutorProfileRoute>
               <TutorProfile />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/teaching-requests",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <TeachingRequestsList />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/teaching-requests/:id",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <TeachingRequestDetail />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/student-profile/:studentUserId",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <StudentProfileForTutor />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/schedule",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <SchedulePage />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/learning-commitments",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <LearningCommitmentsPage />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/learning-commitment/:commitmentId/sessions",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <SessionByLearningCommitment />
            </ProtectedTutorProfileRoute>
         ),
      },
      // Role-prefixed route for tutor (explicit path)
      {
         path: "/tutor/learning-commitment/:commitmentId/sessions",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <SessionByLearningCommitment />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/createFlashcardQuiz",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <CreateFlashcardQuiz />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/createMultipleChoiceQuiz",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <CreateMultipleChoiceQuiz />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/createShortAnswerQuiz",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <CreateShortAnswerQuiz />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/flashcardList",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <FlashcardQuizList />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/flashcard",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ViewFlashcardQuizQuestion />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/editFlashcard",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <EditFlashcardQuiz />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/rejected-sessions",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <RejectedSessionsPage />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/absence-sessions",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <AbsenceSessionPage />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/MultipleChoiceList",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ViewMultipleQuizList />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/multipleChoice",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ViewMultipleChoiceQuiz />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/editMultipleChoice",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <EditMultipleChoiceQuiz />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/shortAnswerList",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ViewShortAnswerQuizList />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/shortAnswer",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ViewShortAnswerQuiz />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/editShortAnswer",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <EditShortAnswerQuiz />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/review-list",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ReviewList />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/commitments/create",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ProtectedCommitmentRoute>
                  <CreateLearningCommitmentPage />
               </ProtectedCommitmentRoute>
            </ProtectedTutorProfileRoute>
         ),
      },

      {
         path: "/tutor/session/:id",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <SessionDetailPage />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/create-material",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <CreateMaterialPage />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/material-management",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <MaterialManagementPage />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/payment-history",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <PaymentTutorPage />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/studentMCQHistoryList",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ViewStudentMCQHistoryList />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/MCQHistory",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ViewMCQHistory />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/tutor/SAQHistory",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ViewSAQHistory />
            </ProtectedTutorProfileRoute>
         ),
      },
      {
         path: "/chat",
         element: (
            <ProtectedTutorProfileRoute requireApproval={true}>
               <ChatPage />
            </ProtectedTutorProfileRoute>
         ),
      },
   ],
};
