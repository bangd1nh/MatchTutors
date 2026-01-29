import { useState, useMemo } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
   Calendar,
   CheckCircle,
   XCircle,
   Clock,
   CreditCard,
   MapPin,
} from "lucide-react";
import moment from "moment";
import { useSSchedules } from "@/hooks/useSSchedules";
import {
   useInitiatePayment,
   useLearningCommitments,
} from "@/hooks/useLearningCommitment";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
   Calendar as BigCalendar,
   Event as BigCalendarEvent,
   momentLocalizer,
} from "react-big-calendar";
import { EventProps } from "react-big-calendar";
import { useQuery } from "@tanstack/react-query";
import { getMySessions } from "@/api/sessions";
import { useUser } from "@/hooks/useUser";
import { Role } from "@/types/user";

moment.locale("vi");
const localizer = momentLocalizer(moment);

interface CalendarEvent extends BigCalendarEvent {
   start: Date;
   end: Date;
   isBusy?: boolean;
   isSuggestion?: boolean;
   style?: React.CSSProperties;
}

interface SuggestionScheduleResponseProps {
   teachingRequestId: string;
   isOpen: boolean;
   onClose: () => void;
}

// Thêm helper function này trước component
const getVietnameseDayName = (date: Date) => {
   const days = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
   ];
   return days[date.getDay()];
};

