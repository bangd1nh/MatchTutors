import apiClient from "@/lib/api";

interface PaymentResponse {
   data: {
      paymentLink: string;
      orderCode: number;
   };
}

export const initiatePackagePayment = async (packageId: string) => {
   const response = await apiClient.post<PaymentResponse>(
      "/packagePayment/initiate",
      { packageId }
   );

   return response.data;
};
