import { usefetchHistory } from "@/hooks/useMCQ";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
   BookOpen,
   Calendar,
   Trophy,
   Clock,
   Eye,
   CheckCircle2,
   XCircle,
   FileText,
   Award,
   ArrowLeft,
   User,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const ViewMCQHistory = () => {
   const searchParams = new URLSearchParams(window.location.search);
   const quizId = searchParams.get("quizId") || "";
   const navigate = useNavigate();

   const { isLoading, isError, data } = usefetchHistory(quizId);

   if (isLoading) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <div className="text-lg text-muted-foreground">
               Đang tải lịch sử làm bài...
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <BookOpen className="h-16 w-16 text-red-400 mb-4" />
            <div className="text-lg text-red-400 mb-2">
               Không tải được lịch sử bài trắc nghiệm
            </div>
            <div className="text-sm text-muted-foreground">
               Vui lòng thử lại sau
            </div>
         </div>
      );
   }

   const submissionData = data?.data;

   if (!submissionData) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <BookOpen className="h-20 w-20 text-muted-foreground mb-6" />
            <div className="text-xl text-muted-foreground mb-2">
               Không tìm thấy lịch sử làm bài
            </div>
            <div className="text-sm text-muted-foreground">
               Quiz này chưa được làm hoặc không tồn tại
            </div>
         </div>
      );
   }

   const formatDate = (dateString: Date | string) => {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
   };

   const getScoreColor = (score: number, total: number) => {
      const percentage = (score / total) * 100;
      if (percentage >= 80) return "text-green-600 dark:text-green-400";
      if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
   };

   const getScoreBadgeVariant = (score: number, total: number) => {
      const percentage = (score / total) * 100;
      if (percentage >= 80) return "default";
      if (percentage >= 60) return "secondary";
      return "destructive";
   };

   const correctAnswers = submissionData.answers.filter(
      (answer) => answer.isCorrect
   ).length;
   const totalQuestions = submissionData.answers.length;
   const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

   return (
      <div className="container mx-auto p-6 space-y-6">
         {/* Back Button */}
         <div className="mb-6">
            <Button
               variant="ghost"
               onClick={() => navigate(-1)}
               className="pl-0"
            >
               <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Button>
         </div>

         {/* Header */}
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
               Chi tiết kết quả làm bài
            </h1>
            <p className="text-muted-foreground">
               Kết quả chi tiết của bài quiz: {submissionData.quizId.title}
            </p>
         </div>

         {/* Quiz Info Card */}
         <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
               <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                     <BookOpen className="h-5 w-5" />
                     {submissionData.quizId.title}
                  </CardTitle>
                  <Badge
                     variant={getScoreBadgeVariant(
                        submissionData.score,
                        totalQuestions
                     )}
                     className="text-lg px-3 py-1"
                  >
                     <Award className="h-4 w-4 mr-1" />
                     {submissionData.score}/{totalQuestions} điểm
                  </Badge>
               </div>
               <p className="text-muted-foreground">
                  {submissionData.quizId.description}
               </p>
            </CardHeader>

            <CardContent className="space-y-4">
               {/* Stats Row */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                     <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                           Đúng
                        </span>
                     </div>
                     <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {correctAnswers}
                     </div>
                  </div>

                  <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                     <div className="flex items-center justify-center gap-1 mb-1">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                           Sai
                        </span>
                     </div>
                     <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {totalQuestions - correctAnswers}
                     </div>
                  </div>

                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                     <div className="flex items-center justify-center gap-1 mb-1">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                           Tổng câu
                        </span>
                     </div>
                     <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {totalQuestions}
                     </div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                     <div className="flex items-center justify-center gap-1 mb-1">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                           Độ chính xác
                        </span>
                     </div>
                     <div
                        className={`text-2xl font-bold ${getScoreColor(
                           submissionData.score,
                           totalQuestions
                        )}`}
                     >
                        {accuracy}%
                     </div>
                  </div>
               </div>

               {/* Details */}
               <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                     <Calendar className="h-4 w-4" />
                     <span>
                        Nộp bài: {formatDate(submissionData.submittedAt)}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock className="h-4 w-4" />
                     <span>
                        Chấm điểm: {formatDate(submissionData.gradedAt)}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <User className="h-4 w-4" />
                     <span>Học sinh: {submissionData.studentId.name}</span>
                  </div>
                  <Badge variant="outline">
                     {submissionData.quizSnapshot.quizMode}
                  </Badge>
                  <Badge variant="outline">
                     {submissionData.quizId.quizType}
                  </Badge>
               </div>

               {/* Quiz Settings */}
               <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                     <BookOpen className="h-4 w-4" />
                     Cài đặt bài kiểm tra:
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                     <Badge variant="outline">
                        {submissionData.quizSnapshot.settings.shuffleQuestions
                           ? "Xáo trộn câu hỏi"
                           : "Không xáo trộn"}
                     </Badge>
                     <Badge variant="outline">
                        {submissionData.quizSnapshot.settings
                           .showCorrectAnswersAfterSubmit
                           ? "Hiện đáp án sau nộp bài"
                           : "Không hiện đáp án"}
                     </Badge>
                     {submissionData.quizSnapshot.settings.timeLimitMinutes && (
                        <Badge variant="outline">
                           <Clock className="h-3 w-3 mr-1" />
                           Giới hạn:{" "}
                           {
                              submissionData.quizSnapshot.settings
                                 .timeLimitMinutes
                           }{" "}
                           phút
                        </Badge>
                     )}
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Detailed Answers */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Chi tiết từng câu hỏi ({totalQuestions} câu)
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {submissionData.answers.map((answer, index) => (
                  <div
                     key={`question-${index}`}
                     className={`p-4 rounded-lg border-l-4 transition-colors ${
                        answer.isCorrect
                           ? "border-l-green-500 bg-green-50 dark:bg-green-950/20"
                           : "border-l-red-500 bg-red-50 dark:bg-red-950/20"
                     }`}
                  >
                     <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">
                                 Câu {answer.questionId.order}
                              </Badge>
                              <Badge
                                 variant={
                                    answer.isCorrect ? "default" : "destructive"
                                 }
                                 className="text-xs"
                              >
                                 {answer.isCorrect ? (
                                    <>
                                       <CheckCircle2 className="h-3 w-3 mr-1" />
                                       Đúng
                                    </>
                                 ) : (
                                    <>
                                       <XCircle className="h-3 w-3 mr-1" />
                                       Sai
                                    </>
                                 )}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                 {answer.obtainedPoints}/
                                 {answer.questionId.points} điểm
                              </Badge>
                           </div>
                           <h4 className="font-medium text-foreground mb-2">
                              {answer.questionId.questionText}
                           </h4>
                        </div>
                     </div>

                     {/* Options */}
                     <div className="space-y-2 mb-3">
                        <div className="text-sm text-muted-foreground">
                           <strong>Các lựa chọn:</strong>
                        </div>
                        <div className="grid gap-1">
                           {answer.questionId.options.map(
                              (option, optionIndex) => {
                                 const isUserAnswer =
                                    answer.answer?.includes(option);
                                 const isCorrectOption =
                                    answer.questionId.correctAnswer.includes(
                                       option
                                    );

                                 return (
                                    <div
                                       key={optionIndex}
                                       className={`p-2 rounded text-sm border ${
                                          isCorrectOption
                                             ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"
                                             : isUserAnswer
                                             ? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700"
                                             : "bg-background border-border"
                                       }`}
                                    >
                                       <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                             {String.fromCharCode(
                                                65 + optionIndex
                                             )}
                                             .
                                          </span>
                                          <span className="flex-1">
                                             {option}
                                          </span>
                                          <div className="flex gap-1 ml-auto">
                                             {isCorrectOption && (
                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                             )}
                                             {isUserAnswer &&
                                                !isCorrectOption && (
                                                   <XCircle className="h-4 w-4 text-red-600" />
                                                )}
                                             {isUserAnswer &&
                                                isCorrectOption && (
                                                   <div className="flex gap-1">
                                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                      <User className="h-4 w-4 text-blue-600" />
                                                   </div>
                                                )}
                                          </div>
                                       </div>
                                    </div>
                                 );
                              }
                           )}
                        </div>
                     </div>

                     {/* User's Answer Summary */}
                     <div className="space-y-2 mb-3">
                        <div className="text-sm text-muted-foreground">
                           <strong>Câu trả lời của bạn:</strong>
                        </div>
                        <div className="bg-background border border-border rounded p-3">
                           {answer.answer && answer.answer.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                 {answer.answer.map((ans, ansIndex) => (
                                    <Badge
                                       key={ansIndex}
                                       variant={
                                          answer.isCorrect
                                             ? "default"
                                             : "destructive"
                                       }
                                       className="text-sm"
                                    >
                                       {ans}
                                    </Badge>
                                 ))}
                              </div>
                           ) : (
                              <span className="text-muted-foreground italic">
                                 Không có câu trả lời
                              </span>
                           )}
                        </div>
                     </div>

                     {/* Correct Answer Summary */}
                     <div className="space-y-2 mb-3">
                        <div className="text-sm text-muted-foreground">
                           <strong>Đáp án đúng:</strong>
                        </div>
                        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-3">
                           <div className="flex flex-wrap gap-2">
                              {answer.questionId.correctAnswer.map(
                                 (correctAns, correctIndex) => (
                                    <Badge
                                       key={correctIndex}
                                       variant="default"
                                       className="text-sm bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                                    >
                                       {correctAns}
                                    </Badge>
                                 )
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Explanation */}
                     {answer.questionId.explanation && (
                        <>
                           <Separator className="my-3" />
                           <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded border border-blue-200 dark:border-blue-800">
                              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                 Giải thích:
                              </h5>
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                 {answer.questionId.explanation}
                              </p>
                           </div>
                        </>
                     )}

                     {/* Points Summary */}
                     <div className="mt-3 flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                           <strong>Điểm đạt được:</strong>{" "}
                           {answer.obtainedPoints}/{answer.questionId.points}
                        </div>
                        {answer.isCorrect && (
                           <Badge variant="default" className="text-xs">
                              <Trophy className="h-3 w-3 mr-1" />
                              Chính xác
                           </Badge>
                        )}
                     </div>
                  </div>
               ))}
            </CardContent>
         </Card>

         {/* Action Buttons */}
         <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
               <ArrowLeft className="h-4 w-4 mr-2" />
               Quay lại danh sách
            </Button>
            <Button disabled={true} onClick={() => {}}>
               <Eye className="h-4 w-4 mr-2" />
               Làm lại bài quiz
            </Button>
         </div>
      </div>
   );
};

export default ViewMCQHistory;
