import apiClient from "@/lib/api";
import { Material } from "@/types/material";

// Lấy danh sách tài liệu của gia sư
export const getMaterials = async (): Promise<Material[]> => {
   const response = await apiClient.get("/material");
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
