import { useEffect, useRef, useState } from "react";
import { useShortAnswerQuiz } from "@/hooks/useSAQ";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { useShortAnswerQuizStore } from "@/store/useShortAnswerQuizStore";
import { ShortAnswerQuestions, updateIShortAnswerBody, IQUizUpdate } from "@/types/quiz";
import QuizInfoForm, { QuizInfoHandle } from "@/components/Quiz/QuizInfoForm";
import { ArrowLeft } from "lucide-react";
import { QuestionTypeEnum } from "@/enums/quiz.enum";
import ShortAnswerQuizQuestionForm, {
    ShortAnswerQuestionsFormHandle,
} from "@/components/Quiz/ShortAnswer/ShortAnswerQuizQuestionForm";

const EditShortAnswerQuiz = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const quizId = searchParams.get("shortAnswerId") || "";

    const { fetchById, update } = useShortAnswerQuiz(quizId);
    const resetQuestionsInStore = useShortAnswerQuizStore(
        (s) => s.resetShortAnswerQuizQuestion
    );
    const addQuestion = useShortAnswerQuizStore((s) => s.addQuestion);

    // Refs to access form methods
    const quizInfoRef = useRef<QuizInfoHandle | null>(null);
    const shortAnswerRef = useRef<ShortAnswerQuestionsFormHandle | null>(null);
    const addToast = useToast();

    // Keep track of original questions to determine what was edited/deleted/added
    const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);

    const isLoading = fetchById.isLoading;
    const isError = fetchById.isError;
    const data = fetchById.data?.data;

    const quizInfo = data?.quizInfo;
    const quizQuestions = data?.quizQuestions || [];

    // Initialize store with questions from API when data loads
    useEffect(() => {
        if (quizQuestions && quizQuestions.length > 0) {
            resetQuestionsInStore(); // Clear existing questions in store

            // Store original questions for comparison later
            setOriginalQuestions(JSON.parse(JSON.stringify(quizQuestions)));

            quizQuestions.forEach((q: any) => {
                addQuestion({
                    _id: q._id,
                    order: q.order,
                    questionType: QuestionTypeEnum.SHORT_ANSWER,
                    questionText: q.questionText,
                    acceptedAnswers: q.acceptedAnswers,
                    caseSensitive: q.caseSensitive || false,
                    explanation: q.explanation || "",
                    points: q.points || 0,
                });
            });
        }
    }, [quizQuestions, resetQuestionsInStore, addQuestion]);

    // Set initial form values when quiz info loads
    useEffect(() => {
        if (quizInfo && quizInfoRef.current?.setValues) {
            quizInfoRef.current.setValues({
                title: quizInfo.title,
                description: quizInfo.description,
                quizMode: quizInfo.quizMode,
                tags: quizInfo.tags || [],
                settings: {
                    shuffleQuestions: quizInfo.settings?.shuffleQuestions || false,
                    showCorrectAnswersAfterSubmit:
                        quizInfo.settings?.showCorrectAnswersAfterSubmit || true,
                    timeLimitMinutes: quizInfo.settings?.timeLimitMinutes || null,
                },
                totalQuestions: quizInfo.totalQuestions,
            });
        }
    }, [quizInfo]);

    // Reset questions form when data changes
    useEffect(() => {
        if (quizQuestions && quizQuestions.length > 0 && shortAnswerRef.current?.reset) {
            const shortAnswerQuestions = quizQuestions.map((q: any) => ({
                _id: q._id,
                order: q.order,
                questionType: QuestionTypeEnum.SHORT_ANSWER,
                questionText: q.questionText,
                acceptedAnswers: q.acceptedAnswers,
                caseSensitive: q.caseSensitive || false,
                explanation: q.explanation || "",
                points: q.points || 0,
            }));
            shortAnswerRef.current.reset(shortAnswerQuestions as any);
        }
    }, [quizQuestions]);

    const handleSubmit = async () => {
        if (!quizInfoRef.current || !shortAnswerRef.current) return;
        const newQuestions = shortAnswerRef.current.getNew();
        const editedQuestions = shortAnswerRef.current.getEdited();
        const deletedQuestions = shortAnswerRef.current.getDeleted();

        const infoValid = await quizInfoRef.current.validate?.();
        const shortAnswerValid = await shortAnswerRef.current.validate?.();

        if (infoValid === false || shortAnswerValid?.valid === false) {
            addToast("error", "Vui lòng kiểm tra thông tin quiz và các câu hỏi");
            return;
        }

        // Get form values
        const infoValues = quizInfoRef.current.getValues();

        // Create payload
        const payload: updateIShortAnswerBody = {
            _id: quizId,
            title: infoValues.title,
            description: infoValues.description || "",
            quizMode: infoValues.quizMode as any,
            quizType: QuestionTypeEnum.SHORT_ANSWER,
            settings: infoValues.settings,
            tags: infoValues.tags || [],
            newShortAnswerQuizQuestionsArr: newQuestions.map((q: any) => ({
                ...q,
                _id: q._id ?? "",
            })),
            editShortAnswerQuizQuestionsArr: editedQuestions.map((q: any) => ({
                ...q,
                order: q.order ?? 0,
            })),
            deleteShortAnswerQuizQuestionsArr: deletedQuestions.map(
                (q: any) => ({
                    ...q,
                    _id: q._id ?? "",
                })
            ),
            createdBy: quizInfo?.createdBy || { role: "", name: "" },
            totalQuestions:
                (originalQuestions?.length || 0) -
                (deletedQuestions?.length || 0) +
                (newQuestions?.length || 0),
        };

        update.mutate(payload as unknown as IQUizUpdate);
    };

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

    return (
        <div className="container mx-auto my-6 p-4">
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

            <Card>
                <CardHeader>
                    <CardTitle>Chỉnh sửa Short Answer Quiz</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div>
                        <QuizInfoForm ref={quizInfoRef} isFlashcard={false} />
                    </div>

                    <div>
                        <ShortAnswerQuizQuestionForm ref={shortAnswerRef} />
                    </div>

                    <div className="flex justify-between mt-2">
                        {update.isSuccess ? (
                            <Button variant="outline" onClick={() => navigate(-1)}>
                                Quay lại
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() =>
                                    shortAnswerRef.current?.reset?.(
                                        quizQuestions as ShortAnswerQuestions[]
                                    )
                                }
                            >
                                Hủy
                            </Button>
                        )}
                        <Button
                            onClick={handleSubmit}
                            disabled={update.isPending || update.isSuccess}
                        >
                            {update.isPending ? "Đang xử lý..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditShortAnswerQuiz;