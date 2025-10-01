import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuizzesCard({ session, canManage }: any) {
   const quizData = session?.quizIds || [];

   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
               <BookOpen className="h-5 w-5" />
               Bài tập & Quiz ({quizData.length})
            </CardTitle>
            {canManage && (
               <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo Quiz mới
               </Button>
            )}
         </CardHeader>
         <CardContent>
            {quizData.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có bài tập hoặc quiz nào.</p>
                  {canManage && (
                     <p className="text-sm mt-2">
                        Nhấn "Tạo Quiz mới" để thêm bài tập.
                     </p>
                  )}
               </div>
            ) : (
               <div className="space-y-4">
                  {quizData.map((quizId: string, index: number) => (
                     <div
                        key={quizId || index}
                        className="border rounded-lg p-4"
                     >
                        <div className="flex items-center justify-between mb-3">
                           <div>
                              <h3 className="font-medium">Quiz {index + 1}</h3>
                              <p className="text-sm text-muted-foreground">
                                 ID: {quizId}
                              </p>
                           </div>
                           <div className="flex items-center gap-2">
                              <Badge variant="outline">Quiz</Badge>

                              {/* Nút Xem: dẫn tới /viewQuizz */}
                              <Link to={`/viewQuizz`}>
                                 <Button size="sm">Xem</Button>
                              </Link>

                              {canManage && (
                                 <Button variant="ghost" size="sm">
                                    <Edit3 className="h-4 w-4" />
                                 </Button>
                              )}
                           </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                           Quiz được gán cho buổi học này
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </CardContent>
      </Card>
   );
}
