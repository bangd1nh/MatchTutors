import { Pagination } from "@/components/common/Pagination";
import { TutorCard } from "@/components/tutor/tutor-search/TutorCard";
import { useFetchAllFav } from "@/hooks/useFavTutor";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 6;

const FavoriteTutor = () => {
   const { data: favTutors, isLoading, isError, error } = useFetchAllFav();
   const [currentPage, setCurrentPage] = useState(1);

   if (isLoading) {
      return (
         <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
         </div>
      );
   }

   if (
      isError &&
      ((error as any)?.response?.status === 500 ||
         error?.message?.includes("500"))
   ) {
      return (
         <div className="text-center text-muted-foreground p-10">
            Bạn chưa có gia sư yêu thích nào.
         </div>
      );
   }

   if (isError) {
      return (
         <div className="text-center text-red-500 p-10">
            Không thể tải hồ sơ học gia sư.
         </div>
      );
   }

   const tutors = favTutors?.data?.tutors || [];

   if (tutors.length === 0) {
      return (
         <div className="text-center text-muted-foreground p-10">
            Bạn chưa có gia sư yêu thích nào.
         </div>
      );
   }

   const totalPages = Math.ceil(tutors.length / PAGE_SIZE);
   const pagedTutors = tutors.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
   );

   return (
      <div className="p-4">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedTutors.map((tutor: any) => (
               <TutorCard key={tutor._id} tutor={tutor} />
            ))}
         </div>
         <div className="mt-8 flex justify-center">
            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={setCurrentPage}
            />
         </div>
      </div>
   );
};

export default FavoriteTutor;
