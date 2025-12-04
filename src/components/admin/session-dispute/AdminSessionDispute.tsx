import { useState, useEffect } from "react";
import { useDisputedSessions } from "@/hooks/useAdminSessions";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Session } from "@/types/session";
import { Pagination } from "@/components/common/Pagination";

const DisputeList = ({
   disputes,
   isLoading,
}: {
   disputes?: Session[];
   isLoading: boolean;
}) => {
   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-12">
            <div className="text-center">
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               <p className="mt-4 text-gray-500">Đang tải danh sách...</p>
            </div>
         </div>
      );
   }

   if (!disputes || disputes.length === 0) {
      return (
         <div className="flex items-center justify-center py-16">
            <div className="text-center">
               <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
               </svg>
               <p className="mt-4 text-lg font-medium text-gray-900">
                  Không có tranh chấp nào
               </p>
               <p className="mt-1 text-sm text-gray-500">
                  Tất cả buổi học đều diễn ra bình thường
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="overflow-x-auto border rounded-lg">
         <Table>
            <TableHeader>
               <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Ngày học</TableHead>
                  <TableHead className="font-semibold">Học sinh</TableHead>
                  <TableHead className="font-semibold">Gia sư</TableHead>
                  <TableHead className="font-semibold">
                     Ngày tạo tranh chấp
                  </TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-right font-semibold">
                     Hành động
                  </TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {disputes.map((session) => (
                  <TableRow key={session._id} className="hover:bg-gray-50">
                     <TableCell className="text-sm">
                        {format(
                           new Date(session.startTime),
                           "dd/MM/yyyy HH:mm"
                        )}
                     </TableCell>
                     <TableCell className="text-sm font-medium">
                        {session.learningCommitmentId?.student?.userId?.name ||
                           "N/A"}
                     </TableCell>
                     <TableCell className="text-sm font-medium">
                        {session.learningCommitmentId?.tutor?.userId?.name ||
                           "N/A"}
                     </TableCell>
                     <TableCell className="text-sm">
                        {session.dispute?.openedAt
                           ? format(
                                new Date(session.dispute.openedAt),
                                "dd/MM/yyyy"
                             )
                           : "N/A"}
                     </TableCell>
                     <TableCell>
                        <Badge
                           variant={
                              session.dispute?.status === "OPEN"
                                 ? "destructive"
                                 : "secondary"
                           }
                           className="capitalize"
                        >
                           {session.dispute?.status === "OPEN"
                              ? "Mở"
                              : "Đã giải quyết"}
                        </Badge>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center justify-end gap-2">
                           <Button asChild variant="outline" size="sm">
                              <Link to={`/admin/disputes/${session._id}`}>
                                 Xem thêm
                              </Link>
                           </Button>
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
};

const AdminSessionDispute = () => {
   const [status, setStatus] = useState<"OPEN" | "RESOLVED" | undefined>(
      "OPEN"
   );

   // pagination state
   const [page, setPage] = useState<number>(1);
   const [limit] = useState<number>(10);

   const { data: result, isLoading } = useDisputedSessions(status, page, limit);

   // reset page when status changes
   useEffect(() => {
      setPage(1);
   }, [status]);

   const disputes = result?.data ?? [];
   const totalPages = Math.max(1, result?.pagination?.pages ?? 1);
   const totalDisputes = result?.pagination?.total ?? 0;

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý Tranh chấp Buổi học
               </h1>
               <p className="mt-2 text-gray-600">
                  Xem và giải quyết các tranh chấp giữa học sinh và gia sư
               </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
               <Tabs
                  defaultValue="OPEN"
                  onValueChange={(value) =>
                     setStatus(value as "OPEN" | "RESOLVED" | undefined)
                  }
                  className="w-full"
               >
                  <div className="border-b">
                     <div className="px-6">
                        <TabsList className="bg-transparent border-b-0 p-0">
                           <TabsTrigger
                              value="OPEN"
                              className="rounded-none border-b-2 border-transparent px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:border-primary data-[state=active]:text-primary"
                           >
                              Mở ({totalDisputes})
                           </TabsTrigger>
                           <TabsTrigger
                              value="RESOLVED"
                              className="rounded-none border-b-2 border-transparent px-4 py-4 text-sm font-medium text-gray-600 hover:text-gray-900 data-[state=active]:border-primary data-[state=active]:text-primary"
                           >
                              Đã giải quyết
                           </TabsTrigger>
                        </TabsList>
                     </div>
                  </div>

                  <div className="px-6 py-6">
                     <TabsContent value="OPEN" className="m-0">
                        <DisputeList
                           disputes={disputes}
                           isLoading={isLoading}
                        />
                     </TabsContent>
                     <TabsContent value="RESOLVED" className="m-0">
                        <DisputeList
                           disputes={disputes}
                           isLoading={isLoading}
                        />
                     </TabsContent>
                  </div>
               </Tabs>

               {/* Pagination */}
               {totalDisputes > 0 && (
                  <div className="border-t px-6 py-4 flex items-center justify-between">
                     <p className="text-sm text-gray-600">
                        Hiển thị trang{" "}
                        <span className="font-medium">{page}</span> của{" "}
                        <span className="font-medium">{totalPages}</span> •{" "}
                        <span className="font-medium">{totalDisputes}</span> kết
                        quả
                     </p>
                     <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        maxVisiblePages={5}
                     />
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default AdminSessionDispute;
