import ShortAnswerQuizQuestionForm, {
    ShortAnswerQuestionsFormHandle,
} from "@/components/Quiz/ShortAnswer/ShortAnswerQuizQuestionForm";
import QuizInfoForm, { QuizInfoHandle } from "@/components/Quiz/QuizInfoForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShortAnswerQuiz } from "@/hooks/useSAQ";
import { useToast } from "@/hooks/useToast";
import { QuestionTypeEnum, QuizModeEnum } from "@/enums/quiz.enum";
import { IQuizBody, ShortAnswerQuestions } from "@/types/quiz";
import { useEffect, useRef, useState } from "react";
import MaterialModal from "../Flashcard/MaterialModal";
import { useAICreateSAQMutation } from "@/hooks/useAICreateFlashcard";
import { BookOpen } from "lucide-react";

const CreateShortAnswerQuiz = () => {
    const quizInfoRef = useRef<QuizInfoHandle | null>(null);
    const shortAnswerRef = useRef<ShortAnswerQuestionsFormHandle | null>(null);
    const addToast = useToast();
    const { create } = useShortAnswerQuiz();

    const [showMaterialModal, setShowMaterialModal] = useState(false);
    const [aiData, setAiData] = useState<any>(null);
    const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState<
        ShortAnswerQuestions[]
    >([]);
    const [formKey, setFormKey] = useState(0);

    const { generateSAQ } = useAICreateSAQMutation();

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

    const handleMaterialSelect = (materialId: string) => {
        generateSAQ.mutate(materialId, {
            onSuccess: (data: any) => {
                console.log("AI Generated SAQ:", data);
                populateFormsWithAIData(data.data);
            },
            onError: (error) => {
                console.error("AI SAQ Generation failed:", error);
                addToast("error", "Không thể tạo SAQ từ AI. Vui lòng thử lại.");
            },
        });
    };

    const populateFormsWithAIData = (aiDataReceived: any) => {
        console.log("aiData received:", aiDataReceived);

        setAiData(aiDataReceived);

        // Declare saqQuestions variable outside setTimeout
        let saqQuestions: ShortAnswerQuestions[] = [];

        if (aiDataReceived?.questionArr) {
            saqQuestions = aiDataReceived.questionArr.map(
                (q: any, index: number): ShortAnswerQuestions => ({
                    _id: `ai-generated-${index}`,
                    order: q.order || index + 1,
                    questionText: q.questionText || q.question || "",
                    acceptedAnswers: Array.isArray(q.acceptedAnswers)
                        ? q.acceptedAnswers
                        : q.acceptedAnswers
                            ? [q.acceptedAnswers]
                            : q.correctAnswer
                                ? [q.correctAnswer]
                                : [],
                    caseSensitive: q.caseSensitive || false,
                    explanation: q.explanation || "",
                    points: q.points || 1,
                    questionType: QuestionTypeEnum.SHORT_ANSWER,
                })
            );

            setAiGeneratedQuestions(saqQuestions);
        }

        setFormKey((prev) => prev + 1);

        setTimeout(() => {
            // Populate quiz info first
            if (quizInfoRef.current) {
                const normalizedSettings = aiDataReceived?.settings
                    ? {
                        shuffleQuestions:
                            !!aiDataReceived.settings.shuffleQuestions,
                        showCorrectAnswersAfterSubmit:
                            !!aiDataReceived.settings.showCorrectAnswersAfterSubmit,
                        timeLimitMinutes:
                            aiDataReceived.settings.timeLimitMinutes ?? null,
                    }
                    : undefined;

                quizInfoRef.current.setValues?.({
                    title:
                        aiDataReceived?.title || "AI Generated Short Answer Quiz",
                    description:
                        aiDataReceived?.description ||
                        "Generated by AI from material",
                    quizMode: aiDataReceived?.quizMode || "EXAM",
                    settings: normalizedSettings,
                    tags: aiDataReceived?.tags || [],
                    totalQuestions: aiDataReceived?.questionArr?.length || 0,
                });
            }

            if (shortAnswerRef.current && saqQuestions.length > 0) {
                shortAnswerRef.current.reset?.([]);

                setTimeout(() => {
                    if (shortAnswerRef.current) {
                        if (shortAnswerRef.current.setQuestions) {
                            shortAnswerRef.current.setQuestions(saqQuestions);
                        } else if (shortAnswerRef.current.addBulk) {
                            shortAnswerRef.current.addBulk(saqQuestions);
                        } else {
                            shortAnswerRef.current.reset?.(saqQuestions);
                        }
                    }
                }, 50);
            }
        }, 100);
    };

    const handleClearAIData = () => {
        setAiData(null);
        setAiGeneratedQuestions([]);
        setFormKey((prev) => prev + 1);
    };

    if (generateSAQ.isPending) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <div className="text-lg text-muted-foreground">
                    AI đang tạo câu hỏi tự luận từ tài liệu...
                </div>
            </div>
        );
    }

    if (generateSAQ.isError) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
                <BookOpen className="h-16 w-16 text-red-400 mb-4" />
                <div className="text-lg text-red-400 mb-2">
                    AI không thể tạo câu hỏi tự luận
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                    Vui lòng thử lại sau
                </div>
                <Button onClick={() => window.location.reload()}>
                    Tải lại trang
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto my-6 p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Tạo Short Answer Quiz</CardTitle>
                    <div className="flex gap-2">
                        <Button onClick={() => setShowMaterialModal(true)}>
                            Tạo SAQ bằng AI
                        </Button>
                        {aiData && (
                            <Button variant="outline" onClick={handleClearAIData}>
                                Xóa dữ liệu AI
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {aiData && (
                        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                🤖 Dữ liệu từ AI
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                                Đã tạo {aiGeneratedQuestions.length} câu hỏi tự luận từ tài liệu
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                Bạn có thể chỉnh sửa thông tin bên dưới trước khi lưu
                            </p>
                        </div>
                    )}

                    <div key={`quiz-info-${formKey}`}>
                        <QuizInfoForm ref={quizInfoRef} isFlashcard={false} />
                    </div>

                    <div key={`saq-questions-${formKey}`}>
                        <ShortAnswerQuizQuestionForm ref={shortAnswerRef} />
                    </div>

                    <div className="flex justify-end mt-2">
                        <Button onClick={handleSubmit} disabled={create.isPending}>
                            {create.isPending ? "Đang xử lý..." : "Lưu / Submit"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <MaterialModal
                isOpen={showMaterialModal}
                onClose={() => setShowMaterialModal(false)}
                onSelectMaterial={handleMaterialSelect}
                type="saq"
            />
        </div>
    );
};

export default CreateShortAnswerQuiz;