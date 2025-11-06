import { useMCQ } from "@/hooks/useMCQ";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const ViewMCQHistoryList = () => {
   const { fetchMCQSubmitHistoryList } = useMCQ();
   const navigate = useNavigate();

   if (fetchMCQSubmitHistoryList.isLoading) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <div className="text-lg text-muted-foreground">
               Đang tải danh sách lịch sử trắc nghiệm...
            </div>
         </div>
      );
   }

   if (fetchMCQSubmitHistoryList.isError) {
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

   const submissionHistory = (fetchMCQSubmitHistoryList.data?.data ??
      []) as any[];

   if (submissionHistory.length === 0) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <BookOpen className="h-20 w-20 text-muted-foreground mb-6" />
            <div className="text-xl text-muted-foreground mb-2">
               Chưa có lịch sử làm bài nào
            </div>
            <div className="text-sm text-muted-foreground">
               Hãy làm bài trắc nghiệm đầu tiên của bạn
            </div>
         </div>
      );
   }

   const formatDate = (dateString: Date) => {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
   };

   return (
      <div className="container mx-auto p-6 space-y-6">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
               Lịch sử làm bài trắc nghiệm
            </h1>
            <p className="text-muted-foreground">
               Danh sách các bài trắc nghiệm bạn đã hoàn thành
               {/* {submissionHistory.length} bài) */}
            </p>
         </div>

         {/* Quiz History List */}
         <div className="grid gap-6">
            {submissionHistory.map((submission: any, index: number) => {
               const correctAnswers = submission.answers.filter(
                  (answer: any) => answer.isCorrect
               ).length;
               const totalQuestions = submission.answers.length;
               const accuracy = Math.round(
                  (correctAnswers / totalQuestions) * 100
               );

               return (
                  <Card
                     key={submission._id}
                     className="border-l-4 border-l-blue-500"
                  >
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="flex items-center gap-2">
                              <BookOpen className="h-5 w-5" />
                              <div className="flex flex-col">
                                 <span>{submission.quizId.title}</span>
                                 <span className="text-sm font-normal text-muted-foreground">
                                    {submission.quizId.description}
                                 </span>
                              </div>
                           </CardTitle>
                           <Badge
                              variant="default"
                              className="text-lg px-3 py-1"
                           >
                              <Trophy className="h-4 w-4 mr-1" />
                              {submission.score}
                           </Badge>
                        </div>
                     </CardHeader>

                     <CardContent className="space-y-4">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div className="text-center p-3 bg-secondary/20 rounded-lg">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <CheckCircle2 className="h-4 w-4 text-green-600" />
                                 <span className="text-sm font-medium">
                                    Đúng
                                 </span>
                              </div>
                              <div className="text-xl font-bold text-green-600">
                                 {correctAnswers}
                              </div>
                           </div>

                           <div className="text-center p-3 bg-secondary/20 rounded-lg">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <XCircle className="h-4 w-4 text-red-600" />
                                 <span className="text-sm font-medium">
                                    Sai
                                 </span>
                              </div>
                              <div className="text-xl font-bold text-red-600">
                                 {totalQuestions - correctAnswers}
                              </div>
                           </div>

                           <div className="text-center p-3 bg-secondary/20 rounded-lg">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <FileText className="h-4 w-4 text-blue-600" />
                                 <span className="text-sm font-medium">
                                    Tổng câu
                                 </span>
                              </div>
                              <div className="text-xl font-bold text-blue-600">
                                 {totalQuestions}
                              </div>
                           </div>

                           <div className="text-center p-3 bg-secondary/20 rounded-lg">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <Award className="h-4 w-4 text-purple-600" />
                                 <span className="text-sm font-medium">
                                    Độ chính xác
                                 </span>
                              </div>
                              <div
                                 className={`text-xl font-bold text-green-600 dark:text-green-400`}
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
                                 Nộp bài: {formatDate(submission.submittedAt)}
                              </span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>
                                 Chấm điểm: {formatDate(submission.gradedAt)}
                              </span>
                           </div>
                           <Badge variant="outline">
                              {submission.quizId.quizMode}
                           </Badge>
                           <Badge variant="outline">
                              {submission.quizId.quizType}
                           </Badge>
                        </div>

                        {/* Quiz Settings */}
                        <div className="bg-muted/50 p-3 rounded-lg">
                           <h4 className="font-medium mb-2">
                              Cài đặt bài kiểm tra:
                           </h4>
                           <div className="flex flex-wrap gap-2 text-xs">
                              <Badge variant="outline">
                                 {submission.quizSnapshot.settings
                                    .shuffleQuestions
                                    ? "Xáo trộn câu hỏi"
                                    : "Không xáo trộn"}
                              </Badge>
                              <Badge variant="outline">
                                 {submission.quizSnapshot.settings
                                    .showCorrectAnswersAfterSubmit
                                    ? "Hiện đáp án sau nộp bài"
                                    : "Không hiện đáp án"}
                              </Badge>
                              {submission.quizSnapshot.settings
                                 .timeLimitMinutes && (
                                 <Badge variant="outline">
                                    Giới hạn:{" "}
                                    {
                                       submission.quizSnapshot.settings
                                          .timeLimitMinutes
                                    }{" "}
                                    phút
                                 </Badge>
                              )}
                           </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t">
                           <div className="text-sm text-muted-foreground">
                              Lần thứ {index + 1} làm bài
                           </div>
                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {
                                    // Navigate to detailed view
                                    console.log(
                                       "View details:",
                                       submission._id
                                    );
                                    navigate(
                                       `/student/doneMCQ?quizId=${submission._id}`
                                    );
                                 }}
                              >
                                 <Eye className="h-4 w-4 mr-2" />
                                 Xem chi tiết
                              </Button>
                              <Button
                                 size="sm"
                                 onClick={() => {
                                    // Navigate to redo quiz
                                    console.log(
                                       "Redo quiz:",
                                       submission.quizId
                                    );
                                 }}
                              >
                                 Làm lại
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               );
            })}
         </div>
      </div>
   );
};

export default ViewMCQHistoryList;
