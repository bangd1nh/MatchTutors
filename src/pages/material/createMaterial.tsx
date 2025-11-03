import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMaterial } from "@/hooks/useMaterial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
   "application/pdf",
   "application/msword",
   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
   "application/vnd.ms-excel",
   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
   "application/vnd.ms-powerpoint",
   "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const formSchema = z.object({
   title: z.string().min(1, "Tiêu đề không được để trống"),
   description: z.string().optional(),
   material: z
      .instanceof(FileList)
      .refine((files) => files?.length === 1, "Vui lòng chọn một file.")
      .refine(
         (files) => files?.[0]?.size <= MAX_FILE_SIZE,
         `Kích thước file tối đa là 10MB.`
      )
      .refine(
         (files) => ALLOWED_FILE_TYPES.includes(files?.[0]?.type),
         "Định dạng file không hợp lệ. Chỉ chấp nhận: PDF, Word, Excel, Powerpoint."
      ),
});

const CreateMaterialPage = () => {
   const navigate = useNavigate();
   const { upload, isUploading } = useMaterial();
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         title: "",
         description: "",
      },
   });

   const onSubmit = (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("material", values.material[0]);

      upload(formData, {
         onSuccess: () => {
            navigate("/tutor/material-management");
         },
      });
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Tải lên tài liệu mới</CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Tiêu đề</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Ví dụ: Đề cương ôn tập Toán 10"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Mô tả</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Mô tả ngắn về tài liệu..."
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="material"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>File tài liệu</FormLabel>
                           <FormControl>
                              <Input
                                 type="file"
                                 accept={ALLOWED_FILE_TYPES.join(",")}
                                 onChange={(e) =>
                                    field.onChange(e.target.files)
                                 }
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type="submit" disabled={isUploading}>
                     {isUploading ? "Đang tải lên..." : "Tải lên"}
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};

export default CreateMaterialPage;
