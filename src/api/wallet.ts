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
