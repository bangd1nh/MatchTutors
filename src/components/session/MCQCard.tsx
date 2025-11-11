import { useMCQAssignedToSession } from "@/hooks/useQuiz";
import {
   BookOpen,
   Calendar,
   Edit3,
   Loader2,
   Plus,
   Tag,
   Users,
   History,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useAsignMCQStore } from "@/store/useAsignMCQStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { IQuizInfo } from "@/types/quiz";
import MCQListModal from "./MCQListModal";
import { useFetchAttempt } from "@/hooks/useMCQ";

const MCQCard = ({ session, canManage }: any) => {
   const {
      data: quizzesAssignedData,
      isLoading,
      isError,
   } = useMCQAssignedToSession(session._id);

   const { attempts } = useFetchAttempt(session._id);

   const { initMCQ, mcq, setSessionId } = useAsignMCQStore();
   const navigate = useNavigate();

   const quizzes = Array.isArray(quizzesAssignedData?.data)
      ? (quizzesAssignedData!.data as IQuizInfo[])
      : ([] as IQuizInfo[]);

   const [isShowingModal, setIsShowingModal] = useState(false);

   useEffect(() => {
      if (
         !isLoading &&
         !attempts.isLoading &&
         quizzesAssignedData?.data &&
         quizzes.length > 0
      ) {
         initMCQ(quizzes, session._id);
         setSessionId(session._id);
      }
   }, [quizzesAssignedData, session._id, isLoading, attempts.isLoading]);

   // Function to get attempt data for a specific quiz
   const getQuizAttempts = (quizId: string) => {
      if (!attempts.data?.data) return null;
      return attempts.data.data.find(
         (attempt: any) => attempt.quizId === quizId
      );
   };

   if (isLoading || attempts.isLoading) {
      return (
         <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Đang tải danh sách MCQ...</p>
         </div>
      );
   }

   if (isError || attempts.isError) {
      return (
         <div className="text-center h-96 flex items-center justify-center">
            <div className="text-red-500">
               <p className="text-lg font-medium">Lỗi!</p>
               <p>Không thể tải dữ liệu MCQ. Vui lòng thử lại.</p>
            </div>
         </div>
      );
   }

   return (
      <div>
         <MCQListModal
            isOpen={isShowingModal}
            onClose={() => setIsShowingModal(false)}
            sessionId={session._id}
         />
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Bài trắc nghiệm ({mcq.length})
               </CardTitle>
               {canManage && (
                  <Button size="sm" onClick={() => setIsShowingModal(true)}>
                     <Plus className="h-4 w-4 mr-2" />
                     Gắn bài tập trắc nghiệm mới
                  </Button>
               )}
            </CardHeader>
            <CardContent>
               {mcq.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                     <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                     <p>Chưa có MCQ nào.</p>
                     {canManage && (
                        <p className="text-sm mt-2">
                           Nhấn "Gắn bài tập trắc nghiệm mới" để thêm MCQ.
                        </p>
                     )}
                  </div>
               ) : (
                  <div className="space-y-4">
                     {mcq.map((quiz, index: number) => {
                        const quizAttempts = getQuizAttempts(quiz._id);

                        return (
                           <Card
                              key={quiz._id}
                              className="border border-border"
                           >
                              <CardContent className="p-4">
                                 <div className="space-y-3">
                                    {/* Header Row */}
                                    <div className="flex items-start justify-between">
                                       <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-2">
                                             <h3 className="font-semibold text-lg truncate">
                                                {quiz.title ||
                                                   `MCQ ${index + 1}`}
                                             </h3>
                                             <Badge
                                                variant="default"
                                                className="text-xs shrink-0"
                                             >
                                                MCQ
                                             </Badge>
                                             {quizAttempts && (
                                                <Badge
                                                   variant="secondary"
                                                   className="text-xs shrink-0"
                                                >
                                                   {quizAttempts.attempt} lần
                                                   làm
                                                </Badge>
                                             )}
                                          </div>
                                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                             {quiz.description ||
                                                "Không có mô tả"}
                                          </p>
                                       </div>

                                       <Badge
                                          variant="outline"
                                          className="ml-3 shrink-0 bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800"
                                       >
                                          Multiple Choice
                                       </Badge>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                       <div className="flex items-center gap-1">
                                          <Users className="h-3 w-3" />
                                          <span>
                                             {quiz.totalQuestions || 0} câu hỏi
                                          </span>
                                       </div>
                                       <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>
                                             {quiz.createdAt
                                                ? new Date(
                                                     quiz.createdAt
                                                  ).toLocaleDateString("vi-VN")
                                                : "N/A"}
                                          </span>
                                       </div>
                                       <Badge
                                          variant="outline"
                                          className="text-xs"
                                       >
                                          {quiz.quizMode === "STUDY"
                                             ? "HỌC TẬP"
                                             : quiz.quizMode || "STUDY"}
                                       </Badge>
                                    </div>

                                    {/* Tags Row */}
                                    {quiz.tags && quiz.tags.length > 0 && (
                                       <div className="flex items-center gap-2">
                                          <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                                          <div className="flex flex-wrap gap-1">
                                             {quiz.tags
                                                .slice(0, 3)
                                                .map(
                                                   (
                                                      tag: string,
                                                      tagIndex: number
                                                   ) => (
                                                      <Badge
                                                         key={`${quiz._id}-tag-${tagIndex}`}
                                                         variant="secondary"
                                                         className="text-xs px-2 py-0.5"
                                                      >
                                                         {tag}
                                                      </Badge>
                                                   )
                                                )}
                                             {quiz.tags.length > 3 && (
                                                <Badge
                                                   variant="outline"
                                                   className="text-xs px-2 py-0.5"
                                                >
                                                   +{quiz.tags.length - 3} khác
                                                </Badge>
                                             )}
                                          </div>
                                       </div>
                                    )}

                                    {/* Settings Row */}
                                    {quiz.settings && (
                                       <div className="flex items-center gap-2">
                                          {quiz.settings.shuffleQuestions && (
                                             <Badge
                                                variant="outline"
                                                className="text-xs"
                                             >
                                                Xáo trộn
                                             </Badge>
                                          )}
                                          {quiz.settings
                                             .showCorrectAnswersAfterSubmit && (
                                             <Badge
                                                variant="outline"
                                                className="text-xs"
                                             >
                                                Hiện đáp án
                                             </Badge>
                                          )}
                                          {quiz.settings.timeLimitMinutes && (
                                             <Badge
                                                variant="outline"
                                                className="text-xs"
                                             >
                                                {quiz.settings.timeLimitMinutes}{" "}
                                                phút
                                             </Badge>
                                          )}
                                       </div>
                                    )}

                                    {/* Action Buttons Row */}
                                    <div className="pt-3 border-t border-border">
                                       <div className="flex items-center justify-between">
                                          {/* Primary Actions */}
                                          <div className="flex items-center gap-2">
                                             <Link
                                                to={
                                                   canManage
                                                      ? `/tutor/multipleChoice?multipleChoiceId=${quiz._id}`
                                                      : `/student/doMCQ?multipleChoiceId=${quiz._id}`
                                                }
                                             >
                                                <Button
                                                   size="sm"
                                                   className="h-8"
                                                >
                                                   {canManage
                                                      ? "Xem"
                                                      : "Làm bài"}
                                                </Button>
                                             </Link>

                                             {canManage && (
                                                <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   className="h-8 w-8 p-0"
                                                   onClick={() => {
                                                      navigate(
                                                         `/tutor/editMultipleChoice?multipleChoiceId=${quiz._id}`
                                                      );
                                                   }}
                                                >
                                                   <Edit3 className="h-4 w-4" />
                                                </Button>
                                             )}
                                          </div>

                                          {/* History Actions for Students */}
                                          {!canManage && (
                                             <div className="flex items-center gap-1">
                                                {quizAttempts &&
                                                quizAttempts.submissionIds ? (
                                                   <>
                                                      <span className="text-xs text-muted-foreground mr-2">
                                                         Lịch sử:
                                                      </span>
                                                      {quizAttempts.submissionIds.map(
                                                         (
                                                            submissionId,
                                                            attemptIndex
                                                         ) => (
                                                            <Button
                                                               key={
                                                                  submissionId
                                                               }
                                                               variant="outline"
                                                               size="sm"
                                                               className="h-7 px-2 text-xs"
                                                               onClick={() => {
                                                                  navigate(
                                                                     `/student/doneMCQ?quizId=${submissionId}`
                                                                  );
                                                               }}
                                                               title={`Xem kết quả lần làm bài thứ ${
                                                                  attemptIndex +
                                                                  1
                                                               }`}
                                                            >
                                                               <History className="h-3 w-3 mr-1" />
                                                               Lần{" "}
                                                               {attemptIndex +
                                                                  1}
                                                            </Button>
                                                         )
                                                      )}
                                                   </>
                                                ) : (
                                                   <span className="text-xs text-muted-foreground">
                                                      Chưa có lần làm bài nào
                                                   </span>
                                                )}
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                        );
                     })}
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
};

export default MCQCard;
