import { useForm, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form"; // <--- thêm import type
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useCreateSession, useUpdateSession } from "@/hooks/useSessions";
import { useLearningCommitments } from "@/hooks/useLearningCommitment";
import { Session } from "@/types/session";
import { SessionStatus } from "@/enums/session.enum"; // THÊM DÒNG NÀY
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const sessionFormSchema = z
   .object({
      learningCommitmentId: z
         .string()
         .min(1, "Vui lòng chọn một cam kết học."),
      startTime: z.date({ error: "Thời gian bắt đầu không hợp lệ." }),
      endTime: z.date({ error: "Thời gian kết thúc không hợp lệ." }),
      location: z.string().min(1, "Vui lòng nhập địa điểm."),
      description: z.string().optional(),
      isTrial: z.boolean().default(false),
   })
   .refine((data) => data.endTime > data.startTime, {
      message: "Thời gian kết thúc phải sau thời gian bắt đầu.",
      path: ["endTime"],
   });

type SessionFormValues = z.infer<typeof sessionFormSchema> & {
   isTrial: boolean;
}; // <-- bắt buộc isTrial boolean

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
      useLearningCommitments(1, 100);
   const createSessionMutation = useCreateSession();
   const updateSessionMutation = useUpdateSession();

   const validCommitments = commitments?.filter(
      (c: any) => c?.status === "active"
   );

   const form = useForm<SessionFormValues>({
      resolver: zodResolver(
         sessionFormSchema
      ) as unknown as Resolver<SessionFormValues>, // <-- ép kiểu resolver
      defaultValues: {
         description: "",
         isTrial: false,
      },
   });

   useEffect(() => {
      if (initialData) {
         form.reset({
            ...initialData,
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
         });
      } else {
         form.reset({
            learningCommitmentId: "",
            location: "",
            description: "",
            isTrial: false,
            startTime: defaultDate || new Date(),
            endTime: new Date(
               (defaultDate || new Date()).getTime() + 60 * 60 * 1000
            ),
         });
      }
   }, [initialData, defaultDate, form]);

   const onSubmit = async (values: SessionFormValues) => {
      try {
         console.log("Form values:", values); // Debug log

         const payload = {
            learningCommitmentId: values.learningCommitmentId,
            startTime: values.startTime.toISOString(),
            endTime: values.endTime.toISOString(),
            location: values.location,
            notes: values.description || "",
            isTrial: values.isTrial,
            status: SessionStatus.SCHEDULED,
         };

         console.log("Payload:", payload); // Debug log

         if (isEditMode && initialData?._id) {
            await updateSessionMutation.mutateAsync({
               sessionId: initialData._id,
               payload,
            });
         } else {
            await createSessionMutation.mutateAsync(payload);
         }

         // Đóng dialog sau khi thành công
         onClose();
      } catch (error) {
         console.error("Form submission error:", error);
         // Error sẽ được handle bởi hooks
      }
   };

   const isLoading =
      createSessionMutation.isPending || updateSessionMutation.isPending;

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>
                  {isEditMode ? "Chỉnh sửa buổi học" : "Tạo buổi học mới"}
               </DialogTitle>
               <DialogDescription>
                  Điền thông tin chi tiết cho buổi học.
               </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="learningCommitmentId">Cam kết học</Label>
                  <Controller
                     name="learningCommitmentId"
                     control={form.control}
                     render={({ field }) => (
                        <Select
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                           disabled={isLoadingCommitments || isEditMode}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Chọn cam kết học..." />
                           </SelectTrigger>
                           <SelectContent>
                              {isLoadingCommitments ? (
                                 <SelectItem value="loading" disabled>
                                    Đang tải...
                                 </SelectItem>
                              ) : (
                                 validCommitments?.map((c: any) => (
                                    <SelectItem key={c._id} value={c._id}>
                                       {c.teachingRequest?.subject ?? "Môn học"}
                                       {" - "}
                                       {c.student?.firstName || c.student?.lastName
                                          ? `${c.student?.firstName ?? ""} ${c.student?.lastName ?? ""}`.trim()
                                          : "Học sinh"}
                                    </SelectItem>
                                 ))
                              )}
                           </SelectContent>
                        </Select>
                     )}
                  />
                  {form.formState.errors.learningCommitmentId && (
                     <p className="text-sm text-red-500">
                        {form.formState.errors.learningCommitmentId.message}
                     </p>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                     <Controller
                        name="startTime"
                        control={form.control}
                        render={({ field }) => {
                           const formatDateForInput = (date: Date) => {
                              if (!date || isNaN(date.getTime())) return "";
                              // Tạo date object với timezone local
                              const localDate = new Date(
                                 date.getTime() -
                                    date.getTimezoneOffset() * 60000
                              );
                              return localDate.toISOString().slice(0, 16);
                           };

                           return (
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
                           );
                        }}
                     />
                     {form.formState.errors.startTime && (
                        <p className="text-sm text-red-500">
                           {form.formState.errors.startTime.message}
                        </p>
                     )}
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="endTime">Thời gian kết thúc</Label>
                     <Controller
                        name="endTime"
                        control={form.control}
                        render={({ field }) => {
                           const formatDateForInput = (date: Date) => {
                              if (!date || isNaN(date.getTime())) return "";
                              const localDate = new Date(
                                 date.getTime() -
                                    date.getTimezoneOffset() * 60000
                              );
                              return localDate.toISOString().slice(0, 16);
                           };

                           return (
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
                           );
                        }}
                     />
                     {form.formState.errors.endTime && (
                        <p className="text-sm text-red-500">
                           {form.formState.errors.endTime.message}
                        </p>
                     )}
                  </div>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input id="location" {...form.register("location")} />
                  {form.formState.errors.location && (
                     <p className="text-sm text-red-500">
                        {form.formState.errors.location.message}
                     </p>
                  )}
               </div>

               <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                     id="description"
                     {...form.register("description")}
                  />
               </div>

               <div className="flex items-center space-x-2">
                  <Controller
                     name="isTrial"
                     control={form.control}
                     render={({ field }) => (
                        <Checkbox
                           id="isTrial"
                           checked={field.value}
                           onCheckedChange={field.onChange}
                        />
                     )}
                  />
                  <Label htmlFor="isTrial">Đây là buổi học thử</Label>
               </div>

               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                     disabled={isLoading}
                  >
                     Hủy
                  </Button>
                  <Button
                     type="submit"
                     disabled={isLoading || !form.formState.isValid}
                     onClick={() => {
                        console.log("Button clicked");
                        console.log("Form errors:", form.formState.errors);
                        console.log("Form values:", form.getValues());
                     }}
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
