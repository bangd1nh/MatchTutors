import {
   deleteFavoriteTutor,
   favoriteTutor,
   fetchAllFavoriteTutor,
   fetchFavoriteTutor,
} from "@/api/favTutor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";
import { FavoriteTutor } from "@/types/favoriteTutor";

export const useAddFav = () => {
   const toast = useToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: favoriteTutor,
      onSuccess: (response, tutor) => {
         toast("success", response.message);
         queryClient.invalidateQueries({ queryKey: ["TUTORFAV", tutor] });
      },
      onError: (error) => {
         console.log(error);
         const errMsg =
            (error as any)?.response?.data?.message ||
            (error as Error).message ||
            "Đã xảy ra lỗi";
         toast("error", errMsg);
      },
   });
};

export const useFetchFav = (tutorId: string, options?: { enabled?: boolean }) => {
   return useQuery<FavoriteTutor>({
      queryKey: ["TUTORFAV", tutorId],
      queryFn: () => fetchFavoriteTutor(tutorId),
      enabled: options?.enabled ?? true, // ✅ allow disabling
   });
};

export const useRemoveFav = () => {
   const toats = useToast();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: deleteFavoriteTutor,
      onSuccess: (response, tutorId) => {
         queryClient.invalidateQueries({ queryKey: ["TUTORFAV", tutorId] });
         toats("success", response.message);
      },
      onError: (error) => {
         const errMsg =
            (error as any)?.response?.data?.message ||
            (error as Error).message ||
            "Đã xảy ra lỗi";
         toats("error", errMsg);
      },
   });
};

export const useFetchAllFav = () => {
   return useQuery({
      queryKey: ["MYFAV"],
      queryFn: () => fetchAllFavoriteTutor(),
   });
};
