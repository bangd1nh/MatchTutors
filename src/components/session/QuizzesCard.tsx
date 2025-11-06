import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Loader2, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import FlashcardListModal from "./FlashcardListModal";
import { useQuizzesAssignedToSession } from "@/hooks/useQuiz";
import { IQuizInfo } from "@/types/quiz";
import { useAsignFlashcardStore } from "@/store/useAsignFlashcardStore";

export default function QuizzesCard({ session, canManage }: any) {
   const {
      data: quizzesAssignedData,
      isLoading,
      isError,
   } = useQuizzesAssignedToSession(session._id);

   const quizzes = Array.isArray(quizzesAssignedData?.data)
      ? (quizzesAssignedData!.data as IQuizInfo[])
      : ([] as IQuizInfo[]);
   const { flashcards, isInitialized, initFromAPI } = useAsignFlashcardStore();

   const navigate = useNavigate();

   const [isShowingModal, setIsShowingModal] = useState(false);

   useEffect(() => {
      if (!isLoading && session._id && quizzes) {
         initFromAPI(session._id, quizzes);
      }
   }, [session._id, quizzes, isInitialized, initFromAPI]);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Đang tải danh sách flashcards...</p>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="text-center h-96 flex items-center justify-center">
            <div className="text-red-500">
               <p className="text-lg font-medium">Lỗi!</p>
               <p>Không thể tải dữ liệu flashcards. Vui lòng thử lại.</p>
            </div>
         </div>
      );
   }

   return (
      <Fragment>
         <FlashcardListModal
            isOpen={isShowingModal}
            onClose={() => setIsShowingModal(false)}
         />
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Flashcard ({flashcards.length})
               </CardTitle>
               {canManage && (
                  <Button size="sm" onClick={() => setIsShowingModal(true)}>
                     <Plus className="h-4 w-4 mr-2" />
                     Gắn Flashcard mới
                  </Button>
               )}
            </CardHeader>
            <CardContent>
               {flashcards.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                     <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                     <p>Chưa có flashcard nào.</p>
                     {canManage && (
                        <p className="text-sm mt-2">
                           Nhấn "Gắn Flashcard mới" để thêm flashcard.
                        </p>
                     )}
                  </div>
               ) : (
                  <div className="space-y-4">
                     {flashcards.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                           <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                           <p>Chưa có flashcard nào.</p>
                           {canManage && (
                              <p className="text-sm mt-2">
                                 Nhấn "Gắn Flashcard mới" để thêm flashcard.
                              </p>
                           )}
                        </div>
                     ) : (
                        <div className="space-y-4">
                           {flashcards.map((quiz, index: number) => (
                              <div
                                 key={quiz._id}
                                 className="border rounded-lg p-4"
                              >
                                 <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                       <div className="flex items-center gap-2 mb-1">
                                          <h3 className="font-medium">
                                             {quiz.title ||
                                                `Flashcard ${index + 1}`}
                                          </h3>
                                          <Badge
                                             variant={
                                                quiz.isAsigned
                                                   ? "default"
                                                   : "secondary"
                                             }
                                             className="text-xs"
                                          >
                                             {quiz.isAsigned
                                                ? "Đã gán"
                                                : "Chưa gán"}
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
                                                {quiz.totalQuestions || 0} câu
                                                hỏi
                                             </span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                             <Calendar className="h-3 w-3" />
                                             <span>
                                                {quiz.createdAt
                                                   ? new Date(
                                                        quiz.createdAt
                                                     ).toLocaleDateString(
                                                        "vi-VN"
                                                     )
                                                   : "N/A"}
                                             </span>
                                          </div>
                                          <Badge
                                             variant="outline"
                                             className="text-xs"
                                          >
                                             {quiz.quizMode === "STUDY"
                                                ? "HỌC TẬP"
                                                : "   "}
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
                                                      +{quiz.tags.length - 3}{" "}
                                                      khác
                                                   </Badge>
                                                )}
                                             </div>
                                          </div>
                                       )}

                                       {/* Settings */}
                                       {quiz.settings && (
                                          <div className="flex items-center gap-2 text-xs">
                                             {quiz.settings
                                                .shuffleQuestions && (
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
                                             {quiz.settings
                                                .timeLimitMinutes && (
                                                <Badge
                                                   variant="outline"
                                                   className="text-xs"
                                                >
                                                   {
                                                      quiz.settings
                                                         .timeLimitMinutes
                                                   }{" "}
                                                   phút
                                                </Badge>
                                             )}
                                          </div>
                                       )}

                                       {/* <p className="text-xs text-muted-foreground mt-2"> */}
                                       {/* ID: {quiz._id} */}
                                       {/* </p> */}
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                       <Badge variant="outline">
                                          Flashcard
                                       </Badge>

                                       {/* Nút Xem: dẫn tới /viewQuizz */}
                                       <Link
                                          to={
                                             canManage
                                                ? `/tutor/flashcard?flashcardId=${quiz._id}`
                                                : `/student/flashcard?flashcardId=${quiz._id}`
                                          }
                                       >
                                          <Button size="sm">Xem</Button>
                                       </Link>

                                       {canManage && (
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() => {
                                                navigate(
                                                   `/tutor/editFlashcard?flashcardId=${quiz._id}`
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
                  </div>
               )}
            </CardContent>
         </Card>
      </Fragment>
   );
}
