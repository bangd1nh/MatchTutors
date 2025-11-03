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
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const DoMCQ = () => {
   const navigate = useNavigate();
   const searchParams = new URLSearchParams(window.location.search);
   const quizId = searchParams.get("multipleChoiceId") || "";
   const { fetchMCQByQuizId, submitMCQ } = useMCQ(quizId);
   const quizessSectionRef = useRef<QuizessSectionRef>(null);

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
   } = useDoMCQStore();

   useEffect(() => {
      if (quizInfoData) {
         initQuizInfo(quizId, quizInfoData);
         initQuizQuestions(quizQuestionsData);
      }
   }, [quizId, fetchMCQByQuizId.data]);

   const handleSubmit = () => {
      const payload = getSubmitQuiz();
      submitMCQ.mutate(payload);
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
   return (
      <div>
         <QuizInfo quizInfo={quizInfo} />
         <div className="grid grid-cols-3 gap-10 mt-10">
            <QuizNumberSection
               questions={questions}
               onSubmit={handleSubmit}
               isSubmitting={submitMCQ.isPending}
               onQuestionClick={handleQuestionClick}
            />
            <div className="col-span-2">
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
