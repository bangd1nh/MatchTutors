import TutorFilterBar from "@/components/tutor/tutor-search/TutorFilterSidebar";
import TutorListPage from "./TutorList";
import { useState } from "react";

export default function TutorSearch() {
   type FiltersType = {
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

   const handleFilterChange = (newFilters: Partial<FiltersType>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
   };

   const handleApplyFilters = () => {
      setAppliedFilters(filters); // apply current UI filters
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

         {/* Only searches when appliedFilters changes */}
         <TutorListPage filters={appliedFilters} />
      </div>
   );
}