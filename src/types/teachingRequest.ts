import {
   DecisionStatus,
   TeachingRequestStatus,
} from "@/enums/teachingRequest.enum";
import { Level } from "@/enums/level.enum";
import { Subject } from "@/enums/subject.enum";
import { IUser } from "@/types/user";

// Đại diện cho thông tin user được populate lồng nhau
interface PopulatedUser {
   _id: string;
   userId: Pick<IUser, "_id" | "name" | "avatarUrl">;
}

// Type cho các quyết định, dựa theo backend
export interface CancellationDecision {
   student: DecisionStatus;
   tutor: DecisionStatus;
   requestedBy?: "student" | "tutor";
   requestedAt?: string;
   reason?: string;
   adminReviewRequired?: boolean;
   adminResolvedBy?: string;
   adminResolvedAt?: string;
   adminNotes?: string;
}

export interface CompletePending {
   student: DecisionStatus;
   tutor: DecisionStatus;
   requestedBy?: "student" | "tutor";
   requestedAt?: string;
   reason?: string;
   studentConfirmedAt?: string;
   tutorConfirmedAt?: string;
   adminReviewRequired?: boolean;
   adminResolvedBy?: string;
   adminResolvedAt?: string;
   adminNotes?: string;
}

export interface TeachingRequest {
   _id: string;
   studentId: PopulatedUser;
   tutorId: PopulatedUser;
   subject: Subject;
   level: Level;
   hourlyRate: number;
   description?: string;
   totalSessionsPlanned?: number;
   trialSessionsCompleted?: number;
   trialDecision?: {
      student: DecisionStatus;
      tutor: DecisionStatus;
   };
   status: TeachingRequestStatus;
   createdAt: string;
   updatedAt: string;
   // Sử dụng type chi tiết thay vì any
   complete_pending?: CompletePending;
   cancellationDecision?: CancellationDecision;
}

export interface CreateTeachingRequestPayload {
   tutorId: string;
   subject: Subject;
   level: Level;
   hourlyRate: number;
   description?: string;
   totalSessionsPlanned?: number;
}
