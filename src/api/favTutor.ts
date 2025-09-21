import apiClient from "@/lib/api";

export const favoriteTutor = async (tutorId: string) => {
   const response = await apiClient.post("/favorite/addFavoriteTutor", {
      favoriteTutorId: tutorId,
   });
   return response.data;
};

export const fetchFavoriteTutor = async (tutorId: string) => {
   const response = await apiClient.get("/favorite/checkFavoriteTutor", {
      params: {
         tutorId,
      },
   });
   return response.data.data;
};

export const deleteFavoriteTutor = async (tutorId: string) => {
   const response = await apiClient.delete("/favorite/deleteFavoriteTutor", {
      data: {
         favoriteTutorId: tutorId,
      },
   });
   return response.data;
};

export const fetchAllFavoriteTutor = async () => {
   const response = await apiClient.get("/favorite/getMyFavoriteTutor");
   return response.data;
};
