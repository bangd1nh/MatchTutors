import apiClient from "@/lib/api";
import { Session } from "@/types/session";

export interface PaginationMeta {
   total: number;
   page: number;
   limit: number;
   pages: number;
}

export interface PaginatedResponse<T> {
   data: T[];
   pagination: PaginationMeta;
}

/**
 * Fetches paginated disputed sessions for admin.
 * @param status - Filter by dispute status ("OPEN" or "RESOLVED").
 * @param page - Page number
 * @param limit - Page limit
 */
export const getDisputedSessions = async (
   status?: "OPEN" | "RESOLVED",
   page: number = 1,
   limit: number = 10
): Promise<PaginatedResponse<Session>> => {
   const response = await apiClient.get("/adminSession/disputes", {
      params: { status, page, limit },
   });

   // The backend returns shape: { data: { data: Session[], pagination: {...} } }
   const payload = response.data?.data;
   // payload might be { data: Session[], pagination } or payload might be an array directly,
   // handle both shapes and default gracefully
   if (payload && Array.isArray(payload.data)) {
      return payload as PaginatedResponse<Session>;
   } else if (Array.isArray(payload)) {
      // If backend gave array directly -> compute a basic pagination meta
      const total = payload.length;
      return {
         data: payload,
         pagination: {
            total,
            page,
            limit,
            pages: Math.max(1, Math.ceil(total / limit)),
         },
      };
   } else {
      return {
         data: [],
         pagination: {
            total: 0,
            page,
            limit,
            pages: 0,
         },
      };
   }
};

/**
 * Fetches a specific session dispute.
 * @param sessionId - The ID of the session.
 */
export const getSessionDispute = async (
   sessionId: string
): Promise<Session> => {
   const response = await apiClient.get(`/adminSession/disputes/${sessionId}`);
   return response.data.data;
};

/**
 * Resolves a session dispute.
 * @param sessionId - The ID of the session.
 * @param decision - The decision ("COMPLETED" or "NOT_CONDUCTED").
 * @param adminNotes - Optional admin notes.
 */
export const resolveSessionDispute = async (
   sessionId: string,
   decision: "COMPLETED" | "NOT_CONDUCTED",
   adminNotes?: string
): Promise<Session> => {
   const response = await apiClient.patch(
      `/adminSession/disputes/${sessionId}/resolve`,
      { decision, adminNotes }
   );
   return response.data.data;
};
