import { QuestionTypeEnum, QuizModeEnum } from "@/enums/quiz.enum";
import { IQuizQuestion } from "./quizQuestion";
import { BaseAPIResponse } from "./response";

export type QuizInfoValues = {
   title: string;
   description?: string;
   quizMode: string;
   settings: {
      shuffleQuestions: boolean;
      showCorrectAnswersAfterSubmit: boolean;
      timeLimitMinutes: number | null;
   };
   tags: string[];
   totalQuestions?: number;
};

export type FlashcardQuestion = {
   // mirror subset of server IQuizQuestion for flashcard usage
   _id: string; // client id
   order?: number;
   frontText: string;
   backText: string;
   explanation?: string;
   points?: number;
};

export type MultipleChoiceQuestions = {
   // mirror subset of server IQuizQuestion for multiple choice usage
   _id?: string; // client id
   order?: number;
   questionType: QuestionTypeEnum;
   questionText: string;
   options: string[];
   correctAnswer?: string[];
   explanation?: string;
   points?: number;
};

export interface QuizSettings {
   shuffleQuestions?: boolean;
   showCorrectAnswersAfterSubmit?: boolean;
   timeLimitMinutes?: number | null;
}

export interface IQuizResponse extends BaseAPIResponse {
   data: {
      _id?: string;
      title: string;
      description?: string;
      quizMode?: QuizModeEnum;
      settings?: QuizSettings;
      createdBy?: string;
      tags?: string[];
      totalQuestions?: number;
      createdAt?: Date;
      updatedAt?: Date;
      questionArr?: IQuizQuestion[];
   };
}

export interface IQuizBody {
   title: string;
   description?: string;
   quizMode?: QuizModeEnum;
   settings?: QuizSettings;
   createdBy?: string;
   tags?: string[];
   totalQuestions?: number;
   createdAt?: Date;
   updatedAt?: Date;
   questionArr: IQuizQuestion[];
}

export interface IQuizInfo {
   _id: string;
   title: string;
   description?: string;
   quizMode: QuizModeEnum;
   quizType: QuestionTypeEnum;
   settings?: QuizSettings;
   createdBy: {
      role: string;
      name: string;
   };
   tags: string[];
   totalQuestions: number;
   createdAt: Date;
   updatedAt: Date;
}

export interface IQUizUpdate {
   _id?: string;
   title: string;
   description: string;
   quizMode?: QuizModeEnum;
   settings?: QuizSettings;
   createdBy: {
      role: string;
      name: string;
   };
   tags: string[];
   totalQuestions: number;
   newQuestionArr: IQuizQuestion[];
   deleteQuestionArr: { _id: string }[];
   editQuestionArr: IQuizQuestion[];
}

export interface MCQResponse extends BaseAPIResponse {
   data: {
      _id?: string;
      title: string;
      description?: string;
      quizMode?: QuizModeEnum;
      settings?: QuizSettings;
      createdBy?: string;
      tags?: string[];
      totalQuestions?: number;
      createdAt?: Date;
      updatedAt?: Date;
      questionArr?: IQuizQuestion[];
   };
}

export interface updateIMCQBody {
   _id: string;
   title: string;
   description: string;
   quizMode: QuizModeEnum;
   quizType: QuestionTypeEnum;
   settings?: QuizSettings;
   createdBy: {
      role: string;
      name: string;
   };
   tags: string[];
   totalQuestions: number;
   newMultipleChoiceQuizQuestionsArr?: IQuizQuestion[];
   deleteMultipleChoiceQuizQuestionsArr?: { _id: string }[];
   editMultipleChoiceQuizQuestionsArr?: IQuizQuestion[];
}

export type ShortAnswerQuestions = {
   _id?: string;
   order?: number;
   questionType: QuestionTypeEnum;
   questionText: string;
   acceptedAnswers: string[];
   caseSensitive?: boolean;
   explanation?: string;
   points?: number;
};

export interface updateIShortAnswerBody {
   _id: string;
   title: string;
   description: string;
   quizMode: QuizModeEnum;
   quizType: QuestionTypeEnum;
   settings?: QuizSettings;
   createdBy: {
      role: string;
      name: string;
   };
   tags: string[];
   totalQuestions: number;
   newShortAnswerQuizQuestionsArr?: ShortAnswerQuestions[];
   deleteShortAnswerQuizQuestionsArr?: { _id: string }[];
   editShortAnswerQuizQuestionsArr?: ShortAnswerQuestions[];
}

export interface ISessionAssignedQuizzesResponse extends BaseAPIResponse {
   data: {
      _id: string;
      teachingRequestId?: {
         _id: string;
         studentId?: {
            _id: string;
            userId?: {
               _id: string;
               name: string;
               email: string;
            };
         };
         subject?: string;
         level?: string;
      } | null;
      startTime?: string | Date;
      endTime?: string | Date;
      status?: string;
      isTrial?: boolean;
      createdAt?: string | Date;
   }[];
}


