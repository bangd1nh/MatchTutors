import React, { useState } from "react";

import { useWallet, useWithdraw } from "@/hooks/walllet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Ban } from "lucide-react";

const BANKS = [
   { code: "970436", name: "Vietcombank", icon: "🏦" },
   { code: "970422", name: "MB Bank", icon: "🏧" },
];

export const WithdrawForm: React.FC = () => {
   const { wallet, loading: walletLoading } = useWallet();
   const { withdraw, loading: withdrawLoading, error } = useWithdraw();

   const [formData, setFormData] = useState({
      toBin: "970436",
      toAccountNumber: "",
      amount: "",
      description: "Rút tiền từ MatchWork",
   });

   const [successMessage, setSuccessMessage] = useState<string | null>(null);
   const [validationError, setValidationError] = useState<string | null>(null);

   const selectedBank = BANKS.find((b) => b.code === formData.toBin);

   const validateForm = (): boolean => {
      setValidationError(null);

      if (!formData.toAccountNumber.trim()) {
         setValidationError("Vui lòng nhập số tài khoản");
         return false;
      }

      const amount = parseFloat(formData.amount);
      if (!formData.amount || isNaN(amount) || amount <= 0) {
         setValidationError("Vui lòng nhập số tiền hợp lệ");
         return false;
      }

      if (!wallet || amount > wallet.balance) {
         setValidationError("Số dư không đủ");
         return false;
      }

      if (amount < 2000) {
         setValidationError("Số tiền tối thiểu là 2.000 VNĐ");
         return false;
      }

      return true;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      const result = await withdraw({
         toBin: formData.toBin,
         toAccountNumber: formData.toAccountNumber,
         amount: parseFloat(formData.amount),
         description: formData.description,
      });

      if (result) {
         setSuccessMessage(
            `Rút tiền thành công! Số dư mới: ${result.newBalance.toLocaleString(
               "vi-VN"
            )} VNĐ`
         );
         setFormData({
            toBin: "970436",
            toAccountNumber: "",
            amount: "",
            description: "Rút tiền từ MatchWork",
         });

         setTimeout(() => setSuccessMessage(null), 5000);
      }
   };

   return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
         <div className="flex items-center mb-6">
            <Ban className="h-6 w-6 text-sky-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
               Rút tiền
            </h2>
         </div>

         {successMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
               <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
               <p className="text-green-800 dark:text-green-200">
                  {successMessage}
               </p>
            </div>
         )}

         {(error || validationError) && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
               <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
               <p className="text-red-800 dark:text-red-200">
                  {error || validationError}
               </p>
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hiển thị số dư */}
            <div className="p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
               <p className="text-sm text-sky-700 dark:text-sky-200">
                  Số dư hiện tại
               </p>
               <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                  {walletLoading
                     ? "..."
                     : `${wallet?.balance.toLocaleString("vi-VN")} VNĐ`}
               </p>
            </div>

            {/* Chọn ngân hàng */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chọn ngân hàng
               </label>
               <select
                  value={formData.toBin}
                  onChange={(e) =>
                     setFormData({ ...formData, toBin: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent"
               >
                  {BANKS.map((bank) => (
                     <option key={bank.code} value={bank.code}>
                        {bank.icon} {bank.name}
                     </option>
                  ))}
               </select>
               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  BIN: {selectedBank?.code}
               </p>
            </div>

            {/* Nhập số tài khoản */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số tài khoản
               </label>
               <Input
                  type="text"
                  placeholder="Nhập số tài khoản"
                  value={formData.toAccountNumber}
                  onChange={(e) =>
                     setFormData({
                        ...formData,
                        toAccountNumber: e.target.value,
                     })
                  }
                  disabled={withdrawLoading}
               />
            </div>

            {/* Nhập số tiền */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số tiền (VNĐ)
               </label>
               <Input
                  type="number"
                  placeholder="Tối thiểu 10.000 VNĐ"
                  value={formData.amount}
                  onChange={(e) =>
                     setFormData({ ...formData, amount: e.target.value })
                  }
                  disabled={withdrawLoading}
                  min="2000"
                  step="1000"
               />
            </div>

            {/* Ghi chú */}
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú (tuỳ chọn)
               </label>
               <Input
                  type="text"
                  placeholder="Ghi chú về lệnh rút tiền"
                  value={formData.description}
                  onChange={(e) =>
                     setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={withdrawLoading}
               />
            </div>

            {/* Nút submit */}
            <Button
               type="submit"
               disabled={withdrawLoading || walletLoading}
               className="w-full bg-sky-600 hover:bg-sky-700 text-white"
            >
               {withdrawLoading ? "Đang xử lý..." : "Rút tiền"}
            </Button>
         </form>

         <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            💡 Lưu ý: Số tiền tối thiểu là 10.000 VNĐ. Phí rút tiền sẽ được tính
            tự động.
         </p>
      </div>
   );
};
