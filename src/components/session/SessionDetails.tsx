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
                     {/* Date input */}
                     <Input
                        id="date"
                        type="date"
                        value={
                           session?.startTime
                              ? moment(session.startTime)
                                   .local()
                                   .format("YYYY-MM-DD")
                              : ""
                        }
                        disabled={!isEditing || !isTutor}
                        onChange={(e) => {
                           if (!isTutor) return;
                           const selectedDate = moment(
                              e.target.value,
                              "YYYY-MM-DD"
                           );
                           const startLocal = moment(session.startTime).local();
                           const endLocal = moment(session.endTime).local();
                           startLocal
                              .year(selectedDate.year())
                              .month(selectedDate.month())
                              .date(selectedDate.date());
                           endLocal
                              .year(selectedDate.year())
                              .month(selectedDate.month())
                              .date(selectedDate.date());
                           setSession({
                              ...session,
                              startTime: startLocal.toISOString(),
                              endTime: endLocal.toISOString(),
                           });
                        }}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label>Trạng thái</Label>
                     <Select
                        value={session.status}
                        disabled={true}
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
                           <SelectItem value="REJECTED">Đã từ chối</SelectItem>
                           <SelectItem value="NOT_CONDUCTED">
                              Không thực hiện
                           </SelectItem>
                           <SelectItem value="CANCELLED">Đã Huỷ</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor="startTime">Giờ bắt đầu</Label>
                     {/* Start time input */}
                     <Input
                        id="startTime"
                        type="time"
                        value={
                           session?.startTime
                              ? moment(session.startTime)
                                   .local()
                                   .format("HH:mm")
                              : ""
                        }
                        disabled={!isEditing || !isTutor}
                        onChange={(e) => {
                           if (!isTutor) return;
                           const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                           const startLocal = moment(session.startTime).local();
                           startLocal
                              .hour(hours)
                              .minute(minutes)
                              .second(0)
                              .millisecond(0);
                           setSession({
                              ...session,
                              startTime: startLocal.toISOString(),
                           });
                        }}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="endTime">Giờ kết thúc</Label>
                     {/* End time input */}
                     <Input
                        id="endTime"
                        type="time"
                        value={
                           session?.endTime
                              ? moment(session.endTime).local().format("HH:mm")
                              : ""
                        }
                        disabled={!isEditing || !isTutor}
                        onChange={(e) => {
                           if (!isTutor) return;
                           const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                           const endLocal = moment(session.endTime).local();
                           endLocal
                              .hour(hours)
                              .minute(minutes)
                              .second(0)
                              .millisecond(0);
                           setSession({
                              ...session,
                              endTime: endLocal.toISOString(),
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
                                 "HH:mm DD/MM/YYYY"
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
