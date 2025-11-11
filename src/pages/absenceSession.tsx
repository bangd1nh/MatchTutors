import React from "react";
import { useAbsenceSessions } from "@/hooks/useRejectedSessions";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import SessionCard from "@/components/session/SessionCard";

const AbsenceSessionPage: React.FC = () => {
   const { data: absenceSessions, isLoading, error } = useAbsenceSessions();

   if (isLoading) {
      return (
         <div className="container mx-auto p-6">
            <div className="flex items-center justify-center h-64">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="container mx-auto p-6">
            <Card>
               <CardContent className="p-6">
                  <div className="text-center text-red-600">
                     <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                     <p>Có lỗi xảy ra khi tải danh sách buổi học vắng.</p>
                  </div>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="container mx-auto p-6">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
               Buổi học vắng
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
               Danh sách các buổi học mà bạn hoặc gia sư vắng mặt
            </p>
         </div>

         {!absenceSessions || absenceSessions.length === 0 ? (
            <Card>
               <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                     <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                     <p>Không có buổi học nào vắng.</p>
                  </div>
               </CardContent>
            </Card>
         ) : (
            <div className="grid gap-4">
               {absenceSessions.map((session) => (
                  <SessionCard
                     key={session._id}
                     session={session}
                     type="absence"
                  />
               ))}
            </div>
         )}
      </div>
   );
};

export default AbsenceSessionPage;
