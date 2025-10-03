import { useState } from "react";
import { useSearchTutors } from "@/hooks/useTutorListAndDetail";
import { TutorCard } from "@/components/tutor/tutor-search/TutorCard";
import { Pagination } from "@/components/common/Pagination";
import { Loader2 } from "lucide-react";
import type { Tutor, TutorsApiResponse } from "@/types/tutorListandDetail";

interface TutorListPageProps {
   filters: any;
}

const dayMap: Record<string, number> = {
   Sunday: 0,
   Monday: 1,
   Tuesday: 2,
   Wednesday: 3,
   Thursday: 4,
   Friday: 5,
   Saturday: 6,
};

export default function TutorListPage({ filters }: TutorListPageProps) {
   const [currentPage, setCurrentPage] = useState(1);
   const tutorsPerPage = 6;

   const { data, isLoading, isError } = useSearchTutors({
      keyword: filters.searchQuery || undefined,
      subjects: filters.selectedSubjects.length ? filters.selectedSubjects : undefined,
      levels: filters.selectedLevels.length ? filters.selectedLevels : undefined,
      cities: filters.selectedCities.length ? filters.selectedCities : undefined,
      minRate: filters.priceRange?.[0] > 0 ? filters.priceRange[0] : undefined,
      maxRate: filters.priceRange?.[1] < 2000000 ? filters.priceRange[1] : undefined,
      minExperience: filters.experienceYears?.[0] > 0 ? filters.experienceYears[0] : undefined,
      maxExperience: filters.experienceYears?.[1] < 20 ? filters.experienceYears[1] : undefined,
      classType: filters.selectedClassTypes.length ? filters.selectedClassTypes : undefined,
      availability:
         filters.selectedDays.length > 0 || filters.selectedTimeSlots.length > 0
            ? {
               dayOfWeek: filters.selectedDays.length
                  ? filters.selectedDays.map((d: string) => dayMap[d]) // 👈 map all selected days
                  : undefined,
               slots: filters.selectedTimeSlots.length ? filters.selectedTimeSlots : undefined,
            }
            : undefined,
      minRating: filters.ratingRange?.[0] > 0 ? filters.ratingRange[0] : undefined,
      maxRating: filters.ratingRange?.[1] < 5 ? filters.ratingRange[1] : undefined,
      page: currentPage,
      limit: tutorsPerPage,
   });

   const tutorsResp = data as TutorsApiResponse | undefined;
   console.log("Tutors Response:", tutorsResp);
   console.log("Applied Filters:", filters);
   const tutors: Tutor[] = tutorsResp?.data ?? [];
   const totalPages = Math.max(1, tutorsResp?.pagination?.totalPages ?? 1);

   const handlePageChange = (page: number) => setCurrentPage(page);

   if (isLoading && tutors.length === 0) {
      return (
         <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            <span className="ml-4 text-lg">Đang tải danh sách gia sư...</span>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="text-center text-red-500 py-12">
            Lỗi khi tải danh sách gia sư.
         </div>
      );
   }

   if (!isLoading && tutors.length === 0) {
      return (
         <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-2">
               Không tìm thấy gia sư nào.
            </p>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-6">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
               <TutorCard key={tutor._id} tutor={tutor} />
            ))}
         </div>

         <div className="mt-8 flex justify-center">
            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={handlePageChange}
            />
         </div>
      </div>
   );
}