import apiClient from "@/lib/api";
import {
   IQuizSubmissionResponse,
   IStudentMCQHistoryResponse,
} from "@/types/quizSubmission";

export const fetchMCQHistoryList =
   async (): Promise<IQuizSubmissionResponse> => {
      const response = await apiClient.get("/doQuiz/getSubmitedMCQList");
      return response.data;
   };

export const fetchMCQHistory = async (
   quizId: string
): Promise<IQuizSubmissionResponse> => {
   const response = await apiClient.get("/doQuiz/getSubmitedMCQ", {
      params: { quizId },
   });
   return response.data;
};

export const fetchStudentMCQHistoryList =
   async (): Promise<IStudentMCQHistoryResponse> => {
      const response = await apiClient.get("doQUiz/getAllStudenSubmitedMCQ");
      return response.data;
   };
