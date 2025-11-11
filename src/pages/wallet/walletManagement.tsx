import React, { useState } from "react";
import { WalletCard } from "@/components/wallet/WalletCard";
import { WithdrawForm } from "@/components/wallet/WithdrawForm";
import { CreditCard, DollarSign } from "lucide-react";

const WalletManagement: React.FC = () => {
   const [activeTab, setActiveTab] = useState<"balance" | "withdraw">(
      "balance"
   );

   return (
      <div className="container mx-auto py-6 px-4">
         <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Quản lý Ví
         </h1>

         {/* Tabs */}
         <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
               onClick={() => setActiveTab("balance")}
               className={`pb-2 px-4 font-medium transition-colors ${
                  activeTab === "balance"
                     ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                     : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
               }`}
            >
               <CreditCard className="inline mr-2 h-4 w-4" />
               Số dư
            </button>
            <button
               onClick={() => setActiveTab("withdraw")}
               className={`pb-2 px-4 font-medium transition-colors ${
                  activeTab === "withdraw"
                     ? "text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400"
                     : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
               }`}
            >
               <DollarSign className="inline mr-2 h-4 w-4" />
               Rút tiền
            </button>
         </div>

         {/* Content */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
               {activeTab === "balance" && <WalletCard />}
               {activeTab === "withdraw" && <WithdrawForm />}
            </div>
         </div>
      </div>
   );
};

export default WalletManagement;
