import apiClient from "@/lib/api";
import { Session, UpsertSessionPayload } from "@/types/session";

/**
 * Fetches all sessions for the currently authenticated user (tutor or student).
 * The backend is expected to populate teachingRequest details.
 */
export const getMySessions = async (): Promise<Session[]> => {
   const response = await apiClient.get("/session/me");
   // API trả về sessions trong `data`, không phải `metadata`
   return response.data.metadata ?? response.data.data ?? [];
};

/**
 * Lấy danh sách session theo teachingRequestId.
 */
export const getSessionsByRequest = async (
   teachingRequestId: string
): Promise<Session[]> => {
   const response = await apiClient.get(
      `/session/request/${teachingRequestId}`
   );
   const payload =
      response.data?.metadata ?? response.data?.data ?? response.data;
   if (Array.isArray(payload)) return payload as Session[];
   if (Array.isArray(payload?.sessions)) return payload.sessions as Session[];
   return [];
};

/**
 * Creates a new session.
 * @param payload - The data for the new session.
 */
export const createSession = async (
   payload: UpsertSessionPayload
): Promise<Session> => {
   const response = await apiClient.post("/session", payload);
   return response.data.metadata;
};

/**
 * Updates an existing session.
 * @param sessionId - The ID of the session to update.
 * @param payload - The data to update.
 */
export const updateSession = async (
   sessionId: string,
   payload: Partial<UpsertSessionPayload>
): Promise<Session> => {
   console.log("Updating session:", sessionId, payload); // Debug log
   const response = await apiClient.patch(`/session/${sessionId}`, payload);
   return response.data.metadata;
};

/**
 * Deletes a session.
 * @param sessionId - The ID of the session to delete.
 */
export const deleteSession = async (sessionId: string): Promise<void> => {
   await apiClient.delete(`/session/${sessionId}`);
};

/**
 * Lấy chi tiết một buổi học theo ID.
 * @param sessionId ID của buổi học
 */
export const getSessionById = async (sessionId: string): Promise<Session> => {
   const response = await apiClient.get(`/session/${sessionId}`);
   // Sửa ở đây: API có thể trả về trong metadata hoặc data
   return response.data.metadata ?? response.data.data;
};

/**
 * Lấy danh sách các buổi học theo ID của Teaching Request.
 * @param teachingRequestId ID của yêu cầu dạy học
 */
export const getSessionsByTeachingRequest = async (
   teachingRequestId: string
): Promise<Session[]> => {
   // Endpoint này đã có ở backend: /api/sessions/request/:teachingRequestId
   const response = await apiClient.get(
      `/session/request/${teachingRequestId}`
   );
   return response.data.metadata ?? response.data ?? [];
};
