import FlashCardQuizQuestionsForm, {
   QuizQuestionsHandle,
} from "@/components/Quiz/FlashCard/FlashCardQuizQuestionsForm";
import QuizInfoForm, { QuizInfoHandle } from "@/components/Quiz/QuizInfoForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   useFetchFlashcardQuestions,
   useUpdateFlashcard,
} from "@/hooks/useQuiz";
import { IQUizUpdate } from "@/types/quiz";
import { ArrowLeft } from "lucide-react";
import { useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const EditFlashcardQuiz = () => {
   const searchParams = new URLSearchParams(window.location.search);
   const quizId = searchParams.get("flashcardId") || "";
   const { data, isLoading, isError } = useFetchFlashcardQuestions(quizId);
   const editFlashcard = useUpdateFlashcard();
   const navigate = useNavigate();

   const quizInfoRef = useRef<QuizInfoHandle | null>(null);
   const quizQuestionsRef = useRef<QuizQuestionsHandle | null>(null);

   const initialQuestions = useMemo(() => {
      const qs = (data?.data?.quizQuestions || []) as any[];
      return qs.map((q, i) => ({
         id: q._id,
         _id: q._id,
         order: q.order ?? i + 1,
         frontText: q.frontText,
         backText: q.backText,
         explanation: q.explanation,
         points: q.points ?? 0,
      }));
   }, [data]);

   // set quizInfo via ref (optional)
   useEffect(() => {
      if (!data?.data) return;
      const quizInfo = data.data.quizInfo;
      const normalizedSettings = quizInfo?.settings
         ? {
              shuffleQuestions: !!quizInfo.settings.shuffleQuestions,
              showCorrectAnswersAfterSubmit:
                 !!quizInfo.settings.showCorrectAnswersAfterSubmit,
              timeLimitMinutes: quizInfo.settings.timeLimitMinutes ?? null,
           }
         : undefined;

      quizInfoRef.current?.setValues?.({
         title: quizInfo?.title,
         description: quizInfo?.description,
         quizMode: quizInfo?.quizMode,
         settings: normalizedSettings,
         tags: quizInfo?.tags,
         totalQuestions: quizInfo?.totalQuestions,
      });
   }, [data]);

   if (isLoading) {
      return (
         <div className="mx-auto my-6 p-4">
            <Card>
               <CardHeader>
                  <CardTitle>Đang tải...</CardTitle>
               </CardHeader>
               <CardContent>
                  Vui lòng chờ — đang tải dữ liệu flashcard.
               </CardContent>
            </Card>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="mx-auto my-6 p-4">
            <Card>
               <CardHeader>
                  <CardTitle>Lỗi</CardTitle>
               </CardHeader>
               <CardContent>
                  Không thể tải dữ liệu flashcard. Vui lòng thử làm mới trang
                  hoặc thử lại sau.
               </CardContent>
            </Card>
         </div>
      );
   }

   const handleSubmit = async () => {
      const infoValid = await quizInfoRef.current?.validate?.();
      const qValid = quizQuestionsRef.current?.validate?.();
      if (infoValid === false || qValid?.valid === false) {
         console.warn("Validation failed", { infoValid, qValid });
         return;
      }

      const quizInfoValues = (quizInfoRef.current?.getValues?.() || {}) as any;
      const deleteQuestionArr = quizQuestionsRef.current?.getDeleted?.() || [];
      const editedQuestions = quizQuestionsRef.current?.getEdited?.() || [];
      const newQuestions = quizQuestionsRef.current?.getNew?.() || [];

      const editQuestionArr = editedQuestions
         .map((q: any) => ({
            _id: q._id ?? q.id ?? q.idTemp ?? null,
            order: q.order,
            questionType: "FLASHCARD",
            frontText: q.frontText,
            backText: q.backText,
            explanation: q.explanation,
         }))
         .filter((x) => x._id); // drop any without _id just in case

      const newQuestionArr = newQuestions.map((q: any) => ({
         order: q.order,
         questionType: "FLASHCARD",
         frontText: q.frontText,
         backText: q.backText,
         explanation: q.explanation,
      }));

      const payload = {
         _id: quizId,
         title: quizInfoValues.title ?? "",
         description: quizInfoValues.description ?? "",
         tags: quizInfoValues.tags ?? [],
         deleteQuestionArr,
         editQuestionArr,
         newQuestionArr,
      };

      console.log("Edit payload:", payload);

      editFlashcard.mutate(payload as IQUizUpdate);
   };

   return (
      <div className=" mx-auto my-6 p-4">
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
               <CardTitle>Sửa / Chỉnh sửa Flashcard Quiz</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
               <div>
                  <QuizInfoForm ref={quizInfoRef} />
               </div>

               <div>
                  {/* pass initialQuestions so the form's useEffect initializes original snapshot */}
                  <FlashCardQuizQuestionsForm
                     ref={quizQuestionsRef}
                     initial={initialQuestions}
                  />
               </div>

               <div className="flex justify-end mt-2">
                  <Button
                     onClick={handleSubmit}
                     disabled={editFlashcard.isPending}
                  >
                     {editFlashcard.isPending
                        ? "Đang lưu ...."
                        : "Lưu / Submit"}
                  </Button>
               </div>
            </CardContent>
         </Card>
      </div>
   );
};

export default EditFlashcardQuiz;
