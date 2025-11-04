import ShortAnswerQuizQuestionForm, {
    ShortAnswerQuestionsFormHandle,
} from "@/components/Quiz/ShortAnswer/ShortAnswerQuizQuestionForm";
import QuizInfoForm, { QuizInfoHandle } from "@/components/Quiz/QuizInfoForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShortAnswerQuiz } from "@/hooks/useSAQ";
import { useToast } from "@/hooks/useToast";
import { QuestionTypeEnum, QuizModeEnum } from "@/enums/quiz.enum";
import { IQuizBody } from "@/types/quiz";
import { useEffect, useRef } from "react";

const CreateShortAnswerQuiz = () => {
    const quizInfoRef = useRef<QuizInfoHandle | null>(null);
    const shortAnswerRef = useRef<ShortAnswerQuestionsFormHandle | null>(null);
    const addToast = useToast();
    const { create } = useShortAnswerQuiz();

    useEffect(() => {
        shortAnswerRef.current?.reset?.();
        quizInfoRef.current?.reset?.();
    }, []);

    const handleSubmit = async () => {
        if (!quizInfoRef.current || !shortAnswerRef.current) return;
        const newQuestions = shortAnswerRef.current.getNew();
        const infoValid = await quizInfoRef.current.validate?.();
        const shortAnswerValid = await shortAnswerRef.current.validate?.();

        if (infoValid === false || shortAnswerValid?.valid === false) {
            addToast("error", "Vui lòng kiểm tra thông tin quiz và các câu hỏi");
            return;
        }

        const infoValues = quizInfoRef.current.getValues();

        // Process questions
        const mappedQuestions = newQuestions.map((q) => ({
            questionType: QuestionTypeEnum.SHORT_ANSWER,
            quizMode: QuizModeEnum.EXAM,
            questionText: q.questionText,
            acceptedAnswers: (q.acceptedAnswers || []).map((ans: string) => ans.trim()).filter(ans => ans),
            caseSensitive: q.caseSensitive || false,
            explanation: q.explanation || "",
            points: q.points || 0,
            order: q.order || 0,
        }));

        const payload = {
            ...infoValues,
            questionArr: mappedQuestions,
            totalQuestions: mappedQuestions.length,
            quizType: QuestionTypeEnum.SHORT_ANSWER,
        } as IQuizBody;

        console.log("Full payload:", payload);
        create.mutate(payload);
    };

    return (
        <div className="mx-auto my-6 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Tạo Short Answer Quiz</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div>
                        <QuizInfoForm ref={quizInfoRef} isFlashcard={false} />
                    </div>

                    <div>
                        <ShortAnswerQuizQuestionForm ref={shortAnswerRef} />
                    </div>

                    <div className="flex justify-end mt-2">
                        <Button onClick={handleSubmit} disabled={create.isPending}>
                            {create.isPending ? "Đang xử lý..." : "Lưu / Submit"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateShortAnswerQuiz;