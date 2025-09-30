import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tutor } from "@/types/tutorListandDetail";
import { Check } from "lucide-react";

interface TutorIntroductionProps {
   tutor: Tutor;
}

export function TutorIntroduction({ tutor }: TutorIntroductionProps) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Introduction</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="h-40 overflow-y-auto pr-2 border rounded-md p-2 bg-gray-50">
               <div
                  className=" text-gray-700 max-w-full break-words"
                  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                  dangerouslySetInnerHTML={{ __html: tutor.bio || "" }}
               />
            </div>
         </CardContent>
      </Card>
   );
}
