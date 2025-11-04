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

export {
    asignQuizToSession,
    fetchSessionAssigned,
    fetchQuizzesAssignedToSession
} from "./quiz";