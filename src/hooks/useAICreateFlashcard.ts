import { fetchAIFlashcard, fetchAIMCQ, fetchAISAQ } from "@/api/aiCreateQuiz";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMaterials } from "@/api/material";

export const useAICreateFlashcard = (materialId?: string) => {
   const fetchFL = useQuery({
      queryKey: ["AIFLASHCARD"],
      queryFn: () => fetchAIFlashcard(materialId!),
      enabled: !!materialId,
   });

   const fetchMaterial = useQuery({
      queryKey: ["TUTORMATERIALFORAI", 1, 10],
      queryFn: ({ queryKey }) => {
         const [, pageFromKey = 1, limitFromKey = 10] = queryKey as any;
         return getMaterials(Number(pageFromKey), Number(limitFromKey));
      },
      enabled: true,
   });

   return {
      fetchFL,
      fetchMaterial,
   };
};

export const useAICreateFlashcardMutation = () => {
   const fetchMaterial = useQuery({
      queryKey: ["TUTORMATERIALFORAI", 1, 10],
      queryFn: ({ queryKey }) => {
         const [, pageFromKey = 1, limitFromKey = 10] = queryKey as any;
         return getMaterials(Number(pageFromKey), Number(limitFromKey));
      },
      enabled: true,
   });

   const generateFlashcard = useMutation({
      mutationFn: (materialId: string) => fetchAIFlashcard(materialId!),
      onSuccess: (data) => {
         console.log("AI Generated Flashcards:", data);
      },
      onError: (error) => {
         console.error("AI Generation failed:", error);
      },
   });

   return {
      fetchMaterial,
      generateFlashcard,
   };
};

export const useAICreateMCQMutation = () => {
   const generateMCQ = useMutation({
      mutationFn: (materialId: string) => fetchAIMCQ(materialId!),
      onSuccess: (data) => {
         console.log("AI Generated Flashcards:", data);
      },
      onError: (error) => {
         console.error("AI Generation failed:", error);
      },
   });

   return {
      generateMCQ,
   };
};

export const useAICreateSAQMutation = () => {
   const generateSAQ = useMutation({
      mutationFn: (materialId: string) => fetchAISAQ(materialId!),
      onSuccess: (data) => {
         console.log("AI Generated SAQ:", data);
      },
      onError: (error) => {
         console.error("AI SAQ Generation failed:", error);
      },
   });

   return {
      generateSAQ,
   };
};
