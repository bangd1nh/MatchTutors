import apiClient from "@/lib/api";
import { IQuizQuestionResponse } from "@/types/quizQuestion";
import {
   IQuizSubmissionResponse,
   IStudentMCQHistoryResponse,
   IShortAnswerSubmissionResponse,
   IQuizSubmissionBody,
   IStudentSAQHistoryResponse,
   IQuizSubmissionListResponse,
} from "@/types/quizSubmission";

export const fetchMCQHistoryList =
   async (): Promise<IQuizSubmissionListResponse> => {
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

// Short Answer Quiz APIs
export const fetchShortAnswerHistoryList = async (): Promise<IShortAnswerSubmissionResponse> => {
   const response = await apiClient.get("/doQuiz/getSubmitedShortAnswerList");
   return response.data;
};

export const fetchShortAnswerHistory = async (
   quizId: string
): Promise<IShortAnswerSubmissionResponse> => {
   const response = await apiClient.get("/doQuiz/getSubmitedShortAnswer", {
      params: { quizId },
   });
   return response.data;
};

export const submitShortAnswer = async (
   submissionData: IQuizSubmissionBody
): Promise<IShortAnswerSubmissionResponse> => {
   const response = await apiClient.post("/doQuiz/submitShortAnswer", submissionData);
   return response.data;
};

export const fetchStudentShortAnswerHistoryList = async (): Promise<IStudentSAQHistoryResponse> => {
   const response = await apiClient.get("/doQuiz/getAllStudentSubmitedShortAnswer");
   return response.data;
};

export const fetchShortAnswerQuizForAttempt = async (quizId: string): Promise<IQuizQuestionResponse> => {
   const response = await apiClient.get(`/quiz/short-answer`, {
      params: { quizId },
   });
   return response.data;
};


// Common APIs
export const fetchQuizAttempts = async (sessionId: string) => {
   const response = await apiClient.get("/doQuiz/getAttemptMCQ", {
      params: { sessionId },
   });
   return response.data;
};
