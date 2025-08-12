import apiClient from "../lib/api";

// Interface for a reminder
export interface Reminder {
    userId: string; // Assuming ObjectId is represented as a string
    minutesBefore: number;
    method: string[];
    location: string;
    notes: string;
}

// Type for the data sent to create or update a session
export interface UpsertScheduleSession {
    teachingRequestId: string; // Ref to teaching request
    startTime: Date;
    endTime: Date;
    status:
        | "scheduled"
        | "confirmed"
        | "rejected"
        | "completed"
        | "not_conducted";
    isTrial: boolean;
    materials?: string[]; // Ref to material._id
    quizIds?: string[]; // Ref to quizzes._id
    reminders?: Reminder[];
    location: string;
    notes: string;
}

// Type for the data received from the API for a session
export interface ScheduleSession extends UpsertScheduleSession {
    _id: string;
    createdBy: string; // ObjectId of the user who created it
}

/**
 * Fetches all schedule sessions from the backend.
 */
export const getScheduleSessions = async (): Promise<ScheduleSession[]> => {
    // Mock data cho các session
    return Promise.resolve([
        {
            _id: "sess1",
            teachingRequestId: "req1",
            startTime: new Date("2025-08-10T09:00:00.000Z"),
            endTime: new Date("2025-08-10T10:00:00.000Z"),
            status: "scheduled",
            isTrial: true,
            createdBy: "user1",
            materials: ["mat1", "mat2"],
            quizIds: ["quiz1"],
            reminders: [
                {
                    userId: "user1",
                    minutesBefore: 30,
                    method: ["in_app", "email"],
                    location: "Online",
                    notes: "Nhớ chuẩn bị bài",
                },
            ],
            location: "Zoom link",
            notes: "Buổi học thử",
        },
        {
            _id: "sess2",
            teachingRequestId: "req2",
            startTime: new Date("2025-08-11T14:00:00.000Z"),
            endTime: new Date("2025-08-11T15:30:00.000Z"),
            status: "confirmed",
            isTrial: false,
            createdBy: "user2",
            materials: ["mat3"],
            quizIds: ["quiz2", "quiz3"],
            reminders: [
                {
                    userId: "user2",
                    minutesBefore: 15,
                    method: ["sms"],
                    location: "Offline",
                    notes: "Mang theo sách",
                },
            ],
            location: "Phòng 101",
            notes: "Buổi học chính",
        },
    ]);
};

/**
 * Creates a new schedule session.
 * @param sessionData - The data for the new session.
 */
export const createScheduleSession = async (
    sessionData: UpsertScheduleSession
): Promise<ScheduleSession> => {
    const response = await apiClient.post("/sessions", sessionData);
    return response.data;
};

/**
 * Updates an existing schedule session.
 * @param param0 - An object containing the session ID and the new data.
 */
export const updateScheduleSession = async ({
    id,
    ...sessionData
}: { id: string } & UpsertScheduleSession): Promise<ScheduleSession> => {
    const response = await apiClient.put(`/sessions/${id}`, sessionData);
    return response.data;
};

/**
 * Deletes a schedule session.
 * @param id - The ID of the session to delete.
 */
export const deleteScheduleSession = async (id: string): Promise<void> => {
    await apiClient.delete(`/sessions/${id}`);
};
