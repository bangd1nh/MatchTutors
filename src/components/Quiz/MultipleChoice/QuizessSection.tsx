import { IDoQuestions, useDoMCQStore } from "@/store/useDoMCQStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef, useRef, useImperativeHandle } from "react";

type Props = {
   questions: IDoQuestions[];
   settings: any;
};

export interface QuizessSectionRef {
   scrollToQuestion: (questionIndex: number) => void;
}

const QuizessSection = forwardRef<QuizessSectionRef, Props>((props, ref) => {
   const { doQuestion, submited } = useDoMCQStore();
   const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

   const showCorrectAnswers =
      props.settings?.showCorrectAnswersAfterSubmit && submited;

   const scrollToQuestion = (questionIndex: number) => {
      const questionElement = questionRefs.current[questionIndex];
      if (questionElement) {
         const elementPosition = questionElement.offsetTop;
         const offsetPosition = elementPosition - 80;

         window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
         });
      }
   };

   useImperativeHandle(ref, () => ({
      scrollToQuestion,
   }));

   return (
      <div className="space-y-6">
         {props.questions.map((question, questionIndex) => (
            <Card
               key={question._id}
               className="w-full border-border bg-card"
               ref={(el) => {
                  questionRefs.current[questionIndex] = el;
               }}
            >
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <CardTitle className="text-lg text-foreground">
                        Câu {questionIndex + 1}
                     </CardTitle>
                     <Badge
                        variant="outline"
                        className="text-muted-foreground border-border"
                     >
                        {question.points} điểm
                     </Badge>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-foreground">
                     {question.questionText}
                  </p>
               </CardHeader>

               <CardContent className="space-y-4">
                  {/* Options */}
                  <div className="space-y-3">
                     {question.options?.map((option, optionIndex) => {
                        const isSelected = question.answer.includes(option);
                        const isCorrect =
                           question.correctAnswer?.includes(option);

                        return (
                           <div
                              key={`${question._id}-option-${optionIndex}`}
                              className={cn(
                                 "flex items-center space-x-3 p-3 rounded-lg border transition-colors",
                                 showCorrectAnswers
                                    ? isCorrect
                                       ? "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800"
                                       : isSelected && !isCorrect
                                       ? "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800"
                                       : "hover:bg-muted/50 border-border"
                                    : "hover:bg-muted/50 border-border"
                              )}
                           >
                              <Checkbox
                                 id={`option-${question._id}-${optionIndex}`}
                                 checked={isSelected}
                                 disabled={submited}
                                 onCheckedChange={() =>
                                    !submited &&
                                    doQuestion(question._id!, option)
                                 }
                                 className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <Label
                                 htmlFor={`option-${question._id}-${optionIndex}`}
                                 className={cn(
                                    "flex-1 text-sm leading-relaxed text-foreground",
                                    !submited
                                       ? "cursor-pointer"
                                       : "cursor-default"
                                 )}
                              >
                                 {option}
                              </Label>

                              {/* Show correct/incorrect icons after submit */}
                              {showCorrectAnswers && (
                                 <div className="flex items-center">
                                    {isCorrect && (
                                       <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    )}
                                    {isSelected && !isCorrect && (
                                       <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    )}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>

                  {/* Show correct answers summary after submit */}
                  {showCorrectAnswers && (
                     <>
                        <Separator className="bg-border" />
                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                           <h4 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                              Đáp án đúng:
                           </h4>
                           <div className="text-sm text-green-800 dark:text-green-200">
                              {question.correctAnswer?.map((answer, index) => (
                                 <span
                                    key={index}
                                    className="inline-block bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-2 py-1 rounded mr-2 mb-1 border border-green-200 dark:border-green-700"
                                 >
                                    {answer}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </>
                  )}

                  {/* Explanation (if exists) */}
                  {question.explanation && showCorrectAnswers && (
                     <>
                        <Separator className="bg-border" />
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                           <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                              Giải thích:
                           </h4>
                           <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                              {question.explanation}
                           </p>
                        </div>
                     </>
                  )}
               </CardContent>
            </Card>
         ))}
      </div>
   );
});

QuizessSection.displayName = "QuizessSection";

export default QuizessSection;
