import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IQuizQuestion } from "@/types/quizQuestion";

type Props = {
   questions: IQuizQuestion[];
};

const FlashcardQuestions: React.FC<Props> = ({ questions = [] }) => {
   if (!questions.length) {
      return (
         <div className="min-h-[120px] flex items-center justify-center text-sm text-muted-foreground">
            Chưa có thẻ flashcard
         </div>
      );
   }

   return (
      <div className="space-y-4">
         {questions.map((q, i) => (
            <Card key={(q as any)._id ?? q._id ?? i} className="">
               <CardContent className="p-4 relative">
                  {/* order badge top-right */}
                  <div className="absolute right-4 top-4">
                     <Badge className="rounded-full px-3 py-1 text-xs bg-sky-600">
                        {q.order ?? i + 1}
                     </Badge>
                  </div>

                  <div className="flex flex-col md:flex-row items-stretch gap-4">
                     {/* Left: front text */}
                     <div className="md:w-2/5 w-full min-w-[140px]">
                        <div className="text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">
                           {q.frontText}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                           Thuật ngữ
                        </div>
                     </div>

                     {/* Vertical divider (on md+) */}
                     <div className="hidden md:block w-px bg-slate-700 mx-2" />

                     {/* Right: back text and explanation */}
                     <div className="flex-1">
                        <div className="text-lg md:text-xl font-medium">
                           {q.backText}
                        </div>
                        {q.explanation && (
                           <div className="text-sm text-muted-foreground mt-2 max-w-none">
                              giải thích: {q.explanation}
                           </div>
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
   );
};

export default FlashcardQuestions;
