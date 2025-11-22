import { QuestionTypeEnum, QuizModeEnum } from "@/enums/quiz.enum";
import { BaseAPIResponse } from "./response";
import { QuizSettings } from "./quiz";

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

interface IShortAnswerResponse {
   isCorrect: boolean;
   obtainedPoints: number;
   questionId: {
      order: number;
      questionText: string;
      acceptedAnswers: string[];
      caseSensitive: boolean;
      explanation: string;
      points: number;
   };
   answer?: string;
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

export interface IShortAnswerSubmissionResponse extends BaseAPIResponse {
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
      answers: IShortAnswerResponse[];
      score: number;
      gradedBy: string;
      gradedAt: Date;
      submittedAt: Date;
   };
}

export interface IAttemptSubmissionResponse extends BaseAPIResponse {
   data: {
      quizId: string;
      attempt: number;
      submissionIds: string[];
   }[];
}

export interface IStudentMCQHistoryResponse extends BaseAPIResponse {
   data: {
      _id: string;
      quizSnapShot: {
         quizMode: QuizModeEnum;
         settings: QuizSettings;
      };
      quizId: {
         _id: string;
         title: string;
         description: string;
         quizMode: QuizModeEnum;
         quizType: QuestionTypeEnum;
         tags: string[];
         totalQuestions: number;
         createdAt: Date;
         updatedAt: Date;
      };
      studentId: {
         _id: string;
         name: string;
         email: string;
      };
      score: number;
      gradedAt: Date;
      attempt: Date;
      submittedAt: Date;
   };
}

export interface IStudentSAQHistoryResponse extends BaseAPIResponse {
   data: {
      _id: string;
      quizSnapShot: {
         quizMode: QuizModeEnum;
         settings: QuizSettings;
      };
      quizId: {
         _id: string;
         title: string;
         description: string;
         quizMode: QuizModeEnum;
         quizType: QuestionTypeEnum;
         tags: string[];
         totalQuestions: number;
         createdAt: Date;
         updatedAt: Date;
      };
      studentId: {
         _id: string;
         name: string;
         email: string;
      };
      score: number;
      gradedAt: Date;
      attempt: Date;
      submittedAt: Date;
   };
}
