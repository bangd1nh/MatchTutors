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

   return { create, fetchList, fetchMCQByQuizId, updateMCQ };
};
