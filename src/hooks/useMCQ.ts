import {
   createMCQ,
   editMCQ,
   fetchMCQById,
   fetchMCQList,
} from "@/api/multipleChoiceQuiz";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import { MCQResponse } from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";
import { submitMCQtoServer } from "@/api/quiz";
import { IQuizSubmissionResponse } from "@/types/quizSubmission";
import { fetchMCQHistory, fetchMCQHistoryList } from "@/api/doQuiz";

export const useMCQ = (quizId?: string) => {
   const addToast = useToast();
   const queryClient = useQueryClient();
   const create = useMutation({
      mutationFn: createMCQ,
      onSuccess: (response) => addToast("success", response.message),
      onError: (error: any) => {
         addToast(
            "error",
            error?.response?.data.message || "Error creating MCQ"
         );
         console.log("Error creating MCQ:", error);
      },
   });

   const fetchList = useQuery<MCQResponse>({
      queryKey: ["MCQLIST"],
      queryFn: () => fetchMCQList(),
   });

   const fetchMCQByQuizId = useQuery<IQuizQuestionResponse>({
      queryKey: ["MCQBYID", quizId],
      queryFn: () => fetchMCQById(quizId!),
      enabled: !!quizId,
   });

   const updateMCQ = useMutation({
      mutationFn: editMCQ,
      onSuccess: (response) => {
         queryClient.invalidateQueries({ queryKey: ["MCQLIST"] });
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast(
            "error",
            error?.response?.data.message || "Error updating MCQ"
         );
         console.log("Error updating MCQ:", error);
      },
   });

   const submitMCQ = useMutation({
      mutationFn: submitMCQtoServer,
      onSuccess: (response) => {
         addToast("success", response.message);
      },
      onError: (error: any) => {
         addToast(
            "error",
            error?.response?.data.message || "Error submiting MCQ"
         );
      },
   });

   const fetchMCQSubmitHistoryList = useQuery<IQuizSubmissionResponse>({
      queryKey: ["MCQSUBMITHISTORYLIST"],
      queryFn: fetchMCQHistoryList,
   });

   return {
      create,
      fetchList,
      fetchMCQByQuizId,
      updateMCQ,
      submitMCQ,
      fetchMCQSubmitHistoryList,
   };
};

export const usefetchHistory = (quizId: string) =>
   useQuery<IQuizSubmissionResponse>({
      queryKey: ["MCQSUBMITHISTORY", quizId],
      queryFn: () => fetchMCQHistory(quizId!),
      enabled: !!quizId,
   });
