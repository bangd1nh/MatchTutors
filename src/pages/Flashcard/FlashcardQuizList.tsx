import React, { useState } from "react";
import { useDeleteFlashcard, useFetchQuizByTutor } from "@/hooks/useQuiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
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
   Search,
   X,
} from "lucide-react";
import DeleteFlashcardModal from "@/components/Quiz/FlashCard/DeleteFlashcardModal";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import { SUBJECT_VALUES, SUBJECT_LABELS_VI } from "@/enums/subject.enum";
import { LEVEL_VALUES, LEVEL_LABELS_VI } from "@/enums/level.enum";
import { useTutorProfile } from "@/hooks/useTutorProfile";

const FlashcardQuizList: React.FC = () => {
   const { tutorProfile } = useTutorProfile();
   const [selectedSubject, setSelectedSubject] = useState<string>("");
   const [selectedLevel, setSelectedLevel] = useState<string>("");
   const [activeSubject, setActiveSubject] = useState<string | undefined>(undefined);
   const [activeLevel, setActiveLevel] = useState<string | undefined>(undefined);
   const { data, isLoading, isError } = useFetchQuizByTutor(
      activeSubject,
      activeLevel
   );
   const navigate = useNavigate();
   const deleteQuiz = useDeleteFlashcard("flashcard");
   const [selectedQuizForDelete, setSelectedQuizForDelete] = useState<
      string | null
   >(null);

   const quizzes = Array.isArray(data?.data) ? data!.data : [];

   // Filter subjects and levels based on tutor's profile
   const availableSubjects = tutorProfile?.subjects 
      ? SUBJECT_VALUES.filter((s) => tutorProfile.subjects?.includes(s))
      : [];
   const availableLevels = tutorProfile?.levels
      ? LEVEL_VALUES.filter((l) => tutorProfile.levels?.includes(l))
      : [];

   const handleSearch = () => {
      setActiveSubject(selectedSubject === "ALL" || selectedSubject === "" ? undefined : selectedSubject);
      setActiveLevel(selectedLevel === "ALL" || selectedLevel === "" ? undefined : selectedLevel);
   };

   const handleClearFilters = () => {
      setSelectedSubject("");
      setSelectedLevel("");
      setActiveSubject(undefined);
      setActiveLevel(undefined);
   };

   if (isLoading) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <div className="text-lg text-muted-foreground">
               Đang tải danh sách flashcards...
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

   const hasActiveFilters = activeSubject || activeLevel;
   const showEmptyState = !quizzes.length && !isLoading && !isError;

   return (
      <div className="mx-auto p-6">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
               Danh sách Flashcards
            </h1>
            <p className="text-muted-foreground">
               Quản lý và xem các bộ flashcard của bạn
            </p>
         </div>

         {/* Search Filters */}
         <div className="mb-6 p-4 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-4 flex-wrap">
               <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tìm kiếm:</span>
               </div>
               <div className="flex-1 min-w-[200px]">
                  <Select
                     value={selectedSubject || undefined}
                     onValueChange={(value) => setSelectedSubject(value === "ALL" ? "" : value)}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Chọn môn học" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="ALL">Tất cả môn học</SelectItem>
                        {availableSubjects.map((subject) => (
                           <SelectItem key={subject} value={subject}>
                              {SUBJECT_LABELS_VI[subject] || subject}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
               <div className="flex-1 min-w-[200px]">
                  <Select 
                     value={selectedLevel || undefined} 
                     onValueChange={(value) => setSelectedLevel(value === "ALL" ? "" : value)}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Chọn cấp độ" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="ALL">Tất cả cấp độ</SelectItem>
                        {availableLevels.map((level) => (
                           <SelectItem key={level} value={level}>
                              {LEVEL_LABELS_VI[level] || level}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
               <Button
                  onClick={handleSearch}
                  className="gap-2"
               >
                  <Search className="h-4 w-4" />
                  Tìm kiếm
               </Button>
               {(activeSubject || activeLevel) && (
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={handleClearFilters}
                     className="gap-2"
                  >
                     <X className="h-4 w-4" />
                     Xóa bộ lọc
                  </Button>
               )}
            </div>
         </div>

         {showEmptyState && hasActiveFilters ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
               <BookOpen className="h-20 w-20 text-muted-foreground mb-6" />
               <div className="text-xl text-muted-foreground mb-2">
                  Không tìm thấy flashcard nào
               </div>
               <div className="text-sm text-muted-foreground mb-4">
                  Không có flashcard nào phù hợp với bộ lọc đã chọn
               </div>
               <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="gap-2"
               >
                  <X className="h-4 w-4" />
                  Xóa bộ lọc
               </Button>
            </div>
         ) : showEmptyState ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
               <BookOpen className="h-20 w-20 text-muted-foreground mb-6" />
               <div className="text-xl text-muted-foreground mb-2">
                  Chưa có flashcard quiz nào
               </div>
               <div className="text-sm text-muted-foreground mb-4">
                  Tạo flashcard đầu tiên của bạn
               </div>
               <Button
                  onClick={() => navigate("/tutor/createFlashcardQuiz")}
                  className="px-6"
               >
                  Tạo Flashcard mới
               </Button>
            </div>
         ) : (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {quizzes.map((q: IQuizInfo) => (
               <Card
                  key={q._id}
                  className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary/50 hover:border-l-primary bg-gradient-to-br from-card to-card/50"
               >
                  <CardHeader className="pb-4">
                     <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                           <CardTitle className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {q.title}
                           </CardTitle>
                           <p className="text-sm text-muted-foreground line-clamp-2">
                              {q.description || "Không có mô tả"}
                           </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                           <Badge
                              variant="default"
                              className="bg-primary/10 text-primary border-primary/20 font-medium"
                           >
                              {String(q.quizType ?? "FLASHCARD")}
                           </Badge>
                           <Badge
                              variant="secondary"
                              className="bg-secondary/50"
                           >
                              {String(q.quizMode ?? "STUDY")}
                           </Badge>
                           {q.subject && (
                              <Badge variant="outline" className="text-xs">
                                 {SUBJECT_LABELS_VI[q.subject] || q.subject}
                              </Badge>
                           )}
                           {q.level && (
                              <Badge variant="outline" className="text-xs">
                                 {LEVEL_LABELS_VI[q.level] || q.level}
                              </Badge>
                           )}
                        </div>
                     </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                     {/* Stats Row */}
                     <div className="flex items-center justify-between bg-secondary/20 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-primary" />
                           <span className="text-sm font-medium">
                              {q.totalQuestions ?? 0} thẻ
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
                           className="flex-1 gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                           onClick={() =>
                              navigate(`/tutor/flashcard?flashcardId=${q._id}`)
                           }
                        >
                           <Eye className="h-4 w-4" />
                           Xem
                        </Button>

                        <Button
                           size="sm"
                           variant="outline"
                           className="flex-1 gap-2 hover:bg-blue-500 hover:text-white transition-colors"
                           onClick={() =>
                              navigate(
                                 `/tutor/editFlashcard?flashcardId=${q._id}`
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
                           disabled={deleteQuiz.isPending}
                           onClick={() => setSelectedQuizForDelete(q._id)}
                        >
                           <Trash2 className="h-4 w-4" />
                           Xóa
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
         )}

         {selectedQuizForDelete && (
            <DeleteFlashcardModal
               type="flashcard"
               quizId={selectedQuizForDelete}
               isOpen={!!selectedQuizForDelete}
               onClose={() => setSelectedQuizForDelete(null)}
               quizTitle={
                  quizzes.find((q) => q._id === selectedQuizForDelete)?.title
               }
            />
         )}
      </div>
   );
};

export default FlashcardQuizList;
