import apiClient from "@/lib/api";
import { IFlashcardAI } from "@/types/aiCreateQuiz";

export const fetchAIFlashcard = async (
   materialId: string
): Promise<IFlashcardAI> => {
   const response = await apiClient.post("/aiCreateQuiz/createFL", {
      materialId,
   });
   return response.data;
};
