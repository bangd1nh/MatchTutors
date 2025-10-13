import React, { forwardRef, useImperativeHandle, useRef, memo } from "react";
import {
   useForm,
   useFieldArray,
   Control,
   UseFormRegister,
   UseFormSetValue,
   UseFormWatch,
   UseFormGetValues,
   Controller,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { QuestionTypeEnum } from "@/enums/quiz.enum";
import { MultipleChoiceQuestions } from "@/types/quiz";
import { useMultipleChoiceQuizStore } from "@/store/useMultipleChoiceQuizStore";

const MCQSchema = z
   .object({
      _id: z.string().optional(),
      order: z.number().int().nonnegative().optional(),
      questionType: z.literal(QuestionTypeEnum.MULTIPLE_CHOICE),
      questionText: z.string().min(1, "Question text is required"),
      options: z
         .array(z.string().min(1, "Option text is required"))
         .min(2, "At least 2 options are required"),
      correctAnswer: z.string().min(1, "Correct answer is required"),
      explanation: z.string().optional(),
      points: z.number().int().nonnegative().optional(),
   })
   .superRefine((data, ctx) => {
      if (!data.options.includes(data.correctAnswer)) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["correctAnswer"],
            message: "Correct answer must be one of the options",
         });
      }
   });

const FormSchema = z.object({
   questions: z.array(MCQSchema).min(1, "At least one question is required"),
});

type FormValues = z.infer<typeof FormSchema>;

const defaultOption = (): string => "";

const defaultQuestion = (): FormValues["questions"][number] => ({
   _id: undefined,
   order: undefined,
   questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
   questionText: "",
   options: ["", ""],
   correctAnswer: "",
   explanation: "",
   points: 0,
});

export type MultipleChoiceQuestionsFormHandle = {
   validate: () => Promise<{ valid: boolean; errors?: Record<string, string> }>;
   reset?: (questions?: MultipleChoiceQuestions[]) => void;
};

type OptionsEditorProps = {
   control: Control<FormValues>;
   register: UseFormRegister<FormValues>;
   setValue: UseFormSetValue<FormValues>;
   watch: UseFormWatch<FormValues>;
   getValues: UseFormGetValues<FormValues>;
   qIndex: number;
   defaultOption: () => FormValues["questions"][number]["options"][number];
};

const OptionsEditorBase: React.FC<OptionsEditorProps> = ({
   control,
   register,
   watch,
   qIndex,
   defaultOption,
}) => {
   const name = `questions.${qIndex}.options` as const;
   const {
      fields: opts,
      append: appendOpt,
      remove: removeOpt,
   } = useFieldArray({ control, name: name as any });

   // subscribe to options array so UI updates when option text changes
   const options = (watch(`questions.${qIndex}.options`) as string[]) ?? [];

   return (
      <div className="space-y-2">
         <Controller
            control={control}
            name={`questions.${qIndex}.correctAnswer` as const}
            render={({ field }) => {
               const current = field.value ?? "";
               return (
                  <>
                     {opts.map((opt, oi) => {
                        const optVal = options[oi] ?? "";
                        return (
                           <div
                              key={opt.id}
                              className="flex items-center gap-2"
                           >
                              <input
                                 type="radio"
                                 name={`questions.${qIndex}.correctAnswer`}
                                 aria-label={`questions.${qIndex}.correctAnswer`}
                                 checked={current === optVal && optVal !== ""}
                                 onChange={() => field.onChange(optVal)}
                              />

                              <Input
                                 {...register(
                                    `questions.${qIndex}.options.${oi}` as const,
                                    {
                                       onChange: (e) => {
                                          const newVal = e.target.value;
                                          // if this option is currently selected, keep correctAnswer synced
                                          if (current === (options[oi] ?? "")) {
                                             // update controller value to new text
                                             field.onChange(newVal);
                                          }
                                       },
                                    }
                                 )}
                                 placeholder={`Option ${oi + 1}`}
                                 defaultValue={options[oi] ?? ""}
                              />

                              <button
                                 type="button"
                                 onClick={() => removeOpt(oi)}
                                 className="btn-ghost p-2 text-red-500"
                                 title="Remove option"
                              >
                                 <Trash className="w-4 h-4" />
                              </button>
                           </div>
                        );
                     })}
                  </>
               );
            }}
         />

         <div className="flex gap-2">
            <Button
               variant="outline"
               type="button"
               onClick={() => appendOpt(defaultOption())}
            >
               <Plus className="mr-2 w-4 h-4" /> Add option
            </Button>
         </div>
      </div>
   );
};

