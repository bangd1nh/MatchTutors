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

import {
   useMySessions,
   useStudentBusySchedules,
   useUpdateSession,
} from "@/hooks/useSessions";
import { useUser } from "@/hooks/useUser";
import { BSession, Session } from "@/types/session";
import { Role } from "@/types/user";
import { SessionStatus } from "@/enums/session.enum";
import {
   getMyPendingSuggestions,
   TutorPendingSuggestion,
} from "@/api/suggestionSchedules";
import { useQuery } from "@tanstack/react-query";

import { SessionFormDialog } from "./SessionFormDialog";
import { SessionDetailDialog } from "./SessionDetailDialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getSubjectLabelVi } from "@/utils/educationDisplay";

// <--- THÊM: Cấu hình mặc định tiếng Việt cho moment
moment.locale("vi");
const localizer = momentLocalizer(moment);

// <--- THÊM: Định nghĩa các từ khóa tiếng Việt cho lịch
const messages = {
   allDay: "Cả ngày",
   previous: "Trước",
   next: "Sau",
   today: "Hôm nay",
   month: "Tháng",
   week: "Tuần",
   day: "Ngày",
   agenda: "Lịch biểu",
   date: "Ngày",
   time: "Thời gian",
   event: "Sự kiện",
   noEventsInRange: "Không có sự kiện nào trong khoảng thời gian này.",
   work_week: "Tuần làm việc",
   showMore: (total: number) => `+${total} sự kiện khác`,
};

interface CalendarEvent extends BigCalendarEvent {
   resource: Session | any;
   start: Date;
   end: Date;
   isBusy?: boolean;
   isPendingSuggestion?: boolean;
   style?: React.CSSProperties;
}

const DnDCalendar = withDragAndDrop<CalendarEvent>(BigCalendar);

