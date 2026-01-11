import { Sparkles, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { TutorCard } from "@/components/tutor/tutor-search/TutorCard";
import { TutorSuggestion } from "@/types/Tutor";
import { useState } from "react";

type AIRecommendationProps = {
   tutor: TutorSuggestion[];
   isLoading?: boolean;
   hasProfile?: boolean;
   isAuthenticated?: boolean;
   isStudent?: boolean;
   hasFetchedOnce?: boolean; // NEW: Đánh dấu đã fetch ít nhất 1 lần
};

const AIrecommendation = ({
   tutor,
   isLoading,
   hasProfile,
   isAuthenticated,
   isStudent,
   hasFetchedOnce, // NEW
}: AIRecommendationProps) => {
   const [isExpanded, setIsExpanded] = useState(false);

   // Case 1: Đang loading và đã có profile (student) -> đang chờ AI
   if (isLoading && hasProfile && isAuthenticated && isStudent) {
      return (
         <section className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
               <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
               Đang tạo gợi ý AI
            </h3>
            <p className="text-sm text-muted-foreground">
               Vui lòng đợi trong giây lát, chúng tôi đang tìm kiếm gia sư phù
               hợp nhất cho bạn...
            </p>
         </section>
      );
   }

   // Case 2: Chưa đăng nhập hoặc không phải student -> yêu cầu đăng nhập
   if (!isAuthenticated || !isStudent) {
      return (
         <section className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
               <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
               Gợi ý từ AI
            </h3>
            <p className="text-sm text-muted-foreground">
               Đăng nhập với tài khoản học sinh để nhận gợi ý gia sư phù hợp từ
               AI.{" "}
               <Link
                  to="/login"
                  className="text-primary underline hover:text-primary/80"
               >
                  Đăng nhập ngay
               </Link>
            </p>
         </section>
      );
   }

   // Case 3: Đã đăng nhập, là student nhưng chưa có profile
   if (isAuthenticated && isStudent && !hasProfile) {
      return (
         <section className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
               <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
               Gợi ý từ AI
            </h3>
            <p className="text-sm text-muted-foreground">
               Chưa có gợi ý gia sư nào. Hãy tạo hồ sơ học sinh{" "}
               <Link
                  to="/student/student-profile"
                  className="text-primary underline hover:text-primary/80"
               >
                  tại đây
               </Link>
            </p>
         </section>
      );
   }

   // Case 4: Đã có profile nhưng chưa có gợi ý
   if (
      isAuthenticated &&
      isStudent &&
      hasProfile &&
      (!tutor || tutor.length === 0)
   ) {
      return (
         <section className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
               <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
               Gợi ý từ AI
            </h3>
            <p className="text-sm text-muted-foreground">
               Chưa có gợi ý gia sư nào. Vui lòng đợi trong giây lát...
            </p>
         </section>
      );
   }

   // Case 4a: Đang chờ AI xử lý lần đầu (chưa có response)
   if (
      isAuthenticated &&
      isStudent &&
      hasProfile &&
      isLoading &&
      !hasFetchedOnce
   ) {
      return (
         <section className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
               <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
               Đang tạo gợi ý AI
            </h3>
            <p className="text-sm text-muted-foreground">
               Vui lòng đợi trong giây lát, chúng tôi đang tìm kiếm gia sư phù
               hợp nhất cho bạn...
            </p>
         </section>
      );
   }

   // Case 4b: AI đã xử lý nhưng không tìm thấy gia sư phù hợp
   if (
      isAuthenticated &&
      isStudent &&
      hasProfile &&
      hasFetchedOnce &&
      (!tutor || tutor.length === 0)
   ) {
      return (
         <section className="mt-8 rounded-2xl border border-dashed border-orange-300 bg-orange-50 dark:bg-orange-950/20 p-6 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
               <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-lg font-semibold text-foreground">
               Chưa tìm thấy gia sư phù hợp
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
               AI chưa tìm thấy gia sư phù hợp với hồ sơ hiện tại của bạn. Hãy
               thử cập nhật thông tin để nhận gợi ý tốt hơn.
            </p>
            <Link
               to="/student/student-profile"
               className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 underline"
            >
               Cập nhật hồ sơ học sinh
            </Link>
         </section>
      );
   }

   // Case 5: Đã có gợi ý -> hiển thị danh sách
   return (
      <section className="relative mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-lg">
         <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.08),transparent_30%)]" />

         <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="relative w-full flex items-center justify-between gap-3 p-6 hover:bg-primary/5 transition-colors"
         >
            <div className="flex items-center gap-2">
               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
               </div>
               <div className="text-left">
                  <h3 className="text-lg font-semibold text-foreground">
                     Gợi ý từ AI
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     Các gia sư được đề xuất riêng cho bạn
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {tutor.length} gia sư phù hợp
               </span>
               {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
               ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
               )}
            </div>
         </button>

         {isExpanded && (
            <div className="relative px-6 pb-6">
               <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {tutor.map((t: TutorSuggestion, idx) => {
                     const tu = t.tutorId;
                     const key = tu?._id ?? idx;

                     // Normalize classType - ensure it's an array
                     let normalizedClassType: string[] = [];
                     if (tu?.classType) {
                        if (Array.isArray(tu.classType)) {
                           normalizedClassType = tu.classType;
                        } else if (typeof tu.classType === "string") {
                           normalizedClassType = [tu.classType];
                        }
                     }

                     // Normalize availability - ensure proper format
                     let normalizedAvailability: Array<{
                        dayOfWeek: number;
                        slots: string[];
                     }> = [];
                     if (tu?.availability && Array.isArray(tu.availability)) {
                        normalizedAvailability = tu.availability
                           .filter((avail) => avail != null)
                           .map((avail) => {
                              const slots =
                                 avail.slots || avail.timeSlots || [];
                              return {
                                 dayOfWeek: avail.dayOfWeek ?? avail.day ?? 0,
                                 slots: Array.isArray(slots) ? slots : [],
                              };
                           });
                     }

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
                        classType: normalizedClassType,
                        availability: normalizedAvailability,
                        ratings: {
                           average: tu?.ratings?.average ?? 0,
                           totalReviews: tu?.ratings?.totalReviews ?? 0,
                        },
                        bio: tu?.bio,
                     } as any;

                     return <TutorCard key={key} tutor={normalizedTutor} />;
                  })}
               </div>
            </div>
         )}
      </section>
   );
};

export default AIrecommendation;
