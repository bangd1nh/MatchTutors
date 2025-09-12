import MapOverView from "@/pages/MapOverView";
import GuestLayout from "../layouts/GuestLayout";
import LandingPage from "../components/landing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import EditSession from "@/pages/EditSession";
import TutorSearch from "@/pages/Tutor/TutorSearch";
import TutorDetail from "@/pages/Tutor/TutorDetail";
import TutorProfileForm from "@/pages/TutorProfile/TutorProfileForm";
import ViewQuiz from "@/pages/Quiz/ViewQuiz";
import RegisterPage from "@/pages/auth/RegisterPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";
import Application from "@/pages/Jobseeker/Application";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

export const guestRoutes = {
        element: <GuestLayout />,
        children: [
                { path: "/", element: <LandingPage /> },
                { path: "/login", element: <LoginPage /> },
                { path: "/register", element: <RegisterPage /> },
                { path: "/application", element: <Application /> }, // Thêm route cho Application
                { path: "/verify-email", element: <VerifyEmailPage /> },
                { path: "/forgot-password", element: <ForgotPasswordPage /> },
                { path: "/reset-password", element: <ResetPasswordPage /> },
                { path: "/map", element: <MapOverView /> },
                { path: "/editSession", element: <EditSession /> },
                { path: "/tutor-list", element: <TutorSearch /> },
                { path: "/tutor-detail/:id", element: <TutorDetail /> },
                { path: "/viewQuizz", element: <ViewQuiz /> },
        ],
};
