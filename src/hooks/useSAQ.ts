import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import {
    createShortAnswerQuiz,
    deleteShortAnswerQuiz,
    editShortAnswerQuiz,
    fetchShortAnswerQuestions,
    fetchShortAnswerQuiz,
    fetchSessionAssigned,
    fetchQuizzesAssignedToSession,
    asignQuizToSession,
} from "@/api/shortAnswerQuiz";
import { IQuizResponse } from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";
import { useAsignFlashcardStore } from "@/store/useAsignFlashcardStore";

export const useCreateShortAnswerQuiz = () => {
    const addToast = useToast();
    return useMutation({
        mutationFn: createShortAnswerQuiz,
        onSuccess: (response) => addToast("success", response.message),
        onError: (error: any) =>
            addToast(
                "error",
                error?.response?.message ?? error?.message ?? "Tạo short answer quiz thất bại"
            ),
    });
};

export const useFetchShortAnswerQuizByTutor = () => {
    return useQuery<IQuizResponse>({
        queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
        queryFn: fetchShortAnswerQuiz,
    });
};

export const useFetchShortAnswerQuestions = (quizId: string) => {
    return useQuery<IQuizQuestionResponse>({
        queryKey: ["SHORT_ANSWER_QUIZ", quizId],
        queryFn: () => fetchShortAnswerQuestions(quizId),
        enabled: !!quizId,
    });
};

export const useUpdateShortAnswerQuiz = () => {
    const queryClient = useQueryClient();
    const addToast = useToast();

    return useMutation({
        mutationFn: editShortAnswerQuiz,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["SHORT_ANSWER_QUIZ"] });
            queryClient.invalidateQueries({ queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"] });
            addToast("success", response.message);
        },
        onError: (error: any) => {
            addToast("error", error?.response?.data.message ?? "Cập nhật thất bại");
        },
    });
};

export const useDeleteShortAnswerQuiz = () => {
    const queryClient = useQueryClient();
    const addToast = useToast();

    return useMutation({
        mutationFn: deleteShortAnswerQuiz,
        onSuccess: (response) => {
            addToast("success", response.message);
            queryClient.invalidateQueries({ queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"] });
        },
        onError: (error: any) => {
            addToast("error", error.response?.data.message ?? "Xóa thất bại");
        },
    });
};

export const useAsignShortAnswerQuizToSession = () => {
    const addToast = useToast();
    const { setRefetchFlashcard } = useAsignFlashcardStore();

    return useMutation({
        mutationFn: asignQuizToSession,
        onSuccess: (response) => {
            addToast("success", response.message);
            setRefetchFlashcard();
        },
        onError: (error: any) => {
            addToast("error", error.response?.data.message ?? "Gán quiz thất bại");
        },
    });
};

export const useSessionAssignedShortAnswerQuizzes = (quizId: string) => {
    return useQuery({
        queryKey: ["SESSION_ASSIGNED_SHORT_ANSWER_QUIZS", quizId],
        queryFn: () => fetchSessionAssigned(quizId),
        enabled: !!quizId,
    });
};

export const useShortAnswerQuizzesAssignedToSession = (sessionId: string) => {
    return useQuery({
        queryKey: ["ASSIGNED_SHORT_ANSWER_QUIZ", sessionId],
        queryFn: () => fetchQuizzesAssignedToSession(sessionId),
        enabled: !!sessionId,
    });
};

// Comprehensive hook that combines all short answer quiz operations
export const useShortAnswerQuiz = (quizId?: string) => {
    const addToast = useToast();
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createShortAnswerQuiz,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"] });
            addToast("success", response.message);
        },
        onError: (error: any) => {
            addToast(
                "error",
                error?.response?.message ?? error?.message ?? "Tạo short answer quiz thất bại"
            );
        },
    });

    const fetchListQuery = useQuery<IQuizResponse>({
        queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
        queryFn: fetchShortAnswerQuiz,
    });

    const fetchByIdQuery = useQuery<IQuizQuestionResponse>({
        queryKey: ["SHORT_ANSWER_QUIZ", quizId],
        queryFn: () => fetchShortAnswerQuestions(quizId!),
        enabled: !!quizId,
    });

    const updateMutation = useMutation({
        mutationFn: editShortAnswerQuiz,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["SHORT_ANSWER_QUIZ"] });
            queryClient.invalidateQueries({ queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"] });
            addToast("success", response.message);
        },
        onError: (error: any) => {
            addToast("error", error?.response?.data.message ?? "Cập nhật thất bại");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteShortAnswerQuiz,
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"] });
            addToast("success", response.message);
        },
        onError: (error: any) => {
            addToast("error", error.response?.data.message ?? "Xóa thất bại");
        },
    });

    return {
        // Mutations
        create: createMutation,
        update: updateMutation,
        delete: deleteMutation,

        // Queries
        fetchList: fetchListQuery,
        fetchById: fetchByIdQuery,

        // States
        isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        isFetching: fetchListQuery.isFetching || fetchByIdQuery.isFetching,
    };
};