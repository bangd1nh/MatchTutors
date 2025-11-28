import QuizessSectionSAQ, {
    QuizessSectionSAQRef,
} from "@/components/Quiz/ShortAnswer/QuizessSectionSAQ";
import QuizNumberSectionSAQ from "@/components/Quiz/ShortAnswer/QuizNumberSectionSAQ";
import QuizInfo from "@/components/Quiz/QuizInfo";
import { Button } from "@/components/ui/button";
import { useDoSAQ } from "@/hooks/useDoSAQ";
import { useDoSAQStore } from "@/store/useDoSAQStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoSAQ = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const quizId = searchParams.get("shortAnswerId") || "";

    const { fetchSAQForAttempt, submitSAQ } = useDoSAQ(quizId);
    const quizessSectionRef = useRef<QuizessSectionSAQRef>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const isLoading = fetchSAQForAttempt.isLoading;
    const isError = fetchSAQForAttempt.isError;

    const {
        initQuizInfo,
        quizInfo,
        initQuizQuestions,
        questions,
        getSubmitQuiz,
        reset,
    } = useDoSAQStore();

    // Initialize quiz data when it's loaded
    useEffect(() => {
        if (fetchSAQForAttempt.data?.data && !isInitialized) {
            const quizData = fetchSAQForAttempt.data.data;
            reset();
            initQuizInfo(quizId, quizData.quizInfo);
            initQuizQuestions(quizData.quizQuestions);
            setIsInitialized(true);
        }
    }, [fetchSAQForAttempt.data, quizId, isInitialized, reset, initQuizInfo, initQuizQuestions]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    const handleSubmit = () => {
        const payload = getSubmitQuiz();
        submitSAQ.mutate(payload);
    };

    const handleQuestionClick = (questionIndex: number) => {
        if (quizessSectionRef.current) {
            quizessSectionRef.current.scrollToQuestion(questionIndex);
        }
    };


    if (isLoading) {
        return (
            <div className="container mx-auto py-12 text-center">
                <p className="text-muted-foreground">Đang tải quiz...</p>
            </div>
        );
    }

    if (isError) {
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

    // Check if quiz is properly initialized
    if (!isInitialized || !quizInfo?._id || questions.length === 0) {
        return (
            <div className="container mx-auto py-12 text-center">
                <p className="text-muted-foreground">Đang khởi tạo quiz...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <QuizInfo quizInfo={quizInfo} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <QuizNumberSectionSAQ
                        questions={questions}
                        onSubmit={handleSubmit}
                        isSubmitting={submitSAQ.isPending}
                        onQuestionClick={handleQuestionClick}
                    />
                </div>

                <div className="lg:col-span-3">
                    <QuizessSectionSAQ
                        ref={quizessSectionRef}
                        questions={questions}
                        settings={quizInfo.settings}
                    />
                </div>
            </div>
        </div>
    );
};

export default DoSAQ;