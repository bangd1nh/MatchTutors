import { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useScheduleSessions } from "@/hooks/useScheduleSessions";
import { CustomEvent } from "./CustomEvent";
import { Button } from "../ui/button";
import { ScheduleForm, ScheduleSessionFormValues } from "./ScheduleForm";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "../ui/dialog";
import { format } from "date-fns";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type EventDropArg = {
   event: CalendarEvent;
   start: Date;
   end: Date;
   allDay?: boolean;
};

// Định nghĩa Type cho sự kiện trên lịch
interface CalendarEvent extends Event {
   isCreated: boolean;
   _id: string;
   title: string;
   start: Date;
   end: Date;
   startTime: any;
   endTime: any;
   teachingRequest: {
      _id: string;
      subject: string;
   };
   notes?: string;
   status:
      | "scheduled"
      | "confirmed"
      | "rejected"
      | "completed"
      | "not_conducted";
   isTrial: boolean;
   location?: string;
   materials?: string[];
   quizIds?: string[];
   createdBy: any;
}

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar);

function splitDateTime(date: Date) {
   return {
      date: date,
      hour: format(date, "HH:00"),
   };
}

export function AppointmentCalendar() {
   const { sessions, isLoading, isError } = useScheduleSessions();
   const [showCreateForm, setShowCreateForm] = useState(false);

   // viewSession: mở popup read-only khi nhấn vào event
   const [viewSession, setViewSession] = useState<CalendarEvent | null>(null);
   // editSession: mở form edit khi drag/drop (hoặc chuyển từ view -> edit)
   const [editSession, setEditSession] = useState<CalendarEvent | null>(null);

   const [events, setEvents] = useState<CalendarEvent[]>([]);

   const allUserIds = Array.from(
      new Set(sessions.map((s: any) => s.createdBy))
   );

   // State cho bộ lọc userId
   const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

   useEffect(() => {
      // Lọc theo userId
      const filteredSessions = sessions.filter((session: any) => {
         return (
            selectedUserIds.length === 0 ||
            selectedUserIds.includes(session.createdBy)
         );
      });

      const calendarEvents: CalendarEvent[] = filteredSessions.map(
         (session: any) => ({
            ...session,
            start: new Date(session.startTime),
            end: new Date(session.endTime),
            title:
               (session.teachingRequest?.subject
                  ? session.teachingRequest.subject + " - "
                  : "") + (session.notes || session.teachingRequest?._id),
         })
      );
      setEvents(calendarEvents);
   }, [sessions, selectedUserIds]);

   const handleEventDrop = useCallback((args: EventDropArg): void => {
      const { event, start, end } = args;
      const updatedEvent = { ...event, start, end };

      // Cập nhật ngay trong state events để UI không bị lệch
      setEvents((prev) =>
         prev.map((e) => (e._id === event._id ? { ...e, start, end } : e))
      );

      // Mở dialog edit để người dùng chỉnh sửa thông tin session sau khi kéo thả
      setEditSession(updatedEvent);
   }, []);

   const handleUpdateSession = (data: ScheduleSessionFormValues) => {
      if (!editSession) return;

      // TODO: Gọi API để cập nhật session với `data`
      console.log("Updating session:", editSession._id, data);

      setEvents((prev) =>
         prev.map((e) =>
            e._id === editSession._id
               ? {
                    ...e,
                    ...data,
                    start: data.startTime,
                    end: data.endTime,
                    title: e.title,
                 }
               : e
         )
      );
      setEditSession(null); // Đóng dialog edit
   };

   if (isLoading) return <div>Đang tải lịch học...</div>;
   if (isError) return <div>Lỗi! Không thể tải dữ liệu lịch học.</div>;

   return (
      <div>
         <div className="mb-2 flex flex-wrap gap-4">
            <div>
               <Button
                  variant={"default"}
                  onClick={() => {
                     setShowCreateForm(true);
                  }}
               >
                  create new session
               </Button>
            </div>

            <div>
               <strong>Lọc theo người tạo:</strong>
               <div className="min-w-[200px] relative">
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="outline"
                           className="w-full justify-between"
                        >
                           {selectedUserIds.length === 0
                              ? "Tất cả"
                              : `${selectedUserIds.length} người được chọn`}
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-full">
                        <DropdownMenuItem
                           onClick={() => setSelectedUserIds([])}
                           className="flex items-center gap-2"
                        >
                           <input
                              type="checkbox"
                              checked={selectedUserIds.length === 0}
                              readOnly
                           />
                           Tất cả
                        </DropdownMenuItem>
                        {allUserIds.map((userId) => (
                           <DropdownMenuItem
                              key={userId}
                              onClick={() => {
                                 if (selectedUserIds.includes(userId)) {
                                    setSelectedUserIds(
                                       selectedUserIds.filter(
                                          (id) => id !== userId
                                       )
                                    );
                                 } else {
                                    setSelectedUserIds([
                                       ...selectedUserIds,
                                       userId,
                                    ]);
                                 }
                              }}
                              className="flex items-center gap-2"
                           >
                              <input
                                 type="checkbox"
                                 checked={selectedUserIds.includes(userId)}
                                 readOnly
                              />
                              {userId}
                           </DropdownMenuItem>
                        ))}
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
            {/* ... controls ... */}
         </div>
         <div className="h-[70vh]">
            <DnDCalendar
               localizer={localizer}
               events={events}
               onEventDrop={handleEventDrop}
               // Nhấn vào event => mở view (readonly)
               onSelectEvent={(ev) => setViewSession(ev as CalendarEvent)}
               startAccessor="start"
               endAccessor="end"
               views={["month", "week", "day", "agenda"]}
               defaultView="month"
               resizable
               components={{
                  event: CustomEvent,
               }}
            />
         </div>

         {/* Dialog for Creating Session */}
         <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="min-w-[350px]">
               <DialogHeader>
                  <DialogTitle>Tạo lịch học mới</DialogTitle>
                  <DialogDescription>
                     Điền thông tin để tạo lịch học mới.
                  </DialogDescription>
               </DialogHeader>
               <ScheduleForm
                  onSubmit={() => {
                     /* TODO: Handle create */
                  }}
               />
            </DialogContent>
         </Dialog>

         {/* Dialog for Viewing Session (read-only) */}
         <Dialog open={!!viewSession} onOpenChange={() => setViewSession(null)}>
            <DialogContent className="min-w-[350px]">
               <DialogHeader>
                  <DialogTitle>Chi tiết buổi học</DialogTitle>
                  <DialogDescription>Thông tin buổi học</DialogDescription>
               </DialogHeader>

               {viewSession && (
                  <div className="space-y-3">
                     <div>
                        <strong>Môn:</strong>{" "}
                        {viewSession.teachingRequest?.subject || "-"}
                     </div>
                     <div>
                        <strong>Thời gian:</strong>{" "}
                        {new Date(viewSession.start).toLocaleString("vi-VN")} -{" "}
                        {new Date(viewSession.end).toLocaleTimeString("vi-VN", {
                           hour: "2-digit",
                           minute: "2-digit",
                        })}
                     </div>
                     <div>
                        <strong>Địa điểm / Link:</strong>{" "}
                        {viewSession.location || "-"}
                     </div>
                     <div>
                        <strong>Ghi chú:</strong> {viewSession.notes || "-"}
                     </div>
                     <div>
                        <strong>Tài liệu:</strong>{" "}
                        {(viewSession.materials || []).join(", ") || "-"}
                     </div>
                     <div>
                        <strong>Quiz:</strong>{" "}
                        {(viewSession.quizIds || []).join(", ") || "-"}
                     </div>

                     <div className="flex justify-end gap-2 mt-4">
                        <Button
                           variant="outline"
                           onClick={() => {
                              // Chuyển sang dialog edit nếu muốn chỉnh sửa
                              setEditSession(viewSession);
                              setViewSession(null);
                           }}
                        >
                           Chỉnh sửa
                        </Button>
                        <Button onClick={() => setViewSession(null)}>
                           Đóng
                        </Button>
                     </div>
                  </div>
               )}
            </DialogContent>
         </Dialog>

         {/* Dialog for Editing Session (opened after drag/drop or từ view -> chỉnh sửa) */}
         <Dialog open={!!editSession} onOpenChange={() => setEditSession(null)}>
            <DialogContent className="max-h-[95vh] overflow-x-auto">
               <DialogHeader>
                  <DialogTitle>Cập nhật lịch học</DialogTitle>
                  <DialogDescription>
                     Chỉnh sửa thông tin và nhấn cập nhật.
                  </DialogDescription>
               </DialogHeader>
               {editSession && (
                  <ScheduleForm
                     onSubmit={handleUpdateSession}
                     initialValues={{
                        teachingRequestId: editSession.teachingRequest._id,
                        startDate: splitDateTime(editSession.start).date,
                        startHour: splitDateTime(editSession.start).hour,
                        endDate: splitDateTime(editSession.end).date,
                        endHour: splitDateTime(editSession.end).hour,
                        notes: editSession.notes,
                        status: editSession.status,
                        isTrial: editSession.isTrial,
                        location: editSession.location,
                        materials: editSession.materials,
                        quizIds: editSession.quizIds,
                     }}
                     isCreated={true}
                  />
               )}
            </DialogContent>
         </Dialog>
      </div>
   );
}
