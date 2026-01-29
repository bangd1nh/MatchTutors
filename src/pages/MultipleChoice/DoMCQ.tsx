import QuizessSection, {
   QuizessSectionRef,
} from "@/components/Quiz/MultipleChoice/QuizessSection";
import QuizNumberSection from "@/components/Quiz/MultipleChoice/QuizNumberSection";
import QuizInfo from "@/components/Quiz/QuizInfo";
import { Button } from "@/components/ui/button";
import { useMCQ } from "@/hooks/useMCQ";
import { useDoMCQStore } from "@/store/useDoMCQStore";
import { IQuizInfo } from "@/types/quiz";
import { IQuizQuestion } from "@/types/quizQuestion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QuizTimer from "./QuizTimer";

const DoMCQ = () => {
   const navigate = useNavigate();
   const searchParams = new URLSearchParams(window.location.search);
   const quizId = searchParams.get("multipleChoiceId") || "";
   const { fetchMCQByQuizId, submitMCQ } = useMCQ(quizId);
   const quizessSectionRef = useRef<QuizessSectionRef>(null);

   const [isTimeOver, setIsTimeOver] = useState(false);
   const timeUpCalledRef = useRef(false);
   const initializedRef = useRef<string | null>(null);

   const isLoading = fetchMCQByQuizId.isLoading;
   const isError = fetchMCQByQuizId.isError;
   const quizInfoData =
      fetchMCQByQuizId.data?.data.quizInfo || ({} as IQuizInfo);
   const quizQuestionsData =
      fetchMCQByQuizId.data?.data.quizQuestions || ([] as IQuizQuestion[]);
   const {
      initQuizInfo,
      quizInfo,
      initQuizQuestions,
      questions,
      getSubmitQuiz,
      reset,
   } = useDoMCQStore();

   // Chỉ khởi tạo store một lần cho mỗi quizId khi data đã sẵn sàng
   useEffect(() => {
      if (!fetchMCQByQuizId.isSuccess) return;
      // Nếu cùng một quizId đã được init rồi thì bỏ qua
      if (initializedRef.current === quizId) return;

      initializedRef.current = quizId;

      // Reset store và trạng thái time
      reset();
      setIsTimeOver(false);
      timeUpCalledRef.current = false;

      // Khởi tạo dữ liệu
      initQuizInfo(quizId, quizInfoData);
      initQuizQuestions(quizQuestionsData);
   }, [
      quizId,
      fetchMCQByQuizId.isSuccess,
      initQuizInfo,
      initQuizQuestions,
      reset,
      quizInfoData,
      quizQuestionsData,
   ]);

   const handleSubmit = useCallback(() => {
      // KHÓA submit nếu đang submit hoặc đã hết giờ
      if (submitMCQ.isPending || isTimeOver) return;
      timeUpCalledRef.current = true;
      setIsTimeOver(true);
      const payload = getSubmitQuiz();
      submitMCQ.mutate(payload);
   }, [submitMCQ.isPending, isTimeOver, getSubmitQuiz, submitMCQ]);

   const handleTimeUp = useCallback(() => {
      // Chỉ gọi nộp bài 1 lần khi hết giờ
      if (timeUpCalledRef.current) return;
      timeUpCalledRef.current = true;
      setIsTimeOver(true);
      handleSubmit();
   }, [handleSubmit]);

   const handleQuestionClick = (questionIndex: number) => {
      // Khi hết giờ, không cho thao tác chuyển câu
      if (isTimeOver) return;
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

   return (
      <div>
         <QuizInfo quizInfo={quizInfo} />
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
            <div className="lg:col-span-1">
               <QuizTimer
                  timeLimitMinutes={quizInfo.settings?.timeLimitMinutes || 0}
                  onTimeUp={handleTimeUp}
                  // Dừng timer và cũng là tín hiệu hết giờ
                  isSubmitting={submitMCQ.isPending || isTimeOver}
               />
               <QuizNumberSection
                  questions={questions}
                  onSubmit={handleSubmit}
                  // Khóa nút nộp bài khi đang submit hoặc đã hết giờ
                  isSubmitting={submitMCQ.isPending || isTimeOver}
                  onQuestionClick={handleQuestionClick}
               />
            </div>
            <div className="lg:col-span-2">
               <QuizessSection
                  ref={quizessSectionRef}
                  questions={questions}
                  settings={quizInfo.settings}
               />
            </div>
         </div>
      </div>
   );
};

export default DoMCQ;
