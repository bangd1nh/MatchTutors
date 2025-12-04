import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMaterials, uploadMaterial, deleteMaterial } from "@/api/material";
import { useToast } from "./useToast";

export const useMaterial = (page = 1, limit = 10) => {
   const queryClient = useQueryClient();
   const toast = useToast();

   const {
      data: paginatedData,
      isLoading: isLoadingMaterials,
      refetch,
   } = useQuery({
      queryKey: ["materials", page, limit],
      queryFn: () => getMaterials(page, limit),
   });

   const materials = paginatedData?.items || [];
   const total = paginatedData?.total || 0;
   const totalPages = paginatedData?.totalPages ?? 1;
   const currentPage = paginatedData?.page ?? page;
   const currentLimit = paginatedData?.limit ?? limit;

   // Upload mutation
   const uploadMutation = useMutation({
      mutationFn: (formData: FormData) => uploadMaterial(formData),
      onSuccess: () => {
         toast("success", "Tải lên tài liệu thành công!");
         queryClient.invalidateQueries({
            queryKey: ["materials"],
            exact: false,
         });
      },
      onError: (error: any) => {
         toast(
            "error",
            `Tải lên tài liệu thất bại: ${error.message || "Đã có lỗi xảy ra"}`
         );
      },
   });

   // Delete mutation
   const deleteMutation = useMutation({
      mutationFn: (materialId: string) => deleteMaterial(materialId),
      onSuccess: () => {
         toast("success", "Xóa tài liệu thành công!");
         queryClient.invalidateQueries({
            queryKey: ["materials"],
            exact: false,
         });
      },
      onError: (error: any) => {
         toast(
            "error",
            `Xóa tài liệu thất bại: ${error.message || "Đã có lỗi xảy ra"}`
         );
      },
   });

   return {
      materials,
      total,
      totalPages,
      currentPage,
      currentLimit,
      isLoadingMaterials,
      upload: uploadMutation.mutate,
      isUploading: uploadMutation.isPending,
      deleteMaterial: deleteMutation.mutate,
      isDeleting: deleteMutation.isPending,
      refetch,
   };
};
