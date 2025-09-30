import { adminRoutes } from "./adminRoutes";
import { studentRoutes } from "./studentRoutes";
import { guestRoutes } from "./guestRoutes";
import { fallbackRoutes } from "./fallbackRoutes";
import { tutorRoutes } from "./tutorRoutes";
import { sharedRoutes } from "./sharedRoutes";

export const routes = [
   guestRoutes,
   // Shared routes must come before role-specific route trees to avoid ranking conflicts
   ...sharedRoutes,
   adminRoutes,
   tutorRoutes,
   studentRoutes,
   ...fallbackRoutes,
];
