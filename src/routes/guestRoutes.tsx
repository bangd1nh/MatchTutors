import MapOverView from "@/pages/MapOverView";
import GuestLayout from "../layouts/GuestLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import EditSession from "@/pages/EditSession";
import TutorSearch from "@/pages/Tutor/TutorSearch";
import TutorDetail from "@/pages/Tutor/TutorDetail";
import ViewQuiz from "@/pages/Quiz/ViewQuiz";


export const guestRoutes = {
    element: <GuestLayout />,
    children: [
        { path: "/", element: <LandingPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/map", element: <MapOverView /> },
        { path: "/editSession", element: <EditSession /> },
        { path: "/tutor-list", element: <TutorSearch /> },
        { path: "/tutor-detail/:id", element: <TutorDetail /> }
        { path: "/viewQuizz", element: <ViewQuiz /> },
    ],
};
