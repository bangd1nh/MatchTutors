import ProtectedRoute from "./ProtectedRoute";
import SessionDetailPage from "@/pages/SessionDetailPage";

export const sharedRoutes = [
   {
      path: "/session/:id",
      element: (
         <ProtectedRoute allowedRoles={["TUTOR", "STUDENT"]}>
            <SessionDetailPage />
         </ProtectedRoute>
      ),
   },
];


