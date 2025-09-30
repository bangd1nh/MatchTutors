import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ToolbarProps } from "react-big-calendar";

export const CalendarToolbar = (toolbar: ToolbarProps) => {
   const goToBack = () => toolbar.onNavigate("PREV");
   const goToNext = () => toolbar.onNavigate("NEXT");
   const goToCurrent = () => toolbar.onNavigate("TODAY");

   const view = toolbar.view;

   return (
      <div className="flex items-center justify-between p-2 mb-4 bg-gray-50 rounded-md">
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToCurrent}>
               Hôm nay
            </Button>
            <Button variant="ghost" size="icon" onClick={goToBack}>
               <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNext}>
               <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold text-gray-700">
               {toolbar.label}
            </span>
         </div>
         <div className="flex items-center gap-2">
            {(toolbar.views as string[]).map((viewName) => (
               <Button
                  key={viewName}
                  variant={view === viewName ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => toolbar.onView(viewName as any)}
               >
                  {viewName === "month"
                     ? "Tháng"
                     : viewName === "week"
                     ? "Tuần"
                     : "Ngày"}
               </Button>
            ))}
         </div>
      </div>
   );
};
