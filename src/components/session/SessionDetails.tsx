import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
} from "@/components/ui/select";
import { Video, MapPin, FileText, XCircle } from "lucide-react";
import moment from "moment";

export default function SessionDetails({
   session,
   setSession,
   isEditing,
   currentUser,
}: any) {
   const isTutor = currentUser?.role === "TUTOR";

   return (
      <div className="lg:col-span-2 space-y-6">
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Thông tin buổi học
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="date">Ngày học</Label>
                     <Input
                        id="date"
                        type="date"
                        value={
                           new Date(session.startTime)
                              .toISOString()
                              .split("T")[0]
                        }
                        disabled={!isEditing || !isTutor}
                        onChange={(e) => {
                           if (!isTutor) return;
                           const newDate = new Date(e.target.value);
                           const startTime = new Date(session.startTime);
                           const endTime = new Date(session.endTime);
                           startTime.setFullYear(
                              newDate.getFullYear(),
                              newDate.getMonth(),
                              newDate.getDate()
                           );
                           endTime.setFullYear(
                              newDate.getFullYear(),
                              newDate.getMonth(),
                              newDate.getDate()
                           );
                           setSession({
                              ...session,
                              startTime: startTime.toISOString(),
                              endTime: endTime.toISOString(),
                           });
                        }}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Trạng thái</Label>
                     <Select
                        value={session.status}
                        disabled={!isEditing || !isTutor}
                        onValueChange={(value: any) =>
                           setSession({ ...session, status: value })
                        }
                     >
                        <SelectTrigger>
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="SCHEDULED">
                              Đã lên lịch
                           </SelectItem>
                           <SelectItem value="CONFIRMED">
                              Đã xác nhận
                           </SelectItem>
                           <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                           <SelectItem value="REJECTED">Đã hủy</SelectItem>
                           <SelectItem value="NOT_CONDUCTED">
                              Không thực hiện
                           </SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="startTime">Giờ bắt đầu</Label>
                     <Input
                        id="startTime"
                        type="time"
                        value={new Date(session.startTime)
                           .toTimeString()
                           .substring(0, 5)}
                        disabled={!isEditing || !isTutor}
                        onChange={(e) => {
                           if (!isTutor) return;
                           const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                           const newStartTime = new Date(session.startTime);
                           newStartTime.setHours(hours, minutes, 0, 0); // Reset seconds/ms
                           setSession({
                              ...session,
                              // --- SỬA Ở ĐÂY ---
                              startTime: newStartTime.toISOString(),
                           });
                        }}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="endTime">Giờ kết thúc</Label>
                     <Input
                        id="endTime"
                        type="time"
                        value={new Date(session.endTime)
                           .toTimeString()
                           .substring(0, 5)}
                        disabled={!isEditing || !isTutor}
                        onChange={(e) => {
                           if (!isTutor) return;
                           const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                           const newEndTime = new Date(session.endTime);
                           newEndTime.setHours(hours, minutes, 0, 0); // Reset seconds/ms
                           setSession({
                              ...session,
                              // --- SỬA Ở ĐÂY ---
                              endTime: newEndTime.toISOString(),
                           });
                        }}
                     />
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa điểm & Liên kết
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="location">
                     Địa điểm/Liên kết học trực tuyến
                  </Label>
                  <div className="flex items-center gap-2">
                     <MapPin className="h-4 w-4 text-muted-foreground" />
                     <Input
                        id="location"
                        value={session.location || ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                           setSession({
                              ...session,
                              location: e.target.value,
                           })
                        }
                        placeholder="Nhập địa điểm hoặc liên kết học trực tuyến"
                     />
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ghi chú buổi học
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea
                     id="notes"
                     placeholder="Thêm ghi chú cho buổi học..."
                     value={session.notes || ""}
                     disabled={!isEditing}
                     onChange={(e) =>
                        setSession({ ...session, notes: e.target.value })
                     }
                     rows={4}
                  />
               </div>
            </CardContent>
         </Card>

         {/* Cancellation Information */}
         {session.cancellation && (
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                     <XCircle className="h-5 w-5" />
                     Thông tin hủy buổi học
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                     {/* Cancelled By User Info */}
                     <div className="mb-4">
                        <Label className="text-red-600 font-medium block mb-2">
                           Người hủy:
                        </Label>
                        {typeof session.cancellation.cancelledBy === "object" &&
                        session.cancellation.cancelledBy ? (
                           <div className="p-3 bg-white rounded-lg border border-red-100">
                              <div className="space-y-1">
                                 <div className="text-sm font-semibold text-red-800">
                                    {session.cancellation.cancelledBy.name ||
                                       "Người dùng"}
                                 </div>
                                 <div className="text-xs text-red-600">
                                    {session.cancellation.cancelledBy.email ||
                                       "N/A"}
                                 </div>
                              </div>
                           </div>
                        ) : (
                           <div className="p-3 bg-white rounded-lg border border-red-100">
                              <span className="text-sm text-red-800">
                                 Người dùng (ID:{" "}
                                 {session.cancellation.cancelledBy})
                              </span>
                           </div>
                        )}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                           <Label className="text-red-600 font-medium">
                              Thời gian hủy:
                           </Label>
                           <p className="text-sm text-red-800">
                              {moment(session.cancellation.cancelledAt).format(
                                 "HH:mm DD/MM/YYYY"
                              )}
                           </p>
                        </div>
                        <div>
                           <Label className="text-red-600 font-medium">
                              Thời gian hủy (chi tiết):
                           </Label>
                           <p className="text-sm text-red-800">
                              {moment(session.cancellation.cancelledAt).format(
                                 "dddd, DD/MM/YYYY [lúc] HH:mm"
                              )}
                           </p>
                        </div>
                     </div>

                     <div>
                        <Label className="text-red-600 font-medium">
                           Lý do hủy:
                        </Label>
                        <div className="mt-2 p-3 bg-white rounded-lg border border-red-100">
                           <p className="text-sm text-red-800">
                              {session.cancellation.reason}
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         )}
      </div>
   );
}
