import { useAICreateFlashcard } from "@/hooks/useAICreateFlashcard";
import React, { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
   FileText,
   Download,
   Calendar,
   User,
   Search,
   Loader2,
   Wand2,
   X,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface MaterialModalProps {
   isOpen?: boolean;
   onClose?: () => void;
   onSelectMaterial?: (materialId: string) => void;
}

export interface AIMaterial {
   _id: string;
   title: string;
   description: string;
   fileUrl: string;
   uploadedAt: string;
   uploadedBy: {
      _id: string;
      name: string;
      email: string;
   };
   __v: number;
}

const MaterialModal: React.FC<MaterialModalProps> = ({
   isOpen = false,
   onClose,
   onSelectMaterial,
}) => {
   const { fetchMaterial } = useAICreateFlashcard();
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
      null
   );

   const materials = (fetchMaterial.data || []) as unknown as AIMaterial[];

   // Filter materials based on search term
   const filteredMaterials = materials.filter(
      (material) =>
         material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         material.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
         material.uploadedBy.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
   );

   const formatDate = (dateString: string) => {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
   };

   const getFileExtension = (url: string) => {
      const extension = url.split(".").pop()?.toUpperCase();
      return extension || "FILE";
   };

   const handleSelectMaterial = (materialId: string) => {
      setSelectedMaterialId(materialId);
   };

   const handleCreateFlashcard = () => {
      if (selectedMaterialId) {
         // Optional: Call onSelectMaterial again to ensure parent state is updated
         if (onSelectMaterial) {
            onSelectMaterial(selectedMaterialId);
         }
         onClose?.();
      }
   };

   if (fetchMaterial.isLoading) {
      return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
               <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                  <span className="text-lg">
                     Đang tải danh sách tài liệu...
                  </span>
               </div>
            </DialogContent>
         </Dialog>
      );
   }

   if (fetchMaterial.isError) {
      return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
               <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-red-400 mb-4" />
                  <h3 className="text-lg font-medium text-red-600 mb-2">
                     Lỗi tải tài liệu
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     Không thể tải danh sách tài liệu. Vui lòng thử lại sau.
                  </p>
               </div>
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Tạo Flashcard bằng AI từ tài liệu
               </DialogTitle>
               <DialogDescription>
                  Chọn tài liệu để AI tạo flashcard tự động. Tìm thấy{" "}
                  {materials.length} tài liệu.
               </DialogDescription>
            </DialogHeader>

            {/* Search Input */}
            <div className="relative mb-4">
               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input
                  placeholder="Tìm kiếm theo tên tài liệu, mô tả hoặc người tải..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
               />
            </div>

            {/* Materials List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
               {filteredMaterials.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                     <Search className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                     <p className="text-muted-foreground">
                        {searchTerm
                           ? "Không tìm thấy tài liệu phù hợp"
                           : "Chưa có tài liệu nào"}
                     </p>
                  </div>
               ) : (
                  filteredMaterials.map((material) => (
                     <Card
                        key={material._id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                           selectedMaterialId === material._id
                              ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                              : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleSelectMaterial(material._id)}
                     >
                        <CardContent className="p-4">
                           <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                 </div>
                              </div>

                              <div className="flex-1 min-w-0 space-y-2">
                                 <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-foreground truncate pr-2">
                                       {material.title}
                                    </h3>
                                    <Badge
                                       variant="outline"
                                       className="text-xs shrink-0"
                                    >
                                       {getFileExtension(material.fileUrl)}
                                    </Badge>
                                 </div>

                                 <p className="text-sm text-muted-foreground line-clamp-2">
                                    {material.description || "Không có mô tả"}
                                 </p>

                                 <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                       <User className="h-3 w-3" />
                                       <span>{material.uploadedBy.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                       <Calendar className="h-3 w-3" />
                                       <span>
                                          {formatDate(material.uploadedAt)}
                                       </span>
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground truncate">
                                       {material.uploadedBy.email}
                                    </span>
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          window.open(
                                             material.fileUrl,
                                             "_blank"
                                          );
                                       }}
                                       className="h-7 px-2 text-xs"
                                    >
                                       <Download className="h-3 w-3 mr-1" />
                                       Tải xuống
                                    </Button>
                                 </div>
                              </div>

                              {/* Selection Indicator */}
                              {selectedMaterialId === material._id && (
                                 <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                       <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </CardContent>
                     </Card>
                  ))
               )}
            </div>

            {/* Footer */}
            <DialogFooter className="flex items-center justify-between pt-4 border-t">
               <div className="text-sm text-muted-foreground">
                  {selectedMaterialId ? (
                     <span>Đã chọn 1 tài liệu</span>
                  ) : (
                     <span>Chọn một tài liệu để tiếp tục</span>
                  )}
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                     <X className="h-4 w-4 mr-2" />
                     Hủy
                  </Button>
                  <Button
                     onClick={handleCreateFlashcard}
                     disabled={!selectedMaterialId}
                     className="min-w-[120px]"
                  >
                     <Wand2 className="h-4 w-4 mr-2" />
                     Tạo Flashcard
                  </Button>
               </div>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default MaterialModal;
