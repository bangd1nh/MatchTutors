import React from "react";

import { Wallet as WalletIcon } from "lucide-react";
import { useWallet } from "@/hooks/walllet";

export const WalletCard: React.FC = () => {
   const { wallet, loading, error } = useWallet();

   if (loading) {
      return <div className="p-4">Loading wallet information...</div>;
   }

   if (error) {
      return <div className="p-4 text-red-600">Error: {error}</div>;
   }

   if (!wallet) {
      return <div className="p-4">No wallet information available</div>;
   }

   return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
               Ví của tôi
            </h2>
            <WalletIcon className="h-6 w-6 text-sky-500" />
         </div>

         <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">
               Số dư hiện tại
            </div>
            <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
               {wallet.balance.toLocaleString("vi-VN")} VNĐ
            </div>
         </div>

         <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">
               Cập nhật lần cuối:{" "}
               {new Date(wallet.updatedAt).toLocaleDateString("vi-VN")}
            </div>
         </div>
      </div>
   );
};
