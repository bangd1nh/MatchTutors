import { IQuizInfo } from "@/types/quiz";
import { create } from "zustand";

type useMCQStoreType = {
   mcq: asignMCQ[];
   sessionId: string;
   asignMCQ: asignMCQ[];
   isInitialized: boolean;
   initMCQ: (mcq: IQuizInfo[], sessionId: string) => void;
   initAsignMCQ: (mcq: IQuizInfo[]) => void;
   toggleMCQ: (mcq: IQuizInfo, select: boolean) => void;
   setRefetchMCQ: () => void;
   setSessionId: (sessionId: string) => void;
   reset: () => void;
};

export interface asignMCQ extends IQuizInfo {
   isAsigned: boolean;
}

export const useAsignMCQStore = create<useMCQStoreType>((set, get) => ({
   mcq: [],
   sessionId: "",
   asignMCQ: [],
   isInitialized: false,

   initMCQ: (mcq, sessionId) => {
      const newMCQ = mcq.map((m) => {
         return { ...m, isAsigned: true }; // Set to true since these are already assigned
      });
      set({
         mcq: newMCQ,
         isInitialized: true,
         sessionId: sessionId,
      });
   },

   initAsignMCQ: (aMcq) => {
      const mcqs = get().mcq;
      const newAsignMCQ = [
         ...mcqs,
         ...aMcq.map((a) => {
            return { ...a, isAsigned: false };
         }),
      ];
      set({
         asignMCQ: newAsignMCQ,
      });
   },

   toggleMCQ: (mcq, select) => {
      const current = get().asignMCQ;
      const updatedCurrent = current.map((c) => {
         if (c._id === mcq._id) {
            return { ...c, isAsigned: select };
         }
         return c;
      });
      set({ asignMCQ: [...updatedCurrent] });
   },

   setRefetchMCQ: () => {
      const aMcq = get().asignMCQ;
      const updatedMCQs = aMcq.filter((a) => a.isAsigned);
      set({ mcq: updatedMCQs });
   },

   setSessionId: (sessionId) => {
      set({ sessionId: sessionId });
   },

   reset: () => {
      set({
         mcq: [],
         asignMCQ: [],
         sessionId: "",
         isInitialized: false,
      });
   },
}));
