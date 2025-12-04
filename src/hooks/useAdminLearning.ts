import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
   getDisputedLearningCommitments,
   getResolvedLearningCommitments,
   getLearningCommitmentDetail,
   approveCancellation,
   rejectCancellation,
} from "@/api/adminLearning";
import { useToast } from "@/hooks/useToast";

export const useAdminLearning = (
   commitmentId?: string,
   options?: {
      disputedPage?: number;
      disputedLimit?: number;
      resolvedPage?: number;
      resolvedLimit?: number;
   }
) => {
   const queryClient = useQueryClient();
   const addToast = useToast();
   const navigate = useNavigate();

   // Pagination options (defaults)
   const {
      disputedPage = 1,
      disputedLimit = 10,
      resolvedPage = 1,
      resolvedLimit = 10,
   } = options ?? {};

   // Query to fetch disputed learning commitments
   const isListingMode = !commitmentId;

   const {
      data: disputedCommitments,
      isLoading: isLoadingDisputes,
      isError: isErrorDisputes,
   } = useQuery({
      queryKey: ["disputedLearningCommitments", disputedPage, disputedLimit],
      queryFn: () =>
         getDisputedLearningCommitments(disputedPage, disputedLimit),
      enabled: isListingMode,
   });

   const {
      data: resolvedCommitments,
      isLoading: isLoadingResolved,
      isError: isErrorResolved,
   } = useQuery({
      queryKey: ["resolvedLearningCommitments", resolvedPage, resolvedLimit],
      queryFn: () =>
         getResolvedLearningCommitments(resolvedPage, resolvedLimit),
      enabled: isListingMode,
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
      queryClient.invalidateQueries({
         queryKey: ["resolvedLearningCommitments"],
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
         setTimeout(() => {
            navigate("/admin/learning");
         }, 500);
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
         setTimeout(() => {
            navigate("/admin/learning");
         }, 500);
      },
      onError: (error: any) => {
         addToast("error", error.message || "Failed to reject cancellation.");
      },
   });

   return {
      disputedCommitments,
      isLoadingDisputes,
      isErrorDisputes,
      resolvedCommitments,
      isLoadingResolved,
      isErrorResolved,
      commitmentDetail,
      isLoadingDetail,
      isErrorDetail,
      approve,
      isApproving,
      reject,
      isRejecting,
   };
};
