import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tutor } from "@/types/tutorListandDetail";
import { Calendar, Check, X } from "lucide-react";

interface TutorAvailabilityProps {
   tutor: Tutor;
}

export function TutorAvailability({ tutor }: TutorAvailabilityProps) {
   const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
   const dayFullNames = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
   ];

   const timeSlotLabels: { [key: string]: string } = {
      PRE_12: "Sáng (<12h)",
      MID_12_17: "Chiều (12h-17h)",
      AFTER_17: "Tối (>17h)",
   };

   const availabilityGrid = () => {
      const grid: { [key: string]: boolean } = {};
      (tutor.availability || []).forEach(({ dayOfWeek, slots }) => {
         (slots || []).forEach((slot) => {
            grid[`${dayOfWeek}-${slot}`] = true;
         });
      });
      return grid;
   };

   const grid = availabilityGrid();

   return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
         <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-medium text-sky-800">
               <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-sky-600" />
               </div>
               Lịch có thể dạy
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="overflow-x-auto">
               <div className="min-w-full">
                  {/* Header */}
                  <div className="grid grid-cols-8 gap-2 mb-4">
                     <div className="text-sm font-medium text-gray-700 p-3">
                        Khung giờ
                     </div>
                     {dayNames.map((day, index) => (
                        <div
                           key={day}
                           className="text-center p-3 bg-gray-50 rounded-lg"
                           title={dayFullNames[index]}
                        >
                           <div className="text-sm font-medium text-gray-900">
                              {day}
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Time slots */}
                  <div className="space-y-3">
                     {Object.entries(timeSlotLabels).map(([slotKey, label]) => (
                        <div key={slotKey} className="grid grid-cols-8 gap-2">
                           <div className="text-sm font-medium text-gray-700 p-3 flex items-center min-w-0">
                              <span className="break-words">{label}</span>
                           </div>
                           {dayNames.map((_, dayIndex) => (
                              <div
                                 key={dayIndex}
                                 className={`p-3 rounded-lg flex items-center justify-center transition-colors ${
                                    grid[`${dayIndex}-${slotKey}`]
                                       ? "bg-green-50 border border-green-200"
                                       : "bg-gray-50 border border-gray-200"
                                 }`}
                              >
                                 {grid[`${dayIndex}-${slotKey}`] ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                 ) : (
                                    <X className="w-5 h-5 text-gray-400" />
                                 )}
                              </div>
                           ))}
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
               <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Có thể dạy</span>
               </div>
               <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-gray-400" />
                  <span>Không có lịch</span>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
