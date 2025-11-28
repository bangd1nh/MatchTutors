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

export const fetchAIMCQ = async (materialId: string): Promise<IFlashcardAI> => {
   const response = await apiClient.post("/aiCreateQuiz/createMCQ", {
      materialId,
   });
   return response.data;
};

export const fetchAISAQ = async (materialId: string): Promise<IFlashcardAI> => {
   const response = await apiClient.post("/aiCreateQuiz/createSAQ", {
      materialId,
   });
   return response.data;
};
