import { useQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import {
   getTutors,
   getTutorById,
   searchTutors,
   getSuggestion,
} from "@/api/tutorListAndDetail";
import type { TutorsApiResponse, Tutor } from "@/types/tutorListandDetail";
import { SuggestionResponse } from "@/types/Tutor";
import { useUser } from "./useUser";

interface UseSearchTutorsOptions {
   keyword?: string;
   name?: string;
   subjects?: string[];
   levels?: string[];
   city?: string;
   cities?: string[];
   minRate?: number;
   maxRate?: number;
   minExperience?: number;
   maxExperience?: number;
   classType?: string[];
   availability?: {
      dayOfWeek?: number;
      slots?: string[];
   };
   minRating?: number;
   maxRating?: number;
   page?: number;
   limit?: number;
}

export const useSearchTutors = (
   filters: UseSearchTutorsOptions = {},
   // p0: { enabled: any }
) => {
   return useQuery<TutorsApiResponse>({
      queryKey: ["searchTutors", filters],
      queryFn: () => searchTutors(filters),
      staleTime: 1000 * 60 * 5,
   });
};

interface UseTutorsOptions {
   page?: number;
   limit?: number;
}

export const useTutors = (options: UseTutorsOptions = {}) => {
   const { page = 1, limit = 6 } = options;

   return useQuery<TutorsApiResponse>({
      queryKey: ["tutors", { page, limit }],
      queryFn: () => getTutors({ page, limit }),
      staleTime: 1000 * 60 * 5,
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

export const useTutorSuggestionList = () => {
   const { isAuthenticated, user } = useUser();
   // Lưu thời điểm lần đầu nhận được mảng rỗng
   const firstEmptyResponseTimeRef = useRef<number | null>(null);

   const query = useQuery<SuggestionResponse>({
      queryKey: ["suggestion_tutor"],
      queryFn: async () => {
         try {
            return await getSuggestion();
         } catch (error: any) {
            // Nếu lỗi 404 (chưa có gợi ý), trả về empty response thay vì throw error
            if (error?.response?.status === 404) {
               return {
                  message: "Chưa có gợi ý",
                  code: 404,
                  status: "success",
                  data: {
                     recommendedTutors: [],
                  },
               } as unknown as SuggestionResponse;
            }
            throw error;
         }
      },
      // Chỉ fetch khi đã đăng nhập VÀ là STUDENT
      enabled: isAuthenticated && user?.role === "STUDENT",
      // Tự động refetch mỗi 3 giây khi chưa có data HOẶC đang chờ AI xử lý lần đầu
      refetchInterval: (query) => {
         const data = query.state.data;

         // Nếu chưa có response nào, tiếp tục polling
         if (!data || !data.data) {
            return 3000; // 3 seconds
         }

         // Nếu đã có response và có gợi ý, dừng polling và reset ref
         if (
            Array.isArray(data.data.recommendedTutors) &&
            data.data.recommendedTutors.length > 0
         ) {
            firstEmptyResponseTimeRef.current = null;
            return false;
         }

         // Nếu đã có response nhưng rỗng
         const now = Date.now();

         // Lưu thời điểm lần đầu nhận được mảng rỗng
         if (firstEmptyResponseTimeRef.current === null) {
            firstEmptyResponseTimeRef.current = now;
            return 3000; // Tiếp tục polling lần đầu
         }

         // Nếu đã quá 25 giây  kể từ lần đầu nhận mảng rỗng, dừng polling
         const timeSinceFirstEmpty = now - firstEmptyResponseTimeRef.current;
         if (timeSinceFirstEmpty > 25000) {
            // Đã quá 25 giây, hồ sơ không phù hợp, dừng polling
            return false;
         }

         // Vẫn trong 25 giây đầu, tiếp tục polling (AI có thể đang xử lý)
         return 3000;
      },
      // Tiếp tục refetch ngay cả khi tab không active
      refetchIntervalInBackground: true,
      // Không retry khi gặp lỗi
      retry: false,
      // Đặt staleTime = 0 để luôn refetch khi cần
      staleTime: 0,
      // Ngăn chặn refetch khi focus lại cửa sổ (Alt + Tab hoặc click chuột)
      refetchOnWindowFocus: false,
   });

   // Reset ref khi data thay đổi từ empty sang có data
   useEffect(() => {
      if (
         query.data?.data?.recommendedTutors &&
         Array.isArray(query.data.data.recommendedTutors) &&
         query.data.data.recommendedTutors.length > 0
      ) {
         firstEmptyResponseTimeRef.current = null;
      }
   }, [query.data]);

   return query;
};
