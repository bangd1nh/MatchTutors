import apiClient from "@/lib/api";
import {
   CreateTeachingRequestPayload,
   TeachingRequest,
} from "@/types/teachingRequest";

/**
 * Lấy danh sách các yêu cầu dạy học của học sinh hiện tại.
 */
export const getMyTeachingRequests = async (): Promise<TeachingRequest[]> => {
   const response = await apiClient.get("/teachingRequest/student/me");
   const data = response.data;
   if (Array.isArray(data.metadata)) {
      return data.metadata;
   }
   if (Array.isArray(data.data)) {
      return data.data;
   }
   if (Array.isArray(data)) {
      return data;
   }
   return []; // Trả về mảng rỗng nếu không tìm thấy dữ liệu
};

/**
 * Tạo một yêu cầu dạy học mới.
 */
export const createTeachingRequest = async (
   payload: CreateTeachingRequestPayload
): Promise<TeachingRequest> => {
   const response = await apiClient.post("/teachingRequest", payload);
   return response.data.metadata;
};

/**
 * Lấy chi tiết một yêu cầu dạy học.
 */
export const getTeachingRequestById = async (
   id: string
): Promise<TeachingRequest | null> => {
   const response = await apiClient.get(`/teachingRequest/${id}`);
   const data = response.data ?? {};
   const payload = data?.metadata ?? data?.data ?? data;

   if (payload && typeof payload === "object" && (payload._id || payload.id)) {
      return payload as TeachingRequest;
   }

   return null;
};

// Lấy requests của tutor hiện tại
export const getTutorTeachingRequests = async (): Promise<
   TeachingRequest[]
> => {
   const response = await apiClient.get("/teachingRequest/tutor/me");
   const data = response.data;
   if (Array.isArray(data.metadata)) {
      return data.metadata;
   }
   if (Array.isArray(data.data)) {
      return data.data;
   }
   if (Array.isArray(data)) {
      return data;
   }
   return []; // Luôn trả về một mảng
};

// Tutor respond (ACCEPTED | REJECTED)
export const respondToTeachingRequest = async (
   requestId: string,
   decision: "ACCEPTED" | "REJECTED"
): Promise<TeachingRequest> => {
   const response = await apiClient.patch(
      `/teachingRequest/${requestId}/respond`,
      {
         decision,
      }
   );
   return response.data.metadata;
};

/**
 * Gửi yêu cầu hủy khóa học.
 */
export const requestCancellation = async (
   requestId: string,
   reason: string
): Promise<TeachingRequest> => {
   const response = await apiClient.post(
      `/teachingRequest/${requestId}/cancel`,
      { reason }
   );
   return response.data.metadata;
};

/**
 * Gửi yêu cầu hoàn thành khóa học.
 */
export const requestCompletion = async (
   requestId: string,
   reason?: string
): Promise<TeachingRequest> => {
   const response = await apiClient.post(
      `/teachingRequest/${requestId}/complete`,
      { reason }
   );
   return response.data.metadata;
};

/**
 * Xác nhận/Từ chối yêu cầu hủy.
 */
export const confirmCancellation = async (
   requestId: string,
   decision: "ACCEPTED" | "REJECTED",
   reason?: string // Thêm reason parameter
): Promise<TeachingRequest> => {
   const response = await apiClient.patch(
      `/teachingRequest/${requestId}/confirm-cancellation`,
      { decision, reason } // Gửi reason cùng với decision
   );
   return response.data.metadata;
};

/**
 * Xác nhận/Từ chối yêu cầu hoàn thành.
 */
export const confirmCompletion = async (
   requestId: string,
   decision: "ACCEPTED" | "REJECTED",
   reason?: string // Thêm reason parameter
): Promise<TeachingRequest> => {
   const response = await apiClient.patch(
      `/teachingRequest/${requestId}/confirm-completion`,
      { decision, reason } // Gửi reason cùng với decision
   );
   return response.data.metadata;
};

/**
 * Lấy yêu cầu dạy học đã hoàn thành giữa học sinh và gia sư (nếu có).
 */
export const getCompletedRequestBetween = async (
   studentUserId: string,
   tutorId: string
): Promise<TeachingRequest | null> => {
   const response = await apiClient.get(`/teachingRequest/completed/between`, {
      params: { studentUserId, tutorId },
   });

   const data = response.data;
   console.log("getCompletedRequestBetween response data:", data);

   //  Extract correctly from nested structure
   const payload =
      data?.data?.request ??
      data?.metadata ??
      data?.data ??
      data?.teachingRequest ??
      data;

   console.log("getCompletedRequestBetween payload:", payload);

   //  Return only if _id exists
   return payload && (payload._id || payload.id)
      ? (payload as TeachingRequest)
      : null;
};
