import ProtectedRoute from "./ProtectedRoute";
import OverviewPage from "../pages/dashboard/OverviewPage";
import JobManage from "@/pages/Employer/JobManage";
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
import ChatPage from "@/pages/chat/chatPage";

export const tutorRoutes = {
   element: (
      <ProtectedRoute allowedRoles={["TUTOR"]}>
         <TutorLayout />
      </ProtectedRoute>
   ),
   children: [
      { path: "/tutor/dashboard", element: <OverviewPage /> },
      { path: "/tutor/profile", element: <ProfilePage /> },
      { path: "/tutor/profile-page", element: <TutorProfile /> },
      { path: "/tutor/create-profile", element: <TutorProfilePage /> },
      { path: "/tutor/teaching-requests", element: <TeachingRequestsList /> },
      {
         path: "/tutor/teaching-requests/:id",
         element: <TeachingRequestDetail />,
      },
      {
         path: "/tutor/student-profile/:studentUserId",
         element: <StudentProfileForTutor />,
      },
      {
         path: "/tutor/schedule",
         element: <SchedulePage />,
      },
      {
         path: "/tutor/learning-commitments",
         element: <LearningCommitmentsPage />,
      },
      {
         path: "/tutor/jobs",
         element: <JobManage />,
      },
      {
         path: "/tutor/createFlashcardQuiz",
         element: <CreateFlashcardQuiz />,
      },
      {
         path: "/tutor/createMultipleChoiceQuiz",
         element: <CreateMultipleChoiceQuiz />,
      },
      {
         path: "/tutor/createShortAnswerQuiz",
         element: <CreateShortAnswerQuiz />,
      },
      {
         path: "/tutor/flashcardList",
         element: <FlashcardQuizList />,
      },
      {
         path: "/tutor/flashcard",
         element: <ViewFlashcardQuizQuestion />,
      },
      {
         path: "/tutor/editFlashcard",
         element: <EditFlashcardQuiz />,
      },
      {
         path: "/tutor/rejected-sessions",
         element: <RejectedSessionsPage />,
      },
      {
         path: "/tutor/absence-sessions",
         element: <AbsenceSessionPage />,
      },
      {
         path: "/tutor/MultipleChoiceList",
         element: <ViewMultipleQuizList />,
      },
      {
         path: "/tutor/multipleChoice",
         element: <ViewMultipleChoiceQuiz />,
      },
      {
         path: "/tutor/editMultipleChoice",
         element: <EditMultipleChoiceQuiz />,
      },
      {
         path: "/tutor/shortAnswerList",
         element: <ViewShortAnswerQuizList />,
      },
      {
         path: "/tutor/shortAnswer",
         element: <ViewShortAnswerQuiz />,
      },
      {
         path: "/tutor/editShortAnswer",
         element: <EditShortAnswerQuiz />,
      },
      {
         path: "/tutor/review-list",
         element: <ReviewList />,
      },
      {
         path: "/tutor/commitments/create",
         element: <CreateLearningCommitmentPage />,
      },
      {
         path: "/tutor/wallet",
         element: <WalletManagement />,
      },
      {
         path: "/tutor/session/:id",
         element: <SessionDetailPage />,
      },
      {
         path: "/tutor/create-material",
         element: <CreateMaterialPage />,
      },
      {
         path: "/tutor/material-management",
         element: <MaterialManagementPage />,
      },
      {
         path: "/tutor/studentMCQHistoryList",
         element: <ViewStudentMCQHistoryList />,
      },
      {
         path: "/tutor/MCQHistory",
         element: <ViewMCQHistory />,
      },
      {
         path: "/chat",
         element: <ChatPage />,
      },
   ],
};
