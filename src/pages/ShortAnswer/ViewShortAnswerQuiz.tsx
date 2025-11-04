import { useShortAnswerQuiz } from "@/hooks/useSAQ";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Clock, Tag, Info, CheckCircle2 } from "lucide-react";

const ViewShortAnswerQuiz = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const quizId = searchParams.get("shortAnswerId") || "";
    const { fetchById } = useShortAnswerQuiz(quizId);

    const isLoading = fetchById.isLoading;
    const isError = fetchById.isError;
    const data = fetchById.data?.data;

    const quizInfo = data?.quizInfo;
    const quizQuestions = data?.quizQuestions || [];

    if (isLoading) {
        return (
            <div className="container mx-auto py-12 text-center">
                <p className="text-muted-foreground">Đang tải quiz...</p>
            </div>
        );
    }

    if (isError || !quizInfo) {
        return (
            <div className="container mx-auto py-12 text-center">
                <p className="text-red-500">
                    Có lỗi xảy ra khi tải quiz. Vui lòng thử lại sau.
                </p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </Button>
            </div>
        );
    }

    // Calculate total points
    const totalPoints = quizQuestions.reduce(
        (sum: number, q: { points?: number }) => sum + (q.points || 0),
        0
    );

    return (
        <div className="container mx-auto py-6 px-4">
            {/* Navigation */}
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="pl-0"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                </Button>
            </div>

            {/* Quiz Info */}
            <Card className="mb-8">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold mb-2">
                                {quizInfo.title}
                            </CardTitle>
                            <CardDescription>{quizInfo.description}</CardDescription>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Badge
                                variant="outline"
                                className="self-start md:self-end"
                            >
                                {quizInfo.quizMode}
                            </Badge>
                            <Badge className="self-start md:self-end">
                                {quizInfo.quizType}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <Tag className="h-4 w-4 text-muted-foreground mr-1" />
                            {quizInfo.tags?.length > 0 ? (
                                quizInfo.tags.map((tag: any, i: number) => (
                                    <Badge
                                        key={i}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {tag}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    Không có tag
                                </span>
                            )}
                        </div>

                        {/* Settings */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center">
                                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Tổng số câu: {quizInfo.totalQuestions}</span>
                            </div>

                            <div className="flex items-center">
                                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Tổng điểm: {totalPoints}</span>
                            </div>

                            {quizInfo.settings?.shuffleQuestions !== undefined && (
                                <div className="flex items-center">
                                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>
                                        Xáo trộn câu hỏi:{" "}
                                        {quizInfo.settings.shuffleQuestions
                                            ? "Có"
                                            : "Không"}
                                    </span>
                                </div>
                            )}

                            {quizInfo.settings?.showCorrectAnswersAfterSubmit !==
                                undefined && (
                                    <div className="flex items-center">
                                        <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>
                                            Hiện đáp án sau khi nộp:{" "}
                                            {quizInfo.settings.showCorrectAnswersAfterSubmit
                                                ? "Có"
                                                : "Không"}
                                        </span>
                                    </div>
                                )}

                            {quizInfo.settings?.timeLimitMinutes && (
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>
                                        Thời gian: {quizInfo.settings.timeLimitMinutes}{" "}
                                        phút
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                    <div className="flex justify-between w-full">
                        <div>
                            Ngày tạo:{" "}
                            {new Date(quizInfo.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                            Cập nhật:{" "}
                            {new Date(quizInfo.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </CardFooter>
            </Card>

            {/* Questions */}
            <h2 className="text-xl font-bold mb-4">Danh sách câu hỏi</h2>

            <div className="space-y-6 mb-8">
                {quizQuestions.map((question: any, qIndex: number) => (
                    <Card key={question._id} className="bg-card/50">
                        <CardHeader className="pb-2">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <CardTitle className="text-base">
                                    Câu {question.order || qIndex + 1}:{" "}
                                    {question.questionText}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge>{question.points} điểm</Badge>
                                    {question.caseSensitive && (
                                        <Badge variant="outline" className="text-orange-500">
                                            Phân biệt hoa thường
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                            <Separator className="my-4" />

                            {/* Accepted Answers */}
                            <ScrollArea className="max-h-[300px] pr-4">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium mb-2">
                                        Đáp án được chấp nhận:
                                    </h4>
                                    {Array.isArray(question.acceptedAnswers) &&
                                        question.acceptedAnswers.map(
                                            (answer: any, ansIndex: number) => (
                                                <div
                                                    key={ansIndex}
                                                    className="p-3 rounded-md bg-green-300/30 border border-green-500/40 flex items-center gap-3"
                                                >
                                                    <div className="w-5 h-5 rounded-sm flex items-center justify-center border border-green-500 text-green-500 bg-green-500/10">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1 font-medium">
                                                        {answer}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </div>
                            </ScrollArea>

                            {/* Explanation if available */}
                            {question.explanation && (
                                <>
                                    <Separator className="my-4" />
                                    <div className="bg-secondary/20 p-3 rounded-md">
                                        <h4 className="text-sm font-medium mb-1">
                                            Giải thích:
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {question.explanation}
                                        </p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Answers Summary */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Tóm tắt đáp án</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quizQuestions.map((q: any, i: number) => (
                            <div
                                key={q._id}
                                className="flex flex-col border-b pb-2 gap-1"
                            >
                                <div className="text-sm font-medium">
                                    Câu {q.order || i + 1}:
                                </div>
                                <div className="text-sm dark:text-green-500 text-green-600">
                                    {Array.isArray(q.acceptedAnswers)
                                        ? q.acceptedAnswers.length > 0
                                            ? q.acceptedAnswers.join(", ")
                                            : "Chưa có đáp án"
                                        : q.acceptedAnswers || "Chưa có đáp án"}
                                </div>
                                {q.caseSensitive && (
                                    <div className="text-xs text-orange-500">
                                        (Phân biệt hoa thường)
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
                <div className="flex gap-2">
                    <Button
                        onClick={() =>
                            navigate(
                                `/tutor/editShortAnswer?shortAnswerId=${quizId}`
                            )
                        }
                    >
                        Chỉnh sửa
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ViewShortAnswerQuiz;