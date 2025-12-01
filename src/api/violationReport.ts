import apiClient from "@/lib/api";
import { ViolationTypeEnum } from "@/enums/violationReport.enum";

export interface CheckCanReportResponse {
   canReport: boolean;
   hasReported: boolean;
   reason?: string;
   existingReportId?: string;
}

export interface ExistingReportResponse {
   hasReport: boolean;
   report?: ViolationReport;
}

export interface SubmitViolationReportPayload {
   tutorId: string;
   type: ViolationTypeEnum;
   reason: string;
   evidenceFiles?: File[];
   relatedTeachingRequestId?: string;
}

export interface ViolationReport {
   _id: string;
   reporterId: string | {
      _id: string;
      name: string;
      email: string;
   };
   tutorId?: string;
   reportedUserId?: string | {
      _id: string;
      name: string;
      email: string;
   };
   type: ViolationTypeEnum | "OTHER";
   reason: string;
   evidenceFiles?: string[];
   relatedTeachingRequestId?: string | {
      _id: string;
      studentId: string;
      tutorId: string;
      subject: string;
      level: string;
      hourlyRate: number;
      description?: string;
      status: string;
      createdAt: string;
      updatedAt: string;
   };
   status: string;
   createdAt: string;
   updatedAt: string;
}

export interface PaginatedViolationReports {
   reports: ViolationReport[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
   };
}

/**
 * Kiểm tra xem có thể báo cáo gia sư không và đã báo cáo chưa
 */
export const checkCanReport = async (
   tutorId: string
): Promise<CheckCanReportResponse> => {
   try {
      const response = await apiClient.get(`/violationReport/check/${tutorId}`);
      // API trả về: { status, message, code, data: { canReport, hasReported, reason?, existingReportId? } }
      const data = response.data.data;
      return {
         canReport: data?.canReport ?? false,
         hasReported: data?.hasReported ?? false,
         reason: data?.reason,
         existingReportId: data?.existingReportId,
      };
   } catch (error) {
      console.error("Error checking can report:", error);
      return {
         canReport: false,
         hasReported: false,
      };
   }
};

/**
 * Gửi báo cáo vi phạm
 */
export const submitViolationReport = async (
   payload: SubmitViolationReportPayload
): Promise<ViolationReport> => {
   const hasFiles = payload.evidenceFiles && payload.evidenceFiles.length > 0;

   let requestData: FormData | Record<string, any>;
   let headers: Record<string, string> = {};

   if (hasFiles) {
      // Có file -> dùng FormData
      const formData = new FormData();
      formData.append("tutorId", payload.tutorId);
      formData.append("type", payload.type);
      formData.append("reason", payload.reason);
      
      if (payload.relatedTeachingRequestId) {
         formData.append("relatedTeachingRequestId", payload.relatedTeachingRequestId);
      }

      // Append files với tên field đúng
      payload.evidenceFiles!.forEach((file) => {
         formData.append("evidenceFiles", file, file.name);
      });

      // Log để debug
      console.log("FormData with files:", {
         fileCount: payload.evidenceFiles!.length,
         files: payload.evidenceFiles!.map(f => ({ name: f.name, size: f.size, type: f.type })),
      });

      requestData = formData;
      headers["Content-Type"] = "multipart/form-data";
   } else {
      // Không có file -> gửi JSON
      requestData = {
         tutorId: payload.tutorId,
         type: payload.type,
         reason: payload.reason,
      };
      
      if (payload.relatedTeachingRequestId) {
         requestData.relatedTeachingRequestId = payload.relatedTeachingRequestId;
      }

      headers["Content-Type"] = "application/json";
   }

   console.log("Submitting report:", {
      hasFiles,
      data: hasFiles ? "FormData" : requestData,
      headers,
   });

   try {
      const response = await apiClient.post("/violationReport", requestData, {
         headers,
      });

      console.log("Submit violation report response:", response.data);

      // API trả về: { status, message, code, data: { report: {...} } }
      const result = response.data.data?.report;
      
      if (!result) {
         console.error("Unexpected response structure:", response.data);
         throw new Error("Invalid response from server");
      }

      return result;
   } catch (error: any) {
      console.error("Error submitting violation report:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Request payload:", {
         tutorId: payload.tutorId,
         type: payload.type,
         hasFiles,
         filesCount: payload.evidenceFiles?.length || 0,
      });
      throw error;
   }
};

