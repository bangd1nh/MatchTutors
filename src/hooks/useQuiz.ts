import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import {
   asignMCQToSession,
   asignQuizToSession,
   createFlashCardQuiz,
   deleteFlashcardQuestion,
   editFlashcardQuestion,
   fetchFlashcardQuestions,
   fetchFlashCardQuiz,
   fetchMCQAssignedToSession,
   fetchQuizzesAssignedToSession,
   fetchSessionAssigned,
} from "@/api/quiz";
import { IQuizResponse } from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";
import { useAsignFlashcardStore } from "@/store/useAsignFlashcardStore";
import { useAsignMCQStore } from "@/store/useAsignMCQStore";

export const useCreateQuiz = () => {
   const addToast = useToast();
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createFlashCardQuiz,
      onSuccess: (response) => {
         addToast("success", response.message);
         // Invalidate all flashcard queries to refetch the list
         queryClient.invalidateQueries({
            queryKey: ["TUTORFLASHCARDQUIZS"],
         });
      },
      onError: (error: any) =>
         addToast(
            "error",
            error?.response?.message ?? error?.message ?? "Tạo quiz thất bại"
         ),
   });
};

export const useFetchQuizByTutor = (subject?: string, level?: string) => {
   return useQuery<IQuizResponse>({
      queryKey: ["TUTORFLASHCARDQUIZS", subject, level],
      queryFn: () => fetchFlashCardQuiz(subject, level),
   });
};

export const useFetchFlashcardQuestions = (quizId: string) => {
   return useQuery<IQuizQuestionResponse>({
      queryKey: ["FLASHCARDQUIZ", quizId],
      queryFn: () => fetchFlashcardQuestions(quizId),
   });
};

export const useUpdateFlashcard = () => {
   const queryClient = useQueryClient();

   const addToast = useToast();
   return useMutation({
      mutationFn: editFlashcardQuestion,
      onSuccess: (response) => {
         queryClient.invalidateQueries({ queryKey: ["FLASHCARDQUIZ"] });
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast("error", error?.response?.data.message);
      },
   });
};

export const useDeleteFlashcard = (type: string) => {
   const queryClient = useQueryClient();
   const addToast = useToast();
   return useMutation({
      mutationFn: deleteFlashcardQuestion,
      onSuccess: (response) => {
         addToast("success", response.message);
         if (type === "flashcard")
            queryClient.invalidateQueries({
               queryKey: ["TUTORFLASHCARDQUIZS"],
            });
         if (type === "mcq")
            queryClient.invalidateQueries({
               queryKey: ["MCQLIST"],
            });
      },
      onError: (error: any) => {
         addToast("error", error.response?.data.message);
      },
   });
};

export const useAsignQuizToSession = () => {
   const addToast = useToast();
   const { setRefetchFlashcard } = useAsignFlashcardStore();
   return useMutation({
      mutationFn: asignQuizToSession,
      onSuccess: (response) => {
         addToast("success", response.message);
         setRefetchFlashcard();
      },
      onError: (error: any) => {
         addToast("error", error.response?.data.message);
      },
   });
};

export const useSessionAssignedQuizzes = (quizId: string, type: string) => {
   return useQuery({
      queryKey: ["SESSIONASSIGNEDQUIZS", quizId],
      queryFn: () => fetchSessionAssigned(quizId, type),
   });
};

export const useQuizzesAssignedToSession = (sessionId: string) => {
   return useQuery({
      queryKey: ["ASSSIGNEDQUIZ", sessionId],
      queryFn: () => fetchQuizzesAssignedToSession(sessionId),
   });
};

export const useMCQAssignedToSession = (sessionId: string) => {
   return useQuery({
      queryKey: ["ASSSIGNEDMCQ", sessionId],
      queryFn: () => fetchMCQAssignedToSession(sessionId),
   });
};

export const useAsignMCQToSession = () => {
   const addToast = useToast();
   const { setRefetchMCQ } = useAsignMCQStore();
   return useMutation({
      mutationFn: asignMCQToSession,
      onSuccess: (response) => {
         addToast("success", response.message);
         setRefetchMCQ();
      },
      onError: (error: any) => {
         addToast("error", error.response?.data.message);
      },
   });
};
