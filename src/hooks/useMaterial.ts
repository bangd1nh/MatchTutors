import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMaterials, uploadMaterial } from "@/api/material";
import { useToast } from "./useToast";

export const useMaterial = () => {
   const queryClient = useQueryClient();
   const addToast = useToast();

   const {
      data: materials,
      isLoading: isLoadingMaterials,
      error: materialsError,
   } = useQuery({
      queryKey: ["materials"],
      queryFn: getMaterials,
   });

   const {
      mutate: upload,
      isPending: isUploading,
      error: uploadError,
   } = useMutation({
      mutationFn: (formData: FormData) => uploadMaterial(formData),
      onSuccess: () => {
         addToast("success", "Tải lên tài liệu thành công!");
         queryClient.invalidateQueries({ queryKey: ["materials"] });
      },
      onError: (error) => {
         addToast(
            "error",
            `Tải lên thất bại: ${error.message || "Đã có lỗi xảy ra"}`
         );
      },
   });

   return {
      materials,
      isLoadingMaterials,
      materialsError,
      upload,
      isUploading,
      uploadError,
   };
};
