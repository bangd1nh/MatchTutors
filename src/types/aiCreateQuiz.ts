import { QuizModeEnum } from "@/enums/quiz.enum";
import { BaseAPIResponse } from "./response";
import { QuizSettings } from "./quiz";
import { IQuizQuestion } from "./quizQuestion";

export interface IFlashcardAI extends BaseAPIResponse {
   data: {
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
   };
}
