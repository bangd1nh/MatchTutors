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
   startDate: string;
   endDate: string;
   totalAmount: number;
   studentPaidAmount: number;
   status:
      | "pending_agreement"
      | "active"
      | "completed"
      | "cancelled"
      | "cancellation_pending"
      | "admin_review"
      | "in_dispute";
   completedSessions: number;
   cancellationDecision?: {
      student: {
         status: "PENDING" | "ACCEPTED" | "REJECTED";
         reason?: string;
      };
      tutor: {
         status: "PENDING" | "ACCEPTED" | "REJECTED";
         reason?: string;
      };
      requestedBy?: "student" | "tutor";
      requestedAt?: string;
      reason?: string;
      adminReviewRequired?: boolean;
      adminResolvedBy?: string;
      adminResolvedAt?: string;
      adminNotes?: string;
   };
   createdAt: string;
   updatedAt: string;
}

export interface CreateLearningCommitmentRequest {
   teachingRequest: string;
   totalSessions: number;
   startDate: string;
   endDate: string;
   totalAmount: number;
   tutor?: string;
   student?: string;
}

// Fix: Update to match actual backend response structure
export interface PaginatedLearningCommitments {
   items: LearningCommitment[];
   total: number;
   page: number;
   limit: number;
   pages: number;
}
