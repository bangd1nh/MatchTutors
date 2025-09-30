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
import { FlashcardQuestion } from "@/types/quiz";

export type QuizQuestionsHandle = {
   getQuestions: () => FlashcardQuestion[];
   validate: () => { valid: boolean; errors: Record<string, string> };
   reset: (questions?: FlashcardQuestion[]) => void;
   setQuestions: (questions?: FlashcardQuestion[]) => void;

   // change sets for edit flow
   getDeleted: () => { _id: string }[];
   getEdited: () => FlashcardQuestion[]; // full updated objects for existing questions
   getNew: () => FlashcardQuestion[]; // newly added questions (no original _id)
   clearChangeSets?: () => void;
};

type Props = {
   initial?: FlashcardQuestion[];
   minItems?: number;
};

const makeId = () => Math.random().toString(36).slice(2, 9);

const emptyQuestion = (): FlashcardQuestion => ({
   _id: makeId(),
   order: undefined,
   frontText: "",
   backText: "",
   explanation: "",
   points: 0,
});

const shallowEqualQuestion = (
   a?: Partial<FlashcardQuestion>,
   b?: Partial<FlashcardQuestion>
) => {
   if (!a || !b) return false;
   return (
      (a.frontText ?? "") === (b.frontText ?? "") &&
      (a.backText ?? "") === (b.backText ?? "") &&
      (a.explanation ?? "") === (b.explanation ?? "") &&
      (a.points ?? 0) === (b.points ?? 0) &&
      (a.order ?? 0) === (b.order ?? 0)
   );
};

