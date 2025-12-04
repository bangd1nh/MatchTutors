import { useForm, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
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
import { useCreateSession, useUpdateSession } from "@/hooks/useSessions";
import { useActiveLearningCommitmentsByTutor } from "@/hooks/useLearningCommitment";
import { Session } from "@/types/session";
import { SessionStatus } from "@/enums/session.enum";
import { useEffect } from "react";
import { Loader2, Calendar, MapPin, BookOpen } from "lucide-react";
import { getSubjectLabelVi } from "@/utils/educationDisplay";

const sessionFormSchema = z
   .object({
      learningCommitmentId: z.string().min(1, "Vui lòng chọn một cam kết học."),
      startTime: z.date({ error: "Thời gian bắt đầu không hợp lệ." }),
      endTime: z.date({ error: "Thời gian kết thúc không hợp lệ." }),
      location: z.string().min(1, "Vui lòng nhập địa điểm."),
      notes: z.string().optional(),
   })
   .refine((data) => data.endTime > data.startTime, {
      message: "Thời gian kết thúc phải sau thời gian bắt đầu.",
      path: ["endTime"],
   });

type SessionFormValues = z.infer<typeof sessionFormSchema>;

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
   const { data: commitments, isLoading: isLoadingCommitments } =
      useActiveLearningCommitmentsByTutor();
   const createSessionMutation = useCreateSession();
   const updateSessionMutation = useUpdateSession();

   const validCommitments = commitments?.filter(
      (c: any) => c?.status === "active"
   );

   const form = useForm<SessionFormValues>({
      resolver: zodResolver(
         sessionFormSchema
      ) as unknown as Resolver<SessionFormValues>,
      defaultValues: {
         learningCommitmentId: "",
         location: "",
         notes: "",
         startTime: new Date(),
         endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
      },
   });

   useEffect(() => {
      if (initialData) {
         form.reset({
            learningCommitmentId:
               (initialData as any).learningCommitmentId?._id ||
               (initialData as any).learningCommitmentId,
            startTime: initialData.startTime
               ? new Date(initialData.startTime)
               : defaultDate || new Date(),
            endTime: initialData.endTime
               ? new Date(initialData.endTime)
               : new Date(
                    (defaultDate || new Date()).getTime() + 60 * 60 * 1000
                 ),
            location: initialData.location || "",
            notes: (initialData as any).notes || "",
         });
      } else {
         form.reset({
            learningCommitmentId: "",
            location: "",
            notes: "",
            startTime: defaultDate || new Date(),
            endTime: new Date(
               (defaultDate || new Date()).getTime() + 60 * 60 * 1000
            ),
         });
      }
   }, [initialData, defaultDate, form]);

   const onSubmit = async (values: SessionFormValues) => {
      try {
         const payload = {
            learningCommitmentId: values.learningCommitmentId,
            startTime: values.startTime.toISOString(),
            endTime: values.endTime.toISOString(),
            location: values.location,
            notes: values.notes,
            status: SessionStatus.SCHEDULED,
         };

         if (isEditMode && initialData?._id) {
            await updateSessionMutation.mutateAsync({
               sessionId: initialData._id,
               payload,
            });
         } else {
            await createSessionMutation.mutateAsync(payload);
         }

         onClose();
      } catch (error) {
         console.error("Form submission error:", error);
      }
   };

   const isLoading =
      createSessionMutation.isPending || updateSessionMutation.isPending;

   // util: format date for datetime-local
   const formatDateForInput = (date: Date) => {
      if (!date || isNaN(date.getTime())) return "";
      const localDate = new Date(
         date.getTime() - date.getTimezoneOffset() * 60000
      );
      return localDate.toISOString().slice(0, 16);
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border shadow-xl">
            <DialogHeader className="pb-4">
               <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-foreground">
                  <Calendar className="h-6 w-6 text-primary" />
                  {isEditMode ? "Chỉnh sửa buổi học" : "Tạo buổi học mới"}
               </DialogTitle>
               <DialogDescription className="text-muted-foreground">
                  Điền thông tin chi tiết cho buổi học của bạn.
               </DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               {/* Cam kết học */}
               <div className="space-y-2">
                  <Label
                     htmlFor="learningCommitmentId"
                     className="text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                     <BookOpen className="h-4 w-4 text-primary" />
                     Cam kết học
                  </Label>
                  <Controller
                     name="learningCommitmentId"
                     control={form.control}
                     render={({ field }) => (
                        <Select
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                           disabled={isLoadingCommitments || isEditMode}
                        >
                           <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn cam kết học..." />
                           </SelectTrigger>
                           <SelectContent>
                              {isLoadingCommitments ? (
                                 <SelectItem value="loading" disabled>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Đang tải...
                                 </SelectItem>
                              ) : validCommitments && validCommitments.length > 0 ? (
                                 validCommitments.map((c: any) => (
                                    <SelectItem key={c._id} value={c._id}>
                                       <div className="flex flex-col">
                                          <span className="font-medium text-gray-800">
                                             {getSubjectLabelVi(
                                                c.teachingRequest?.subject ??
                                                   "Môn học"
                                             )}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                             {c.student?.userId?.email ?? "Email"}
                                          </span>
                                       </div>
                                    </SelectItem>
                                 ))
                              ) : (
                                 <SelectItem value="empty" disabled>
                                    Không có cam kết học nào
                                 </SelectItem>
                              )}
                           </SelectContent>
                        </Select>
                     )}
                  />
                  {form.formState.errors.learningCommitmentId && (
                     <p className="text-sm text-destructive flex items-center gap-1">
                        <span>⚠️</span>
                        {form.formState.errors.learningCommitmentId.message}
                     </p>
                  )}
               </div>

               {/* Thời gian */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label
                        htmlFor="startTime"
                        className="text-sm font-semibold text-foreground flex items-center gap-2"
                     >
                        <Calendar className="h-4 w-4 text-primary" />
                        Thời gian bắt đầu
                     </Label>
                     <Controller
                        name="startTime"
                        control={form.control}
                        render={({ field }) => (
                           <Input
                              type="datetime-local"
                              value={formatDateForInput(field.value)}
                              onChange={(e) => {
                                 const newDate = new Date(e.target.value);
                                 if (!isNaN(newDate.getTime())) {
                                    field.onChange(newDate);
                                 }
                              }}
                           />
                        )}
                     />
                     {form.formState.errors.startTime && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                           <span>⚠️</span>
                           {form.formState.errors.startTime.message}
                        </p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label
                        htmlFor="endTime"
                        className="text-sm font-semibold text-foreground flex items-center gap-2"
                     >
                        <Calendar className="h-4 w-4 text-primary" />
                        Thời gian kết thúc
                     </Label>
                     <Controller
                        name="endTime"
                        control={form.control}
                        render={({ field }) => (
                           <Input
                              type="datetime-local"
                              value={formatDateForInput(field.value)}
                              onChange={(e) => {
                                 const newDate = new Date(e.target.value);
                                 if (!isNaN(newDate.getTime())) {
                                    field.onChange(newDate);
                                 }
                              }}
                           />
                        )}
                     />
                     {form.formState.errors.endTime && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                           <span>⚠️</span>
                           {form.formState.errors.endTime.message}
                        </p>
                     )}
                  </div>
               </div>

               {/* Địa điểm */}
               <div className="space-y-2">
                  <Label
                     htmlFor="location"
                     className="text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                     <MapPin className="h-4 w-4 text-primary" />
                     Địa điểm
                  </Label>
                  <Input
                     id="location"
                     {...form.register("location")}
                     placeholder="Nhập địa điểm học"
                  />
                  {form.formState.errors.location && (
                     <p className="text-sm text-destructive flex items-center gap-1">
                        <span>⚠️</span> {form.formState.errors.location.message}
                     </p>
                  )}
               </div>

               {/* Ghi chú */}
               <div className="space-y-2">
                  <Label
                     htmlFor="notes"
                     className="text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                     <BookOpen className="h-4 w-4 text-primary" />
                     Ghi chú
                  </Label>
                  <Textarea
                     id="notes"
                     {...form.register("notes")}
                     placeholder="Nhập ghi chú (tùy chọn)"
                     className="min-h-[80px]"
                  />
                  {form.formState.errors.notes && (
                     <p className="text-sm text-destructive flex items-center gap-1">
                        <span>⚠️</span> {form.formState.errors.notes.message}
                     </p>
                  )}
               </div>

               {/* Footer */}
               <DialogFooter className="pt-4 flex gap-3 justify-end border-t border-border">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                     disabled={isLoading}
                     className="w-full sm:w-auto"
                  >
                     Hủy
                  </Button>
                  <Button
                     type="submit"
                     disabled={isLoading || !form.formState.isValid}
                     className="w-full sm:w-auto"
                  >
                     {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     )}
                     {isEditMode ? "Lưu thay đổi" : "Tạo buổi học"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};
