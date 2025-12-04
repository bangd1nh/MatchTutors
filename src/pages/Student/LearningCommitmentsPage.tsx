import { useLearningCommitments } from "@/hooks/useLearningCommitment";
import { useTutorProfile } from "@/hooks/useTutorProfile";
import { LearningCommitmentCard } from "@/components/learning-commitment/LearningCommitmentCard";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";

type CommitmentStatus =
   | "all"
   | "pending_agreement"
   | "active"
   | "completed"
   | "cancelled"
   | "cancellation_pending"
   | "admin_review"
   | "rejected"; // Thêm dòng này

const STATUS_TABS: { label: string; value: CommitmentStatus; color: string }[] =
   [
      { label: "Tất Cả", value: "all", color: "slate" },
      { label: "Chờ Xác Nhận", value: "pending_agreement", color: "amber" },
      { label: "Đang Hoạt Động", value: "active", color: "emerald" },
      { label: "Hoàn Thành", value: "completed", color: "blue" },
      {
         label: "Chờ Phê Duyệt",
         value: "cancellation_pending",
         color: "orange",
      },
      { label: "Kiểm Duyệt", value: "admin_review", color: "purple" },
      { label: "Đã Hủy", value: "cancelled", color: "red" },
      { label: "Đã Từ Chối", value: "rejected", color: "red" }, // Thêm dòng này
   ];

export const LearningCommitmentsPage = () => {
   const { user } = useUser();
   const isTutor = String(user?.role).toLowerCase() === "tutor";
   const [page, setPage] = useState(1);
   const [activeTab, setActiveTab] = useState<CommitmentStatus>("all");

   // Add this hook to get tutor profile
   const { tutorProfile } = useTutorProfile();

   // Check if tutor is approved
   const isTutorApproved = tutorProfile?.isApproved === true;

   const {
      data: paginatedData,
      isLoading,
      error,
   } = useLearningCommitments(page, 9); // 9 items for a 3-column grid

   const commitments = paginatedData?.items;
   const totalPages = paginatedData?.pages ?? 1;

   // Filter commitments based on active tab
   const filteredCommitments =
      activeTab === "all"
         ? commitments
         : commitments?.filter(
              (commitment) => commitment.status === activeTab
           ) ?? [];

   const getTabColor = (color: string) => {
      const colorMap: { [key: string]: string } = {
         amber: "text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100",
         emerald:
            "text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100",
         blue: "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100",
         orange:
            "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100",
         purple:
            "text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100",
         red: "text-red-600 border-red-200 bg-red-50 hover:bg-red-100",
         slate: "text-slate-600 border-slate-200 bg-slate-50 hover:bg-slate-100",
      };
      return colorMap[color] || colorMap.slate;
   };

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
               <p className="text-slate-600 font-medium">Đang tải...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
               <p className="text-red-600 font-medium text-lg">
                  Lỗi tải dữ liệu
               </p>
               <p className="text-slate-500 mt-2">Vui lòng thử lại sau</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
         {/* Header Section */}
         <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-6">
               <div className="flex justify-between items-start gap-4">
                  <div>
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                           <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">
                           Cam Kết Học Tập
                        </h1>
                     </div>
                     <p className="text-slate-600 ml-11">
                        {isTutor
                           ? "Quản lý các cam kết học tập cùng học viên của bạn"
                           : "Xem và thanh toán các cam kết học tập của bạn"}
                     </p>
                  </div>

                  {isTutor && isTutorApproved && (
                     <Link
                        to="/tutor/commitments/create"
                        className="flex-shrink-0"
                     >
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all">
                           <Plus className="w-5 h-5 mr-2" />
                           Tạo Cam Kết
                        </Button>
                     </Link>
                  )}
               </div>
            </div>
         </div>

         {/* Main Content */}
         <div className="container mx-auto px-4 py-8">
            {/* Status Tabs */}
            <div className="mb-8">
               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {STATUS_TABS.map((tab) => {
                     const count =
                        tab.value === "all"
                           ? commitments?.length ?? 0
                           : commitments?.filter((c) => c.status === tab.value)
                                .length ?? 0;
                     const isActive = activeTab === tab.value;

                     return (
                        <button
                           key={tab.value}
                           onClick={() => setActiveTab(tab.value)}
                           className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all border ${
                              isActive
                                 ? `${getTabColor(
                                      tab.color
                                   )} border-current shadow-md`
                                 : "text-slate-600 border-transparent bg-white hover:bg-slate-50"
                           }`}
                        >
                           <span>{tab.label}</span>
                           {count > 0 && (
                              <span
                                 className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    isActive
                                       ? "bg-white bg-opacity-40"
                                       : "bg-slate-100"
                                 }`}
                              >
                                 {count}
                              </span>
                           )}
                        </button>
                     );
                  })}
               </div>
            </div>

            {/* Commitments Grid or Empty State */}
            {filteredCommitments && filteredCommitments.length > 0 ? (
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                  {filteredCommitments.map((commitment) => (
                     <LearningCommitmentCard
                        key={commitment._id}
                        commitment={commitment}
                     />
                  ))}
               </div>
            ) : (
               <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                     <div className="mx-auto mb-4 p-4 bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-slate-400" />
                     </div>
                     <p className="text-slate-600 text-lg font-medium mb-2">
                        {activeTab === "all"
                           ? "Không có cam kết nào"
                           : `Không có cam kết ${STATUS_TABS.find(
                                (t) => t.value === activeTab
                             )?.label.toLowerCase()}`}
                     </p>
                     <p className="text-slate-500 text-sm mb-6">
                        {activeTab === "all"
                           ? "Bắt đầu bằng cách tạo cam kết học tập mới"
                           : "Thử chọn một trạng thái khác"}
                     </p>
                     {isTutor && isTutorApproved && activeTab === "all" && (
                        <Link
                           to="/tutor/commitments/create"
                           className="inline-block"
                        >
                           <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                              <Plus className="w-4 h-4 mr-2" />
                              Tạo Cam Kết Đầu Tiên
                           </Button>
                        </Link>
                     )}
                  </div>
               </div>
            )}

            {/* Pagination */}
            {totalPages > 0 && (
               <div className="flex justify-center mt-12">
                  <Pagination
                     currentPage={page}
                     totalPages={totalPages}
                     onPageChange={setPage}
                  />
               </div>
            )}
         </div>
      </div>
   );
};
