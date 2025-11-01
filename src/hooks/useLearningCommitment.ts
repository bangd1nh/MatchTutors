import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { learningCommitmentApi } from "@/api/learningCommitment";
import {
   CreateLearningCommitmentRequest,
   LearningCommitment,
} from "@/types/learningCommitment";

import { useToast } from "@/hooks/useToast";

export const useLearningCommitments = (
   page: number = 1,
   limit: number = 10
) => {
   return useQuery<any, unknown, LearningCommitment[]>({
      queryKey: ["learningCommitment", page, limit],
      queryFn: () => learningCommitmentApi.getByUser(page, limit),
      // Backend returns { items: [...], total, page, limit, pages }
      select: (data) => {
         console.log("Raw API response:", data); // Debug
         const items = data?.items ?? [];
         return Array.isArray(items) ? items : [];
      },
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
         addToast("success", "Learning commitment created successfully");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message ||
               "Failed to create learning commitment"
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
         addToast("success", "Payment initiated successfully");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Failed to initiate payment"
         );
      },
   });
};

export const useRequestCancellation = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   return useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) =>
         learningCommitmentApi.requestCancellation(id, reason),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["learningCommitment"] });
         addToast("success", "Cancellation request submitted successfully");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Failed to request cancellation"
         );
      },
   });
};

export const useRejectCancellation = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   return useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) =>
         learningCommitmentApi.rejectCancellation(id, reason),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["learningCommitment"] });
         addToast("success", "Cancellation rejected and escalated to admin");
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data?.message || "Failed to reject cancellation"
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
