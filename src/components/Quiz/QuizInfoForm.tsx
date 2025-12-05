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
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "../ui/tooltip";
import { InfoIcon } from "lucide-react";

type Props = {
   defaultValues?: Partial<QuizInfoValues>;
   isFlashcard?: boolean;
};

export type QuizInfoHandle = {
   getValues: () => QuizInfoValues;
   validate?: () => Promise<boolean>;
   reset?: (v?: Partial<QuizInfoValues>) => void;
   setValues?: (v?: Partial<QuizInfoValues>) => void;
};

const QuizInfoForm = forwardRef<QuizInfoHandle, Props>(
   ({ defaultValues, isFlashcard = false }, ref) => {
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
            quizMode: isFlashcard ? QuizModeEnum.STUDY : QuizModeEnum.EXAM,
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
         if (isFlashcard) {
            setValue("quizMode", QuizModeEnum.STUDY);
         } else {
            setValue("quizMode", QuizModeEnum.EXAM);
         }
      }, [isFlashcard, setValue]);

      useEffect(() => {
         if (defaultValues) {
            // Override with EXAM if isFlashcard, otherwise use provided value
            const quizMode = isFlashcard
               ? QuizModeEnum.STUDY
               : QuizModeEnum.EXAM;

            reset({
               ...defaultValues,
               quizMode,
            } as Partial<QuizInfoValues>);
         }
         // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [defaultValues, isFlashcard]);

      // expose imperative handle so parent can call getValues()
      useImperativeHandle(ref, () => ({
         getValues: () => {
            // ensure nested defaults exist
            const vals = getValues() as any;
            let quizMode = vals.quizMode;

            // Chỉ gán EXAM làm mặc định cho flashcard
            if (isFlashcard) {
               quizMode = QuizModeEnum.STUDY;
            } else if (!quizMode) {
               quizMode = QuizModeEnum.EXAM; // Chỉ fallback khi undefined
            }

            return {
               title: vals.title ?? "",
               description: vals.description ?? "",
               quizMode: isFlashcard ? QuizModeEnum.STUDY : QuizModeEnum.EXAM, // Sử dụng giá trị đã xử lý
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
            if (!isFlashcard && !vals.quizMode) {
               vals.quizMode = QuizModeEnum.EXAM;
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
                  quizMode: isFlashcard
                     ? QuizModeEnum.STUDY
                     : v.quizMode ?? QuizModeEnum.EXAM,
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
                     // rules={{ required: "Vui lòng chọn Quiz mode" }}
                     render={({ field }) => (
                        <Select
                           onValueChange={field.onChange}
                           value={
                              isFlashcard
                                 ? QuizModeEnum.STUDY
                                 : QuizModeEnum.EXAM
                           }
                           defaultValue={
                              isFlashcard
                                 ? QuizModeEnum.STUDY
                                 : QuizModeEnum.EXAM
                           }
                           disabled={true}
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

            <div className="flex items-center justify-between gap-4 ">
               <div className="flex items-center gap-3 flex-shrink-0">
                  <div>
                     <div className="text-sm">Xáo trộn câu hỏi</div>
                     <div className="text-xs text-muted-foreground">
                        Dùng cho flashcard
                     </div>
                  </div>
                  <Controller
                     name="settings.shuffleQuestions"
                     control={control}
                     render={({ field }) => (
                        <Switch
                           disabled={!isFlashcard}
                           checked={Boolean(field.value)}
                           onCheckedChange={(v) => field.onChange(Boolean(v))}
                        />
                     )}
                  />
               </div>

               <div className="flex items-center gap-3 w-full">
                  <Label
                     htmlFor="timeLimit"
                     className="flex items-center gap-2 flex-shrink-0"
                  >
                     <div className="flex flex-col ">
                        <div className="text-sm">Giới hạn thời gian(phút)</div>
                        <div className="text-xs text-muted-foreground">
                           Dùng cho trắc nghiệm
                        </div>
                     </div>

                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <button type="button" className="ml-1 p-0">
                                 <InfoIcon className="h-4 w-4 text-muted-foreground" />
                              </button>
                           </TooltipTrigger>
                           <TooltipContent
                              side="left"
                              align="center"
                              sideOffset={4}
                              className="whitespace-nowrap"
                           >
                              <p>Để trống nếu không giới hạn thời gian</p>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                  </Label>

                  <Controller
                     name="settings.timeLimitMinutes"
                     control={control}
                     render={({ field }) => (
                        <Input
                           id="timeLimit"
                           type="number"
                           min="0"
                           placeholder="Không giới hạn"
                           className="w-full"
                           disabled={isFlashcard}
                           value={field.value === null ? "" : field.value}
                           onChange={(e) => {
                              const value =
                                 e.target.value === ""
                                    ? null
                                    : Math.max(
                                         0,
                                         parseInt(e.target.value) || 0
                                      );
                              field.onChange(value);
                           }}
                        />
                     )}
                  />
               </div>

               <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="">
                     <div className="text-sm">Xem đáp án sau khi nộp</div>
                     <div className="text-xs text-muted-foreground">
                        Dùng cho trắc nghiệm
                     </div>
                  </div>
                  <Controller
                     name="settings.showCorrectAnswersAfterSubmit"
                     control={control}
                     render={({ field }) => (
                        <Switch
                           disabled={isFlashcard}
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
