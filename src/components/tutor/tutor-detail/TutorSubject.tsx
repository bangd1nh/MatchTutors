import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Tutor } from "@/types/tutorListandDetail";
import { Badge } from "@/components/ui/badge";

interface TutorSubjectProps {
   tutor: Tutor;
}

export function TutorSubject({ tutor }: TutorSubjectProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Subjects I Can Teach</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-wrap gap-2">
            {(tutor.subjects || []).map((subject, index) => (
               <Badge key={index} variant="outline">
                  {subject}
               </Badge>
            ))}
         </CardContent>
      </Card>
   );
}
