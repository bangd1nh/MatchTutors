import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

export default function SessionSidebar({ session, isEditing }: any) {
   const learningCommitment = (session as any).learningCommitmentId;

   return (
      <div className="space-y-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Nhắc nhở
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-3">
                  {(session.reminders || []).map(
                     (reminder: any, index: number) => (
                        <div
                           key={index}
                           className="flex items-center justify-between p-3 border rounded-lg"
                        >
                           <div>
                              <p className="text-sm font-medium">
                                 {reminder.minutesBefore >= 1440
                                    ? `${
                                         reminder.minutesBefore / 1440
                                      } ngày trước`
                                    : reminder.minutesBefore >= 60
                                    ? `${reminder.minutesBefore / 60} giờ trước`
                                    : `${reminder.minutesBefore} phút trước`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                 {reminder.method}
                              </p>
                           </div>
                           {isEditing && (
                              <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-8 w-8"
                              >
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           )}
                        </div>
                     )
                  )}
                  {isEditing && (
                     <Button variant="outline" size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm nhắc nhở
                     </Button>
                  )}
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle>Thông tin khóa học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                     Môn học:
                  </span>
                  <span className="text-sm font-medium">
                     {learningCommitment?.teachingRequest?.subject ||
                        "Không xác định"}
                  </span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cấp độ:</span>
                  <span className="text-sm font-medium">
                     {learningCommitment?.teachingRequest?.level ||
                        "Không xác định"}
                  </span>
               </div>
               <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                     Trạng thái khóa:
                  </span>
                  <Badge variant="outline">
                     {learningCommitment?.status || "Không xác định"}
                  </Badge>
               </div>
               <Separator />
               <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                     Buổi học thử:
                  </span>
                  <span className="text-sm font-medium">
                     {session.isTrial ? "Có" : "Không"}
                  </span>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
