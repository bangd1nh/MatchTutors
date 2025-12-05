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
    <Card className="bg-card text-card-foreground border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-medium">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
          </div>
          Học vấn
        </CardTitle>
      </CardHeader>
      <CardContent>
        {educations.length > 0 ? (
          <div className="space-y-8">
            {educations.map((edu, index) => {
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
                  <div
                    className="absolute left-0 top-2 w-3 h-3 rounded-full border-2 shadow-sm"
                    style={{
                      backgroundColor: "hsl(var(--accent))",
                      borderColor: "hsl(var(--card))",
                    }}
                  />
                  {/* Timeline line */}
                  {index < educations.length - 1 && (
                    <div
                      className="absolute left-1.5 top-5 w-0.5 h-16"
                      style={{ backgroundColor: "hsl(var(--border))" }}
                    />
                  )}
                  {/* Content */}
                  <div className="ml-8 space-y-3">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-1">
                        {edu.degree || "Chưa có thông tin bằng cấp"}
                      </h3>
                      <p className="text-base text-foreground/90 font-medium">
                        {edu.institution || "Chưa có thông tin trường học"}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {edu.fieldOfStudy && (
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: "hsl(var(--muted-foreground))" }}
                          />
                          <span>Chuyên ngành: {edu.fieldOfStudy}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "hsl(var(--muted-foreground))" }}
                        />
                        <span>
                          Thời gian: {formatDate(startSource)} - {formatDate(endSource)}
                        </span>
                      </div>
                    </div>

                    {edu.description && (
                      <p className="text-sm leading-relaxed bg-muted text-muted-foreground px-3 py-2 rounded-lg">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground italic">Chưa có thông tin học vấn.</p>
        )}
      </CardContent>
    </Card>
  );
}
