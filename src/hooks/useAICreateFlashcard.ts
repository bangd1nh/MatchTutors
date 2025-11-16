import { fetchAIFlashcard, fetchAIMCQ } from "@/api/aiCreateQuiz";
import { getMaterials } from "@/api/material";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAICreateFlashcard = (materialId?: string) => {
   const fetchFL = useQuery({
      queryKey: ["AIFLASHCARD"],
      queryFn: () => fetchAIFlashcard(materialId!),
      enabled: !!materialId,
   });

   const fetchMaterial = useQuery({
      queryKey: ["TUTORMATERIALFORAI"],
      queryFn: getMaterials,
   });

   return {
      fetchFL,
      fetchMaterial,
   };
};

export const useAICreateFlashcardMutation = () => {
   const fetchMaterial = useQuery({
      queryKey: ["TUTORMATERIALFORAI"],
      queryFn: getMaterials,
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
