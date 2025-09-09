import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
   email: z.string().email({ message: "Địa chỉ email không hợp lệ." }),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
   const { forgotPassword, isForgotPasswordLoading } = useAuth();
   const [submitted, setSubmitted] = useState(false);

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isValid },
   } = useForm<ForgotPasswordFormInputs>({
      resolver: zodResolver(forgotPasswordSchema),
      mode: "onChange",
      defaultValues: { email: "" },
   });

   const emailValue = watch("email", "");

   const onSubmit = (data: ForgotPasswordFormInputs) => {
      // call mutation and show local submitted state (useAuth will show toast)
      try {
         forgotPassword(data.email);
         setSubmitted(true);
      } catch {
         // mutate shows toasts; keep silent here
      }
   };

   return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-50 dark:bg-gray-900 p-4">
         <Card className="w-full max-w-md shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)}>
               <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-semibold">
                     Quên mật khẩu
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground max-w-[28rem] mx-auto">
                     Nhập email để nhận liên kết đặt lại mật khẩu. Nếu email tồn
                     tại, hệ thống sẽ gửi hướng dẫn.
                  </CardDescription>
               </CardHeader>

               <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                     <Label htmlFor="email">Email</Label>

                     <div className="relative">
                        <Input
                           id="email"
                           type="email"
                           placeholder="m@example.com"
                           {...register("email")}
                           className={cn(
                              "pr-10 transition-shadow",
                              errors.email
                                 ? "ring-1 ring-red-300"
                                 : isValid
                                 ? "ring-1 ring-green-300"
                                 : "focus:ring-2 focus:ring-sky-400"
                           )}
                           aria-invalid={!!errors.email}
                           aria-describedby="email-help"
                        />

                        {/* check icon inside input when valid */}
                        {emailValue && !errors.email ? (
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
                              <Check className="h-5 w-5" />
                           </span>
                        ) : null}
                     </div>

                     {errors.email ? (
                        <p className="text-sm text-red-600" id="email-help">
                           {errors.email.message}
                        </p>
                     ) : null}

                     {submitted && !errors.email ? (
                        <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
                           Nếu email tồn tại trong hệ thống, một liên kết đặt
                           lại mật khẩu đã được gửi.
                        </div>
                     ) : null}
                  </div>
               </CardContent>

               <CardFooter className="flex flex-col gap-3">
                  <Button
                     type="submit"
                     className="w-full"
                     disabled={!isValid || isForgotPasswordLoading}
                  >
                     {isForgotPasswordLoading ? "Đang gửi..." : "Gửi liên kết"}
                  </Button>

                  <div className="text-center text-sm">
                     <Link to="/login" className="text-primary hover:underline">
                        Quay lại đăng nhập
                     </Link>
                  </div>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
};

export default ForgotPasswordPage;
