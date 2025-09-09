import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "@/api/authentication";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";

const VerifyEmailPage = () => {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const toast = useToast();
   const [isVerifying, setIsVerifying] = useState(true);
   const [verificationStatus, setVerificationStatus] = useState<
      "success" | "error" | null
   >(null);

   const verifyCalledRef = useRef(false);

   useEffect(() => {
      const token = searchParams.get("token");
      if (!token) {
         setVerificationStatus("error");
         toast("error", "Token không hợp lệ hoặc đã hết hạn.", 3000);
         return;
      }

      if (verifyCalledRef.current) {
         return;
      }
      verifyCalledRef.current = true;

      const verify = async () => {
         try {
            await verifyEmail(token);
            setVerificationStatus("success");
            toast("success", "Xác thực email thành công!", 3000);
         } catch (error: any) {
            setVerificationStatus("error");
            toast(
               "error",
               error.response?.data?.message || "Xác thực email thất bại.",
               3000
            );
         } finally {
            setIsVerifying(false);
         }
      };

      verify();
   }, [searchParams, toast]);

   return (
      <div className="flex items-center justify-center h-[80vh] bg-gray-100 dark:bg-gray-900">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle className="text-2xl">Xác thực Email</CardTitle>
               <CardDescription>
                  {isVerifying
                     ? "Đang xác thực email của bạn..."
                     : verificationStatus === "success"
                     ? "Email của bạn đã được xác thực thành công!"
                     : "Xác thực email thất bại. Vui lòng thử lại."}
               </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
               {verificationStatus === "success" && (
                  <Button onClick={() => navigate("/login")} className="w-full">
                     Đăng nhập
                  </Button>
               )}
               {verificationStatus === "error" && (
                  <Button
                     onClick={() => navigate("/register")}
                     className="w-full"
                  >
                     Đăng ký lại
                  </Button>
               )}
            </CardContent>
         </Card>
      </div>
   );
};

export default VerifyEmailPage;
