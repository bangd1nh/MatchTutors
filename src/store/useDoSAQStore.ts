import { IQuizInfo } from "@/types/quiz";
import { IQuizQuestion } from "@/types/quizQuestion";
import { IQuizSubmissionBody } from "@/types/quizSubmission";
import { create } from "zustand";

type DoSAQStore = {
    quizInfo: IQuizInfo;
    quizId: string;
    questions: IDoSAQQuestions[];
    submited: boolean;
    initQuizInfo: (quizId: string, quizInfo: IQuizInfo) => void;
    initQuizQuestions: (questions: IQuizQuestion[]) => void;
    doQuestion: (quizQuestionId: string, answer: string) => void;
    updateAnswer: (quizQuestionId: string, answer: string) => void;
    clearAnswer: (quizQuestionId: string) => void;
    getSubmitQuiz: () => IQuizSubmissionBody;
    reset: () => void;
    getCompletionStatus: () => { completed: number; total: number };
};

export interface IDoSAQQuestions extends IQuizQuestion {
    isDone: boolean;
    answer: string; // Single string answer for short answer questions
}

export const useDoSAQStore = create<DoSAQStore>((set, get) => ({
    quizInfo: {} as IQuizInfo,
    quizId: "",
    questions: [],
    submited: false,

    initQuizInfo: (quizId, quizInfo) => {
        set({
            quizId: quizId,
            quizInfo: quizInfo,
        });
    },

    initQuizQuestions: (questions) => {
        const doQuestions = questions.map((q) => {
            return {
                ...q,
                isDone: false,
                answer: "" // Initialize with empty string for short answer
            };
        });
        set({
            questions: doQuestions,
        });
    },

    doQuestion: (quizQuestionId, answer) => {
        const current = get().questions;

        const updatedQuestions = current.map((q) => {
            if (q._id === quizQuestionId) {
                const updatedQuestion = {
                    ...q,
                    answer: answer,
                    isDone: answer.trim().length > 0 // Mark as done if answer is not empty
                };
                return updatedQuestion;
            }
            return q;
        });

        set({
            questions: updatedQuestions,
        });
    },

    updateAnswer: (quizQuestionId, answer) => {
        const current = get().questions;

        const updatedQuestions = current.map((q) => {
            if (q._id === quizQuestionId) {
                return {
                    ...q,
                    answer: answer,
                    isDone: answer.trim().length > 0
                };
            }
            return q;
        });

        set({
            questions: updatedQuestions,
        });
    },

    clearAnswer: (quizQuestionId) => {
        const current = get().questions;

        const updatedQuestions = current.map((q) => {
            if (q._id === quizQuestionId) {
                return {
                    ...q,
                    answer: "",
                    isDone: false
                };
            }
            return q;
        });

        set({
            questions: updatedQuestions,
        });
    },

    getSubmitQuiz: (): IQuizSubmissionBody => {
        const current = get().questions;
        const answers = current.map((q) => {
            return {
                questionId: q._id!,
                answer: q.answer // Single string answer for short answer
            };
        });
        const payload = {
            quizId: get().quizId,
            quizSnapshot: {
                quizMode: get().quizInfo.quizMode,
                settings: get().quizInfo.settings,
            },
            answers: answers,
        };
        set({
            submited: true,
        });
        return payload as IQuizSubmissionBody;
    },

    getCompletionStatus: () => {
        const questions = get().questions;
        const completed = questions.filter(q => q.isDone).length;
        const total = questions.length;

        return { completed, total };
    },

    reset: () => {
        set({
            quizInfo: {} as IQuizInfo,
            quizId: "",
            questions: [],
            submited: false,
        });
    },
}));