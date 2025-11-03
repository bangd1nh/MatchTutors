import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { initiatePackagePayment } from "@/api/packagePayment";

export const usePackagePayment = () => {
   const [isLoading, setIsLoading] = useState(false);
   const addToast = useToast();

   const initiatePayment = async (packageId: string) => {
      try {
         setIsLoading(true);

         const response = await initiatePackagePayment(packageId);
         const paymentLink = response.data.paymentLink;

         if (!paymentLink) {
            throw new Error("Payment link not generated");
         }

         // Chuyển hướng đến PayOS
         window.location.href = paymentLink;
      } catch (error) {
         const errorMessage =
            error instanceof Error ? error.message : "Lỗi thanh toán";
         addToast("error", errorMessage, 3000);
         setIsLoading(false);
      }
   };

   return {
      initiatePayment,
      isLoading,
   };
};
