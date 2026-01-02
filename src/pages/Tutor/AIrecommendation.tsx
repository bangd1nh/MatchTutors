import { Sparkles } from "lucide-react";
import { TutorCard } from "@/components/tutor/tutor-search/TutorCard";
import { TutorSuggestion } from "@/types/Tutor";

type AIRecommendationProps = {
   tutor: TutorSuggestion[];
};

const AIrecommendation = ({ tutor }: AIRecommendationProps) => {
   if (!tutor || tutor.length === 0) {
      return (
         <section className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
               <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
               Gợi ý từ AI
            </h3>
            <p className="text-sm text-muted-foreground">
               Chưa có gợi ý gia sư nào.
            </p>
         </section>
      );
   }

   return (
      <section className="relative mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6 shadow-lg">
         <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_30%)]" />
         <div className="relative flex items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-2">
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
               </div>
               <div>
                  <h3 className="text-lg font-semibold text-foreground">
                     Gợi ý từ AI
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     Các gia sư được đề xuất riêng cho bạn
                  </p>
               </div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
               {tutor.length} gia sư phù hợp
            </span>
         </div>

         <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tutor.map((t: TutorSuggestion, idx) => {
               const tu = t.tutorId;
               const key = tu?._id ?? idx;

               const normalizedTutor = {
                  _id: tu?._id ?? key,
                  userId: {
                     _id: tu?.userId?._id ?? "",
                     name: tu?.userId?.name ?? "Gia sư",
                     avatarUrl: tu?.userId?.avatarUrl,
                     address: { city: tu?.userId?.address?.city },
                  },
                  hourlyRate: tu?.hourlyRate ?? 0,
                  experienceYears: tu?.experienceYears ?? 0,
                  subjects: tu?.subjects ?? [],
                  levels: tu?.levels ?? [],
                  classType: (tu as any)?.classType ?? [],
                  availability: (tu as any)?.availability ?? [],
                  ratings: {
                     average: (tu as any)?.ratings?.average ?? 0,
                     totalReviews: (tu as any)?.ratings?.totalReviews ?? 0,
                  },
                  bio: tu?.bio,
               } as any;

               return <TutorCard key={key} tutor={normalizedTutor} />;
            })}
         </div>
      </section>
   );
};

export default AIrecommendation;
