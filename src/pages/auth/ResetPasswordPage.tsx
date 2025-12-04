// filepath: e:\MatchWork\src\pages\auth\ResetPasswordPage.tsx
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
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z
   .object({
      password: z
         .string()
         .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự." }),
      confirmPassword: z.string(),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Mật khẩu không khớp.",
      path: ["confirmPassword"],
   });

type ResetPasswordFormInputs = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
   const { resetPassword, isResetPasswordLoading } = useAuth();
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const toast = useToast();
   const token = searchParams.get("token");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   useEffect(() => {
      if (!token) {
         toast("error", "Token không hợp lệ hoặc đã hết hạn.");
         navigate("/forgot-password");
      }
   }, [token, navigate, toast]);

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
   } = useForm<ResetPasswordFormInputs>({
      resolver: zodResolver(resetPasswordSchema),
      mode: "onChange",
   });

   const values = watch();
   const pwd = values.password || "";
   const lengthOK = pwd.length >= 6;
   const hasUpper = /[A-Z]/.test(pwd);
   const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
   const rulesOK = lengthOK && hasUpper && hasSpecial;

   const isPasswordValid = () => {
      return (
         !!values.confirmPassword &&
         values.confirmPassword === values.password &&
         !errors.confirmPassword &&
         rulesOK
      );
   };

   const onSubmit = (data: ResetPasswordFormInputs) => {
      if (token) {
         resetPassword({ token, password: data.password });
      }
   };

   if (!token) return null;

   return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-100 dark:bg-gray-900">
         <Card className="w-full max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
               <CardHeader>
                  <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
                  <CardDescription>Nhập mật khẩu mới của bạn.</CardDescription>
               </CardHeader>
               <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="password">Mật khẩu mới</Label>
                        {rulesOK && (
                           <Check className="h-5 w-5 text-green-500" />
                        )}
                     </div>
                     <div className="relative">
                        <Input
                           id="password"
                           type={showPassword ? "text" : "password"}
                           {...register("password")}
                           placeholder="Mật khẩu của bạn"
                           className={cn(
                              "transition-shadow pr-10",
                              errors.password
                                 ? "ring-1 ring-red-300"
                                 : rulesOK
                                 ? "ring-1 ring-green-300"
                                 : "focus:ring-2 focus:ring-sky-400"
                           )}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword((s) => !s)}
                           className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                           aria-label={
                              showPassword ? "Hide password" : "Show password"
                           }
                        >
                           {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                           ) : (
                              <Eye className="h-5 w-5" />
                           )}
                        </button>
                     </div>

                     <div className="mt-2 text-sm space-y-1">
                        <p
                           className={cn(
                              "flex items-center gap-2",
                              lengthOK
                                 ? "text-green-600"
                                 : "text-muted-foreground"
                           )}
                        >
                           <span
                              className={cn(
                                 "inline-block",
                                 lengthOK
                                    ? "text-green-600"
                                    : "text-muted-foreground"
                              )}
                           >
                              {lengthOK ? "✓" : "•"}
                           </span>
                           Tối thiểu 6 ký tự
                        </p>
                        <p
                           className={cn(
                              "flex items-center gap-2",
                              hasUpper
                                 ? "text-green-600"
                                 : "text-muted-foreground"
                           )}
                        >
                           <span
                              className={cn(
                                 "inline-block",
                                 hasUpper
                                    ? "text-green-600"
                                    : "text-muted-foreground"
                              )}
                           >
                              {hasUpper ? "✓" : "•"}
                           </span>
                           Chứa ít nhất 1 ký tự in hoa
                        </p>
                        <p
                           className={cn(
                              "flex items-center gap-2",
                              hasSpecial
                                 ? "text-green-600"
                                 : "text-muted-foreground"
                           )}
                        >
                           <span
                              className={cn(
                                 "inline-block",
                                 hasSpecial
                                    ? "text-green-600"
                                    : "text-muted-foreground"
                              )}
                           >
                              {hasSpecial ? "✓" : "•"}
                           </span>
                           Chứa ít nhất 1 ký tự đặc biệt
                        </p>
                     </div>

                     {errors.password && (
                        <p className="text-sm text-red-600">
                           {errors.password.message}
                        </p>
                     )}
                  </div>
                  <div className="grid gap-2">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="confirmPassword">
                           Xác nhận mật khẩu mới
                        </Label>
                        {isPasswordValid() && (
                           <Check className="h-5 w-5 text-green-500" />
                        )}
                     </div>
                     <div className="relative">
                        <Input
                           id="confirmPassword"
                           type={showConfirmPassword ? "text" : "password"}
                           {...register("confirmPassword")}
                           placeholder="Nhập lại mật khẩu"
                           className={cn(
                              "transition-shadow pr-10",
                              errors.confirmPassword
                                 ? "ring-1 ring-red-300"
                                 : isPasswordValid()
                                 ? "ring-1 ring-green-300"
                                 : "focus:ring-2 focus:ring-sky-400"
                           )}
                        />
                        <button
                           type="button"
                           onClick={() => setShowConfirmPassword((s) => !s)}
                           className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                           aria-label={
                              showConfirmPassword
                                 ? "Hide confirm password"
                                 : "Show confirm password"
                           }
                        >
                           {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                           ) : (
                              <Eye className="h-5 w-5" />
                           )}
                        </button>
                     </div>

                     {errors.confirmPassword && (
                        <p className="text-sm text-red-600">
                           {errors.confirmPassword.message}
                        </p>
                     )}
                  </div>
               </CardContent>
               <CardFooter>
                  <Button
                     type="submit"
                     className="w-full"
                     disabled={
                        isResetPasswordLoading || !rulesOK || !isPasswordValid()
                     }
                  >
                     {isResetPasswordLoading
                        ? "Đang lưu..."
                        : "Đặt lại mật khẩu"}
                  </Button>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
};

export default ResetPasswordPage;
