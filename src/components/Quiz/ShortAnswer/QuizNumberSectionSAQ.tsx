import { IDoSAQQuestions } from "@/store/useDoSAQStore";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Send, Clock, Edit } from "lucide-react";

interface Props {
    questions: IDoSAQQuestions[];
    onSubmit?: () => void;
    isSubmitting?: boolean;
    timeRemaining?: number;
    onQuestionClick?: (questionIndex: number) => void;
}

const QuizNumberSectionSAQ = (props: Props) => {
    const completedCount = props.questions.filter((q) => q.isDone).length;
    const totalCount = props.questions.length;
    const progressPercentage =
        totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleQuestionClick = (questionIndex: number) => {
        if (props.onQuestionClick) {
            props.onQuestionClick(questionIndex);
        }
    };

    const getAnswerLength = (answer: string) => {
        return answer.trim().length;
    };

    return (
        <Card className="w-full h-fit sticky top-20 border-border bg-card">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-foreground">
                    <span>Danh sách câu hỏi</span>
                    <Badge
                        variant="outline"
                        className="text-sm border-border text-muted-foreground"
                    >
                        {completedCount}/{totalCount}
                    </Badge>
                </CardTitle>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Tiến độ hoàn thành</span>
                        <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-muted" />
                </div>

                {/* Timer */}
                {props.timeRemaining !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                            Thời gian còn lại: {formatTime(props.timeRemaining)}
                        </span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Question Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {props.questions.map((question, index) => {
                        const hasAnswer = question.isDone && question.answer.trim().length > 0;
                        const answerLength = getAnswerLength(question.answer);

                        return (
                            <div key={question._id} className="relative">
                                <Button
                                    variant={hasAnswer ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleQuestionClick(index)}
                                    className={cn(
                                        "w-10 h-10 p-0 text-sm font-medium transition-all duration-200 cursor-pointer relative",
                                        hasAnswer
                                            ? "bg-green-500 hover:bg-green-600 text-white border-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                                            : "hover:bg-muted border-border text-foreground"
                                    )}
                                    title={`Câu hỏi ${index + 1}${hasAnswer
                                            ? ` (Đã trả lời, ${answerLength} ký tự)`
                                            : " (Chưa trả lời)"
                                        } - Click để chuyển đến câu hỏi`}
                                >
                                    {index + 1}
                                </Button>

                                {/* Answer length indicator */}
                                {hasAnswer && answerLength > 20 && (
                                    <div className="absolute -top-1 -right-1">
                                        <Badge
                                            variant="secondary"
                                            className="h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-blue-500 text-white"
                                        >
                                            <Edit className="h-2 w-2" />
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <Separator className="bg-border" />

                {/* Legend */}
                <div className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                            <span className="text-muted-foreground">Đã trả lời</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Circle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span className="text-muted-foreground">Chưa trả lời</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span>Câu trả lời dài</span>
                        </div>
                    </div>
                </div>

                <Separator className="bg-border" />

                {/* Submit Section */}
                <div className="space-y-3">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Bạn đã trả lời {completedCount} / {totalCount} câu hỏi
                        </p>

                        {completedCount < totalCount && (
                            <p className="text-xs text-orange-600 dark:text-orange-400">
                                Còn {totalCount - completedCount} câu hỏi chưa trả lời
                            </p>
                        )}

                        {/* Answer length summary */}
                        {completedCount > 0 && (
                            <div className="text-xs text-muted-foreground">
                                Tổng số ký tự đã nhập:{" "}
                                {props.questions
                                    .filter(q => q.isDone)
                                    .reduce((total, q) => total + getAnswerLength(q.answer), 0)}
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={props.onSubmit}
                        disabled={props.isSubmitting || completedCount === 0}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="lg"
                    >
                        {props.isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                                Đang nộp bài...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Nộp bài ({completedCount}/{totalCount})
                            </>
                        )}
                    </Button>

                    {completedCount < totalCount && (
                        <p className="text-xs text-center text-muted-foreground">
                            Bạn có thể nộp bài mà không cần trả lời hết câu hỏi
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizNumberSectionSAQ;