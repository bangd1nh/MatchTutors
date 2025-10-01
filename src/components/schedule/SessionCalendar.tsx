import { useState, useMemo, useCallback } from "react";
import {
   Calendar as BigCalendar,
   momentLocalizer,
   Event as BigCalendarEvent,
   Views,
   SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import withDragAndDrop, {
   EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { useMySessions, useUpdateSession } from "@/hooks/useSessions";
import { useUser } from "@/hooks/useUser";
import { Session } from "@/types/session";
import { Role } from "@/types/user";

import { SessionFormDialog } from "./SessionFormDialog";
import { SessionDetailDialog } from "./SessionDetailDialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const localizer = momentLocalizer(moment);

interface CalendarEvent extends BigCalendarEvent {
   resource: Session;
   start: Date;
   end: Date;
}

const DnDCalendar = withDragAndDrop<CalendarEvent>(BigCalendar);

export function SessionCalendar() {
   const { user } = useUser();
   const { data: sessions, isLoading, isError } = useMySessions();
   const updateSessionMutation = useUpdateSession();

   const [selectedSession, setSelectedSession] = useState<Session | null>(null);
   const [isDetailOpen, setIsDetailOpen] = useState(false);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [formInitialData, setFormInitialData] =
      useState<Partial<Session> | null>(null);
   const [defaultDate, setDefaultDate] = useState<Date | undefined>();

   const events: CalendarEvent[] = useMemo(() => {
      return (sessions ?? []).map((session) => {
         const tr = session.teachingRequestId;
         const studentName = tr?.studentId?.userId?.name ?? "Học sinh";
         const subject = tr?.subject ?? "Môn học";

         return {
            title: `${subject} — ${studentName}`,
            start: new Date(session.startTime),
            end: new Date(session.endTime),
            resource: session,
         };
      });
   }, [sessions]);

   // SỬA Ở ĐÂY: Cập nhật chữ ký của hàm để khớp với yêu cầu của onSelectEvent
   const handleSelectEvent = useCallback((event: CalendarEvent) => {
      setSelectedSession(event.resource);
      setIsDetailOpen(true);
   }, []);

   const handleSelectSlot = useCallback(
      (slotInfo: SlotInfo) => {
         if (user?.role !== Role.TUTOR) return;
         setDefaultDate(slotInfo.start as Date);
         setFormInitialData(null);
         setIsFormOpen(true);
      },
      [user]
   );

   const handleEventDrop = useCallback(
      ({ event, start, end }: EventInteractionArgs<CalendarEvent>) => {
         if (user?.role !== Role.TUTOR || !event) return;
         updateSessionMutation.mutate({
            sessionId: event.resource._id,
            payload: {
               startTime: (start as Date).toISOString(),
               endTime: (end as Date).toISOString(),
            },
         });
      },
      [updateSessionMutation, user]
   );

   const handleEventResize = useCallback(
      ({ event, start, end }: EventInteractionArgs<CalendarEvent>) => {
         if (user?.role !== Role.TUTOR || !event) return;
         updateSessionMutation.mutate({
            sessionId: event.resource._id,
            payload: {
               startTime: (start as Date).toISOString(),
               endTime: (end as Date).toISOString(),
            },
         });
      },
      [updateSessionMutation, user]
   );

   const handleEdit = (session: Session) => {
      setIsDetailOpen(false);
      setFormInitialData(session);
      setIsFormOpen(true);
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Đang tải lịch học...</p>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="text-center h-96 text-red-500">
            Lỗi! Không thể tải dữ liệu lịch học. Vui lòng thử lại.
         </div>
      );
   }

   return (
      <div className="p-4 bg-card rounded-lg shadow-md">
         {user?.role === Role.TUTOR && (
            <div className="mb-4">
               <Button onClick={() => setIsFormOpen(true)}>
                  Tạo buổi học mới
               </Button>
            </div>
         )}
         <div className="h-[75vh]">
            <DnDCalendar
               localizer={localizer}
               events={events}
               onSelectEvent={handleSelectEvent}
               onSelectSlot={handleSelectSlot}
               onEventDrop={handleEventDrop}
               onEventResize={handleEventResize}
               selectable={user?.role === Role.TUTOR}
               resizable={user?.role === Role.TUTOR}
               defaultView="week"
               views={Object.values(Views)}
               startAccessor="start"
               endAccessor="end"
               titleAccessor="title"
               style={{ height: "100%" }}
            />
         </div>

         <SessionDetailDialog
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            session={selectedSession}
            onEdit={handleEdit}
         />

         {user?.role === Role.TUTOR && (
            <SessionFormDialog
               isOpen={isFormOpen}
               onClose={() => setIsFormOpen(false)}
               initialData={formInitialData}
               defaultDate={defaultDate}
            />
         )}
      </div>
   );
}
