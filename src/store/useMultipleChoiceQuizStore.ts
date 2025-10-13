import { QuestionTypeEnum } from "@/enums/quiz.enum";
import { MultipleChoiceQuestions } from "@/types/quiz";
import { create } from "zustand";

const defaultQuestion = (): MultipleChoiceQuestions => ({
   _id: undefined,
   order: undefined,
   questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
   questionText: "",
   options: ["", ""],
   correctAnswer: undefined,
   explanation: "",
   points: 0,
});

type MultipleChoiceQuizQuestionStore = {
   quizQuestion: MultipleChoiceQuestions[];
   addQuestion: (q?: MultipleChoiceQuestions) => void;
   resetMultipleChoiceQuizQuestion: () => void;
   getMultipleChoiceQuizQuestions: () => MultipleChoiceQuestions[];
};

export const useMultipleChoiceQuizStore =
   create<MultipleChoiceQuizQuestionStore>((set, get) => ({
      quizQuestion: [],
      addQuestion: (question?: MultipleChoiceQuestions) => {
         set((state) => ({
            quizQuestion: [
               ...state.quizQuestion,
               question ?? defaultQuestion(),
            ],
         }));
      },
      resetMultipleChoiceQuizQuestion: () => {
         set({ quizQuestion: [] });
      },
      getMultipleChoiceQuizQuestions: () => {
         return get().quizQuestion;
      },
   }));
