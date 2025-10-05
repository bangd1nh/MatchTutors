import { TeachingRequest } from "@/types/teachingRequest";
import { SessionStatus } from "@/enums/session.enum";
import { IUser } from "@/types/user";

// Reminder used in sessions
export interface Reminder {
   userId: string;
   minutesBefore: number;
   methods?: string[]; // e.g. ["email","in_app"]
}

// Student confirmation (frontend-friendly)
export type StudentConfirmationStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export interface StudentConfirmation {
   status: StudentConfirmationStatus;
   confirmedAt?: string;
}

// Attendance confirmation
export interface AttendanceConfirmation {
   tutorConfirmed: boolean;
   studentConfirmed: boolean;
   tutorConfirmedAt?: string;
   studentConfirmedAt?: string;
   isAttended: boolean;
}

// Cancellation info (can be user id or populated user)
export interface CancellationInfo {
   cancelledBy: string | IUser;
   reason: string;
   cancelledAt: string;
}

// Payload used to create/update session
export interface UpsertSessionPayload {
   teachingRequestId: string;
   startTime: string;
   endTime: string;
   isTrial: boolean;
   location?: string;
   notes?: string;
   status?: SessionStatus | string;
   materials?: string[];
   quizIds?: string[];
   reminders?: Reminder[];
}

// Session returned from API
export interface Session
   extends Omit<UpsertSessionPayload, "teachingRequestId"> {
   _id: string;
   teachingRequestId: TeachingRequest;
   startTime: string;
   endTime: string;
   status: SessionStatus | string;
   isTrial: boolean;
   createdBy?: string | IUser;
   createdAt?: string;
   updatedAt?: string;

   studentConfirmation?: StudentConfirmation;
   attendanceConfirmation?: AttendanceConfirmation;
   cancellation?: CancellationInfo;

   // soft-delete fields
   isDeleted?: boolean;
   deletedAt?: string;
   deletedBy?: string;

   // flexible fields
   materials?: any[];
   quizIds?: any[];
   reminders?: Reminder[];
}
