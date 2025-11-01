import {
   LearningCommitment,
   PaginatedLearningCommitments,
} from "@/types/learningCommitment";
import apiClient from "@/lib/api";

// Get learning commitments that are in dispute (admin_review)
export const getDisputedLearningCommitments = async (
   page: number = 1,
   limit: number = 10
): Promise<PaginatedLearningCommitments> => {
   const response = await apiClient.get("/adminLearning/disagreements", {
      params: { page, limit },
   });
   return response.data;
};

// Get the details of a specific learning commitment
export const getLearningCommitmentDetail = async (
   id: string
): Promise<LearningCommitment> => {
   const response = await apiClient.get(`/adminLearning/${id}`);
   return response.data.data;
};

// Handle a cancellation disagreement
export const handleCancellationDisagreement = async (
   id: string,
   adminNotes: string
): Promise<{ message: string; data: LearningCommitment }> => {
   const response = await apiClient.post(
      `/adminLearning/${id}/handle-disagreement`,
      {
         adminNotes,
      }
   );
   return response.data;
};

// Approve a cancellation request
export const approveCancellation = async (
   id: string,
   adminNotes: string
): Promise<{ message: string; data: LearningCommitment }> => {
   const response = await apiClient.post(
      `/adminLearning/${id}/approve-cancellation`,
      {
         adminNotes,
      }
   );
   return response.data;
};

// Reject a cancellation request
export const rejectCancellation = async (
   id: string,
   adminNotes: string
): Promise<{ message: string; data: LearningCommitment }> => {
   const response = await apiClient.post(
      `/adminLearning/${id}/reject-cancellation`,
      {
         adminNotes,
      }
   );
   return response.data;
};