const OptionsEditor = memo(OptionsEditorBase);

const MultipleChoiceQuizQuestionForm =
   forwardRef<MultipleChoiceQuestionsFormHandle>((_, ref) => {
      const storeQuestions = useMultipleChoiceQuizStore((s) => s.quizQuestion);
      const addQuestion = useMultipleChoiceQuizStore((s) => s.addQuestion);
      const resetQuestionsInStore = useMultipleChoiceQuizStore(
         (s) => s.resetMultipleChoiceQuizQuestion
      );

      const initialQuestions = (
         Array.isArray(storeQuestions) && storeQuestions.length
            ? storeQuestions
            : [defaultQuestion()]
      ).map((q: any, i: number) => ({
         _id: q._id ?? undefined,
         order: q.order ?? i + 1,
         questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
         questionText: q.questionText ?? "",
         options: q.options ?? ["", ""],
         correctAnswer: q.correctAnswer ?? "",
         explanation: q.explanation ?? "",
         points: q.points ?? 0,
      })) as FormValues["questions"];

      const {
         control,
         register,
         getValues,
         trigger,
         reset,
         setValue,
         watch,
         formState,
      } = useForm<FormValues>({
         resolver: zodResolver(FormSchema),
         mode: "onChange",
         defaultValues: { questions: initialQuestions },
      });

      const {
         fields: questions,
         append,
         remove,
         insert,
         move,
      } = useFieldArray({
         control,
         name: "questions",
      });

      const lastSerializedRef = useRef<string | null>(null);

      // update order inputs to match current index + 1
      const updateOrders = () => {
         const vals = getValues();
         const qs = (vals.questions || []) as any[];
         qs.forEach((_, i) => {
            setValue(`questions.${i}.order` as const, i + 1, {
               shouldValidate: false,
               shouldDirty: true,
            });
         });
      };

      const appendQuestion: any = (q?: FormValues["questions"][number]) => {
         append(q ?? defaultQuestion());
         setTimeout(updateOrders, 0);
      };

      const insertQuestion = (
         index: number,
         q?: FormValues["questions"][number]
      ) => {
         insert(index, q ?? defaultQuestion());
         setTimeout(updateOrders, 0);
      };
      const moveQuestion = (from: number, to: number) => {
         move(from, to);
         setTimeout(updateOrders, 0);
      };
      const removeQuestion = (index: number) => {
         remove(index);
         setTimeout(updateOrders, 0);
      };

      useImperativeHandle(
         ref,
         () => ({
            validate: async () => {
               const ok = await trigger();
               if (!ok) {
                  return { valid: false, errors: {} };
               }
               const vals = getValues();
               const parsed = FormSchema.safeParse(vals);
               const errors: Record<string, string> = {};
               if (!parsed.success) {
                  parsed.error.issues.forEach((issue) => {
                     const path = issue.path.join(".");
                     const key = path ? `questions.${path}` : "form";
                     errors[key] = issue.message;
                  });
                  return { valid: false, errors };
               }

               // normalized payload
               const normalized = parsed.data.questions.map((q) => ({
                  _id: q._id,
                  order: q.order,
                  questionType: q.questionType,
                  questionText: q.questionText,
                  options: q.options,
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation,
                  points: q.points,
               })) as unknown as MultipleChoiceQuestions[];

               const serialized = JSON.stringify(normalized);
               if (lastSerializedRef.current !== serialized) {
                  lastSerializedRef.current = serialized;
                  resetQuestionsInStore();
                  normalized.forEach((q) => addQuestion(q));
               }

               return { valid: true };
            },

            reset: (qs?: MultipleChoiceQuestions[]) => {
               const src = qs && qs.length ? qs : [defaultQuestion()];
               const normalized = src.map((q: any, i: number) => ({
                  _id: q._id ?? undefined,
                  order: q.order ?? i + 1,
                  questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
                  questionText: q.questionText ?? "",
                  options: q.options ?? ["", ""],
                  correctAnswer: q.correctAnswer ?? "",
                  explanation: q.explanation ?? "",
                  points: q.points ?? 0,
               })) as FormValues["questions"];
               reset({ questions: normalized });
               lastSerializedRef.current = null;
            },
         }),
         [getValues, trigger, reset, addQuestion, resetQuestionsInStore]
      );

      const handleAddQuestion = () => appendQuestion(defaultQuestion());

      // compute total points live
      const watched = watch("questions") || [];
      const totalPoints = watched.reduce(
         (s: number, q: any) => s + (Number(q?.points) || 0),
         0
      );

      return (
         <div className="space-y-4">
            {questions.map((q, idx) => (
               <Card key={q.id} className="bg-slate-800/40">
                  <CardHeader className="flex items-center justify-between py-2 px-4">
                     <CardTitle className="text-sm">
                        Question #{idx + 1}
                     </CardTitle>
                     <div className="flex items-center gap-2">
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={() =>
                              insertQuestion(idx + 1, defaultQuestion())
                           }
                        >
                           Add below
                        </Button>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={() =>
                              moveQuestion(idx, Math.max(0, idx - 1))
                           }
                        >
                           ↑
                        </Button>
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={() =>
                              moveQuestion(
                                 idx,
                                 Math.min(questions.length - 1, idx + 1)
                              )
                           }
                        >
                           ↓
                        </Button>
                        <Button
                           variant="destructive"
                           size="sm"
                           onClick={() => removeQuestion(idx)}
                        >
                           <Trash className="w-4 h-4" />
                        </Button>
                     </div>
                  </CardHeader>

                  <CardContent className="p-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <Label>Points</Label>
                           <Input
                              type="number"
                              {...register(`questions.${idx}.points` as const, {
                                 valueAsNumber: true,
                              })}
                              placeholder="Points"
                           />
                           {formState.errors.questions?.[idx]?.points && (
                              <div className="text-xs text-red-400 mt-1">
                                 {String(
                                    (formState.errors.questions as any)[idx]
                                       .points?.message
                                 )}
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="mt-3">
                        <Label>Question</Label>
                        <Input
                           {...register(
                              `questions.${idx}.questionText` as const
                           )}
                           placeholder="Question text"
                        />
                        {formState.errors.questions?.[idx]?.questionText && (
                           <div className="text-xs text-red-400 mt-1">
                              {String(
                                 (formState.errors.questions as any)[idx]
                                    .questionText?.message
                              )}
                           </div>
                        )}
                     </div>

                     <div className="mt-3">
                        <Label>Options (min 2, select exactly 1 correct)</Label>
                        <OptionsEditor
                           control={control}
                           register={register}
                           setValue={setValue}
                           watch={watch}
                           qIndex={idx}
                           getValues={getValues}
                           defaultOption={defaultOption}
                        />
                        {formState.errors.questions?.[idx]?.correctAnswer && (
                           <div className="text-xs text-red-400 mt-1">
                              {String(
                                 (formState.errors.questions as any)[idx]
                                    .correctAnswer?.message
                              )}
                           </div>
                        )}
                        {formState.errors.questions?.[idx]?.options && (
                           <div className="text-xs text-red-400 mt-1">
                              {String(
                                 (formState.errors.questions as any)[idx]
                                    .options?.message
                              )}
                           </div>
                        )}
                     </div>

                     <div className="mt-3">
                        <Label>Explanation (optional)</Label>
                        <Textarea
                           {...register(
                              `questions.${idx}.explanation` as const
                           )}
                           rows={3}
                        />
                     </div>
                  </CardContent>
               </Card>
            ))}

            <div className="flex items-center justify-between">
               <div className="text-sm font-medium">
                  Total points: {totalPoints}
               </div>
               <div>
                  <Button onClick={handleAddQuestion} variant="outline">
                     <Plus className="mr-2 w-4 h-4" /> Add question
                  </Button>
               </div>
            </div>
         </div>
      );
   });

MultipleChoiceQuizQuestionForm.displayName = "MultipleChoiceQuizQuestionForm";

export default MultipleChoiceQuizQuestionForm;
