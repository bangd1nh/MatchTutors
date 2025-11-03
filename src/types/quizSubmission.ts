export interface IAnswer {
   questionId: string;
   answer?: any; // Thay string bằng any để hỗ trợ nhiều loại đáp án
}

export interface IQuizSubmissionBody {
   quizId: string;
   answers?: IAnswer[];
   quizSnapshot?: {
      quizMode?: string;
      settings?: any;
   };
}
