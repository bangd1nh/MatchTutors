import apiClient from "@/lib/api";
import {
   CreateTeachingRequestPayload,
   TeachingRequest,
   TeachingRequestList,
} from "@/types/teachingRequest";

/**
 * Lấy danh sách các yêu cầu dạy học của học sinh hiện tại.
 */
export const getMyTeachingRequests = async (
   page?: number,
   limit?: number
): Promise<TeachingRequestList> => {
   const response = await apiClient.get("/teachingRequest/student/me", {
      params: { page, limit },
   });

   const raw = response.data ?? {};

   const payload =
      raw?.data?.data ??
      raw?.data ??
      raw?.metadata?.data ??
      raw?.metadata ??
      raw;

   if (payload && Array.isArray(payload.data)) {
      return {
         data: payload.data,
         pagination: payload.pagination ?? {
            page: page ?? 1,
            limit: limit ?? payload.data.length,
            total: payload.pagination?.total ?? payload.data.length,
            totalPages: payload.pagination?.totalPages ?? 1,
         },
      };
   }

   if (Array.isArray(payload)) {
      return {
         data: payload,
         pagination: {
            page: page ?? 1,
            limit: limit ?? payload.length,
            total: payload.length,
            totalPages: 1,
         },
      };
   }

   if (raw?.data && Array.isArray(raw.data)) {
      return {
         data: raw.data,
         pagination: raw.pagination ?? {
            page: page ?? 1,
            limit: limit ?? raw.data.length,
            total: raw.total ?? raw.data.length,
            totalPages: raw.totalPages ?? 1,
         },
      };
   }

   return {
      data: [],
      pagination: {
         page: page ?? 1,
         limit: limit ?? 10,
         total: 0,
         totalPages: 1,
      },
   };
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

/**
 * Lấy requests của tutor hiện tại (hỗ trợ phân trang)
 */
export const getTutorTeachingRequests = async (
   page?: number,
   limit?: number
): Promise<TeachingRequestList> => {
   const response = await apiClient.get("/teachingRequest/tutor/me", {
      params: { page, limit },
   });

   const raw = response.data ?? {};

   // Giải cấu trúc các biến thể response:
   // - { data: { data: [...], pagination: {...} } }
   // - { metadata: { data: [...], pagination: {...} } }
   // - hoặc trả thẳng array
   const payload =
      raw?.data?.data ??
      raw?.data ??
      raw?.metadata?.data ??
      raw?.metadata ??
      raw;

   // Nếu payload có field data (mặc định backend điền vào), dùng đó
   if (payload && Array.isArray(payload.data)) {
      return {
         data: payload.data,
         pagination: payload.pagination || {
            page: page ?? 1,
            limit: limit ?? payload.data.length,
            total: payload.pagination?.total ?? payload.data.length,
            totalPages: payload.pagination?.totalPages ?? 1,
         },
      };
   }

   // Nếu payload chính là mảng
   if (Array.isArray(payload)) {
      return {
         data: payload,
         pagination: {
            page: page ?? 1,
            limit: limit ?? payload.length,
            total: payload.length,
            totalPages: 1,
         },
      };
   }

   // Nếu payload có dạng { data: [...], pagination: {...} } (raw.data)
   if (raw?.data && Array.isArray(raw.data)) {
      return {
         data: raw.data,
         pagination: raw.pagination || {
            page: page ?? 1,
            limit: limit ?? raw.data.length,
            total: raw.total ?? raw.data.length,
            totalPages: raw.totalPages ?? 1,
         },
      };
   }

   // Fallback: trả rỗng với pagination mặc định
   return {
      data: [],
      pagination: {
         page: page ?? 1,
         limit: limit ?? 10,
         total: 0,
         totalPages: 1,
      },
   };
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

/**
 * Lấy thông tin profile của học sinh từ teaching request.
 */
export const getStudentProfile = async (
   studentUserId: string
): Promise<any> => {
   const response = await apiClient.get(
      `/teachingRequest/student-profile/${studentUserId}`
   );
   return response.data.data || response.data.metadata;
};
