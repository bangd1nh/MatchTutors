import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Education, Tutor } from "@/types/tutorListandDetail";
import { Check, GraduationCap } from "lucide-react";

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
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <GraduationCap className="w-5 h-5 text-primary" />
               Education
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-6">
            {educations.length > 0 ? (
               educations.map((edu, index) => {
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
                     <div
                        key={index}
                        className="border-l-2 border-primary pl-4"
                     >
                        <h3 className="font-semibold text-lg mb-3">
                           {edu.degree ?? "-"}
                        </h3>

                        <div className="space-y-2 mb-3">
                           <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-sm">
                                 {edu.institution ?? "-"}
                              </span>
                           </div>

                           <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-sm">
                                 {edu.fieldOfStudy ?? "-"}
                              </span>
                           </div>

                           <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-sm">
                                 {formatDate(startSource)} -{" "}
                                 {formatDate(endSource)}
                              </span>
                           </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                           {edu.description ?? ""}
                        </p>
                     </div>
                  );
               })
            ) : (
               <p className="text-sm text-muted-foreground">
                  No education history available.
               </p>
            )}
         </CardContent>
      </Card>
   );
}
