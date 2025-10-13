import MultipleChoiceQuizQuestionForm, {
   MultipleChoiceQuestionsFormHandle,
} from "@/components/Quiz/MultipleChoice/MultipleChoiceQuizQuestionForm";
import QuizInfoForm, { QuizInfoHandle } from "@/components/Quiz/QuizInfoForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMCQ } from "@/hooks/useMCQ";
import { useToast } from "@/hooks/useToast";
import { useMultipleChoiceQuizStore } from "@/store/useMultipleChoiceQuizStore";
import { IQuizBody } from "@/types/quiz";
import { useRef } from "react";

const CreateMultipleChoiceQuiz = () => {
   const quizInfoRef = useRef<QuizInfoHandle | null>(null);
   const mcqRef = useRef<MultipleChoiceQuestionsFormHandle | null>(null);
   const getMCQ = useMultipleChoiceQuizStore();
   const addToast = useToast();
   const { create } = useMCQ();

   const handleSubmit = async () => {
      if (!quizInfoRef.current || !mcqRef.current) return;
      const infoValid = await quizInfoRef.current.validate?.();
      const mcqValid = await mcqRef.current.validate?.();
      if (infoValid === false || mcqValid.valid === false) {
         addToast("error", "Vui lòng kiểm tra thông tin quiz và các thẻ");
         return;
      }
      const infoValues = quizInfoRef.current.getValues();
      const mcqValues = getMCQ.getMultipleChoiceQuizQuestions();

      // const mappedQuestions = mcqValues.map((q) => ({
      //    ...q,
      //    options: q.options.map((opt) => opt.trim()),
      //    correctAnswer: q.correctAnswer?.trim(),
      // }));

      const payload = {
         ...infoValues,
         questionArr: mcqValues,
         totalQuestions: mcqValues.length,
      } as IQuizBody;
      console.log("Payload to submit:", payload);
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
                  <QuizInfoForm ref={quizInfoRef} />
               </div>

               <div>
                  <MultipleChoiceQuizQuestionForm ref={mcqRef} />
               </div>

               <div className="flex justify-end mt-2">
                  <Button
                     onClick={handleSubmit}
                     // disabled={createFlashcardQuiz.isPending}
                  >
                     {/* {createFlashcardQuiz.isPending
                        ? "Đang tạo ...."
                        : "Lưu / Submit"} */}
                     Lưu / Submit
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default CreateMultipleChoiceQuiz;
