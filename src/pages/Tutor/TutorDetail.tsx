import type React from "react";
import type { Tutor } from "@/types/tutorListandDetail";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
   TutorAvailability,
   TutorCertification,
   TutorContactCard,
   TutorEducation,
   TutorHeader,
   TutorIntroduction,
   TutorSubject,
} from "@/components/tutor/tutor-detail";
import { useTutorDetail } from "@/hooks/useTutorListAndDetail";

const TutorDetail: React.FC = () => {
   const { id } = useParams<{ id: string }>();

   const { data: rawTutor, isLoading } = useTutorDetail(id ?? null);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
         </div>
      );
   }

   if (!rawTutor) {
      return (
         <div className="text-center text-red-500">
            Không thể tải thông tin gia sư.
         </div>
      );
   }

   const source: any = rawTutor;

   // helper
   const userObj =
      typeof source.userId === "object" ? source.userId : undefined;

   // Normalize shape to match UI components and types in src/types/tutorListandDetail.ts
   const normalizedTutor: Tutor = {
      ...source,
      // basic user fields
      userId:
         typeof source.userId === "string"
            ? { _id: source.userId, name: source.fullName ?? "" }
            : source.userId ?? {},
      fullName:
         source.fullName ??
         userObj?.name ??
         (source.userId && (source.userId as any).name) ??
         "",
      avatarUrl: userObj?.avatarUrl ?? source.avatarUrl ?? "",
      // address
      address: source.address ?? userObj?.address ?? { city: "", street: "" },
      // contact (safe)
      contact: source.contact ?? {
         phone: userObj?.phone ?? "",
         email: userObj?.email ?? "",
      },
      // languages default to array
      languages: Array.isArray(source.languages) ? source.languages : [],
      // subjects / levels / certifications default arrays
      subjects: Array.isArray(source.subjects) ? source.subjects : [],
      levels: Array.isArray(source.levels) ? source.levels : [],
      certifications: Array.isArray(source.certifications)
         ? source.certifications
         : [],
      // normalize availability: ensure slots AND timeSlots exist, dayOfWeek present
      availability: Array.isArray(source.availability)
         ? source.availability.map((a: any) => {
              const slots = Array.isArray(a.slots)
                 ? a.slots
                 : Array.isArray(a.timeSlots)
                 ? a.timeSlots
                 : [];
              const timeSlots = Array.isArray(a.timeSlots)
                 ? a.timeSlots
                 : Array.isArray(a.slots)
                 ? a.slots
                 : [];
              return {
                 dayOfWeek:
                    typeof a.dayOfWeek === "number"
                       ? a.dayOfWeek
                       : Number(a.dayOfWeek) || 0,
                 slots,
                 timeSlots,
              };
           })
         : [],
      // normalize education: ensure dateRange with startDate/endDate
      education: Array.isArray(source.education)
         ? source.education.map((edu: any) => ({
              institution: edu.institution ?? edu.school ?? "",
              degree: edu.degree ?? edu.degreeTitle ?? "",
              fieldOfStudy: edu.fieldOfStudy ?? edu.major ?? "",
              dateRange:
                 edu.dateRange ??
                 (edu.startDate || edu.endDate
                    ? {
                         startDate: edu.startDate ?? "",
                         endDate: edu.endDate ?? "",
                      }
                    : { startDate: "", endDate: "" }),
              description: edu.description ?? "",
           }))
         : [],
      // ratings default
      ratings: source.ratings ?? { average: 0, totalReviews: 0 },
      // other numeric/text defaults
      experienceYears: source.experienceYears ?? 0,
      hourlyRate: source.hourlyRate ?? 0,
      bio: source.bio ?? "",
      classType: Array.isArray(source.classType)
         ? source.classType
         : source.classType
         ? [source.classType]
         : [],
   };

   return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
               <TutorHeader tutor={normalizedTutor} />
               <TutorIntroduction tutor={normalizedTutor} />
               <TutorCertification tutor={normalizedTutor} />
               <TutorEducation tutor={normalizedTutor} />
               <TutorSubject tutor={normalizedTutor} />
               <TutorAvailability tutor={normalizedTutor} />
            </div>

            <div className="lg:col-span-4 space-y-6">
               <TutorContactCard tutor={normalizedTutor} />
            </div>
         </div>
      </div>
   );
};

export default TutorDetail;
