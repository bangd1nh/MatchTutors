import { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { FlashcardQuestion } from "@/types/quiz";

export type QuizQuestionsHandle = {
   getQuestions: () => FlashcardQuestion[];
   validate: () => { valid: boolean; errors: Record<string, string> };
   reset: (questions?: FlashcardQuestion[]) => void;
};

type Props = {
   initial?: FlashcardQuestion[];
   minItems?: number;
};

const makeId = () => Math.random().toString(36).slice(2, 9);

const emptyQuestion = (): FlashcardQuestion => ({
   id: makeId(),
   order: undefined,
   frontText: "",
   backText: "",
   explanation: "",
});

const FlashCardQuizQuestionsForm = forwardRef<QuizQuestionsHandle, Props>(
   ({ initial = [], minItems = 0 }, ref) => {
      const [questions, setQuestions] = useState<FlashcardQuestion[]>(
         initial.length
            ? initial.map((q, i) => ({ ...q, order: q.order ?? i + 1 }))
            : [emptyQuestion()]
      );
      const [errors, setErrors] = useState<Record<string, string>>({});

      useImperativeHandle(
         ref,
         () => ({
            getQuestions: () =>
               questions.map((q, i) => ({ ...q, order: q.order ?? i + 1 })),
            validate: () => {
               const e: Record<string, string> = {};
               questions.forEach((q) => {
                  if (!q.frontText || q.frontText.trim() === "")
                     e[`${q.id}-front`] = "Front text is required";
                  if (!q.backText || q.backText.trim() === "")
                     e[`${q.id}-back`] = "Back text is required";
               });
               setErrors(e);
               return { valid: Object.keys(e).length === 0, errors: e };
            },
            reset: (qs?: FlashcardQuestion[]) => {
               if (qs && qs.length)
                  setQuestions(
                     qs.map((q, i) => ({
                        ...q,
                        id: q.id ?? makeId(),
                        order: q.order ?? i + 1,
                     }))
                  );
               else setQuestions([emptyQuestion()]);
               setErrors({});
            },
         }),
         [questions]
      );

      const update = (id: string, patch: Partial<FlashcardQuestion>) => {
         setQuestions((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
         );
         // clear related errors
         setErrors((prev) => {
            const copy = { ...prev };
            if (patch.frontText !== undefined) delete copy[`${id}-front`];
            if (patch.backText !== undefined) delete copy[`${id}-back`];
            return copy;
         });
      };

      const add = (afterId?: string) => {
         setQuestions((prev) => {
            const nv = [...prev];
            const idx = afterId
               ? nv.findIndex((q) => q.id === afterId) + 1
               : nv.length;
            nv.splice(idx, 0, emptyQuestion());
            return nv.map((q, i) => ({ ...q, order: i + 1 }));
         });
      };

      const remove = (id: string) => {
         setQuestions((prev) => {
            const nv = prev.filter((q) => q.id !== id);
            // keep at least minItems or 1
            if (nv.length < Math.max(1, minItems)) return prev;
            return nv.map((q, i) => ({ ...q, order: i + 1 }));
         });
         setErrors((prev) => {
            const copy = { ...prev };
            delete copy[`${id}-front`];
            delete copy[`${id}-back`];
            return copy;
         });
      };

      const moveUp = (index: number) => {
         if (index <= 0) return;
         setQuestions((prev) => {
            const nv = [...prev];
            [nv[index - 1], nv[index]] = [nv[index], nv[index - 1]];
            return nv.map((q, i) => ({ ...q, order: i + 1 }));
         });
      };

      const moveDown = (index: number) => {
         setQuestions((prev) => {
            if (index >= prev.length - 1) return prev;
            const nv = [...prev];
            [nv[index], nv[index + 1]] = [nv[index + 1], nv[index]];
            return nv.map((q, i) => ({ ...q, order: i + 1 }));
         });
      };

      return (
         <div className="space-y-4">
            {questions.map((q, idx) => (
               <Card key={q.id} className="bg-slate-800/40">
                  <CardHeader className="flex items-center justify-between py-2 px-4">
                     <CardTitle className="text-sm">
                        #{q.order ?? idx + 1}
                     </CardTitle>
                     <div className="flex items-center gap-2">
                        <button
                           type="button"
                           onClick={() => moveUp(idx)}
                           className="btn-ghost p-2"
                           title="Move up"
                        >
                           <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                           type="button"
                           onClick={() => moveDown(idx)}
                           className="btn-ghost p-2"
                           title="Move down"
                        >
                           <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                           type="button"
                           onClick={() => add(q.id)}
                           className="btn-ghost p-2"
                           title="Add after"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                        <button
                           type="button"
                           onClick={() => remove(q.id)}
                           className="btn-ghost p-2 text-red-500"
                           title="Delete"
                        >
                           <Trash className="w-4 h-4" />
                        </button>
                     </div>
                  </CardHeader>

                  <CardContent className="p-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <Label>Front</Label>
                           <Input
                              value={q.frontText}
                              onChange={(e) =>
                                 update(q.id, { frontText: e.target.value })
                              }
                              placeholder="Mặt trước (ví dụ: thuật ngữ)"
                           />
                           {errors[`${q.id}-front`] && (
                              <div className="text-xs text-red-400 mt-1">
                                 {errors[`${q.id}-front`]}
                              </div>
                           )}
                        </div>

                        <div>
                           <Label>Back</Label>
                           <Input
                              value={q.backText}
                              onChange={(e) =>
                                 update(q.id, { backText: e.target.value })
                              }
                              placeholder="Mặt sau (ví dụ: định nghĩa)"
                           />
                           {errors[`${q.id}-back`] && (
                              <div className="text-xs text-red-400 mt-1">
                                 {errors[`${q.id}-back`]}
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="mt-3">
                        <Label>Explanation (optional)</Label>
                        <Textarea
                           value={q.explanation ?? ""}
                           onChange={(e) =>
                              update(q.id, { explanation: e.target.value })
                           }
                           rows={3}
                           placeholder="Giải thích, ghi chú..."
                        />
                     </div>
                  </CardContent>
               </Card>
            ))}

            <div className="flex justify-center">
               <Button variant="outline" onClick={() => add()}>
                  <Plus className="mr-2 w-4 h-4" />
                  Thêm thẻ
               </Button>
            </div>
         </div>
      );
   }
);

FlashCardQuizQuestionsForm.displayName = "FlashCardQuizQuestionsForm";

export default FlashCardQuizQuestionsForm;
