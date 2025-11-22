import { IDoSAQQuestions, useDoSAQStore } from "@/store/useDoSAQStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef, useRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    questions: IDoSAQQuestions[];
    settings: any;
};

export interface QuizessSectionSAQRef {
    scrollToQuestion: (questionIndex: number) => void;
}

const QuizessSectionSAQ = forwardRef<QuizessSectionSAQRef, Props>((props, ref) => {
    const { updateAnswer, clearAnswer, submited } = useDoSAQStore();
    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [expandedHints, setExpandedHints] = useState<Set<string>>(new Set());

    const showCorrectAnswers =
        props.settings?.showCorrectAnswersAfterSubmit && submited;

    const scrollToQuestion = (questionIndex: number) => {
        const questionElement = questionRefs.current[questionIndex];
        if (questionElement) {
            const elementPosition = questionElement.offsetTop;
            const offsetPosition = elementPosition - 80;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    const toggleHint = (questionId: string) => {
        setExpandedHints(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    useImperativeHandle(ref, () => ({
        scrollToQuestion,
    }));

    return (
        <div className="space-y-6">
            {props.questions.map((question, questionIndex) => (
                <Card
                    key={question._id}
                    className="w-full border-border bg-card"
                    ref={(el) => {
                        questionRefs.current[questionIndex] = el;
                    }}
                >
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg text-foreground">
                                Câu {questionIndex + 1}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="text-muted-foreground border-border"
                                >
                                    {question.points} điểm
                                </Badge>
                                {question.caseSensitive && (
                                    <Badge
                                        variant="secondary"
                                        className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    >
                                        Phân biệt hoa thường
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <p className="text-base font-medium leading-relaxed text-foreground">
                            {question.questionText}
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Answer Input */}
                        <div className="space-y-3">
                            <Label htmlFor={`answer-${question._id}`} className="text-sm font-medium">
                                Câu trả lời của bạn:
                            </Label>
                            <Textarea
                                id={`answer-${question._id}`}
                                value={question.answer}
                                onChange={(e) => updateAnswer(question._id!, e.target.value)}
                                disabled={submited}
                                placeholder="Nhập câu trả lời của bạn..."
                                className={cn(
                                    "min-h-[100px] resize-y",
                                    showCorrectAnswers &&
                                    (question.answer && question.acceptedAnswers?.includes(question.answer)
                                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                        : question.answer
                                            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                            : "")
                                )}
                            />

                            {!submited && question.answer && (
                                <div className="flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => clearAnswer(question._id!)}
                                        className="text-xs"
                                    >
                                        Xóa câu trả lời
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Feedback After Submit */}
                        {showCorrectAnswers && (
                            <>
                                <Separator className="bg-border" />

                                {/* User's answer feedback */}
                                <div className={cn(
                                    "p-4 rounded-lg border",
                                    question.answer && question.acceptedAnswers?.includes(question.answer)
                                        ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                                        : question.answer
                                            ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                                            : "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
                                )}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {question.answer ? (
                                            question.acceptedAnswers?.includes(question.answer) ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                            )
                                        ) : (
                                            <XCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                        )}
                                        <h4 className="font-medium">
                                            {question.answer ? (
                                                question.acceptedAnswers?.includes(question.answer)
                                                    ? "Câu trả lời đúng!"
                                                    : "Câu trả lời chưa chính xác"
                                            ) : (
                                                "Bạn chưa trả lời câu hỏi này"
                                            )}
                                        </h4>
                                    </div>

                                    {question.answer && (
                                        <div className="text-sm">
                                            <span className="font-medium">Câu trả lời của bạn:</span>
                                            <span className={cn(
                                                "ml-2 px-2 py-1 rounded border",
                                                question.acceptedAnswers?.includes(question.answer)
                                                    ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                                                    : "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700"
                                            )}>
                                                {question.answer}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Accepted answers — NOW GREEN */}
                                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        Các đáp án được chấp nhận:
                                    </h4>
                                    <div className="space-y-1">
                                        {question.acceptedAnswers?.map((answer, index) => (
                                            <div
                                                key={index}
                                                className="text-sm text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900/50 px-3 py-2 rounded border border-green-200 dark:border-green-700"
                                            >
                                                {answer}
                                            </div>
                                        ))}
                                    </div>
                                    {question.caseSensitive && (
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                            ⚠️ Câu hỏi này phân biệt chữ hoa/chữ thường
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Hint Toggle */}
                        {!submited && question.acceptedAnswers && question.acceptedAnswers.length > 1 && (
                            <div className="border rounded-lg">
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleHint(question._id!)}
                                    className="w-full justify-between text-sm"
                                >
                                    <span className="flex items-center gap-2">
                                        <HelpCircle className="h-4 w-4" />
                                        Gợi ý: Có {question.acceptedAnswers.length} đáp án được chấp nhận
                                    </span>
                                    <span>{expandedHints.has(question._id!) ? "↑" : "↓"}</span>
                                </Button>

                                {expandedHints.has(question._id!) && (
                                    <div className="p-4 bg-muted/50 border-t">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Câu hỏi này có nhiều đáp án được chấp nhận. Hãy đảm bảo câu trả lời của bạn chính xác về nội dung.
                                        </p>
                                        {question.caseSensitive && (
                                            <p className="text-xs text-orange-600 dark:text-orange-400">
                                                ⚠️ Lưu ý: Phân biệt chữ hoa/chữ thường
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Explanation — NOW BLUE */}
                        {question.explanation && showCorrectAnswers && (
                            <>
                                <Separator className="bg-border" />
                                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                        Giải thích:
                                    </h4>
                                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                                        {question.explanation}
                                    </p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
});

QuizessSectionSAQ.displayName = "QuizessSectionSAQ";

export default QuizessSectionSAQ;
