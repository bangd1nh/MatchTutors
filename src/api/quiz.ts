import apiClient from "@/lib/api";
import {
   IQuizBody,
   IQuizResponse,
   IQUizUpdate,
   ISessionAssignedQuizzesResponse,
} from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";
import { IQuizSubmissionBody } from "@/types/quizSubmission";
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

export const asignQuizToSession = async ({
   sessionId,
   quizIds,
}: {
   sessionId: string;
   quizIds: string[];
}): Promise<BaseAPIResponse> => {
   const response = await apiClient.post("/quiz/asignQuizToSession", {
      sessionId,
      quizIds,
   });
   return response.data;
};

export const fetchSessionAssigned = async (
   quizId: string
): Promise<ISessionAssignedQuizzesResponse> => {
   const response = await apiClient.get("/quiz/getSessionsAssigned", {
      params: { quizId },
   });
   return response.data;
};

export const fetchQuizzesAssignedToSession = async (
   sessionId: string
): Promise<ISessionAssignedQuizzesResponse> => {
   const response = await apiClient.get("/quiz/getQuizzesAssignedToSession", {
      params: { sessionId },
   });
   return response.data;
};

export const submitMCQtoServer = async (data: IQuizSubmissionBody) => {
   const response = await apiClient.post("/doQuiz/submitMCQ", data);
   return response.data;
};

export const fetchMCQAssignedToSession = async (
   sessionId: string
): Promise<ISessionAssignedQuizzesResponse> => {
   const response = await apiClient.get("/quiz/getMCQAssignedToSession", {
      params: { sessionId },
   });
   return response.data;
};

export const asignMCQToSession = async ({
   sessionId,
   quizIds,
}: {
   sessionId: string;
   quizIds: string[];
}): Promise<BaseAPIResponse> => {
   const response = await apiClient.post("/quiz/asignMCQToSession", {
      sessionId,
      quizIds,
   });
   return response.data;
};
