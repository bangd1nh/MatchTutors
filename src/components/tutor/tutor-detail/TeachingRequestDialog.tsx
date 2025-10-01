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

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useCreateTeachingRequest } from "@/hooks/useTeachingRequest";
import { Loader2 } from "lucide-react";
import type { Tutor } from "@/types/tutorListandDetail";
import type { CreateTeachingRequestPayload } from "@/types/teachingRequest";
import { Subject } from "@/enums/subject.enum";
import { Level } from "@/enums/level.enum";

const requestSchema = z.object({
   subject: z.string().min(1, "Vui lòng chọn môn học."),
   level: z.string().min(1, "Vui lòng chọn trình độ."),
   description: z
      .string()
      .min(20, "Mô tả yêu cầu cần ít nhất 20 ký tự.")
      .max(500, "Mô tả không được vượt quá 500 ký tự."),
});

type RequestFormValues = z.infer<typeof requestSchema>;

interface TeachingRequestDialogProps {
   tutor: Tutor;
   isOpen: boolean;
   onClose: () => void;
}

export const TeachingRequestDialog = ({
   tutor,
   isOpen,
   onClose,
}: TeachingRequestDialogProps) => {
   const { mutate: createRequest, isPending } = useCreateTeachingRequest();

   const {
      register,
      handleSubmit,
      control,
      formState: { errors },
   } = useForm<RequestFormValues>({
      resolver: zodResolver(requestSchema),
   });

   const onSubmit = (values: RequestFormValues) => {
      const payload: CreateTeachingRequestPayload = {
         tutorId: tutor._id,

         subject: values.subject as Subject,
         level: values.level as Level,
         hourlyRate: tutor.hourlyRate ?? 0,
         description: values.description,
      };

      createRequest(payload, {
         onSuccess: () => onClose(),
      });
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Gửi yêu cầu học đến {tutor.fullName}</DialogTitle>
               <DialogDescription>
                  Điền thông tin chi tiết về nhu cầu học tập của bạn. Gia sư sẽ
                  sớm phản hồi.
               </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <Label htmlFor="subject">Môn học</Label>
                     <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Chọn môn học" />
                              </SelectTrigger>
                              <SelectContent>
                                 {(tutor.subjects ?? []).map((sub) => (
                                    <SelectItem key={sub} value={sub}>
                                       {sub}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        )}
                     />
                     {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">
                           {errors.subject.message}
                        </p>
                     )}
                  </div>
                  <div>
                     <Label htmlFor="level">Trình độ</Label>
                     <Controller
                        name="level"
                        control={control}
                        render={({ field }) => (
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <SelectTrigger>
                                 <SelectValue placeholder="Chọn trình độ" />
                              </SelectTrigger>
                              <SelectContent>
                                 {(tutor.levels ?? []).map((lvl) => (
                                    <SelectItem key={lvl} value={lvl}>
                                       {lvl}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        )}
                     />
                     {errors.level && (
                        <p className="text-red-500 text-sm mt-1">
                           {errors.level.message}
                        </p>
                     )}
                  </div>
               </div>

               <div>
                  <Label htmlFor="description">Mô tả yêu cầu</Label>
                  <Textarea
                     id="description"
                     {...register("description")}
                     placeholder="Ví dụ: Em muốn ôn tập lại kiến thức hình học lớp 11 và luyện các dạng bài tập nâng cao..."
                     rows={4}
                  />
                  {errors.description && (
                     <p className="text-red-500 text-sm mt-1">
                        {errors.description.message}
                     </p>
                  )}
               </div>

               <DialogFooter>
                  <Button
                     type="button"
                     variant="ghost"
                     onClick={onClose}
                     disabled={isPending}
                  >
                     Hủy
                  </Button>
                  <Button type="submit" disabled={isPending}>
                     {isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     )}
                     Gửi yêu cầu
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
};
