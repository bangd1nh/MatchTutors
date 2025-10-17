import React, { useRef } from "react";
import { QuizInfoHandle } from "@/components/Quiz/QuizInfoForm";
import { FlashcardQuestion, IQuizBody } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { z } from "zod";
import { QuestionTypeEnum, QuizModeEnum } from "@/enums/quiz.enum";
import { IQuizQuestion } from "@/types/quizQuestion";
import { useCreateQuiz } from "@/hooks/useQuiz";
import FlashCardQuizQuestionsForm, {
   QuizQuestionsHandle,
} from "@/components/Quiz/FlashCard/FlashCardQuizQuestionsForm";
import QuizInfoForm from "@/components/Quiz/QuizInfoForm";

const payloadSchema = z.object({
   title: z.string().min(1, "title is required"),
   description: z.string("description is required"),
   quizMode: z.nativeEnum(QuizModeEnum),
   settings: z
      .object({
         shuffleQuestions: z.boolean().optional(),
         showCorrectAnswersAfterSubmit: z.boolean().optional(),
         timeLimitMinutes: z.number().int().nonnegative().nullable().optional(),
      })
      .optional(),
   tags: z.array(z.string()).optional(),
   questionArr: z
      .array(
         z.object({
            order: z.number().int().nonnegative().optional(),
            questionType: z.nativeEnum(QuestionTypeEnum),
            explanation: z.string().optional(),
            points: z.number().min(0).optional(),
            frontText: z.string().min(1, "frontText is required for flashcard"),
            backText: z.string().min(1, "backText is required for flashcard"),
         })
      )
      .min(1, "questionArr must contain at least one flashcard"),
});

const CreateFlashcardQuiz: React.FC = () => {
   const quizInfoRef = useRef<QuizInfoHandle | null>(null);
   const quizQuestionsRef = useRef<QuizQuestionsHandle | null>(null);
   const addToast = useToast();
   const createFlashcardQuiz = useCreateQuiz();

   const handleSubmit = async () => {
      if (!quizInfoRef.current || !quizQuestionsRef.current) return;

      const infoValid = await quizInfoRef.current.validate?.();
      const qValidate = quizQuestionsRef.current.validate();
      if (infoValid === false || qValidate.valid === false) {
         addToast("error", "Vui lòng kiểm tra thông tin quiz và các thẻ");
         return;
      }

      const infoValues = quizInfoRef.current.getValues();
      const questions: FlashcardQuestion[] =
         quizQuestionsRef.current.getQuestions();

      // map questions to flashcard schema shape
      const questionArr = questions.map(
         (q, i): IQuizQuestion => ({
            order: q.order ?? i + 1,
            questionType: "FLASHCARD" as QuestionTypeEnum,
            frontText: q.frontText,
            backText: q.backText,
            explanation: q.explanation ?? undefined,
            // points intentionally omitted (optional)
         })
      );

      const payload: IQuizBody = {
         title: infoValues.title,
         description: infoValues.description ?? undefined,
         quizMode: infoValues.quizMode as QuizModeEnum,
         settings: infoValues.settings ?? undefined,
         tags:
            infoValues.tags && infoValues.tags.length
               ? infoValues.tags
               : undefined,
         questionArr,
      };

      // validate with zod and log
      const parsed = payloadSchema.parse(payload) as IQuizBody;
      createFlashcardQuiz.mutate(parsed);
   };

   return (
      <div className=" mx-auto my-6 p-4">
         <Card>
            <CardHeader>
               <CardTitle>Tạo Flashcard Quiz</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
               <div>
                  <QuizInfoForm ref={quizInfoRef} isFlashcard={true} />
               </div>

               <div>
                  <FlashCardQuizQuestionsForm ref={quizQuestionsRef} />
               </div>

               <div className="flex justify-end mt-2">
                  <Button
                     onClick={handleSubmit}
                     disabled={createFlashcardQuiz.isPending}
                  >
                     {createFlashcardQuiz.isPending
                        ? "Đang tạo ...."
                        : "Lưu / Submit"}
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default CreateFlashcardQuiz;
