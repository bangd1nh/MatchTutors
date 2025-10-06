import apiClient from "@/lib/api";
import type { TutorsApiResponse, Tutor } from "@/types/tutorListandDetail";

interface SearchTutorsParams {
   keyword?: string;
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

/**
 * Search tutors with filters & pagination
 */
export const searchTutors = async (
   params: SearchTutorsParams = {}
): Promise<TutorsApiResponse> => {
   const response = await apiClient.get("/tutor/search", {
      params: {
         ...params,
         subjects: params.subjects?.join(","),
         levels: params.levels?.join(","),
         classType: params.classType?.join(","),
         cities: params.cities?.join(","),
         availability: params.availability
            ? JSON.stringify(params.availability)
            : undefined,
      },
   });

   const payload = response.data?.data ?? response.data;
   return payload?.data ? payload : payload;
};

interface GetTutorsParams {
   page?: number;
   limit?: number;
}

/**
 * Fetches a paginated list of approved tutors from the API.
 * @returns payload shaped as { data: Tutor[], pagination: {...} }
 */
export const getTutors = async (
   params: GetTutorsParams = {}
): Promise<TutorsApiResponse> => {
   const { page = 1, limit = 6 } = params;
   const response = await apiClient.get("/tutor", {
      params: { page, limit },
   });

   const payload = response.data?.data ?? response.data;
   return payload?.data ? payload : payload;
};

export const getTutorById = async (id: string): Promise<Tutor> => {
   const response = await apiClient.get(`/tutor/${id}`);

   const d = response.data ?? {};
   const candidate =
      d.data?.metadata ?? d.data?.data ?? d.data ?? d.metadata ?? d; // fallback

   return candidate?.data ?? candidate;
};

export default {
   getTutors,
   getTutorById,
};
