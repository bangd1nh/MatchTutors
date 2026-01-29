import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface TimePickerInputProps {
   value: Date;
   onChange: (date: Date) => void;
   format?: string;
}

export const TimePickerInput = ({ value, onChange }: TimePickerInputProps) => {
   const [isOpen, setIsOpen] = useState(false);
   const pickerRef = useRef<HTMLDivElement>(null);
   const buttonRef = useRef<HTMLButtonElement>(null);

   if (!value || isNaN(value.getTime())) return null;

   const hours = value.getHours().toString().padStart(2, "0");
   const minutes = value.getMinutes().toString().padStart(2, "0");
   const period = parseInt(hours) < 12 ? "AM" : "PM";

   const handleHourChange = (newHour: number) => {
      const newDate = new Date(value);
      newDate.setHours(newHour);
      onChange(newDate);
   };

   const handleMinuteChange = (newMinute: number) => {
      const newDate = new Date(value);
      newDate.setMinutes(newMinute);
      onChange(newDate);
   };

   const togglePeriod = () => {
      const newDate = new Date(value);
      const currentHour = newDate.getHours();
      const newHour = (currentHour + 12) % 24;
      newDate.setHours(newHour);
      onChange(newDate);
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            pickerRef.current &&
            !pickerRef.current.contains(event.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target as Node)
         ) {
            setIsOpen(false);
         }
      };

      if (isOpen) {
         document.addEventListener("mousedown", handleClickOutside);
         return () => {
            document.removeEventListener("mousedown", handleClickOutside);
         };
      }
   }, [isOpen]);

   return (
      <div className="relative w-full">
         <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-2 py-1.5 border rounded-md bg-background text-xs font-medium hover:bg-accent transition-colors"
         >
            {hours}:{minutes} {period}
         </button>

         {isOpen && (
            <div
               ref={pickerRef}
               className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-2 z-50 dark:bg-slate-950 dark:border-slate-700"
               style={{
                  width: "160px",
               }}
            >
               <div className="space-y-2">
                  {/* Hours */}
                  <div className="space-y-1">
                     <label className="text-xs font-semibold block">Giờ</label>
                     <div className="flex items-center justify-between gap-0.5">
                        <Button
                           type="button"
                           size="sm"
                           variant="outline"
                           onClick={() =>
                              handleHourChange((parseInt(hours) - 1 + 24) % 24)
                           }
                           className="h-6 w-6 p-0 flex-shrink-0"
                        >
                           <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Input
                           type="number"
                           min="0"
                           max="23"
                           value={hours}
                           onChange={(e) =>
                              handleHourChange(
                                 Math.min(
                                    23,
                                    Math.max(0, parseInt(e.target.value) || 0)
                                 )
                              )
                           }
                           className="h-6 text-xs px-1 flex-1 text-center"
                        />
                        <Button
                           type="button"
                           size="sm"
                           variant="outline"
                           onClick={() =>
                              handleHourChange((parseInt(hours) + 1) % 24)
                           }
                           className="h-6 w-6 p-0 flex-shrink-0"
                        >
                           <ChevronUp className="h-3 w-3" />
                        </Button>
                     </div>
                  </div>

                  {/* Minutes */}
                  <div className="space-y-1">
                     <label className="text-xs font-semibold block">Phút</label>
                     <div className="flex items-center justify-between gap-0.5">
                        <Button
                           type="button"
                           size="sm"
                           variant="outline"
                           onClick={() =>
                              handleMinuteChange(
                                 (parseInt(minutes) - 5 + 60) % 60
                              )
                           }
                           className="h-6 w-6 p-0 flex-shrink-0"
                        >
                           <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Input
                           type="number"
                           min="0"
                           max="59"
                           value={minutes}
                           onChange={(e) =>
                              handleMinuteChange(
                                 Math.min(
                                    59,
                                    Math.max(0, parseInt(e.target.value) || 0)
                                 )
                              )
                           }
                           className="h-6 text-xs px-1 flex-1 text-center"
                        />
                        <Button
                           type="button"
                           size="sm"
                           variant="outline"
                           onClick={() =>
                              handleMinuteChange((parseInt(minutes) + 5) % 60)
                           }
                           className="h-6 w-6 p-0 flex-shrink-0"
                        >
                           <ChevronUp className="h-3 w-3" />
                        </Button>
                     </div>
                  </div>

                  {/* AM/PM Toggle */}
                  <div className="space-y-1">
                     <label className="text-xs font-semibold block">Buổi</label>
                     <Button
                        type="button"
                        onClick={togglePeriod}
                        className="w-full h-6 text-xs font-bold"
                        variant={period === "AM" ? "default" : "secondary"}
                     >
                        {period}
                     </Button>
                  </div>

                  {/* Close button */}
                  <Button
                     type="button"
                     size="sm"
                     onClick={() => setIsOpen(false)}
                     className="w-full h-6 text-xs mt-1"
                  >
                     Xong
                  </Button>
               </div>
            </div>
         )}
      </div>
   );
};
