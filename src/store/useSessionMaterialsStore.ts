import { create } from "zustand";

interface Material {
   _id: string;
   title: string;
   description?: string;
   fileUrl?: string;
   isAssigned?: boolean;
}

interface SessionMaterialsStore {
   materials: Material[];
   isInitialized: boolean;
   initFromAPI: (materials: Material[]) => void;
   addMaterial: (material: Material) => void;
   removeMaterial: (materialId: string) => void;
   reset: () => void;
}

export const useSessionMaterialsStore = create<SessionMaterialsStore>(
   (set) => ({
      materials: [],
      isInitialized: false,
      initFromAPI: (materials: Material[]) => {
         set({
            materials: materials.map((m) => ({
               ...m,
               isAssigned: true,
            })),
            isInitialized: true,
         });
      },
      addMaterial: (material: Material) => {
         set((state) => ({
            materials: [...state.materials, { ...material, isAssigned: true }],
         }));
      },
      removeMaterial: (materialId: string) => {
         set((state) => ({
            materials: state.materials.filter((m) => m._id !== materialId),
         }));
      },
      reset: () => {
         set({
            materials: [],
            isInitialized: false,
         });
      },
   })
);
