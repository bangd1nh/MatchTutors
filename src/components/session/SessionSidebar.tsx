import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getSubjectLabelVi, getLevelLabelVi } from "@/utils/educationDisplay";

export default function SessionSidebar({ session }: any) {
   const learningCommitment = (session as any)?.learningCommitmentId;

   const studentUser =
      (learningCommitment?.student?.userId as any) ||
      (learningCommitment?.student as any);

   return (
      <div className="space-y-6">
         <Card>
            <CardHeader>
               <CardTitle>Thông tin khóa học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                     Môn học:
                  </span>
                  <span className="text-sm font-medium">
                     {learningCommitment?.teachingRequest?.subject
                        ? getSubjectLabelVi(
                             learningCommitment.teachingRequest.subject
                          )
                        : "Không xác định"}
                  </span>
               </div>

               <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cấp độ:</span>
                  <span className="text-sm font-medium">
                     {learningCommitment?.teachingRequest?.level
                        ? getLevelLabelVi(
                             learningCommitment.teachingRequest.level
                          )
                        : "Không xác định"}
                  </span>
               </div>

               {/* Học viên */}
               <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                     Học viên:
                  </span>
                  <span className="text-sm font-medium">
                     {studentUser?.name || "Không xác định"}
                  </span>
               </div>

               <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                     Email học viên:
                  </span>
                  <span className="text-sm font-medium">
                     {studentUser?.email || "Không xác định"}
                  </span>
               </div>

               <Separator />
            </CardContent>
         </Card>
      </div>
   );
}
