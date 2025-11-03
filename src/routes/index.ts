import { adminRoutes } from "./adminRoutes";
import { studentRoutes } from "./studentRoutes";
import { guestRoutes } from "./guestRoutes";
import { fallbackRoutes } from "./fallbackRoutes";
import { tutorRoutes } from "./tutorRoutes";

export const routes = [
   guestRoutes,
   adminRoutes,
   tutorRoutes,
   studentRoutes,
   ...fallbackRoutes,
];
