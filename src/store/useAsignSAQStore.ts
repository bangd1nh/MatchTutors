import { IQuizInfo } from "@/types/quiz";
import { create } from "zustand";

type useSAQStoreType = {
    saq: asignSAQ[];
    sessionId: string;
    asignSAQ: asignSAQ[];
    isInitialized: boolean;
    initSAQ: (saq: IQuizInfo[], sessionId: string) => void;
    initAsignSAQ: (saq: IQuizInfo[]) => void;
    toggleSAQ: (saq: IQuizInfo, select: boolean) => void;
    setRefetchSAQ: () => void;
    setSessionId: (sessionId: string) => void;
    reset: () => void;
};

export interface asignSAQ extends IQuizInfo {
    isAsigned: boolean;
}

export const useAsignSAQStore = create<useSAQStoreType>((set, get) => ({
    saq: [],
    sessionId: "",
    asignSAQ: [],
    isInitialized: false,

    initSAQ: (saq, sessionId) => {
        const newSAQ = saq.map((s) => {
            return { ...s, isAsigned: true }; // Set to true since these are already assigned
        });
        set({
            saq: newSAQ,
            isInitialized: true,
            sessionId: sessionId,
        });
    },

    initAsignSAQ: (aSaq) => {
        const saqs = get().saq;
        const newAsignSAQ = [
            ...saqs,
            ...aSaq.map((a) => {
                return { ...a, isAsigned: false };
            }),
        ];
        set({
            asignSAQ: newAsignSAQ,
        });
    },

    toggleSAQ: (saq, select) => {
        const current = get().asignSAQ;
        const updatedCurrent = current.map((c) => {
            if (c._id === saq._id) {
                return { ...c, isAsigned: select };
            }
            return c;
        });
        set({ asignSAQ: [...updatedCurrent] });
    },

    setRefetchSAQ: () => {
        const aSaq = get().asignSAQ;
        const updatedSAQs = aSaq.filter((a) => a.isAsigned);
        set({ saq: updatedSAQs });
    },

    setSessionId: (sessionId) => {
        set({ sessionId: sessionId });
    },

    reset: () => {
        set({
            saq: [],
            asignSAQ: [],
            sessionId: "",
            isInitialized: false,
        });
    },
}));