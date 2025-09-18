import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableRow, TableCell } from "@/components/ui/table";
import type { Tutor } from "@/types/tutorListandDetail";
import { Check, Minus } from "lucide-react";

interface TutorAvailabilityProps {
   tutor: Tutor;
}

export function TutorAvailability({ tutor }: TutorAvailabilityProps) {
   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

   const timeSlotLabels: { [key: string]: string } = {
      PRE_12: "PRE 12PM",
      MID_12_17: "12PM-5PM",
      AFTER_17: "AFTER 5PM",
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
      <Card>
         <CardHeader>
            <CardTitle>Availability</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="overflow-x-auto">
               <table className="w-full border-collapse">
                  <thead>
                     <tr>
                        <th className="text-left p-2 border-b font-medium">
                           Time
                        </th>
                        {dayNames.map((day) => (
                           <th
                              key={day}
                              className="text-center p-2 border-b font-medium min-w-[60px]"
                           >
                              {day}
                           </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     {Object.entries(timeSlotLabels).map(([slotKey, label]) => (
                        <TableRow key={slotKey}>
                           <TableCell className="p-2 border-b text-sm font-medium">
                              {label}
                           </TableCell>
                           {dayNames.map((_, dayIndex) => (
                              <TableCell
                                 key={dayIndex}
                                 className={`p-2 border-b text-center`}
                              >
                                 {grid[`${dayIndex}-${slotKey}`] ? (
                                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                                 ) : (
                                    <Minus className="w-4 h-4 text-gray-400 mx-auto" />
                                 )}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>
   );
}
