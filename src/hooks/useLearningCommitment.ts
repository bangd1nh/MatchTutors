import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { learningCommitmentApi } from "@/api/learningCommitment";
import {
   CreateLearningCommitmentRequest,
   PaginatedLearningCommitments,
} from "@/types/learningCommitment";

import { useToast } from "@/hooks/useToast";

export const useLearningCommitments = (
   page: number = 1,
   limit: number = 10
) => {
   return useQuery<PaginatedLearningCommitments, unknown>({
      queryKey: ["learningCommitment", page, limit],
      queryFn: () => learningCommitmentApi.getByUser(page, limit),
      // Backend returns { items: [...], total, page, limit, pages }
      select: (data) => {
         return {
            ...data,
            items: Array.isArray(data?.items) ? data.items : [],
         };
      },
      placeholderData: (previousData) => previousData,
   });
};

export const useLearningCommitment = (id: string) => {
   return useQuery({
      queryKey: ["learningCommitment", id],
      queryFn: () => learningCommitmentApi.getById(id),
      enabled: !!id,
   });
};

export const useCreateLearningCommitment = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   return useMutation({
      mutationFn: (data: CreateLearningCommitmentRequest) =>
         learningCommitmentApi.create(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["learningCommitment"] });
         addToast("success", "Tạo cam kết học tập thành công");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Lỗi khi tạo cam kết"
         );
      },
   });
};

export const useInitiatePayment = () => {
   const addToast = useToast();

   return useMutation({
      mutationFn: (id: string) => learningCommitmentApi.initiatePayment(id),
      onSuccess: (data) => {
         window.open(data.paymentLink, "_blank");
         addToast("success", "Tạo link thanh toán thành công");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Thất bại khi tạo link thanh toán"
         );
      },
   });
};

export const useInitiateTopUp = () => {
   const addToast = useToast();

   return useMutation({
      mutationFn: ({
         id,
         additionalSessions,
         amount,
      }: {
         id: string;
         additionalSessions: number;
         amount: number;
      }) => learningCommitmentApi.initiateTopUp(id, additionalSessions, amount),
      onSuccess: (data) => {
         window.open(data.paymentLink, "_blank");
         addToast("success", "Tạo link top-up thành công");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Thất bại khi tạo link top-up"
         );
      },
   });
};

export const useRequestCancellation = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   return useMutation({
      mutationFn: ({
         id,
         reason,
         linkUrl,
      }: {
         id: string;
         reason: string;
         linkUrl?: string;
      }) => learningCommitmentApi.requestCancellation(id, reason, linkUrl),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["learningCommitment"] });
         addToast("success", "Nộp yêu cầu huỷ thành công");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Thất bại khi gửi yêu cầu huỷ"
         );
      },
   });
};

export const useRejectCancellation = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   return useMutation({
      mutationFn: ({
         id,
         reason,
         linkUrl,
      }: {
         id: string;
         reason: string;
         linkUrl?: string;
      }) => learningCommitmentApi.rejectCancellation(id, reason, linkUrl),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["learningCommitment"] });
         addToast(
            "success",
            "Từ chối yêu cầu huỷ và gửi quản trị viên xem xét thành công"
         );
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Thất bại khi từ chối yêu cầu huỷ"
         );
      },
   });
};

export const useRejectLearningCommitment = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   return useMutation({
      mutationFn: (id: string) =>
         learningCommitmentApi.rejectLearningCommitment(id),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["learningCommitment"] });
         addToast("success", "Từ chối cam kết học thành công");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "thất bại khi từ chối cam kết học"
         );
      },
   });
};

export const useTeachingRequestsByTutor = () => {
   return useQuery({
      queryKey: ["teachingRequests"],
      queryFn: () => learningCommitmentApi.getTeachingRequestsByTutor(),
   });
};

export const useActiveLearningCommitmentsByTutor = () => {
   return useQuery({
      queryKey: ["learningCommitment", "tutor", "active"],
      queryFn: () =>
         learningCommitmentApi.getActiveLearningCommitmentsByTutor(),
   });
};
