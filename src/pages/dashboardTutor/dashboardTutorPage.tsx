import { useState, useMemo } from "react";
import {
   useFetchDashboardOverview,
   useFetchDashboardCharts,
   useFetchDashboardPieData,
} from "@/hooks/dashboardTutor";
import StatisticChartTutor from "@/components/dashboardTutor/statisticChartTutor";
import PieChartTutor from "@/components/dashboardTutor/pieChartTutor";
import { useToast } from "@/hooks/useToast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      return (
         <div className="p-6">
            <Card className="p-6 bg-card text-card-foreground">Loading...</Card>
         </div>
      );
   }

   if (overviewQuery.isError || chartsQuery.isError) {
      return (
         <div className="p-6">
            <Card className="p-6 bg-destructive/10 text-destructive border border-destructive/30">
               Không thể tải dữ liệu dashboard
            </Card>
         </div>
      );
   }

   const overview = overviewQuery.data;
   const charts = chartsQuery.data;
   const pieData = pieDataQuery.data;

   return (
      <div className="p-6 space-y-6">
         {/* Overview cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-card text-card-foreground border border-border">
               <div className="text-sm text-muted-foreground">
                  Active students
               </div>
               <div className="text-2xl font-semibold text-foreground">
                  {overview?.activeStudents ?? 0}
               </div>
            </Card>
            <Card className="p-4 bg-card text-card-foreground border border-border">
               <div className="text-sm text-muted-foreground">Max students</div>
               <div className="text-2xl font-semibold text-foreground">
                  {overview?.maxStudents ?? 0}
               </div>
            </Card>
            <Card className="p-4 bg-card text-card-foreground border border-border">
               <div className="text-sm text-muted-foreground">Max quiz</div>
               <div className="text-2xl font-semibold text-foreground">
                  {overview?.maxQuiz ?? 0}
               </div>
            </Card>
            <Card className="p-4 bg-card text-card-foreground border border-border">
               <div className="text-sm text-muted-foreground">
                  Requests received
               </div>
               <div className="text-2xl font-semibold text-foreground">
                  {overview?.teachingRequestsReceived ?? 0}
               </div>
            </Card>
         </div>

         {/* Filters */}
         <Card className="p-4 bg-card text-card-foreground border border-border">
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4">
               {/* Week segmented control */}
               <div>
                  <label className="text-sm text-muted-foreground mr-3">
                     Week (chọn trước)
                  </label>
                  <div className="inline-flex rounded-md bg-muted p-1 border border-border">
                     {[1, 2, 3, 4].map((w) => {
                        const active = w === week;
                        return (
                           <Button
                              key={w}
                              type="button"
                              onClick={() => setWeek(active ? undefined : w)}
                              variant={active ? "default" : "ghost"}
                              className={`px-3 py-1 text-sm rounded-md ${
                                 active ? "" : "hover:bg-accent"
                              }`}
                              aria-pressed={active}
                           >
                              W{w}
                           </Button>
                        );
                     })}
                  </div>
               </div>

               {/* Month picker disabled until week selected */}
               <div className="flex items-center gap-3">
                  <label className="text-sm text-muted-foreground">
                     Choose month
                     <span className="ml-2 text-xs text-muted-foreground">
                        (chỉ sau khi chọn tuần)
                     </span>
                  </label>
                  <Input
                     type="month"
                     value={monthYear ?? ""}
                     onChange={(e) => setMonthYear(e.target.value || undefined)}
                     disabled={!week}
                     aria-disabled={!week}
                     className="h-10 w-44"
                  />
               </div>

               <div className="flex items-center gap-2">
                  <Button
                     onClick={() => {
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
                     className="text-sm"
                  >
                     Áp dụng
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() => {
                        setMonthYear(undefined);
                        setWeek(undefined);
                        chartsQuery.refetch();
                        toast("success", "Đặt lại về mặc định");
                     }}
                     className="text-sm"
                  >
                     Reset
                  </Button>
               </div>
            </div>
         </Card>

         {/* Charts */}
         <Card className="p-4 bg-card text-card-foreground border border-border">
            <StatisticChartTutor
               bubble={charts?.bubble}
               sessions={charts?.sessions}
            />
         </Card>

         <Card className="p-4 bg-card text-card-foreground border border-border">
            <PieChartTutor
               sessionsByStatus={pieData?.sessions || []}
               moneySpent={pieData?.moneySpent || 0}
               learningCommitments={pieData?.learningCommitments || []}
            />
         </Card>
      </div>
   );
}
