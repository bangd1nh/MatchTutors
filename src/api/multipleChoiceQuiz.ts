import apiClient from "@/lib/api";
import { IQuizBody, MCQResponse, updateIMCQBody } from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";

export const createMCQ = async (payload: IQuizBody): Promise<MCQResponse> => {
   const response = await apiClient.post(
      "quiz/createMultipleChoiceQuiz",
      payload
   );
   return response.data;
};

export const fetchMCQList = async (): Promise<MCQResponse> => {
   const response = await apiClient.get("quiz/getMultipleChoiceQuizesByTutor");
   return response.data;
};

export const fetchMCQById = async (
   quizId: string
): Promise<IQuizQuestionResponse> => {
   const response = await apiClient.get("quiz/getMultipleChoiceQuizByQuizId", {
      params: { quizId },
   });
   return response.data;
};

export const editMCQ = async (payload: updateIMCQBody) => {
   const response = await apiClient.put(
      "quiz/updateMultipleChoiceQuiz",
      payload
   );
   return response.data;
};
