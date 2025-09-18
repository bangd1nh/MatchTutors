// filepath: src/pages/Tutor/TutorList.tsx
import { useState } from "react";
import { useTutors } from "@/hooks/useTutorListAndDetail";
import { TutorCard } from "@/components/tutor/tutor-search/TutorCard";
import { Pagination } from "@/components/common/Pagination";
import { Loader2 } from "lucide-react";
import { Tutor } from "@/types/tutorListandDetail";

export default function TutorListPage() {
   const [currentPage, setCurrentPage] = useState(1);
   const tutorsPerPage = 6;

   const {
      data: tutorData,
      isLoading,
      isError,
   } = useTutors({ page: currentPage, limit: tutorsPerPage });

   // tutorData may be either an array of tutors or an object containing { data, pagination }.
   // Use a runtime check and a narrow assertion to handle both shapes without type errors.
   const tutors: Tutor[] = Array.isArray(tutorData)
      ? tutorData
      : (tutorData as any)?.data || [];
   const totalPages = Math.max(
      1,
      (Array.isArray(tutorData)
         ? 1
         : (tutorData as any)?.pagination?.totalPages) || 1
   ); // ensure >= 1

   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

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
         <div className="mb-6">
            <h1 className="text-3xl font-bold">Danh sách Gia sư</h1>
            <p className="text-muted-foreground">
               Khám phá các gia sư hàng đầu của chúng tôi.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
               <TutorCard key={tutor._id} tutor={tutor} />
            ))}
         </div>

         {/* ALWAYS render Pagination UI (even when totalPages === 1) */}
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
