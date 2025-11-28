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

// Interface cho tutor profile chi tiết
export interface TutorProfile {
  _id: string;
  userId: string;
  subjects: string[];
  levels: string[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  certifications: {
    _id: string;
    name: string;
    description: string;
    imageUrls: string[];
  }[];
  experienceYears: number;
  hourlyRate: number;
  bio: string;
  classType: string[];
  availability: {
    dayOfWeek: number;
    slots: string[];
  }[];
  isApproved: boolean;
  isBanned: boolean;
  ratings: {
    average: number;
    totalReviews: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Interface cho response accept/reject
export interface TutorActionResponse {
  success: boolean;
  message: string;
}

// Interface cho tutor mapping
export interface TutorMapping {
  userId: string;
  tutorId: string | null;
  hasProfile: boolean;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    phone?: string;
    gender?: string;
    address?: {
      city: string;
      street: string;
    };
    role: string;
    isBanned: boolean;
    createdAt: string;
  };
  tutor: any | null; // Tutor profile data if hasProfile is true
}

// Interface cho response mapping
export interface TutorMappingResponse {
  status: string;
  message: string;
  code: number;
  data: {
    tutors: TutorMapping[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Interface cho response getTutorById
export interface GetTutorByIdResponse {
  status: string;
  message: string;
  code: number;
  data: {
    tutor: TutorProfile & {
      userId: {
        _id: string;
        role: string;
        name: string;
        email: string;
        isBanned: boolean;
        address?: {
          city: string;
          street: string;
        };
        avatarUrl?: string;
        gender?: string;
        phone?: string;
      };
    };
    hasProfile: boolean;
    message: string;
  };
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

/**
 * Lấy thông tin chi tiết gia sư theo tutorId
 */
export const getTutorById = async (
  tutorId: string
): Promise<GetTutorByIdResponse> => {
  const response = await apiClient.get(`/admin/tutor/${tutorId}`);
  return response.data;
};

/**
 * Chấp nhận gia sư
 */
export const acceptTutor = async (
  tutorId: string
): Promise<TutorActionResponse> => {
  const response = await apiClient.post(`/admin/tutor/${tutorId}/accept`);
  return response.data;
};

/**
 * Từ chối gia sư
 */
export const rejectTutor = async (
  tutorId: string,
  reason: string
): Promise<TutorActionResponse> => {
  const response = await apiClient.post(`/admin/tutor/${tutorId}/reject`, {
    reason,
  });
  return response.data;
};

/**
 * Lấy danh sách tutors với userId và tutorId mapping
 */
export const getTutorMapping = async (params?: {
  page?: number;
  limit?: number;
}): Promise<TutorMappingResponse> => {
  const response = await apiClient.get('/admin/tutors/mapping', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 50,
    },
  });
  return response.data;
};

/**
 * Ẩn tutor (khi đồng ý với violation report)
 * Sẽ hủy tất cả learning commitments đang active,
 * hủy tất cả sessions chưa học,
 * và từ chối tất cả teaching requests đang pending
 */
export const hideTutor = async (
  tutorId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.post(`/admin/tutor/${tutorId}/hide`);
  return response.data;
};

/**
 * Lấy tutorId từ userId (để dùng với hideTutor)
 */
export const getTutorIdByUserId = async (
  userId: string
): Promise<string | null> => {
  try {
    const mappingResponse = await getTutorMapping({ page: 1, limit: 1000 });
    const tutor = mappingResponse.data?.tutors?.find(
      (t: TutorMapping) => t.userId === userId
    );
    return tutor?.tutorId || null;
  } catch (error) {
    console.error("Error getting tutorId by userId:", error);
    return null;
  }
};

// Export default object chứa tất cả functions
export default {
  getAllTutors,
  getActiveTutors,
  getBannedTutors,
  banTutor,
  unbanTutor,
  getTutorDetail,
  getTutorById,
  acceptTutor,
  rejectTutor,
  getTutorMapping,
  hideTutor,
  getTutorIdByUserId,
};
