import { IQuizInfo } from "@/types/quiz";
import { create } from "zustand";

export interface AsignFlashcard extends IQuizInfo {
   isAsigned: boolean;
}

type AsignFlashcardStore = {
   flashcards: AsignFlashcard[];
   isInitialized: boolean;
   sessionId: string;
   asignFl: AsignFlashcard[];
   setAsignFlashcards: (flashcards: IQuizInfo[]) => void;
   initFromAPI: (sessionId: string, apiData: IQuizInfo[]) => void;
   toogleFlashcard: (flashcard: IQuizInfo, select: boolean) => void;
   setRefetchFlashcard: () => void;
   reset: () => void;
};

export const useAsignFlashcardStore = create<AsignFlashcardStore>(
   (set, get) => ({
      flashcards: [],
      isInitialized: false,
      asignFl: [],
      sessionId: "",
      initFromAPI: (sessionId: string, apiData: IQuizInfo[]) => {
         const current = get();

         if (current.sessionId !== sessionId || !current.isInitialized) {
            set({
               flashcards: [
                  ...apiData.map((f) => {
                     return { ...f, isAsigned: true };
                  }),
               ],
               isInitialized: true,
               sessionId: sessionId,
            });
         }
      },
      setAsignFlashcards: (aFL: IQuizInfo[]) => {
         const flashcards = get().flashcards;
         set({
            asignFl: [
               ...flashcards,
               ...aFL.map((a) => {
                  return { ...a, isAsigned: false };
               }),
            ],
         });
      },
      toogleFlashcard: (flashcard: IQuizInfo, select: boolean) => {
         const current = get().asignFl;
         const updatedCurrent = current.map((c) => {
            if (c._id === flashcard._id) {
               return { ...c, isAsigned: select };
            }
            return c;
         });
         set({ asignFl: [...updatedCurrent] });
      },
      setRefetchFlashcard: () => {
         const afl = get().asignFl;
         const updatedFlashcards = afl.filter((a) => a.isAsigned);
         set({ flashcards: updatedFlashcards });
      },
      reset: () => {
         set({
            flashcards: [],
            isInitialized: false,
            sessionId: "",
         });
      },
   })
);
