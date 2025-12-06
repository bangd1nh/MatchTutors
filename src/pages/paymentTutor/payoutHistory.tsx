import React, { useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { usePayoutHistory } from "@/hooks/walllet";
import { Copy, Check, History } from "lucide-react";

const BANKS = [
   { code: "970436", name: "Vietcombank", icon: "🏦" },
   { code: "970422", name: "MB Bank", icon: "🏧" },
];

const getStateColor = (state: string) => {
   switch (state) {
      case "SUCCEEDED":
         return "bg-green-100 text-green-800";
      case "FAILED":
         return "bg-red-100 text-red-800";
      case "PROCESSING":
         return "bg-yellow-100 text-yellow-800";
      default:
         return "bg-gray-100 text-gray-800";
   }
};

const getStateLabel = (state: string) => {
   switch (state) {
      case "SUCCEEDED":
         return "Thành công";
      case "FAILED":
         return "Thất bại";
      case "PROCESSING":
         return "Đang xử lý";
      default:
         return state;
   }
};

const getBankName = (code: string) => {
   const bank = BANKS.find((b) => b.code === code);
   return bank ? `${bank.icon} ${bank.name}` : code;
};

export const PayoutHistoryList: React.FC = () => {
   const [currentPage, setCurrentPage] = useState(1);
   const [copiedId, setCopiedId] = useState<string | null>(null);
   const limit = 6;
   const skip = (currentPage - 1) * limit;

   const { data, isLoading, isError, error } = usePayoutHistory(limit, skip);

   const handleCopyReferenceId = (referenceId: string) => {
      navigator.clipboard.writeText(referenceId);
      setCopiedId(referenceId);
      setTimeout(() => setCopiedId(null), 2000);
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-12">
            <div className="text-center">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <p className="text-center text-red-600 font-medium">
               Lỗi:{" "}
               {error instanceof Error
                  ? error.message
                  : "Không thể tải dữ liệu"}
            </p>
         </div>
      );
   }

   if (!data || data.data.length === 0) {
      return (
         <div className="space-y-4">
            <div className="mb-6">
               <div className="flex items-center gap-3 mb-2">
                  <History className="h-6 w-6 text-sky-600" />
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                     Lịch sử rút tiền
                  </h1>
               </div>
               <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quản lý các khoản thanh toán thành công của bạn
               </p>
            </div>

            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8">
               <p className="text-center text-gray-500 font-medium">
                  Không có lịch sử chi tiền
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-4">
         <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
               <History className="h-6 w-6 text-sky-600" />
               <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Lịch sử rút tiền
               </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
               Quản lý các khoản thanh toán thành công của bạn
            </p>
         </div>

         <div className="border rounded-lg overflow-hidden shadow-sm">
            <Table>
               <TableHeader>
                  <TableRow className="bg-gray-50">
                     <TableHead className="font-semibold">Ngày giờ</TableHead>
                     <TableHead className="font-semibold">Số tiền</TableHead>
                     <TableHead className="font-semibold">Ngân hàng</TableHead>
                     <TableHead className="font-semibold">
                        Số tài khoản
                     </TableHead>
                     <TableHead className="font-semibold">
                        Tên chủ tài khoản
                     </TableHead>
                     <TableHead className="font-semibold">
                        Mã tham chiếu
                     </TableHead>
                     <TableHead className="font-semibold">Trạng thái</TableHead>
                     <TableHead className="font-semibold">Mô tả</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data.data.map((record) => (
                     <TableRow key={record._id} className="hover:bg-gray-50">
                        <TableCell className="text-sm">
                           {format(
                              new Date(record.createdAt),
                              "dd/MM/yyyy HH:mm"
                           )}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                           {record.amount.toLocaleString("vi-VN")} ₫
                        </TableCell>
                        <TableCell className="text-sm">
                           {getBankName(record.toBin)}
                        </TableCell>
                        <TableCell className="text-sm">
                           {record.toAccountNumber}
                        </TableCell>
                        <TableCell className="text-sm">
                           {record.toAccountName || "N/A"}
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded max-w-xs truncate">
                                 {record.referenceId}
                              </code>
                              <button
                                 onClick={() =>
                                    handleCopyReferenceId(record.referenceId)
                                 }
                                 className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                                 title="Sao chép mã tham chiếu"
                              >
                                 {copiedId === record.referenceId ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                 ) : (
                                    <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                 )}
                              </button>
                           </div>
                        </TableCell>
                        <TableCell>
                           <Badge
                              className={`${getStateColor(
                                 record.state
                              )} font-medium`}
                           >
                              {getStateLabel(record.state)}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                           {record.description || "-"}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>

         <div className="flex justify-center pt-4">
            <Pagination
               currentPage={currentPage}
               totalPages={data.pagination.totalPages}
               onPageChange={setCurrentPage}
            />
         </div>
      </div>
   );
};
