import { useState } from "react";
import { useMaterial } from "@/hooks/useMaterial";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FileDown, PlusCircle, FileText, Trash2, Loader2 } from "lucide-react"; // added Loader2
import { Pagination } from "@/components/common/Pagination"; // <-- added

const getFileExt = (fileUrlOrName?: string) => {
   if (!fileUrlOrName) return "";
   try {
      const cleaned = decodeURIComponent(fileUrlOrName.split("?")[0]);
      const ext = cleaned.split(".").pop() || "";
      return ext.toUpperCase();
   } catch {
      return "";
   }
};

const MaterialManagementPage = () => {
   // pagination state
   const [page, setPage] = useState<number>(1);
   const [limit] = useState<number>(10);

   // pass page & limit into hook
   const {
      materials,
      isLoadingMaterials,
      deleteMaterial,
      totalPages,
      currentPage,
   } = useMaterial(page, limit);

   const [confirmOpen, setConfirmOpen] = useState(false);
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [deletingId, setDeletingId] = useState<string | null>(null);

   if (isLoadingMaterials) {
      return <div>Đang tải danh sách tài liệu...</div>;
   }

   const openConfirm = (id: string) => {
      setSelectedId(id);
      setConfirmOpen(true);
   };

   const handleConfirmDelete = () => {
      if (!selectedId) return;
      setDeletingId(selectedId);
      deleteMaterial(selectedId, {
         onSuccess: () => {
            setDeletingId(null);
            setConfirmOpen(false);
            setSelectedId(null);
         },
         onError: () => {
            setDeletingId(null);
            setConfirmOpen(false);
            setSelectedId(null);
         },
      });
   };

   // ensure UI shows at least 1 page
   const effectiveTotalPages = Math.max(1, totalPages || 1);

   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <div>
               <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-amber-50 text-amber-600">
                     <PlusCircle className="h-5 w-5" />
                  </div>
                  <div>
                     <CardTitle className="text-lg">Quản lý tài liệu</CardTitle>
                     <CardDescription className="text-slate-500">
                        Xem, tải xuống hoặc thêm tài liệu giảng dạy của bạn.
                     </CardDescription>
                  </div>
               </div>
            </div>

            <Button asChild>
               <Link
                  to="/tutor/create-material"
                  className="flex items-center gap-2"
               >
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Thêm tài liệu
               </Link>
            </Button>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Tiêu đề</TableHead>
                     <TableHead>Mô tả</TableHead>
                     <TableHead>Ngày tải lên</TableHead>
                     <TableHead className="text-center">Tải xuống</TableHead>
                     <TableHead className="text-center">Hành động</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {materials && materials.length > 0 ? (
                     materials.map((material: any) => {
                        const fileLabel =
                           material.fileName || material.fileUrl || "";
                        const ext = getFileExt(fileLabel);
                        const id = material.id || material._id;
                        const isRowDeleting = deletingId === id;
                        return (
                           <TableRow key={id}>
                              <TableCell className="font-medium">
                                 <div className="flex items-center justify-between">
                                    <div>
                                       <div>{material.title}</div>
                                       <div className="text-xs text-slate-500 mt-1">
                                          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 bg-slate-100 text-slate-700">
                                             <FileText className="h-3 w-3 text-amber-600" />
                                             {ext || "FILE"}
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </TableCell>
                              {/* cho phép wrap xuống dòng, giới hạn chiều rộng để tránh kéo layout */}
                              <TableCell className="max-w-[60ch] whitespace-pre-wrap break-words">
                                 {material.description}
                              </TableCell>
                              <TableCell>
                                 {material.uploadedAt
                                    ? format(
                                         new Date(material.uploadedAt),
                                         "dd/MM/yyyy"
                                      )
                                    : "N/A"}
                              </TableCell>

                              {/* Download column (separate) */}
                              <TableCell className="text-center">
                                 <Button variant="ghost" size="icon" asChild>
                                    <a
                                       href={material.fileUrl}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       download
                                       className="flex items-center"
                                    >
                                       <FileDown className="h-4 w-4 text-rose-600" />
                                    </a>
                                 </Button>
                              </TableCell>

                              {/* Delete column (separate) */}
                              <TableCell className="text-center">
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openConfirm(id)}
                                    disabled={isRowDeleting}
                                    aria-label="Xóa tài liệu"
                                 >
                                    {isRowDeleting ? (
                                       <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                                    ) : (
                                       <Trash2 className="h-4 w-4 text-rose-500" />
                                    )}
                                 </Button>
                              </TableCell>
                           </TableRow>
                        );
                     })
                  ) : (
                     <TableRow>
                        <TableCell colSpan={5} className="text-center">
                           Bạn chưa có tài liệu nào.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>

         {/* Pagination: luôn hiển thị ít nhất trang 1 */}
         <div className="p-4 flex justify-end">
            <Pagination
               currentPage={currentPage || page}
               totalPages={effectiveTotalPages}
               onPageChange={(p) => setPage(p)}
               maxVisiblePages={7}
            />
         </div>

         {/* Confirmation dialog */}
         <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Xác nhận xóa</DialogTitle>
                  <DialogDescription>
                     Bạn có chắc muốn xóa tài liệu này? Nó sẽ ảnh hưởng đến các
                     buổi học được gán vào
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                     Hủy
                  </Button>
                  <Button
                     className="bg-rose-600 hover:bg-rose-700"
                     onClick={handleConfirmDelete}
                     disabled={!selectedId}
                  >
                     Xóa
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </Card>
   );
};

export default MaterialManagementPage;
