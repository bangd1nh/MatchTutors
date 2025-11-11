import apiClient from "@/lib/api";
import {
    IQuizBody,
    IQuizResponse,
    IQUizUpdate,
    ISessionAssignedQuizzesResponse,
} from "@/types/quiz";
import { IQuizQuestionResponse } from "@/types/quizQuestion";
import { BaseAPIResponse } from "@/types/response";

export const createShortAnswerQuiz = async (
    data: IQuizBody
): Promise<IQuizResponse> => {
    const response = await apiClient.post("/quiz/short-answer", data);
    return response.data;
};

export const fetchShortAnswerQuiz = async (): Promise<IQuizResponse> => {
    const response = await apiClient.get("/quiz/short-answer/tutor");
    return response.data;
};

export const fetchShortAnswerQuestions = async (
    quizId: string
): Promise<IQuizQuestionResponse> => {
    const response = await apiClient.get("/quiz/short-answer", {
        params: { quizId },
    });
    return response.data;
};

export const editShortAnswerQuiz = async (
    data: IQUizUpdate
): Promise<IQuizQuestionResponse> => {
    const response = await apiClient.put("/quiz/short-answer", data);
    return response.data;
};

export const deleteShortAnswerQuiz = async (
    quizId: string
): Promise<BaseAPIResponse> => {
    const response = await apiClient.delete("/quiz/short-answer", {
        data: { quizId },
    });
    return response.data;
};

export const asignShortAnswerQuizToSession = async ({
    sessionId,
    quizIds,
}: {
    sessionId: string;
    quizIds: string[];
}): Promise<BaseAPIResponse> => {
    const response = await apiClient.post("/quiz/asignShortAnswerQuizToSession", {
        sessionId,
        quizIds,
    });
    return response.data;
};

export const fetchShortAnswerQuizzesAssignedToSession = async (
    sessionId: string
): Promise<ISessionAssignedQuizzesResponse> => {
    const response = await apiClient.get("/quiz/getShortAnswerQuizzesAssignedToSession", {
        params: { sessionId },
    });
    return response.data;
};

export const fetchSessionsAssignedForSAQ = async (
    quizId: string
): Promise<ISessionAssignedQuizzesResponse> => {
    const response = await apiClient.get("/quiz/getSessionsAssignedForSAQ", {
        params: { quizId },
    });
    return response.data;
};
