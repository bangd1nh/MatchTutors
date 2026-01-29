import apiClient from "@/lib/api";
import {
   LearningCommitment,
   CreateLearningCommitmentRequest,
   PaginatedLearningCommitments,
} from "@/types/learningCommitment";

export const learningCommitmentApi = {
   create: async (
      data: CreateLearningCommitmentRequest
   ): Promise<LearningCommitment> => {
      const response = await apiClient.post("/learningCommitment", data);
      return response.data.data.commitment;
   },

   getById: async (id: string): Promise<LearningCommitment> => {
      const response = await apiClient.get(`/learningCommitment/${id}`);
      return response.data.data.commitment;
   },

   initiatePayment: async (id: string): Promise<{ paymentLink: string }> => {
      const response = await apiClient.post(
         `/learningCommitment/${id}/payment`
      );
      return response.data.data;
   },

   initiateTopUp: async (
      id: string,
      additionalSessions: number,
      amount: number
   ): Promise<{ paymentLink: string }> => {
      const response = await apiClient.post(`/learningCommitment/${id}/topup`, {
         additionalSessions,
         amount,
      });
      return response.data.data;
   },

   getByUser: async (
      page: number = 1,
      limit: number = 10
   ): Promise<PaginatedLearningCommitments> => {
      const response = await apiClient.get("/learningCommitment", {
         params: { page, limit },
      });
      // Backend returns data in metadata
      return response.data.data;
   },

   getTeachingRequestsByTutor: async () => {
      const response = await apiClient.get(
         `/learningCommitment/teaching-requests`
      );
      // API returns { teachingRequests, count } so take teachingRequests
      return response.data.data.teachingRequests;
   },

   getActiveLearningCommitmentsByTutor: async () => {
      const response = await apiClient.get(
         "/learningCommitment/tutor/active-commitments"
      );
      return response.data.data.commitments;
   },

   requestCancellation: async (
      id: string,
      reason: string,
      linkUrl?: string
   ): Promise<any> => {
      const response = await apiClient.post(
         `/learningCommitment/${id}/request-cancellation`,
         { reason, linkUrl }
      );
      return response.data.data;
   },

   rejectCancellation: async (
      id: string,
      reason: string,
      linkUrl?: string
   ): Promise<any> => {
      const response = await apiClient.post(
         `/learningCommitment/${id}/reject-cancellation`,
         { reason, linkUrl }
      );
      return response.data.data;
   },

   rejectLearningCommitment: async (id: string): Promise<any> => {
      const response = await apiClient.post(`/learningCommitment/${id}/reject`);
      return response.data.data;
   },
};
