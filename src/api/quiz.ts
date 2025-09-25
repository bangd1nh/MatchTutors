import apiClient from "@/lib/api";
import { IQuizBody, IQuizResponse } from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";

export const createFlashCardQuiz = async (
   data: IQuizBody
): Promise<IQuizResponse> => {
   const response = await apiClient.post("/quiz/createQuiz", data);
   return response.data;
};

export const fetchFlashCardQuiz = async (): Promise<IQuizResponse> => {
   const response = await apiClient.get("/quiz/getTutorQuiz");
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
