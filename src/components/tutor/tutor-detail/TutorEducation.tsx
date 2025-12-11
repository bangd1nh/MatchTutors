import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Tutor, Education } from "@/types/tutorListandDetail";
import { GraduationCap } from "lucide-react";

interface TutorEducationProps {
   tutor: Tutor;
}

function parseToDate(
   raw?: string | Date | { startDate?: string; endDate?: string } | undefined
): Date | null {
   if (!raw) return null;

   // If already a Date
   if (raw instanceof Date) {
      return isNaN(raw.getTime()) ? null : raw;
   }

   // If raw is ISO/string like "2020-01-01T00:00:00.000Z" or "2020-01-01"
   if (typeof raw === "string") {
      const iso = raw.includes("T") ? raw.split("T")[0] : raw;
      if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
         const d = new Date(iso);
         return isNaN(d.getTime()) ? null : d;
      }
      // fallback full Date parse
      const d = new Date(raw);
      return isNaN(d.getTime()) ? null : d;
   }

   // If object with startDate / from / start
   if (typeof raw === "object") {
      const s =
         (raw as any).startDate ?? (raw as any).from ?? (raw as any).start;
      if (!s) return null;
      return parseToDate(s as string);
   }

   return null;
}

const formatDate = (
   dateInput?:
      | string
      | Date
      | { startDate?: string; endDate?: string }
      | undefined
) => {
   const d = parseToDate(dateInput as any);
   if (!d) return "-";
   return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
   });
};

export function TutorEducation({ tutor }: TutorEducationProps) {
   const educations: Education[] = Array.isArray(tutor.education)
      ? tutor.education
      : [];

   return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
         <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-medium text-sky-800">
               <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
               </div>
               Học vấn
            </CardTitle>
         </CardHeader>
         <CardContent>
            {educations.length > 0 ? (
               <div className="space-y-8">
                  {educations.map((edu, index) => {
                     // support multiple shapes: edu.startDate/edu.endDate OR edu.dateRange.{startDate,endDate} OR edu.dateRange string
                     const startSource =
                        edu.startDate ??
                        (edu.dateRange && typeof edu.dateRange === "object"
                           ? edu.dateRange.startDate
                           : typeof edu.dateRange === "string"
                           ? edu.dateRange
                           : undefined);

                     const endSource =
                        edu.endDate ??
                        (edu.dateRange && typeof edu.dateRange === "object"
                           ? edu.dateRange.endDate
                           : undefined);

                     return (
                        <div key={index} className="relative">
                           {/* Timeline dot */}
                           <div className="absolute left-0 top-2 w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm"></div>

                           {/* Timeline line */}
                           {index < educations.length - 1 && (
                              <div className="absolute left-1.5 top-5 w-0.5 h-16 bg-gray-200"></div>
                           )}

                           {/* Content */}
                           <div className="ml-8 space-y-3">
                              <div>
                                 <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    {edu.degree || "Chưa có thông tin bằng cấp"}
                                 </h3>
                                 <p className="text-base text-gray-700 font-medium">
                                    {edu.institution ||
                                       "Chưa có thông tin trường học"}
                                 </p>
                              </div>

                              <div className="space-y-2 text-sm text-gray-600">
                                 {edu.fieldOfStudy && (
                                    <div className="flex items-center gap-2">
                                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                       <span>
                                          Chuyên ngành: {edu.fieldOfStudy}
                                       </span>
                                    </div>
                                 )}

                                 <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                    <span>
                                       Thời gian: {formatDate(startSource)} -{" "}
                                       {formatDate(endSource)}
                                    </span>
                                 </div>
                              </div>

                              {edu.description && (
                                 <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                    {edu.description}
                                 </p>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            ) : (
               <p className="text-gray-500 italic">
                  Chưa có thông tin học vấn.
               </p>
            )}
         </CardContent>
      </Card>
   );
}
