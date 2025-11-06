import { IQuizQuestion } from "@/types/quizQuestion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Send, Clock } from "lucide-react";

interface IDoQuestions extends IQuizQuestion {
   isDone: boolean;
}

type Props = {
   questions: IDoQuestions[];
   onSubmit?: () => void;
   isSubmitting?: boolean;
   timeRemaining?: number;
   onQuestionClick?: (questionIndex: number) => void;
};

const QuizNumberSection = (props: Props) => {
   const completedCount = props.questions.filter((q) => q.isDone).length;
   const totalCount = props.questions.length;
   const progressPercentage =
      totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

   const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
   };

   const handleQuestionClick = (questionIndex: number) => {
      if (props.onQuestionClick) {
         props.onQuestionClick(questionIndex);
      }
   };

   return (
      <Card className="w-full h-fit sticky top-20 border-border bg-card">
         <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-foreground">
               <span>Danh sách câu hỏi</span>
               <Badge
                  variant="outline"
                  className="text-sm border-border text-muted-foreground"
               >
                  {completedCount}/{totalCount}
               </Badge>
            </CardTitle>

            {/* Progress Bar */}
            <div className="space-y-2">
               <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tiến độ hoàn thành</span>
                  <span>{Math.round(progressPercentage)}%</span>
               </div>
               <Progress value={progressPercentage} className="h-2 bg-muted" />
            </div>

            {/* Timer */}
            {props.timeRemaining !== undefined && (
               <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                  <span className="text-orange-600 dark:text-orange-400 font-medium">
                     Thời gian còn lại: {formatTime(props.timeRemaining)}
                  </span>
               </div>
            )}
         </CardHeader>

         <CardContent className="space-y-4">
            {/* Question Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
               {props.questions.map((question, index) => (
                  <Button
                     key={question._id}
                     variant={question.isDone ? "default" : "outline"}
                     size="sm"
                     onClick={() => handleQuestionClick(index)}
                     className={cn(
                        "w-10 h-10 p-0 text-sm font-medium transition-all duration-200 cursor-pointer",
                        question.isDone
                           ? "bg-green-500 hover:bg-green-600 text-white border-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                           : "hover:bg-muted border-border text-foreground"
                     )}
                     title={`Câu hỏi ${index + 1}${
                        question.isDone
                           ? " (Đã hoàn thành)"
                           : " (Chưa hoàn thành)"
                     } - Click để chuyển đến câu hỏi`}
                  >
                     {index + 1}
                  </Button>
               ))}
            </div>

            <Separator className="bg-border" />

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 text-sm">
               <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <span className="text-muted-foreground">Đã hoàn thành</span>
               </div>
               <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-muted-foreground">Chưa hoàn thành</span>
               </div>
            </div>

            <Separator className="bg-border" />

            {/* Submit Section */}
            <div className="space-y-3">
               <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                     Bạn đã hoàn thành {completedCount} / {totalCount} câu hỏi
                  </p>

                  {completedCount < totalCount && (
                     <p className="text-xs text-orange-600 dark:text-orange-400">
                        Còn {totalCount - completedCount} câu hỏi chưa hoàn
                        thành
                     </p>
                  )}
               </div>

               <Button
                  onClick={props.onSubmit}
                  disabled={props.isSubmitting || completedCount === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
               >
                  {props.isSubmitting ? (
                     <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                        Đang nộp bài...
                     </>
                  ) : (
                     <>
                        <Send className="h-4 w-4 mr-2" />
                        Nộp bài ({completedCount}/{totalCount})
                     </>
                  )}
               </Button>

               {completedCount < totalCount && (
                  <p className="text-xs text-center text-muted-foreground">
                     Bạn có thể nộp bài mà không cần hoàn thành hết câu hỏi
                  </p>
               )}
            </div>
         </CardContent>
      </Card>
   );
};

export default QuizNumberSection;
