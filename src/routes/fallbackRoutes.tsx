import ForbiddenPage from "../components/common/403Page";
import NotFoundPage from "../components/common/404Page";

export const fallbackRoutes = [
   {
      path: "/unauthorized",
      element: <ForbiddenPage />,
   },
   {
      path: "*",
      element: <NotFoundPage />,
   },
];
