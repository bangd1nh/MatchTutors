import { useQuery } from "@tanstack/react-query";
import { getTutors, getTutorById } from "@/api/tutorListAndDetail";
import type { TutorsApiResponse, Tutor } from "@/types/tutorListandDetail";

interface UseTutorsOptions {
   page?: number;
   limit?: number;
}

export const useTutors = (options: UseTutorsOptions = {}) => {
   const { page = 1, limit = 6 } = options;

   return useQuery<TutorsApiResponse>({
      queryKey: ["tutors", { page, limit }],
      queryFn: () => getTutors({ page, limit }),
      staleTime: 1000 * 60 * 5, // 5 minutes
      keepPreviousData: true, // Giữ lại dữ liệu cũ khi fetching trang mới để UI không bị giật
   });
};

export const useTutorDetail = (id?: string | null) => {
   return useQuery<Tutor>({
      queryKey: ["tutor", id],
      enabled: Boolean(id),
      queryFn: () => getTutorById(String(id)),
      staleTime: 1000 * 60 * 5,
   });
};
