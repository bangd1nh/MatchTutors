import { EventProps } from "react-big-calendar";
import { Session } from "@/types/session";
import { Badge } from "../ui/badge";
import { useUser } from "@/hooks/useUser";

interface CalendarEventObject {
   resource: Session;
   title: string;
}

export const CalendarEvent = ({ event }: EventProps<CalendarEventObject>) => {
   const session = event.resource;
   const { user } = useUser();

   const otherPartyName =
      user?.role === "TUTOR"
         ? session.teachingRequestId.studentId.userId.name
         : session.teachingRequestId.tutorId.userId.name;

   return (
      <div className="p-1 text-white text-xs leading-tight">
         <p className="font-bold truncate">{event.title}</p>
         <p className="truncate">{otherPartyName}</p>
         {session.isTrial && (
            <Badge
               variant="secondary"
               className="mt-1 text-black text-[10px] p-0.5 h-auto"
            >
               Thử
            </Badge>
         )}
      </div>
   );
};
