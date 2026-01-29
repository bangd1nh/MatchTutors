export type CancellationDecisionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface CancellationDecisionParty {
   status: CancellationDecisionStatus;
   reason?: string;
}

export interface CancellationDecision {
   student: CancellationDecisionParty;
   tutor: CancellationDecisionParty;
   requestedBy?: "student" | "tutor";
   requestedAt?: string;
   reason?: string;
   adminReviewRequired?: boolean;
   adminResolvedBy?: string;
   adminResolvedAt?: string;
   adminNotes?: string;
}

export interface CancellationDecisionHistoryEntry extends CancellationDecision {
   resolvedDate?: string;
}

export interface AbsenceStats {
   totalSessions: number;
   studentAbsent: number;
   tutorAbsent: number;
   sessionDetails?: Array<{
      _id: string;
      startTime: string;
      endTime: string;
      status: string;
      isTrial?: boolean;
      studentAbsent?: boolean;
      tutorAbsent?: boolean;
      absenceReason?: string;
   }>;
}

export type AdminDisputeAction =
   | "resolve_disagreement"
   | "approve_cancellation"
   | "reject_cancellation";

export interface AdminDisputeLog {
   action: AdminDisputeAction;
   admin:
      | string
      | {
           _id: string;
           name?: string;
           email?: string;
        };
   notes?: string;
   handledAt: string;
   statusAfter: LearningCommitmentStatus;
   cancellationDecisionSnapshot?: CancellationDecision;
}

export interface AdminResolvedCaseLog {
   commitmentId: string;
   student: {
      _id?: string;
      name?: string;
      email?: string;
      userId?: {
         _id: string;
         name?: string;
         email?: string;
      };
   };
   tutor: {
      _id?: string;
      name?: string;
      email?: string;
      userId?: {
         _id: string;
         name?: string;
         email?: string;
      };
   };
   teachingRequest?: {
      _id?: string;
      subject?: string;
      description?: string;
   };
   action: AdminDisputeAction;
   statusAfter: LearningCommitmentStatus;
   adminNotes?: string;
   handledAt?: string;
   handledBy?:
      | string
      | {
           _id: string;
           name?: string;
           email?: string;
        };
   cancellationDecisionSnapshot?: CancellationDecision;
   logId?: string;
}

export type LearningCommitmentStatus =
   | "pending_agreement"
   | "active"
   | "completed"
   | "cancelled"
   | "cancellation_pending"
   | "admin_review"
   | "in_dispute"
   | "rejected";

export interface LearningCommitment {
   _id: string;
   tutor: {
      _id: string;
      userId: {
         _id: string;
         name: string;
         email: string;
      };
   };
   student: {
      _id: string;
      userId: {
         _id: string;
         name: string;
         email: string;
      };
   };
   teachingRequest: {
      _id: string;
      subject: string;
      description: string;
   };
   totalSessions: number;
   sessionsPerWeek?: number;
   startDate: string;
   totalAmount: number;
   studentPaidAmount: number;
   status: LearningCommitmentStatus;
   completedSessions: number;
   cancellationDecision?: CancellationDecision;
   cancellationDecisionHistory?: CancellationDecisionHistoryEntry[];
   adminDisputeLogs?: AdminDisputeLog[];
   absenceStats?: AbsenceStats;
   isMoneyTransferred?: boolean;
   createdAt: string;
   updatedAt: string;
   lastResolvedAt?: string;
}

export interface CreateLearningCommitmentRequest {
   teachingRequest: string;
   totalSessions: number;
   startDate: string;
   // endDate removed: server computes endDate, do not send it from client
   sessionsPerWeek: number;
   totalAmount: number;
   tutor?: string;
   student?: string;
}

export interface PaginatedLearningCommitments {
   items: LearningCommitment[];
   total: number;
   page: number;
   limit: number;
   pages: number;
}

export interface AdminLearningPaginatedResponse<T> {
   success: boolean;
   data: T[];
   pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
   };
   message?: string;
}
