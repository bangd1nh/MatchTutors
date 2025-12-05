import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Bar,
   BarChart,
   CartesianGrid,
   Cell,
   ResponsiveContainer,
   Tooltip,
   XAxis,
   YAxis,
} from "recharts";
import {
   Calendar,
   CalendarX,
   DollarSign,
   FileText,
   Heart,
   Star,
   Users,
} from "lucide-react";
import type { QuickStatsDTO, SessionStatsDTO } from "@/types/studentDashboard";

interface QuickStatsProps {
   stats: QuickStatsDTO;
   sessionStats: SessionStatsDTO;
}

export function QuickStats({ stats, sessionStats }: QuickStatsProps) {
   // Các thẻ thống kê cho số cam kết đang hoạt động, gia sư yêu thích, số tiền đã thanh toán và đánh giá
   const statCards = [
      {
         icon: Users,
         label: "Cam kết đang hoạt động",
         value: stats.activeCommitments,
         description: "Các khóa học đang theo học",
         color: "text-blue-600 dark:text-blue-400",
         iconBg: "bg-blue-500",
         cardBg: "bg-blue-50 dark:bg-blue-950",
      },
      {
         icon: Heart,
         label: "Gia sư yêu thích",
         value: stats.favoriteTutors,
         description: "Gia sư đã lưu",
         color: "text-red-600 dark:text-red-400",
         iconBg: "bg-red-500",
         cardBg: "bg-red-50 dark:bg-red-950",
      },
      {
         icon: DollarSign,
         label: "Tổng số tiền đã trả",
         value: `${stats.totalPaidAmount.toLocaleString()}₫`,
         description: "Tổng chi phí đã chi",
         color: "text-green-600 dark:text-green-400",
         iconBg: "bg-green-500",
         cardBg: "bg-green-50 dark:bg-green-950",
      },
      {
         icon: Star,
         label: "Đánh giá đã gửi",
         value: stats.totalReviews,
         description: "Số đánh giá dành cho gia sư",
         color: "text-amber-600 dark:text-amber-400",
         iconBg: "bg-amber-500",
         cardBg: "bg-amber-50 dark:bg-amber-950",
      },
   ];

   // Dữ liệu biểu đồ cho thống kê phiên học - CHỈ THÁNG HIỆN TẠI
   const chartData = [
      {
         name: "Buổi Học",
         value: sessionStats.completedSessions,
         colorLight: "#10B981", // green-500
         colorDark: "#34D399", // green-400
         icon: Calendar,
      },
      {
         name: "Vắng mặt",
         value: sessionStats.absentSessions,
         colorLight: "#F59E0B", // amber-500
         colorDark: "#FBBF24", // amber-400
         icon: CalendarX,
      },
      {
         name: "Bài kiểm tra",
         value: sessionStats.quizzesCompleted,
         colorLight: "#8B5CF6", // violet-500
         colorDark: "#A78BFA", // violet-400
         icon: FileText,
      },
   ];

   const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
         return (
            <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
               <p className="font-semibold text-popover-foreground">{label}</p>
               <p className="text-muted-foreground">
                  Số lượng tháng này:{" "}
                  <span className="font-bold text-popover-foreground">
                     {payload[0].value}
                  </span>
               </p>
            </div>
         );
      }
      return null;
   };

   // Get current month name in Vietnamese
   const getCurrentMonthName = () => {
      const months = [
         "Tháng 1",
         "Tháng 2",
         "Tháng 3",
         "Tháng 4",
         "Tháng 5",
         "Tháng 6",
         "Tháng 7",
         "Tháng 8",
         "Tháng 9",
         "Tháng 10",
         "Tháng 11",
         "Tháng 12",
      ];
      const now = new Date();
      return months[now.getMonth()];
   };

   const currentMonth = getCurrentMonthName();

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Thẻ thống kê nhanh - lưới 2x2 */}
         <Card>
            <CardHeader>
               <CardTitle className="text-lg">Tổng quan học tập</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 gap-4">
                  {statCards.map((stat, index) => (
                     <div
                        key={index}
                        className={`p-4 rounded-lg border border-border/20 hover:shadow-md transition-shadow ${stat.cardBg}`}
                     >
                        <div className="flex items-center space-x-3">
                           <div className={`p-2 rounded-full ${stat.iconBg}`}>
                              <stat.icon className="h-4 w-4 text-white" />
                           </div>
                           <div className="flex-1">
                              <p className={`text-2xl font-bold ${stat.color}`}>
                                 {stat.value}
                              </p>
                              <p className="text-sm font-medium text-foreground/90">
                                 {stat.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                 {stat.description}
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         {/* Biểu đồ thống kê phiên học THÁNG HIỆN TẠI */}
         <Card>
            <CardHeader>
               <div>
                  <CardTitle className="text-lg">
                     Thống kê tháng hiện tại
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                     Số liệu trong {currentMonth}
                  </p>
               </div>
            </CardHeader>
            <CardContent>
               <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                     data={chartData}
                     margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                     <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        vertical={false}
                     />
                     <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                           fill: "hsl(var(--muted-foreground))",
                           fontSize: 12,
                        }}
                     />
                     <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                           fill: "hsl(var(--muted-foreground))",
                           fontSize: 12,
                        }}
                     />
                     <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "hsl(var(--accent))" }}
                     />
                     <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                        {chartData.map((_, index) => (
                           <Cell key={`cell-${index}`} fill="#10B981" />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>

               {/* Chú thích với mô tả */}
               <div className="space-y-2 mt-4">
                  {chartData.map((item, index) => (
                     <div
                        key={index}
                        className="flex items-center justify-between"
                     >
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full" />
                           <span className="text-sm text-muted-foreground">
                              {item.name}
                           </span>
                        </div>
                        <div className="text-right">
                           <span className="font-semibold text-foreground">
                              {item.value}
                           </span>
                           <span className="text-xs text-muted-foreground ml-1">
                              trong tháng
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
