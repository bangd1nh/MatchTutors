import { useState, useMemo } from "react";
import { Users, UserPlus, Clipboard, Inbox } from "lucide-react";
import {
   useFetchDashboardOverview,
   useFetchDashboardCharts,
   useFetchDashboardPieData,
} from "@/hooks/dashboardTutor";
import StatisticChartTutor from "@/components/dashboardTutor/statisticChartTutor";
import PieChartTutor from "@/components/dashboardTutor/pieChartTutor";
import { useToast } from "@/hooks/useToast";

export default function DashboardTutorPage() {
   const toast = useToast();
   const [monthYear, setMonthYear] = useState<string | undefined>(undefined); // format "YYYY-MM"
   const [week, setWeek] = useState<number | undefined>(undefined); // 1..4

   // derive params object to pass to hook
   const params = useMemo(() => {
      if (!monthYear) return {};
      const [yearStr, monthStr] = monthYear.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      return { month, year, week };
   }, [monthYear, week]);

   const overviewQuery = useFetchDashboardOverview();
   const chartsQuery = useFetchDashboardCharts({ ...params, enabled: true });
   const pieDataQuery = useFetchDashboardPieData();

   if (overviewQuery.isLoading || chartsQuery.isLoading) {
      return <div className="p-6">Loading...</div>;
   }

   if (overviewQuery.isError || chartsQuery.isError) {
      return (
         <div className="p-6 text-red-500">Không thể tải dữ liệu dashboard</div>
      );
   }

   const overview = overviewQuery.data;
   const charts = chartsQuery.data;
   const pieData = pieDataQuery.data;

   // pretty UI: month picker + week segmented control
   return (
      <div className="p-6 space-y-6">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded shadow">
               <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  Học sinh đang học
               </div>
               <div className="text-2xl font-semibold">
                  {overview?.activeStudents ?? 0}
               </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
               <div className="text-sm text-gray-500 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-gray-400" />
                  Số lượng lời mời dạy học còn lại
               </div>
               <div className="text-2xl font-semibold">
                  {overview?.maxStudents ?? 0}
               </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
               <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-gray-400" />
                  Số lượng quiz được tạo còn lại
               </div>
               <div className="text-2xl font-semibold">
                  {overview?.maxQuiz ?? 0}
               </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
               <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-gray-400" />
                  Số lượng lời mời nhận được
               </div>
               <div className="text-2xl font-semibold">
                  {overview?.teachingRequestsReceived ?? 0}
               </div>
            </div>
         </div>

         <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4">
               {/* Week (chọn trước) */}
               <div>
                  <label className="text-sm text-gray-600 mr-3">
                     Tuần (chọn trước)
                  </label>
                  <div className="inline-flex rounded-md bg-gray-100 p-1">
                     {[1, 2, 3, 4].map((w) => {
                        const active = w === week;
                        return (
                           <button
                              key={w}
                              onClick={() => setWeek(active ? undefined : w)}
                              className={
                                 "px-3 py-1 text-sm rounded-md transition-colors " +
                                 (active
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-200")
                              }
                              aria-pressed={active}
                           >
                              W{w}
                           </button>
                        );
                     })}
                  </div>
               </div>

               {/* Month picker disabled until week selected */}
               <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">
                     Chọn tháng
                     <span className="ml-2 text-xs text-gray-400">
                        (chỉ sau khi chọn tuần)
                     </span>
                  </label>
                  <input
                     type="month"
                     value={monthYear ?? ""}
                     onChange={(e) => setMonthYear(e.target.value || undefined)}
                     disabled={!week}
                     aria-disabled={!week}
                     className={
                        "h-10 px-3 rounded-md border text-sm focus:outline-none " +
                        (week
                           ? "border-gray-200 bg-white focus:ring-2 focus:ring-blue-500"
                           : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed")
                     }
                  />
               </div>

               <div className="flex items-center gap-2">
                  <button
                     onClick={() => {
                        // nếu user bấm Áp dụng mà chưa chọn tuần -> báo
                        if (!week) {
                           toast(
                              "error",
                              "Vui lòng chọn tuần trước khi áp dụng"
                           );
                           return;
                        }
                        chartsQuery.refetch();
                        toast("success", "Đã cập nhật filter");
                     }}
                     className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                     Áp dụng
                  </button>
                  <button
                     onClick={() => {
                        setMonthYear(undefined);
                        setWeek(undefined);
                        chartsQuery.refetch();
                        toast("success", "Đặt lại về mặc định");
                     }}
                     className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50"
                  >
                     Reset
                  </button>
               </div>
            </div>
         </div>

         <div>
            <StatisticChartTutor
               bubble={charts?.bubble}
               sessions={charts?.sessions}
            />
         </div>

         <div>
            <PieChartTutor
               sessionsByStatus={pieData?.sessions || []}
               moneySpent={pieData?.moneySpent || 0}
               learningCommitments={pieData?.learningCommitments || []}
            />
         </div>
      </div>
   );
}
