import { createMCQ } from "@/api/multipleChoiceQuiz";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./useToast";

export const useMCQ = () => {
   const addToast = useToast();
   const create = useMutation({
      mutationFn: createMCQ,
      onSuccess: (response) => addToast("success", response.message),
      onError: (error: any) => {
         addToast(
            "error",
            error?.response?.data.message || "Error creating MCQ"
         );
         console.log("Error creating MCQ:", error);
      },
   });

   return { create };
};
