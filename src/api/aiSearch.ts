import apiClient from "@/lib/api";
import { ITutorSearchResponse } from "@/types/tutorListandDetail";

export const fetchSearch = async (
   keyword: string
): Promise<ITutorSearchResponse> => {
   const response = await apiClient.get("/embedding/search", {
      params: { keyword },
   });

   return response.data;
};
