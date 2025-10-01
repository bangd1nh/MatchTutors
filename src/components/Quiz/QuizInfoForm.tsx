import React, {
   useEffect,
   useState,
   forwardRef,
   useImperativeHandle,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import Switch from "@/components/ui/switch";
import { QuizInfoValues } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { QuizModeEnum } from "@/enums/quiz.enum";

type Props = {
   defaultValues?: Partial<QuizInfoValues>;
};

export type QuizInfoHandle = {
   getValues: () => QuizInfoValues;
   validate?: () => Promise<boolean>;
   reset?: (v?: Partial<QuizInfoValues>) => void;
   setValues?: (v?: Partial<QuizInfoValues>) => void;
};

const QuizInfoForm = forwardRef<QuizInfoHandle, Props>(
   ({ defaultValues }, ref) => {
      const {
         register,
         control,
         watch,
         setValue,
         reset,
         getValues,
         trigger,
         setError,
         clearErrors,
         formState: { errors },
      } = useForm<QuizInfoValues>({
         mode: "onChange",
         defaultValues: {
            settings: {
               shuffleQuestions: false,
               showCorrectAnswersAfterSubmit: true,
               timeLimitMinutes: null,
            },
            tags: [],
            ...defaultValues,
         },
      });

      useEffect(() => {
         if (defaultValues) reset(defaultValues as Partial<QuizInfoValues>);
         // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [defaultValues]);

      // expose imperative handle so parent can call getValues()
      useImperativeHandle(ref, () => ({
         getValues: () => {
            // ensure nested defaults exist
            const vals = getValues() as any;
            return {
               title: vals.title ?? "",
               description: vals.description ?? "",
               quizMode: vals.quizMode ?? QuizModeEnum.STUDY,
               settings: {
                  shuffleQuestions: vals?.settings?.shuffleQuestions ?? false,
                  showCorrectAnswersAfterSubmit:
                     vals?.settings?.showCorrectAnswersAfterSubmit ?? true,
                  timeLimitMinutes: vals?.settings?.timeLimitMinutes ?? null,
               },
               tags: vals.tags ?? [],
               totalQuestions: vals.totalQuestions,
            } as QuizInfoValues;
         },
         validate: async () => {
            // run RHF validation first
            const ok = await trigger();

            // additional checks for tags (no empty strings) and quizMode presence
            const vals = getValues() as any;
            let valid = ok;

            // quizMode must exist
            if (!vals.quizMode) {
               setError("quizMode" as any, {
                  type: "manual",
                  message: "Vui lòng chọn Quiz mode",
               });
               valid = false;
            } else {
               clearErrors("quizMode" as any);
            }

            // tags: no empty values
            if (Array.isArray(vals.tags)) {
               const hasEmpty = vals.tags.some((t: any) => !String(t).trim());
               if (hasEmpty) {
                  setError("tags" as any, {
                     type: "manual",
                     message: "Tags không được để trống",
                  });
                  valid = false;
               } else {
                  clearErrors("tags" as any);
               }
            }

            return valid;
         },
         reset: (v?: Partial<QuizInfoValues>) => reset(v as any),
         // setValues allows parent to update form values programmatically (useful for edit)
         setValues: (v?: Partial<QuizInfoValues>) => {
            if (v) {
               // reset preserves form state but sets new values
               reset({
                  settings: {
                     shuffleQuestions: v.settings?.shuffleQuestions ?? false,
                     showCorrectAnswersAfterSubmit:
                        v.settings?.showCorrectAnswersAfterSubmit ?? true,
                     timeLimitMinutes: v.settings?.timeLimitMinutes ?? null,
                  },
                  tags: v.tags ?? [],
                  title: v.title ?? "",
                  description: v.description ?? "",
                  quizMode: v.quizMode ?? QuizModeEnum.STUDY,
                  totalQuestions: v.totalQuestions,
               } as any);
            } else {
               reset();
            }
         },
      }));

      const [tagInput, setTagInput] = useState("");
      const tags = watch("tags") || [];

      const addTag = (
         e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent
      ) => {
         if (
            (e as React.KeyboardEvent)?.key &&
            (e as React.KeyboardEvent).key !== "Enter"
         )
            return;
         const t = tagInput.trim();
         if (!t) {
            // set error to show feedback
            setError("tags" as any, {
               type: "manual",
               message: "Tag không được rỗng",
            });
            return;
         }
         if (!tags.includes(t)) {
            setValue("tags", [...(tags || []), t], { shouldDirty: true });
            clearErrors("tags" as any);
         }
         setTagInput("");
      };

      const removeTag = (t: string) => {
         setValue(
            "tags",
            (tags || []).filter((x: string) => x !== t),
            { shouldDirty: true }
         );
         clearErrors("tags" as any);
      };

      return (
         <form className="space-y-4 p-3" onSubmit={(e) => e.preventDefault()}>
            <div>
               <Label htmlFor="title">Tiêu đề</Label>
               <Input
                  id="title"
                  {...register("title", { required: "Tiêu đề là bắt buộc" })}
               />
               {errors.title && (
                  <div className="text-xs text-red-400 mt-1">
                     {String(errors.title.message)}
                  </div>
               )}
            </div>

            <div>
               <Label htmlFor="description">Mô tả</Label>
               <Textarea
                  id="description"
                  {...register("description")}
                  rows={3}
               />
               {errors.description && (
                  <div className="text-xs text-red-400 mt-1">
                     {String(errors.description.message)}
                  </div>
               )}
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                  <Label>Quiz mode</Label>
                  <Controller
                     name="quizMode"
                     control={control}
                     rules={{ required: "Vui lòng chọn Quiz mode" }}
                     render={({ field }) => (
                        <Select
                           onValueChange={field.onChange}
                           value={field.value}
                        >
                           <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn mode" />
                           </SelectTrigger>
                           <SelectContent>
                              {Object.values(QuizModeEnum).map((m) => (
                                 <SelectItem key={m} value={m}>
                                    {m}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     )}
                  />
                  {errors.quizMode && (
                     <div className="text-xs text-red-400 mt-1">
                        {String(errors.quizMode.message)}
                     </div>
                  )}
               </div>
            </div>

            <div className="flex items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div>
                     <div className="text-sm">Shuffle questions</div>
                     <div className="text-xs text-muted-foreground">
                        Dùng cho flashcard
                     </div>
                  </div>
                  <Controller
                     name="settings.shuffleQuestions"
                     control={control}
                     render={({ field }) => (
                        <Switch
                           checked={Boolean(field.value)}
                           onCheckedChange={(v) => field.onChange(Boolean(v))}
                        />
                     )}
                  />
               </div>

               <div className="flex items-center gap-3">
                  <div>
                     <div className="text-sm">Show answers after submit</div>
                  </div>
                  <Controller
                     name="settings.showCorrectAnswersAfterSubmit"
                     control={control}
                     render={({ field }) => (
                        <Switch
                           checked={Boolean(field.value)}
                           onCheckedChange={(v) => field.onChange(Boolean(v))}
                        />
                     )}
                  />
               </div>
            </div>

            <div>
               <Label>Tags</Label>
               <div className="flex gap-2">
                  <Input
                     className="flex-1"
                     value={tagInput}
                     onChange={(e) => setTagInput(e.target.value)}
                     onKeyDown={addTag}
                     placeholder="Nhập tag và Enter"
                  />
                  <Button type="button" onClick={addTag}>
                     Thêm
                  </Button>
               </div>
               <div className="mt-2 flex flex-wrap gap-2">
                  {(tags || []).map((t: string) => (
                     <span
                        key={t}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700 text-white text-sm"
                     >
                        {t}
                        <button
                           type="button"
                           onClick={() => removeTag(t)}
                           className="ml-2 text-xs opacity-80"
                        >
                           ×
                        </button>
                     </span>
                  ))}
               </div>
               {errors.tags && (
                  <div className="text-xs text-red-400 mt-1">
                     {String(errors.tags.message)}
                  </div>
               )}
            </div>
         </form>
      );
   }
);

export default QuizInfoForm;
