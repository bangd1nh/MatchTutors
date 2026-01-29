import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Tutor } from "@/types/tutorListandDetail";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { getSubjectLabelVi } from "@/utils/educationDisplay";

interface TutorSubjectProps {
   tutor: Tutor;
}

export function TutorSubject({ tutor }: TutorSubjectProps) {
   return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
         <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-medium text-sky-800">
               <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-sky-600" />
               </div>
               Môn học có thể dạy
            </CardTitle>
         </CardHeader>
         <CardContent>
            {(tutor.subjects || []).length > 0 ? (
               <div className="flex flex-wrap gap-3">
                  {(tutor.subjects || []).map((subject, index) => (
                     <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-0 px-4 py-2 text-sm font-medium rounded-full"
                     >
                        {getSubjectLabelVi(subject)}
                     </Badge>
                  ))}
               </div>
            ) : (
               <p className="text-gray-500 italic">
                  Chưa có thông tin môn học.
               </p>
            )}
         </CardContent>
      </Card>
   );
}
