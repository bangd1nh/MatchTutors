import { useState } from "react";
import { useDisputedSessions } from "@/hooks/useAdminSessions";
import DisputeDetailModal from "./DisputeDetailModal";
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

const DisputeList = ({
   disputes,
   isLoading,
   onDetailClick,
}: {
   disputes?: Session[];
   isLoading: boolean;
   onDetailClick?: (session: Session) => void;
}) => {
   if (isLoading) {
      return <div>Đang tải danh sách...</div>;
   }

   if (!disputes || disputes.length === 0) {
      return <div>Không có tranh chấp nào.</div>;
   }

   return (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead>Ngày học</TableHead>
               <TableHead>Học sinh</TableHead>
               <TableHead>Gia sư</TableHead>
               <TableHead>Ngày tạo tranh chấp</TableHead>
               <TableHead>Trạng thái</TableHead>
               <TableHead>Hành động</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {disputes.map((session) => (
               <TableRow key={session._id}>
                  <TableCell>
                     {format(new Date(session.startTime), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                     {session.learningCommitmentId?.student?.userId?.name}
                  </TableCell>
                  <TableCell>
                     {session.learningCommitmentId?.tutor?.userId?.name}
                  </TableCell>
                  <TableCell>
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
                     >
                        {session.dispute?.status === "OPEN"
                           ? "Mở"
                           : "Đã giải quyết"}
                     </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDetailClick?.(session)}
                     >
                        Xem chi tiết
                     </Button>
                     <Button asChild variant="ghost" size="sm">
                        <Link to={`/admin/disputes/${session._id}`}>
                           Trang riêng
                        </Link>
                     </Button>
                  </TableCell>
               </TableRow>
            ))}
         </TableBody>
      </Table>
   );
};

const AdminSessionDispute = () => {
   const [status, setStatus] = useState<"OPEN" | "RESOLVED" | undefined>(
      "OPEN"
   );
   const [selectedSession, setSelectedSession] = useState<
      Session | undefined
   >();
   const [modalOpen, setModalOpen] = useState(false);

   const { data: disputes, isLoading } = useDisputedSessions(status);

   const handleDetailClick = (session: Session) => {
      setSelectedSession(session);
      setModalOpen(true);
   };

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">
            Quản lý Tranh chấp Buổi học
         </h1>
         <Tabs
            defaultValue="OPEN"
            onValueChange={(value) =>
               setStatus(value as "OPEN" | "RESOLVED" | undefined)
            }
         >
            <TabsList>
               <TabsTrigger value="OPEN">Mở</TabsTrigger>
               <TabsTrigger value="RESOLVED">Đã giải quyết</TabsTrigger>
            </TabsList>
            <TabsContent value="OPEN">
               <DisputeList
                  disputes={disputes}
                  isLoading={isLoading}
                  onDetailClick={handleDetailClick}
               />
            </TabsContent>
            <TabsContent value="RESOLVED">
               <DisputeList
                  disputes={disputes}
                  isLoading={isLoading}
                  onDetailClick={handleDetailClick}
               />
            </TabsContent>
         </Tabs>

         <DisputeDetailModal
            session={selectedSession}
            open={modalOpen}
            onOpenChange={setModalOpen}
         />
      </div>
   );
};

export default AdminSessionDispute;
