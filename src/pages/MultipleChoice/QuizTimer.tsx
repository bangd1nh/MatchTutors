import { useState, useEffect, useRef } from "react";
import { Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuizTimerProps {
   timeLimitMinutes: number;
   onTimeUp: () => void;
   isSubmitting: boolean;
}

const QuizTimer = ({
   timeLimitMinutes,
   onTimeUp,
   isSubmitting,
}: QuizTimerProps) => {
   const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);

   const onTimeUpRef = useRef(onTimeUp);
   onTimeUpRef.current = onTimeUp;

   const firedRef = useRef(false);
   const timerIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

   useEffect(() => {
      firedRef.current = false;
      setTimeLeft(timeLimitMinutes * 60);

      if (timerIdRef.current) {
         clearInterval(timerIdRef.current);
         timerIdRef.current = null;
      }
   }, [timeLimitMinutes]);

   useEffect(() => {
      if (timerIdRef.current) {
         clearInterval(timerIdRef.current);
         timerIdRef.current = null;
      }

      if (timeLimitMinutes <= 0 || isSubmitting) return;

      timerIdRef.current = setInterval(() => {
         setTimeLeft((prev) => {
            if (prev <= 1) {
               clearInterval(timerIdRef.current!);
               timerIdRef.current = null;

               if (!firedRef.current) {
                  firedRef.current = true;
                  setTimeout(() => onTimeUpRef.current(), 0);
               }

               return 0;
            }
            return prev - 1;
         });
      }, 1000);

      return () => {
         if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
            timerIdRef.current = null;
         }
      };
   }, [isSubmitting, timeLimitMinutes]);

   if (timeLimitMinutes <= 0) return null;

   const minutes = Math.floor(timeLeft / 60);
   const seconds = timeLeft % 60;

   const timeColor =
      timeLeft <= 60
         ? "text-red-500"
         : timeLeft <= 300
         ? "text-yellow-500"
         : "text-green-500";

   return (
      <Card className="mb-6 sticky top-20 z-50">
         <CardContent className="p-4">
            <div className="flex items-center justify-center gap-3">
               <Timer className={`h-6 w-6 ${timeColor}`} />
               <span
                  className={`text-2xl font-bold tracking-wider ${timeColor}`}
               >
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
               </span>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-1">
               Thời gian còn lại
            </p>
         </CardContent>
      </Card>
   );
};

export default QuizTimer;
