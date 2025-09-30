import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
   getMyTeachingRequests,
   getTutorTeachingRequests,
   createTeachingRequest,
   makeTrialDecision,
   respondToTeachingRequest,
   requestCancellation,
   requestCompletion,
   confirmCancellation,
   confirmCompletion,
   getTeachingRequestById,
} from "@/api/teachingRequest";
import { useToast } from "./useToast";
import { CreateTeachingRequestPayload } from "@/types/teachingRequest";

export const teachingRequestKeys = {
   all: ["teachingRequests"] as const,
   lists: () => [...teachingRequestKeys.all, "list"] as const,
   tutorLists: () => [...teachingRequestKeys.all, "tutor", "list"] as const,
   details: () => [...teachingRequestKeys.all, "detail"] as const,
   detail: (id: string) => [...teachingRequestKeys.details(), id] as const,
};

/**
 * Hook để lấy danh sách các yêu cầu dạy học của học sinh.
 */
export const useMyTeachingRequests = () => {
   return useQuery({
      queryKey: teachingRequestKeys.lists(),
      queryFn: getMyTeachingRequests,
      staleTime: 1000 * 60 * 5, // 5 phút
   });
};

/**
 * Hook để lấy chi tiết một yêu cầu.
 */
export const useTeachingRequestDetail = (id: string) => {
   return useQuery({
      queryKey: teachingRequestKeys.detail(id),
      queryFn: () => getTeachingRequestById(id),
      enabled: !!id,
   });
};

/**
 * Hook để tạo một yêu cầu dạy học mới.
 */
export const useCreateTeachingRequest = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   return useMutation({
      mutationFn: (payload: CreateTeachingRequestPayload) =>
         createTeachingRequest(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({
            queryKey: teachingRequestKeys.lists(),
         });
         addToast("success", "Gửi yêu cầu thành công!");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Gửi yêu cầu thất bại."
         );
      },
   });
};

/**
 * Hook để đưa ra quyết định sau buổi học thử.
 */
export const useMakeTrialDecision = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   return useMutation({
      mutationFn: ({
         requestId,
         decision,
      }: {
         requestId: string;
         decision: "ACCEPTED" | "REJECTED";
      }) => makeTrialDecision(requestId, decision),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: teachingRequestKeys.lists(),
         });
         queryClient.invalidateQueries({
            queryKey: teachingRequestKeys.detail(data._id),
         });
         addToast("success", "Đã gửi quyết định của bạn.");
      },
      onError: (error: any) => {
         addToast("error", error.response?.data?.message || "Có lỗi xảy ra.");
      },
   });
};

/**
 * Hook để yêu cầu hủy khóa học.
 */
export const useRequestCancellation = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();
   return useMutation({
      mutationFn: ({
         requestId,
         reason,
      }: {
         requestId: string;
         reason: string;
      }) => requestCancellation(requestId, reason),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: teachingRequestKeys.detail(data._id),
         });
         addToast("success", "Yêu cầu hủy đã được gửi.");
      },
      onError: (error: any) => {
         addToast("error", error.response?.data?.message || "Có lỗi xảy ra.");
      },
   });
};

/**
 * Hook để yêu cầu hoàn thành khóa học.
 */
export const useRequestCompletion = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();
   return useMutation({
      mutationFn: ({
         requestId,
         reason,
      }: {
         requestId: string;
         reason?: string;
      }) => requestCompletion(requestId, reason),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: teachingRequestKeys.detail(data._id),
         });
         addToast("success", "Yêu cầu hoàn thành đã được gửi.");
      },
      onError: (error: any) => {
         addToast("error", error.response?.data?.message || "Có lỗi xảy ra.");
      },
   });
};

/**
 * Hook để xác nhận hành động (hủy/hoàn thành).
 */
export const useConfirmAction = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();
   return useMutation({
      mutationFn: ({
         requestId,
         action,
         decision,
      }: {
         requestId: string;
         action: "cancellation" | "completion";
         decision: "ACCEPTED" | "REJECTED";
      }) =>
         action === "cancellation"
            ? confirmCancellation(requestId, decision)
            : confirmCompletion(requestId, decision),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: teachingRequestKeys.detail(data._id),
         });
         addToast("success", "Hành động của bạn đã được ghi nhận.");
      },
      onError: (error: any) => {
         addToast("error", error.response?.data?.message || "Có lỗi xảy ra.");
      },
   });
};

// Hook để tutor lấy danh sách requests dành cho họ
export const useTutorTeachingRequests = () => {
   return useQuery({
      queryKey: teachingRequestKeys.tutorLists(),
      queryFn: getTutorTeachingRequests,
      staleTime: 1000 * 60 * 2,
   });
};

// Hook để tutor respond request
export const useRespondToRequest = () => {
   const qc = useQueryClient();
   const toast = useToast();
   return useMutation({
      mutationFn: ({
         requestId,
         decision,
      }: {
         requestId: string;
         decision: "ACCEPTED" | "REJECTED";
      }) => respondToTeachingRequest(requestId, decision),
      onSuccess: (data) => {
         qc.invalidateQueries({ queryKey: teachingRequestKeys.tutorLists() });
         qc.invalidateQueries({
            queryKey: teachingRequestKeys.detail(data._id),
         });
         toast("success", "Đã phản hồi yêu cầu.");
      },
      onError: (err: any) => {
         toast("error", err.response?.data?.message || "Phản hồi thất bại.");
      },
   });
};
