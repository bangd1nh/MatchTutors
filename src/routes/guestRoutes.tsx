import MapOverView from "@/pages/MapOverView";
import GuestLayout from "../layouts/GuestLayout";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import EditSession from "@/pages/EditSession";
import TutorList from "@/pages/Tutor/TutorList";
import TutorDetail from "@/pages/Tutor/TutorDetail";

export const guestRoutes = {
    element: <GuestLayout />,
    children: [
        { path: "/", element: <LandingPage /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/map", element: <MapOverView /> },
        { path: "/editSession", element: <EditSession /> },
        { path: "/tutor-list", element: <TutorList /> },
        { path: "/tutor-detail/:id", element: <TutorDetail /> }
    ],
};
