import { Pagination } from "@/components/common/Pagination";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { usePaymentStudent } from "@/hooks/paymentSuccess";
import { Loader2, Receipt } from "lucide-react";
import {
   Card,
   CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentHistoryPage() {
   const { isAuthenticated } = useUser();
   const navigate = useNavigate();

   const {
      payments,
      total,
      currentPage,
      totalPages,
      isLoading,
      isError,
      setPage,
   } = usePaymentStudent();

   useEffect(() => {
      if (!isAuthenticated) {
         navigate("/login");
      }
   }, [isAuthenticated, navigate]);

   if (isLoading) {
      return (
         <div className="w-full h-96 flex items-center justify-center">
            <div className="flex flex-col items-center">
               <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
               <span className="text-muted-foreground text-sm">
                  Đang tải dữ liệu...
               </span>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="w-full py-10 text-center">
            <p className="text-destructive text-base font-medium">
               Có lỗi xảy ra khi tải dữ liệu
            </p>
         </div>
      );
   }

   return (
      <div className="w-full space-y-6">
         {/* Header */}
         <div className="border-b pb-4">
            <h1 className="text-2xl font-bold tracking-tight">
               Lịch sử thanh toán
            </h1>
            <p className="text-muted-foreground text-sm">
               Quản lý các khoản cam kết học tập của bạn
            </p>
         </div>

         {payments.length === 0 ? (
            <Card className="text-center py-16">
               <CardContent>
                  <div className="inline-block p-3 rounded-full bg-muted mb-3">
                     <Receipt className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-base">
                     Chưa có giao dịch nào
                  </p>
               </CardContent>
            </Card>
         ) : (
            <>
               {/* Danh sách thẻ thanh toán */}
               <div className="flex flex-col gap-3">
                  {payments.map((payment) => (
                     <Card
                        key={payment._id}
                        className="group hover:border-emerald-400/50 transition-all duration-300 relative overflow-hidden"
                     >
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 dark:bg-emerald-400"></div>
                        <CardContent className="p-5 ml-1.5">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              {/* Thông tin bên trái */}
                              <div className="flex-1 space-y-2">
                                 <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                       Đơn hàng
                                    </span>
                                    <span className="font-mono text-sm text-foreground font-medium bg-muted px-2 py-0.5 rounded">
                                       #{payment.orderCode}
                                    </span>
                                 </div>

                                 <div className="text-sm text-muted-foreground">
                                    <span className="mr-2">Dịch vụ:</span>
                                    <span className="font-medium text-foreground">
                                       Cam kết học
                                    </span>
                                 </div>

                                 <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <span>
                                       {new Date(
                                          payment.createdAt
                                       ).toLocaleDateString("vi-VN", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                       })}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-border"></span>
                                    <span>
                                       {new Date(
                                          payment.createdAt
                                       ).toLocaleTimeString("vi-VN", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                       })}
                                    </span>
                                 </div>
                              </div>

                              {/* Thông tin bên phải: Giá tiền & Trạng thái */}
                              <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                                 <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {payment.amount.toLocaleString("vi-VN")}{" "}
                                    <span className="text-sm font-normal text-muted-foreground">
                                       đ
                                    </span>
                                 </div>

                                 <Badge
                                    variant="outline"
                                    className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                                 >
                                    Hoàn thành
                                 </Badge>
                              </div>
                           </div>

                           {/* Transaction ID */}
                           {payment.transactionId && (
                              <div className="mt-4 ml-2 pt-3 border-t flex justify-between items-center">
                                 <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                    Mã giao dịch
                                 </span>
                                 <span className="text-xs font-mono text-muted-foreground">
                                    {payment.transactionId}
                                 </span>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  ))}
               </div>

               {/* Pagination */}
               <div className="pt-4 border-t flex flex-col items-center gap-3">
                  <Pagination
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={setPage}
                  />
                  <div className="text-xs text-muted-foreground">
                     Hiển thị {(currentPage - 1) * 6 + 1} -{" "}
                     {Math.min(currentPage * 6, total)} trên tổng số {total}
                  </div>
               </div>
            </>
         )}
      </div>
   );
}
