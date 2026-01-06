import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Calendar as BigCalendar,
   momentLocalizer,
   Views,
} from "react-big-calendar";
import moment from "moment";
import "moment/locale/vi"; // Import locale tiếng Việt
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTutorSessions, TutorSession, AvailabilitySlot } from "@/api/tutorListAndDetail";

// Cấu hình moment với locale tiếng Việt
moment.locale("vi");
const localizer = momentLocalizer(moment);

// Cấu hình theo chuẩn Việt Nam: Tuần bắt đầu từ Thứ 2
moment.updateLocale("vi", {
   months: [
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
   ],
   monthsShort: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
   ],
   weekdays: [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
   ],
   weekdaysShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
   weekdaysMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
   week: {
      dow: 1, // Thứ 2 (1) là ngày đầu tuần (chuẩn Việt Nam/ISO)
      doy: 4, // Tuần chứa 4 tháng 1 là tuần đầu tiên của năm
   },
});

const messages = {
   allDay: "Cả ngày",
   previous: "Trước",
   next: "Sau",
   today: "Hôm nay",
   month: "Tháng",
   week: "Tuần",
   day: "Ngày",
   agenda: "Lịch biểu",
   date: "Ngày",
   time: "Thời gian",
   event: "Sự kiện",
   noEventsInRange: "Không có lịch dạy nào trong khoảng thời gian này.",
   work_week: "Tuần làm việc",
   showMore: (total: number) => `+${total} buổi học khác`,
};

interface TutorTeachingScheduleProps {
   tutorId: string;
   tutorName: string;
   tutorAvailability?: Array<{
      dayOfWeek: number; // 1-7 (1=Thứ 2, 7=Chủ nhật)
      timeSlots?: string[];
      slots?: string[];
   }>;
}

interface CalendarEvent {
   title: string;
   start: Date;
   end: Date;
   resource: TutorSession | { type: "availability"; dayOfWeek: number; slot: AvailabilitySlot };
   style?: React.CSSProperties;
   isAvailable?: boolean; // Đánh dấu là lịch rảnh
}

const timeFrameMap: Record<string, { start: number; end: number; order: number }> = {
   PRE_12: { start: 7, end: 12, order: 1 },
   MID_12_17: { start: 12, end: 17, order: 2 },
   AFTER_17: { start: 17, end: 22, order: 3 },
};


