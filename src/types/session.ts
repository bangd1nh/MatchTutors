import { LearningCommitment } from "@/types/learningCommitment";
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
   tutor: {
      status: "PENDING" | "ACCEPTED" | "REJECTED";
      decidedAt?: Date;
   };
   student: {
      status: "PENDING" | "ACCEPTED" | "REJECTED";
      decidedAt?: Date;
   };
   finalizedAt?: Date;
   isAttended: boolean;
}

// NEW: Dispute info
export interface DisputeInfo {
   status: "OPEN" | "RESOLVED";
   openedBy: string | IUser;
   reason: string;
   evidenceUrls: string[];
   openedAt: string;
   resolvedAt?: string;
   resolvedBy?: string | IUser;
   decision?: string;
   adminNotes?: string;
}

// Cancellation info (can be user id or populated user)
export interface CancellationInfo {
   cancelledBy: string | IUser;
   reason: string;
   cancelledAt: string;
}

// Payload used to create/update session
export interface UpsertSessionPayload {
   learningCommitmentId: string;
   startTime: string;
   endTime: string;
   location?: string;
   notes?: string;
   status?: SessionStatus | string;
   materials?: string[];
   quizIds?: string[];
   reminders?: Reminder[];
}

// Session returned from API
export interface AbsenceInfo {
   tutorAbsent?: boolean;
   studentAbsent?: boolean;
   reason?: string;
   recordedAt?: string;
   recordedBy?: string | IUser;
}

export interface Session
   extends Omit<UpsertSessionPayload, "learningCommitmentId"> {
   _id: string;
   learningCommitmentId: LearningCommitment | any;
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
   dispute?: DisputeInfo;
   absence?: AbsenceInfo; // Thêm dòng này

   // soft-delete fields
   isDeleted?: boolean;
   deletedAt?: string;
   deletedBy?: string;

   // flexible fields
   materials?: any[];
   quizIds?: any[];
   reminders?: Reminder[];
}
