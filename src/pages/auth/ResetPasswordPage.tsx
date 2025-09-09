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
import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";

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
   } = useForm<ResetPasswordFormInputs>({
      resolver: zodResolver(resetPasswordSchema),
   });

   const onSubmit = (data: ResetPasswordFormInputs) => {
      if (token) {
         resetPassword({ token, password: data.password });
      }
   };

   if (!token) return null; // Hoặc hiển thị một thông báo loading/lỗi

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
                     <Label htmlFor="password">Mật khẩu mới</Label>
                     <Input
                        id="password"
                        type="password"
                        {...register("password")}
                     />
                     {errors.password && (
                        <p className="text-sm text-red-600">
                           {errors.password.message}
                        </p>
                     )}
                  </div>
                  <div className="grid gap-2">
                     <Label htmlFor="confirmPassword">
                        Xác nhận mật khẩu mới
                     </Label>
                     <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                     />
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
                     disabled={isResetPasswordLoading}
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
