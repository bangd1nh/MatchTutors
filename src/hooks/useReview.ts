import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createReview,
    getTutorReviews,
    getTutorRatingStats,
    getStudentReviewHistory,
    updateReview,
    getMyTutorReviews,
    checkReviewEligibility,
    requestHideReview,
    getReviewVisibilityRequests,
    updateReviewVisibility,
    ReviewVisibilityAction,
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

    // Student's review history with filtering
    const {
        data: studentReviewHistory,
        isLoading: isHistoryLoading,
        refetch: refetchHistory,
    } = useQuery({
        queryKey: ["studentReviewHistory", filters],
        queryFn: () => getStudentReviewHistory(filters),
        enabled: user?.role === Role.STUDENT,
        keepPreviousData: true,
    } as any);

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

    // Tutor: request hide review
    const requestHideMutation = useMutation({
        mutationFn: ({ reviewId, reason }: { reviewId: string; reason?: string }) =>
            requestHideReview(reviewId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["myTutorReviews"] });
            queryClient.invalidateQueries({ queryKey: ["tutorReviews", tutorId] });
        },
    });

    // Admin: fetch visibility requests
    const useVisibilityRequests = (params?: {
        page?: number;
        limit?: number;
        status?: "NONE" | "PENDING" | "APPROVED" | "REJECTED";
        tutorUserId?: string;
    }) =>
        useQuery({
            queryKey: ["reviewVisibilityRequests", params],
            queryFn: () => getReviewVisibilityRequests(params),
        });

    // Admin: approve/reject visibility
    const updateVisibilityMutation = useMutation({
        mutationFn: ({
            reviewId,
            action,
            note,
        }: {
            reviewId: string;
            action: ReviewVisibilityAction;
            note?: string;
        }) => updateReviewVisibility(reviewId, { action, note }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviewVisibilityRequests"] });
            queryClient.invalidateQueries({ queryKey: ["tutorReviews", tutorId] });
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
        requestHideReview: requestHideMutation.mutateAsync,
        updateReviewVisibility: updateVisibilityMutation.mutateAsync,
        useVisibilityRequests,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isRequestingHide: requestHideMutation.isPending,
        isUpdatingVisibility: updateVisibilityMutation.isPending,
    };
};

export const useReviewEligibility = (tutorUserId: string) => {
    const { user } = useUser();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["reviewEligibility", tutorUserId],
        queryFn: () => checkReviewEligibility(tutorUserId),
        enabled: !!user && user.role === Role.STUDENT,
    });

    return {
        eligibility: data,
        isLoading,
        error,
        refetch,
        hasCompleted: data?.hasCompleted || false,
        teachingRequestIds: data?.teachingRequestIds || [],
    };
};