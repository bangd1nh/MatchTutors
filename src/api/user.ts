import apiClient from "@/lib/api";
import { IUser } from "@/types/user";

/**
 * Lấy thông tin hồ sơ của người dùng hiện tại (đã xác thực).
 */
export const getMyProfile = async (): Promise<IUser | null> => {
   const response = await apiClient.get("/user/me");
   // Sửa ở đây: Lấy user từ `response.data.data.user`
   return response.data?.data?.user || null;
};

/**
 * Cập nhật thông tin hồ sơ của người dùng hiện tại.
 * @param payload Dữ liệu cập nhật, bao gồm name, phone và avatar (File).
 */
export const updateMyProfile = async (payload: {
   name?: string;
   phone?: string;
   avatar?: File;
   gender?: string;
   address?: { city?: string; street?: string };
}): Promise<IUser | null> => {
   const formData = new FormData();

   if (payload.name) {
      formData.append("name", payload.name);
   }
   if (payload.phone) {
      formData.append("phone", payload.phone);
   }
   if (payload.gender) {
      formData.append("gender", payload.gender);
   }
   if (payload.address) {
      // backend expects an object; serialize as JSON
      formData.append("address", JSON.stringify(payload.address));
   }

   if (payload.avatar) {
      formData.append("avatar", payload.avatar);
   }

   const response = await apiClient.put("/user/me", formData, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
   });

   return response.data?.data?.user || null;
};
