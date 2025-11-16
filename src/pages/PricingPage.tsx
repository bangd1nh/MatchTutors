// import React, { useEffect } from "react";
import React from "react";
import {
   CheckIcon,
   StarIcon,
   TrendingUpIcon,
   CrownIcon,
   Loader2,
} from "lucide-react";
import { usePublicPackages } from "@/hooks/usePublicPackages";
import { usePackagePayment } from "@/hooks/usePackagePayment";
// import { useToast } from "@/hooks/useToast";
// import { useSearchParams } from "react-router-dom";
import type { IPackage } from "@/types/package";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router-dom";

interface PricingTier extends IPackage {
   id: string;
   highlighted?: boolean;
   icon: React.ReactNode;
}

export default function PricingPage() {
   const { data, isLoading, isError } = usePublicPackages();
   const { initiatePayment, isLoading: isPaymentLoading } = usePackagePayment();
   //  const addToast = useToast();
   //  const [searchParams] = useSearchParams();
   const { isAuthenticated } = useUser();
   const navigate = useNavigate();

   // Xử lý callback từ PayOS sau khi thanh toán
   //  useEffect(() => {
   //     const status = searchParams.get("status");

   //     if (status === "success") {
   //        // Gọi addToast
   //        addToast(
   //           "success",
   //           "Thanh toán thành công! Gói dịch vụ đã được cập nhật.",
   //           3000
   //        );
   //        // Clear URL params
   //        window.history.replaceState(
   //           {},
   //           document.title,
   //           window.location.pathname
   //        );
   //     } else if (status === "cancelled") {
   //        addToast("error", "Thanh toán đã bị hủy. Vui lòng thử lại.", 3000);
   //        window.history.replaceState(
   //           {},
   //           document.title,
   //           window.location.pathname
   //        );
   //     }
   //  }, [searchParams, addToast]);

   // Map API data to pricing tiers with icons
   const getIconForPackage = (index: number): React.ReactNode => {
      const icons = [
         <StarIcon className="w-8 h-8" />,
         <TrendingUpIcon className="w-8 h-8" />,
         <CrownIcon className="w-8 h-8" />,
      ];
      return icons[index % icons.length];
   };

   const pricingTiers: PricingTier[] = React.useMemo(() => {
      if (!data?.data?.packages) return [];

      const packages = data.data.packages
         .filter((pkg) => pkg.isActive !== false)
         .sort((a, b) => a.price - b.price);

      return packages.map((pkg, index) => ({
         ...pkg,
         highlighted: pkg.popular || false,
         icon: getIconForPackage(index),
      }));
   }, [data]);

   const handleChoosePackage = async (packageId: string) => {
      if (!isAuthenticated) {
         navigate("/login");
         return;
      }
      await initiatePayment(packageId);
   };

   if (isLoading) {
      return (
         <div className="w-full min-h-screen py-16 px-4 flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
         </div>
      );
   }

   if (isError || !pricingTiers.length) {
      return (
         <div className="w-full min-h-screen py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto text-center">
               <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Gói Dịch Vụ Gia Sư
               </h1>
               <p className="text-xl text-gray-600 mb-8">
                  Không thể tải thông tin gói dịch vụ. Vui lòng thử lại sau.
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="w-full min-h-screen py-16 px-4 bg-gray-50">
         <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
               <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Gói Dịch Vụ Gia Sư
               </h1>
               <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Chọn gói dịch vụ phù hợp với nhu cầu của bạn và bắt đầu
                  hành trình giảng dạy chuyên nghiệp
               </p>
            </div>

            {/* Pricing Cards */}
            <div className="flex justify-center gap-8">
               {pricingTiers.map((tier) => (
                  <div
                     key={tier.id}
                     className={`relative rounded-2xl p-8 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] transition-all duration-300 ease-in-out ${
                        tier.highlighted
                           ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-2xl scale-105 hover:scale-110"
                           : "bg-white shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
                     }`}
                  >
                     {tier.highlighted && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                           <span className="bg-yellow-400 text-indigo-900 px-4 py-1 rounded-full text-sm font-semibold">
                              Phổ Biến Nhất
                           </span>
                        </div>
                     )}

                     {/* Icon */}
                     <div
                        className={`mb-4 ${
                           tier.highlighted
                              ? "text-white"
                              : "text-indigo-600"
                        }`}
                     >
                        {tier.icon}
                     </div>

                     {/* Tier Name */}
                     <h3
                        className={`text-2xl font-bold mb-2 ${
                           tier.highlighted ? "text-white" : "text-gray-900"
                        }`}
                     >
                        {tier.name}
                     </h3>

                     {/* Description */}
                     {tier.description && tier.description[0] && (
                        <p
                           className={`mb-6 ${
                              tier.highlighted
                                 ? "text-indigo-100"
                                 : "text-gray-600"
                           }`}
                        >
                           {tier.description[0]}
                        </p>
                     )}

                     {/* Price */}
                     <div className="mb-6">
                        <div className="flex items-baseline">
                           {tier.price === 0 ? (
                              <span
                                 className={`text-4xl font-bold ${
                                    tier.highlighted
                                       ? "text-white"
                                       : "text-gray-900"
                                 }`}
                              >
                                 Miễn phí
                              </span>
                           ) : (
                              <>
                                 <span
                                    className={`text-4xl font-bold ${
                                       tier.highlighted
                                          ? "text-white"
                                          : "text-gray-900"
                                    }`}
                                 >
                                    {tier.price.toLocaleString("vi-VN")}
                                 </span>
                                 <span
                                    className={`ml-2 ${
                                       tier.highlighted
                                          ? "text-indigo-100"
                                          : "text-gray-600"
                                    }`}
                                 >
                                    ₫
                                 </span>
                              </>
                           )}
                        </div>
                     </div>

                     {/* Features */}
                     <ul className="space-y-3 mb-8">
                        {tier.description?.map((feature, featureIndex) => (
                           <li
                              key={featureIndex}
                              className="flex items-start"
                           >
                              <CheckIcon
                                 className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                                    tier.highlighted
                                       ? "text-green-300"
                                       : "text-green-500"
                                 }`}
                              />
                              <span
                                 className={
                                    tier.highlighted
                                       ? "text-indigo-50"
                                       : "text-gray-700"
                                 }
                              >
                                 {feature}
                              </span>
                           </li>
                        ))}

                        {tier.features?.maxStudents && (
                           <li className="flex items-start">
                              <CheckIcon
                                 className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                                    tier.highlighted
                                       ? "text-green-300"
                                       : "text-green-500"
                                 }`}
                              />
                              <span
                                 className={
                                    tier.highlighted
                                       ? "text-indigo-50"
                                       : "text-gray-700"
                                 }
                              >
                                 Tối đa {tier.features.maxStudents} học sinh
                              </span>
                           </li>
                        )}

                        {tier.features?.maxQuiz && (
                           <li className="flex items-start">
                              <CheckIcon
                                 className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
                                    tier.highlighted
                                       ? "text-green-300"
                                       : "text-green-500"
                                 }`}
                              />
                              <span
                                 className={
                                    tier.highlighted
                                       ? "text-indigo-50"
                                       : "text-gray-700"
                                 }
                              >
                                 Tối đa {tier.features.maxQuiz} bài quiz
                              </span>
                           </li>
                        )}
                     </ul>

                     {/* CTA Button */}
                     <button
                        onClick={() => handleChoosePackage(tier.id)}
                        disabled={isPaymentLoading}
                        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                           tier.highlighted
                              ? "bg-white text-indigo-600 hover:bg-indigo-50"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                     >
                        {isPaymentLoading ? (
                           <div className="flex items-center justify-center">
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Đang xử lý...
                           </div>
                        ) : (
                           "Chọn Gói Này"
                        )}
                     </button>
                  </div>
               ))}
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
               <p className="text-gray-600 mb-4">
                  Tất cả các gói đều bao gồm thời gian dùng thử 7 ngày miễn
                  phí
               </p>
               <p className="text-gray-500 text-sm">
                  Có câu hỏi? Liên hệ với chúng tôi qua email:
                  support@giasu.vn
               </p>
            </div>
         </div>
      </div>
   );
}
