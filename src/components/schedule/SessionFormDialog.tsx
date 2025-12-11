import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
   useCreateBatchSessions,
   useUpdateSession,
   useMySessions,
} from "@/hooks/useSessions";
import { useActiveLearningCommitmentsByTutor } from "@/hooks/useLearningCommitment";
import { Session } from "@/types/session";
import { SessionStatus } from "@/enums/session.enum";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Clock } from "lucide-react";
import { getSubjectLabelVi } from "@/utils/educationDisplay";
import { addDays, startOfWeek, isSameDay } from "date-fns";

const DAYS_OF_WEEK = [
   { value: 1, label: "Thứ 2" },
   { value: 2, label: "Thứ 3" },
   { value: 3, label: "Thứ 4" },
   { value: 4, label: "Thứ 5" },
   { value: 5, label: "Thứ 6" },
   { value: 6, label: "Thứ 7" },
   { value: 0, label: "Chủ nhật" },
];

const baseSchema = z.object({
   learningCommitmentId: z.string().min(1, "Vui lòng chọn một cam kết học."),
   startTime: z.date(),
   endTime: z.date(),
   location: z.string().min(1, "Vui lòng nhập địa điểm."),
   notes: z.string().optional(),
   additionalDays: z.array(z.number()),
});

type SessionFormValues = z.infer<typeof baseSchema>;

interface SessionFormDialogProps {
   isOpen: boolean;
   onClose: () => void;
   initialData?: Partial<Session> | null;
   defaultDate?: Date;
}

