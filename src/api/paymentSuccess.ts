import apiClient from "@/lib/api";

export interface IPayment {
   _id: string;
   userId: string;
   type: "package" | "learningCommitment";
   packageId?: string;
   referenceId?: string;
   orderCode: number;
   amount: number;
   status: "PENDING" | "SUCCESS" | "FAILED";
   transactionId?: string;
   createdAt: string;
   updatedAt: string;
}

export interface PaymentResponse {
   data: IPayment[];
   total: number;
   page: number;
   limit: number;
   totalPages: number;
}

export const getSuccessfulPayments = async (
   page: number = 1,
   limit: number = 6
): Promise<PaymentResponse> => {
   const response = await apiClient.get("/paymentSuccess/payments", {
      params: {
         page,
         limit,
      },
   });
   return response.data.data;
};

export const getSuccessfulPaymentsStudent = async (
   page: number = 1,
   limit: number = 6
): Promise<PaymentResponse> => {
   const response = await apiClient.get("/paymentSuccess/paymentsStudent", {
      params: {
         page,
         limit,
      },
   });
   return response.data.data;
};