export const SuggestionScheduleResponse = ({
   teachingRequestId,
   isOpen,
   onClose,
}: SuggestionScheduleResponseProps) => {
   const { user } = useUser();

   const { data: studentSessions } = useQuery({
      queryKey: ["STUDENT_SESSIONS"],
      queryFn: getMySessions,
      enabled: user?.role === Role.STUDENT,
      staleTime: 1000 * 60 * 2,
   });

   console.log("student", studentSessions);
   const [rejectReason, setRejectReason] = useState("");
   const [showRejectForm, setShowRejectForm] = useState(false);
   const { fetchSSchedules, respondSuggestion } =
      useSSchedules(teachingRequestId);
   const initiatePayment = useInitiatePayment();
   // Query LearningCommitments để tìm commitment chưa thanh toán
   const { data: commitmentsData } = useLearningCommitments(1, 100);

   const suggestion = fetchSSchedules.data?.data;
   const isLoading = fetchSSchedules.isLoading;
   const hasSuggestion = !!suggestion;

   // Tìm commitment chưa thanh toán liên quan đến teachingRequestId này
   const pendingCommitment = useMemo(() => {
      if (!commitmentsData?.items || !teachingRequestId) return null;
      return commitmentsData.items.find(
         (commitment) =>
            commitment.teachingRequest?._id === teachingRequestId &&
            commitment.status === "pending_agreement" &&
            (commitment.studentPaidAmount ?? 0) < (commitment.totalAmount ?? 0)
      );
   }, [commitmentsData, teachingRequestId]);

   // Kiểm tra xem suggestion đã ACCEPTED nhưng chưa thanh toán
   const isAcceptedButNotPaid =
      (suggestion?.status === "ACCEPTED" ||
         suggestion?.studentResponse?.status === "ACCEPTED") &&
      !!pendingCommitment;

   // Debug logging
   if (suggestion) {
      console.log("SuggestionScheduleResponse - suggestion data:", {
         _id: suggestion._id,
         status: suggestion.status,
         studentResponseStatus: suggestion.studentResponse?.status,
         schedulesCount: suggestion.schedules?.length || 0,
      });
   }

   const handleAccept = () => {
      if (!suggestion?._id) return;

      respondSuggestion.mutate(
         {
            suggestionId: suggestion._id,
            decision: "ACCEPT",
         },
         {
            onSuccess: (res) => {
               const commitmentId = res.data?.commitmentId;
               if (commitmentId) {
                  // Tự động mở link thanh toán
                  setTimeout(() => {
                     initiatePayment.mutate(commitmentId, {
                        onSuccess: (data) => {
                           window.open(data.paymentLink, "_blank");
                        },
                        onError: (err: any) => {
                           console.error("Failed to initiate payment:", err);
                        },
                     });
                  }, 500);
               }
               onClose();
            },
         }
      );
   };

   const handleReject = () => {
      if (!suggestion?._id) return;
      if (!rejectReason.trim()) {
         alert("Vui lòng nhập lý do từ chối");
         return;
      }

      respondSuggestion.mutate(
         {
            suggestionId: suggestion._id,
            decision: "REJECT",
            reason: rejectReason,
         },
         {
            onSuccess: () => {
               setRejectReason("");
               setShowRejectForm(false);
               onClose();
            },
         }
      );
   };

   const handlePay = () => {
      if (!pendingCommitment?._id) return;
      initiatePayment.mutate(pendingCommitment._id, {
         onSuccess: (data) => {
            window.open(data.paymentLink, "_blank");
         },
         onError: (err: any) => {
            console.error("Failed to initiate payment:", err);
         },
      });
   };

   const getStatusBadge = () => {
      if (!suggestion) return null;

      const status = suggestion.status || suggestion.studentResponse?.status;
      if (status === "ACCEPTED") {
         return (
            <Badge className="bg-green-500 text-white">
               <CheckCircle className="h-3 w-3 mr-1" />
               Đã đồng ý
            </Badge>
         );
      }
      if (status === "REJECTED") {
         return (
            <Badge variant="destructive">
               <XCircle className="h-3 w-3 mr-1" />
               Đã từ chối
            </Badge>
         );
      }
      return (
         <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Chờ phản hồi
         </Badge>
      );
   };

   // Lịch đã lên lịch của chính học sinh
   const studentScheduledEvents = useMemo(() => {
      const list = (studentSessions as any)?.data ?? studentSessions ?? [];
      if (!Array.isArray(list)) return [];
      return list.map((session: any) => ({
         title: session.title || "Buổi đã lên lịch",
         start: new Date(session.startTime),
         end: new Date(session.endTime),
         isBusy: false,
         isSuggestion: false,
         style: {
            backgroundColor: "#8b5cf6",
            borderColor: "#7c3aed",
            color: "#fff",
            opacity: 0.9,
         },
      })) as CalendarEvent[];
   }, [studentSessions]);

   // Tạo calendar events từ suggestion schedules, busy times và lịch đã lên lịch của học sinh
   const calendarEvents = useMemo(() => {
      const events: CalendarEvent[] = [];

      // Kiểm tra xem suggestion đã được chấp nhận chưa
      const isAccepted =
         suggestion?.status === "ACCEPTED" ||
         suggestion?.studentResponse?.status === "ACCEPTED";

      // 1. Thêm các buổi học đề xuất (suggestion schedules)
      // Chỉ hiển thị nếu chưa được chấp nhận (để tránh trùng lặp với lịch chính thức màu tím)
      if (
         !isAccepted &&
         suggestion?.schedules &&
         suggestion.schedules.length > 0
      ) {
         suggestion.schedules.forEach((schedule) => {
            events.push({
               title: `${suggestion.title}`,
               start: new Date(schedule.start),
               end: new Date(schedule.end),
               isSuggestion: true,
               isBusy: false,
               style: {
                  backgroundColor: "#3b82f6", // Blue for suggested sessions
                  borderColor: "#2563eb",
                  color: "#fff",
               },
            });
         });
      }

      // 2. Thêm các lịch bận từ suggestions của gia sư với học sinh khác
      if (
         suggestion?.tutorBusySchedules &&
         suggestion.tutorBusySchedules.length > 0
      ) {
         suggestion.tutorBusySchedules.forEach((busySchedule) => {
            if (busySchedule.schedules && busySchedule.schedules.length > 0) {
               busySchedule.schedules.forEach((schedule) => {
                  events.push({
                     title: `Gia sư bận`,
                     start: new Date(schedule.start),
                     end: new Date(schedule.end),
                     isBusy: true,
                     isSuggestion: false,
                     style: {
                        backgroundColor: "#f59e0b", // Orange for busy suggestions
                        borderColor: "#d97706",
                        color: "#fff",
                     },
                  });
               });
            }
         });
      }

      // 3. Thêm các session đã lên lịch của gia sư với học sinh khác
      if (
         suggestion?.tutorBusySessions &&
         suggestion.tutorBusySessions.length > 0
      ) {
         suggestion.tutorBusySessions.forEach((busySession) => {
            events.push({
               title: `Gia sư bận`,
               start: new Date(busySession.startTime),
               end: new Date(busySession.endTime),
               isBusy: true,
               isSuggestion: false,
               style: {
                  backgroundColor: "#ef4444", // Red for busy sessions
                  borderColor: "#dc2626",
                  color: "#fff",
               },
            });
         });
      }

      // 4. Thêm các buổi đã lên lịch của chính học sinh (màu tím)
      events.push(...studentScheduledEvents);

      return events;
   }, [suggestion, studentScheduledEvents]);

   // Custom event component để hiển thị tooltip
   const EventComponent = ({ event }: EventProps<CalendarEvent>) => {
      return (
         <div className="p-1 text-xs">
            <div className="font-semibold truncate">{event.title}</div>
            <div className="text-xs opacity-90">
               {moment(event.start).format("HH:mm")} -{" "}
               {moment(event.end).format("HH:mm")}
            </div>
         </div>
      );
   };

   // Event style getter
   const eventStyleGetter = (event: CalendarEvent) => {
      return {
         style: event.style || {},
      };
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Lịch học đề xuất
               </DialogTitle>
               <DialogDescription>
                  Gia sư đã đề xuất lịch học cho bạn. Vui lòng xem và phản hồi.
               </DialogDescription>
            </DialogHeader>

            {isLoading ? (
               <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
               </div>
            ) : !hasSuggestion ? (
               <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Gia sư chưa đề xuất lịch học</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {/* Status và Title */}
                  <div className="flex items-center justify-between">
                     <div>
                        <h3 className="font-semibold text-lg">
                           {suggestion.title || "Lịch học đề xuất"}
                        </h3>
                     </div>
                     {getStatusBadge()}
                  </div>

                  {/* Lý do từ chối nếu đã từ chối */}
                  {suggestion.studentResponse?.status === "REJECTED" &&
                     suggestion.studentResponse?.reason && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                           <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                              Lý do từ chối:
                           </p>
                           <p className="text-sm text-red-600 dark:text-red-400">
                              {suggestion.studentResponse.reason}
                           </p>
                        </div>
                     )}

                  {/* Giá đề xuất */}
                  {suggestion.proposedTotalPrice && (
                     <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                           Giá đề xuất:
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                           {suggestion.proposedTotalPrice.toLocaleString(
                              "vi-VN"
                           )}{" "}
                           VNĐ
                        </p>
                     </div>
                  )}

                  {/* Location - hiển thị location chung nếu tất cả buổi có cùng location */}
                  {(() => {
                     const firstScheduleLocation = suggestion.schedules?.[0] ? (suggestion.schedules[0] as any).location : null;
                     const allSchedulesHaveSameLocation = suggestion.schedules?.every(
                        (schedule) => (schedule as any).location === firstScheduleLocation
                     );
                     const commonLocation = suggestion.location || (allSchedulesHaveSameLocation && firstScheduleLocation) || null;
                     
                     return commonLocation ? (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                           <div className="flex items-center gap-2 mb-1">
                              <MapPin className="h-4 w-4 text-green-700 dark:text-green-300" />
                              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                 Địa điểm/Liên kết học trực tuyến:
                              </p>
                           </div>
                           <p className="text-sm text-green-600 dark:text-green-400">
                              {commonLocation}
                           </p>
                        </div>
                     ) : null;
                  })()}

                  {/* Tabs cho danh sách và lịch */}
                  <Tabs defaultValue="list" className="w-full">
                     <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="list">Danh sách</TabsTrigger>
                        <TabsTrigger value="calendar">Lịch</TabsTrigger>
                     </TabsList>

                     <TabsContent value="list" className="space-y-4">
                        {/* Danh sách lịch học */}
                        <div>
                           <Label className="text-base font-semibold mb-2 block">
                              Các buổi học ({suggestion.schedules?.length || 0}{" "}
                              buổi)
                           </Label>
                           <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-4">
                              {suggestion.schedules &&
                              suggestion.schedules.length > 0 ? (
                                 suggestion.schedules.map((schedule, index) => {
                                    const start = new Date(schedule.start);
                                    const end = new Date(schedule.end);
                                    const duration =
                                       (end.getTime() - start.getTime()) /
                                       (1000 * 60);
                                    const scheduleLocation = (schedule as any).location || suggestion?.location;
                                    return (
                                       <div
                                          key={index}
                                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                       >
                                          <div className="flex items-center gap-3 flex-1">
                                             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                                {index + 1}
                                             </div>
                                             <div className="flex-1">
                                                <p className="font-medium">
                                                   {getVietnameseDayName(start)}
                                                   ,{" "}
                                                   {moment(start).format(
                                                      "DD/MM/YYYY"
                                                   )}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                   {moment(start).format(
                                                      "HH:mm"
                                                   )}{" "}
                                                   -{" "}
                                                   {moment(end).format("HH:mm")}{" "}
                                                   ({duration} phút)
                                                </p>
                                                {scheduleLocation && (
                                                   <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                                      <MapPin className="h-3 w-3" />
                                                      <span>{scheduleLocation}</span>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                       </div>
                                    );
                                 })
                              ) : (
                                 <p className="text-muted-foreground text-center py-4">
                                    Chưa có lịch học
                                 </p>
                              )}
                           </div>
                        </div>
                     </TabsContent>

                     <TabsContent value="calendar" className="space-y-4">
                        {/* Calendar view */}
                        <div>
                           <Label className="text-base font-semibold mb-2 block">
                              Lịch học và lịch bận của gia sư
                           </Label>
                           <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
                              <div className="mb-4 flex flex-wrap gap-4 text-sm">
                                 <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                                    <span>Lịch học đề xuất</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-orange-500"></div>
                                    <span>
                                       Gia sư bận (đề xuất với học sinh khác)
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-red-500"></div>
                                    <span>
                                       Gia sư bận (buổi học đã lên lịch)
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-purple-500"></div>
                                    <span>Buổi đã lên lịch của bạn</span>
                                 </div>
                              </div>
                              <div style={{ height: "500px" }}>
                                 <BigCalendar
                                    localizer={localizer}
                                    events={calendarEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ height: "100%" }}
                                    defaultView="week"
                                    views={["month", "week", "day"]}
                                    eventPropGetter={eventStyleGetter}
                                    components={{
                                       event: EventComponent,
                                    }}
                                    messages={{
                                       next: "Tiếp",
                                       previous: "Trước",
                                       today: "Hôm nay",
                                       month: "Tháng",
                                       week: "Tuần",
                                       day: "Ngày",
                                       agenda: "Lịch trình",
                                       date: "Ngày",
                                       time: "Giờ",
                                       event: "Sự kiện",
                                       noEventsInRange:
                                          "Không có sự kiện trong khoảng thời gian này",
                                    }}
                                 />
                              </div>
                           </div>
                        </div>
                     </TabsContent>
                  </Tabs>

                  {/* Form từ chối */}
                  {showRejectForm && (
                     <div className="space-y-2">
                        <Label htmlFor="rejectReason">
                           Lý do từ chối <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                           id="rejectReason"
                           value={rejectReason}
                           onChange={(e) => setRejectReason(e.target.value)}
                           placeholder="Vui lòng nhập lý do từ chối lịch học này..."
                           rows={4}
                           className="resize-none"
                        />
                        <div className="flex gap-2">
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                 setShowRejectForm(false);
                                 setRejectReason("");
                              }}
                           >
                              Hủy
                           </Button>
                           <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleReject}
                              disabled={
                                 !rejectReason.trim() ||
                                 respondSuggestion.isPending
                              }
                           >
                              {respondSuggestion.isPending ? (
                                 <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Đang gửi...
                                 </>
                              ) : (
                                 "Xác nhận từ chối"
                              )}
                           </Button>
                        </div>
                     </div>
                  )}

                  {/* Actions */}
                  {/* Hiển thị nút "Thanh toán" nếu đã ACCEPTED nhưng chưa thanh toán */}
                  {isAcceptedButNotPaid && (
                     <div className="flex gap-3 pt-4">
                        <Button
                           onClick={handlePay}
                           disabled={initiatePayment.isPending}
                           className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                           {initiatePayment.isPending ? (
                              <>
                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                 Đang tạo link thanh toán...
                              </>
                           ) : (
                              <>
                                 <CreditCard className="h-4 w-4 mr-2" />
                                 Thanh toán ngay
                              </>
                           )}
                        </Button>
                     </div>
                  )}

                  {/* Hiển thị nút khi suggestion ở trạng thái PENDING và học sinh chưa phản hồi */}
                  {(suggestion.status === "PENDING" ||
                     !suggestion.studentResponse?.status ||
                     suggestion.studentResponse?.status === "PENDING") &&
                     suggestion.studentResponse?.status !== "ACCEPTED" &&
                     suggestion.studentResponse?.status !== "REJECTED" &&
                     !showRejectForm &&
                     !isAcceptedButNotPaid && (
                        <div className="flex gap-3 pt-4">
                           <Button
                              onClick={handleAccept}
                              disabled={
                                 respondSuggestion.isPending ||
                                 initiatePayment.isPending
                              }
                              className="flex-1"
                           >
                              {respondSuggestion.isPending ||
                              initiatePayment.isPending ? (
                                 <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Đang xử lý...
                                 </>
                              ) : (
                                 <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Đồng ý lịch học
                                 </>
                              )}
                           </Button>
                           <Button
                              variant="destructive"
                              onClick={() => setShowRejectForm(true)}
                              disabled={respondSuggestion.isPending}
                              className="flex-1"
                           >
                              <XCircle className="h-4 w-4 mr-2" />
                              Từ chối
                           </Button>
                        </div>
                     )}
               </div>
            )}

            <DialogFooter>
               <Button variant="outline" onClick={onClose}>
                  Đóng
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
