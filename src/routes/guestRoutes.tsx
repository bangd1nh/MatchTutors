import GuestLayout from "../layouts/GuestLayout";
import LandingPage from "../components/landing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";

import TutorSearch from "@/pages/Tutor/TutorSearch";
import TutorDetail from "@/pages/Tutor/TutorDetail";
import ViewQuiz from "@/pages/Quiz/ViewQuiz";
import RegisterPage from "@/pages/auth/RegisterPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";

import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import PricingPage from "@/pages/PricingPage";
import Features from "@/components/common/features";

export const guestRoutes = {
   element: <GuestLayout />,
   children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      // { path: "/application", element: <Application /> }, // Thêm route cho Application
      { path: "/verify-email", element: <VerifyEmailPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },

      { path: "/tutor-list", element: <TutorSearch /> },
      { path: "/tutor-detail/:id", element: <TutorDetail /> },
      { path: "/viewQuizz", element: <ViewQuiz /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/features", element: <Features /> },
   ],
};
