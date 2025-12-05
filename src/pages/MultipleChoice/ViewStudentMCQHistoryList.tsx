import { usefetchHistory } from "@/hooks/useMCQ";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
   BookOpen,
   Calendar,
   Trophy,
   Clock,
   Eye,
   User,
   Search,
   Filter,
   Award,
   Tag,
   GraduationCap,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import {
   getQuestionTypeLabelVi,
   getQuizModeLabelVi,
} from "@/utils/quizTypeDisplay";

interface StudentMCQHistoryItem {
   _id: string;
   quizSnapshot: {
      quizMode: string;
      settings: {
         shuffleQuestions: boolean;
         showCorrectAnswersAfterSubmit: boolean;
         timeLimitMinutes: number;
      };
   };
   quizId: {
      _id: string;
      title: string;
      description: string;
      quizMode: string;
      quizType: string;
      tags: string[];
      totalQuestions: number;
      createdAt: string;
      updatedAt: string;
   };
   studentId: {
      _id: string;
      name: string;
      email: string;
   };
   score: number;
   gradedBy: string;
   gradedAt: string;
   attempt: number;
   submittedAt: string;
}

const ViewStudentMCQHistoryList = () => {
   const navigate = useNavigate();
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedQuizMode, setSelectedQuizMode] = useState("all");
   const { tutorHistory } = usefetchHistory();

   const submissionHistory = (tutorHistory.data?.data ??
      []) as StudentMCQHistoryItem[];

   // Filter and search logic
   const filteredHistory = useMemo(() => {
      return submissionHistory.filter((submission) => {
         const matchesSearch =
            submission.studentId.name
               .toLowerCase()
               .includes(searchTerm.toLowerCase()) ||
            submission.studentId.email
               .toLowerCase()
               .includes(searchTerm.toLowerCase()) ||
            submission.quizId.title
               .toLowerCase()
               .includes(searchTerm.toLowerCase());

         const matchesQuizMode =
            selectedQuizMode === "all" ||
            submission.quizId.quizType === selectedQuizMode;

         return matchesSearch && matchesQuizMode;
      });
   }, [submissionHistory, searchTerm, selectedQuizMode]);

   if (submissionHistory.length === 0) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <BookOpen className="h-20 w-20 text-muted-foreground mb-6" />
            <div className="text-xl text-muted-foreground mb-2">
               Chưa có lịch sử làm bài nào
            </div>
            <div className="text-sm text-muted-foreground">
               Học sinh chưa hoàn thành bài trắc nghiệm nào
            </div>
         </div>
      );
   }

   const formatDate = (dateString: string) => {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
   };

   const getScoreColor = (score: number, totalQuestions: number) => {
      const percentage = (score / totalQuestions) * 100;
      if (percentage >= 80) return "text-green-600 dark:text-green-400";
      if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
   };

   const getScoreBadgeVariant = (score: number, totalQuestions: number) => {
      const percentage = (score / totalQuestions) * 100;
      if (percentage >= 80) return "default";
      if (percentage >= 60) return "secondary";
      return "destructive";
   };

   // Get unique quiz modes for filter
   const uniqueQuizModes = Array.from(
      new Set(submissionHistory.map((s) => s.quizId.quizType))
   );

   if (tutorHistory.isLoading) {
      return (
         <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <div className="text-lg text-muted-foreground">
               Đang tải danh sách lịch sử trắc nghiệm...
            </div>
         </div>
      );
   }

   if (tutorHistory.isError) {
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

   console.log(filteredHistory);

   return (
      <div className="container mx-auto p-6 space-y-6">
         {/* Header */}
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
               Lịch sử làm bài của học sinh
            </h1>
            <p className="text-muted-foreground">
               Quản lý và theo dõi kết quả làm bài trắc nghiệm của tất cả học
               sinh ({submissionHistory.length} bài làm)
            </p>
         </div>

         {/* Filters */}
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Bộ lọc
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Tìm kiếm</label>
                     <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                           placeholder="Tìm theo tên học sinh, email hoặc tên quiz..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                           className="pl-10"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Loại quiz</label>
                     <select
                        value={selectedQuizMode}
                        onChange={(e) => setSelectedQuizMode(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                     >
                        <option value="all">Tất cả</option>
                        {uniqueQuizModes.map((mode) => (
                           <option key={mode} value={mode}>
                              {mode}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Tìm thấy {filteredHistory.length} kết quả</span>
               </div>
            </CardContent>
         </Card>

         {/* Results */}
         {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
               <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
               <p className="text-muted-foreground">
                  Không tìm thấy kết quả phù hợp
               </p>
            </div>
         ) : (
            <div className="grid gap-6">
               {filteredHistory.map((submission) => (
                  <Card
                     key={submission._id}
                     className="border-l-4 border-l-blue-500"
                  >
                     <CardHeader>
                        <div className="flex items-start justify-between">
                           <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                 <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    {submission.quizId.title}
                                 </CardTitle>
                                 <Badge variant="outline" className="text-xs">
                                    Lần {submission.attempt}
                                 </Badge>
                              </div>

                              <div className="flex items-center gap-4 mb-2">
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">
                                       {submission.studentId.name}
                                    </span>
                                    <span>({submission.studentId.email})</span>
                                 </div>
                              </div>

                              <p className="text-sm text-muted-foreground">
                                 {submission.quizId.description}
                              </p>
                           </div>

                           <Badge
                              variant={getScoreBadgeVariant(
                                 submission.score,
                                 submission.quizId.totalQuestions
                              )}
                              className="text-lg px-3 py-1 ml-4"
                           >
                              <Trophy className="h-4 w-4 mr-1" />
                              {submission.score}/
                              {submission.quizId.totalQuestions}
                           </Badge>
                        </div>
                     </CardHeader>

                     <CardContent className="space-y-4">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <Award className="h-4 w-4 text-blue-600" />
                                 <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    Điểm số
                                 </span>
                              </div>
                              <div
                                 className={`text-xl font-bold ${getScoreColor(
                                    submission.score,
                                    submission.quizId.totalQuestions
                                 )}`}
                              >
                                 {Math.round(
                                    (submission.score /
                                       submission.quizId.totalQuestions) *
                                       100
                                 )}
                                 %
                              </div>
                           </div>

                           <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <BookOpen className="h-4 w-4 text-green-600" />
                                 <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                    Tổng câu
                                 </span>
                              </div>
                              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                 {submission.quizId.totalQuestions}
                              </div>
                           </div>

                           <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <GraduationCap className="h-4 w-4 text-purple-600" />
                                 <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                                    Lần làm
                                 </span>
                              </div>
                              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                 {submission.attempt}
                              </div>
                           </div>

                           <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                 <Clock className="h-4 w-4 text-orange-600" />
                                 <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                    Thời gian
                                 </span>
                              </div>
                              <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                                 {
                                    submission.quizSnapshot.settings
                                       .timeLimitMinutes
                                 }{" "}
                                 phút
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
                              {getQuizModeLabelVi(submission.quizId.quizMode)}
                           </Badge>
                           <Badge variant="outline">
                              {getQuestionTypeLabelVi(
                                 submission.quizId.quizType
                              )}
                           </Badge>
                        </div>

                        {/* Tags */}
                        {submission.quizId.tags &&
                           submission.quizId.tags.length > 0 && (
                              <div className="flex items-center gap-2">
                                 <Tag className="h-3 w-3 text-muted-foreground" />
                                 <div className="flex flex-wrap gap-1">
                                    {submission.quizId.tags
                                       .slice(0, 5)
                                       .map((tag, index) => (
                                          <Badge
                                             key={index}
                                             variant="secondary"
                                             className="text-xs"
                                          >
                                             {tag}
                                          </Badge>
                                       ))}
                                    {submission.quizId.tags.length > 5 && (
                                       <Badge
                                          variant="outline"
                                          className="text-xs"
                                       >
                                          +{submission.quizId.tags.length - 5}{" "}
                                          khác
                                       </Badge>
                                    )}
                                 </div>
                              </div>
                           )}

                        {/* Quiz Settings */}
                        <div className="bg-muted/50 p-3 rounded-lg">
                           <h4 className="font-medium mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
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
                              <Badge variant="outline">
                                 <Clock className="h-3 w-3 mr-1" />
                                 Giới hạn:{" "}
                                 {
                                    submission.quizSnapshot.settings
                                       .timeLimitMinutes
                                 }{" "}
                                 phút
                              </Badge>
                           </div>
                        </div>

                        {/* Action Buttons */}
                        <Separator />
                        <div className="flex items-center justify-between">
                           <div className="text-sm text-muted-foreground">
                              Học sinh:{" "}
                              <span className="font-medium">
                                 {submission.studentId.name}
                              </span>
                           </div>
                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {
                                    if (
                                       submission.quizId.quizType ===
                                       "MULTIPLE_CHOICE"
                                    )
                                       navigate(
                                          `/tutor/MCQHistory?quizId=${submission._id}`
                                       );
                                    else
                                       navigate(
                                          `/tutor/SAQHistory?quizId=${submission._id}`
                                       );
                                 }}
                              >
                                 <Eye className="h-4 w-4 mr-2" />
                                 Xem chi tiết
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}
      </div>
   );
};

export default ViewStudentMCQHistoryList;
