import MapOverView from "@/pages/MapOverView";
import GuestLayout from "../layouts/GuestLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import EditSession from "@/pages/EditSession";
import ViewQuiz from "@/pages/Quiz/ViewQuiz";
import TutorDetail from "@/pages/Tutor/TutorDetail";
import TutorList from "@/pages/Tutor/TutorList";

export const guestRoutes = {
    element: <GuestLayout />,
    children: [
        { path: "/", element: <LandingPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/map", element: <MapOverView /> },
        { path: "/editSession", element: <EditSession /> },
        { path: "/viewQuizz", element: <ViewQuiz /> },
        { path: "/tutorDetail/:id", element: <TutorDetail /> },
        { path: "/tutorList", element: <TutorList /> },
    ],
};
