import { useDoSAQ } from "@/hooks/useDoSAQ";
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
    Edit3,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const ViewSAQHistoryList = () => {
    const { fetchSAQHistory } = useDoSAQ();
    const navigate = useNavigate();

    if (fetchSAQHistory.isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <div className="text-lg text-muted-foreground">
                    Đang tải danh sách lịch sử tự luận...
                </div>
            </div>
        );
    }

    if (fetchSAQHistory.isError) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <BookOpen className="h-16 w-16 text-red-400 mb-4" />
                <div className="text-lg text-red-400 mb-2">
                    Không tải được lịch sử bài tự luận
                </div>
                <div className="text-sm text-muted-foreground">
                    Vui lòng thử lại sau
                </div>
            </div>
        );
    }

    const submissionHistory = (fetchSAQHistory.data?.data ?? []) as any[];

    if (submissionHistory.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <Edit3 className="h-20 w-20 text-muted-foreground mb-6" />
                <div className="text-xl text-muted-foreground mb-2">
                    Chưa có lịch sử làm bài tự luận nào
                </div>
                <div className="text-sm text-muted-foreground">
                    Hãy làm bài tự luận đầu tiên của bạn
                </div>
            </div>
        );
    }

    const formatDate = (dateString: Date) => {
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

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Lịch sử làm bài tự luận
                </h1>
                <p className="text-muted-foreground">
                    Danh sách các bài tự luận bạn đã hoàn thành
                </p>
            </div>

            {/* Quiz History List */}
            <div className="grid gap-6">
                {submissionHistory.map((submission: any) => {
                    const correctAnswers = submission.answers.filter(
                        (answer: any) => answer.isCorrect
                    ).length;
                    const totalQuestions = submission.answers.length;
                    const accuracy = Math.round(
                        (correctAnswers / totalQuestions) * 100
                    );
                    const totalPossiblePoints = submission.answers.reduce(
                        (sum: number, answer: any) => sum + (answer.questionId?.points || 0),
                        0
                    );

                    return (
                        <Card
                            key={submission._id}
                            className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Edit3 className="h-5 w-5 text-orange-500" />
                                        <div className="flex flex-col">
                                            <span>{submission.quizId?.title || "Bài tự luận"}</span>
                                            <span className="text-sm font-normal text-muted-foreground">
                                                {submission.quizId?.description || "Bài tập tự luận ngắn"}
                                            </span>
                                        </div>
                                    </CardTitle>
                                    <Badge
                                        variant={getScoreBadgeVariant(submission.score, totalPossiblePoints)}
                                        className="text-lg px-3 py-1"
                                    >
                                        <Trophy className="h-4 w-4 mr-1" />
                                        {submission.score}/{totalPossiblePoints}
                                    </Badge>
                                </div>
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
                                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
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
                                        <div className="text-xl font-bold text-red-600 dark:text-red-400">
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
                                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
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
                                        <div className={`text-xl font-bold ${getScoreColor(accuracy, 100)}`}>
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
                                    {submission.quizId?.quizMode && (
                                        <Badge variant="outline">
                                            {submission.quizId.quizMode}
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                        TỰ LUẬN
                                    </Badge>
                                </div>

                                {/* Quiz Settings */}
                                {submission.quizSnapshot?.settings && (
                                    <div className="bg-muted/50 p-3 rounded-lg">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" />
                                            Cài đặt bài kiểm tra:
                                        </h4>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {submission.quizSnapshot.settings.shuffleQuestions !== undefined && (
                                                <Badge variant="outline">
                                                    {submission.quizSnapshot.settings.shuffleQuestions
                                                        ? "Xáo trộn câu hỏi"
                                                        : "Không xáo trộn"}
                                                </Badge>
                                            )}
                                            {submission.quizSnapshot.settings.showCorrectAnswersAfterSubmit !== undefined && (
                                                <Badge variant="outline">
                                                    {submission.quizSnapshot.settings.showCorrectAnswersAfterSubmit
                                                        ? "Hiện đáp án sau nộp bài"
                                                        : "Không hiện đáp án"}
                                                </Badge>
                                            )}
                                            {submission.quizSnapshot.settings.timeLimitMinutes && (
                                                <Badge variant="outline">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Giới hạn: {submission.quizSnapshot.settings.timeLimitMinutes} phút
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Lần thứ {submission.attempt} làm bài
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                navigate(`/student/doneSAQ?quizId=${submission._id}`);
                                            }}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Xem chi tiết
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                if (submission.quizId?._id) {
                                                    navigate(`/student/doSAQ?shortAnswerId=${submission.quizId._id}`);
                                                }
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

export default ViewSAQHistoryList;