/**
 * Kiểm tra xem đã có báo cáo cho tutor này chưa
 */
export const checkExistingReport = async (
   tutorId: string
): Promise<ViolationReport | null> => {
   try {
      // Lấy tất cả reports để check xem có report nào cho tutor này không
      const response = await apiClient.get("/violationReport/my-reports", {
         params: { page: 1, limit: 100 }, // Lấy nhiều để check
      });

      const reports = response.data.data?.reports ?? [];
      
      // Tìm report cho tutor này
      const existingReport = reports.find((report: ViolationReport) => {
         const reportedTutorId = typeof report.reportedUserId === "object"
            ? report.reportedUserId._id
            : report.reportedUserId || report.tutorId;
         return reportedTutorId === tutorId;
      });

      return existingReport || null;
   } catch (error) {
      console.error("Error checking existing report:", error);
      return null;
   }
};

/**
 * Lấy danh sách báo cáo vi phạm của student hiện tại
 */
export const getMyViolationReports = async (
   page: number = 1,
   limit: number = 10
): Promise<PaginatedViolationReports> => {
   const response = await apiClient.get("/violationReport/my-reports", {
      params: { page, limit },
   });

   // API trả về: { status, message, code, data: { reports: [...], pagination: {...} } }
   return {
      reports: response.data.data?.reports ?? [],
      pagination: response.data.data?.pagination ?? {
         page: 1,
         limit: 10,
         total: 0,
         pages: 1,
      },
   };
};

/**
 * Admin: Lấy danh sách tất cả violation reports với filters
 */
export const getAdminViolationReports = async (params?: {
   page?: number;
   limit?: number;
   status?: string;
   type?: string;
}): Promise<PaginatedViolationReports> => {
   const response = await apiClient.get("/violationReport", {
      params: {
         page: params?.page || 1,
         limit: params?.limit || 20,
         ...(params?.status && { status: params.status }),
         ...(params?.type && { type: params.type }),
      },
   });

   // Response structure có thể là:
   // Option 1: { status, message, code, data: { reports: [...], pagination: {...} } }
   // Option 2: { status, message, code, data: { data: { reports: [...], pagination: {...} } } }
   // Option 3: { reports: [...], pagination: {...} } (trực tiếp)
   const responseData = response.data;
   
   // Thử các cấu trúc response khác nhau
   if (responseData.data?.reports) {
      // Option 1: response.data.data.reports
      return {
         reports: responseData.data.reports ?? [],
         pagination: responseData.data.pagination ?? {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: 0,
            pages: 1,
         },
      };
   } else if (responseData.data?.data?.reports) {
      // Option 2: response.data.data.data.reports
      return {
         reports: responseData.data.data.reports ?? [],
         pagination: responseData.data.data.pagination ?? {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: 0,
            pages: 1,
         },
      };
   } else if (responseData.reports) {
      // Option 3: response.data.reports (trực tiếp)
      return {
         reports: responseData.reports ?? [],
         pagination: responseData.pagination ?? {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: 0,
            pages: 1,
         },
      };
   }
   
   // Fallback: trả về empty
   console.warn("Unexpected response structure:", responseData);
   return {
      reports: [],
      pagination: {
         page: params?.page || 1,
         limit: params?.limit || 20,
         total: 0,
         pages: 1,
      },
   };
};

/**
 * Admin: Cập nhật status của violation report
 */
export const updateViolationReportStatus = async (
   reportId: string,
   status: "RESOLVED" | "REJECTED"
): Promise<ViolationReport> => {
   const response = await apiClient.patch(
      `/violationReport/${reportId}/status`,
      { status }
   );
   // Response structure: { status, message, code, data: { report: {...} } }
   return response.data.data?.report || response.data.data;
};

