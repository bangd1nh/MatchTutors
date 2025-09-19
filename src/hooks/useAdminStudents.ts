import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import {
  getAllStudents,
  getActiveStudents,
  getBannedStudents,
  banStudent,
  unbanStudent,
  getStudentDetail,
  AdminStudent,
  BanHistory,
} from "@/api/adminStudents";

// Query keys
export const adminStudentKeys = {
  all: ["admin", "students"] as const,
  lists: () => [...adminStudentKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...adminStudentKeys.lists(), { filters }] as const,
  details: () => [...adminStudentKeys.all, "detail"] as const,
  detail: (id: string) => [...adminStudentKeys.details(), id] as const,
};

/**
 * Hook để lấy danh sách tất cả học sinh
 */
export const useGetAllStudents = (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: adminStudentKeys.list({ ...params, type: "all" }),
    queryFn: () => getAllStudents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy danh sách học sinh đang hoạt động
 */
export const useGetActiveStudents = (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: adminStudentKeys.list({ ...params, type: "active" }),
    queryFn: () => getActiveStudents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để lấy danh sách học sinh bị cấm
 */
export const useGetBannedStudents = (params?: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: adminStudentKeys.list({ ...params, type: "banned" }),
    queryFn: () => getBannedStudents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook để cấm học sinh
 */
export const useBanStudent = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      banStudent(userId, reason),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: adminStudentKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: adminStudentKeys.detail(variables.userId) 
      });
      
      toast("success", data.message || "Đã cấm học sinh thành công");
    },
    onError: (error: any) => {
      toast("error", error.response?.data?.message || "Có lỗi xảy ra khi cấm học sinh");
    },
  });
};

/**
 * Hook để bỏ cấm học sinh (không cần lý do theo schema)
 */
export const useUnbanStudent = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) =>
      unbanStudent(userId),
    onSuccess: (data, variables) => {
      // Invalidate và refetch các queries liên quan
      queryClient.invalidateQueries({ queryKey: adminStudentKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: adminStudentKeys.detail(variables.userId) 
      });
      
      toast("success", data.message || "Đã bỏ cấm học sinh thành công");
    },
    onError: (error: any) => {
      toast("error", error.response?.data?.message || "Có lỗi xảy ra khi bỏ cấm học sinh");
    },
  });
};

/**
 * Hook để lấy chi tiết học sinh
 */
export const useGetStudentDetail = (userId: string) => {
  return useQuery({
    queryKey: adminStudentKeys.detail(userId),
    queryFn: () => getStudentDetail(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Export các types
export type { AdminStudent, BanHistory };
