import apiClient from "@/lib/api";
import { IQuizBody, MCQResponse } from "@/types/quiz";

export const createMCQ = async (payload: IQuizBody): Promise<MCQResponse> => {
   const response = await apiClient.post(
      "quiz/createMultipleChoiceQuiz",
      payload
   );
   return response.data;
};
