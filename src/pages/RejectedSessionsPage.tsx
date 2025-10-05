import React, { useState } from "react";
import { useRejectedSessions, useCancelledSessions } from "@/hooks/useRejectedSessions";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import SessionCard from "@/components/session/SessionCard";

const RejectedSessionsPage: React.FC = () => {
   const { data: rejectedSessions, isLoading: rejectedLoading, error: rejectedError } = useRejectedSessions();
   const { data: cancelledSessions, isLoading: cancelledLoading, error: cancelledError } = useCancelledSessions();
   const [activeTab, setActiveTab] = useState("rejected");

   const isLoading = rejectedLoading || cancelledLoading;
   const hasError = rejectedError || cancelledError;

   if (isLoading) {
      return (
         <div className="container mx-auto p-6">
            <div className="flex items-center justify-center h-64">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
         </div>
      );
   }

   if (hasError) {
      return (
         <div className="container mx-auto p-6">
            <Card>
               <CardContent className="p-6">
                  <div className="text-center text-red-600">
                     <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                     <p>Có lỗi xảy ra khi tải danh sách buổi học.</p>
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
               Buổi học không thành công
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
               Danh sách các buổi học đã bị từ chối hoặc hủy bỏ
            </p>
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value="rejected">
                  Buổi học bị từ chối ({rejectedSessions?.length || 0})
               </TabsTrigger>
               <TabsTrigger value="cancelled">
                  Buổi học bị hủy ({cancelledSessions?.length || 0})
               </TabsTrigger>
            </TabsList>

            <TabsContent value="rejected" className="mt-6">
               {!rejectedSessions || rejectedSessions.length === 0 ? (
                  <Card>
                     <CardContent className="p-6">
                        <div className="text-center text-gray-500">
                           <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                           <p>Không có buổi học nào bị từ chối.</p>
                        </div>
                     </CardContent>
                  </Card>
               ) : (
                  <div className="grid gap-4">
                     {rejectedSessions.map((session) => (
                        <SessionCard key={session._id} session={session} type="rejected" />
                     ))}
                  </div>
               )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
               {!cancelledSessions || cancelledSessions.length === 0 ? (
                  <Card>
                     <CardContent className="p-6">
                        <div className="text-center text-gray-500">
                           <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                           <p>Không có buổi học nào bị hủy.</p>
                        </div>
                     </CardContent>
                  </Card>
               ) : (
                  <div className="grid gap-4">
                     {cancelledSessions.map((session) => (
                        <SessionCard key={session._id} session={session} type="cancelled" />
                     ))}
                  </div>
               )}
            </TabsContent>
         </Tabs>
      </div>
   );
};

export default RejectedSessionsPage;
