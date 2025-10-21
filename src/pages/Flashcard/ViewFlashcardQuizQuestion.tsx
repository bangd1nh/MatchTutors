import { useState, useMemo } from "react";
import { useFetchFlashcardQuestions } from "@/hooks/useQuiz";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import FlashcardQuestions from "@/components/Quiz/FlashCard/FlashcardQuestions";
import QuizInfo from "@/components/Quiz/QuizInfo";
import { useNavigate } from "react-router-dom";

export default function ViewFlashcardQuizQuestion() {
   const searchParams = new URLSearchParams(window.location.search);
   const quizId = searchParams.get("flashcardId") || "";
   const {
      data: quizData,
      isLoading,
      isError,
   } = useFetchFlashcardQuestions(quizId);
   const navigate = useNavigate();

   const cards = useMemo(
      () =>
         Array.isArray(quizData?.data.quizQuestions)
            ? quizData!.data.quizQuestions
            : [],
      [quizData]
   );

   const [index, setIndex] = useState(0);
   const [flipped, setFlipped] = useState(false);

   const current = cards[index];

   const canPrev = index > 0;
   const canNext = index < cards.length - 1;

   const prev = () => {
      if (!canPrev) return;
      setFlipped(false);
      setIndex((s) => Math.max(0, s - 1));
   };
   const next = () => {
      if (!canNext) return;
      setFlipped(false);
      setIndex((s) => Math.min(cards.length - 1, s + 1));
   };

   if (isLoading) {
      return (
         <div className="min-h-[240px] flex items-center justify-center">
            <div className="text-sm text-muted-foreground">Đang tải thẻ...</div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="min-h-[240px] flex items-center justify-center">
            <div className="text-sm text-red-400">
               Không tải được thẻ flashcard
            </div>
         </div>
      );
   }

   if (!cards.length) {
      return (
         <div className="min-h-[240px] flex items-center justify-center">
            <div className="text-sm text-muted-foreground">
               Không có thẻ nào
            </div>
         </div>
      );
   }

   return (
      <div className="mx-auto px-4 py-6 ">
         <div className="mb-6">
            <Button
               variant="ghost"
               onClick={() => navigate(-1)}
               className="pl-0"
            >
               <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Button>
         </div>
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Flashcards</h2>
            <Badge>
               {Math.min(index + 1, cards.length)} / {cards.length}
            </Badge>
         </div>

         {/* quiz info above the big card */}
         <div className="mb-4">
            <QuizInfo quizInfo={quizData?.data.quizInfo ?? null} />
         </div>

         {/* frame with centered card and side arrows */}
         <div className="border rounded-xl p-4 bg-transparent relative">
            <div className="text-center mb-3">
               <CardTitle className="text-base">{"Flashcard"}</CardTitle>
            </div>

            <div className="w-1/2 relative flex items-center justify-center mx-auto">
               {/* Prev arrow (left) */}
               <div className="absolute left-0 top-1/2 -translate-y-1/2 z-50">
                  <Button
                     variant={canPrev ? "default" : "ghost"}
                     onClick={prev}
                     disabled={!canPrev}
                     aria-label="Previous card"
                     className="p-2 rounded-full"
                  >
                     <ChevronLeft
                        className={`w-6 h-6 ${
                           canPrev
                              ? "text-white dark:text-black"
                              : "text-muted-foreground dark:text-black"
                        }`}
                     />
                  </Button>
               </div>

               {/* Card */}
               <Card className="w-full  mx-4">
                  <CardContent className="flex flex-col items-center pt-5">
                     <div className="w-full sm:w-[640px] h-96 flex items-center justify-center">
                        <div
                           role="button"
                           tabIndex={0}
                           onClick={() => setFlipped((f) => !f)}
                           onKeyDown={(e) => {
                              if (e.key === " " || e.key === "Enter") {
                                 e.preventDefault();
                                 setFlipped((f) => !f);
                              }
                           }}
                           className="relative w-full h-full"
                           style={{
                              transformStyle: "preserve-3d",
                              transition: "transform 450ms ease-in-out",
                              transform: flipped
                                 ? "rotateY(180deg)"
                                 : "rotateY(0deg)",
                              cursor: "pointer",
                           }}
                           aria-label="Flashcard"
                           aria-pressed={flipped}
                        >
                           {/* Front */}
                           <div
                              className="absolute inset-0 bg-gray-300 dark:bg-gray-800 border rounded-lg p-8 flex items-center justify-center"
                              style={{ backfaceVisibility: "hidden" }}
                           >
                              <div className="text-center px-4">
                                 <p className="text-3xl sm:text-4xl font-semibold leading-tight hover:cursor-pointer select-none">
                                    {current?.frontText}
                                 </p>
                              </div>
                           </div>

                           {/* Back */}
                           <div
                              className="absolute inset-0 bg-gray-300 dark:bg-gray-800 border rounded-lg p-8 flex flex-col items-center justify-center"
                              style={{
                                 backfaceVisibility: "hidden",
                                 transform: "rotateY(180deg)",
                              }}
                           >
                              <div className="text-center px-4">
                                 <p className="text-3xl sm:text-4xl font-semibold leading-tight hover:cursor-pointer select-none">
                                    {current?.backText}
                                 </p>

                                 {/* explanation on back */}
                                 {current?.explanation && (
                                    <p className="mt-4 text-sm text-muted-foreground max-w-[560px] hover:cursor-pointer select-none">
                                       {current.explanation}
                                    </p>
                                 )}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* flip control */}
                     <div className="mt-4">
                        <Button onClick={() => setFlipped((f) => !f)}>
                           {flipped ? "Hiện trước" : "Lật thẻ"}
                        </Button>
                     </div>

                     <div className="w-full mt-4">
                        <div className="text-xs text-muted-foreground mb-2">
                           Tạo:{" "}
                           {current?.createdAt
                              ? new Date(current.createdAt).toLocaleString()
                              : "—"}
                        </div>

                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                           <div
                              className="h-full bg-blue-500 transition-width"
                              style={{
                                 width: `${
                                    ((index + 1) / cards.length) * 100
                                 }%`,
                              }}
                           />
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Next arrow (right) */}
               <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <Button
                     variant={canNext ? "default" : "ghost"}
                     onClick={next}
                     disabled={!canNext}
                     aria-label="Next card"
                     className="p-2 rounded-full"
                  >
                     <ChevronRight
                        className={`w-6 h-6 ${
                           canNext
                              ? "text-white dark:text-black"
                              : "text-muted-foreground dark:text-black"
                        }`}
                     />
                  </Button>
               </div>
            </div>
         </div>

         {/* Flashcard list below the big card */}
         <div className="mt-6">
            <FlashcardQuestions questions={cards} />
         </div>
      </div>
   );
}
