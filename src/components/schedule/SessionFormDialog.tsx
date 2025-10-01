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
import { useTutorTeachingRequests } from "@/hooks/useTeachingRequest";
import { Session } from "@/types/session";
import { TeachingRequestStatus } from "@/enums/teachingRequest.enum";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const sessionFormSchema = z
   .object({
      teachingRequestId: z.string().min(1, "Vui lòng chọn một yêu cầu dạy."),

      startTime: z
         .date()
         .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
            message: "Vui lòng chọn thời gian bắt đầu hợp lệ.",
         }),
      endTime: z
         .date()
         .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
            message: "Vui lòng chọn thời gian kết thúc hợp lệ.",
         }),
      location: z.string().min(1, "Vui lòng nhập địa điểm."),
      description: z.string().optional(),
      isTrial: z.boolean(),
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
   const { data: teachingRequests, isLoading: isLoadingRequests } =
      useTutorTeachingRequests();
   const createSessionMutation = useCreateSession();
   const updateSessionMutation = useUpdateSession();

   const validRequests = teachingRequests?.filter(
      (req: any) =>
         req.studentId &&
         [
            TeachingRequestStatus.TRIAL_ACCEPTED,
            TeachingRequestStatus.TRIAL_SCHEDULED,
            TeachingRequestStatus.IN_PROGRESS,
         ].includes(req.status)
   );

   const form = useForm<SessionFormValues>({
      resolver: zodResolver(sessionFormSchema),
      defaultValues: {
         description: "",
         isTrial: false,
      },
   });

   useEffect(() => {
      if (initialData) {
         form.reset({
            ...initialData,
            teachingRequestId:
               (initialData.teachingRequestId as any)?._id ||
               initialData.teachingRequestId,
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
            teachingRequestId: "",
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

   const onSubmit = (values: SessionFormValues) => {
      const payload = {
         ...values,
         startTime: values.startTime.toISOString(),
         endTime: values.endTime.toISOString(),
      };

      if (isEditMode && initialData?._id) {
         updateSessionMutation.mutate(
            { sessionId: initialData._id, payload },
            { onSuccess: onClose }
         );
      } else {
         createSessionMutation.mutate(payload, { onSuccess: onClose });
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
                  <Label htmlFor="teachingRequestId">Yêu cầu dạy</Label>
                  <Controller
                     name="teachingRequestId"
                     control={form.control}
                     render={({ field }) => (
                        <Select
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                           disabled={isLoadingRequests || isEditMode}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Chọn yêu cầu dạy..." />
                           </SelectTrigger>
                           <SelectContent>
                              {isLoadingRequests ? (
                                 <SelectItem value="loading" disabled>
                                    Đang tải...
                                 </SelectItem>
                              ) : (
                                 validRequests?.map((req: any) => (
                                    <SelectItem key={req._id} value={req._id}>
                                       {req.subject} -{" "}
                                       {req.studentId?.userId?.name ??
                                          "Học sinh"}
                                    </SelectItem>
                                 ))
                              )}
                           </SelectContent>
                        </Select>
                     )}
                  />
                  {form.formState.errors.teachingRequestId && (
                     <p className="text-sm text-red-500">
                        {form.formState.errors.teachingRequestId.message}
                     </p>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                     <Controller
                        name="startTime"
                        control={form.control}
                        render={({ field }) => (
                           <Input
                              type="datetime-local"
                              value={
                                 field.value
                                    ? new Date(
                                         field.value.getTime() -
                                            field.value.getTimezoneOffset() *
                                               60000
                                      )
                                         .toISOString()
                                         .slice(0, 16)
                                    : ""
                              }
                              onChange={(e) =>
                                 field.onChange(new Date(e.target.value))
                              }
                           />
                        )}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="endTime">Thời gian kết thúc</Label>
                     <Controller
                        name="endTime"
                        control={form.control}
                        render={({ field }) => (
                           <Input
                              type="datetime-local"
                              value={
                                 field.value
                                    ? new Date(
                                         field.value.getTime() -
                                            field.value.getTimezoneOffset() *
                                               60000
                                      )
                                         .toISOString()
                                         .slice(0, 16)
                                    : ""
                              }
                              onChange={(e) =>
                                 field.onChange(new Date(e.target.value))
                              }
                           />
                        )}
                     />
                  </div>
               </div>
               {form.formState.errors.endTime && (
                  <p className="text-sm text-red-500">
                     {form.formState.errors.endTime.message}
                  </p>
               )}

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
                  <Button type="submit" disabled={isLoading}>
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
