import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
   addMaterialToSession,
   removeMaterialFromSession,
} from "@/api/material";
import { useToast } from "./useToast";
import { useSessionMaterialsStore } from "@/store/useSessionMaterialsStore";

export const useSessionMaterials = (sessionId?: string) => {
   const queryClient = useQueryClient();
   const toast = useToast();
   const { removeMaterial: removeMaterialFromStore } =
      useSessionMaterialsStore();

   const addMaterialMutation = useMutation({
      mutationFn: (materialId: string) => {
         if (!sessionId) throw new Error("Session ID is required");
         return addMaterialToSession(sessionId, materialId);
      },
      onSuccess: () => {
         toast("success", "Thêm tài liệu vào buổi học thành công!");
         queryClient.invalidateQueries({ queryKey: ["sessions", sessionId] });
      },
      onError: (error: any) => {
         toast(
            "error",
            `Thêm tài liệu thất bại: ${error.message || "Đã có lỗi xảy ra"}`
         );
      },
   });

   const removeMaterialMutation = useMutation({
      mutationFn: (materialId: string) => {
         if (!sessionId) throw new Error("Session ID is required");
         return removeMaterialFromSession(sessionId, materialId);
      },
      onSuccess: (materialId: string) => {
         // Cập nhật store ngay lập tức
         removeMaterialFromStore(materialId);
         toast("success", "Gỡ tài liệu khỏi buổi học thành công!");
         queryClient.invalidateQueries({ queryKey: ["sessions", sessionId] });
      },
      onError: (error: any) => {
         toast(
            "error",
            `Gỡ tài liệu thất bại: ${error.message || "Đã có lỗi xảy ra"}`
         );
      },
   });

   return {
      addMaterial: addMaterialMutation.mutate,
      removeMaterial: removeMaterialMutation.mutate,
      isAddingMaterial: addMaterialMutation.isPending,
      isRemovingMaterial: removeMaterialMutation.isPending,
   };
};
