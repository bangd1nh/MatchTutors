import React from "react";

import { WalletCard } from "@/components/wallet/WalletCard";

const WalletManagement: React.FC = () => {
   return (
      <div className="container mx-auto py-6 px-4">
         <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Quản lý Ví
         </h1>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
               <WalletCard />
            </div>
         </div>
      </div>
   );
};

export default WalletManagement;
