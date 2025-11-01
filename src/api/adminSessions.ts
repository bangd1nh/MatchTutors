import apiClient from "@/lib/api";
import { Session } from "@/types/session";

/**
 * Fetches all disputed sessions for admin.
 * @param status - Filter by dispute status ("OPEN" or "RESOLVED").
 */
export const getDisputedSessions = async (
   status?: "OPEN" | "RESOLVED"
): Promise<Session[]> => {
   const response = await apiClient.get("/adminSession/disputes", {
      params: { status },
   });
   return response.data.data ?? [];
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
