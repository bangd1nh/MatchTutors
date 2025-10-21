import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createReview,
    getTutorReviews,
    getTutorRatingStats,
    getStudentReviewHistory,
    updateReview,
    getMyTutorReviews,
} from "@/api/review";
import { useUser } from "./useUser";
import { Role } from "@/types/user";

export const useReview = (tutorId?: string, filters?: {
    page?: number;
    limit?: number;
    keyword?: string;
    subjects?: string[];
    levels?: string[];
    minRating?: number;
    maxRating?: number;
    sort?: "newest" | "oldest";
    rating?: string; // specific rating filter
}) => {
    const queryClient = useQueryClient();
    const { user } = useUser();

    // Tutor’s reviews (public)
    const {
        data: tutorReviews,
        isLoading: isTutorReviewsLoading,
        refetch: refetchTutorReviews,
    } = useQuery({
        queryKey: ["tutorReviews", tutorId],
        queryFn: () => getTutorReviews(tutorId!),
        enabled: !!tutorId,
    });

    // Tutor’s own reviews — backend handles all filters
    const {
        data: myTutorReviews,
        isLoading: isMyTutorReviewsLoading,
        refetch: refetchMyTutorReviews,
    } = useQuery({
        queryKey: ["myTutorReviews", filters],
        queryFn: () => getMyTutorReviews(filters),
        enabled: user?.role === Role.TUTOR,
        keepPreviousData: true,
    } as any);

    // Tutor rating stats
    const {
        data: tutorStats,
        isLoading: isStatsLoading,
        refetch: refetchStats,
    } = useQuery({
        queryKey: ["tutorRatingStats", tutorId],
        queryFn: () => getTutorRatingStats(tutorId!),
        enabled: !!tutorId,
    });

    //  Student’s review history
    const {
        data: studentReviewHistory,
        isLoading: isHistoryLoading,
        refetch: refetchHistory,
    } = useQuery({
        queryKey: ["studentReviewHistory"],
        queryFn: getStudentReviewHistory,
        enabled: user?.role === Role.STUDENT,
    });

    //  Create review
    const createMutation = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentReviewHistory"] });
            queryClient.invalidateQueries({ queryKey: ["tutorReviews", tutorId] });
            queryClient.invalidateQueries({ queryKey: ["tutorRatingStats", tutorId] });
        },
    });

    //  Update review
    const updateMutation = useMutation({
        mutationFn: ({ reviewId, data }: { reviewId: string; data: { rating?: number; comment?: string } }) =>
            updateReview(reviewId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["studentReviewHistory"] });
            queryClient.invalidateQueries({ queryKey: ["tutorReviews", tutorId] });
            queryClient.invalidateQueries({ queryKey: ["tutorRatingStats", tutorId] });
        },
    });

    return {
        // reviews
        tutorReviews,
        myTutorReviews,
        studentReviewHistory,
        // stats
        tutorStats,
        // loading states
        isTutorReviewsLoading,
        isMyTutorReviewsLoading,
        isStatsLoading,
        isHistoryLoading,
        // refetch
        refetchTutorReviews,
        refetchMyTutorReviews,
        refetchStats,
        refetchHistory,
        // mutations
        createReview: createMutation.mutateAsync,
        updateReview: updateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
    };
};
