import apiClient from "@/lib/api";
import { IQuizBody, IQuizResponse, IQUizUpdate } from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";
import { BaseAPIResponse } from "@/types/response";

export const createFlashCardQuiz = async (
   data: IQuizBody
): Promise<IQuizResponse> => {
   const response = await apiClient.post("/quiz/createQuiz", data);
   return response.data;
};

export const fetchFlashCardQuiz = async (): Promise<IQuizResponse> => {
   const response = await apiClient.get("/quiz/getTutorFlashcardQuiz");
   return response.data;
};

export const fetchFlashcardQuestions = async (
   quizId: string
): Promise<IQuizQuestionResponse> => {
   const response = await apiClient.get("/quiz/getQuizQuestionsByQuiz", {
      params: { quizId },
   });
   return response.data;
};

export const editFlashcardQuestion = async (
   data: IQUizUpdate
): Promise<IQuizQuestionResponse> => {
   const response = await apiClient.put("/quiz/editQuiz", data);
   return response.data;
};

export const deleteFlashcardQuestion = async (
   quizId: string
): Promise<BaseAPIResponse> => {
   const response = await apiClient.delete("/quiz/deleteQuiz", {
      data: { quizId },
   });
   return response.data;
};
