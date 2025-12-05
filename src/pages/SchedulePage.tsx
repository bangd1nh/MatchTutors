import { SessionCalendar } from "@/components/schedule/SessionCalendar";
import { useMySessions } from "@/hooks/useSessions";
import { Loader2, Plus } from "lucide-react";

import { useState } from "react";
import { SessionFormDialog } from "@/components/schedule/SessionFormDialog";
import { useUser } from "@/hooks/useUser";
import { Role } from "@/enums/role.enum";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SchedulePage = () => {
   const { data: sessions, isLoading, isError } = useMySessions();
   const [openCreate, setOpenCreate] = useState(false);
   const { user } = useUser();

   if (isLoading) {
      return (
         <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
         </div>
      );
   }

   if (isError) {
      return (
         <div className="flex flex-1 items-center justify-center text-destructive">
            Lỗi! Không thể tải dữ liệu lịch học.
         </div>
      );
   }

   const isEmpty = !sessions || sessions.length === 0;

   return (
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
         <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Lịch học</h1>
            <p className="text-muted-foreground mt-1">
               Quản lý và xem tất cả các buổi học của bạn.
            </p>
         </div>

         {user?.role === Role.TUTOR && (
            <div className="flex items-center justify-end">
               <Button onClick={() => setOpenCreate(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tạo buổi học
               </Button>
            </div>
         )}

         <Card className="flex-1 p-4 bg-card text-card-foreground">
            {isEmpty && (
               <div className="mb-4 text-center">
                  <p className="text-xl font-medium text-foreground">Chưa có lịch học.</p>
                  <p className="text-muted-foreground mt-2">
                     Bạn chưa có buổi học nào — nhấn "Tạo buổi học" để thêm.
                  </p>
               </div>
            )}
            <SessionCalendar />
         </Card>

         {user?.role === Role.TUTOR && (
            <SessionFormDialog
               isOpen={openCreate}
               onClose={() => setOpenCreate(false)}
            />
         )}
      </div>
   );
};

export default SchedulePage;
