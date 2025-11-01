import apiClient from "@/lib/api";
import { Material } from "@/types/material";

// Lấy danh sách tài liệu của gia sư
export const getMaterials = async (): Promise<Material[]> => {
   // Giả sử prefix của API là /materials
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
