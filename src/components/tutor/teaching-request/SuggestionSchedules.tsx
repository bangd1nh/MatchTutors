import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop, {
   EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import {
   Calendar as BigCalendar,
   Event as BigCalendarEvent,
   momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "../../ui/dialog";
import {
   BookOpen,
   Trash2,
   Edit,
   CheckCircle,
   XCircle,
   Clock,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Role } from "@/enums/role.enum";
import { useCalendarEventStore } from "@/store/useCalendarEventStore";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { useSSchedules } from "@/hooks/useSSchedules";
import { useToast } from "@/hooks/useToast";
import { useMySessions } from "@/hooks/useSessions";
import { getSubjectLabelVi } from "@/utils/educationDisplay";

type Props = {
   onClose: () => void;
   isOpen: boolean;
   TRId: string;
};
interface CalendarEvent extends BigCalendarEvent {
   start: Date;
   end: Date;
   isBusy?: boolean;
   isMainSchedule?: boolean;
   isStudentSession?: boolean; // NEW: student’s scheduled session
   style?: React.CSSProperties;
}

moment.locale("vi");
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<CalendarEvent>(BigCalendar);

function SuggestionSchedules({ isOpen, onClose, TRId }: Props) {
   const { user } = useUser();
   const addToast = useToast();
   const {
      events,
      setEvents,
      addEvent,
      setChange,
      getEvents,
      setTitle,
      setTeachingRequestId,
      getTitle,
      setProposedTotalPrice,
      getProposedTotalPrice,
      removeEvent,
   } = useCalendarEventStore();
   const { createSSchedules, fetchSSchedules, updateSSchedules } =
      useSSchedules(TRId);
   // Lấy lịch chính của gia sư (các sessions đã lên lịch)
   const { data: tutorSessions } = useMySessions();
   const initializedRef = useRef(false);
   const isCreatingNewRef = useRef(false); // Flag để track đang tạo mới
   const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
   const [isEditMode, setIsEditMode] = useState(false); // Chế độ view/edit
   const [isCreatingNew, setIsCreatingNew] = useState(false); // State để track đang tạo mới (trigger re-render)
   const [shouldLoadSuggestion, setShouldLoadSuggestion] = useState(false); // Flag để track người dùng muốn xem suggestion

   // bulk modal state
   const [showBulkModal, setShowBulkModal] = useState(false);
   // Tính ngày tối thiểu (ngày mai) để chỉ cho phép chọn ngày lớn hơn hôm nay
   const minDate = moment().add(1, "day").format("YYYY-MM-DD");
   const [startDateTime, setStartDateTime] = useState(
      moment().add(1, "day").format("YYYY-MM-DD")
   );
   const [startTime] = useState("09:00");
   const [endTime] = useState("11:00");
   const [repeatMode, setRepeatMode] = useState<"count" | "until">("count");
   const [totalSessions, setTotalSessions] = useState(5);
   const [untilDate, setUntilDate] = useState(
      moment().add(3, "week").format("YYYY-MM-DD")
   );
   const [weekdays, setWeekdays] = useState<number[]>([1, 3]);
   const [weekdayTimes, setWeekdayTimes] = useState<
      Record<number, { start: string; end: string }>
   >({
      1: { start: "09:00", end: "11:00" },
      3: { start: "14:00", end: "16:00" },
   });

   // Xác định chế độ view/edit dựa trên suggestion status
   const suggestion = fetchSSchedules.data?.data;

   const isViewMode = useMemo(() => {
      // Nếu đang tạo mới, không phải view mode
      if (isCreatingNew) return false;
      if (!suggestion || !suggestion._id) return false;
      // Nếu đang ở chế độ edit, không phải view mode
      if (isEditMode) return false;
      // View mode nếu: PENDING hoặc ACCEPTED
      const status = suggestion.status || suggestion.studentResponse?.status;
      return status === "PENDING" || status === "ACCEPTED";
   }, [suggestion, isEditMode, isCreatingNew]);

   useEffect(() => {
      const res = fetchSSchedules.data?.data;

      // Nếu đang tạo mới (đã xóa tất cả), không load dữ liệu cũ
      if (isCreatingNewRef.current) {
         return;
      }

      // Nếu không có response hoặc response là null
      if (!res) {
         // Nếu không có suggestion, để trống để tạo mới
         setEvents([]);
         setTitle("lịch đề xuất");
         setTeachingRequestId(TRId);
         setProposedTotalPrice(0);
         setIsEditMode(false);
         return;
      }

      // Nếu res là object rỗng (không có suggestion nhưng có studentBusySchedules)
      // vẫn tiếp tục để busy events được hiển thị
      if (!res._id && !res.schedules) {
         setEvents([]);
         setTitle("lịch đề xuất");
         setTeachingRequestId(TRId);
         setProposedTotalPrice(0);
         setIsEditMode(false);
         return;
      }

      // CHỈ load dữ liệu suggestion vào calendar khi người dùng chủ động muốn xem/edit
      // KHÔNG tự động load khi mở dialog lần đầu
      if (shouldLoadSuggestion && (isEditMode || isViewMode)) {
         setTitle(res.title || "lịch đề xuất");
         setTeachingRequestId(res.teachingRequestId || TRId);
         if (res.proposedTotalPrice) {
            setProposedTotalPrice(res.proposedTotalPrice);
         }

         // gán các event trả về vào calendar
         setEvents(
            (res.schedules || []).map((s) => ({
               start: new Date(s.start),
               end: new Date(s.end),
               resource: { _id: (s as any)._id || (s as any).id }, // ensure identifiable
            }))
         );
      } else {
         // Nếu người dùng chưa chủ động muốn xem, để trống để tạo mới
         setEvents([]);
         setTitle("lịch đề xuất");
         setTeachingRequestId(TRId);
         setProposedTotalPrice(0);
      }
      setSelectedEventId(null);
   }, [
      fetchSSchedules.data,
      setEvents,
      setTeachingRequestId,
      setTitle,
      setProposedTotalPrice,
      TRId,
      isEditMode,
      isViewMode,
      shouldLoadSuggestion, // <— add this
   ]);

   // Tạo busy events từ studentBusySchedules và studentBusySessions (chỉ hiển thị khi gia sư xem)
   const busyEvents = useMemo(() => {
      const res = fetchSSchedules.data?.data;
      if (!res || user?.role !== Role.TUTOR) return [];

      const busyEventsList: CalendarEvent[] = [];

      // Thêm busy events từ suggestions (PENDING với gia sư khác)
      if (res.studentBusySchedules && res.studentBusySchedules.length > 0) {
         res.studentBusySchedules.forEach((busySchedule) => {
            busySchedule.schedules.forEach((schedule) => {
               busyEventsList.push({
                  title: `Học sinh bận Gia sư khác
                  `,
                  start: new Date(schedule.start),
                  end: new Date(schedule.end),
                  isBusy: true,
                  resource: busySchedule,
               });
            });
         });
      }

      // Thêm busy events từ sessions (SCHEDULED/CONFIRMED với gia sư khác)
      if (res.studentBusySessions && res.studentBusySessions.length > 0) {
         res.studentBusySessions.forEach((busySession) => {
            busyEventsList.push({
               title: `Học sinh bận Gia sư khác`,
               start: new Date(busySession.startTime),
               end: new Date(busySession.endTime),
               isBusy: true,
               resource: busySession,
            });
         });
      }

      return busyEventsList;
   }, [fetchSSchedules.data?.data, user?.role]);

   // Tạo events từ lịch chính của gia sư (các sessions đã lên lịch)
   const tutorMainScheduleEvents = useMemo(() => {
      if (!tutorSessions || user?.role !== Role.TUTOR) return [];

      return tutorSessions
         .filter(
            (session) =>
               session.status === "SCHEDULED" || session.status === "CONFIRMED"
         )
         .map((session) => {
            const lc: any = (session as any).learningCommitmentId;
            const studentName =
               lc?.student?.userId?.name || lc?.student?.name || "Học sinh";
            const subjectRaw = lc?.teachingRequest?.subject || "Môn học";
            const subject = getSubjectLabelVi(subjectRaw);

            return {
               title: `${subject} — ${studentName}`,
               start: new Date(session.startTime),
               end: new Date(session.endTime),
               isBusy: false,
               isMainSchedule: true, // Đánh dấu là lịch chính
               resource: session,
               style: {
                  backgroundColor: "#10b981", // Green for main schedule
                  borderColor: "#059669",
                  color: "#fff",
                  opacity: 0.8,
               },
            } as CalendarEvent;
         });
   }, [tutorSessions, user?.role]);

   // Kết hợp suggestion events với busy events và lịch chính của gia sư
   const calendarEvents = useMemo(() => {
      const suggestionEvents = (events || []).map((event) => ({
         ...event,
         title: event.title || "Buổi học",
      }));
      return [...suggestionEvents, ...busyEvents, ...tutorMainScheduleEvents];
   }, [events, busyEvents, tutorMainScheduleEvents]);

   // Reset flag khi dialog đóng
   useEffect(() => {
      if (!isOpen) {
         isCreatingNewRef.current = false;
         setIsEditMode(false);
         setIsCreatingNew(false);
         setShouldLoadSuggestion(false); // Reset flag khi đóng dialog
         setSelectedEventId(null);
      }
   }, [isOpen]);

   // Hàm để lấy status badge
   const getStatusBadge = () => {
      if (!suggestion || !suggestion._id) return null;

      const status = suggestion.status || suggestion.studentResponse?.status;
      if (status === "ACCEPTED") {
         return (
            <Badge className="bg-green-500 text-white">
               <CheckCircle className="h-3 w-3 mr-1" />
               Đã đồng ý
            </Badge>
         );
      }
      if (status === "REJECTED") {
         return (
            <Badge variant="destructive">
               <XCircle className="h-3 w-3 mr-1" />
               Đã từ chối
            </Badge>
         );
      }
      return (
         <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Chờ phản hồi
         </Badge>
      );
   };

   // Hàm xử lý chỉnh sửa
   const handleEdit = () => {
      setShouldLoadSuggestion(true); // Đánh dấu người dùng muốn xem suggestion
      setIsEditMode(true);
      isCreatingNewRef.current = false;
      setIsCreatingNew(false);
   };

   // Hàm xử lý xem suggestion (khi suggestion đang PENDING)
   const handleViewSuggestion = () => {
      setShouldLoadSuggestion(true); // Đánh dấu người dùng muốn xem suggestion
      setIsEditMode(false);
   };

   // Hàm validate lịch học
   const validateSchedules = (
      schedules: Array<{ start: Date; end: Date }>
   ): string | null => {
      if (schedules.length === 0) {
         return "Vui lòng thêm ít nhất một buổi học";
      }

      const now = new Date();
      now.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00 để so sánh ngày

      // Kiểm tra tất cả các buổi học phải có ngày bắt đầu lớn hơn ngày hiện tại
      for (const schedule of schedules) {
         const startDate = new Date(schedule.start);
         startDate.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00

         if (startDate <= now) {
            const formattedDate = moment(startDate).format("DD/MM/YYYY");
            return `Ngày bắt đầu phải lớn hơn ngày hiện tại. Buổi học ngày ${formattedDate} không hợp lệ.`;
         }
      }

      return null;
   };

   // Hàm xử lý lưu khi update
   const handleSaveUpdate = () => {
      if (!suggestion?._id) return;

      const eventsData = getEvents();

      // Validate số lượng buổi học
      if (eventsData.schedules.length === 0) {
         addToast("error", "Vui lòng thêm ít nhất một buổi học");
         return;
      }

      // Validate giá đề xuất
      if (
         !eventsData.proposedTotalPrice ||
         eventsData.proposedTotalPrice <= 0
      ) {
         addToast("error", "Vui lòng nhập giá đề xuất hợp lệ");
         return;
      }

      // Validate ngày bắt đầu
      const validationError = validateSchedules(eventsData.schedules);
      if (validationError) {
         addToast("error", validationError);
         return;
      }

      updateSSchedules.mutate(
         {
            suggestionId: suggestion._id,
            payload: eventsData,
         },
         {
            onSuccess: () => {
               setIsEditMode(false);
               fetchSSchedules.refetch();
            },
         }
      );
   };

   const toggleWeekday = (day: number) => {
      setWeekdays((prev) => {
         const next = prev.includes(day)
            ? prev.filter((d) => d !== day)
            : [...prev, day];
         if (!weekdayTimes[day]) {
            setWeekdayTimes((t) => ({
               ...t,
               [day]: { start: startTime, end: endTime },
            }));
         }
         return next;
      });
   };

   const updateWeekdayTime = (
      day: number,
      field: "start" | "end",
      value: string
   ) => {
      setWeekdayTimes((t) => ({
         ...t,
         [day]: {
            ...(t[day] ?? { start: startTime, end: endTime }),
            [field]: value,
         },
      }));
   };

   const handleBulkCreate = () => {
      if (weekdays.length === 0) {
         addToast("error", "Vui lòng chọn ít nhất một ngày trong tuần");
         return;
      }
      const baseDate = moment(startDateTime, "YYYY-MM-DD");
      if (!baseDate.isValid()) {
         addToast("error", "Ngày bắt đầu không hợp lệ");
         return;
      }
      // Validate ngày bắt đầu phải lớn hơn ngày hiện tại
      const today = moment().startOf("day");
      const selectedDate = baseDate.startOf("day");
      if (selectedDate.isSameOrBefore(today)) {
         addToast("error", "Ngày bắt đầu phải lớn hơn ngày hiện tại");
         return;
      }

      let created = 0;
      const maxIterations = 200;
      let cursor = baseDate.clone().startOf("week");
      const endLimit =
         repeatMode === "until"
            ? moment(untilDate, "YYYY-MM-DD").endOf("day")
            : baseDate.clone().add(52, "week");

      let stop = false;

      for (let i = 0; i < maxIterations && !stop; i++) {
         for (const day of weekdays.sort()) {
            const times = weekdayTimes[day];
            const startStr = times?.start ?? startTime;
            const endStr = times?.end ?? endTime;

            const startMomentOfDay = moment(startStr, "HH:mm");
            const endMomentOfDay = moment(endStr, "HH:mm");
            if (!startMomentOfDay.isValid() || !endMomentOfDay.isValid())
               continue;
            if (endMomentOfDay.isSameOrBefore(startMomentOfDay)) continue;

            const eventStart = cursor.clone().day(day);
            if (eventStart.isBefore(baseDate)) continue;

            eventStart
               .hour(startMomentOfDay.hour())
               .minute(startMomentOfDay.minute())
               .second(0);
            const eventEnd = eventStart
               .clone()
               .hour(endMomentOfDay.hour())
               .minute(endMomentOfDay.minute())
               .second(0);

            addEvent({
               start: eventStart.toDate(),
               end: eventEnd.toDate(),
               resource: { _id: `bulk-${Date.now()}-${created}` }, // ensure removable
            });
            created += 1;
            if (repeatMode === "count" && created >= totalSessions) {
               stop = true;
               break;
            }
            if (repeatMode === "until" && eventStart.isAfter(endLimit)) {
               stop = true;
               break;
            }
         }
         cursor.add(1, "week");
         if (repeatMode === "until" && cursor.isAfter(endLimit)) break;
      }

      setTeachingRequestId(TRId);

      setShowBulkModal(false);

      console.log(getEvents());
   };

   const seedEvents = useMemo(() => [], []);

   useEffect(() => {
      if (!initializedRef.current) {
         setEvents(seedEvents);
         initializedRef.current = true;
      }
   }, [setEvents, seedEvents]);

   const handleEventDrop = useCallback(
      ({ event, start, end }: EventInteractionArgs<CalendarEvent>) => {
         if (
            event?.isBusy ||
            event?.isMainSchedule ||
            user?.role !== Role.TUTOR ||
            isViewMode
         )
            return;
         const eventId = event.resource?._id;
         const updatedEvents = events.map((ev) =>
            ev.resource?._id === eventId
               ? { ...ev, start: start as Date, end: end as Date }
               : ev
         );
         setEvents(updatedEvents);
         setChange({
            type: "drop",
            sessionId: eventId,
            startTime: (start as Date).toISOString(),
            endTime: (end as Date).toISOString(),
         });
      },
      [user, isViewMode, setEvents, setChange, events]
   );

   const handleEventResize = useCallback(
      ({ event, start, end }: EventInteractionArgs<CalendarEvent>) => {
         if (
            event?.isBusy ||
            event?.isMainSchedule ||
            user?.role !== Role.TUTOR ||
            isViewMode
         )
            return;
         const eventId = event.resource?._id;
         const updatedEvents = events.map((ev) =>
            ev.resource?._id === eventId
               ? { ...ev, start: start as Date, end: end as Date }
               : ev
         );
         setEvents(updatedEvents);
         setChange({
            type: "resize",
            sessionId: eventId,
            startTime: (start as Date).toISOString(),
            endTime: (end as Date).toISOString(),
         });
      },
      [user, isViewMode, setEvents, setChange, events]
   );

   const handleSelectEvent = useCallback(
      (event: CalendarEvent) => {
         if (event.isBusy || event.isMainSchedule) return;
         if (isViewMode || user?.role !== Role.TUTOR) return;
         const id =
            event.resource?._id ||
            (typeof (event as any).id === "string"
               ? (event as any).id
               : undefined);
         setSelectedEventId(id || null);
         setChange({
            type: "selectEvent",
            sessionId: id,
            startTime: (event.start as Date).toISOString(),
            endTime: (event.end as Date).toISOString(),
         });
      },
      [isViewMode, user?.role, setChange]
   );

   const handleSelectSlot = useCallback(
      ({ start, end }: { start: Date; end: Date }) => {
         if (user?.role !== Role.TUTOR || isViewMode) return;
         const newId = `slot-${Date.now()}`;
         const newEvent = {
            title: "Buổi mới",
            start: start as Date,
            end: end as Date,
            resource: { _id: newId },
         };
         addEvent(newEvent);
         setSelectedEventId(newId);
         setChange({
            type: "selectSlot",
            sessionId: newId,
            startTime: (start as Date).toISOString(),
            endTime: (end as Date).toISOString(),
         });
      },
      [addEvent, setChange, user?.role, isViewMode]
   );

   const eventPropGetter = useCallback(
      (event: CalendarEvent) => {
         const base =
            event.style ||
            (event.isBusy
               ? {
                    backgroundColor: "#1f2937",
                    borderColor: "#111827",
                    opacity: 0.75,
                    cursor: "not-allowed",
                 }
               : {});
         const isSelected =
            selectedEventId && event.resource?._id === selectedEventId;
         return {
            style: {
               ...base,
               cursor:
                  event.isBusy ||
                  event.isMainSchedule ||
                  isViewMode ||
                  event.isStudentSession
                     ? "not-allowed"
                     : "pointer",
               boxShadow: isSelected ? "0 0 0 2px #2563eb" : base.boxShadow,
            },
         };
      },
      [selectedEventId, isViewMode]
   );

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

   if (fetchSSchedules.isLoading) {
      return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
               <DialogHeader>
                  <DialogTitle>Lịch gợi ý</DialogTitle>
                  <DialogDescription>Đang tải lịch gợi ý...</DialogDescription>
               </DialogHeader>
            </DialogContent>
         </Dialog>
      );
   }

   if (fetchSSchedules.isError) {
      return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
               <DialogHeader>
                  <DialogTitle>Lịch gợi ý</DialogTitle>
                  <DialogDescription>
                     Tải lịch gợi ý thất bại. Vui lòng thử lại.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => fetchSSchedules.refetch()}
                  >
                     Thử lại
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <>
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl w-[95vw] h-[80vh] p-0 sm:p-6 flex flex-col gap-4">
               <DialogHeader className="px-6 pt-6">
                  <DialogTitle className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Lịch gợi ý
                     </div>
                     <div className="flex items-center gap-3">
                        {/* Hiển thị status badge nếu có suggestion */}
                        {suggestion && suggestion._id && getStatusBadge()}
                        {/* Nút xem lịch đề xuất khi PENDING và chưa load */}
                        {suggestion &&
                           suggestion._id &&
                           (suggestion.status === "PENDING" ||
                              suggestion.studentResponse?.status ===
                                 "PENDING") &&
                           !shouldLoadSuggestion &&
                           !isEditMode && (
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={handleViewSuggestion}
                              >
                                 <BookOpen className="h-4 w-4 mr-2" />
                                 Xem lịch đề xuất
                              </Button>
                           )}
                        {/* Nút chỉnh sửa khi REJECTED và đang ở view mode */}
                        {suggestion &&
                           suggestion._id &&
                           (suggestion.status === "REJECTED" ||
                              suggestion.studentResponse?.status ===
                                 "REJECTED") &&
                           !isEditMode && (
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={handleEdit}
                              >
                                 <Edit className="h-4 w-4 mr-2" />
                                 Chỉnh sửa
                              </Button>
                           )}
                        {/* Nút đặt lại lịch khi ACCEPTED (cho phép rebook khi commitment đã completed) */}
                        {suggestion &&
                           suggestion._id &&
                           (suggestion.status === "ACCEPTED" ||
                              suggestion.studentResponse?.status ===
                                 "ACCEPTED") &&
                           !isEditMode && (
                              <Button
                                 size="sm"
                                 variant="default"
                                 onClick={() => {
                                    // Xóa tất cả events và cho phép tạo lịch mới
                                    setEvents([]);
                                    setTitle("lịch đề xuất");
                                    setProposedTotalPrice(0);
                                    setIsEditMode(false);
                                    setIsCreatingNew(true);
                                    isCreatingNewRef.current = true;
                                    setShouldLoadSuggestion(false); // Không load suggestion cũ
                                 }}
                              >
                                 <BookOpen className="h-4 w-4 mr-2" />
                                 Đặt lại lịch
                              </Button>
                           )}
                        <Badge variant="secondary" className="px-3">
                           Tuần này
                        </Badge>
                        {!isViewMode && (
                           <div className="flex items-center gap-2">
                              <Input
                                 type="number"
                                 min="0"
                                 step="1000"
                                 placeholder="Tổng giá"
                                 value={getProposedTotalPrice() || ""}
                                 onChange={(e) =>
                                    setProposedTotalPrice(
                                       Number(e.target.value) || 0
                                    )
                                 }
                                 className="w-32 h-9"
                              />
                              <span className="text-xs text-muted-foreground">
                                 VNĐ
                              </span>
                           </div>
                        )}
                        {isViewMode && suggestion?.proposedTotalPrice && (
                           <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                 Giá đề xuất:{" "}
                                 {suggestion.proposedTotalPrice.toLocaleString(
                                    "vi-VN"
                                 )}{" "}
                                 VNĐ
                              </span>
                           </div>
                        )}
                        {!isViewMode && (
                           <>
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => setShowBulkModal(true)}
                              >
                                 Tạo nhiều buổi
                              </Button>
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => {
                                    setEvents([]);
                                    setTitle("lịch đề xuất");
                                    setProposedTotalPrice(0);
                                    isCreatingNewRef.current = true;
                                    setIsCreatingNew(true);
                                    setSelectedEventId(null);
                                 }}
                              >
                                 <Trash2 className="h-4 w-4 mr-2" />
                                 Xóa tất cả
                              </Button>
                              <Button
                                 size="sm"
                                 variant="destructive"
                                 disabled={!selectedEventId}
                                 onClick={() => {
                                    if (!selectedEventId) return;
                                    removeEvent(selectedEventId);
                                    setChange({
                                       type: "remove",
                                       sessionId: selectedEventId,
                                    });
                                    setSelectedEventId(null);
                                 }}
                              >
                                 Xóa buổi
                              </Button>
                           </>
                        )}
                        {/* Hiển thị nút lưu khác nhau tùy vào chế độ */}
                        {isEditMode && suggestion?._id ? (
                           <>
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => {
                                    setIsEditMode(false);
                                    // Reset về dữ liệu gốc
                                    if (suggestion) {
                                       setTitle(
                                          suggestion.title || "lịch đề xuất"
                                       );
                                       setTeachingRequestId(
                                          suggestion.teachingRequestId || TRId
                                       );
                                       if (suggestion.proposedTotalPrice) {
                                          setProposedTotalPrice(
                                             suggestion.proposedTotalPrice
                                          );
                                       }
                                       setEvents(
                                          (suggestion.schedules || []).map(
                                             (s: any) => ({
                                                start: new Date(s.start),
                                                end: new Date(s.end),
                                             })
                                          )
                                       );
                                    }
                                 }}
                              >
                                 Hủy
                              </Button>
                              <Button
                                 size="sm"
                                 variant="default"
                                 onClick={handleSaveUpdate}
                                 disabled={updateSSchedules.isPending}
                              >
                                 {updateSSchedules.isPending
                                    ? "Đang lưu..."
                                    : "Lưu chỉnh sửa"}
                              </Button>
                           </>
                        ) : !isViewMode ? (
                           <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                 const events = getEvents();

                                 // Validate số lượng buổi học
                                 if (events.schedules.length === 0) {
                                    addToast(
                                       "error",
                                       "Vui lòng thêm ít nhất một buổi học"
                                    );
                                    return;
                                 }

                                 // Validate giá đề xuất
                                 if (
                                    !events.proposedTotalPrice ||
                                    events.proposedTotalPrice <= 0
                                 ) {
                                    addToast(
                                       "error",
                                       "Vui lòng nhập giá đề xuất hợp lệ"
                                    );
                                    return;
                                 }

                                 // Validate ngày bắt đầu
                                 const validationError = validateSchedules(
                                    events.schedules
                                 );
                                 if (validationError) {
                                    addToast("error", validationError);
                                    return;
                                 }

                                 createSSchedules.mutate(events, {
                                    onSuccess: () => {
                                       isCreatingNewRef.current = false; // Reset flag sau khi lưu thành công
                                       setIsCreatingNew(false); // Reset state sau khi lưu thành công
                                       fetchSSchedules.refetch();
                                    },
                                 });
                              }}
                           >
                              Lưu lịch đề xuất
                           </Button>
                        ) : null}
                     </div>
                  </DialogTitle>
                  {/* Hiển thị lý do từ chối nếu học sinh đã từ chối */}
                  {suggestion?.studentResponse?.status === "REJECTED" &&
                     suggestion?.studentResponse?.reason && (
                        <DialogDescription className="px-6">
                           <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-2">
                              <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                                 Lý do từ chối từ học sinh:
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400">
                                 {suggestion.studentResponse.reason}
                              </p>
                           </div>
                        </DialogDescription>
                     )}
               </DialogHeader>

               <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 pb-6 overflow-hidden">
                  {/* Legend cho các loại events */}
                  <div className="mb-4 flex flex-wrap gap-4 text-sm bg-muted/50 p-3 rounded-lg flex-shrink-0">
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-500"></div>
                        <span>Lịch đề xuất</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500"></div>
                        <span>Lịch chính (đã lên lịch)</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-700"></div>
                        <span>Học sinh bận</span>
                     </div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                     <DnDCalendar
                        events={calendarEvents}
                        localizer={localizer}
                        culture="vi"
                        messages={messages}
                        onEventDrop={handleEventDrop}
                        onEventResize={handleEventResize}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        eventPropGetter={eventPropGetter}
                        draggableAccessor={(event) =>
                           !event.isBusy &&
                           !event.isMainSchedule &&
                           user?.role === Role.TUTOR &&
                           !isViewMode
                        }
                        resizableAccessor={(event) =>
                           !event.isBusy &&
                           !event.isMainSchedule &&
                           user?.role === Role.TUTOR &&
                           !isViewMode
                        }
                        selectable={user?.role === Role.TUTOR && !isViewMode}
                        resizable={user?.role === Role.TUTOR && !isViewMode}
                        defaultView="week"
                        startAccessor="start"
                        endAccessor="end"
                        titleAccessor="title"
                        style={{ height: "100%" }}
                     />
                  </div>
               </div>
            </DialogContent>
         </Dialog>

         <Dialog open={showBulkModal} onOpenChange={setShowBulkModal}>
            <DialogContent className="max-w-5xl">
               <DialogHeader>
                  <DialogTitle>Tạo nhiều buổi học</DialogTitle>
                  <DialogDescription>
                     Chọn ngày bắt đầu, giờ bắt đầu và giờ kết thúc cho mỗi
                     buổi.
                  </DialogDescription>
               </DialogHeader>

               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-5">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">
                           Ngày bắt đầu
                        </label>
                        <Input
                           type="date"
                           value={startDateTime}
                           min={minDate}
                           onChange={(e) => {
                              const selectedDate = moment(
                                 e.target.value,
                                 "YYYY-MM-DD"
                              );
                              const today = moment().startOf("day");
                              if (selectedDate.isSameOrBefore(today)) {
                                 addToast(
                                    "error",
                                    "Ngày bắt đầu phải lớn hơn ngày hiện tại"
                                 );
                                 return;
                              }
                              setStartDateTime(e.target.value);
                           }}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">
                           mô tả lịch
                        </label>
                        <Input
                           type="text"
                           value={getTitle()}
                           onChange={(e) => setTitle(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium">Lặp theo thứ</label>
                     <div className="border rounded-lg p-3 bg-muted/30">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto overflow-x-hidden pr-2">
                           {[0, 1, 2, 3, 4, 5, 6].map((d) => {
                              const times = weekdayTimes[d] ?? {
                                 start: startTime,
                                 end: endTime,
                              };
                              return (
                                 <div
                                    key={d}
                                    className="border rounded-lg px-2 py-2 space-y-2 hover:border-primary/50 transition-colors bg-background flex-shrink-0"
                                 >
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                       <Checkbox
                                          checked={weekdays.includes(d)}
                                          onCheckedChange={() =>
                                             toggleWeekday(d)
                                          }
                                          className="h-3.5 w-3.5 flex-shrink-0"
                                       />
                                       <span className="font-medium text-xs whitespace-nowrap">
                                          {moment().day(d).format("ddd")}
                                       </span>
                                    </label>
                                    {weekdays.includes(d) && (
                                       <div className="flex gap-1 w-full">
                                          <Input
                                             type="time"
                                             value={times.start}
                                             onChange={(e) =>
                                                updateWeekdayTime(
                                                   d,
                                                   "start",
                                                   e.target.value
                                                )
                                             }
                                             className="flex-1 text-xs h-7 px-1.5 min-w-0"
                                             title="Giờ bắt đầu"
                                          />
                                          <Input
                                             type="time"
                                             value={times.end}
                                             onChange={(e) =>
                                                updateWeekdayTime(
                                                   d,
                                                   "end",
                                                   e.target.value
                                                )
                                             }
                                             className="flex-1 text-xs h-7 px-1.5 min-w-0"
                                             title="Giờ kết thúc"
                                          />
                                       </div>
                                    )}
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium">Kiểu lặp</label>
                     <div className="flex gap-4 text-sm">
                        <label className="flex items-center gap-2">
                           <input
                              type="radio"
                              name="repeatMode"
                              value="count"
                              checked={repeatMode === "count"}
                              onChange={() => setRepeatMode("count")}
                           />
                           Theo số buổi
                        </label>
                        <label className="flex items-center gap-2">
                           <input
                              type="radio"
                              name="repeatMode"
                              value="until"
                              checked={repeatMode === "until"}
                              onChange={() => setRepeatMode("until")}
                           />
                           Theo ngày kết thúc
                        </label>
                     </div>
                  </div>

                  {repeatMode === "count" ? (
                     <div className="space-y-2">
                        <label className="text-sm font-medium">
                           Tổng số buổi
                        </label>
                        <Input
                           type="number"
                           min={1}
                           value={totalSessions}
                           onChange={(e) =>
                              setTotalSessions(Number(e.target.value))
                           }
                        />
                     </div>
                  ) : (
                     <div className="space-y-2">
                        <label className="text-sm font-medium">
                           Ngày kết thúc
                        </label>
                        <Input
                           type="date"
                           value={untilDate}
                           onChange={(e) => setUntilDate(e.target.value)}
                        />
                     </div>
                  )}
               </div>

               <DialogFooter className="gap-2">
                  <Button
                     variant="outline"
                     onClick={() => setShowBulkModal(false)}
                  >
                     Hủy
                  </Button>
                  <Button onClick={handleBulkCreate}>Tạo</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
}

export default SuggestionSchedules;
