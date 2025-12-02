import {
   QuizModeEnum,
   CardOrderEnum,
   QuestionTypeEnum,
} from "@/enums/quiz.enum";

const QUIZ_MODE_LABELS_VI: Record<string, string> = {
   [QuizModeEnum.STUDY]: "Học",
   [QuizModeEnum.EXAM]: "Kiểm tra",
};

const CARD_ORDER_LABELS_VI: Record<string, string> = {
   [CardOrderEnum.FRONT]: "Mặt trước",
   [CardOrderEnum.BACK]: "Mặt sau",
};

const QUESTION_TYPE_LABELS_VI: Record<string, string> = {
   [QuestionTypeEnum.MULTIPLE_CHOICE]: "Trắc nghiệm",
   [QuestionTypeEnum.SHORT_ANSWER]: "Trả lời ngắn",
   [QuestionTypeEnum.FLASHCARD]: "Thẻ ghi nhớ",
};

export const getQuizModeLabelVi = (mode: QuizModeEnum | string): string => {
   const key = String(mode);
   return QUIZ_MODE_LABELS_VI[key] || key.replace(/_/g, " ");
};

export const getCardOrderLabelVi = (order: CardOrderEnum | string): string => {
   const key = String(order);
   return CARD_ORDER_LABELS_VI[key] || key.replace(/_/g, " ");
};

export const getQuestionTypeLabelVi = (
   type: QuestionTypeEnum | string
): string => {
   const key = String(type);
   return QUESTION_TYPE_LABELS_VI[key] || key.replace(/_/g, " ");
};