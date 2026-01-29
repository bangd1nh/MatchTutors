import { Users, UserPlus, Clipboard, Inbox } from "lucide-react";
import { useState } from "react";
import {
   useFetchDashboardOverview,
   useFetchDashboardCharts,
   useFetchDashboardPieData,
   useFetchSessionStats,
} from "@/hooks/dashboardTutor";
import StatisticChartTutor from "@/components/dashboardTutor/statisticChartTutor";
import PieChartTutor from "@/components/dashboardTutor/pieChartTutor";
import BarChartTutor from "@/components/dashboardTutor/barChartTutor";

export default function DashboardTutorPage() {
   const overviewQuery = useFetchDashboardOverview();
   const chartsQuery = useFetchDashboardCharts({ enabled: true });
   const pieDataQuery = useFetchDashboardPieData();
   const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
      undefined
   );
   const [selectedYear, setSelectedYear] = useState<number | undefined>(
      undefined
   );
   const [queryMonth, setQueryMonth] = useState<number | undefined>(undefined);
   const [queryYear, setQueryYear] = useState<number | undefined>(undefined);

   const sessionStatsQuery = useFetchSessionStats(queryMonth, queryYear);

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
   const sessionStats = sessionStatsQuery.data;

   // pretty UI: month picker + week segmented control
   const handleSearch = () => {
      setQueryMonth(selectedMonth);
      setQueryYear(selectedYear);
   };

   const handleReset = () => {
      setSelectedMonth(undefined);
      setSelectedYear(undefined);
      setQueryMonth(undefined);
      setQueryYear(undefined);
   };

   return (
      <div className="p-6 space-y-6">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
               <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  Học sinh đang học
               </div>
               <div className="text-2xl font-semibold dark:text-white">
                  {overview?.activeStudents ?? 0}
               </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
               <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  Số lượng lời mời dạy học còn lại
               </div>
               <div className="text-2xl font-semibold dark:text-white">
                  {overview?.maxStudents ?? 0}
               </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
               <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Clipboard className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  Số lượng quiz được tạo còn lại
               </div>
               <div className="text-2xl font-semibold dark:text-white">
                  {overview?.maxQuiz ?? 0}
               </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
               <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  Số lượng lời mời nhận được
               </div>
               <div className="text-2xl font-semibold dark:text-white">
                  {overview?.teachingRequestsReceived ?? 0}
               </div>
            </div>
         </div>

         <div>
            <StatisticChartTutor
               subjectAnalysis={charts?.subjectAnalysis}
               levelDistribution={charts?.levelDistribution}
            />
         </div>

         <div>
            <PieChartTutor
               sessionsByStatus={pieData?.sessions || []}
               moneySpent={pieData?.moneySpent || 0}
               learningCommitments={pieData?.learningCommitments || []}
            />
         </div>

         <div>
            <BarChartTutor
               stats={
                  sessionStats?.stats || {
                     completed: 0,
                     notCompleted: 0,
                     cancelled: 0,
                     rejected: 0,
                  }
               }
               selectedMonth={selectedMonth}
               selectedYear={selectedYear}
               onMonthChange={(m) => setSelectedMonth(m)}
               onYearChange={(y) => setSelectedYear(y)}
               onSearch={handleSearch}
               onReset={handleReset}
            />
         </div>
      </div>
   );
}
