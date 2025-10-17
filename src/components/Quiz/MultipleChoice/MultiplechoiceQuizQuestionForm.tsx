import {
   forwardRef,
   useImperativeHandle,
   useState,
   useRef,
   useEffect,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { MultipleChoiceQuestions } from "@/types/quiz";
import { QuestionTypeEnum } from "@/enums/quiz.enum";
import { useMultipleChoiceQuizStore } from "@/store/useMultipleChoiceQuizStore";

export type MultipleChoiceQuestionsFormHandle = {
   validate: () => Promise<{ valid: boolean; errors?: Record<string, string> }>;
   reset: (questions?: MultipleChoiceQuestions[]) => void;
   getNew: () => MultipleChoiceQuestions[];
   getEdited: () => MultipleChoiceQuestions[];
   getDeleted: () => { _id: string }[];
   clearChangeSets?: () => void;
};

const makeId = () => Math.random().toString(36).slice(2, 9);

const emptyQuestion = (): MultipleChoiceQuestions => ({
   _id: makeId(),
   order: undefined,
   questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
   questionText: "",
   options: ["", ""],
   correctAnswer: "",
   explanation: "",
   points: 1,
});

const shallowEqualQuestion = (
   a?: Partial<MultipleChoiceQuestions>,
   b?: Partial<MultipleChoiceQuestions>
) => {
   if (!a || !b) return false;

   // Compare options arrays
   const optionsEqual =
      Array.isArray(a.options) &&
      Array.isArray(b.options) &&
      a.options.length === b.options.length &&
      a.options.every((opt, i) => opt === b.options?.[i]);

   return (
      (a.questionText ?? "") === (b.questionText ?? "") &&
      (a.correctAnswer ?? "") === (b.correctAnswer ?? "") &&
      (a.explanation ?? "") === (b.explanation ?? "") &&
      (a.points ?? 0) === (b.points ?? 0) &&
      (a.order ?? 0) === (b.order ?? 0) &&
      optionsEqual
   );
};

const MultipleChoiceQuizQuestionForm =
   forwardRef<MultipleChoiceQuestionsFormHandle>((_, ref) => {
      const storeQuestions = useMultipleChoiceQuizStore((s) => s.quizQuestion);
      const addQuestion = useMultipleChoiceQuizStore((s) => s.addQuestion);
      const resetQuestionsInStore = useMultipleChoiceQuizStore(
         (s) => s.resetMultipleChoiceQuizQuestion
      );

      const [questions, setQuestionsState] = useState<
         MultipleChoiceQuestions[]
      >(
         storeQuestions?.length
            ? storeQuestions.map((q, i) => ({
                 ...q,
                 order: q.order ?? i + 1,
                 _id: q._id ?? makeId(),
              }))
            : [emptyQuestion()]
      );

      const [errors, setErrors] = useState<Record<string, string>>({});

      // refs for change-tracking - EXACTLY like FlashCardQuizQuestionsForm
      const originalMapRef = useRef<Record<string, MultipleChoiceQuestions>>(
         {}
      );
      const originalIdsRef = useRef<Set<string>>(new Set());
      const deletedRef = useRef<{ _id: string }[]>([]);
      const editedMapRef = useRef<Record<string, MultipleChoiceQuestions>>({});
      const newMapRef = useRef<Record<string, MultipleChoiceQuestions>>({});

      // initialize original snapshots when store questions change
      useEffect(() => {
         const snapshot: Record<string, MultipleChoiceQuestions> = {};
         const ids = new Set<string>();

         (storeQuestions || []).forEach((q, i) => {
            const id = q._id ?? makeId();
            // Sửa điều kiện nhận biết câu hỏi từ server - MongoDB ID có độ dài 24
            if (id && id.length === 24) {
               ids.add(id);
               snapshot[id] = { ...q, _id: id, order: q.order ?? i + 1 };
            }
         });

         originalMapRef.current = snapshot;
         originalIdsRef.current = ids;
         deletedRef.current = [];
         editedMapRef.current = {};
         newMapRef.current = {};
      }, [storeQuestions]);

      useImperativeHandle(
         ref,
         () => ({
            validate: async () => {
               const e: Record<string, string> = {};
               questions.forEach((q) => {
                  if (!q.questionText || q.questionText.trim() === "")
                     e[`${q._id}-question`] = "Question text is required";

                  if (!q.options || q.options.length < 2)
                     e[`${q._id}-options`] = "At least 2 options are required";

                  if (!q.correctAnswer || q.correctAnswer.trim() === "")
                     e[`${q._id}-answer`] = "Correct answer is required";

                  // Only check inclusion when correctAnswer is a defined, non-empty string
                  if (
                     q.options &&
                     typeof q.correctAnswer === "string" &&
                     q.correctAnswer.trim() !== "" &&
                     !q.options.includes(q.correctAnswer)
                  )
                     e[`${q._id}-answer`] =
                        "Correct answer must be one of the options";
               });

               setErrors(e);

               return { valid: Object.keys(e).length === 0, errors: e };
            },

            reset: (qs?: MultipleChoiceQuestions[]) => {
               if (qs && qs.length) {
                  const normalized = qs.map((q, i) => ({
                     ...q,
                     _id: q._id ?? makeId(),
                     order: q.order ?? i + 1,
                  }));
                  setQuestionsState(normalized);
               } else setQuestionsState([emptyQuestion()]);

               setErrors({});

               // reset change sets
               deletedRef.current = [];
               editedMapRef.current = {};
               newMapRef.current = {};

               // update original snapshot
               const snapshot: Record<string, MultipleChoiceQuestions> = {};
               const ids = new Set<string>();
               (qs || []).forEach((q, i) => {
                  const id = q._id ?? makeId();
                  if (id && !id.startsWith("client-")) {
                     ids.add(id);
                     snapshot[id] = { ...q, _id: id, order: q.order ?? i + 1 };
                  }
               });

               originalMapRef.current = snapshot;
               originalIdsRef.current = ids;
            },

            getDeleted: () => {
               return deletedRef.current.slice();
            },

            getEdited: () => {
               const edited = Object.values(editedMapRef.current).filter(
                  (q) => !deletedRef.current.some((d) => d._id === q._id)
               );
               return edited;
            },

            getNew: () => {
               const newQuestions: MultipleChoiceQuestions[] = questions
                  .filter((q) => !originalIdsRef.current.has(q._id as string))
                  .map((q) => ({
                     questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
                     questionText: q.questionText || "",
                     options: q.options || [],
                     correctAnswer: q.correctAnswer || "",
                     explanation: q.explanation || "",
                     order: q.order || 0,
                     points: q.points || 0,
                  }));
               return newQuestions;
            },

            clearChangeSets: () => {
               deletedRef.current = [];
               editedMapRef.current = {};
               newMapRef.current = {};
            },
         }),
         [questions, addQuestion, resetQuestionsInStore]
      );

      const update = (id: string, patch: Partial<MultipleChoiceQuestions>) => {
         setQuestionsState((prev) =>
            prev.map((p) => (p._id === id ? { ...p, ...patch } : p))
         );

         // clear related errors
         setErrors((prev) => {
            const copy = { ...prev };
            if (patch.questionText !== undefined) delete copy[`${id}-question`];
            if (patch.correctAnswer !== undefined) delete copy[`${id}-answer`];
            if (patch.options !== undefined) delete copy[`${id}-options`];
            return copy;
         });

         // update change sets - EXACTLY like FlashCardQuizQuestionsForm
         const isOriginal = id.length === 24 && originalIdsRef.current.has(id);

         // get updated question (approximate)
         const updated = (questions.find((q) => q._id === id) ?? {
            _id: id,
            ...patch,
         }) as MultipleChoiceQuestions;

         const merged = {
            ...(originalMapRef.current[id] ?? {}),
            ...updated,
            ...patch,
         };

         if (isOriginal) {
            // compare with original snapshot to decide if edited
            const original = originalMapRef.current[id];
            if (!shallowEqualQuestion(original, merged)) {
               editedMapRef.current[id] = { ...merged, _id: id };
            } else {
               // if matches original now, remove from edited set
               delete editedMapRef.current[id];
            }
         } else {
            // new question: keep in newMapRef as current state
            newMapRef.current[id] = { ...merged, _id: id };
         }
      };

      const add = (afterId?: string) => {
         setQuestionsState((prev) => {
            const nv = [...prev];
            const idx = afterId
               ? Math.max(0, nv.findIndex((q) => q._id === afterId) + 1)
               : nv.length;
            const baseNewQ = emptyQuestion();
            const newId = baseNewQ._id ?? makeId();
            const newQ = { ...baseNewQ, _id: newId };
            nv.splice(idx, 0, newQ);
            // add to newMap
            newMapRef.current[newId] = { ...newQ };
            return nv.map((q, i) => ({ ...q, order: i + 1 }));
         });
      };

      const remove = (id: string) => {
         setQuestionsState((prev) => {
            const nv = prev.filter((q) => q._id !== id);
            // keep at least 1
            if (nv.length < 1) return prev;
            return nv.map((q, i) => ({ ...q, order: i + 1 }));
         });

         // if removed item is original, add to deleted list
         if (originalIdsRef.current.has(id)) {
            // only add once
            const already = deletedRef.current.find((d) => d._id === id);
            if (!already) {
               deletedRef.current.push({ _id: id });
            }
            // ensure it's not in edited set
            delete editedMapRef.current[id];
         } else {
            // new item removed: remove from newMapRef
            delete newMapRef.current[id];
         }

         // clear errors related
         setErrors((prev) => {
            const copy = { ...prev };
            delete copy[`${id}-question`];
            delete copy[`${id}-answer`];
            delete copy[`${id}-options`];
            return copy;
         });
      };

      const moveUp = (index: number) => {
         if (index <= 0) return;
         setQuestionsState((prev) => {
            const nv = [...prev];
            [nv[index - 1], nv[index]] = [nv[index], nv[index - 1]];
            return nv.map((q, i) => {
               const nq = { ...q, order: i + 1 };
               // Sửa lỗi - Kiểm tra nq._id tồn tại
               if (nq._id && originalIdsRef.current.has(nq._id)) {
                  const original = originalMapRef.current[nq._id];
                  if (!shallowEqualQuestion(original, nq)) {
                     editedMapRef.current[nq._id] = nq;
                  } else {
                     delete editedMapRef.current[nq._id];
                  }
               } else if (nq._id) {
                  newMapRef.current[nq._id] = nq;
               }
               return nq;
            });
         });
      };

      const moveDown = (index: number) => {
         setQuestionsState((prev) => {
            if (index >= prev.length - 1) return prev;
            const nv = [...prev];
            [nv[index], nv[index + 1]] = [nv[index + 1], nv[index]];
            return nv.map((q, i) => {
               const nq = { ...q, order: i + 1 };
               // Sửa lỗi - Kiểm tra nq._id tồn tại
               if (nq._id && originalIdsRef.current.has(nq._id)) {
                  const original = originalMapRef.current[nq._id];
                  if (!shallowEqualQuestion(original, nq)) {
                     editedMapRef.current[nq._id] = nq;
                  } else {
                     delete editedMapRef.current[nq._id];
                  }
               } else if (nq._id) {
                  newMapRef.current[nq._id] = nq;
               }
               return nq;
            });
         });
      };

      // Function to add an option to a question
      const addOption = (questionId: string) => {
         setQuestionsState((prev) =>
            prev.map((q) => {
               if (q._id === questionId) {
                  const options = [...(q.options || []), ""];
                  return { ...q, options };
               }
               return q;
            })
         );

         // Update tracking
         const question = questions.find((q) => q._id === questionId);
         if (question) {
            update(questionId, {
               options: [...(question.options || []), ""],
            });
         }
      };

      // Function to update an option
      const updateOption = (
         questionId: string,
         optionIndex: number,
         value: string
      ) => {
         setQuestionsState((prev) =>
            prev.map((q) => {
               if (q._id === questionId && Array.isArray(q.options)) {
                  const newOptions = [...q.options];
                  newOptions[optionIndex] = value;
                  return { ...q, options: newOptions };
               }
               return q;
            })
         );

         // Update tracking and handle if this was the correct answer
         const question = questions.find((q) => q._id === questionId);
         if (question && Array.isArray(question.options)) {
            const oldOption = question.options[optionIndex];
            const newOptions = [...question.options];
            newOptions[optionIndex] = value;

            const updates: Partial<MultipleChoiceQuestions> = {
               options: newOptions,
            };

            // If this option was the correct answer, update correctAnswer too
            if (question.correctAnswer === oldOption) {
               updates.correctAnswer = value;
            }

            update(questionId, updates);
         }
      };

      // Function to remove an option
      const removeOption = (questionId: string, optionIndex: number) => {
         setQuestionsState((prev) =>
            prev.map((q) => {
               if (
                  q._id === questionId &&
                  Array.isArray(q.options) &&
                  q.options.length > 2
               ) {
                  const removedOption = q.options[optionIndex];
                  const newOptions = q.options.filter(
                     (_, i) => i !== optionIndex
                  );
                  let updates = { options: newOptions };

                  // If removed option was correct answer, reset correctAnswer
                  if (q.correctAnswer === removedOption) {
                     return { ...q, ...updates, correctAnswer: "" };
                  }

                  return { ...q, ...updates };
               }
               return q;
            })
         );

         // Update tracking
         const question = questions.find((q) => q._id === questionId);
         if (
            question &&
            Array.isArray(question.options) &&
            question.options.length > 2
         ) {
            const removedOption = question.options[optionIndex];
            const newOptions = question.options.filter(
               (_, i) => i !== optionIndex
            );

            const updates: Partial<MultipleChoiceQuestions> = {
               options: newOptions,
            };

            // If removed option was correct answer, reset correctAnswer
            if (question.correctAnswer === removedOption) {
               updates.correctAnswer = "";
            }

            update(questionId, updates);
         }
      };

      // Function to set correct answer
      const setCorrectAnswer = (questionId: string, option: string) => {
         setQuestionsState((prev) =>
            prev.map((q) => {
               if (q._id === questionId) {
                  return { ...q, correctAnswer: option };
               }
               return q;
            })
         );

         update(questionId, { correctAnswer: option });
      };

      // Calculate total points
      const totalPoints = questions.reduce(
         (sum, q) => sum + (Number(q.points) || 0),
         0
      );

      return (
         <div className="space-y-4">
            {questions.map((q, idx) => (
               <Card key={q._id} className="bg-slate-800/40">
                  <CardHeader className="flex items-center justify-between py-2 px-4">
                     <CardTitle className="text-sm">
                        Câu hỏi #{q.order ?? idx + 1}
                     </CardTitle>

                     <div className="flex items-center gap-2">
                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => moveUp(idx)}
                           disabled={idx === 0}
                           title="Move up"
                        >
                           <ChevronUp className="w-4 h-4" />
                        </Button>

                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => moveDown(idx)}
                           disabled={idx === questions.length - 1}
                           title="Move down"
                        >
                           <ChevronDown className="w-4 h-4" />
                        </Button>

                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => {
                              if (q._id) add(q._id);
                           }}
                           title="Add after"
                        >
                           <Plus className="w-4 h-4" />
                        </Button>

                        <Button
                           type="button"
                           variant="ghost"
                           size="sm"
                           onClick={() => {
                              if (q._id) remove(q._id); // Thêm kiểm tra trước khi gọi hàm
                           }}
                           disabled={questions.length <= 1}
                           className="text-red-500"
                           title="Delete"
                        >
                           <Trash className="w-4 h-4" />
                        </Button>
                     </div>
                  </CardHeader>

                  <CardContent className="p-4">
                     <div className="hidden">
                        <div>
                           <Label>Điểm</Label>
                           <Input
                              type="number"
                              value={q.points || 1}
                              onChange={(e) =>
                                 update(q._id as string, {
                                    points: parseInt(e.target.value) || 0,
                                 })
                              }
                              disabled={true}
                              placeholder="Points"
                           />
                        </div>
                     </div>

                     <div className="mt-3">
                        <Label>Các câu hỏi trắc nghiệm</Label>
                        <Input
                           value={q.questionText || ""}
                           onChange={(e) =>
                              update(q._id as string, {
                                 questionText: e.target.value,
                              })
                           }
                           placeholder="Question text"
                        />
                        {errors[`${q._id}-question`] && (
                           <div className="text-xs text-red-400 mt-1">
                              {errors[`${q._id}-question`]}
                           </div>
                        )}
                     </div>

                     <div className="mt-3">
                        <Label>Các lựa chọn (min 2, chọn 1 đúng)</Label>
                        <div className="space-y-2">
                           {(q.options || []).map((option, optIdx) => (
                              <div
                                 key={optIdx}
                                 className="flex items-center gap-2"
                              >
                                 <input
                                    type="radio"
                                    checked={q.correctAnswer === option}
                                    onChange={() => {
                                       if (q._id)
                                          setCorrectAnswer(q._id, option);
                                    }}
                                    disabled={!option}
                                 />

                                 <Input
                                    value={option}
                                    onChange={(e) =>
                                       updateOption(
                                          q._id as string,
                                          optIdx,
                                          e.target.value
                                       )
                                    }
                                    placeholder={`Option ${optIdx + 1}`}
                                 />

                                 <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                       removeOption(q._id as string, optIdx)
                                    }
                                    disabled={(q.options || []).length <= 2}
                                    className="p-2 text-red-500"
                                 >
                                    <Trash className="w-4 h-4" />
                                 </Button>
                              </div>
                           ))}

                           <Button
                              type="button"
                              variant="outline"
                              onClick={() => addOption(q._id as string)}
                              className="mt-2"
                           >
                              <Plus className="mr-2 w-4 h-4" /> Thêm lựa chọn
                           </Button>
                        </div>

                        {errors[`${q._id}-options`] && (
                           <div className="text-xs text-red-400 mt-1">
                              {errors[`${q._id}-options`]}
                           </div>
                        )}

                        {errors[`${q._id}-answer`] && (
                           <div className="text-xs text-red-400 mt-1">
                              {errors[`${q._id}-answer`]}
                           </div>
                        )}
                     </div>

                     <div className="mt-3">
                        <Label>giải thích (optional)</Label>
                        <Textarea
                           value={q.explanation || ""}
                           onChange={(e) =>
                              update(q._id as string, {
                                 explanation: e.target.value,
                              })
                           }
                           rows={3}
                           placeholder="Explanation (optional)"
                        />
                     </div>
                  </CardContent>
               </Card>
            ))}

            <div className="flex items-center justify-between">
               <div className="text-sm font-medium">
                  Tổng số điểm: {totalPoints}
               </div>
               <div>
                  <Button onClick={() => add()} variant="outline">
                     <Plus className="mr-2 w-4 h-4" /> thêm câu hỏi
                  </Button>
               </div>
            </div>
         </div>
      );
   });

MultipleChoiceQuizQuestionForm.displayName = "MultipleChoiceQuizQuestionForm";

export default MultipleChoiceQuizQuestionForm;
