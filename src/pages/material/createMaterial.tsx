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
   description: z.string().max(300, "Mô tả tối đa 300 ký tự").optional(),
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

/* Small SVG icons for accents */
const IconUpload = ({ className = "w-5 h-5" }: { className?: string }) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
   >
      <path
         d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M7 10l5-5 5 5"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M12 5v14"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);
const IconFile = ({ className = "w-4 h-4" }: { className?: string }) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
   >
      <path
         d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M14 2v6h6"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);
const IconDelete = ({ className = "w-4 h-4" }: { className?: string }) => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
   >
      <path
         d="M3 6h18"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M10 11v6"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M14 11v6"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
      <path
         d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
         strokeWidth="1.5"
         strokeLinecap="round"
         strokeLinejoin="round"
      />
   </svg>
);

const formatBytes = (bytes = 0) => {
   if (bytes === 0) return "0 B";
   const k = 1024,
      sizes = ["B", "KB", "MB", "GB", "TB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const CreateMaterialPage = () => {
   const navigate = useNavigate();
   const { upload, isUploading } = useMaterial();
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: { title: "", description: "" },
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
      <Card className="bg-card text-card-foreground border border-border shadow-sm">
         <CardHeader>
            <CardTitle>
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-muted text-muted-foreground">
                     <IconUpload />
                  </div>
                  <div>
                     <div className="text-lg font-semibold text-foreground">
                        Tải lên tài liệu mới
                     </div>
                     <div className="text-sm text-muted-foreground">
                        Chọn 1 file — PDF/Word/Excel/PPT • tối đa 10MB
                     </div>
                  </div>
               </div>
            </CardTitle>
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
                                 className="bg-muted border-border"
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
                                 className="bg-muted border-border"
                                 rows={4}
                              />
                           </FormControl>
                           <div className="mt-2 flex items-center justify-between text-xs">
                              <FormMessage />
                              <div
                                 className={`ml-2 ${
                                    (field.value?.length || 0) > 300
                                       ? "text-destructive"
                                       : "text-muted-foreground"
                                 }`}
                              >
                                 {field.value?.length || 0}/300
                              </div>
                           </div>
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="material"
                     render={({ field }) => {
                        const selectedFile = field.value?.[0];
                        const fileExt =
                           selectedFile?.name
                              ?.split(".")
                              .pop()
                              ?.toUpperCase() || "";
                        const error = form.formState.errors.material?.message;
                        return (
                           <FormItem>
                              <FormLabel>File tài liệu</FormLabel>
                              <FormControl>
                                 <Input
                                    type="file"
                                    accept={ALLOWED_FILE_TYPES.join(",")}
                                    onChange={(e) =>
                                       field.onChange(e.target.files)
                                    }
                                    className="bg-muted border-border"
                                 />
                              </FormControl>

                              <div className="mt-3">
                                 {selectedFile ? (
                                    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 bg-card">
                                       <div className="flex items-center gap-3">
                                          <div className="p-1 rounded bg-accent text-accent-foreground">
                                             <IconFile />
                                          </div>
                                          <div className="text-sm">
                                             <div className="font-medium text-foreground">
                                                {selectedFile.name}
                                             </div>
                                             <div className="text-xs text-muted-foreground">
                                                {fileExt} •{" "}
                                                {formatBytes(selectedFile.size)}
                                             </div>
                                          </div>
                                       </div>
                                       <div>
                                          <button
                                             type="button"
                                             onClick={() => {
                                                const dt = new DataTransfer();
                                                field.onChange(dt.files);
                                             }}
                                             className="text-muted-foreground hover:text-destructive p-1 rounded"
                                             aria-label="Xóa file"
                                          >
                                             <IconDelete />
                                          </button>
                                       </div>
                                    </div>
                                 ) : (
                                    <div className="text-sm text-muted-foreground">
                                       Chưa có file được chọn
                                    </div>
                                 )}
                                 {error ? (
                                    <div className="mt-2 text-xs text-destructive">
                                       {String(error)}
                                    </div>
                                 ) : (
                                    <div className="mt-2 text-xs text-muted-foreground">
                                       Bạn chỉ có thể chọn 1 file. Định dạng:
                                       PDF, Word, Excel, Powerpoint. Tối đa
                                       10MB.
                                    </div>
                                 )}
                              </div>

                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />

                  <div className="flex items-center gap-3">
                     <Button type="submit" disabled={isUploading}>
                        {isUploading ? "Đang tải lên..." : "Tải lên"}
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/tutor/material-management")}
                        className="text-sm"
                     >
                        Hủy
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};

export default CreateMaterialPage;
