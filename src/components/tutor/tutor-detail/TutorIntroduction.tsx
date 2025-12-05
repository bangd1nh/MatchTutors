import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tutor } from "@/types/tutorListandDetail";
import { User } from "lucide-react";

interface TutorIntroductionProps {
   tutor: Tutor;
}

export function TutorIntroduction({ tutor }: TutorIntroductionProps) {
   return (
      <Card className="bg-card text-card-foreground border border-border shadow-sm">
         <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-medium">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted text-muted-foreground">
                  <User className="w-4 h-4" />
               </div>
               Giới thiệu bản thân
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div
               className="text-foreground leading-relaxed text-base break-words"
               style={{
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  lineHeight: "1.7",
               }}
               dangerouslySetInnerHTML={{
                  __html: tutor.bio || "<p class='text-muted-foreground italic'>Chưa có thông tin giới thiệu.</p>",
               }}
            />
         </CardContent>
      </Card>
   );
}
