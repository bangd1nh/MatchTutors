import { useLearningCommitments } from "@/hooks/useLearningCommitment";
import { LearningCommitmentCard } from "@/components/learning-commitment/LearningCommitmentCard";
// import { Button } from "@/components/ui/button";
// import { Plus, BookOpen } from "lucide-react";
// import { Link } from "react-router-dom";

import { BookOpen } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { TutorCommitmentActions } from "@/components/learning-commitment/TutorCommitmentActions";

type CommitmentStatus =
   | "all"
   | "pending_agreement"
   | "active"
   | "completed"
   | "cancelled"
   | "cancellation_pending"
   | "admin_review"
   | "rejected";

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
      { label: "Đã Từ Chối", value: "rejected", color: "red" },
   ];

export const LearningCommitmentsPage = () => {
   const { user } = useUser();
   const isTutor = String(user?.role).toLowerCase() === "tutor";
   const [page, setPage] = useState(1);
   const [activeTab, setActiveTab] = useState<CommitmentStatus>("all");

   const {
      data: paginatedData,
      isLoading,
      error,
   } = useLearningCommitments(page, 9);

   const commitments = paginatedData?.items;
   const totalPages = paginatedData?.pages ?? 1;

   const filteredCommitments =
      activeTab === "all"
         ? commitments
         : commitments?.filter(
              (commitment) => commitment.status === activeTab
           ) ?? [];

   const getTabColor = (color: string, isActive: boolean) => {
      const baseActive = "border-current shadow-md";
      const baseInactive = "border-transparent";
      const map: Record<string, { active: string; inactive: string }> = {
         amber: {
            active:
               "text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 border-amber-200 dark:border-amber-800",
            inactive:
               "text-slate-700 dark:text-slate-200 bg-white dark:bg-secondary hover:bg-slate-50 dark:hover:bg-secondary/80",
         },
         emerald: {
            active:
               "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800",
            inactive:
               "text-slate-700 dark:text-slate-200 bg-white dark:bg-secondary hover:bg-slate-50 dark:hover:bg-secondary/80",
         },
         blue: {
            active:
               "text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800",
            inactive:
               "text-slate-700 dark:text-slate-200 bg-white dark:bg-secondary hover:bg-slate-50 dark:hover:bg-secondary/80",
         },
         orange: {
            active:
               "text-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 border-orange-200 dark:border-orange-800",
            inactive:
               "text-slate-700 dark:text-slate-200 bg-white dark:bg-secondary hover:bg-slate-50 dark:hover:bg-secondary/80",
         },
         purple: {
            active:
               "text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 border-purple-200 dark:border-purple-800",
            inactive:
               "text-slate-700 dark:text-slate-200 bg-white dark:bg-secondary hover:bg-slate-50 dark:hover:bg-secondary/80",
         },
         red: {
            active:
               "text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800",
            inactive:
               "text-slate-700 dark:text-slate-200 bg-white dark:bg-secondary hover:bg-slate-50 dark:hover:bg-secondary/80",
         },
         slate: {
            active:
               "text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-muted hover:bg-slate-100 dark:hover:bg-muted/80 border-slate-200 dark:border-muted",
            inactive:
               "text-slate-700 dark:text-slate-200 bg-white dark:bg-secondary hover:bg-slate-50 dark:hover:bg-secondary/80",
         },
      };
      const c = map[color] || map.slate;
      return `${
         isActive
            ? `${c.active} ${baseActive}`
            : `${c.inactive} ${baseInactive}`
      }`;
   };

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
               <p className="text-muted-foreground font-medium">Đang tải...</p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
               <p className="text-destructive font-medium text-lg">
                  Lỗi tải dữ liệu
               </p>
               <p className="text-muted-foreground mt-2">
                  Vui lòng thử lại sau
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background">
         {/* Header */}
         <Card className="border-b sticky top-0 z-10 bg-card/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
               <div className="flex justify-between items-start gap-4">
                  <div>
                     <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/15">
                           <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">
                           Cam Kết Học Tập
                        </h1>
                     </div>
                     <p className="text-muted-foreground ml-11">
                        {isTutor
                           ? "Quản lý các cam kết học tập cùng học viên của bạn"
                           : "Xem và thanh toán các cam kết học tập của bạn"}
                     </p>
                  </div>

                  {/* {isTutor && <TutorCommitmentActions />} */}
               </div>
            </div>
         </Card>

         {/* Main */}
         <div className="container mx-auto px-4 py-8">
            {/* Tabs using UI Tabs */}
            <Tabs
               value={activeTab}
               onValueChange={(v) => setActiveTab(v as CommitmentStatus)}
               className="w-full"
            >
               <TabsList className="w-full justify-start overflow-x-auto h-12">
                  {STATUS_TABS.map((tab) => {
                     const count =
                        tab.value === "all"
                           ? commitments?.length ?? 0
                           : commitments?.filter((c) => c.status === tab.value)
                                .length ?? 0;
                     const isActive = activeTab === tab.value;

                     return (
                        <TabsTrigger
                           key={tab.value}
                           value={tab.value}
                           className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all border ${getTabColor(
                              tab.color,
                              isActive
                           )} mr-2`}
                        >
                           <span>{tab.label}</span>
                           {count > 0 && (
                              <span
                                 className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    isActive ? "bg-background/40" : "bg-muted"
                                 }`}
                              >
                                 {count}
                              </span>
                           )}
                        </TabsTrigger>
                     );
                  })}
               </TabsList>
            </Tabs>

            {/* List */}
            {filteredCommitments && filteredCommitments.length > 0 ? (
               <ScrollArea className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                     {filteredCommitments.map((commitment) => (
                        <LearningCommitmentCard
                           key={commitment._id}
                           commitment={commitment}
                        />
                     ))}
                  </div>
               </ScrollArea>
            ) : (
               <Card className="flex items-center justify-center py-16 mt-6 bg-card">
                  <div className="text-center">
                     <div className="mx-auto mb-4 p-4 rounded-full w-16 h-16 flex items-center justify-center bg-muted">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                     </div>
                     <p className="text-foreground text-lg font-medium mb-2">
                        {activeTab === "all"
                           ? "Không có cam kết nào"
                           : `Không có cam kết ${STATUS_TABS.find(
                                (t) => t.value === activeTab
                             )?.label.toLowerCase()}`}
                     </p>
                     <p className="text-muted-foreground text-sm mb-6">
                        {activeTab === "all"
                           ? "Bắt đầu bằng cách tạo cam kết học tập mới"
                           : "Thử chọn một trạng thái khác"}
                     </p>
                     {/* Nút tạo cam kết - đã comment */}
                     {/* {isTutor && activeTab === "all" && (
                        <Link
                           to="/tutor/commitments/create"
                           className="inline-block"
                        >
                           <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                              <Plus className="w-4 h-4 mr-2" />
                              Tạo Cam Kết Đầu Tiên
                           </Button>
                        </Link>
                     )} */}
                  </div>
               </Card>
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
