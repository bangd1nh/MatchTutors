import { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMaterials } from "@/api/material";
import { useSessionMaterials } from "@/hooks/useSessionMaterials";
import { useSessionMaterialsStore } from "@/store/useSessionMaterialsStore";
import { useToast } from "@/hooks/useToast";

interface MaterialListModalProps {
   isOpen: boolean;
   onClose: () => void;
   sessionId: string;
}

export default function MaterialListModal({
   isOpen,
   onClose,
   sessionId,
}: MaterialListModalProps) {
   const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
   const toast = useToast();
   const { addMaterial: addMaterialToStore } = useSessionMaterialsStore();

   const { data, isLoading } = useQuery({
      queryKey: ["materials"],
      queryFn: () => getMaterials(),
      enabled: isOpen,
   });

   // Normalize query result to always be an array for consistent usage (find/map/length)
   const availableMaterials = Array.isArray(data) ? data : data?.items ?? [];

   const { addMaterial, isAddingMaterial } = useSessionMaterials(sessionId);

   const handleToggleMaterial = (materialId: string) => {
      setSelectedMaterials((prev) =>
         prev.includes(materialId)
            ? prev.filter((id) => id !== materialId)
            : [...prev, materialId]
      );
   };

   const handleAddMaterials = async () => {
      if (selectedMaterials.length === 0) {
         toast("error", "Vui lòng chọn ít nhất một tài liệu");
         return;
      }

      try {
         for (const materialId of selectedMaterials) {
            const material = availableMaterials.find(
               (m: any) => m._id === materialId
            );
            if (material) {
               // Cập nhật store trước khi gọi API
               addMaterialToStore(material);
               // Gọi API để lưu trên backend
               await addMaterial(materialId);
            }
         }

         setSelectedMaterials([]);
         onClose();
      } catch (error) {
         toast("error", "Có lỗi xảy ra khi thêm tài liệu. Vui lòng thử lại.");
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle>Chọn tài liệu để gắn vào buổi học</DialogTitle>
            </DialogHeader>

            {isLoading ? (
               <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-4">Đang tải danh sách tài liệu...</p>
               </div>
            ) : availableMaterials.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Bạn chưa có tài liệu nào.</p>
               </div>
            ) : (
               <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4">
                  {availableMaterials.map((material: any) => (
                     <div
                        key={material._id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleToggleMaterial(material._id)}
                     >
                        <Checkbox
                           checked={selectedMaterials.includes(material._id)}
                           onChange={() => handleToggleMaterial(material._id)}
                           className="cursor-pointer"
                        />
                        <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                           <p className="font-medium truncate">
                              {material.title}
                           </p>
                           <p className="text-sm text-muted-foreground truncate">
                              {material.description || "Không có mô tả"}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
               <Button variant="outline" onClick={onClose}>
                  Hủy
               </Button>
               <Button
                  onClick={handleAddMaterials}
                  disabled={
                     isAddingMaterial ||
                     selectedMaterials.length === 0 ||
                     isLoading
                  }
               >
                  {isAddingMaterial ? (
                     <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang thêm...
                     </>
                  ) : (
                     `Thêm tài liệu (${selectedMaterials.length})`
                  )}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}
