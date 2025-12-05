import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TopCourseDTO } from "@/types/studentDashboard"
import { getLevelLabelVi, getSubjectLabelVi } from "@/utils/educationDisplay"

interface TopCoursesProps {
  courses: TopCourseDTO[]
}

export function TopCourses({ courses }: TopCoursesProps) {
  if (courses.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Khóa học đang tiếp tục</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">Không có khóa học nào</p>
        </CardContent>
      </Card>
    )
  }

  // Bảng màu cho thanh tiến độ
  const progressColors = [
    "#3B82F6", // Xanh dương
    "#10B981", // Xanh lá
    "#8B5CF6", // Tím
    "#F59E0B", // Vàng
    "#EF4444", // Đỏ
    "#06B6D4", // Xanh cyan
  ]

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Khóa học đang tiếp tục</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course, index) => {
            const progressColor = progressColors[index % progressColors.length]

            return (
              <div
                key={course.id}
                className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-base">{getSubjectLabelVi(course.subject)}</h4>
                    <p className="text-sm text-gray-600 mt-1">{course.tutorName}</p>
                    <p className="text-xs text-gray-500 mt-1">{getLevelLabelVi(course.level)}</p>
                  </div>
                  {course.studentPaidAmount && (
                    <div className="text-right ml-4">
                      <p className="text-sm font-bold text-gray-900">{course.studentPaidAmount}₫</p>
                      <p className="text-xs text-gray-500">Đã thanh toán</p>
                    </div>
                  )}
                </div>

                {/* Mục tiến độ */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Tiến độ</span>
                    <span className="text-sm font-bold text-gray-900">
                      {course.progress.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${course.progress.percentage}%`,
                        backgroundColor: progressColor
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{course.progress.completed} buổi đã hoàn thành</span>
                    <span>{course.progress.total} tổng số buổi</span>
                  </div>

                  {course.absentSessions > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-amber-600">
                        {course.absentSessions} buổi vắng
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
