import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { registerSchema, RegisterData } from "@/validation/authSchema";
import { registerUser } from "@/api/authentication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/useToast";
import { Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Role } from "@/types/user";

export default function RegisterPage() {
   const toast = useToast();
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [role, setRole] = useState<Role>(Role.STUDENT);

   // extend local form type with confirmPassword (not present in registerSchema)
   type FormValues = Omit<RegisterData, "role"> & {
      role?: Role;
      confirmPassword?: string;
   };

   const form = useForm<FormValues>({
      resolver: zodResolver(registerSchema),
      mode: "onChange",
      defaultValues: {
         // name: "",
         email: "",
         password: "",
         confirmPassword: "",
         role: Role.STUDENT,
      },
   });

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting, isValid },
      setValue,
   } = form;

   const values = watch();

   const pwd = values.password || "";
   const lengthOK = pwd.length >= 6;
   const hasUpper = /[A-Z]/.test(pwd);
   const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
   const rulesOK = lengthOK && hasUpper && hasSpecial;

   const isFieldValid = (name: keyof RegisterData | "confirmPassword") => {
      if (name === "confirmPassword") {
         return (
            !!values.confirmPassword &&
            values.confirmPassword === values.password &&
            !errors.confirmPassword
         );
      }
      return (
         !errors[name as keyof RegisterData] &&
         !!values[name as keyof RegisterData]
      );
   };

   const handleRoleChange = (newRole: string) => {
      const roleEnum = newRole.toUpperCase() as Role;
      setRole(roleEnum);
      setValue("role", roleEnum, { shouldValidate: true });
   };

   const onSubmit = async (data: FormValues) => {
      try {
         await registerUser({
            ...data,
            role,
         });
         toast(
            "success",
            "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
            5000
         );
         navigate("/login");
      } catch (error: any) {
         const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Đã có lỗi xảy ra.";
         toast("error", `Đăng ký thất bại: ${errorMessage}`, 5000);
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800 p-6">
         <Card className="w-full max-w-lg shadow-lg">
            <CardHeader className="text-center">
               <CardTitle className="text-2xl font-semibold">
                  Tạo tài khoản
               </CardTitle>
               <CardDescription className="text-sm text-muted-foreground">
                  Chọn vai trò và điền thông tin để bắt đầu.
               </CardDescription>
            </CardHeader>

            <CardContent>
               <Tabs
                  defaultValue={Role.STUDENT}
                  className="w-full mb-6"
                  onValueChange={handleRoleChange}
               >
                  <TabsList className="grid w-full grid-cols-2">
                     <TabsTrigger value={Role.STUDENT}>Học viên</TabsTrigger>
                     <TabsTrigger value={Role.TUTOR}>Gia sư</TabsTrigger>
                  </TabsList>
               </Tabs>
               <Form {...form}>
                  <form
                     onSubmit={handleSubmit(onSubmit)}
                     className="space-y-4"
                     noValidate
                  >
                     {/* <FormField
                        control={form.control}
                        name="name"
                        render={() => (
                           <FormItem>
                              <div className="flex items-center justify-between">
                                 <FormLabel>Họ và tên</FormLabel>
                                 {isFieldValid("name") && (
                                    <Check className="h-5 w-5 text-green-500" />
                                 )}
                              </div>
                              <FormControl>
                                 <Input
                                    placeholder="Nguyễn Văn A"
                                    {...register("name")}
                                    className={cn(
                                       "transition-shadow",
                                       errors.name
                                          ? "ring-1 ring-red-300"
                                          : isFieldValid("name")
                                          ? "ring-1 ring-green-300"
                                          : "focus:ring-2 focus:ring-sky-400"
                                    )}
                                 />
                              </FormControl>
                              <FormMessage>
                                 {errors.name?.message as any}
                              </FormMessage>
                           </FormItem>
                        )}
                     /> */}

                     <FormField
                        control={form.control}
                        name="email"
                        render={() => (
                           <FormItem>
                              <div className="flex items-center justify-between">
                                 <FormLabel>Email</FormLabel>
                                 {isFieldValid("email") && (
                                    <Check className="h-5 w-5 text-green-500" />
                                 )}
                              </div>
                              <FormControl>
                                 <Input
                                    type="email"
                                    placeholder="email@example.com"
                                    {...register("email")}
                                    className={cn(
                                       "transition-shadow",
                                       errors.email
                                          ? "ring-1 ring-red-300"
                                          : isFieldValid("email")
                                          ? "ring-1 ring-green-300"
                                          : "focus:ring-2 focus:ring-sky-400"
                                    )}
                                 />
                              </FormControl>
                              <FormMessage>
                                 {errors.email?.message as any}
                              </FormMessage>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="password"
                        render={() => (
                           <FormItem>
                              <div className="flex items-center justify-between">
                                 <FormLabel>Mật khẩu</FormLabel>
                                 <div className="flex items-center gap-2">
                                    {rulesOK && (
                                       <Check className="h-5 w-5 text-green-500" />
                                    )}
                                 </div>
                              </div>

                              <FormControl>
                                 <div className="relative">
                                    <Input
                                       type={showPassword ? "text" : "password"}
                                       {...register("password")}
                                       className={cn(
                                          "transition-shadow pr-10",
                                          errors.password
                                             ? "ring-1 ring-red-300"
                                             : rulesOK
                                             ? "ring-1 ring-green-300"
                                             : "focus:ring-2 focus:ring-sky-400"
                                       )}
                                       placeholder="Mật khẩu của bạn"
                                    />
                                    <button
                                       type="button"
                                       onClick={() =>
                                          setShowPassword((s) => !s)
                                       }
                                       className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                       aria-label={
                                          showPassword
                                             ? "Hide password"
                                             : "Show password"
                                       }
                                    >
                                       {showPassword ? (
                                          <EyeOff className="h-5 w-5" />
                                       ) : (
                                          <Eye className="h-5 w-5" />
                                       )}
                                    </button>
                                 </div>
                              </FormControl>

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

                                 <FormMessage>
                                    {errors.password?.message as any}
                                 </FormMessage>
                              </div>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                           <FormItem>
                              <div className="flex items-center justify-between">
                                 <FormLabel>Xác nhận mật khẩu</FormLabel>
                                 {isFieldValid("confirmPassword") && (
                                    <Check className="h-5 w-5 text-green-500" />
                                 )}
                              </div>
                              <FormControl>
                                 <div className="relative">
                                    <Input
                                       type={
                                          showConfirmPassword
                                             ? "text"
                                             : "password"
                                       }
                                       {...field}
                                       className={cn(
                                          "transition-shadow pr-10",
                                          errors.confirmPassword
                                             ? "ring-1 ring-red-300"
                                             : isFieldValid("confirmPassword")
                                             ? "ring-1 ring-green-300"
                                             : "focus:ring-2 focus:ring-sky-400"
                                       )}
                                       placeholder="Nhập lại mật khẩu"
                                    />
                                    <button
                                       type="button"
                                       onClick={() =>
                                          setShowConfirmPassword((s) => !s)
                                       }
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
                              </FormControl>
                              <FormMessage>
                                 {errors.confirmPassword?.message as any}
                              </FormMessage>
                           </FormItem>
                        )}
                     />

                     <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || !isValid}
                     >
                        {isSubmitting ? "Đang xử lý..." : "Đăng Ký"}
                     </Button>
                  </form>
               </Form>
            </CardContent>
         </Card>
      </div>
   );
}
