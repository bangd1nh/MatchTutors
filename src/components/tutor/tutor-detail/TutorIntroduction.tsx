import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tutor } from "@/types/tutorListandDetail";
import { User } from "lucide-react";
import { getLevelLabelVi } from "@/utils/educationDisplay";

interface TutorIntroductionProps {
   tutor: Tutor;
}

export function TutorIntroduction({ tutor }: TutorIntroductionProps) {
   return (
      <>
         {/* Levels Card */}
         <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm mb-4">
            <CardHeader className="pb-4">
               <CardTitle className="flex items-center gap-3 text-xl font-medium text-sky-800">
                  <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                     <User className="w-4 h-4 text-sky-600" />
                  </div>
                  Các trình độ có thể dạy
               </CardTitle>
            </CardHeader>
            <CardContent>
               {Array.isArray((tutor as any).levels) &&
               (tutor as any).levels.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                     {(tutor as any).levels.map((lv: string, idx: number) => (
                        <span
                           key={`${lv}-${idx}`}
                           className="px-4 py-2 bg-sky-50 text-sky-800 rounded-full text-lg font-semibold"
                        >
                           {getLevelLabelVi(lv)}
                        </span>
                     ))}
                  </div>
               ) : tutor.level ? (
                  <div className="text-lg font-semibold text-sky-800">
                     {getLevelLabelVi((tutor as any).level)}
                  </div>
               ) : (
                  <p className="text-gray-500 italic">
                     Chưa có thông tin lớp dạy
                  </p>
               )}
            </CardContent>
         </Card>

         {/* Introduction Card */}
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
      </>
   );
}
