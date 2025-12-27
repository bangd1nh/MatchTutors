import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import {
   createShortAnswerQuiz,
   deleteShortAnswerQuiz,
   editShortAnswerQuiz,
   fetchShortAnswerQuestions,
   fetchShortAnswerQuiz,
   fetchShortAnswerQuizzesAssignedToSession,
   asignShortAnswerQuizToSession,
   fetchSessionsAssignedForSAQ, // ADD THIS IMPORT
} from "@/api/shortAnswerQuiz";
import { IQuizResponse } from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";

export const useCreateShortAnswerQuiz = () => {
   const addToast = useToast();
   return useMutation({
      mutationFn: createShortAnswerQuiz,
      onSuccess: (response) => addToast("success", response.message),
      onError: (error: any) =>
         addToast(
            "error",
            error?.response?.message ??
               error?.message ??
               "Tạo bài tập tự luận thất bại"
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
         queryClient.invalidateQueries({
            queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
         });
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast(
            "error",
            error?.response?.data.message ?? "Cập nhật thất bại"
         );
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
         queryClient.invalidateQueries({
            queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
         });
      },
      onError: (error: any) => {
         addToast("error", error.response?.data.message ?? "Xóa thất bại");
      },
   });
};

export const useAsignShortAnswerQuizToSession = () => {
   const addToast = useToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: asignShortAnswerQuizToSession,
      onSuccess: (response) => {
         queryClient.invalidateQueries({
            queryKey: ["SHORT_ANSWER_QUIZ_SESSION"],
         });
         queryClient.invalidateQueries({
            queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
         });
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data.message ?? "Gán short answer quiz thất bại"
         );
      },
   });
};

export const useShortAnswerQuizzesAssignedToSession = (sessionId: string) => {
   return useQuery({
      queryKey: ["SHORT_ANSWER_QUIZ_SESSION", sessionId],
      queryFn: () => fetchShortAnswerQuizzesAssignedToSession(sessionId),
      enabled: !!sessionId,
   });
};

// NEW: Add this hook for fetching sessions assigned to SAQ
export const useSessionsAssignedForSAQ = (quizId: string) => {
   return useQuery({
      queryKey: ["SESSIONS_ASSIGNED_FOR_SAQ", quizId],
      queryFn: () => fetchSessionsAssignedForSAQ(quizId),
      enabled: !!quizId,
   });
};

// Comprehensive hook that combines all short answer quiz operations
export const useShortAnswerQuiz = (quizId?: string) => {
   const addToast = useToast();
   const queryClient = useQueryClient();

   const createMutation = useMutation({
      mutationFn: createShortAnswerQuiz,
      onSuccess: (response) => {
         queryClient.invalidateQueries({
            queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
         });
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast(
            "error",
            error?.response?.message ??
               error?.message ??
               "Tạo bài tập tự luận thất bại"
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
         queryClient.invalidateQueries({
            queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
         });
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast(
            "error",
            error?.response?.data.message ?? "Cập nhật thất bại"
         );
      },
   });

   const deleteMutation = useMutation({
      mutationFn: deleteShortAnswerQuiz,
      onSuccess: (response) => {
         queryClient.invalidateQueries({
            queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
         });
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast("error", error.response?.data.message ?? "Xóa thất bại");
      },
   });

   const assignMutation = useMutation({
      mutationFn: asignShortAnswerQuizToSession,
      onSuccess: (response) => {
         queryClient.invalidateQueries({
            queryKey: ["SHORT_ANSWER_QUIZ_SESSION"],
         });
         queryClient.invalidateQueries({
            queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
         });
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data.message ?? "Gán short answer quiz thất bại"
         );
      },
   });

   return {
      // Mutations
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
      assignToSession: assignMutation,

      // Queries
      fetchList: fetchListQuery,
      fetchById: fetchByIdQuery,

      // States
      isLoading:
         createMutation.isPending ||
         updateMutation.isPending ||
         deleteMutation.isPending ||
         assignMutation.isPending,
      isFetching: fetchListQuery.isFetching || fetchByIdQuery.isFetching,
   };
};

export const useShortAnswerQuizSession = (sessionId?: string) => {
   const addToast = useToast();
   const queryClient = useQueryClient();

   const assignMutation = useMutation({
      mutationFn: asignShortAnswerQuizToSession,
      onSuccess: (response) => {
         queryClient.invalidateQueries({
            queryKey: ["SHORT_ANSWER_QUIZ_SESSION"],
         });
         queryClient.invalidateQueries({
            queryKey: ["TUTOR_SHORT_ANSWER_QUIZS"],
         });
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast(
            "error",
            error.response?.data.message ?? "Gán short answer quiz thất bại"
         );
      },
   });

   const assignedQuizzesQuery = useQuery({
      queryKey: ["SHORT_ANSWER_QUIZ_SESSION", sessionId],
      queryFn: () => fetchShortAnswerQuizzesAssignedToSession(sessionId!),
      enabled: !!sessionId,
   });

   return {
      // Mutation
      assignToSession: assignMutation,

      // Query
      assignedQuizzes: assignedQuizzesQuery,

      // States
      isAssigning: assignMutation.isPending,
      isFetchingAssigned: assignedQuizzesQuery.isFetching,
   };
};

// UPDATE: Replace this with the new hook
export const useSessionAssignedShortAnswerQuizzes = (quizId: string) => {
   return useQuery({
      queryKey: ["SESSION_ASSIGNED_SHORT_ANSWER", quizId],
      queryFn: () => fetchSessionsAssignedForSAQ(quizId),
      enabled: !!quizId,
   });
};
