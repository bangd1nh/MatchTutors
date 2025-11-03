import { IQuizInfo } from "@/types/quiz";
import { IQuizQuestion } from "@/types/quizQuestion";
import { IQuizSubmissionBody } from "@/types/quizSubmission";
import { create } from "zustand";

type DoMCQStore = {
   quizInfo: IQuizInfo;
   quizId: string;
   questions: IDoQuestions[];
   submited: boolean;
   initQuizInfo: (quizId: string, quizInfo: IQuizInfo) => void;
   initQuizQuestions: (questions: IQuizQuestion[]) => void;
   doQuestion: (quizQuestionId: string, awnser: string) => void;
   getSubmitQuiz: () => IQuizSubmissionBody;
};

export interface IDoQuestions extends IQuizQuestion {
   isDone: boolean;
   answer: string[];
}

export const useDoMCQStore = create<DoMCQStore>((set, get) => ({
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
         return { ...q, isDone: false, answer: [] };
      });
      set({
         questions: doQuestions,
      });
   },
   doQuestion: (quizQuestionId, awnser) => {
      const current = get().questions;

      const updatedQuestions = current.map((q) => {
         if (q._id === quizQuestionId) {
            const updatedQuestion = { ...q };

            if (updatedQuestion.answer.includes(awnser)) {
               updatedQuestion.answer = updatedQuestion.answer.filter(
                  (a) => a !== awnser
               );
            } else {
               updatedQuestion.answer = [...updatedQuestion.answer, awnser];
            }

            updatedQuestion.isDone = updatedQuestion.answer.length > 0;

            return updatedQuestion;
         }
         return q;
      });

      set({
         questions: updatedQuestions,
      });
   },
   getSubmitQuiz: (): IQuizSubmissionBody => {
      const current = get().questions;
      const awnsers = current.map((q) => {
         return { questionId: q._id, answer: q.answer };
      });
      const payload = {
         quizId: get().quizId,
         quizSnapshot: {
            quizMode: get().quizInfo.quizMode,
            settings: get().quizInfo.settings,
         },
         answers: awnsers,
      };
      set({
         submited: true,
      });
      return payload as IQuizSubmissionBody;
   },
}));
