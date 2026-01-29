import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
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
  getTutorFullDetails,
  getTutorLearningCommitments,
  getTutorSessions,
  getTutorTeachingRequests,
  getTutorViolationReports,
  getTutorReviews,
  getTutorStatistics,
  AdminTutor,
  BanHistory,
  TutorProfile,
  TutorActionResponse,
  TutorMapping,
  TutorMappingResponse,
  GetTutorByIdResponse,
} from "@/api/adminTutors";
import { useToast } from "@/hooks/useToast";

// Query keys
export const adminTutorKeys = {
  all: ["adminTutors"] as const,
  lists: () => [...adminTutorKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...adminTutorKeys.lists(), { filters }] as const,
  active: () => [...adminTutorKeys.all, "active"] as const,
  banned: () => [...adminTutorKeys.all, "banned"] as const,
  detail: (id: string) => [...adminTutorKeys.all, "detail", id] as const,
  tutorById: (id: string) => [...adminTutorKeys.all, "tutor", id] as const,
  mapping: (params?: Record<string, any>) => [...adminTutorKeys.all, "mapping", params] as const,
  fullDetails: (id: string) => [...adminTutorKeys.all, "fullDetails", id] as const,
  commitments: (id: string, params?: Record<string, any>) => [...adminTutorKeys.all, "commitments", id, params] as const,
  sessions: (id: string, params?: Record<string, any>) => [...adminTutorKeys.all, "sessions", id, params] as const,
  teachingRequests: (id: string, params?: Record<string, any>) => [...adminTutorKeys.all, "teachingRequests", id, params] as const,
  reports: (id: string, params?: Record<string, any>) => [...adminTutorKeys.all, "reports", id, params] as const,
  reviews: (id: string, params?: Record<string, any>) => [...adminTutorKeys.all, "reviews", id, params] as const,
  statistics: (id: string, params?: Record<string, any>) => [...adminTutorKeys.all, "statistics", id, params] as const,
};

/**
 * Hook để lấy tất cả gia sư
 */
export const useGetAllTutors = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: adminTutorKeys.list(params || {}),
    queryFn: () => getAllTutors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy gia sư đang hoạt động
 */
export const useGetActiveTutors = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...adminTutorKeys.active(), params],
    queryFn: () => getActiveTutors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy gia sư bị cấm
 */
export const useGetBannedTutors = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [...adminTutorKeys.banned(), params],
    queryFn: () => getBannedTutors(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy chi tiết gia sư và lịch sử cấm
 */
export const useGetTutorDetail = (userId: string) => {
  return useQuery({
    queryKey: adminTutorKeys.detail(userId),
    queryFn: () => getTutorDetail(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để cấm gia sư
 */
export const useBanTutor = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      banTutor(userId, reason),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: adminTutorKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: adminTutorKeys.detail(variables.userId) 
      });
      
      toast("success", data.message || "Đã cấm gia sư thành công");
    },
    onError: (error: any) => {
      toast("error", error.response?.data?.message || "Có lỗi xảy ra khi cấm gia sư");
    },
  });
};

/**
 * Hook để bỏ cấm gia sư (không cần lý do theo schema)
 */
export const useUnbanTutor = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      unbanTutor(userId),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: adminTutorKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: adminTutorKeys.detail(variables.userId) 
      });
      
      toast("success", data.message || "Đã bỏ cấm gia sư thành công");
    },
    onError: (error: any) => {
      toast("error", error.response?.data?.message || "Có lỗi xảy ra khi bỏ cấm gia sư");
    },
  });
};

/**
 * Hook để lấy thông tin chi tiết gia sư theo tutorId
 */
export const useGetTutorById = (tutorId: string) => {
  return useQuery({
    queryKey: adminTutorKeys.tutorById(tutorId),
    queryFn: () => getTutorById(tutorId),
    enabled: !!tutorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để chấp nhận gia sư
 */
export const useAcceptTutor = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (tutorId: string) => acceptTutor(tutorId),
    onSuccess: (data, tutorId) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: adminTutorKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: adminTutorKeys.tutorById(tutorId) 
      });
      
      toast("success", data.message || "Đã chấp nhận gia sư thành công");
    },
    onError: (error: any) => {
      toast("error", error.response?.data?.message || "Có lỗi xảy ra khi chấp nhận gia sư");
    },
  });
};

/**
 * Hook để từ chối gia sư
 */
export const useRejectTutor = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ tutorId, reason }: { tutorId: string; reason: string }) =>
      rejectTutor(tutorId, reason),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: adminTutorKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: adminTutorKeys.tutorById(variables.tutorId) 
      });
      
      toast("success", data.message || "Đã từ chối gia sư thành công");
    },
    onError: (error: any) => {
      toast("error", error.response?.data?.message || "Có lỗi xảy ra khi từ chối gia sư");
    },
  });
};

/**
 * Hook để lấy danh sách tutors với userId và tutorId mapping
 */
export const useGetTutorMapping = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: adminTutorKeys.mapping(params),
    queryFn: () => getTutorMapping(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy thông tin đầy đủ của gia sư
 */
export const useGetTutorFullDetails = (tutorId: string) => {
  return useQuery({
    queryKey: adminTutorKeys.fullDetails(tutorId),
    queryFn: () => getTutorFullDetails(tutorId),
    enabled: !!tutorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook để lấy danh sách learning commitments của gia sư
 */
export const useGetTutorLearningCommitments = (
  tutorId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }
) => {
  return useQuery({
    queryKey: adminTutorKeys.commitments(tutorId, params),
    queryFn: () => getTutorLearningCommitments(tutorId, params),
    enabled: !!tutorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook để lấy danh sách sessions của gia sư
 */
export const useGetTutorSessions = (
  tutorId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: adminTutorKeys.sessions(tutorId, params),
    queryFn: () => getTutorSessions(tutorId, params),
    enabled: !!tutorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook để lấy danh sách teaching requests của gia sư
 */
export const useGetTutorTeachingRequests = (
  tutorId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }
) => {
  return useQuery({
    queryKey: adminTutorKeys.teachingRequests(tutorId, params),
    queryFn: () => getTutorTeachingRequests(tutorId, params),
    enabled: !!tutorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook để lấy danh sách violation reports của gia sư
 */
export const useGetTutorViolationReports = (
  tutorId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }
) => {
  return useQuery({
    queryKey: adminTutorKeys.reports(tutorId, params),
    queryFn: () => getTutorViolationReports(tutorId, params),
    enabled: !!tutorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook để lấy danh sách reviews của gia sư
 */
export const useGetTutorReviews = (
  tutorId: string,
  params?: {
    page?: number;
    limit?: number;
    rating?: number;
    type?: string;
  }
) => {
  return useQuery({
    queryKey: adminTutorKeys.reviews(tutorId, params),
    queryFn: () => getTutorReviews(tutorId, params),
    enabled: !!tutorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook để lấy thống kê của gia sư
 */
export const useGetTutorStatistics = (tutorId: string) => {
  return useQuery({
    queryKey: adminTutorKeys.statistics(tutorId),
    queryFn: () => getTutorStatistics(tutorId),
    enabled: !!tutorId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};


// Export các types
export type { 
  AdminTutor, 
  BanHistory, 
  TutorProfile, 
  TutorActionResponse,
  TutorMapping,
  TutorMappingResponse,
  GetTutorByIdResponse,
};
