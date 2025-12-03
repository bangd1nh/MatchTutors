import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
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
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import {
   GoogleLogin,
   CredentialResponse,
   GoogleOAuthProvider,
} from "@react-oauth/google";

const LoginPageContent = () => {
   const { t } = useTranslation();
   const [showPassword, setShowPassword] = useState(false);

   const loginSchema = z.object({
      email: z.string().email({ message: t("invalid_email_address") }),
      password: z.string().min(6, { message: t("password_min_length") }),
   });

   type LoginFormInputs = z.infer<typeof loginSchema>;

   const { login, googleLogin, isLoading } = useAuth();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormInputs>({
      resolver: zodResolver(loginSchema),
   });

   const onSubmit = (data: LoginFormInputs) => {
      login(data);
   };

   const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
      if (credentialResponse.credential) {
         googleLogin(credentialResponse.credential);
      } else {
         console.error("Google login failed: No credential returned.");
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
         <Card className="w-full max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
               <CardHeader>
                  <CardTitle className="text-2xl">{t("login_title")}</CardTitle>
                  <CardDescription>{t("login_description")}</CardDescription>
               </CardHeader>
               <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                     <Label htmlFor="email">{t("email_label")}</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...register("email")}
                        disabled={isLoading}
                     />
                     {errors.email && (
                        <p className="text-sm text-red-600">
                           {errors.email.message}
                        </p>
                     )}
                  </div>
                  <div className="grid gap-2">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t("password_label")}</Label>
                        <Link
                           to="/forgot-password"
                           className="text-sm text-primary hover:underline"
                        >
                           Quên mật khẩu?
                        </Link>
                     </div>
                     <div className="relative">
                        <Input
                           id="password"
                           type={showPassword ? "text" : "password"}
                           {...register("password")}
                           disabled={isLoading}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                           disabled={isLoading}
                        >
                           {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                           ) : (
                              <Eye className="w-4 h-4" />
                           )}
                        </button>
                     </div>
                     {errors.password && (
                        <p className="text-sm text-red-600">
                           {errors.password.message}
                        </p>
                     )}
                  </div>
                  {/* removed inline server error display — server errors are shown by toast now */}
               </CardContent>
               <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                     {isLoading ? t("logging_in") : t("sign_in")}
                  </Button>
                  <div className="relative w-full">
                     <Separator />
                     <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-card px-2 text-xs text-muted-foreground">
                        HOẶC
                     </span>
                  </div>
                  <div className="w-full flex justify-center">
                     <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                           console.error("Login Failed");
                        }}
                        useOneTap
                     />
                  </div>
               </CardFooter>
            </form>
            <div className="text-center pb-4 text-sm">
               Chưa có tài khoản?{" "}
               <Link to="/register" className="text-primary hover:underline">
                  Đăng ký
               </Link>
            </div>
         </Card>
      </div>
   );
};

const LoginPage = () => {
   const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

   if (!googleClientId) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            Lỗi: VITE_GOOGLE_CLIENT_ID chưa được cấu hình.
         </div>
      );
   }

   return (
      <GoogleOAuthProvider clientId={googleClientId}>
         <LoginPageContent />
      </GoogleOAuthProvider>
   );
};

export default LoginPage;
