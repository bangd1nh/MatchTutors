import { useShortAnswerQuizzesAssignedToSession } from "@/hooks/useSAQ";
import {
   FileText,
   Calendar,
   Edit3,
   Loader2,
   Plus,
   Tag,
   Users,
   History,
   ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useAsignSAQStore } from "@/store/useAsignSAQStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { IQuizInfo } from "@/types/quiz";
import SAQListModal from "./SAQListModal";
import { useFetchAttempt } from "@/hooks/useMCQ";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

const SAQCard = ({ session, canManage }: any) => {
   const {
      data: quizzesAssignedData,
      isLoading,
      isError,
   } = useShortAnswerQuizzesAssignedToSession(session._id);

   const { attempts } = useFetchAttempt(session._id);

   const { initSAQ, saq, setSessionId } = useAsignSAQStore();
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
         initSAQ(quizzes, session._id);
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
            <p className="ml-4 text-lg">Đang tải danh sách SAQ...</p>
         </div>
      );
   }

   if (isError || attempts.isError) {
      return (
         <div className="text-center h-96 flex items-center justify-center">
            <div className="text-red-500">
               <p className="text-lg font-medium">Lỗi!</p>
               <p>Không thể tải dữ liệu SAQ. Vui lòng thử lại.</p>
            </div>
         </div>
      );
   }

   return (
      <div>
         <SAQListModal
            isOpen={isShowingModal}
            onClose={() => setIsShowingModal(false)}
            sessionId={session._id}
         />
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Bài tập tự luận ({saq.length})
               </CardTitle>
               {canManage && (
                  <Button size="sm" onClick={() => setIsShowingModal(true)}>
                     <Plus className="h-4 w-4 mr-2" />
                     Gắn bài tập tự luận mới
                  </Button>
               )}
            </CardHeader>
            <CardContent>
               {saq.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                     <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                     <p>Chưa có bài tập tự luận nào.</p>
                     {canManage && (
                        <p className="text-sm mt-2">
                           Nhấn "Gắn bài tập tự luận mới" để thêm mới.
                        </p>
                     )}
                  </div>
               ) : (
                  <div className="space-y-4">
                     {saq.map((quiz, index: number) => {
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
                                                   `SAQ ${index + 1}`}
                                             </h3>
                                             <Badge
                                                variant="default"
                                                className="text-xs shrink-0"
                                             >
                                                SAQ
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
                                          className="ml-3 shrink-0 bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
                                       >
                                          Short Answer
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
                                    {/* Action Buttons Row */}
                                    <div className="pt-3 border-t border-border">
                                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                          {/* Primary Actions - Left Side */}
                                          <div className="flex items-center gap-2">
                                             <Link
                                                to={
                                                   canManage
                                                      ? `/tutor/shortAnswer?shortAnswerId=${quiz._id}`
                                                      : `/student/doSAQ?shortAnswerId=${quiz._id}`
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
                                                         `/tutor/editShortAnswer?shortAnswerId=${quiz._id}`
                                                      );
                                                   }}
                                                >
                                                   <Edit3 className="h-4 w-4" />
                                                </Button>
                                             )}
                                          </div>

                                          {/* History Section - Right Side */}
                                          {!canManage &&
                                             quizAttempts?.submissionIds && (
                                                <div className="flex items-center gap-2">
                                                   {quizAttempts.submissionIds
                                                      .length > 0 ? (
                                                      <>
                                                         {/* Latest Attempt Button */}
                                                         <Button
                                                            variant="default"
                                                            size="sm"
                                                            className="h-8 bg-blue-600 hover:bg-blue-700"
                                                            onClick={() => {
                                                               const latestId =
                                                                  quizAttempts
                                                                     .submissionIds[
                                                                     quizAttempts
                                                                        .submissionIds
                                                                        .length -
                                                                        1
                                                                  ];
                                                               navigate(
                                                                  `/student/doneSAQ?quizId=${latestId}`
                                                               );
                                                            }}
                                                         >
                                                            <History className="h-3 w-3 mr-1" />
                                                            Lần mới nhất
                                                         </Button>

                                                         {/* Attempts Counter with Popover */}
                                                         <Popover>
                                                            <PopoverTrigger
                                                               asChild
                                                            >
                                                               <Button
                                                                  variant="outline"
                                                                  size="sm"
                                                                  className="h-8 px-3 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
                                                               >
                                                                  <span className="text-xs font-medium">
                                                                     {
                                                                        quizAttempts
                                                                           .submissionIds
                                                                           .length
                                                                     }{" "}
                                                                     lần
                                                                  </span>
                                                               </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-56">
                                                               <div className="space-y-2">
                                                                  <div className="flex items-center justify-between">
                                                                     <h4 className="font-medium text-sm">
                                                                        Tất cả
                                                                        lần làm
                                                                        bài
                                                                     </h4>
                                                                     <Badge
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                     >
                                                                        {
                                                                           quizAttempts
                                                                              .submissionIds
                                                                              .length
                                                                        }
                                                                     </Badge>
                                                                  </div>
                                                                  <Separator />
                                                                  <div className="max-h-60 overflow-y-auto space-y-1">
                                                                     {quizAttempts.submissionIds.map(
                                                                        (
                                                                           submissionId,
                                                                           attemptIndex
                                                                        ) => {
                                                                           const isLatest =
                                                                              attemptIndex ===
                                                                              quizAttempts
                                                                                 .submissionIds
                                                                                 .length -
                                                                                 1;
                                                                           return (
                                                                              <Button
                                                                                 key={
                                                                                    submissionId
                                                                                 }
                                                                                 variant="ghost"
                                                                                 size="sm"
                                                                                 className={`w-full justify-between text-xs h-8 ${
                                                                                    isLatest
                                                                                       ? "bg-blue-50"
                                                                                       : ""
                                                                                 }`}
                                                                                 onClick={() => {
                                                                                    navigate(
                                                                                       `/student/doneSAQ?quizId=${submissionId}`
                                                                                    );
                                                                                 }}
                                                                              >
                                                                                 <span className="flex items-center gap-2">
                                                                                    <History className="h-3 w-3" />
                                                                                    Lần{" "}
                                                                                    {attemptIndex +
                                                                                       1}
                                                                                    {isLatest && (
                                                                                       <Badge
                                                                                          variant="outline"
                                                                                          className="text-[10px] h-4 px-1"
                                                                                       >
                                                                                          Mới
                                                                                       </Badge>
                                                                                    )}
                                                                                 </span>
                                                                                 <ChevronRight className="h-3 w-3 opacity-50" />
                                                                              </Button>
                                                                           );
                                                                        }
                                                                     )}
                                                                  </div>
                                                               </div>
                                                            </PopoverContent>
                                                         </Popover>
                                                      </>
                                                   ) : (
                                                      <span className="text-sm text-muted-foreground italic">
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

export default SAQCard;