const FlashCardQuizQuestionsForm = forwardRef<QuizQuestionsHandle, Props>(
   ({ initial = [], minItems = 0 }, ref) => {
      const [questions, setQuestionsState] = useState<FlashcardQuestion[]>(
         initial.length
            ? initial.map((q, i) => ({
                 ...q,
                 order: q.order ?? i + 1,
                 _id: q._id ?? makeId(),
              }))
            : [emptyQuestion()]
      );
      const [errors, setErrors] = useState<Record<string, string>>({});

      // refs for change-tracking
      const originalMapRef = useRef<Record<string, FlashcardQuestion>>({});
      const originalIdsRef = useRef<Set<string>>(new Set());
      const deletedRef = useRef<{ _id: string }[]>([]);
      const editedMapRef = useRef<Record<string, FlashcardQuestion>>({});
      const newMapRef = useRef<Record<string, FlashcardQuestion>>({});

      // initialize original snapshots when `initial` changes
      useEffect(() => {
         const snapshot: Record<string, FlashcardQuestion> = {};
         const ids = new Set<string>();

         (initial || []).forEach((q, i) => {
            const id = q._id ?? makeId();
            ids.add(id);
            snapshot[id] = { ...q, _id: id, order: q.order ?? i + 1 };
         });

         originalMapRef.current = snapshot;
         originalIdsRef.current = ids;
         deletedRef.current = [];
         editedMapRef.current = {};
         newMapRef.current = {};
      }, [initial]);

      useImperativeHandle(
         ref,
         () => ({
            getQuestions: () =>
               questions.map((q, i) => ({ ...q, order: q.order ?? i + 1 })),
            validate: () => {
               const e: Record<string, string> = {};
               questions.forEach((q) => {
                  if (!q.frontText || q.frontText.trim() === "")
                     e[`${q._id}-front`] = "Front text is required";
                  if (!q.backText || q.backText.trim() === "")
                     e[`${q._id}-back`] = "Back text is required";
               });
               setErrors(e);
               return { valid: Object.keys(e).length === 0, errors: e };
            },
            reset: (qs?: FlashcardQuestion[]) => {
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
               const snapshot: Record<string, FlashcardQuestion> = {};
               const ids = new Set<string>();
               (qs || []).forEach((q, i) => {
                  const id = q._id ?? makeId();
                  ids.add(id);
                  snapshot[id] = { ...q, _id: id, order: q.order ?? i + 1 };
               });
               originalMapRef.current = snapshot;
               originalIdsRef.current = ids;
            },
            setQuestions: (qs?: FlashcardQuestion[]) => {
               // setQuestions acts like reset but keeps errors cleared
               if (qs && qs.length) {
                  const normalized = qs.map((q, i) => ({
                     ...q,
                     _id: q._id ?? makeId(),
                     order: q.order ?? i + 1,
                  }));
                  setQuestionsState(normalized);
               } else {
                  setQuestionsState([emptyQuestion()]);
               }
               setErrors({});
               // reset change sets and update original snapshot
               deletedRef.current = [];
               editedMapRef.current = {};
               newMapRef.current = {};
               const snapshot: Record<string, FlashcardQuestion> = {};
               const ids = new Set<string>();
               (qs || []).forEach((q, i) => {
                  const id = q._id ?? makeId();
                  ids.add(id);
                  snapshot[id] = { ...q, _id: id, order: q.order ?? i + 1 };
               });
               originalMapRef.current = snapshot;
               originalIdsRef.current = ids;
            },
            getDeleted: () => deletedRef.current.slice(),

            // derive edited from editedMap but ensure none are in deleted list
            getEdited: () =>
               Object.values(editedMapRef.current).filter(
                  (q) => !deletedRef.current.some((d) => d._id === q._id)
               ),

            // derive new items from current questions state to ensure up-to-date order/fields
            getNew: () =>
               questions
                  .filter((q) => !originalIdsRef.current.has(q._id))
                  .map((q) => ({ ...q })),

            clearChangeSets: () => {
               deletedRef.current = [];
               editedMapRef.current = {};
               newMapRef.current = {};
            },
         }),
         [questions]
      );

      const update = (id: string, patch: Partial<FlashcardQuestion>) => {
         setQuestionsState((prev) =>
            prev.map((p) => (p._id === id ? { ...p, ...patch } : p))
         );

         // clear related errors
         setErrors((prev) => {
            const copy = { ...prev };
            if (patch.frontText !== undefined) delete copy[`${id}-front`];
            if (patch.backText !== undefined) delete copy[`${id}-back`];
            return copy;
         });

         // update change sets
         const isOriginal = originalIdsRef.current.has(id);
         // get updated question (approximate)
         const updated = (questions.find((q) => q._id === id) ?? {
            _id: id,
            ...patch,
         }) as FlashcardQuestion;
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
            const newQ = emptyQuestion();
            nv.splice(idx, 0, newQ);
            // add to newMap
            newMapRef.current[newQ._id] = { ...newQ };
            return nv.map((q, i) => ({ ...q, order: i + 1 }));
         });
      };

      const remove = (id: string) => {
         setQuestionsState((prev) => {
            const nv = prev.filter((q) => q._id !== id);
            // keep at least minItems or 1
            if (nv.length < Math.max(1, minItems)) return prev;
            return nv.map((q, i) => ({ ...q, order: i + 1 }));
         });

         // if removed item is original, add to deleted list
         if (originalIdsRef.current.has(id)) {
            // only add once
            const already = deletedRef.current.find((d) => d._id === id);
            if (!already) deletedRef.current.push({ _id: id });
            // ensure it's not in edited set
            delete editedMapRef.current[id];
         } else {
            // new item removed: remove from newMapRef
            delete newMapRef.current[id];
         }

         // clear errors related
         setErrors((prev) => {
            const copy = { ...prev };
            delete copy[`${id}-front`];
            delete copy[`${id}-back`];
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
               // update change sets for re-ordered items
               if (originalIdsRef.current.has(nq._id)) {
                  const original = originalMapRef.current[nq._id];
                  if (!shallowEqualQuestion(original, nq))
                     editedMapRef.current[nq._id] = nq;
                  else delete editedMapRef.current[nq._id];
               } else {
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
               if (originalIdsRef.current.has(nq._id)) {
                  const original = originalMapRef.current[nq._id];
                  if (!shallowEqualQuestion(original, nq))
                     editedMapRef.current[nq._id] = nq;
                  else delete editedMapRef.current[nq._id];
               } else {
                  newMapRef.current[nq._id] = nq;
               }
               return nq;
            });
         });
      };

      return (
         <div className="space-y-4">
            {questions.map((q, idx) => (
               <Card key={q._id} className="bg-slate-800/40">
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
                           onClick={() => add(q._id)}
                           className="btn-ghost p-2"
                           title="Add after"
                        >
                           <Plus className="w-4 h-4" />
                        </button>
                        <button
                           type="button"
                           onClick={() => remove(q._id)}
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
                                 update(q._id, { frontText: e.target.value })
                              }
                              placeholder="Mặt trước (ví dụ: thuật ngữ)"
                           />
                           {errors[`${q._id}-front`] && (
                              <div className="text-xs text-red-400 mt-1">
                                 {errors[`${q._id}-front`]}
                              </div>
                           )}
                        </div>

                        <div>
                           <Label>Back</Label>
                           <Input
                              value={q.backText}
                              onChange={(e) =>
                                 update(q._id, { backText: e.target.value })
                              }
                              placeholder="Mặt sau (ví dụ: định nghĩa)"
                           />
                           {errors[`${q._id}-back`] && (
                              <div className="text-xs text-red-400 mt-1">
                                 {errors[`${q._id}-back`]}
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="mt-3">
                        <Label>Explanation (optional)</Label>
                        <Textarea
                           value={q.explanation ?? ""}
                           onChange={(e) =>
                              update(q._id, { explanation: e.target.value })
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
