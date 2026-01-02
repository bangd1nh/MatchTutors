import { useQuery } from "@tanstack/react-query";
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
   filters: UseSearchTutorsOptions = {}
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
   const { isAuthenticated } = useUser();

   return useQuery<SuggestionResponse>({
      queryKey: ["suggestion_tutor"],
      queryFn: () => getSuggestion(),
      enabled: !!isAuthenticated,
   });
};
