import { create } from 'zustand';
import { ShortAnswerQuestions } from '@/types/quiz';

interface ShortAnswerQuizState {
    quizQuestion: ShortAnswerQuestions[];
    addQuestion: (question: ShortAnswerQuestions) => void;
    resetShortAnswerQuizQuestion: () => void;
}

export const useShortAnswerQuizStore = create<ShortAnswerQuizState>((set) => ({
    quizQuestion: [],
    addQuestion: (question) =>
        set((state) => ({
            quizQuestion: [...state.quizQuestion, question],
        })),
    resetShortAnswerQuizQuestion: () =>
        set({
            quizQuestion: [],
        }),
}));