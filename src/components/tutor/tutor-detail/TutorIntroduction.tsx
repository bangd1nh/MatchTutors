import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tutor } from "@/types/tutorListandDetail";
import { User } from "lucide-react";

interface TutorIntroductionProps {
   tutor: Tutor;
}

export function TutorIntroduction({ tutor }: TutorIntroductionProps) {
   return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
         <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-medium text-sky-800">
               <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-sky-600" />
               </div>
               Giới thiệu bản thân
            </CardTitle>
         </CardHeader>
         <CardContent>
            <div className="prose prose-gray max-w-none">
               <div
                  className="text-gray-700 leading-relaxed text-base max-w-full break-words"
                  style={{
                     wordBreak: "break-word",
                     overflowWrap: "anywhere",
                     lineHeight: "1.7",
                  }}
                  dangerouslySetInnerHTML={{
                     __html:
                        tutor.bio ||
                        "<p class='text-gray-500 italic'>Chưa có thông tin giới thiệu.</p>",
                  }}
               />
            </div>
         </CardContent>
      </Card>
   );
}
