import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
   getDisputedLearningCommitments,
   getLearningCommitmentDetail,
   approveCancellation,
   rejectCancellation,
} from "@/api/adminLearning";
import { useToast } from "@/hooks/useToast";

export const useAdminLearning = (commitmentId?: string) => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   // Query to fetch disputed learning commitments
   const {
      data: disputedCommitments,
      isLoading: isLoadingDisputes,
      isError: isErrorDisputes,
   } = useQuery({
      queryKey: ["disputedLearningCommitments"],
      queryFn: () => getDisputedLearningCommitments(),
      enabled: !commitmentId, // Only run if no specific ID is provided
   });

   // Query to fetch a single learning commitment detail
   const {
      data: commitmentDetail,
      isLoading: isLoadingDetail,
      isError: isErrorDetail,
   } = useQuery({
      queryKey: ["learningCommitmentDetail", commitmentId],
      queryFn: () => getLearningCommitmentDetail(commitmentId!),
      enabled: !!commitmentId, // Only run if an ID is provided
   });

   const invalidateQueries = () => {
      queryClient.invalidateQueries({
         queryKey: ["disputedLearningCommitments"],
      });
      if (commitmentId) {
         queryClient.invalidateQueries({
            queryKey: ["learningCommitmentDetail", commitmentId],
         });
      }
   };

   // Mutation for approving cancellation
   const { mutate: approve, isPending: isApproving } = useMutation({
      mutationFn: ({ id, notes }: { id: string; notes: string }) =>
         approveCancellation(id, notes),
      onSuccess: (data) => {
         addToast("success", data.message);
         invalidateQueries();
      },
      onError: (error: any) => {
         addToast("error", error.message || "Failed to approve cancellation.");
      },
   });

   // Mutation for rejecting cancellation
   const { mutate: reject, isPending: isRejecting } = useMutation({
      mutationFn: ({ id, notes }: { id: string; notes: string }) =>
         rejectCancellation(id, notes),
      onSuccess: (data) => {
         addToast("success", data.message);
         invalidateQueries();
      },
      onError: (error: any) => {
         addToast("error", error.message || "Failed to reject cancellation.");
      },
   });

   return {
      disputedCommitments,
      isLoadingDisputes,
      isErrorDisputes,
      commitmentDetail,
      isLoadingDetail,
      isErrorDetail,
      approve,
      isApproving,
      reject,
      isRejecting,
   };
};
