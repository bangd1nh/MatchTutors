import { useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useScheduleSessions } from "@/hooks/useScheduleSessions";
import { CustomEvent } from "./CustomEvent";
import { mockUsers, mockTeachingRequests } from "@/api/mockUsersAndRequests";

const localizer = momentLocalizer(moment);

export function AppointmentCalendar() {
    const { sessions, isLoading, isError } = useScheduleSessions();

    // State cho bộ lọc
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>([]);

    // Xử lý bộ lọc
    const filteredSessions = useMemo(() => {
        return sessions.filter((session) => {
            const userMatch =
                selectedUserIds.length === 0 ||
                selectedUserIds.includes(session.createdBy);
            const requestMatch =
                selectedRequestIds.length === 0 ||
                selectedRequestIds.includes(session.teachingRequestId);
            return userMatch && requestMatch;
        });
    }, [sessions, selectedUserIds, selectedRequestIds]);

    // Chuyển dữ liệu session thành event cho Calendar
    const events = useMemo(
        () =>
            filteredSessions.map((session) => ({
                ...session,
                start: new Date(session.startTime),
                end: new Date(session.endTime),
                title: session.notes || session.teachingRequestId,
            })),
        [filteredSessions]
    );

    if (isLoading) return <div>Đang tải lịch học...</div>;
    if (isError) return <div>Lỗi! Không thể tải dữ liệu lịch học.</div>;

    return (
        <div>
            {/* Bộ lọc theo người tạo */}
            <div className="mb-2 flex flex-wrap gap-4">
                <div>
                    <strong>Lọc theo người tạo:</strong>
                    {mockUsers.map((user) => (
                        <label key={user._id} className="ml-2">
                            <input
                                type="checkbox"
                                checked={selectedUserIds.includes(user._id)}
                                onChange={(e) => {
                                    setSelectedUserIds((prev) =>
                                        e.target.checked
                                            ? [...prev, user._id]
                                            : prev.filter(
                                                  (id) => id !== user._id
                                              )
                                    );
                                }}
                            />
                            &nbsp;{user.name}
                        </label>
                    ))}
                </div>
                <div>
                    <strong>Lọc theo yêu cầu học:</strong>
                    {mockTeachingRequests.map((req) => (
                        <label key={req._id} className="ml-2">
                            <input
                                type="checkbox"
                                checked={selectedRequestIds.includes(req._id)}
                                onChange={(e) => {
                                    setSelectedRequestIds((prev) =>
                                        e.target.checked
                                            ? [...prev, req._id]
                                            : prev.filter(
                                                  (id) => id !== req._id
                                              )
                                    );
                                }}
                            />
                            &nbsp;{req.subject}
                        </label>
                    ))}
                </div>
            </div>
            <div className="h-[70vh]">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={["month", "week", "day", "agenda"]}
                    defaultView="month"
                    components={{
                        event: CustomEvent,
                    }}
                />
            </div>
        </div>
    );
}
