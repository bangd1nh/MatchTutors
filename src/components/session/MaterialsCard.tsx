import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Loader2, Trash2, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import { useSessionMaterials } from "@/hooks/useSessionMaterials";
import { useQuery } from "@tanstack/react-query";

import MaterialListModal from "./MaterialListModal";
import { useSessionMaterialsStore } from "@/store/useSessionMaterialsStore";

// Import hàm lấy materials của session
import { getMaterialsBySessionId } from "@/api/material";

export default function MaterialsCard({ session, canEdit }: any) {
   const {
      materials,
      isInitialized,
      initFromAPI,
      reset,
      removeMaterial: removeMaterialFromStore,
   } = useSessionMaterialsStore();

   const { removeMaterial, isRemovingMaterial } = useSessionMaterials(
      session._id
   );

   const [isShowingModal, setIsShowingModal] = useState(false);

   // Lấy materials của session (realtime)
   const {
      data: sessionMaterialsData = [],
      isLoading: isLoadingSessionMaterials,
      refetch: refetchSessionMaterials,
   } = useQuery({
      queryKey: ["sessions", session._id, "materials"],
      queryFn: () => getMaterialsBySessionId(session._id),
      enabled: !!session._id,
      staleTime: 0, // Luôn coi dữ liệu là cũ để refetch khi quay lại tab
   });

   // Khởi tạo store từ session materials
   useEffect(() => {
      if (
         !isLoadingSessionMaterials &&
         session._id &&
         sessionMaterialsData.length >= 0
      ) {
         initFromAPI(sessionMaterialsData);
      }
   }, [
      session._id,
      sessionMaterialsData,
      isLoadingSessionMaterials,
      isInitialized,
      initFromAPI,
   ]);

   // Refetch session materials khi tab được focus lại
   useEffect(() => {
      const handleVisibilityChange = () => {
         if (!document.hidden) {
            refetchSessionMaterials();
         }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
         document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
         );
      };
   }, [refetchSessionMaterials]);

   // Cleanup khi unmount
   useEffect(() => {
      return () => {
         if (session._id) {
            reset();
         }
      };
   }, [session._id, reset]);

   const handleRemoveMaterial = (materialId: string) => {
      removeMaterialFromStore(materialId);
      removeMaterial(materialId);
   };

   if (isLoadingSessionMaterials) {
      return (
         <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Đang tải danh sách tài liệu...</p>
         </div>
      );
   }

   return (
      <Fragment>
         <MaterialListModal
            isOpen={isShowingModal}
            onClose={() => {
               setIsShowingModal(false);
               // Refetch sau khi close modal để cập nhật dữ liệu mới
               refetchSessionMaterials();
            }}
            sessionId={session._id}
         />
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tài liệu buổi học ({materials.length})
               </CardTitle>
               {canEdit && (
                  <Button size="sm" onClick={() => setIsShowingModal(true)}>
                     <Plus className="h-4 w-4 mr-2" />
                     Gắn tài liệu
                  </Button>
               )}
            </CardHeader>
            <CardContent>
               {materials.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                     <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                     <p>Chưa có tài liệu nào.</p>
                     {canEdit && (
                        <p className="text-sm mt-2">
                           Nhấn "Gắn tài liệu" để thêm tài liệu.
                        </p>
                     )}
                  </div>
               ) : (
                  <div className="space-y-3">
                     {materials.map((material: any) => (
                        <div
                           key={material._id}
                           className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                           <div className="flex items-center gap-3 flex-1">
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
                           <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => {
                                    if (material.fileUrl) {
                                       window.open(material.fileUrl, "_blank");
                                    }
                                 }}
                              >
                                 <Download className="h-4 w-4 mr-2" />
                                 Tải xuống
                              </Button>
                              {canEdit && (
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={isRemovingMaterial}
                                    onClick={() =>
                                       handleRemoveMaterial(material._id)
                                    }
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                 >
                                    <Trash2 className="h-4 w-4" />
                                 </Button>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </CardContent>
         </Card>
      </Fragment>
   );
}
