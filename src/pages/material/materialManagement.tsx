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
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FileDown, PlusCircle } from "lucide-react";

const MaterialManagementPage = () => {
   const { materials, isLoadingMaterials, materialsError } = useMaterial();

   if (isLoadingMaterials) {
      return <div>Đang tải danh sách tài liệu...</div>;
   }

   if (materialsError) {
      return <div>Lỗi khi tải tài liệu: {materialsError.message}</div>;
   }

   return (
      <Card>
         <CardHeader className="flex flex-row items-center justify-between">
            <div>
               <CardTitle>Quản lý tài liệu</CardTitle>
               <CardDescription>
                  Xem, tải xuống hoặc thêm tài liệu giảng dạy của bạn.
               </CardDescription>
            </div>
            <Button asChild>
               <Link to="/tutor/create-material">
                  <PlusCircle className="mr-2 h-4 w-4" />
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
                     <TableHead className="text-right">Tải xuống</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {materials && materials.length > 0 ? (
                     materials.map((material: any) => (
                        <TableRow key={material.id}>
                           <TableCell className="font-medium">
                              {material.title}
                           </TableCell>
                           <TableCell>{material.description}</TableCell>
                           <TableCell>
                              {material.uploadedAt
                                 ? format(
                                      new Date(material.uploadedAt),
                                      "dd/MM/yyyy"
                                   )
                                 : "N/A"}
                           </TableCell>
                           <TableCell className="text-right">
                              <Button variant="ghost" size="icon" asChild>
                                 <a
                                    href={material.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                 >
                                    <FileDown className="h-4 w-4" />
                                 </a>
                              </Button>
                           </TableCell>
                        </TableRow>
                     ))
                  ) : (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center">
                           Bạn chưa có tài liệu nào.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
   );
};

export default MaterialManagementPage;
