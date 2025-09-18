import apiClient from "@/lib/api";
import type { TutorsApiResponse, Tutor } from "@/types/tutorListandDetail";

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
