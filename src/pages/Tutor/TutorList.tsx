import { useEffect, useState } from "react";
import { useSearchTutors } from "@/hooks/useTutorListAndDetail";
import { TutorCard } from "@/components/tutor/tutor-search/TutorCard";
import { Pagination } from "@/components/common/Pagination";
import { Loader2 } from "lucide-react";
import type { Tutor, TutorsApiResponse } from "@/types/tutorListandDetail";

interface TutorListPageProps {
   filters: any;
   aiTutors?: Tutor[] | null; // Add this prop for AI results
}

const dayMap: Record<string, number> = {
   "Chủ Nhật": 0,
   "Thứ Hai": 1,
   "Thứ Ba": 2,
   "Thứ Tư": 3,
   "Thứ Năm": 4,
   "Thứ Sáu": 5,
   "Thứ Bảy": 6,
};

export default function TutorListPage({
   filters,
   aiTutors,
}: TutorListPageProps) {
   const [currentPage, setCurrentPage] = useState(1);
   const tutorsPerPage = 6;

   // Reset pagination when switching between AI and regular results
   useEffect(() => {
      setCurrentPage(1);
   }, [aiTutors, filters]);

   // Only fetch from API if not using AI results
   const shouldFetchFromAPI = !aiTutors && filters;

   const { data, isLoading, isError } = useSearchTutors({
      keyword: (shouldFetchFromAPI && filters.searchQuery) || undefined,
      subjects:
         shouldFetchFromAPI && filters.selectedSubjects.length
            ? filters.selectedSubjects
            : undefined,
      levels:
         shouldFetchFromAPI && filters.selectedLevels.length
            ? filters.selectedLevels
            : undefined,
      cities:
         shouldFetchFromAPI && filters.selectedCities.length
            ? filters.selectedCities
            : undefined,
      minRate:
         shouldFetchFromAPI && filters.priceRange?.[0] > 0
            ? filters.priceRange[0]
            : undefined,
      maxRate:
         shouldFetchFromAPI && filters.priceRange?.[1] < 2000000
            ? filters.priceRange[1]
            : undefined,
      minExperience:
         shouldFetchFromAPI && filters.experienceYears?.[0] > 0
            ? filters.experienceYears[0]
            : undefined,
      maxExperience:
         shouldFetchFromAPI && filters.experienceYears?.[1] < 20
            ? filters.experienceYears[1]
            : undefined,
      classType:
         shouldFetchFromAPI && filters.selectedClassTypes.length
            ? filters.selectedClassTypes
            : undefined,
      availability:
         shouldFetchFromAPI &&
            (filters.selectedDays.length > 0 ||
               filters.selectedTimeSlots.length > 0)
            ? {
               dayOfWeek: filters.selectedDays.length
                  ? filters.selectedDays.map((d: string) => dayMap[d])
                  : undefined,
               slots: filters.selectedTimeSlots.length
                  ? filters.selectedTimeSlots
                  : undefined,
            }
            : undefined,
      minRating:
         shouldFetchFromAPI && filters.ratingRange?.[0] > 0
            ? filters.ratingRange[0]
            : undefined,
      maxRating:
         shouldFetchFromAPI && filters.ratingRange?.[1] < 5
            ? filters.ratingRange[1]
            : undefined,
      page: shouldFetchFromAPI ? currentPage : undefined,
      limit: shouldFetchFromAPI ? tutorsPerPage : undefined,
   });

   // Use AI results if available, otherwise use API results
   let tutors: Tutor[] = [];
   let totalPages = 1;

   if (aiTutors) {
      // Handle AI search results with client-side pagination
      const startIndex = (currentPage - 1) * tutorsPerPage;
      const endIndex = startIndex + tutorsPerPage;
      tutors = aiTutors.slice(startIndex, endIndex);
      totalPages = Math.max(1, Math.ceil(aiTutors.length / tutorsPerPage));
   } else if (data) {
      // Handle regular API results
      const tutorsResp = data as TutorsApiResponse;
      tutors = tutorsResp?.data ?? [];
      totalPages = Math.max(1, tutorsResp?.pagination?.totalPages ?? 1);
   }

   const handlePageChange = (page: number) => setCurrentPage(page);

   // Show loading only for API requests, not for AI results
   if (isLoading && !aiTutors && tutors.length === 0) {
      return (
         <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            <span className="ml-4 text-lg">Đang tải danh sách gia sư...</span>
         </div>
      );
   }

   if (isError && !aiTutors) {
      return (
         <div className="text-center text-red-500 py-12">
            Lỗi khi tải danh sách gia sư.
         </div>
      );
   }

   if (tutors.length === 0) {
      return (
         <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-2">
               {aiTutors
                  ? "AI không tìm thấy gia sư phù hợp."
                  : "Không tìm thấy gia sư nào."}
            </p>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-6">
         {/* Show total count */}
         <div className="mb-4 text-sm text-muted-foreground">
            {aiTutors ? (
               <span>
                  Hiển thị {tutors.length} / {aiTutors.length} gia sư từ kết quả
                  AI
               </span>
            ) : (
               <span>
                  Tìm thấy{" "}
                  {(data as TutorsApiResponse)?.data.length || tutors.length}{" "}
                  gia sư
               </span>
            )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
               <TutorCard key={tutor._id} tutor={tutor} />
            ))}
         </div>

         {/* Always show pagination */}
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
