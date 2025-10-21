import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import {
   getRequestsForAdminReview,
   getResolvedRequests,
   getRecentlyResolvedRequests,
   resolveAdminReview,
   AdminTeachingRequest,
   ResolveRequestPayload,
   getAdminReviewHistory,
} from "@/api/adminTeachingRequest";

// Query keys
export const adminTeachingRequestKeys = {
   all: ["admin", "teachingRequests"] as const,
   lists: () => [...adminTeachingRequestKeys.all, "list"] as const,
   pending: (params?: Record<string, unknown>) =>
      [...adminTeachingRequestKeys.lists(), "pending", params] as const,
   resolved: (params?: Record<string, unknown>) =>
      [...adminTeachingRequestKeys.lists(), "resolved", params] as const,
   recentlyResolved: (params?: Record<string, unknown>) =>
      [
         ...adminTeachingRequestKeys.lists(),
         "recently-resolved",
         params,
      ] as const,
};

/**
 * Hook để lấy danh sách teaching requests cần admin review
 */
export const useGetPendingRequests = (params?: {
   page?: number;
   limit?: number;
}) => {
   return useQuery({
      queryKey: adminTeachingRequestKeys.pending(params),
      queryFn: () => getRequestsForAdminReview(params),
      staleTime: 2 * 60 * 1000, // 2 minutes
   });
};

/**
 * Hook để lấy danh sách teaching requests đã được xử lý
 */
export const useGetResolvedRequests = (params?: {
   page?: number;
   limit?: number;
}) => {
   return useQuery({
      queryKey: adminTeachingRequestKeys.resolved(params),
      queryFn: () => getResolvedRequests(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
   });
};

/**
 * Hook để lấy danh sách teaching requests vừa được xử lý
 */
export const useGetRecentlyResolvedRequests = (params?: {
   page?: number;
   limit?: number;
}) => {
   return useQuery({
      queryKey: adminTeachingRequestKeys.recentlyResolved(params),
      queryFn: () => getRecentlyResolvedRequests(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
   });
};

/**
 * Hook để admin xử lý review request
 */
export const useResolveAdminReview = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   return useMutation({
      mutationFn: ({
         requestId,
         payload,
      }: {
         requestId: string;
         payload: ResolveRequestPayload;
      }) => resolveAdminReview(requestId, payload),
      onSuccess: (data) => {
         // Invalidate và refetch các queries liên quan
         queryClient.invalidateQueries({
            queryKey: adminTeachingRequestKeys.all,
         });

         toast("success", data.message || "Đã xử lý yêu cầu thành công");
      },
      onError: (error: any) => {
         toast(
            "error",
            error.response?.data?.message || "Có lỗi xảy ra khi xử lý yêu cầu"
         );
      },
   });
};

/**
 * Hook để lấy lịch sử admin review
 */
export const useGetAdminReviewHistory = (requestId: string) => {
   return useQuery({
      queryKey: [...adminTeachingRequestKeys.all, "history", requestId],
      queryFn: () => getAdminReviewHistory(requestId),
      enabled: !!requestId,
      staleTime: 5 * 60 * 1000, // 5 minutes
   });
};

// Export types
export type { AdminTeachingRequest, ResolveRequestPayload };
