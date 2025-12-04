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
import { Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const changePasswordSchema = z
   .object({
      oldPassword: z.string().min(1, { message: "Vui lòng nhập mật khẩu cũ." }),
      newPassword: z
         .string()
         .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự." })
         .regex(/[A-Z]/, { message: "Phải chứa ít nhất 1 ký tự in hoa." })
         .regex(/[^A-Za-z0-9]/, {
            message: "Phải chứa ít nhất 1 ký tự đặc biệt.",
         }),
      confirmPassword: z.string(),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp.",
      path: ["confirmPassword"],
   });

type ChangePasswordFormInputs = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
   const { changePassword, isChangePasswordLoading } = useAuth();
   const [showOldPassword, setShowOldPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
   } = useForm<ChangePasswordFormInputs>({
      resolver: zodResolver(changePasswordSchema),
      mode: "onChange",
   });

   const newPassword = watch("newPassword") || "";
   const lengthOK = newPassword.length >= 6;
   const hasUpper = /[A-Z]/.test(newPassword);
   const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
   const rulesOK = lengthOK && hasUpper && hasSpecial;

   const onSubmit = (data: ChangePasswordFormInputs) => {
      changePassword({
         oldPassword: data.oldPassword,
         newPassword: data.newPassword,
      });
   };

   return (
      <div className="flex justify-center items-start py-6 min-h-[60vh]">
         <div className="w-full max-w-2xl px-4 sm:px-6">
            <Card className="w-full shadow rounded-lg">
               <form onSubmit={handleSubmit(onSubmit)}>
                  <CardHeader>
                     <CardTitle className="text-2xl">Đổi mật khẩu</CardTitle>
                     <CardDescription>
                        Cập nhật mật khẩu của bạn để tăng cường bảo mật.
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                     {/* Mật khẩu cũ */}
                     <div className="grid gap-2">
                        <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                        <div className="relative">
                           <Input
                              id="oldPassword"
                              type={showOldPassword ? "text" : "password"}
                              {...register("oldPassword")}
                              className={cn(
                                 "transition-shadow pr-10",
                                 errors.oldPassword
                                    ? "ring-1 ring-red-300"
                                    : "focus:ring-2 focus:ring-sky-400"
                              )}
                           />
                           <button
                              type="button"
                              onClick={() => setShowOldPassword((s) => !s)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                              aria-label={
                                 showOldPassword
                                    ? "Hide password"
                                    : "Show password"
                              }
                           >
                              {showOldPassword ? (
                                 <EyeOff className="h-5 w-5" />
                              ) : (
                                 <Eye className="h-5 w-5" />
                              )}
                           </button>
                        </div>
                        {errors.oldPassword && (
                           <p className="text-sm text-red-600">
                              {errors.oldPassword.message}
                           </p>
                        )}
                     </div>

                     {/* Mật khẩu mới */}
                     <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                           <Label htmlFor="newPassword">Mật khẩu mới</Label>
                           {rulesOK && (
                              <Check className="h-5 w-5 text-green-500" />
                           )}
                        </div>
                        <div className="relative">
                           <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              {...register("newPassword")}
                              className={cn(
                                 "transition-shadow pr-10",
                                 errors.newPassword
                                    ? "ring-1 ring-red-300"
                                    : rulesOK
                                    ? "ring-1 ring-green-300"
                                    : "focus:ring-2 focus:ring-sky-400"
                              )}
                           />
                           <button
                              type="button"
                              onClick={() => setShowNewPassword((s) => !s)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                              aria-label={
                                 showNewPassword
                                    ? "Hide password"
                                    : "Show password"
                              }
                           >
                              {showNewPassword ? (
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

                        {errors.newPassword && (
                           <p className="text-sm text-red-600">
                              {errors.newPassword.message}
                           </p>
                        )}
                     </div>

                     {/* Xác nhận */}
                     <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">
                           Xác nhận mật khẩu mới
                        </Label>
                        <div className="relative">
                           <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              {...register("confirmPassword")}
                              className={cn(
                                 "transition-shadow pr-10",
                                 errors.confirmPassword
                                    ? "ring-1 ring-red-300"
                                    : "focus:ring-2 focus:ring-sky-400"
                              )}
                           />
                           <button
                              type="button"
                              onClick={() => setShowConfirmPassword((s) => !s)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                              aria-label={
                                 showConfirmPassword
                                    ? "Hide password"
                                    : "Show password"
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
                        disabled={isChangePasswordLoading}
                     >
                        {isChangePasswordLoading
                           ? "Đang lưu..."
                           : "Lưu thay đổi"}
                     </Button>
                  </CardFooter>
               </form>
            </Card>
         </div>
      </div>
   );
};

export default ChangePasswordPage;
