import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import {
   asignQuizToSession,
   createFlashCardQuiz,
   deleteFlashcardQuestion,
   editFlashcardQuestion,
   fetchFlashcardQuestions,
   fetchFlashCardQuiz,
   fetchQuizzesAssignedToSession,
   fetchSessionAssigned,
} from "@/api/quiz";
import { IQuizInfo, IQuizResponse } from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";
import { useAsignFlashcardStore } from "@/store/useAsignFlashcardStore";

export const useCreateQuiz = () => {
   const addToast = useToast();
   return useMutation({
      mutationFn: createFlashCardQuiz,
      onSuccess: (response) => addToast("success", response.message),
      onError: (error: any) =>
         addToast(
            "error",
            error?.response?.message ?? error?.message ?? "Tạo quiz thất bại"
         ),
   });
};

export const useFetchQuizByTutor = () => {
   return useQuery<IQuizResponse>({
      queryKey: ["TUTORFLASHCARDQUIZS"],
      queryFn: fetchFlashCardQuiz,
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

export const useDeleteFlashcard = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();
   return useMutation({
      mutationFn: deleteFlashcardQuestion,
      onSuccess: (response) => {
         addToast("success", response.message);
         queryClient.invalidateQueries({ queryKey: ["TUTORFLASHCARDQUIZS"] });
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

export const useSessionAssignedQuizzes = (quizId: string) => {
   return useQuery({
      queryKey: ["SESSIONASSIGNEDQUIZS", quizId],
      queryFn: () => fetchSessionAssigned(quizId),
   });
};

export const useQuizzesAssignedToSession = (sessionId: string) => {
   return useQuery({
      queryKey: ["ASSSIGNEDQUIZ", sessionId],
      queryFn: () => fetchQuizzesAssignedToSession(sessionId),
   });
};
