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
    createdBy: any; // Nên thay bằng type User cụ thể nếu có
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
    const [sessionToEdit, setSessionToEdit] = useState<CalendarEvent | null>(
        null
    );
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
                    (session.teachingRequest.subject
                        ? session.teachingRequest.subject + " - "
                        : "") + (session.notes || session.teachingRequest._id),
            })
        );
        setEvents(calendarEvents);
    }, [sessions, selectedUserIds]);

    // const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);

    useEffect(() => {
        const filteredSessions = sessions.filter((session: any) => {
            const userMatch =
                selectedUserIds.length === 0 ||
                selectedUserIds.includes(session.createdBy);
            // const requestMatch =
            //     selectedRequestIds.length === 0 ||
            //     selectedRequestIds.includes(session.teachingRequest._id);
            return userMatch;
        });

        const calendarEvents: CalendarEvent[] = filteredSessions.map(
            (session: any) => ({
                ...session,
                start: new Date(session.startTime),
                end: new Date(session.endTime),
                title:
                    (session.teachingRequest.subject
                        ? session.teachingRequest.subject + " - "
                        : "") + (session.notes || session.teachingRequest._id),
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

        // Mở dialog để chỉnh sửa nếu cần
        setSessionToEdit(updatedEvent);
    }, []);

    const handleUpdateSession = (data: ScheduleSessionFormValues) => {
        if (!sessionToEdit) return;

        // TODO: Gọi API để cập nhật session với `data`
        console.log("Updating session:", sessionToEdit._id, data);

        setEvents((prev) =>
            prev.map((e) =>
                e._id === sessionToEdit._id
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
        setSessionToEdit(null); // Đóng dialog
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
                                            if (
                                                selectedUserIds.includes(userId)
                                            ) {
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
                                            checked={selectedUserIds.includes(
                                                userId
                                            )}
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
                    onSelectEvent={(ev) =>
                        setSessionToEdit(ev as CalendarEvent)
                    }
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

            {/* Dialog for Editing Session */}
            <Dialog
                open={!!sessionToEdit}
                onOpenChange={() => setSessionToEdit(null)}
            >
                <DialogContent className="max-h-[95vh] overflow-x-auto">
                    <DialogHeader>
                        <DialogTitle>Cập nhật lịch học</DialogTitle>
                        <DialogDescription>
                            Chỉnh sửa thông tin và nhấn cập nhật.
                        </DialogDescription>
                    </DialogHeader>
                    {sessionToEdit && (
                        <ScheduleForm
                            onSubmit={handleUpdateSession}
                            initialValues={{
                                teachingRequestId:
                                    sessionToEdit.teachingRequest._id,
                                startDate: splitDateTime(sessionToEdit.start)
                                    .date,
                                startHour: splitDateTime(sessionToEdit.start)
                                    .hour,
                                endDate: splitDateTime(sessionToEdit.end).date,
                                endHour: splitDateTime(sessionToEdit.end).hour,
                                notes: sessionToEdit.notes,
                                status: sessionToEdit.status,
                                isTrial: sessionToEdit.isTrial,
                                location: sessionToEdit.location,
                                materials: sessionToEdit.materials,
                                quizIds: sessionToEdit.quizIds,
                            }}
                            isCreated={true}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
