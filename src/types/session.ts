import { TeachingRequest } from "./teachingRequest";
import { SessionStatus } from "@/enums/session.enum";

// Interface cho Reminder, dựa theo backend
export interface Reminder {
   userId: string;
   minutesBefore: number;
   methods?: string[]; // e.g., "email", "in_app"
}

// Dữ liệu để tạo hoặc cập nhật session
export interface UpsertSessionPayload {
   teachingRequestId: string;
   startTime: string;
   endTime: string;
   isTrial: boolean;
   location?: string;
   notes?: string;
   status?: SessionStatus;
   // Thêm các trường mới
   materials?: string[]; // Mảng các ID của material
   quizIds?: string[]; // Mảng các ID của quiz
   reminders?: Reminder[];
}

// Dữ liệu session nhận về từ API
export interface Session
   extends Omit<UpsertSessionPayload, "teachingRequestId"> {
   _id: string;
   teachingRequestId: TeachingRequest;
   createdBy: string;
   createdAt: string;
   updatedAt: string;
   // Thêm các trường đã có ở backend
   materials?: any[]; // Hoặc định nghĩa type Material cụ thể
   quizIds?: any[]; // Hoặc định nghĩa type Quiz cụ thể
   reminders?: Reminder[];
}
