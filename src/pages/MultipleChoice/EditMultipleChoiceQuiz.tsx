import { useEffect, useRef, useState } from "react";
import { useMCQ } from "@/hooks/useMCQ";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { useMultipleChoiceQuizStore } from "@/store/useMultipleChoiceQuizStore";
import { updateIMCQBody } from "@/types/quiz";
import QuizInfoForm, { QuizInfoHandle } from "@/components/Quiz/QuizInfoForm";
import { ArrowLeft } from "lucide-react";
import { QuestionTypeEnum } from "@/enums/quiz.enum";
import MultipleChoiceQuizQuestionForm, {
   MultipleChoiceQuestionsFormHandle,
} from "@/components/Quiz/MultipleChoice/MultiplechoiceQuizQuestionForm";

const EditMultipleChoiceQuiz = () => {
   const navigate = useNavigate();
   const searchParams = new URLSearchParams(window.location.search);
   const quizId = searchParams.get("multipleChoiceId") || "";

   const { fetchMCQByQuizId, updateMCQ } = useMCQ(quizId);
   const resetQuestionsInStore = useMultipleChoiceQuizStore(
      (s) => s.resetMultipleChoiceQuizQuestion
   );
   const addQuestion = useMultipleChoiceQuizStore((s) => s.addQuestion);

   // Refs to access form methods
   const quizInfoRef = useRef<QuizInfoHandle | null>(null);
   const mcqRef = useRef<MultipleChoiceQuestionsFormHandle | null>(null);
   const addToast = useToast();

   // Keep track of original questions to determine what was edited/deleted/added
   const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);

   const isLoading = fetchMCQByQuizId.isLoading;
   const isError = fetchMCQByQuizId.isError;
   const data = fetchMCQByQuizId.data?.data;

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
               questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
               questionText: q.questionText,
               options: q.options,
               correctAnswer: q.correctAnswer,
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
      if (quizQuestions && quizQuestions.length > 0 && mcqRef.current?.reset) {
         const mcqQuestions = quizQuestions.map((q: any) => ({
            _id: q._id,
            order: q.order,
            questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "",
            points: q.points || 0,
         }));
         // cast to any to satisfy the reset parameter type when enum literal typing differs
         mcqRef.current.reset(mcqQuestions as any);
      }
   }, [quizQuestions]);

   // Sửa lỗi khi gọi mcqRef.current có thể null
   // Sửa handleSubmit để lưu refs trước khi validate
   const handleSubmit = async () => {
      if (!quizInfoRef.current || !mcqRef.current) return;
      const newQuestions = mcqRef.current.getNew();
      const editedQuestions = mcqRef.current.getEdited();
      const deletedQuestions = mcqRef.current.getDeleted();

      const infoValid = await quizInfoRef.current.validate?.();
      const mcqValid = await mcqRef.current.validate?.();

      if (infoValid === false || mcqValid?.valid === false) {
         addToast("error", "Vui lòng kiểm tra thông tin quiz và các câu hỏi");
         return;
      }

      // Get form values
      const infoValues = quizInfoRef.current.getValues();

      // Tạo payload theo updateIMCQBody
      const payload: updateIMCQBody = {
         _id: quizId,
         title: infoValues.title,
         description: infoValues.description || "",
         quizMode: infoValues.quizMode as any,
         quizType: QuestionTypeEnum.MULTIPLE_CHOICE,
         settings: infoValues.settings,
         tags: infoValues.tags || [],
         newMultipleChoiceQuizQuestionsArr: newQuestions.map((q: any) => ({
            ...q,
            _id: q._id ?? "",
         })),
         editMultipleChoiceQuizQuestionsArr: editedQuestions.map((q: any) => ({
            ...q,
            order: q.order ?? 0,
         })),
         deleteMultipleChoiceQuizQuestionsArr: deletedQuestions.map(
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

      updateMCQ.mutate(payload);
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
               <CardTitle>Chỉnh sửa Multiple Choice Quiz</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
               <div>
                  <QuizInfoForm ref={quizInfoRef} isFlashcard={false} />
               </div>

               <div>
                  <MultipleChoiceQuizQuestionForm ref={mcqRef} />
               </div>

               <div className="flex justify-between mt-2">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                     Hủy
                  </Button>
                  <Button
                     onClick={handleSubmit}
                     disabled={updateMCQ.isPending || updateMCQ.isSuccess}
                  >
                     {updateMCQ.isPending ? "Đang xử lý..." : "Lưu thay đổi"}
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default EditMultipleChoiceQuiz;
