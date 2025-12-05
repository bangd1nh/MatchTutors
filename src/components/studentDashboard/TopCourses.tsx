import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopCourseDTO } from "@/types/studentDashboard";
import { getLevelLabelVi, getSubjectLabelVi } from "@/utils/educationDisplay";
import { Book } from "lucide-react";

interface TopCoursesProps {
   courses: TopCourseDTO[];
}

export function TopCourses({ courses }: TopCoursesProps) {

   if (courses.length === 0) {
      return (
         <Card>
            <CardHeader>
               <CardTitle className="text-lg">
                  Khóa học đang tiếp tục
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-center py-8">
                  <Book className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Không có khóa học nào</p>
               </div>
            </CardContent>
         </Card>
      );
   }


   return (
      <Card>
         <CardHeader>
            <CardTitle className="text-lg">Khóa học đang tiếp tục</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {courses.map((course) => {

                  return (
                     <div
                        key={course.id}
                        className="p-4 rounded-lg border bg-muted/30 hover:shadow-md transition-shadow"
                     >
                        <div className="flex items-start justify-between mb-3">
                           <div className="flex-1">
                              <h4 className="font-semibold text-foreground text-base">
                                 {getSubjectLabelVi(course.subject)}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                 {course.tutorName}
                              </p>
                              <p className="text-xs text-muted-foreground/80 mt-1">
                                 {getLevelLabelVi(course.level)}
                              </p>
                           </div>
                           {course.studentPaidAmount && (
                              <div className="text-right ml-4">
                                 <p className="text-sm font-bold text-foreground">
                                    {course.studentPaidAmount.toLocaleString()}
                                    ₫
                                 </p>
                                 <p className="text-xs text-muted-foreground">
                                    Đã thanh toán
                                 </p>
                              </div>
                           )}
                        </div>

                        {/* Mục tiến độ */}
                        <div className="space-y-2">
                           <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">
                                 Tiến độ
                              </span>
                              <span
                                 className="text-sm font-bold"
                              >
                                 {course.progress.percentage}%
                              </span>
                           </div>

                           <div className="w-full bg-background rounded-full h-3">
                              <div
                                 className="h-3 rounded-full transition-all duration-300"
                                 style={{
                                    width: `${course.progress.percentage}%`,
                                 }}
                              />
                           </div>

                           <div className="flex justify-between text-xs text-muted-foreground">
                              <span>
                                 {course.progress.completed} buổi đã hoàn thành
                              </span>
                              <span>{course.progress.total} tổng số buổi</span>
                           </div>

                           {course.absentSessions > 0 && (
                              <div className="flex items-center gap-1.5 text-xs pt-1">
                                 <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                                 <span className="text-amber-600 dark:text-amber-400">
                                    {course.absentSessions} buổi vắng
                                 </span>
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         </CardContent>
      </Card>
   );
}
