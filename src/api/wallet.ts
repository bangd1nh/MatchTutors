// Adjust based on your api client

import apiClient from "@/lib/api";

export interface Wallet {
   _id: string;
   userId: string;
   balance: number;
   createdAt: string;
   updatedAt: string;
}

export interface WithdrawRequest {
   amount: number;
   toBin: string;
   toAccountNumber: string;
   description?: string;
}

export interface WithdrawResponse {
   payoutResult: any;
   newBalance: number;
}

export interface PayoutHistory {
   _id: string;
   userId: string;
   referenceId: string;
   amount: number;
   toBin: string;
   toAccountNumber: string;
   toAccountName?: string;
   description?: string;
   state: string;
   approvalState: string;
   payoutId: string;
   transactionId?: string;
   createdAt: string;
   updatedAt: string;
}

export interface PayoutHistoryResponse {
   data: PayoutHistory[];
   pagination: {
      total: number;
      limit: number;
      skip: number;
      currentPage: number;
      totalPages: number;
   };
}

export const getWalletInfo = async (): Promise<Wallet> => {
   const response = await apiClient.get("/wallet");
   return response.data.data;
};

export const withdrawMoney = async (
   data: WithdrawRequest
): Promise<WithdrawResponse> => {
   const response = await apiClient.post("/wallet/withdraw", data);
   return response.data.data;
};

export const getPayoutHistory = async (
   limit: number = 6,
   skip: number = 0
): Promise<PayoutHistoryResponse> => {
   const response = await apiClient.get("/wallet/history", {
      params: { limit, skip },
   });
   return response.data.data;
};
