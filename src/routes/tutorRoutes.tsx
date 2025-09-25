import ProtectedRoute from "./ProtectedRoute";
import OverviewPage from "../pages/dashboard/OverviewPage";
import JobManage from "@/pages/Employer/JobManage";
import ProfilePage from "@/pages/Profilepage";
import TutorProfile from "@/pages/TutorProfile/TutorProfile";
import TutorLayout from "@/layouts/TutorLayout";
import CreateFlashcardQuiz from "@/pages/Flashcard/CreateFlashcardQuiz";
import FlashcardQuizList from "@/pages/Flashcard/FlashcardQuizList";
import ViewFlashcardQuizQuestion from "@/pages/Flashcard/ViewFlashcardQuizQuestion";

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
   ],
};
