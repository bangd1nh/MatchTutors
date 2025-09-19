import apiClient from "@/lib/api";

// Interface cho tutor trong admin (dựa trên response thực tế)
export interface AdminTutor {
  _id: string;
  role: "TUTOR";
  name: string;
  email: string;
  isBanned: boolean;
  isVerifiedEmail: boolean;
  isVerifiedPhoneNumber: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  address?: {
    city: string;
    street: string;
  };
  avatarUrl?: string;
  gender?: string;
  phone?: string;
  banReason?: string;
  bannedAt?: string;
}

// Interface cho ban history
export interface BanHistory {
  _id: string;
  userId: string;
  bannedBy: string;
  reason: string;
  bannedAt: Date;
  unbannedAt?: Date;
  unbannedBy?: string;
}

// Interface cho response của getAllTutors (dựa trên response thực tế)
export interface GetAllTutorsResponse {
  status: string;
  message: string;
  code: number;
  data: {
    users: AdminTutor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

/**
 * Lấy tất cả gia sư với role TUTOR
 */
export const getAllTutors = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetAllTutorsResponse> => {
  const response = await apiClient.get("/admin/users", {
    params: {
      role: "TUTOR",
      ...params,
    },
  });
  return response.data;
};

/**
 * Lấy danh sách gia sư đang hoạt động (isBanned: false)
 */
export const getActiveTutors = async (params?: {
  page?: number;
  limit?: number;
}): Promise<GetAllTutorsResponse> => {
  // Có thể sử dụng getAllTutors và filter, hoặc có endpoint riêng
  const response = await apiClient.get("/admin/users", {
    params: {
      role: "TUTOR",
      isBanned: false,
      ...params,
    },
  });
  return response.data;
};

/**
 * Lấy danh sách gia sư bị cấm (isBanned: true)
 */
export const getBannedTutors = async (params?: {
  page?: number;
  limit?: number;
}): Promise<GetAllTutorsResponse> => {
  // Có thể sử dụng getAllTutors và filter, hoặc có endpoint riêng
  const response = await apiClient.get("/admin/users", {
    params: {
      role: "TUTOR",
      isBanned: true,
      ...params,
    },
  });
  return response.data;
};

/**
 * Cấm gia sư
 */
export const banTutor = async (
  userId: string,
  reason: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post(`/admin/user/${userId}/ban`, {
    reason,
  });
  return response.data;
};

/**
 * Bỏ cấm gia sư (không cần lý do theo schema)
 */
export const unbanTutor = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  // Đảm bảo token được gửi
  const token = localStorage.getItem("token");
  console.log('Unban request - Token exists:', !!token);
  console.log('Unban request - Token preview:', token?.substring(0, 20) + '...');
  
  if (!token) {
    throw new Error("Không có token xác thực");
  }

  // Unban không cần body theo schema, chỉ cần userId trong params
  const response = await apiClient.post(`/admin/user/${userId}/unban`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('Unban response:', response.data);
  return response.data;
};

/**
 * Lấy chi tiết gia sư và lịch sử cấm
 */
export const getTutorDetail = async (
  userId: string
): Promise<{
  tutor: AdminTutor;
  banHistory: BanHistory[];
}> => {
  const response = await apiClient.get(`/admin/user/${userId}/ban-history`);
  return response.data;
};

// Export default object chứa tất cả functions
export default {
  getAllTutors,
  getActiveTutors,
  getBannedTutors,
  banTutor,
  unbanTutor,
  getTutorDetail,
};
