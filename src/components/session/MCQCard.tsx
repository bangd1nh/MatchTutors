import { useMCQAssignedToSession } from "@/hooks/useQuiz";
import {
   BookOpen,
   Calendar,
   Edit3,
   Loader2,
   Plus,
   Tag,
   Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useAsignMCQStore } from "@/store/useAsignMCQStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { IQuizInfo } from "@/types/quiz";
import MCQListModal from "./MCQListModal";

const MCQCard = ({ session, canManage }: any) => {
   const {
      data: quizzesAssignedData,
      isLoading,
      isError,
   } = useMCQAssignedToSession(session._id);

   const { initMCQ, mcq, setSessionId, sessionId } = useAsignMCQStore();
   const navigate = useNavigate();

   const quizzes = Array.isArray(quizzesAssignedData?.data)
      ? (quizzesAssignedData!.data as IQuizInfo[])
      : ([] as IQuizInfo[]);

   const [isShowingModal, setIsShowingModal] = useState(false);

   useEffect(() => {
      if (!isLoading && quizzesAssignedData?.data && quizzes.length > 0) {
         initMCQ(quizzes, session._id);
         setSessionId(session._id);
      }
      console.log(mcq, sessionId);
   }, [quizzesAssignedData, session._id, isLoading]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Đang tải danh sách MCQ...</p>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="text-center h-96 flex items-center justify-center">
            <div className="text-red-500">
               <p className="text-lg font-medium">Lỗi!</p>
               <p>Không thể tải dữ liệu MCQ. Vui lòng thử lại.</p>
            </div>
         </div>
      );
   }

   console.log("mcq", mcq, sessionId);

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
                     {mcq.map((quiz, index: number) => (
                        <div key={quiz._id} className="border rounded-lg p-4">
                           <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                 <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-medium">
                                       {quiz.title || `MCQ ${index + 1}`}
                                    </h3>
                                    <Badge
                                       variant="default"
                                       className="text-xs"
                                    >
                                       MCQ
                                    </Badge>
                                 </div>

                                 <p className="text-sm text-muted-foreground mb-2">
                                    {quiz.description || "Không có mô tả"}
                                 </p>

                                 {/* Stats Row */}
                                 <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
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

                                 {/* Tags */}
                                 {quiz.tags && quiz.tags.length > 0 && (
                                    <div className="flex items-center gap-1 mb-2">
                                       <Tag className="h-3 w-3 text-muted-foreground" />
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

                                 {/* Settings */}
                                 {quiz.settings && (
                                    <div className="flex items-center gap-2 text-xs">
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
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                 <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-600 border-blue-200"
                                 >
                                    Multiple Choice
                                 </Badge>

                                 {/* Nút Xem */}
                                 <Link
                                    to={
                                       canManage
                                          ? `/tutor/multipleChoice?multipleChoiceId=${quiz._id}`
                                          : `/student/doMCQ?multipleChoiceId=${quiz._id}`
                                    }
                                 >
                                    <Button size="sm">
                                       {canManage ? "Xem" : "Làm bài"}
                                    </Button>
                                 </Link>

                                 {canManage && (
                                    <Button
                                       variant="ghost"
                                       size="sm"
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
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
};

export default MCQCard;
