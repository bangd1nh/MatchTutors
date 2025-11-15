import { fetchSearch } from "@/api/aiSearch";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./useToast";

export const useAISearch = () => {
   const addToast = useToast();
   const tutorSearch = useMutation({
      mutationFn: fetchSearch,
      onSuccess: (response) => {
         addToast("success", response.message);
      },
      onError: (error) => {
         addToast("error", error.message);
      },
   });

   return {
      tutorSearch,
   };
};
