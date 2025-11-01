import { useState, useEffect } from "react";
import { getWalletInfo, Wallet } from "@/api/wallet";

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
