import apiClient from "@/lib/api";
import type { Review } from "@/types/review";

// Create a new review
export const createReview = async (data: {
    teachingRequestId: string;
    rating: number;
    comment?: string;
}): Promise<Review> => {
    const response = await apiClient.post("/review", data);
    return response.data.data.review;
};

// Get all reviews for a specific tutor (public)
export const getTutorReviews = async (tutorId: string): Promise<Review[]> => {
    const response = await apiClient.get(`/review/tutor/${tutorId}`);
    return response.data.data.reviews;
};

//  Get all reviews for the current tutor (dashboard)
export const getMyTutorReviews = async (params?: {
    page?: number;
    limit?: number;
    keyword?: string;
    subjects?: string[];
    levels?: string[];
    minRating?: number;
    maxRating?: number;
    sort?: "newest" | "oldest";
}) => {
    const response = await apiClient.get("/review/tutor/me", { params });
    return response.data.data; // { reviews, total, totalPages, page, limit }
};

// Get tutor rating stats
export const getTutorRatingStats = async (tutorId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
}> => {
    const response = await apiClient.get(`/review/tutor/${tutorId}/stats`);
    return response.data.data.stats;
};

// Get all reviews written by current student
export const getStudentReviewHistory = async (): Promise<Review[]> => {
    const response = await apiClient.get("/review/student/history");
    return response.data.data.reviews;
};

// Update review
export const updateReview = async (reviewId: string, data: {
    rating?: number;
    comment?: string;
}): Promise<Review> => {
    const response = await apiClient.put(`/review/${reviewId}`, data);
    return response.data.data.review;
};
