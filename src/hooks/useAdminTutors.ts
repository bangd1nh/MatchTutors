import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllTutors,
  getActiveTutors,
  getBannedTutors,
  banTutor,
  unbanTutor,
  getTutorDetail,
  AdminTutor,
  BanHistory,
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

// Export các types
export type { AdminTutor, BanHistory };
