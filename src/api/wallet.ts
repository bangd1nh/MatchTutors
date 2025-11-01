// Adjust based on your api client

import apiClient from "@/lib/api";

export interface Wallet {
   _id: string;
   userId: string;
   balance: number;
   createdAt: string;
   updatedAt: string;
}

export const getWalletInfo = async (): Promise<Wallet> => {
   const response = await apiClient.get("/wallet");
   return response.data.data;
};
