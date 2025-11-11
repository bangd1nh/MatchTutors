import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMaterials, uploadMaterial } from "@/api/material";
import { useToast } from "./useToast";

export const useMaterial = () => {
   const queryClient = useQueryClient();
   const toast = useToast();

   // Get all materials for current user
   const {
      data: materials = [],
      isLoading: isLoadingMaterials,
      refetch,
   } = useQuery({
      queryKey: ["materials"],
      queryFn: getMaterials,
   });

   // Upload material mutation
   const uploadMutation = useMutation({
      mutationFn: (formData: FormData) => uploadMaterial(formData),
      onSuccess: () => {
         toast("success", "Tải lên tài liệu thành công!");
         queryClient.invalidateQueries({ queryKey: ["materials"] });
      },
      onError: (error: any) => {
         toast(
            "error",
            `Tải lên tài liệu thất bại: ${error.message || "Đã có lỗi xảy ra"}`
         );
      },
   });

   return {
      materials,
      isLoadingMaterials,
      upload: uploadMutation.mutate,
      isUploading: uploadMutation.isPending,
      refetch,
   };
};
