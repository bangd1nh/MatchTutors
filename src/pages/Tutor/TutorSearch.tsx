import TutorFilterBar from "@/components/tutor/tutor-search/TutorFilterSidebar";
import TutorListPage from "./TutorList";
import { useState } from "react";
import AISearch from "./AISearch";

export type FiltersType = {
   searchQuery: string;
   priceRange: [number, number];
   ratingRange: [number, number];
   selectedTimeSlots: string[];
   selectedDays: string[];
   isOnline: boolean | null;
   selectedSubjects: string[];
   selectedLocation: string;
   experienceYears: [number, number];
   selectedGenders: string[];
   selectedClassTypes: string[];
   selectedLevels: string[];
   selectedCities: string[];
};

export default function TutorSearch() {
   // UI filters (what user is editing)
   const [filters, setFilters] = useState<FiltersType>({
      searchQuery: "",
      priceRange: [0, 2000000],
      ratingRange: [0, 5],
      selectedTimeSlots: [],
      selectedDays: [],
      isOnline: null,
      selectedSubjects: [],
      selectedLocation: "",
      experienceYears: [0, 20],
      selectedGenders: [],
      selectedClassTypes: [],
      selectedLevels: [],
      selectedCities: [],
   });

   // Applied filters (only used for searching)
   const [appliedFilters, setAppliedFilters] = useState<FiltersType>(filters);

   // AI search results and filtered tutors
   const [aiSearchResults, setAiSearchResults] = useState<any>(null);
   const [filteredTutors, setFilteredTutors] = useState<any[]>([]);
   const [isUsingAIResults, setIsUsingAIResults] = useState(false);

   const handleFilterChange = (newFilters: Partial<FiltersType>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      // Clear AI results when manually changing filters
      if (isUsingAIResults) {
         setIsUsingAIResults(false);
         setAiSearchResults(null);
         setFilteredTutors([]);
      }
   };

   const handleApplyFilters = () => {
      setAppliedFilters(filters); // apply current UI filters
      // Clear AI results when applying manual filters
      if (isUsingAIResults) {
         setIsUsingAIResults(false);
         setAiSearchResults(null);
         setFilteredTutors([]);
      }
   };

   const handleClearFilters = () => {
      const cleared: FiltersType = {
         searchQuery: "",
         priceRange: [0, 2000000],
         ratingRange: [0, 5],
         selectedTimeSlots: [],
         selectedDays: [],
         isOnline: null,
         selectedSubjects: [],
         selectedLocation: "",
         experienceYears: [0, 20],
         selectedGenders: [],
         selectedClassTypes: [],
         selectedLevels: [],
         selectedCities: [],
      };
      setFilters(cleared);
      setAppliedFilters(cleared);
      // Clear AI results
      setIsUsingAIResults(false);
      setAiSearchResults(null);
      setFilteredTutors([]);
   };

   const handleAISearchResults = (results: any) => {
      console.log("Received AI search results:", results);
      setAiSearchResults(results);
      setIsUsingAIResults(true);

      // Handle different response formats
      let tutorList: any[] = [];

      if (results && Array.isArray(results)) {
         tutorList = results;
      } else if (results?.data.results && Array.isArray(results.data.results)) {
         // This is the correct property based on your console log
         tutorList = results.data.results;
      } else if (results?.data.tutors && Array.isArray(results.data.tutors)) {
         tutorList = results.data.tutors;
      } else if (results?.data && Array.isArray(results.data)) {
         tutorList = results.data;
      }

      console.log(tutorList);

      setFilteredTutors(tutorList);
      console.log("Processed AI tutors:", tutorList);
   };

   return (
      <div className="container mx-auto px-4 py-6">
         <div className="mb-6">
            <h1 className="text-3xl font-bold">Danh sách Gia sư</h1>
            <p className="text-muted-foreground">
               Khám phá các gia sư hàng đầu của chúng tôi.
            </p>
         </div>

         <TutorFilterBar
            currentFilters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            tutors={[]} // optional if not needed
         />

         <AISearch
            currentFilters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onAISearchResults={handleAISearchResults}
         />

         {/* Show AI search insights if available */}
         {aiSearchResults && isUsingAIResults && (
            <div className="mx-0 mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
               <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  🤖 Kết quả AI Search
                  <button
                     onClick={() => {
                        setIsUsingAIResults(false);
                        setAiSearchResults(null);
                        setFilteredTutors([]);
                     }}
                     className="text-xs text-blue-600 hover:text-blue-800 ml-auto"
                  >
                     ✕ Đóng
                  </button>
               </h4>
               <p className="text-sm text-blue-800 dark:text-blue-200">
                  Tìm thấy {filteredTutors.length} gia sư phù hợp với yêu cầu: "
                  {filters.searchQuery}"
               </p>
               {aiSearchResults?.data?.pagination?.total && (
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                     Tổng cộng: {aiSearchResults.data.pagination.total} kết quả
                     từ AI
                  </p>
               )}
            </div>
         )}

         {/* Pass either AI results or regular filters */}
         <TutorListPage
            filters={isUsingAIResults ? null : appliedFilters}
            aiTutors={isUsingAIResults ? filteredTutors : null}
         />
      </div>
   );
}
