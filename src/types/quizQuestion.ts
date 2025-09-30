import { QuestionTypeEnum } from "@/enums/quiz.enum";
import { BaseAPIResponse } from "./response";
import { IQuizInfo } from "./quiz";

export interface IQuizQuestion {
   _id?: string;
   order: number;
   questionType: QuestionTypeEnum;

   // Multiple choice
   questionText?: string;
   options?: string[];
   correctAnswer?: string;

   // Short answer
   acceptedAnswers?: string[];
   caseSensitive?: boolean;

   // Flashcard
   frontText: string;
   backText: string;

   // Common
   explanation?: string;
   points?: number;
   createdAt?: Date;
   updatedAt?: Date;
}

export interface IQuizQuestionResponse extends BaseAPIResponse {
   data: {
      quizInfo: IQuizInfo;
      quizQuestions: IQuizQuestion[];
   };
}
