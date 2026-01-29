import apiClient from "@/lib/api";
import {
   SSchedulesBody,
   SSchedulesResponse,
} from "@/types/suggestionSchedules";

export const createSuggestion = async (
   payload: SSchedulesBody
): Promise<SSchedulesResponse> => {
   const response = await apiClient.post(
      "/suggestionSchedules/create",
      payload
   );

   return response.data;
};

export const getSuggestion = async (
   TRid: string
): Promise<SSchedulesResponse> => {
   const response = await apiClient.get(`/suggestionSchedules/${TRid}/get`);
   // Backend trả về data trong metadata
   return {
      ...response.data,
      data: response.data.metadata || response.data.data || response.data,
   };
};

export const studentRespondSuggestion = async (
   suggestionId: string,
   decision: "ACCEPT" | "REJECT",
   reason?: string
): Promise<SSchedulesResponse & { commitmentId?: string }> => {
   const response = await apiClient.post(
      `/suggestionSchedules/${suggestionId}/student-respond`,
      { decision, reason }
   );
   return response.data.metadata || response.data;
};

export const tutorUpdateSuggestion = async (
   suggestionId: string,
   payload: SSchedulesBody
): Promise<SSchedulesResponse> => {
   const response = await apiClient.put(
      `/suggestionSchedules/${suggestionId}`,
      payload
   );
   return {
      ...response.data,
      data: response.data.metadata || response.data.data || response.data,
   };
};

export interface TutorPendingSuggestion {
   _id: string;
   teachingRequestId: string;
   title: string;
   subject?: string;
   proposedTotalPrice: number;
   schedules: Array<{ start: Date; end: Date }>;
   status?: "PENDING" | "REJECTED" | "ACCEPTED";
   studentResponse?: {
      status: "PENDING" | "REJECTED" | "ACCEPTED";
      reason?: string;
      respondedAt?: Date;
   };
   student?: {
      _id: string;
      name: string;
      avatarUrl?: string;
      email: string;
   };
   createdAt: Date;
}

export const getMyPendingSuggestions = async (): Promise<
   TutorPendingSuggestion[]
> => {
   const response = await apiClient.get("/suggestionSchedules/my/pending");
   return response.data.metadata || response.data.data || [];
};