export function SessionCalendar() {
   const { user } = useUser();
   const {
      data: sessions,
      isLoading: misLoading,
      isError: misError,
   } = useMySessions();
   const {
      data: bSessions,
      isLoading: bisLoading,
      isError: bisError,
   } = useStudentBusySchedules();
   const updateSessionMutation = useUpdateSession();

   // Lấy tất cả suggestion schedules đang pending của gia sư
   const { data: pendingSuggestions } = useQuery({
      queryKey: ["TUTOR_PENDING_SUGGESTIONS"],
      queryFn: getMyPendingSuggestions,
      enabled: user?.role === Role.TUTOR,
      staleTime: 1000 * 60 * 2, // 2 minutes
   });

   console.log(bSessions);

   const [selectedSession, setSelectedSession] = useState<Session | null>(null);
   const [isDetailOpen, setIsDetailOpen] = useState(false);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [formInitialData, setFormInitialData] =
      useState<Partial<Session> | null>(null);
   const [defaultDate, setDefaultDate] = useState<Date | undefined>();

   const STUDENT_COLOR_PALETTE = [
      "#2563eb",
      "#f97316",
      "#10b981",
      "#8b5cf6",
      "#ef4444",
      "#14b8a6",
      "#f59e0b",
      "#ec4899",
   ];

   const getStudentColor = useCallback(
      (studentId: string) => {
         if (!studentId) return STUDENT_COLOR_PALETTE[0];
         let hash = 0;
         for (let i = 0; i < studentId.length; i++) {
            hash = (hash << 5) - hash + studentId.charCodeAt(i);
            hash |= 0;
         }
         const idx = Math.abs(hash) % STUDENT_COLOR_PALETTE.length;
         return STUDENT_COLOR_PALETTE[idx];
      },
      [STUDENT_COLOR_PALETTE]
   );

   const sessionEvents = useMemo(() => {
      return (sessions ?? []).map((session) => {
         const lc: any = (session as any).learningCommitmentId;
         const studentName =
            (lc?.student?.userId?.name as string) ||
            [lc?.student?.firstName, lc?.student?.lastName]
               .filter(Boolean)
               .join(" ") ||
            "Học sinh";
         console.log("lc", lc);
         const subject = getSubjectLabelVi(
            lc?.teachingRequest?.subject ?? "Môn học"
         );

         // Tùy chỉnh màu sắc theo trạng thái
         let style = {};
         switch (session.status) {
            case SessionStatus.SCHEDULED:
               style = { backgroundColor: "#fbbf24", borderColor: "#f59e0b" }; // Vàng - chờ xác nhận
               break;
            case SessionStatus.CONFIRMED:
               style = { backgroundColor: "#10b981", borderColor: "#059669" }; // Xanh lá - đã xác nhận
               break;
            case SessionStatus.REJECTED:
               style = { backgroundColor: "#ef4444", borderColor: "#dc2626" }; // Đỏ - từ chối
               break;
            case SessionStatus.COMPLETED:
               style = { backgroundColor: "#6b7280", borderColor: "#4b5563" }; // Xám - hoàn thành
               break;
            default:
               style = { backgroundColor: "#3b82f6", borderColor: "#2563eb" }; // Xanh dương - mặc định
         }

         const studentId =
            (lc?.student?._id as string) ||
            (lc?.studentId as string) ||
            (lc?.student?.userId?._id as string) ||
            (lc?.student?.userId?.email as string) ||
            session._id;

         const tutorId =
            (lc?.tutor?._id as string) ||
            (lc?.tutorId as string) ||
            (lc?.tutor?.userId?._id as string) ||
            (lc?.tutor?.userId?.email as string);

         const colorKey =
            user?.role === Role.TUTOR ? studentId : tutorId || studentId;
         const baseColor = getStudentColor(colorKey);
         style = {
            backgroundColor: baseColor,
            borderColor: baseColor,
            color: "#fff",
         };

         return {
            title: `${subject} — ${studentName}`,
            start: new Date(session.startTime),
            end: new Date(session.endTime),
            resource: session,
            style,
         };
      });
   }, [sessions]);

   const busyEvents = useMemo(() => {
      if (!bSessions?.data) return [];
      console.log(bSessions);

      return bSessions.data.map((busy: BSession) => {
         let title = "Bận";

         if (user?.role === Role.TUTOR) {
            const studentName = busy.student?.name || "Học sinh";
            // const otherTutorName = busy.tutor?.name || "Gia sư khác";
            title = `${studentName} bận với gia sư khác`;
         } else if (user?.role === Role.STUDENT) {
            const tutorName = busy.tutor?.name || "Gia sư";
            const otherStudentName = "Học sinh khác";
            title = `${tutorName} bận (${otherStudentName})`;
         }

         return {
            title,
            start: new Date(busy.startTime),
            end: new Date(busy.endTime),
            resource: busy,
            isBusy: true,
         };
      }) as CalendarEvent[];
   }, [bSessions, user?.role]);

   // Tạo events từ pending suggestions của gia sư
   const pendingSuggestionEvents = useMemo(() => {
      if (!pendingSuggestions || user?.role !== Role.TUTOR) return [];

      return pendingSuggestions.flatMap(
         (suggestion: TutorPendingSuggestion) => {
            if (!suggestion.schedules || suggestion.schedules.length === 0)
               return [];

            const studentName = suggestion.student?.name || "Học sinh";
            const subject = suggestion.subject
               ? getSubjectLabelVi(suggestion.subject)
               : suggestion.title || "Lịch đề xuất";

            return suggestion.schedules.map((schedule) => ({
               title: `${subject} — ${studentName} (Chờ phản hồi)`,
               start: new Date(schedule.start),
               end: new Date(schedule.end),
               isPendingSuggestion: true,
               resource: suggestion,
               style: {
                  backgroundColor: "#3b82f6", // Blue for pending suggestions
                  borderColor: "#2563eb",
                  color: "#fff",
                  opacity: 0.8,
               },
            })) as CalendarEvent[];
         }
      );
   }, [pendingSuggestions, user?.role]);

   const events: CalendarEvent[] = useMemo(
      () => [...sessionEvents, ...busyEvents, ...pendingSuggestionEvents],
      [sessionEvents, busyEvents, pendingSuggestionEvents]
   );

   const eventPropGetter = useCallback((event: CalendarEvent) => {
      if (event.isBusy) {
         return {
            style: {
               backgroundColor: "#1f2937",
               borderColor: "#111827",
               opacity: 0.75,
            },
         };
      }
      // Nếu event đã có style (từ pending suggestions), sử dụng style đó
      if (event.style) {
         return { style: event.style };
      }
      return { style: event.style };
   }, []);

   const handleSelectEvent = useCallback((event: CalendarEvent) => {
      if (event.isBusy) return;
      setSelectedSession(event.resource);
      setIsDetailOpen(true);
   }, []);

   const handleSelectSlot = useCallback(
      (slotInfo: SlotInfo) => {
         if (user?.role !== Role.TUTOR) return;
         setDefaultDate(slotInfo.start as Date);
         setFormInitialData({
            startTime: (slotInfo.start as Date).toISOString(),
            endTime: (slotInfo.end as Date).toISOString(),
         });
         setIsFormOpen(true);
      },
      [user]
   );

   const handleEventDrop = useCallback(
      ({ event, start, end }: EventInteractionArgs<CalendarEvent>) => {
         if (event?.isBusy || user?.role !== Role.TUTOR) return;
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
         if (event?.isBusy || user?.role !== Role.TUTOR) return;
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

   if (misLoading || bisLoading) {
      return (
         <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Đang tải lịch học...</p>
         </div>
      );
   }

   if (bisError || misError) {
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
               // <--- THÊM: Truyền prop ngôn ngữ và messages vào đây
               culture="vi"
               messages={messages}
               onSelectEvent={handleSelectEvent}
               onSelectSlot={handleSelectSlot}
               onEventDrop={handleEventDrop}
               onEventResize={handleEventResize}
               eventPropGetter={eventPropGetter}
               draggableAccessor={(event) =>
                  !event.isBusy &&
                  !event.isPendingSuggestion &&
                  user?.role === Role.TUTOR
               }
               resizableAccessor={(event) =>
                  !event.isBusy &&
                  !event.isPendingSuggestion &&
                  user?.role === Role.TUTOR
               }
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
