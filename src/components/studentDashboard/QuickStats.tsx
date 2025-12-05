import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Users, Heart, DollarSign, Star, Calendar, CalendarX, FileText } from "lucide-react"
import type { QuickStatsDTO, SessionStatsDTO } from "@/types/studentDashboard"

interface QuickStatsProps {
  stats: QuickStatsDTO
  sessionStats: SessionStatsDTO
}

export function QuickStats({ stats, sessionStats }: QuickStatsProps) {
  // Các thẻ thống kê cho số cam kết đang hoạt động, gia sư yêu thích, số tiền đã thanh toán và đánh giá
  const statCards = [
    {
      icon: Users,
      label: "Cam kết đang hoạt động",
      value: stats.activeCommitments,
      description: "Các khóa học đang theo học",
      color: "#3B82F6", // Xanh dương
      bgColor: "#EFF6FF"
    },
    {
      icon: Heart,
      label: "Gia sư yêu thích",
      value: stats.favoriteTutors,
      description: "Gia sư đã lưu",
      color: "#EF4444", // Đỏ
      bgColor: "#FEF2F2"
    },
    {
      icon: DollarSign,
      label: "Tổng số tiền đã trả",
      value: `${stats.totalPaidAmount}₫`,
      description: "Tổng chi phí đã chi",
      color: "#10B981", // Xanh lá
      bgColor: "#ECFDF5"
    },
    {
      icon: Star,
      label: "Đánh giá đã gửi",
      value: stats.totalReviews,
      description: "Số đánh giá dành cho gia sư",
      color: "#F59E0B", // Vàng
      bgColor: "#FFFBEB"
    },
  ]

  // Dữ liệu biểu đồ cho thống kê phiên học - CHỈ THÁNG HIỆN TẠI
  const chartData = [
    {
      name: "Buổi Học",
      value: sessionStats.completedSessions,
      color: "#10B981", // Xanh lá
      icon: Calendar,
      description: "Buổi học đã hoàn thành trong tháng này"
    },
    {
      name: "Vắng mặt",
      value: sessionStats.absentSessions,
      color: "#F59E0B", // Vàng
      icon: CalendarX,
      description: "Buổi học vắng mặt trong tháng này"
    },
    {
      name: "Bài kiểm tra",
      value: sessionStats.quizzesCompleted,
      color: "#8B5CF6", // Tím
      icon: FileText,
      description: "Bài kiểm tra đã hoàn thành trong tháng này"
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-gray-700">
            Số lượng tháng này: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  // Get current month name in Vietnamese
  const getCurrentMonthName = () => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    const now = new Date();
    return months[now.getMonth()];
  };

  const currentMonth = getCurrentMonthName();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Thẻ thống kê nhanh - lưới 2x2 */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Tổng quan học tập</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                style={{ backgroundColor: stat.bgColor }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-700">{stat.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ thống kê phiên học THÁNG HIỆN TẠI */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div>
            <CardTitle className="text-lg">Thống kê tháng hiện tại</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Số liệu trong {currentMonth}</p>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                barSize={40}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Chú thích với mô tả */}
          <div className="space-y-2 mt-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-gray-900">{item.value}</span>
                  <span className="text-xs text-gray-500 ml-1">trong tháng</span>
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>
    </div>
  )
}