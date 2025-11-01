import { useAdminLearning } from "@/hooks/useAdminLearning";
import { LearningCommitment } from "@/types/learningCommitment";
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
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminLearningManagement = () => {
   const { disputedCommitments, isLoadingDisputes } = useAdminLearning();
   const navigate = useNavigate();

   if (isLoadingDisputes) {
      return <div>Loading disputes...</div>;
   }

   const commitments: LearningCommitment[] =
      (disputedCommitments as any)?.data ??
      (disputedCommitments as any)?.items ??
      (disputedCommitments as any)?.results ??
      (disputedCommitments as any)?.docs ??
      (disputedCommitments as any)?.commitments ??
      [];

   return (
      <Card>
         <CardHeader>
            <CardTitle>Learning Commitment Disputes</CardTitle>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Student</TableHead>
                     <TableHead>Tutor</TableHead>
                     <TableHead>Subject</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Requested At</TableHead>
                     <TableHead>Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {commitments.length > 0 ? (
                     commitments.map((item: LearningCommitment) => (
                        <TableRow key={item._id}>
                           <TableCell>
                              {item.student.userId?.name ?? item.student._id}
                           </TableCell>
                           <TableCell>
                              {item.tutor.userId?.name ?? item.tutor._id}
                           </TableCell>
                           <TableCell>{item.teachingRequest.subject}</TableCell>
                           <TableCell>
                              <Badge variant="destructive">{item.status}</Badge>
                           </TableCell>
                           <TableCell>
                              {new Date(
                                 item.cancellationDecision?.requestedAt || ""
                              ).toLocaleDateString()}
                           </TableCell>
                           <TableCell>
                              <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() =>
                                    navigate(`/admin/learning/${item._id}`)
                                 }
                              >
                                 View Details
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={6} className="text-center">
                           No disputes found.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
};

export default AdminLearningManagement;
