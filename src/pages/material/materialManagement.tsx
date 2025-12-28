import { useState } from "react";
import { useMaterial, MaterialFilters } from "@/hooks/useMaterial";
import { useTutorProfile } from "@/hooks/useTutorProfile";
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
import {
   FileDown,
   PlusCircle,
   FileText,
   Trash2,
   Loader2,
   X,
   Search,
   ChevronDown,
} from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { getSubjectLabelVi, getLevelLabelVi } from "@/utils/educationDisplay";

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
   const [page, setPage] = useState<number>(1);
   const [limit] = useState<number>(10);
   const [filters, setFilters] = useState<MaterialFilters>({});
   const [tempFilters, setTempFilters] = useState<MaterialFilters>({});
   const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

   const { tutorProfile, isLoading: tutorLoading } = useTutorProfile();

   const {
      materials,
      isLoadingMaterials,
      deleteMaterial,
      totalPages,
      currentPage,
   } = useMaterial(page, limit, filters);

   const [confirmOpen, setConfirmOpen] = useState(false);
   const [selectedId, setSelectedId] = useState<string | null>(null);
   const [deletingId, setDeletingId] = useState<string | null>(null);

   const availableSubjects = tutorProfile?.subjects || [];
   const availableLevels = tutorProfile?.levels || [];

   const handleSubjectChange = (subject: string, checked: boolean) => {
      setTempFilters((prev) => {
         const subjects = prev.subjects || [];
         if (checked) {
            return { ...prev, subjects: [...subjects, subject] };
         } else {
            return { ...prev, subjects: subjects.filter((s) => s !== subject) };
         }
      });
   };

   const handleLevelChange = (level: string, checked: boolean) => {
      setTempFilters((prev) => {
         const levels = prev.levels || [];
         if (checked) {
            return { ...prev, levels: [...levels, level] };
         } else {
            return { ...prev, levels: levels.filter((l) => l !== level) };
         }
      });
   };

   const handleSearch = () => {
      setFilters(tempFilters);
      setPage(1);
      setIsFilterOpen(false); // Đóng filter sau khi search
   };

   const clearFilters = () => {
      setTempFilters({});
      setFilters({});
      setPage(1);
   };

   if (isLoadingMaterials || tutorLoading) {
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

   const effectiveTotalPages = Math.max(1, totalPages || 1);
   const hasActiveFilters =
      (filters.subjects?.length || 0) + (filters.levels?.length || 0) > 0;
   const hasTempFilters =
      (tempFilters.subjects?.length || 0) + (tempFilters.levels?.length || 0) >
      0;

   return (
      <div className="space-y-4">
         {/* Filter Card - Collapsible */}
         <Card>
            <CardHeader
               className="cursor-pointer hover:bg-slate-50 transition-colors"
               onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
               <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                     <Search className="w-4 h-4" />
                     Lọc tài liệu
                     {hasActiveFilters && (
                        <span className="inline-block ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                           {(filters.subjects?.length || 0) +
                              (filters.levels?.length || 0)}{" "}
                           bộ lọc
                        </span>
                     )}
                  </CardTitle>
                  <ChevronDown
                     className={`w-5 h-5 transition-transform ${
                        isFilterOpen ? "rotate-180" : ""
                     }`}
                  />
               </div>
            </CardHeader>

            {/* Collapsible Content */}
            {isFilterOpen && (
               <CardContent className="space-y-6 border-t pt-6">
                  {/* Subject Filter */}
                  <div>
                     <h3 className="text-sm font-semibold mb-3">Môn học</h3>
                     <div className="flex flex-wrap gap-2">
                        {availableSubjects.length > 0 ? (
                           availableSubjects.map((subject) => {
                              const isSelected =
                                 tempFilters.subjects?.includes(subject) ||
                                 false;
                              return (
                                 <button
                                    key={subject}
                                    onClick={() =>
                                       handleSubjectChange(subject, !isSelected)
                                    }
                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                                       isSelected
                                          ? "bg-blue-500 text-white shadow-md"
                                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                 >
                                    {getSubjectLabelVi(subject)}
                                    {isSelected && (
                                       <X className="w-4 h-4 ml-1" />
                                    )}
                                 </button>
                              );
                           })
                        ) : (
                           <p className="text-sm text-muted-foreground">
                              Không có môn học nào
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Level Filter */}
                  <div>
                     <h3 className="text-sm font-semibold mb-3">
                        Lớp / Cấp độ
                     </h3>
                     <div className="flex flex-wrap gap-2">
                        {availableLevels.length > 0 ? (
                           availableLevels.map((level) => {
                              const isSelected =
                                 tempFilters.levels?.includes(level) || false;
                              return (
                                 <button
                                    key={level}
                                    onClick={() =>
                                       handleLevelChange(level, !isSelected)
                                    }
                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                                       isSelected
                                          ? "bg-green-500 text-white shadow-md"
                                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    }`}
                                 >
                                    {getLevelLabelVi(level)}
                                    {isSelected && (
                                       <X className="w-4 h-4 ml-1" />
                                    )}
                                 </button>
                              );
                           })
                        ) : (
                           <p className="text-sm text-muted-foreground">
                              Không có lớp nào
                           </p>
                        )}
                     </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                     <Button
                        onClick={handleSearch}
                        disabled={!hasTempFilters}
                        className="gap-2"
                     >
                        <Search className="w-4 h-4" />
                        Tìm kiếm
                     </Button>
                     {hasActiveFilters && (
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={clearFilters}
                           className="gap-2"
                        >
                           <X className="w-4 h-4" />
                           Xóa bộ lọc
                        </Button>
                     )}
                  </div>
               </CardContent>
            )}
         </Card>

         {/* Materials Card */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded-md bg-amber-50 text-amber-600">
                        <PlusCircle className="h-5 w-5" />
                     </div>
                     <div>
                        <CardTitle className="text-lg">
                           Quản lý tài liệu
                        </CardTitle>
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
                        <TableHead>Môn</TableHead>
                        <TableHead>Cấp</TableHead>
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
                                 <TableCell className="max-w-[60ch] whitespace-pre-wrap break-words">
                                    {material.description}
                                 </TableCell>
                                 <TableCell className="whitespace-pre-wrap">
                                    {getSubjectLabelVi(material.subject || "")}
                                 </TableCell>
                                 <TableCell className="whitespace-pre-wrap">
                                    {getLevelLabelVi(material.level || "")}
                                 </TableCell>
                                 <TableCell>
                                    {material.uploadedAt
                                       ? format(
                                            new Date(material.uploadedAt),
                                            "dd/MM/yyyy"
                                         )
                                       : "N/A"}
                                 </TableCell>

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
                           <TableCell colSpan={7} className="text-center">
                              {hasActiveFilters
                                 ? "Không tìm thấy tài liệu nào phù hợp với bộ lọc."
                                 : "Bạn chưa có tài liệu nào."}
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </CardContent>

            <div className="p-4 flex justify-end">
               <Pagination
                  currentPage={currentPage || page}
                  totalPages={effectiveTotalPages}
                  onPageChange={(p) => setPage(p)}
                  maxVisiblePages={7}
               />
            </div>
         </Card>

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
      </div>
   );
};

export default MaterialManagementPage;
