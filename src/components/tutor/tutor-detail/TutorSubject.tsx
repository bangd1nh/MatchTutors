import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Tutor } from "@/types/tutorListandDetail";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { getSubjectLabelVi } from "@/utils/educationDisplay";

interface TutorSubjectProps {
   tutor: Tutor;
}

export function TutorSubject({ tutor }: TutorSubjectProps) {
   const subjects = tutor.subjects || [];

   return (
      <Card className="bg-card text-card-foreground border border-border shadow-sm">
         <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-medium">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
               </div>
               Môn học có thể dạy
            </CardTitle>
         </CardHeader>
         <CardContent>
            {subjects.length > 0 ? (
               <div className="flex flex-wrap gap-3">
                  {subjects.map((subject, index) => (
                     <Badge
                        key={index}
                        variant="secondary"
                        className="rounded-full px-4 py-2 text-sm"
                     >
                        {getSubjectLabelVi(subject)}
                     </Badge>
                  ))}
               </div>
            ) : (
               <p className="text-muted-foreground italic">
                  Chưa có thông tin môn học.
               </p>
            )}
         </CardContent>
      </Card>
   );
}