export function TutorTeachingSchedule({
   tutorId,
   tutorName: _tutorName,
   tutorAvailability = [],
}: TutorTeachingScheduleProps) {
   const [currentView, setCurrentView] = useState<"month" | "week">("month");
   
   const getInitialDate = () => {
      const today = moment();
      const dayOfWeek = today.day();
      
      if (dayOfWeek >= 3 || dayOfWeek === 0) {
         return today.clone().add(1, 'week').startOf('isoWeek').toDate();
      }
      
      return today.toDate();
   };
   
   const [currentDate, setCurrentDate] = useState(getInitialDate());

   const dateRange = useMemo(() => {
      let start: Date, end: Date;
      const now = new Date();

      if (currentView === "month") {
         const currentMonthDate = moment(currentDate);
         const today = moment(now);
         
         if (currentMonthDate.isSame(today, 'month') && today.date() > 20) {
            currentMonthDate.add(1, 'month');
         }
         
         start = currentMonthDate.clone().startOf('month').toDate();
         start.setHours(0, 0, 0, 0);
         end = currentMonthDate.clone().endOf('month').toDate();
         end.setHours(23, 59, 59, 999);
      } else {
         const momentDate = moment(currentDate);
         const today = moment(now);
         
         if (momentDate.isSame(today, 'isoWeek')) {
            const currentDay = today.isoWeekday();
            if (currentDay >= 3) {
               momentDate.add(1, 'week');
            }
         }
         
         const startMoment = momentDate.clone().startOf('isoWeek');
         const endMoment = momentDate.clone().endOf('isoWeek');
         
         start = startMoment.toDate();
         start.setHours(0, 0, 0, 0);
         end = endMoment.toDate();
         end.setHours(23, 59, 59, 999);
      }

      return {
         startDate: start.toISOString(),
         endDate: end.toISOString(),
      };
   }, [currentView, currentDate]);

   const { data, isLoading, error } = useQuery({
      queryKey: [
         "tutorSessions",
         tutorId,
         currentView,
         dateRange.startDate,
         dateRange.endDate,
      ],
      queryFn: () =>
         getTutorSessions(tutorId, {
            view: currentView,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
         }),
      staleTime: 5 * 60 * 1000,
   });

   const availabilityEvents: CalendarEvent[] = useMemo(() => {
      if (currentView !== "week") return [];

      const baseAvailability = (tutorAvailability && tutorAvailability.length > 0)
         ? tutorAvailability 
         : (data?.tutor?.availability || []);
      
      if (baseAvailability.length === 0) return [];

      const events: CalendarEvent[] = [];
      const start = moment(dateRange.startDate).local();
      const end = moment(dateRange.endDate).local();
      const apiAvailabilityMap = new Map<number, Map<string, { freeHours?: number; freeMinutes?: number }>>();
      if (data?.tutor?.availability) {
         data.tutor.availability.forEach((avail: any) => {
            const slotMap = new Map<string, { freeHours?: number; freeMinutes?: number }>();
            if (avail.slots) {
               avail.slots.forEach((slot: any) => {
                  const timeFrameKey = typeof slot === "string" ? slot : slot.timeFrame;
                  if (timeFrameKey) {
                     slotMap.set(timeFrameKey, {
                        freeHours: typeof slot === "object" ? slot.freeHours : undefined,
                        freeMinutes: typeof slot === "object" ? slot.freeMinutes : undefined,
                     });
                  }
               });
            }
            apiAvailabilityMap.set(avail.dayOfWeek, slotMap);
         });
      }


      const convertToISO = (dow: number): number => {
         if (dow === 0) return 7;
         if (dow >= 1 && dow <= 6) return dow;
         return dow;
      };

      let current = start.clone();
      while (current.isSameOrBefore(end, "day")) {
         const dayOfWeekISO = current.isoWeekday();
         
         const dayAvailability = baseAvailability.find(
            (avail) => {
               const availDow = avail.dayOfWeek;
               return availDow === dayOfWeekISO || convertToISO(availDow) === dayOfWeekISO;
            }
         );

         if (dayAvailability) {
            let timeSlots: string[] = [];
            if ('timeSlots' in dayAvailability && Array.isArray(dayAvailability.timeSlots)) {
               timeSlots = dayAvailability.timeSlots.filter((s): s is string => typeof s === 'string');
            } else if ('slots' in dayAvailability && Array.isArray(dayAvailability.slots)) {
               timeSlots = dayAvailability.slots.filter((s): s is string => typeof s === 'string');
            }
            
            const sortedTimeSlots = [...timeSlots].sort((a: string, b: string) => {
               const aOrder = timeFrameMap[a]?.order || 999;
               const bOrder = timeFrameMap[b]?.order || 999;
               return aOrder - bOrder;
            });
            
            let apiSlotInfo = apiAvailabilityMap.get(dayOfWeekISO);
            if (!apiSlotInfo) {
               for (const [dow, slotMap] of apiAvailabilityMap.entries()) {
                  if (convertToISO(dow) === dayOfWeekISO) {
                     apiSlotInfo = slotMap;
                     break;
                  }
               }
            }

            sortedTimeSlots.forEach((timeFrameKey: string) => {
               if (timeFrameKey && timeFrameMap[timeFrameKey]) {
                  const timeFrame = timeFrameMap[timeFrameKey];
                  
                  const apiInfo = apiSlotInfo?.get(timeFrameKey);
                  const freeHours = apiInfo?.freeHours;
                  const freeMinutes = apiInfo?.freeMinutes;
                  const slotStartMoment = current
                     .clone()
                     .hour(timeFrame.start)
                     .minute(0)
                     .second(0)
                     .millisecond(0);

                  const slotEndMoment = current
                     .clone()
                     .hour(timeFrame.end)
                     .minute(0)
                     .second(0)
                     .millisecond(0);

                  const slotStart = new Date(
                     slotStartMoment.year(),
                     slotStartMoment.month(),
                     slotStartMoment.date(),
                     slotStartMoment.hour(),
                     slotStartMoment.minute(),
                     slotStartMoment.second()
                  );

                  const slotEnd = new Date(
                     slotEndMoment.year(),
                     slotEndMoment.month(),
                     slotEndMoment.date(),
                     slotEndMoment.hour(),
                     slotEndMoment.minute(),
                     slotEndMoment.second()
                  );

                  let hasFreeTime = true;
                  if (freeHours !== undefined || freeMinutes !== undefined) {
                     hasFreeTime = (freeHours !== undefined && freeHours > 0) || 
                                   (freeMinutes !== undefined && freeMinutes > 0);
                  }

                  if (!hasFreeTime) {
                     return;
                  }
                  const startTimeStr = moment(slotStart).format("HH:mm");
                  const endTimeStr = moment(slotEnd).format("HH:mm");
                  
                  events.push({
                     title: `${startTimeStr} - ${endTimeStr}`,
                     start: slotStart,
                     end: slotEnd,
                     resource: {
                        type: "availability",
                        dayOfWeek: dayOfWeekISO,
                        slot: { timeFrame: timeFrameKey, freeHours, freeMinutes },
                     } as any,
                     isAvailable: true,
                        style: {
                           backgroundColor: "#86efac",
                           borderColor: "#22c55e",
                           color: "#166534",
                           borderStyle: "dashed",
                           borderWidth: "2px",
                           width: "100%",
                           left: "0px",
                           marginLeft: "0px",
                           marginRight: "0px",
                           paddingLeft: "0px",
                           paddingRight: "0px",
                        },
                  });
               }
            });
         }

         current.add(1, "day");
      }

      return events;
   }, [tutorAvailability, data?.tutor?.availability, dateRange.startDate, dateRange.endDate, currentView]);

   const sessionEvents: CalendarEvent[] = useMemo(() => {
      if (!data?.sessions) return [];

      return data.sessions.map((session) => {
         const backgroundColor = "#ef4444";
         const startMoment = moment(session.startTime);
         const endMoment = moment(session.endTime);
         
         const startDate = new Date(
            startMoment.year(),
            startMoment.month(),
            startMoment.date(),
            startMoment.hour(),
            startMoment.minute(),
            startMoment.second()
         );
         
         const endDate = new Date(
            endMoment.year(),
            endMoment.month(),
            endMoment.date(),
            endMoment.hour(),
            endMoment.minute(),
            endMoment.second()
         );
         const startTimeStr = moment(startDate).format("HH:mm");
         const endTimeStr = moment(endDate).format("HH:mm");
         
         return {
            title: `${startTimeStr} - ${endTimeStr}`,
            start: startDate,
            end: endDate,
            resource: session,
            isAvailable: false,
            style: {
               backgroundColor,
               borderColor: backgroundColor,
               color: "#fff",
               borderStyle: "solid",
               width: "100%",
               left: "0px",
               marginLeft: "0px",
               marginRight: "0px",
               paddingLeft: "0px",
               paddingRight: "0px",
               zIndex: 10,
               position: "relative",
            },
         };
      });
   }, [data?.sessions]);

   const events = sessionEvents;
   const backgroundEvents = availabilityEvents;

   const eventPropGetter = (event: CalendarEvent) => {
      const baseStyle = event.style || {};
      
      if (event.isAvailable) {
         return {
            style: {
               ...baseStyle,
               width: "100%",
               left: "0px",
               marginLeft: "0px",
               marginRight: "0px",
               paddingLeft: "0px",
               paddingRight: "0px",
               boxSizing: "border-box" as const,
               zIndex: 1,
            } as React.CSSProperties,
         };
      }
      const style: React.CSSProperties = {
         ...baseStyle,
         width: "100%",
         left: "0px",
         marginLeft: "0px",
         marginRight: "0px",
         paddingLeft: "0px",
         paddingRight: "0px",
         boxSizing: "border-box" as const,
         zIndex: 10,
         position: "relative",
      };

      return { style };
   };

   if (error) {
      return (
         <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
               <div className="text-center text-red-500">
                  Không thể tải lịch dạy. Vui lòng thử lại sau.
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
         <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
               <CardTitle className="flex items-center gap-3 text-xl font-medium text-sky-800">
                  <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                     <CalendarIcon className="w-4 h-4 text-sky-600" />
                  </div>
                  Lịch dạy của gia sư
               </CardTitle>
               {data && dateRange && (
                  <div className="text-sm text-gray-600">
                     {currentView === "month" ? (
                        <span>
                           {moment(dateRange.startDate).format("MM/YYYY")}
                        </span>
                     ) : (
                        <span>
                           {moment(dateRange.startDate).format("DD/MM")} -{" "}
                           {moment(dateRange.endDate).format("DD/MM/YYYY")}
                        </span>
                     )}
                  </div>
               )}
            </div>
         </CardHeader>
         <CardContent>
            <div className="space-y-4">
               {isLoading ? (
                     <div className="flex items-center justify-center h-96">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-4">Đang tải lịch dạy...</span>
                     </div>
                  ) : (
                     <>
                        <div className="h-[500px] border rounded-lg overflow-hidden">
                           <style>{`
                              .rbc-header {
                                 white-space: pre-line;
                                 line-height: 1.4;
                                 padding: 8px 4px;
                                 font-weight: 500;
                                 display: flex;
                                 flex-direction: column;
                                 align-items: center;
                                 justify-content: center;
                              }
                              .rbc-time-header-content {
                                 border-left: 1px solid #ddd;
                              }
                              .rbc-day-header {
                                 font-weight: 600;
                                 font-size: 0.875rem;
                                 white-space: pre-line;
                                 text-align: center;
                              }
                           `}</style>
                           <BigCalendar
                              localizer={localizer}
                              events={events}
                              backgroundEvents={backgroundEvents}
                              culture="vi"
                              messages={messages}
                              view={currentView}
                              views={[Views.MONTH, Views.WEEK]}
                              onView={(view) => {
                                 const newView = view as "month" | "week";
                                 setCurrentView(newView);
                              }}
                              date={currentDate}
                              onNavigate={(date) => {
                                 setCurrentDate(date as Date);
                              }}
                              eventPropGetter={eventPropGetter}
                              startAccessor="start"
                              endAccessor="end"
                              titleAccessor="title"
                              style={{ height: "100%" }}
                              min={currentView === "week" ? new Date(1970, 0, 1, 7, 0, 0) : undefined}
                              max={currentView === "week" ? new Date(1970, 0, 1, 22, 0, 0) : undefined}
                              step={60}
                              timeslots={1}
                              dayLayoutAlgorithm="no-overlap"
                              formats={{
                                 dayHeaderFormat: (date, culture, localizer) => {
                                    if (!localizer) return "";
                                    const dayName = localizer.format(date, "dddd", culture);
                                    const dayDate = localizer.format(date, "DD/MM", culture);
                                    return `${dayName}\n${dayDate}`;
                                 },
                                 dayFormat: (date, culture, localizer) =>
                                    localizer?.format(date, "DD", culture) || "",
                                 weekdayFormat: (date, culture, localizer) => {
                                    if (!localizer) return "";
                                    const dayName = localizer.format(date, "dddd", culture);
                                    const dayDate = localizer.format(date, "DD/MM", culture);
                                    return `${dayName}\n${dayDate}`;
                                 },
                                 monthHeaderFormat: (date, culture, localizer) =>
                                    localizer?.format(date, "MMMM YYYY", culture) || "",
                                 timeGutterFormat: (date, culture, localizer) => {
                                    if (!localizer) return "";
                                    return localizer.format(date, "HH:mm", culture);
                                 },
                                 eventTimeRangeFormat: () => "",
                              }}
                           />
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm pt-4 border-t">
                           <div className="flex items-center gap-2">
                              <div
                                 className="w-4 h-4 rounded border-2"
                                 style={{ 
                                    backgroundColor: "#ef4444",
                                    borderColor: "#ef4444",
                                 }}
                              />
                              <span>Lịch dạy</span>
                           </div>
                           {currentView === "week" && (
                              <div className="flex items-center gap-2">
                                 <div
                                    className="w-4 h-4 rounded border-2"
                                    style={{ 
                                       backgroundColor: "#86efac",
                                       borderColor: "#22c55e",
                                       borderStyle: "dashed",
                                    }}
                                 />
                                 <span>Lịch rảnh (có thể đăng ký)</span>
                              </div>
                           )}
                        </div>

                        {data && (!data.sessions || data.sessions.length === 0) && availabilityEvents.length === 0 && (
                           <div className="text-center py-8 text-gray-500">
                              <p>Gia sư chưa có lịch dạy trong khoảng thời gian này.</p>
                              {import.meta.env.DEV && (
                                 <p className="text-xs mt-2 text-gray-400">
                                    ({moment(dateRange.startDate).format('DD/MM/YYYY')} - {moment(dateRange.endDate).format('DD/MM/YYYY')})
                                 </p>
                              )}
                           </div>
                        )}
                        {((data?.sessions && data.sessions.length > 0) || availabilityEvents.length > 0) && (
                           <div className="text-sm text-gray-600 space-y-1">
                              {data?.sessions && data.sessions.length > 0 && (
                                 <p>
                                    📚 <strong>{data.sessions.length}</strong>{" "}
                                    buổi học đã lên lịch
                                 </p>
                              )}
                              {currentView === "week" && availabilityEvents.length > 0 && (
                                 <p>
                                    ✅ <strong>{availabilityEvents.length}</strong>{" "}
                                    khung giờ rảnh có thể đăng ký
                                 </p>
                              )}
                              {import.meta.env.DEV && (
                                 <p className="text-xs text-gray-400 mt-2">
                                    ({moment(dateRange.startDate).format('DD/MM/YYYY')} - {moment(dateRange.endDate).format('DD/MM/YYYY')})
                                 </p>
                              )}
                           </div>
                        )}
                     </>
               )}
            </div>
         </CardContent>
      </Card>
   );
}