export const SessionFormDialog = ({
   isOpen,
   onClose,
   initialData,
   defaultDate,
}: SessionFormDialogProps) => {
   const isEditMode = !!initialData?._id;

   const { data: commitments } = useActiveLearningCommitmentsByTutor();
   const { data: allSessions } = useMySessions();
   const createBatchMutation = useCreateBatchSessions();
   const updateSessionMutation = useUpdateSession();

   const [currentLimit, setCurrentLimit] = useState<number>(999);

   // DYNAMIC SCHEMA ---
   const formSchema = useMemo(() => {
      return baseSchema.superRefine((data, ctx) => {
         if (data.endTime <= data.startTime) {
            ctx.addIssue({
               code: z.ZodIssueCode.custom,
               message: "Thời gian kết thúc phải sau bắt đầu.",
               path: ["endTime"],
            });
         }

         if (!isEditMode) {
            const totalRequested = 1 + data.additionalDays.length;
            if (totalRequested > currentLimit) {
               ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: `Bạn chỉ còn ${currentLimit} buổi. Đã chọn ${totalRequested}.`,
                  path: ["additionalDays"],
               });
            }
         }
      });
   }, [currentLimit, isEditMode]);

   const form = useForm<SessionFormValues>({
      resolver: zodResolver(formSchema),

      defaultValues: {
         learningCommitmentId: "",
         location: "",
         notes: "",
         startTime: new Date(),
         endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
         additionalDays: [],
      },
   });

   const watchedCommitmentId = form.watch("learningCommitmentId");

   // --- TÍNH TOÁN LIMIT ---
   useEffect(() => {
      if (!watchedCommitmentId || !commitments || !allSessions) return;

      const commitment = commitments.find(
         (c: any) => c._id === watchedCommitmentId
      );
      if (!commitment) return;

      const total = commitment.totalSessions || 0;
      const completed = commitment.completedSessions || 0;

      const PENDING_STATUSES = [
         SessionStatus.SCHEDULED,
         SessionStatus.CONFIRMED,
         SessionStatus.DISPUTED,
      ] as string[];

      const pendingCount = allSessions.filter((s) => {
         const sCommitmentId =
            typeof s.learningCommitmentId === "string"
               ? s.learningCommitmentId
               : s.learningCommitmentId?._id;

         if (sCommitmentId !== watchedCommitmentId) return false;
         return PENDING_STATUSES.includes(s.status as string);
      }).length;

      const remaining = Math.max(0, total - completed - pendingCount);
      setCurrentLimit(remaining);
   }, [watchedCommitmentId, commitments, allSessions]);

   useEffect(() => {
      if (isOpen) {
         if (initialData) {
            form.reset({
               learningCommitmentId:
                  (initialData as any).learningCommitmentId?._id ||
                  (initialData as any).learningCommitmentId ||
                  "",
               startTime: initialData.startTime
                  ? new Date(initialData.startTime)
                  : new Date(),
               endTime: initialData.endTime
                  ? new Date(initialData.endTime)
                  : new Date(),
               location: initialData.location || "",
               notes: (initialData as any).notes || "",
               additionalDays: [],
            });
         } else {
            const start = defaultDate || new Date();
            form.reset({
               learningCommitmentId: "",
               location: "",
               notes: "",
               startTime: start,
               endTime: new Date(start.getTime() + 60 * 60 * 1000),
               additionalDays: [],
            });
         }
      }
   }, [initialData, defaultDate, isOpen, form]);

   const onSubmit = async (values: SessionFormValues) => {
      try {
         if (isEditMode && initialData?._id) {
            await updateSessionMutation.mutateAsync({
               sessionId: initialData._id,
               payload: {
                  startTime: values.startTime.toISOString(),
                  endTime: values.endTime.toISOString(),
                  location: values.location,
                  notes: values.notes,
               },
            });
         } else {
            const sessionsToCreate = [
               {
                  startTime: values.startTime.toISOString(),
                  endTime: values.endTime.toISOString(),
               },
            ];

            const start = values.startTime;
            const end = values.endTime;
            const startOfCurrentWeek = startOfWeek(start, { weekStartsOn: 1 });

            values.additionalDays.forEach((targetDayOfWeek) => {
               for (let d = 0; d < 7; d++) {
                  const dateCheck = addDays(startOfCurrentWeek, d);
                  if (
                     dateCheck.getDay() === targetDayOfWeek &&
                     !isSameDay(dateCheck, start)
                  ) {
                     const newStart = new Date(dateCheck);
                     newStart.setHours(
                        start.getHours(),
                        start.getMinutes(),
                        0,
                        0
                     );

                     const newEnd = new Date(dateCheck);
                     newEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);

                     sessionsToCreate.push({
                        startTime: newStart.toISOString(),
                        endTime: newEnd.toISOString(),
                     });
                     break;
                  }
               }
            });

            await createBatchMutation.mutateAsync({
               learningCommitmentId: values.learningCommitmentId,
               location: values.location,
               notes: values.notes,
               sessions: sessionsToCreate,
            });
         }
         onClose();
      } catch (error) {
         console.error("Lỗi submit form:", error);
      }
   };

   const isLoading =
      createBatchMutation.isPending || updateSessionMutation.isPending;

   const formatDateForInput = (date: Date) => {
      if (!date || isNaN(date.getTime())) return "";
      const offset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offset);
      return localDate.toISOString().slice(0, 16);
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card text-card-foreground">
            <DialogHeader>
               <DialogTitle>
                  {isEditMode ? "Chỉnh sửa buổi học" : "Tạo buổi học"}
               </DialogTitle>
               <DialogDescription>
                  {isEditMode
                     ? "Cập nhật thông tin buổi học."
                     : "Bạn có thể tạo một hoặc nhiều buổi học trong cùng một tuần."}
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between items-center">
                     <Label>Cam kết học</Label>
                     {watchedCommitmentId && !isEditMode && (
                        <span
                           className={`text-xs font-bold ${
                              currentLimit <= 0
                                 ? "text-destructive"
                                 : "text-primary"
                           }`}
                        >
                           Còn lại: {currentLimit} buổi
                        </span>
                     )}
                  </div>
                  <Controller
                     name="learningCommitmentId"
                     control={form.control}
                     render={({ field }) => (
                        <Select
                           onValueChange={field.onChange}
                           value={field.value}
                           disabled={isEditMode}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Chọn cam kết..." />
                           </SelectTrigger>
                           <SelectContent>
                              {commitments
                                 ?.filter((c: any) => c.status === "active")
                                 .map((c: any) => (
                                    <SelectItem key={c._id} value={c._id}>
                                       {getSubjectLabelVi(
                                          c.teachingRequest?.subject
                                       )}{" "}
                                       - {c.student?.userId?.name ?? "Học sinh"}
                                    </SelectItem>
                                 ))}
                           </SelectContent>
                        </Select>
                     )}
                  />
                  {form.formState.errors.learningCommitmentId && (
                     <p className="text-sm text-destructive">
                        {form.formState.errors.learningCommitmentId.message}
                     </p>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Bắt đầu</Label>
                     <Controller
                        name="startTime"
                        control={form.control}
                        render={({ field }) => (
                           <Input
                              type="datetime-local"
                              value={formatDateForInput(field.value)}
                              onChange={(e) => {
                                 const d = new Date(e.target.value);
                                 if (!isNaN(d.getTime())) field.onChange(d);
                              }}
                           />
                        )}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Kết thúc</Label>
                     <Controller
                        name="endTime"
                        control={form.control}
                        render={({ field }) => (
                           <Input
                              type="datetime-local"
                              value={formatDateForInput(field.value)}
                              onChange={(e) => {
                                 const d = new Date(e.target.value);
                                 if (!isNaN(d.getTime())) field.onChange(d);
                              }}
                           />
                        )}
                     />
                  </div>
               </div>
               {(form.formState.errors.startTime ||
                  form.formState.errors.endTime) && (
                  <p className="text-sm text-destructive">
                     Thời gian kết thúc phải sau thời gian bắt đầu.
                  </p>
               )}

               <div className="space-y-2">
                  <Label>Địa điểm</Label>
                  <Input
                     {...form.register("location")}
                     placeholder="Google Meet / Zoom / Địa chỉ..."
                  />
                  {form.formState.errors.location && (
                     <p className="text-sm text-destructive">
                        {form.formState.errors.location.message}
                     </p>
                  )}
               </div>

               {!isEditMode && (
                  <div className="p-4 border rounded-md bg-muted/20 space-y-3">
                     <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">
                           Lặp lại trong cùng tuần (Cùng giờ)
                        </span>
                     </div>

                     {currentLimit <= 1 ? (
                        <p className="text-xs text-muted-foreground italic">
                           Không đủ số buổi còn lại để tạo thêm.
                        </p>
                     ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                           {DAYS_OF_WEEK.map((day) => {
                              const start = form.watch("startTime");
                              const isCurrentDay =
                                 start && start.getDay() === day.value;

                              return (
                                 <div
                                    key={day.value}
                                    className="flex items-center space-x-2"
                                 >
                                    <Controller
                                       name="additionalDays"
                                       control={form.control}
                                       render={({ field }) => {
                                          const checked = field.value?.includes(
                                             day.value
                                          );
                                          return (
                                             <Checkbox
                                                id={`day-${day.value}`}
                                                checked={checked}
                                                disabled={isCurrentDay}
                                                onCheckedChange={(
                                                   isChecked
                                                ) => {
                                                   if (isChecked) {
                                                      field.onChange([
                                                         ...field.value,
                                                         day.value,
                                                      ]);
                                                   } else {
                                                      field.onChange(
                                                         field.value.filter(
                                                            (v) =>
                                                               v !== day.value
                                                         )
                                                      );
                                                   }
                                                }}
                                             />
                                          );
                                       }}
                                    />
                                    <label
                                       htmlFor={`day-${day.value}`}
                                       className={`text-sm cursor-pointer ${
                                          isCurrentDay
                                             ? "font-bold text-primary"
                                             : "font-medium"
                                       }`}
                                    >
                                       {day.label} {isCurrentDay && "(Gốc)"}
                                    </label>
                                 </div>
                              );
                           })}
                        </div>
                     )}
                     {form.formState.errors.additionalDays && (
                        <p className="text-sm text-destructive mt-1">
                           {form.formState.errors.additionalDays.message}
                        </p>
                     )}
                  </div>
               )}

               <div className="space-y-2">
                  <Label>Ghi chú</Label>
                  <Textarea
                     {...form.register("notes")}
                     placeholder="Nội dung bài học, dặn dò..."
                  />
               </div>

               <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                     Hủy
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                     {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     )}
                     {isEditMode
                        ? "Lưu thay đổi"
                        : `Tạo ${
                             1 + (form.watch("additionalDays")?.length || 0)
                          } buổi học`}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};
