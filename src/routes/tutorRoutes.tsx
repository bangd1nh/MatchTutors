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
import SchedulePage from "@/pages/SchedulePage"; // Import trang mới
// import SessionDetailPage from "@/pages/SessionDetailPage"; // Moved to sharedRoutes

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
         path: "/tutor/schedule", // Thêm route mới
         element: <SchedulePage />,
      },
      {
        // Session detail route moved to sharedRoutes (accessible by both roles)
        // path: "/session/:id",
        // element: <SessionDetailPage />,
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
   ],
};
