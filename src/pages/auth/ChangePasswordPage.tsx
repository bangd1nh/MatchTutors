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

const changePasswordSchema = z
   .object({
      oldPassword: z.string().min(1, { message: "Vui lòng nhập mật khẩu cũ." }),
      newPassword: z
         .string()
         .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự." }),
      confirmPassword: z.string(),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Mật khẩu xác nhận không khớp.",
      path: ["confirmPassword"],
   });

type ChangePasswordFormInputs = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
   const { changePassword, isChangePasswordLoading } = useAuth();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ChangePasswordFormInputs>({
      resolver: zodResolver(changePasswordSchema),
   });

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
                        <Input
                           id="oldPassword"
                           type="password"
                           {...register("oldPassword")}
                        />
                        {errors.oldPassword && (
                           <p className="text-sm text-red-600">
                              {errors.oldPassword.message}
                           </p>
                        )}
                     </div>

                     {/* Mật khẩu mới */}
                     <div className="grid gap-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                           id="newPassword"
                           type="password"
                           {...register("newPassword")}
                        />
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
