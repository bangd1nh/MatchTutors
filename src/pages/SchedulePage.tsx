import { SessionCalendar } from "@/components/schedule/SessionCalendar";
import { useMySessions } from "@/hooks/useSessions";
import { Loader2 } from "lucide-react";

import { useState } from "react";
import { SessionFormDialog } from "@/components/schedule/SessionFormDialog";
import { useUser } from "@/hooks/useUser";
import { Role } from "@/enums/role.enum";

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
         <div className="flex flex-1 items-center justify-center text-red-500">
            Lỗi! Không thể tải dữ liệu lịch học.
         </div>
      );
   }

   const isEmpty = !sessions || sessions.length === 0;

   return (
      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Lịch học</h1>
            <p className="text-muted-foreground mt-1">
               Quản lý và xem tất cả các buổi học của bạn.
            </p>
         </div>

         {/* {user?.role === Role.TUTOR && (
            <div className="flex items-center justify-end">
               <Button onClick={() => setOpenCreate(true)}>Tạo buổi học</Button>
            </div>
         )} */}

         <div className="flex-1 p-4 bg-white rounded-lg shadow-sm">
            {isEmpty && (
               <div className="mb-4 text-center">
                  <p className="text-xl font-medium">Chưa có lịch học.</p>
                  <p className="text-muted-foreground mt-2">
                     Bạn chưa có buổi học nào — nhấn "Tạo buổi học" để thêm.
                  </p>
               </div>
            )}
            <SessionCalendar />
         </div>

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
