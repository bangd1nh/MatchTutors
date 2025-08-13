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

export interface TeachingRequest {
    _id: string;
    studentId: string;
    tutorId: string;
    subject: string;
    level?: string;
    description?: string;
    totalSessionsPlanned?: number;
    trialDecision?: {
        student: "pending" | "accepted" | "rejected";
        tutor: "pending" | "accepted" | "rejected";
    };
    status?: string;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Định nghĩa lại type cho session có trường teachingRequest là object
export interface PopulatedScheduleSession
    extends Omit<ScheduleSession, "teachingRequestId"> {
    teachingRequest: TeachingRequest;
}
/**
 * Fetches all schedule sessions from the backend.
 */
export const getScheduleSessions = async (): Promise<
    PopulatedScheduleSession[]
> => {
    const teachingRequests: TeachingRequest[] = [
        {
            _id: "req1",
            studentId: "user1",
            tutorId: "user2",
            subject: "Toán",
            level: "12",
            description: "Ôn thi đại học",
            totalSessionsPlanned: 10,
            trialDecision: { student: "accepted", tutor: "accepted" },
            status: "in_progress",
            createdBy: "user1",
            createdAt: new Date("2025-08-01T08:00:00.000Z"),
            updatedAt: new Date("2025-08-10T08:00:00.000Z"),
        },
        {
            _id: "req2",
            studentId: "user2",
            tutorId: "user1",
            subject: "Văn",
            level: "11",
            description: "Nâng cao kỹ năng viết",
            totalSessionsPlanned: 8,
            trialDecision: { student: "pending", tutor: "accepted" },
            status: "trial_pending",
            createdBy: "user2",
            createdAt: new Date("2025-08-02T08:00:00.000Z"),
            updatedAt: new Date("2025-08-11T08:00:00.000Z"),
        },
    ];
    const getTeachingRequest = (id: string) =>
        teachingRequests.find((tr) => tr._id === id)!;

    const sessions: PopulatedScheduleSession[] = [
        {
            _id: "sess1",
            teachingRequest: getTeachingRequest("req1"),
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
            teachingRequest: getTeachingRequest("req2"),
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
    ];
    return Promise.resolve(sessions);
};

// // Helper để lấy teachingRequest từ id
// const getTeachingRequest = (id: string) => teachingRequests.find(tr => tr._id === id)!;

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
