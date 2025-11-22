import { Pagination } from "@/components/common/Pagination";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { usePaymentStudent } from "@/hooks/paymentSuccess";

// Icon SVG nhỏ gọn (Inline)
const IconReceipt = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
   >
      <path
         strokeLinecap="round"
         strokeLinejoin="round"
         strokeWidth={1.5}
         d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
   </svg>
);

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
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600 mb-3"></div>
               <span className="text-stone-500 text-sm font-light">
                  Đang tải dữ liệu...
               </span>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="w-full py-10 text-center">
            <p className="text-red-500 text-base font-medium">
               Có lỗi xảy ra khi tải dữ liệu
            </p>
         </div>
      );
   }

   return (
      // Sử dụng w-full để fit vào khung dashboard hiện tại, bỏ container để tránh khoảng trắng 2 bên
      <div className="w-full space-y-6 font-sans text-stone-800">
         {/* Header: Đơn giản, tinh tế */}
         <div className="border-b border-stone-200 pb-4">
            <h1 className="text-2xl font-bold text-stone-800 mb-1 tracking-tight">
               Lịch sử thanh toán
            </h1>
            <p className="text-stone-500 text-sm font-light">
               Quản lý các khoản cam kết học tập của bạn
            </p>
         </div>

         {payments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-stone-100 shadow-sm">
               <div className="inline-block p-4 rounded-full bg-stone-50 mb-3">
                  <IconReceipt />
               </div>
               <p className="text-stone-400 text-base font-medium">
                  Chưa có giao dịch nào
               </p>
            </div>
         ) : (
            <>
               {/* Danh sách thẻ thanh toán */}
               <div className="flex flex-col gap-3">
                  {payments.map((payment) => (
                     <div
                        key={payment._id}
                        className="group bg-white border border-stone-200 rounded-lg p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                     >
                        {/* Điểm nhấn Zen: Một vạch màu nhỏ bên trái thể hiện trạng thái, thay vì tô màu cả khối */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 ml-2">
                           {/* Thông tin bên trái */}
                           <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                 <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                                    Đơn hàng
                                 </span>
                                 <span className="font-mono text-sm text-stone-700 font-medium bg-stone-50 px-2 py-0.5 rounded">
                                    #{payment.orderCode}
                                 </span>
                              </div>

                              <div className="text-sm text-stone-600">
                                 <span className="mr-2">Dịch vụ:</span>
                                 <span className="font-medium text-stone-800">
                                    Cam kết học
                                 </span>
                              </div>

                              <div className="text-sm text-stone-500 font-light flex items-center gap-2">
                                 <span>
                                    {new Date(
                                       payment.createdAt
                                    ).toLocaleDateString("vi-VN", {
                                       day: "numeric",
                                       month: "long",
                                       year: "numeric",
                                    })}
                                 </span>
                                 <span className="w-1 h-1 rounded-full bg-stone-300"></span>
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
                              <div className="text-xl font-bold text-emerald-700">
                                 {payment.amount.toLocaleString("vi-VN")}{" "}
                                 <span className="text-sm font-normal text-stone-500">
                                    đ
                                 </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                 {/* Badge trạng thái kiểu Nhật: Nhỏ gọn, màu nhẹ */}
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    Hoàn thành
                                 </span>
                              </div>
                           </div>
                        </div>

                        {/* Transaction ID (Ẩn bớt cho gọn, chỉ hiện khi cần thiết hoặc làm mờ) */}
                        {payment.transactionId && (
                           <div className="mt-3 ml-2 pt-3 border-t border-stone-100 flex justify-between items-center">
                              <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                                 Mã giao dịch
                              </span>
                              <span className="text-xs font-mono text-stone-400">
                                 {payment.transactionId}
                              </span>
                           </div>
                        )}
                     </div>
                  ))}
               </div>

               {/* Pagination: Minimal style */}
               <div className="pt-4 border-t border-stone-200/50 flex flex-col items-center gap-3">
                  <Pagination
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={setPage}
                  />
                  <div className="text-xs text-stone-400">
                     Hiển thị {(currentPage - 1) * 6 + 1} -{" "}
                     {Math.min(currentPage * 6, total)} trên tổng số {total}
                  </div>
               </div>
            </>
         )}
      </div>
   );
}
