import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMCQ } from "@/hooks/useMCQ";
import { IQuizInfo } from "@/types/quiz";
import {
   Calendar,
   Eye,
   Edit,
   Trash2,
   BookOpen,
   Settings,
   Tag,
   Clock,
   Users,
   Plus,
} from "lucide-react";

const ViewMultipleQuizList: React.FC = () => {
   const { fetchList } = useMCQ();
   const navigate = useNavigate();

   const isLoading = fetchList.isLoading;
   const isError = fetchList.isError;
   const data = fetchList.data;
   const quizzes: IQuizInfo[] = Array.isArray(data?.data) ? data!.data : [];

   if (isLoading) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <div className="text-lg text-muted-foreground">
               Đang tải danh sách quiz...
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <BookOpen className="h-16 w-16 text-red-400 mb-4" />
            <div className="text-lg text-red-400 mb-2">
               Không tải được danh sách quiz
            </div>
            <div className="text-sm text-muted-foreground">
               Vui lòng thử lại sau
            </div>
         </div>
      );
   }

   if (!quizzes.length) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <BookOpen className="h-20 w-20 text-muted-foreground mb-6" />
            <div className="text-xl text-muted-foreground mb-2">
               Chưa có multiple choice quiz nào
            </div>
            <div className="text-sm text-muted-foreground mb-4">
               Tạo quiz đầu tiên của bạn
            </div>
            <Button
               onClick={() => navigate("/tutor/createMultipleChoice")}
               className="px-6"
            >
               <Plus className="h-4 w-4 mr-2" />
               Tạo Quiz mới
            </Button>
         </div>
      );
   }

   return (
      <div className="mx-auto p-6">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
               Danh sách Multiple Choice Quiz
            </h1>
            <p className="text-muted-foreground">
               Quản lý và xem các bộ quiz trắc nghiệm của bạn
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {quizzes.map((q: IQuizInfo) => (
               <Card
                  key={q._id}
                  className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500/50 hover:border-l-blue-500 bg-gradient-to-br from-card to-card/50"
               >
                  <CardHeader className="pb-4">
                     <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                           <CardTitle className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {q.title}
                           </CardTitle>
                           <p className="text-sm text-muted-foreground line-clamp-2">
                              {q.description || "Không có mô tả"}
                           </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                           <Badge
                              variant="default"
                              className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-medium"
                           >
                              {String(q.quizType ?? "MULTIPLE_CHOICE")}
                           </Badge>
                           <Badge
                              variant="secondary"
                              className="bg-secondary/50"
                           >
                              {String(q.quizMode ?? "STUDY")}
                           </Badge>
                        </div>
                     </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                     {/* Stats Row */}
                     <div className="flex items-center justify-between bg-secondary/20 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-blue-600" />
                           <span className="text-sm font-medium">
                              {q.totalQuestions ?? 0} câu hỏi
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm text-muted-foreground">
                              {q.createdAt
                                 ? new Date(q.createdAt).toLocaleDateString(
                                      "vi-VN"
                                   )
                                 : "—"}
                           </span>
                        </div>
                     </div>

                     {/* Tags */}
                     {q.tags && q.tags.length > 0 && (
                        <div className="space-y-2">
                           <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Tags:</span>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {q.tags.slice(0, 4).map((tag: string, index) => (
                                 <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs bg-background/50"
                                 >
                                    {tag}
                                 </Badge>
                              ))}
                              {q.tags.length > 4 && (
                                 <Badge variant="outline" className="text-xs">
                                    +{q.tags.length - 4} khác
                                 </Badge>
                              )}
                           </div>
                        </div>
                     )}

                     {/* Settings */}
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <Settings className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm font-medium">Cài đặt:</span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                           {q.settings ? (
                              <>
                                 <div className="flex items-center justify-between">
                                    <span>Xáo trộn câu hỏi:</span>
                                    <Badge
                                       variant={
                                          q.settings.shuffleQuestions
                                             ? "default"
                                             : "secondary"
                                       }
                                       className="text-xs"
                                    >
                                       {q.settings.shuffleQuestions
                                          ? "Có"
                                          : "Không"}
                                    </Badge>
                                 </div>
                                 <div className="flex items-center justify-between">
                                    <span>Hiện đáp án:</span>
                                    <Badge
                                       variant={
                                          q.settings
                                             .showCorrectAnswersAfterSubmit
                                             ? "default"
                                             : "secondary"
                                       }
                                       className="text-xs"
                                    >
                                       {q.settings.showCorrectAnswersAfterSubmit
                                          ? "Có"
                                          : "Không"}
                                    </Badge>
                                 </div>
                                 {q.settings.timeLimitMinutes && (
                                    <div className="flex items-center justify-between">
                                       <span>Thời gian giới hạn:</span>
                                       <Badge
                                          variant="outline"
                                          className="text-xs"
                                       >
                                          <Clock className="h-3 w-3 mr-1" />
                                          {q.settings.timeLimitMinutes} phút
                                       </Badge>
                                    </div>
                                 )}
                              </>
                           ) : (
                              <span className="italic">
                                 Chưa có cài đặt nào
                              </span>
                           )}
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                           size="sm"
                           variant="outline"
                           className="flex-1 gap-2 hover:bg-blue-500 hover:text-white transition-colors"
                           onClick={() =>
                              navigate(
                                 `/tutor/multipleChoice?multipleChoiceId=${q._id}`
                              )
                           }
                        >
                           <Eye className="h-4 w-4" />
                           Xem
                        </Button>

                        <Button
                           size="sm"
                           variant="outline"
                           className="flex-1 gap-2 hover:bg-green-500 hover:text-white transition-colors"
                           onClick={() =>
                              navigate(
                                 `/tutor/editMultipleChoice?multipleChoiceId=${q._id}`
                              )
                           }
                        >
                           <Edit className="h-4 w-4" />
                           Sửa
                        </Button>

                        <Button
                           size="sm"
                           variant="outline"
                           className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                           onClick={() => {
                              // TODO: Implement delete functionality
                              console.log("Delete quiz:", q._id);
                           }}
                        >
                           <Trash2 className="h-4 w-4" />
                           Xóa
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
};

export default ViewMultipleQuizList;
