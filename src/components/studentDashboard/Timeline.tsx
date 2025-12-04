import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Star, UserPlus, Clock } from "lucide-react"
import type { TimelineItemDTO } from "@/types/studentDashboard"
import { translateType, translateStatus } from "@/utils/studentDashboard"

interface TimelineProps {
  items: TimelineItemDTO[]
}

export function Timeline({ items }: TimelineProps) {
  const sortedItems = [...items]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "SESSION":
        return <Calendar className="h-4 w-4" />
      case "QUIZ":
        return <FileText className="h-4 w-4" />
      case "REVIEW":
        return <Star className="h-4 w-4" />
      case "TEACHING_REQUEST":
        return <UserPlus className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SESSION":
        return "text-blue-600"
      case "QUIZ":
        return "text-purple-600"
      case "REVIEW":
        return "text-green-600"
      case "TEACHING_REQUEST":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  sortedItems.forEach((item) => {
    console.log(item)
  })

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedItems.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-sm">Hoạt động</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Loại</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-border hover:bg-muted/50 transition-colors last:border-b-0"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-sm mb-1">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className={getTypeColor(item.type)}>
                          {getTypeIcon(item.type)}
                        </div>
                        <span className="text-sm capitalize">{translateType(item.type)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                        {translateStatus(item.type, item.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(item.date)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
