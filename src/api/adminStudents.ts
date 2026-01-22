import apiClient from "@/lib/api";

// Interface cho student trong admin (dựa trên response thực tế)
export interface AdminStudent {
  _id: string;
  role: "STUDENT";
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

// Interface cho Student Profile
export interface StudentProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    phone?: string;
    gender?: string;
    address?: {
      city?: string;
      street?: string;
    };
    role: string;
    isBanned: boolean;
    bannedAt?: string;
    banReason?: string;
  };
  subjectsInterested?: string[];
  gradeLevel?: string;
  bio?: string;
  learningGoals?: string;
  availability?: any;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfileResponse {
  status: string;
  message: string;
  code: number;
  data: {
    student: StudentProfile;
    hasProfile: boolean;
    message: string;
  };
}

// Interface cho response pagination
export interface GetAllStudentsResponse {
  status: string;
  message: string;
  code: number;
  data: {
    users: AdminStudent[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

/**
 * Lấy danh sách tất cả học sinh
 */
export const getAllStudents = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<GetAllStudentsResponse> => {
  const response = await apiClient.get("/admin/users", {
    params: {
      role: "STUDENT",
      ...params,
    },
  });
  return response.data;
};

/**
 * Lấy danh sách học sinh đang hoạt động
 */
export const getActiveStudents = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<GetAllStudentsResponse> => {
  const response = await apiClient.get("/admin/students/active", {
    params,
  });
  return response.data;
};

/**
 * Lấy danh sách học sinh bị cấm
 */
export const getBannedStudents = async (params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<GetAllStudentsResponse> => {
  const response = await apiClient.get("/admin/students/banned", {
    params,
  });
  return response.data;
};

/**
 * Cấm học sinh
 */
export const banStudent = async (
  userId: string,
  reason: string
): Promise<{ success: boolean; message: string }> => {
  // Đảm bảo token được gửi
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("Không có token xác thực");
  }

  const response = await apiClient.post(`/admin/user/${userId}/ban`, {
    reason,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return response.data;
};

/**
 * Bỏ cấm học sinh (không cần lý do theo schema)
 */
export const unbanStudent = async (
  userId: string
): Promise<{ success: boolean; message: string }> => {
  // Đảm bảo token được gửi
  const token = localStorage.getItem("token");
  
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
  
  return response.data;
};

/**
 * Lấy chi tiết học sinh và lịch sử cấm
 */
export const getStudentDetail = async (
  userId: string
): Promise<{
  user: AdminStudent;
  banHistory: BanHistory[];
}> => {
  const response = await apiClient.get(`/admin/user/${userId}/ban-history`);
  return response.data;
};

/**
 * Lấy profile học sinh
 * GET /admin/student/:id
 */
export const getStudentProfile = async (
  studentId: string
): Promise<StudentProfileResponse> => {
  const response = await apiClient.get(`/admin/student/${studentId}`);
  return response.data;
};
