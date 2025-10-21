import apiClient from "@/lib/api";

// Interface cho teaching request trong admin
export interface AdminTeachingRequest {
   _id: string;
   studentId: {
      _id: string;
      userId: {
         _id: string;
         name: string;
         email: string;
         avatarUrl?: string;
      };
   };
   tutorId: {
      _id: string;
      userId: {
         _id: string;
         name: string;
         email: string;
         avatarUrl?: string;
      };
   };
   subject: string;
   level: string;
   hourlyRate: number;
   description?: string;
   trialSessionsCompleted: number;
   status: string;
   createdBy: {
      _id: string;
      name: string;
      email: string;
   };
   trialDecision?: {
      student: "PENDING" | "ACCEPTED" | "REJECTED";
      tutor: "PENDING" | "ACCEPTED" | "REJECTED";
   };
   cancellationDecision?: {
      student: "PENDING" | "ACCEPTED" | "REJECTED";
      tutor: "PENDING" | "ACCEPTED" | "REJECTED";
      requestedBy?: "student" | "tutor";
      requestedAt?: string;
      reason?: string;
      adminReviewRequired: boolean;
      adminResolvedBy?: string;
      adminResolvedAt?: string;
      adminNotes?: string;
   };
   complete_pending?: {
      student: "PENDING" | "ACCEPTED" | "REJECTED";
      tutor: "PENDING" | "ACCEPTED" | "REJECTED";
      requestedBy?: "student" | "tutor";
      requestedAt?: string;
      reason?: string;
      adminReviewRequired: boolean;
      adminResolvedBy?: string;
      adminResolvedAt?: string;
      adminNotes?: string;
   };
   // Thêm các trường history
   cancellationDecisionHistory?: {
      student: "PENDING" | "ACCEPTED" | "REJECTED";
      tutor: "PENDING" | "ACCEPTED" | "REJECTED";
      requestedBy?: "student" | "tutor";
      requestedAt?: string;
      reason?: string;
      adminReviewRequired: boolean;
      adminResolvedBy?: string;
      adminResolvedAt?: string;
      adminNotes?: string;
      resolvedDate?: string;
   }[];
   complete_pendingHistory?: {
      student: "PENDING" | "ACCEPTED" | "REJECTED";
      tutor: "PENDING" | "ACCEPTED" | "REJECTED";
      requestedBy?: "student" | "tutor";
      requestedAt?: string;
      reason?: string;
      adminReviewRequired: boolean;
      adminResolvedBy?: string;
      adminResolvedAt?: string;
      adminNotes?: string;
      resolvedDate?: string;
   }[];
   createdAt: string;
   updatedAt: string;
}

// Interface cho response pagination
export interface GetAdminTeachingRequestsResponse {
   status: string;
   message: string;
   code: number;
   data: {
      requests: AdminTeachingRequest[];
      pagination: {
         page: number;
         limit: number;
         total: number;
      };
   };
}

// Interface cho resolve request
export interface ResolveRequestPayload {
   decision: "ACCEPTED" | "REJECTED";
   adminNotes?: string;
}

/**
 * Lấy danh sách teaching requests cần admin review
 */
export const getRequestsForAdminReview = async (params?: {
   page?: number;
   limit?: number;
}): Promise<GetAdminTeachingRequestsResponse> => {
   const response = await apiClient.get("/teachingRequest/admin/review", {
      params,
   });
   return response.data;
};

/**
 * Lấy danh sách teaching requests đã được admin xử lý
 */
export const getResolvedRequests = async (params?: {
   page?: number;
   limit?: number;
}): Promise<GetAdminTeachingRequestsResponse> => {
   const response = await apiClient.get(
      "/teachingRequest/admin/review/resolved",
      {
         params,
      }
   );
   return response.data;
};

/**
 * Lấy danh sách teaching requests vừa được admin xử lý
 */
export const getRecentlyResolvedRequests = async (params?: {
   page?: number;
   limit?: number;
}): Promise<GetAdminTeachingRequestsResponse> => {
   const response = await apiClient.get(
      "/teachingRequest/admin/review/recently-resolved",
      {
         params,
      }
   );
   return response.data;
};

/**
 * Admin xử lý review request
 */
export const resolveAdminReview = async (
   requestId: string,
   payload: ResolveRequestPayload
): Promise<{
   success: boolean;
   message: string;
   data: AdminTeachingRequest;
}> => {
   const response = await apiClient.post(
      `/teachingRequest/admin/review/${requestId}/resolve`,
      payload
   );
   return response.data;
};

/**
 * Lấy lịch sử admin review cho một teaching request
 */
export const getAdminReviewHistory = async (
   requestId: string
): Promise<{
   cancellationHistory: any[];
   completionHistory: any[];
}> => {
   const response = await apiClient.get(
      `/teachingRequest/${requestId}/admin/review/history`
   );
   return response.data.metadata;
};

// Export default object
export default {
   getRequestsForAdminReview,
   getResolvedRequests,
   getRecentlyResolvedRequests,
   resolveAdminReview,
   getAdminReviewHistory,
};
