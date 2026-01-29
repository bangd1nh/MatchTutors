import apiClient from "@/lib/api";
import { BusySession, Session, UpsertSessionPayload } from "@/types/session";

/**
 * Fetches all sessions for the currently authenticated user (tutor or student).
 * The backend is expected to populate learning commitment details.
 */
export const getMySessions = async (): Promise<Session[]> => {
   const response = await apiClient.get("/session/me");
   // API trả về sessions trong `data`, không phải `metadata`
   return response.data.data ?? [];
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

/**
 * Học sinh xác nhận tham gia buổi học
 */
export const confirmParticipation = async (
   sessionId: string,
   decision: "ACCEPTED" | "REJECTED"
): Promise<Session> => {
   const response = await apiClient.patch(
      `/session/${sessionId}/confirm-participation`,
      { decision }
   );
   return response.data.metadata;
};

/**
 * Xác nhận điểm danh sau buổi học (cả gia sư và học sinh)
 */
export const confirmAttendance = async (
   sessionId: string
): Promise<Session> => {
   const response = await apiClient.patch(
      `/session/${sessionId}/confirm-attendance`
   );
   return response.data.metadata;
};

/**
 * Từ chối điểm danh sau buổi học
 */
export const rejectAttendance = async (
   sessionId: string,
   payload?: { reason?: string; evidenceUrls?: string[] }
): Promise<Session> => {
   const response = await apiClient.patch(
      `/session/${sessionId}/reject-attendance`,
      payload
   );
   return response.data.metadata;
};

/**
 * Lấy danh sách các session bị rejected và soft-deleted cho user hiện tại
 */
export const getMyRejectedSessions = async (): Promise<Session[]> => {
   const response = await apiClient.get("/session/me/deleted");
   return response.data.metadata ?? response.data.data ?? [];
};

/**
 * Lấy chi tiết một session bị rejected và soft-deleted
 */
export const getRejectedSessionById = async (
   sessionId: string
): Promise<Session> => {
   const response = await apiClient.get(`/session/deleted/${sessionId}`);
   return response.data.metadata ?? response.data.data;
};

/**
 * Lấy danh sách các session bị cancelled cho user hiện tại
 */
export const getMyCancelledSessions = async (): Promise<Session[]> => {
   const response = await apiClient.get("/session/me/cancelled");
   return response.data.metadata ?? response.data.data ?? [];
};

/**
 * Lấy danh sách các buổi học vắng của user hiện tại
 */
export const getMyAbsenceSessions = async (): Promise<Session[]> => {
   const response = await apiClient.get("/session/me/absences");
   return response.data.metadata ?? response.data.data ?? [];
};

/**
 * Hủy buổi học đã confirm với lý do
 */
export const cancelSession = async (
   sessionId: string,
   reason: string
): Promise<Session> => {
   const response = await apiClient.patch(`/session/${sessionId}/cancel`, {
      reason,
   });
   return response.data.metadata;
};

export const createBatchSessions = async (payload: {
   learningCommitmentId: string;
   location: string;
   notes?: string;
   sessions: { startTime: string; endTime: string }[];
}): Promise<Session[]> => {
   const response = await apiClient.post("/session/batch", payload);

   return response.data?.data || response.data?.metadata || [];
};

export const busySession = async ():Promise<BusySession> => {
   const response = await apiClient.get("/session/busy");
   // Backend trả về sessions trong metadata, nhưng type BusySession expects data
   // Map metadata to data để phù hợp với type
   return {
      ...response.data,
      data: response.data.metadata || response.data.data || [],
   };
}
/**
 * Lấy danh sách các buổi học theo ID của Learning Commitment.
 * @param commitmentId ID của Learning Commitment
 */
export const getSessionsByCommitment = async (
   commitmentId: string
): Promise<Session[]> => {
   const response = await apiClient.get(`/session/commitment/${commitmentId}`);
   return response.data.metadata ?? response.data.data ?? [];
};

// New: fake attendance endpoint (backend route: confirm-attendance-fake)
export const confirmAttendanceFake = async (
   sessionId: string
): Promise<Session> => {
   const response = await apiClient.patch(
      `/session/${sessionId}/confirm-attendance-fake`
   );
   return response.data.metadata;
};

export const rejectAttendanceFake = async (
   sessionId: string,
   payload?: { reason?: string; evidenceUrls?: string[] }
): Promise<Session> => {
   const response = await apiClient.patch(
      `/session/${sessionId}/reject-attendance-fake`,
      payload
   );
   return response.data.metadata;
};
