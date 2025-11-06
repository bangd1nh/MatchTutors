import { QuestionTypeEnum, QuizModeEnum } from "@/enums/quiz.enum";
import { BaseAPIResponse } from "./response";

export interface IAnswer {
   questionId: string;
   answer?: any; // Thay string bằng any để hỗ trợ nhiều loại đáp án
}

interface IAnswerResponse {
   isCorrect: boolean;
   obtainedPoints: number;
   questionId: {
      order: number;
      questionText: string;
      options: string[];
      correctAnswer: string[];
      explanation: string;
      points: number;
   };
   answer?: string[];
}

export interface IQuizSubmissionBody {
   quizId: string;
   answers?: IAnswer[];
   quizSnapshot?: {
      quizMode?: string;
      settings?: any;
   };
}

export interface IQuizSubmissionResponse extends BaseAPIResponse {
   data: {
      quizSnapshot: {
         quizMode: QuizModeEnum;
         settings: {
            shuffleQuestions: boolean;
            showCorrectAnswersAfterSubmit: boolean;
            timeLimitMinutes: number;
         };
      };
      _id: string;
      quizId: {
         title: string;
         description: string;
         quizMode: QuizModeEnum;
         quizType: QuestionTypeEnum;
         totalQuestions: number;
      };
      studentId: { name: string; email: string };
      answers: IAnswerResponse[];
      score: number;
      gradedBy: string;
      gradedAt: Date;
      submittedAt: Date;
   };
}
