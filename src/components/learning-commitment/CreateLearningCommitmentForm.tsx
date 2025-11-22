import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { CheckCircle2, AlertCircle, Mail } from "lucide-react";

import {
   useCreateLearningCommitment,
   useTeachingRequestsByTutor,
} from "@/hooks/useLearningCommitment";
import { CreateLearningCommitmentRequest } from "@/types/learningCommitment";

const formSchema = z
   .object({
      teachingRequest: z.string().min(1, "Teaching request is required"),
      totalSessions: z.number().min(1, "Total sessions must be at least 1"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      totalAmount: z.number().min(0, "Total amount must be positive"),
   })
   .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
      message: "End date must be after start date",
      path: ["endDate"],
   });

interface Props {
   onSuccess?: () => void;
}

export const CreateLearningCommitmentForm = ({ onSuccess }: Props) => {
   const { mutate: createCommitment, isPending } =
      useCreateLearningCommitment();
   const { data: teachingRequests = [] } = useTeachingRequestsByTutor();

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         teachingRequest: "",
         totalSessions: 1,
         startDate: "",
         endDate: "",
         totalAmount: 0,
      },
   });

   const onSubmit = (values: z.infer<typeof formSchema>) => {
      const selectedRequest = teachingRequests.find(
         (tr: any) => tr._id === values.teachingRequest
      );

      const data: CreateLearningCommitmentRequest = {
         ...values,
         teachingRequest: values.teachingRequest,
         tutor: selectedRequest?.tutor,
         student: selectedRequest?.student,
      };

      createCommitment(data, {
         onSuccess: () => {
            form.reset();
            onSuccess?.();
         },
      });
   };

   const selectedRequest = teachingRequests.find(
      (tr: any) => tr._id === form.watch("teachingRequest")
   );
   const totalSessions = form.watch("totalSessions");
   const totalAmount = form.watch("totalAmount");
   const estimatedHourlyRate =
      selectedRequest && totalSessions > 0
         ? (totalAmount / totalSessions).toFixed(0)
         : 0;

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
         <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Tạo Cam Kết Học Tập
               </h1>
               <p className="text-slate-600">
                  Thiết lập một cam kết học tập mới với học viên của bạn
               </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
               {/* Form Section */}
               <div className="lg:col-span-2">
                  <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                     <CardContent className="pt-6">
                        <Form {...form}>
                           <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="space-y-6"
                           >
                              {/* Teaching Request Selection */}
                              <FormField
                                 control={form.control}
                                 name="teachingRequest"
                                 render={({ field }) => (
                                    <FormItem>
                                       <FormLabel className="text-sm font-semibold text-slate-900">
                                          Yêu Cầu Giảng Dạy
                                       </FormLabel>
                                       <FormControl>
                                          {teachingRequests.length > 0 ? (
                                             <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                             >
                                                <SelectTrigger className="border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                                                   <SelectValue placeholder="Chọn yêu cầu giảng dạy" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full">
                                                   {teachingRequests.map(
                                                      (tr: any) => (
                                                         <SelectItem
                                                            key={tr._id}
                                                            value={tr._id}
                                                            className="py-2"
                                                         >
                                                            <div className="flex flex-col">
                                                               <span className="font-semibold text-slate-900">
                                                                  {`${tr.subject} - ${tr.level}`}
                                                               </span>
                                                               <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                  <Mail className="w-3 h-3" />
                                                                  {tr.studentId
                                                                     ?.userId
                                                                     ?.email ||
                                                                     "N/A"}
                                                               </span>
                                                            </div>
                                                         </SelectItem>
                                                      )
                                                   )}
                                                </SelectContent>
                                             </Select>
                                          ) : (
                                             <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                                <p className="text-sm text-amber-800">
                                                   Không có yêu cầu giảng dạy
                                                   nào
                                                </p>
                                             </div>
                                          )}
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />

                              {/* Selected Request Details Card */}
                              {selectedRequest && (
                                 <Card className="border border-blue-200 bg-blue-50">
                                    <CardContent className="pt-4">
                                       <div className="space-y-2">
                                          <div>
                                             <p className="text-xs text-slate-600 font-semibold">
                                                Thông tin yêu cầu
                                             </p>
                                             <p className="text-sm font-semibold text-slate-900">
                                                {selectedRequest.subject} -{" "}
                                                {selectedRequest.level}
                                             </p>
                                          </div>
                                          <div className="border-t border-blue-200 pt-2">
                                             <p className="text-xs text-slate-600 font-semibold mb-1">
                                                Học Sinh
                                             </p>
                                             <p className="text-sm font-medium text-slate-900">
                                                {selectedRequest.studentId
                                                   ?.userId?.name || "N/A"}
                                             </p>
                                             <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                <Mail className="w-3 h-3" />
                                                {selectedRequest.studentId
                                                   ?.userId?.email || "N/A"}
                                             </p>
                                          </div>
                                       </div>
                                    </CardContent>
                                 </Card>
                              )}

                              {/* Sessions and Amount Row */}
                              <div className="grid grid-cols-2 gap-4">
                                 <FormField
                                    control={form.control}
                                    name="totalSessions"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-sm font-semibold text-slate-900">
                                             Tổng Buổi Học
                                          </FormLabel>
                                          <FormControl>
                                             <Input
                                                type="number"
                                                min="1"
                                                placeholder="1"
                                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                                {...field}
                                                onChange={(e) =>
                                                   field.onChange(
                                                      parseInt(
                                                         e.target.value
                                                      ) || 0
                                                   )
                                                }
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name="totalAmount"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-sm font-semibold text-slate-900">
                                             Tổng Tiền (VND)
                                          </FormLabel>
                                          <FormControl>
                                             <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                                {...field}
                                                onChange={(e) =>
                                                   field.onChange(
                                                      parseFloat(
                                                         e.target.value
                                                      ) || 0
                                                   )
                                                }
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </div>

                              {/* Date Range Row */}
                              <div className="grid grid-cols-2 gap-4">
                                 <FormField
                                    control={form.control}
                                    name="startDate"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-sm font-semibold text-slate-900">
                                             Ngày Bắt Đầu
                                          </FormLabel>
                                          <FormControl>
                                             <Input
                                                type="date"
                                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                                {...field}
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />

                                 <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-sm font-semibold text-slate-900">
                                             Ngày Kết Thúc
                                          </FormLabel>
                                          <FormControl>
                                             <Input
                                                type="date"
                                                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                                {...field}
                                             />
                                          </FormControl>
                                          <FormMessage />
                                       </FormItem>
                                    )}
                                 />
                              </div>

                              {/* Submit Button */}
                              <Button
                                 type="submit"
                                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 shadow-sm hover:shadow-md transition-all rounded-lg"
                                 disabled={
                                    isPending || teachingRequests.length === 0
                                 }
                              >
                                 {isPending ? (
                                    <div className="flex items-center gap-2">
                                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                       Đang tạo...
                                    </div>
                                 ) : (
                                    <div className="flex items-center gap-2">
                                       <CheckCircle2 className="w-4 h-4" />
                                       Tạo Cam Kết
                                    </div>
                                 )}
                              </Button>
                           </form>
                        </Form>
                     </CardContent>
                  </Card>
               </div>

               {/* Summary Card */}
               <div className="lg:col-span-1">
                  <Card className="border border-slate-200 shadow-sm sticky top-8 bg-gradient-to-br from-blue-50 to-slate-50">
                     <CardHeader className="pb-4">
                        <CardTitle className="text-lg text-slate-900">
                           Tóm Tắt Cam Kết
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {/* Selected Request Summary */}
                        {selectedRequest && (
                           <div className="p-3 bg-white rounded-lg border border-slate-200">
                              <p className="text-xs text-slate-600 mb-2">
                                 Yêu Cầu
                              </p>
                              <p className="font-semibold text-slate-900 mb-1">
                                 {selectedRequest.subject}
                              </p>
                              <p className="text-sm text-slate-600 mb-2">
                                 {selectedRequest.level}
                              </p>
                              <div className="border-t border-slate-200 pt-2">
                                 <p className="text-xs text-slate-600 mb-1">
                                    Học Sinh
                                 </p>
                                 <p className="text-sm font-medium text-slate-900">
                                    {selectedRequest.studentId?.userId?.name ||
                                       "N/A"}
                                 </p>
                                 <p className="text-xs text-slate-500">
                                    {selectedRequest.studentId?.userId?.email ||
                                       "N/A"}
                                 </p>
                              </div>
                           </div>
                        )}

                        {/* Summary Items */}
                        <div className="space-y-3 pt-2 border-t border-slate-200">
                           <div className="flex justify-between items-center">
                              <span className="text-slate-600 text-sm">
                                 Buổi học:
                              </span>
                              <span className="font-semibold text-slate-900">
                                 {totalSessions}
                              </span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-slate-600 text-sm">
                                 Tổng tiền:
                              </span>
                              <span className="font-semibold text-blue-600">
                                 {totalAmount.toLocaleString()} VND
                              </span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-slate-600 text-sm">
                                 Giá/buổi:
                              </span>
                              <span className="font-semibold text-slate-900">
                                 {estimatedHourlyRate.toLocaleString()} VND
                              </span>
                           </div>
                        </div>

                        {/* Duration */}
                        {form.watch("startDate") && form.watch("endDate") && (
                           <div className="p-3 bg-white rounded-lg border border-slate-200 pt-4 border-t">
                              <p className="text-xs text-slate-600 mb-1">
                                 Thời Hạn
                              </p>
                              <p className="text-sm font-medium text-slate-900">
                                 {new Date(
                                    form.watch("startDate")
                                 ).toLocaleDateString("vi-VN")}
                              </p>
                              <p className="text-sm text-slate-600">đến</p>
                              <p className="text-sm font-medium text-slate-900">
                                 {new Date(
                                    form.watch("endDate")
                                 ).toLocaleDateString("vi-VN")}
                              </p>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   );
};
