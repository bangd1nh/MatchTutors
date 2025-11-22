import React, { useRef, useState } from "react";
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
import MaterialModal from "./MaterialModal";
import { useAICreateFlashcardMutation } from "@/hooks/useAICreateFlashcard";
import { BookOpen } from "lucide-react";

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

   const [showMaterialModal, setShowMaterialModal] = useState(false);
   const { generateFlashcard } = useAICreateFlashcardMutation();

   // Add state for AI generated data
   const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<
      FlashcardQuestion[]
   >([]);
   const [formKey, setFormKey] = useState(0); // Force re-render
   const [aiData, setAiData] = useState<any>(null);

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

   const handleMaterialSelect = (materialId: string) => {
      // Trigger AI generation manually
      generateFlashcard.mutate(materialId, {
         onSuccess: (data: any) => {
            console.log("AI Generated Flashcards:", data);
            // Store AI data and populate forms
            populateFormsWithAIData(data.data);
         },
         onError: (error) => {
            console.error("AI Generation failed:", error);
            addToast(
               "error",
               "Không thể tạo flashcard từ AI. Vui lòng thử lại."
            );
         },
      });
   };

   const populateFormsWithAIData = (aiDataReceived: any) => {
      console.log("aiData received:", aiDataReceived);

      // Store AI data
      setAiData(aiDataReceived);

      // Prepare flashcard questions
      if (aiDataReceived?.questionArr) {
         const flashcardQuestions = aiDataReceived.questionArr.map(
            (q: any, index: number) => ({
               id: `ai-generated-${index}`,
               order: q.order || index + 1,
               frontText: q.frontText || "",
               backText: q.backText || "",
               explanation: q.explanation || "",
               points: q.points || 1,
            })
         );

         setAiGeneratedQuestions(flashcardQuestions);
      }

      // Force re-render forms with new data
      setFormKey((prev) => prev + 1);

      // Use setTimeout to ensure forms are re-rendered before setting values
      setTimeout(() => {
         // Populate quiz info
         if (quizInfoRef.current) {
            const normalizedSettings = aiDataReceived?.settings
               ? {
                    shuffleQuestions:
                       !!aiDataReceived.settings.shuffleQuestions,
                    showCorrectAnswersAfterSubmit:
                       !!aiDataReceived.settings.showCorrectAnswersAfterSubmit,
                    timeLimitMinutes:
                       aiDataReceived.settings.timeLimitMinutes ?? null,
                 }
               : undefined;

            quizInfoRef.current.setValues?.({
               title: aiDataReceived?.title || "AI Generated Flashcard Quiz",
               description:
                  aiDataReceived?.description ||
                  "Generated by AI from material",
               quizMode: aiDataReceived?.quizMode || "STUDY",
               settings: normalizedSettings,
               tags: aiDataReceived?.tags || [],
               totalQuestions: aiDataReceived?.questionArr?.length || 0,
            });
         }
      }, 100);
   };

   // Clear AI data when starting fresh
   const handleClearAIData = () => {
      setAiData(null);
      setAiGeneratedQuestions([]);
      setFormKey((prev) => prev + 1);
   };

   // Render loading state for AI generation
   if (generateFlashcard.isPending) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <div className="text-lg text-muted-foreground">
               AI đang tạo flashcards từ tài liệu...
            </div>
         </div>
      );
   }

   if (generateFlashcard.isError) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <BookOpen className="h-16 w-16 text-red-400 mb-4" />
            <div className="text-lg text-red-400 mb-2">
               AI không thể tạo flashcards
            </div>
            <div className="text-sm text-muted-foreground mb-4">
               Vui lòng thử lại sau
            </div>
            <Button onClick={() => window.location.reload()}>
               Tải lại trang
            </Button>
         </div>
      );
   }

   return (
      <div className=" mx-auto my-6 p-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle>Tạo Flashcard Quiz</CardTitle>
               <div className="flex gap-2">
                  <Button onClick={() => setShowMaterialModal(true)}>
                     Tạo flashcard bằng AI
                  </Button>
                  {aiData && (
                     <Button variant="outline" onClick={handleClearAIData}>
                        Xóa dữ liệu AI
                     </Button>
                  )}
               </div>
            </CardHeader>

            <CardContent className="space-y-6">
               {/* Show AI data info if available */}
               {aiData && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                     <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        📚 Dữ liệu từ AI
                     </h4>
                     <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                        Đã tạo {aiGeneratedQuestions.length} flashcards từ tài
                        liệu
                     </p>
                     <p className="text-xs text-blue-700 dark:text-blue-300">
                        Bạn có thể chỉnh sửa thông tin bên dưới trước khi lưu
                     </p>
                  </div>
               )}

               <div key={`quiz-info-${formKey}`}>
                  <QuizInfoForm ref={quizInfoRef} isFlashcard={true} />
               </div>

               <div key={`quiz-questions-${formKey}`}>
                  <FlashCardQuizQuestionsForm
                     ref={quizQuestionsRef}
                     initial={
                        aiGeneratedQuestions.length > 0
                           ? aiGeneratedQuestions
                           : undefined
                     }
                  />
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
         <MaterialModal
            isOpen={showMaterialModal}
            onClose={() => setShowMaterialModal(false)}
            onSelectMaterial={handleMaterialSelect}
         />
      </div>
   );
};

export default CreateFlashcardQuiz;
