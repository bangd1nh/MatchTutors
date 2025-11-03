import MultipleChoiceQuizQuestionForm, {
   MultipleChoiceQuestionsFormHandle,
} from "@/components/Quiz/MultipleChoice/MultiplechoiceQuizQuestionForm";
import QuizInfoForm, { QuizInfoHandle } from "@/components/Quiz/QuizInfoForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMCQ } from "@/hooks/useMCQ";
import { useToast } from "@/hooks/useToast";
import { QuestionTypeEnum, QuizModeEnum } from "@/enums/quiz.enum";
import { IQuizBody } from "@/types/quiz";
import { useEffect, useRef } from "react";

const CreateMultipleChoiceQuiz = () => {
   const quizInfoRef = useRef<QuizInfoHandle | null>(null);
   const mcqRef = useRef<MultipleChoiceQuestionsFormHandle | null>(null);
   const addToast = useToast();
   const { create } = useMCQ();
   useEffect(() => {
      mcqRef.current?.reset?.();
      quizInfoRef.current?.reset?.();
   }, []);

   const handleSubmit = async () => {
      if (!quizInfoRef.current || !mcqRef.current) return;
      const newQuestions = mcqRef.current.getNew();
      const infoValid = await quizInfoRef.current.validate?.();
      const mcqValid = await mcqRef.current.validate?.();
      if (infoValid === false || mcqValid?.valid === false) {
         addToast("error", "Vui lòng kiểm tra thông tin quiz và các câu hỏi");
         const infoValues = quizInfoRef.current.getValues();
         console.log(infoValues);
         return;
      }

      const infoValues = quizInfoRef.current.getValues();

      // Xử lý câu hỏi (cần phải làm sạch các dữ liệu)
      const mappedQuestions = newQuestions.map((q) => ({
         questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
         quizMode: QuizModeEnum.EXAM,
         questionText: q.questionText,
         options: (q.options || []).map((opt) => opt.trim()),
         correctAnswer: q.correctAnswer?.map((ans: string) => ans.trim()) || [],
         explanation: q.explanation || "",
         points: q.points || 0,
         order: q.order || 0,
      }));

      const payload = {
         ...infoValues,
         questionArr: mappedQuestions,
         totalQuestions: mappedQuestions.length,
         quizType: QuestionTypeEnum.MULTIPLE_CHOICE,
      } as IQuizBody;
      console.log("Full payload:", payload);

      create.mutate(payload);
   };

   return (
      <div className=" mx-auto my-6 p-4">
         <Card>
            <CardHeader>
               <CardTitle>Tạo Multiple choice Quiz</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
               <div>
                  <QuizInfoForm ref={quizInfoRef} isFlashcard={false} />
               </div>

               <div>
                  <MultipleChoiceQuizQuestionForm ref={mcqRef} />
               </div>

               <div className="flex justify-end mt-2">
                  <Button onClick={handleSubmit} disabled={create.isPending}>
                     {create.isPending ? "Đang xử lý..." : "Lưu / Submit"}
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default CreateMultipleChoiceQuiz;
