import { useState, useEffect } from "react";
import { getWalletInfo, Wallet } from "@/api/wallet";
import { WithdrawRequest, WithdrawResponse, withdrawMoney } from "@/api/wallet";

export const useWallet = () => {
   const [wallet, setWallet] = useState<Wallet | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchWallet = async () => {
         try {
            setLoading(true);
            const data = await getWalletInfo();
            setWallet(data);
            setError(null);
         } catch (err: any) {
            setError(err.message || "Failed to fetch wallet");
            setWallet(null);
         } finally {
            setLoading(false);
         }
      };

      fetchWallet();
   }, []);

   return { wallet, loading, error };
};

export const useWithdraw = () => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const withdraw = async (
      data: WithdrawRequest
   ): Promise<WithdrawResponse | null> => {
      try {
         setLoading(true);
         setError(null);
         const result = await withdrawMoney(data);
         return result;
      } catch (err: any) {
         const errorMessage =
            err.response?.data?.message || err.message || "Rút tiền thất bại";
         setError(errorMessage);
         return null;
      } finally {
         setLoading(false);
      }
   };

   return { withdraw, loading, error };
};
