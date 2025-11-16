import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    submitShortAnswer,
    fetchShortAnswerHistoryList,
    fetchStudentShortAnswerHistoryList,
    fetchShortAnswerQuizForAttempt // Add this import
} from "@/api/doQuiz";
import { IQuizSubmissionBody } from "@/types/quizSubmission";
import { useToast } from "./useToast";

export const useDoSAQ = (quizId?: string) => {
    const queryClient = useQueryClient();
    const toast = useToast();

    const fetchSAQForAttempt = useQuery({
        queryKey: ["shortAnswerQuizAttempt", quizId],
        queryFn: () => fetchShortAnswerQuizForAttempt(quizId!), // Use the new function
        enabled: !!quizId,
    });

    // Submit short answer quiz
    const submitSAQ = useMutation({
        mutationFn: (data: IQuizSubmissionBody) => submitShortAnswer(data),
        onSuccess: (data) => {
            toast("success", "Nộp bài short answer thành công!");
            queryClient.invalidateQueries({ queryKey: ["shortAnswerQuizAttempt"] });
            queryClient.invalidateQueries({ queryKey: ["shortAnswerHistory"] });
            queryClient.invalidateQueries({ queryKey: ["studentShortAnswerHistory"] });

        },
        onError: (error: any) => {
            toast("error", "Nộp bài thất bại: " + (error.message || "Vui lòng thử lại"));
        },
    });

    // Fetch student's short answer quiz history (submissions)
    const fetchSAQHistory = useQuery({
        queryKey: ["shortAnswerHistory"],
        queryFn: fetchShortAnswerHistoryList,
    });

    // Fetch tutor's view of student submissions (for tutors)
    const fetchStudentSAQSubmissions = useQuery({
        queryKey: ["studentShortAnswerHistory"],
        queryFn: fetchStudentShortAnswerHistoryList,
    });

    return {
        // Queries
        fetchSAQForAttempt,
        fetchSAQHistory,
        fetchStudentSAQSubmissions,

        // Mutations
        submitSAQ,

        // Combined states
        isLoading: fetchSAQForAttempt.isLoading,
        isSubmitting: submitSAQ.isPending,
        isError: fetchSAQForAttempt.isError,
    };
};

// Simple hook for just submitting
export const useSubmitSAQ = () => {
    const queryClient = useQueryClient();

    const toast = useToast();

    return useMutation({
        mutationFn: (data: IQuizSubmissionBody) => submitShortAnswer(data),
        onSuccess: () => {
            toast("success", "Nộp bài thành công!");
            queryClient.invalidateQueries({ queryKey: ["shortAnswerHistory"] });
            queryClient.invalidateQueries({ queryKey: ["studentShortAnswerHistory"] });
        },
        onError: (error: any) => {
            toast("error", "Nộp bài thất bại: " + (error.message || "Vui lòng thử lại"));
        },
    });
};

// Hook for fetching SAQ history only
export const useSAQHistory = () => {
    return useQuery({
        queryKey: ["shortAnswerHistory"],
        queryFn: fetchShortAnswerHistoryList,
    });
};

export const useSAQHistoryDetail = (quizId: string) => {
    const { fetchSAQHistory } = useDoSAQ();

    const submissions = fetchSAQHistory.data?.data;
    const submission = Array.isArray(submissions)
        ? submissions.find((sub: any) => sub._id === quizId)
        : (submissions as any)?._id === quizId
            ? submissions
            : undefined;

    return {
        data: submission,
        isLoading: fetchSAQHistory.isLoading,
        isError: fetchSAQHistory.isError,
    };
};


// Hook for tutors to view student submissions
export const useStudentSAQSubmissions = () => {
    return useQuery({
        queryKey: ["studentShortAnswerHistory"],
        queryFn: fetchStudentShortAnswerHistoryList,
    });
};