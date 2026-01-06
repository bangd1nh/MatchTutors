import apiClient from "@/lib/api";
import { SuggestionResponse } from "@/types/Tutor";
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

export const getSuggestion = async (): Promise<SuggestionResponse> => {
   const response = await apiClient.get("/tutor/suggestion");
   return response.data;
};

/**
 * Lấy lịch dạy (sessions) của một tutor
 */
export interface TutorSession {
   _id: string;
   startTime: string | Date;
   endTime: string | Date;
   status: string;
   location?: string | null;
   notes?: string | null;
   subject: string;
   level?: string | null;
   student: {
      _id?: string | null;
      name: string;
      avatarUrl?: string | null;
   };
}

export interface AvailabilitySlot {
   freeHours?: number;
   freeMinutes?: number;
   timeFrame?: "PRE_12" | "MID_12_17" | "AFTER_17" | null;
}

export interface TutorSessionsResponse {
   sessions: TutorSession[];
   tutor: {
      _id: string;
      name: string;
      avatarUrl?: string | null;
      availability: Array<{
         dayOfWeek: number; // 1 = Thứ 2, 2 = Thứ 3, ..., 7 = Chủ nhật
         slots: AvailabilitySlot[];
      }>;
   };
   dateRange: {
      startDate: string;
      endDate: string;
      view: string;
   };
}

export const getTutorSessions = async (
   tutorId: string,
   params?: {
      view?: "year" | "month" | "week";
      startDate?: string;
      endDate?: string;
   }
): Promise<TutorSessionsResponse> => {
   const response = await apiClient.get(`/tutor/${tutorId}/sessions`, {
      params,
   });

   const data = response.data?.data ?? response.data;
   return {
      sessions: data.sessions ?? [],
      tutor: data.tutor ?? {},
      dateRange: data.dateRange ?? {},
   };
};

export default {
   getTutors,
   getTutorById,
};
