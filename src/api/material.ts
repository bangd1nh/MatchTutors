import apiClient from "@/lib/api";
import { Material } from "@/types/material";

export interface PaginatedMaterials {
   items: Material[];
   total: number;
   page: number;
   totalPages: number;
   limit: number;
}

// Lấy danh sách tài liệu của gia sư (hỗ trợ phân trang)
export const getMaterials = async (
   page = 1,
   limit = 10
): Promise<PaginatedMaterials> => {
   const response = await apiClient.get("/material", {
      params: { page, limit },
   });
   return response.data.data;
};

// Tải tài liệu lên
export const uploadMaterial = async (formData: FormData): Promise<Material> => {
   const response = await apiClient.post("/material/upload", formData, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
   });
   return response.data.data;
};

// Thêm tài liệu vào buổi học
export const addMaterialToSession = async (
   sessionId: string,
   materialId: string
): Promise<any> => {
   const response = await apiClient.post(`/material/sessions/${sessionId}`, {
      materialId,
   });
   return response.data.data;
};

// Gỡ tài liệu khỏi buổi học
export const removeMaterialFromSession = async (
   sessionId: string,
   materialId: string
): Promise<any> => {
   const response = await apiClient.delete(`/material/sessions/${sessionId}`, {
      data: { materialId },
   });
   return response.data.data;
};

// Lấy danh sách tài liệu của buổi học
export const getMaterialsBySessionId = async (sessionId: string) => {
   const response = await apiClient.get(
      `/material/sessions/${sessionId}/materials`
   );
   return response.data?.data || [];
};

//  deleteMaterial -->
export const deleteMaterial = async (materialId: string) => {
   const response = await apiClient.delete(`/material/${materialId}`);
   return response.data.data;
};
