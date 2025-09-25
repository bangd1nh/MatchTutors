import React from "react";
import { IQuizInfo } from "@/types/quiz";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
   quizInfo?: IQuizInfo | null;
};

const safeDate = (v?: string | Date) => {
   if (!v) return "—";
   try {
      return new Date(v as any).toLocaleString();
   } catch {
      return String(v);
   }
};

const QuizInfo: React.FC<Props> = ({ quizInfo }) => {
   if (!quizInfo) {
      return (
         <div className="min-h-[80px] flex items-center justify-center text-sm text-muted-foreground">
            Không có thông tin quiz
         </div>
      );
   }

   const {
      title,
      description,
      tags = [],
      settings,
      totalQuestions,
      createdAt,
      updatedAt,
      createdBy,
   } = quizInfo;

   return (
      <Card>
         <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="min-w-0">
               <CardTitle className="text-lg leading-tight truncate">
                  {title}
               </CardTitle>
               {description && (
                  <div className="text-sm text-muted-foreground mt-1 truncate">
                     {description}
                  </div>
               )}
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
               <div className="flex flex-wrap justify-start md:justify-end gap-2">
                  {tags.map((t, idx) => (
                     <Badge key={`${t}-${idx}`} className="text-xs">
                        {t}
                     </Badge>
                  ))}
               </div>

               <div className="text-xs text-muted-foreground mt-1">
                  {typeof totalQuestions === "number"
                     ? `${totalQuestions} thẻ`
                     : "—"}
               </div>

               {createdBy?.name && (
                  <div className="text-xs text-muted-foreground mt-1">
                     <span className="font-medium">{createdBy.name}</span>
                     <span className="ml-2 px-2 py-0.5 text-[11px] bg-muted rounded-full">
                        {createdBy.role}
                     </span>
                  </div>
               )}
            </div>
         </CardHeader>

         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
               <div className="text-xs text-muted-foreground">Settings</div>
               <div className="mt-1 text-sm">
                  <div>
                     Shuffle: {settings?.shuffleQuestions ? "Có" : "Không"}
                  </div>
                  <div>
                     Show answers after submit:{" "}
                     {settings?.showCorrectAnswersAfterSubmit ? "Có" : "Không"}
                  </div>
                  <div>
                     Time limit:{" "}
                     {settings?.timeLimitMinutes != null
                        ? `${settings.timeLimitMinutes} phút`
                        : "Không giới hạn"}
                  </div>
               </div>
            </div>

            <div className="text-end">
               <div className="text-xs text-muted-foreground">Tạo</div>
               <div className="mt-1 text-sm">{safeDate(createdAt)}</div>

               <div className="text-xs text-muted-foreground mt-3">
                  Cập nhật
               </div>
               <div className="mt-1 text-sm">{safeDate(updatedAt)}</div>
            </div>

            <div className="hidden md:block" />
         </CardContent>
      </Card>
   );
};

export default QuizInfo;
