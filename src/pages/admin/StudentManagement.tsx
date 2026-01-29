import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
   useGetAllStudents,
   useBanStudent,
   useUnbanStudent,
   useGetStudentProfile,
   AdminStudent,
} from "@/hooks/useAdminStudents";
import {
   Search,
   ShieldOff,
   Shield,
   MoreVertical,
   Eye,
   Loader2,
   User,
   Mail,
   Phone,
   MapPin,
   Calendar,
   BookOpen,
   Target,
} from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSubjectLabelVi, getLevelLabelVi } from "@/utils/educationDisplay";
import { Separator } from "@/components/ui/separator";

const StudentManagement = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(
      null,
   );
   const [viewingStudentId, setViewingStudentId] = useState<string | null>(
      null,
   );
   const [banReason, setBanReason] = useState("");
   const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
   const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
   const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
   const [activeTab, setActiveTab] = useState<"all" | "active" | "banned">(
      "all",
   );

   // API calls
   const { data: allStudents, isLoading: isLoadingAll } = useGetAllStudents({
      search: searchTerm || undefined,
   });

   const banStudentMutation = useBanStudent();
   const unbanStudentMutation = useUnbanStudent();
   const { data: studentProfileData, isLoading: isLoadingProfile } =
      useGetStudentProfile(
         viewingStudentId || "",
         isProfileDialogOpen && !!viewingStudentId,
      );

   // Filter students based on active tab
   const filteredStudents =
      allStudents?.data?.users?.filter((student) => {
         if (activeTab === "active") return !student.isBanned;
         if (activeTab === "banned") return student.isBanned;
         return true;
      }) || [];

   // Counts
   const totalStudents = allStudents?.data?.users?.length || 0;
   const activeCount =
      allStudents?.data?.users?.filter((s) => !s.isBanned).length || 0;
   const bannedCount =
      allStudents?.data?.users?.filter((s) => s.isBanned).length || 0;

   // Helper functions
   const getStatus = (student: AdminStudent) => {
      if (student.isBanned) return "Đã khóa";
      if (student.isVerifiedEmail) return "Đã xác thực";
      return "Cần xác minh";
   };

   const getStatusColor = (student: AdminStudent) => {
      if (student.isBanned) return "bg-red-100 text-red-800";
      if (student.isVerifiedEmail) return "bg-green-100 text-green-800";
      return "bg-yellow-100 text-yellow-800";
   };

   // Event handlers
   const handleViewProfile = (student: AdminStudent) => {
      setViewingStudentId(student._id);
      setIsProfileDialogOpen(true);
   };

   const handleCloseProfile = () => {
      setIsProfileDialogOpen(false);
      setViewingStudentId(null);
   };

   const handleBanStudent = () => {
      if (selectedStudent && banReason.trim()) {
         banStudentMutation.mutate({
            userId: selectedStudent._id,
            reason: banReason.trim(),
         });
         setIsBanDialogOpen(false);
         setBanReason("");
         setSelectedStudent(null);
      }
   };

   const handleUnbanStudent = () => {
      if (selectedStudent) {
         unbanStudentMutation.mutate({
            userId: selectedStudent._id,
         });
         setIsUnbanDialogOpen(false);
         setSelectedStudent(null);
      }
   };

   const handleToggleBan = (student: AdminStudent) => {
      setSelectedStudent(student);
      if (student.isBanned) {
         setIsUnbanDialogOpen(true);
      } else {
         setIsBanDialogOpen(true);
      }
   };

   return (
      <div className="flex flex-col h-full bg-gray-50">
         {/* Header */}
         <div className="bg-white p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                     Quản lý học sinh
                  </h1>
                  <p className="text-gray-600 mt-1">
                     Quản lý tài khoản học sinh trong hệ thống
                  </p>
               </div>
               <div className="flex items-center space-x-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                     <Input
                        placeholder="Tìm kiếm học sinh..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Tabs */}
         <div className="bg-white p-6 border-b border-gray-100">
            <div className="flex space-x-2">
               <button
                  onClick={() => setActiveTab("all")}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                     activeTab === "all"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
               >
                  Tất cả ({totalStudents})
               </button>
               <button
                  onClick={() => setActiveTab("active")}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                     activeTab === "active"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
               >
                  Hoạt động ({activeCount})
               </button>
               <button
                  onClick={() => setActiveTab("banned")}
                  className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                     activeTab === "banned"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
               >
                  Đã khóa ({bannedCount})
               </button>
            </div>
         </div>

         {/* Table */}
         <div className="flex-1 overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="h-full overflow-auto">
               <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Học sinh
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Thông tin liên hệ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Địa chỉ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Xác thực
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Trạng thái & Thông tin ban
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           Hành động
                        </th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                     {isLoadingAll ? (
                        <tr>
                           <td
                              colSpan={6}
                              className="px-6 py-10 text-center text-gray-500"
                           >
                              Đang tải...
                           </td>
                        </tr>
                     ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                           <tr
                              key={student._id}
                              className={
                                 student.isBanned
                                    ? "bg-gray-50"
                                    : "hover:bg-gray-50"
                              }
                           >
                              <td className="px-6 py-6 whitespace-nowrap">
                                 <div className="flex items-center">
                                    <div className="h-12 w-12 flex-shrink-0 relative">
                                       {student.avatarUrl ? (
                                          <div className="relative">
                                             <img
                                                className={`h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm transition-all duration-200 ${student.isBanned ? "grayscale opacity-75" : "hover:scale-105"}`}
                                                src={student.avatarUrl}
                                                alt={
                                                   student.name ||
                                                   student.email ||
                                                   "Học sinh"
                                                }
                                             />
                                             {student.isBanned && (
                                                <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-xl"></div>
                                             )}
                                          </div>
                                       ) : (
                                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-sm">
                                             <span className="text-lg font-semibold text-white">
                                                {(
                                                   student.name?.charAt(0) ||
                                                   student.email?.charAt(0) ||
                                                   "H"
                                                ).toUpperCase()}
                                             </span>
                                          </div>
                                       )}
                                    </div>
                                    <div className="ml-4">
                                       <div className="flex items-center space-x-2">
                                          <div className="text-sm font-semibold text-gray-900">
                                             {student.name ||
                                                student.email ||
                                                "Chưa có tên"}
                                          </div>
                                          {student.isBanned && (
                                             <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-red-100 text-red-700 border border-red-200">
                                                Đã khóa
                                             </span>
                                          )}
                                       </div>
                                       <div className="text-sm text-gray-600 mt-1">
                                          {student.email}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {student.phone || "Chưa cập nhật"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {student.address ? (
                                    <div>
                                       <div className="font-medium">
                                          {student.address.street ||
                                             "Chưa cập nhật"}
                                       </div>
                                       <div className="text-gray-400">
                                          {student.address.city || ""}
                                       </div>
                                    </div>
                                 ) : (
                                    "Chưa cập nhật"
                                 )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <Badge
                                    variant={
                                       student.isVerifiedEmail
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="text-xs w-fit"
                                 >
                                    {student.isVerifiedEmail
                                       ? "Email ✓"
                                       : "Email ✗"}
                                 </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center space-x-3">
                                    {/* Trạng thái */}
                                    <span
                                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(student)}`}
                                    >
                                       {getStatus(student)}
                                    </span>

                                    {/* Ban info indicator */}
                                    {student.isBanned && (
                                       <div className="relative group">
                                          <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium cursor-pointer hover:bg-red-200 transition-colors">
                                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                             <span>Chi tiết ban</span>
                                          </div>

                                          {/* Tooltip */}
                                          <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                             <div className="space-y-3">
                                                {student.banReason && (
                                                   <div>
                                                      <div className="font-semibold text-red-800 text-xs uppercase tracking-wide mb-1">
                                                         Lý do ban
                                                      </div>
                                                      <div className="text-red-700 text-sm leading-relaxed">
                                                         {student.banReason}
                                                      </div>
                                                   </div>
                                                )}
                                                {student.bannedAt && (
                                                   <div>
                                                      <div className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">
                                                         Thời gian ban
                                                      </div>
                                                      <div className="text-gray-600 text-sm">
                                                         {new Date(
                                                            student.bannedAt,
                                                         ).toLocaleDateString(
                                                            "vi-VN",
                                                         )}{" "}
                                                         lúc{" "}
                                                         {new Date(
                                                            student.bannedAt,
                                                         ).toLocaleTimeString(
                                                            "vi-VN",
                                                         )}
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                 <div className="flex items-center space-x-2">
                                    <button
                                       onClick={() => handleToggleBan(student)}
                                       className={`flex items-center px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                          student.isBanned
                                             ? "bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md"
                                             : "bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md"
                                       }`}
                                       title={
                                          student.isBanned
                                             ? "Mở khóa tài khoản"
                                             : "Khóa tài khoản"
                                       }
                                    >
                                       {student.isBanned ? (
                                          <Shield className="h-4 w-4 mr-1.5" />
                                       ) : (
                                          <ShieldOff className="h-4 w-4 mr-1.5" />
                                       )}
                                       {student.isBanned ? "Mở khóa" : "Khóa"}
                                    </button>
                                    <button
                                       onClick={() =>
                                          handleViewProfile(student)
                                       }
                                       className="flex items-center px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md transition-all duration-200"
                                       title="Xem profile"
                                    >
                                       <Eye className="h-4 w-4 mr-1.5" />
                                       <span className="text-sm font-medium">
                                          Xem
                                       </span>
                                    </button>
                                    <button className="flex items-center p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md transition-all duration-200">
                                       <MoreVertical className="h-4 w-4" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td
                              colSpan={6}
                              className="px-6 py-10 text-center text-gray-500"
                           >
                              {activeTab === "banned"
                                 ? "Không có học sinh nào bị khóa."
                                 : "Không có học sinh nào được tìm thấy."}
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Ban Dialog */}
         <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Khóa tài khoản học sinh</DialogTitle>
                  <DialogDescription>
                     Bạn có chắc chắn muốn khóa tài khoản học sinh{" "}
                     {selectedStudent?.name}? Học sinh sẽ không thể đăng nhập
                     hoặc sử dụng các tính năng của hệ thống.
                  </DialogDescription>
               </DialogHeader>
               <div className="space-y-4">
                  <div>
                     <Label htmlFor="ban-reason">Lý do khóa tài khoản *</Label>
                     <Textarea
                        id="ban-reason"
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        placeholder="Nhập lý do khóa tài khoản học sinh (10-500 ký tự)..."
                        className="mt-1"
                        rows={4}
                        maxLength={500}
                     />
                     <div className="mt-1 text-sm text-gray-500">
                        {banReason.length}/500 ký tự (tối thiểu 10 ký tự)
                     </div>
                     {banReason.length > 0 && banReason.length < 10 && (
                        <div className="mt-1 text-sm text-red-500">
                           Lý do phải có ít nhất 10 ký tự
                        </div>
                     )}
                  </div>
               </div>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => setIsBanDialogOpen(false)}
                  >
                     Hủy
                  </Button>
                  <Button
                     onClick={handleBanStudent}
                     disabled={
                        banReason.length < 10 ||
                        banReason.length > 500 ||
                        banStudentMutation.isPending
                     }
                  >
                     {banStudentMutation.isPending
                        ? "Đang khóa..."
                        : "Khóa tài khoản"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Unban Dialog */}
         <Dialog open={isUnbanDialogOpen} onOpenChange={setIsUnbanDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Mở khóa tài khoản học sinh</DialogTitle>
                  <DialogDescription>
                     Bạn có chắc chắn muốn mở khóa tài khoản học sinh{" "}
                     <strong>{selectedStudent?.name}</strong>?
                     <br />
                     <br />
                     Học sinh sẽ có thể đăng nhập và sử dụng hệ thống bình
                     thường trở lại.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => setIsUnbanDialogOpen(false)}
                  >
                     Hủy
                  </Button>
                  <Button
                     onClick={handleUnbanStudent}
                     disabled={unbanStudentMutation.isPending}
                  >
                     {unbanStudentMutation.isPending
                        ? "Đang mở khóa..."
                        : "Mở khóa tài khoản"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Profile Dialog */}
         <Dialog open={isProfileDialogOpen} onOpenChange={handleCloseProfile}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle>Thông tin học sinh</DialogTitle>
                  <DialogDescription>
                     Chi tiết profile của học sinh
                  </DialogDescription>
               </DialogHeader>

               {isLoadingProfile ? (
                  <div className="flex items-center justify-center py-12">
                     <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
               ) : studentProfileData?.data?.student ? (
                  <div className="space-y-6">
                     {studentProfileData.data.hasProfile ? (
                        <>
                           {/* Thông tin cơ bản */}
                           <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                 <User className="h-5 w-5" />
                                 Thông tin cơ bản
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">
                                       Tên
                                    </Label>
                                    <p className="text-sm font-medium">
                                       {studentProfileData.data.student.userId
                                          .name || "N/A"}
                                    </p>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                       <Mail className="h-4 w-4" />
                                       Email
                                    </Label>
                                    <p className="text-sm font-medium">
                                       {studentProfileData.data.student.userId
                                          .email || "N/A"}
                                    </p>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                       <Phone className="h-4 w-4" />
                                       Số điện thoại
                                    </Label>
                                    <p className="text-sm font-medium">
                                       {studentProfileData.data.student.userId
                                          .phone || "Chưa cập nhật"}
                                    </p>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">
                                       Giới tính
                                    </Label>
                                    <p className="text-sm font-medium">
                                       {studentProfileData.data.student.userId
                                          .gender || "Chưa cập nhật"}
                                    </p>
                                 </div>
                                 {studentProfileData.data.student.userId
                                    .address && (
                                    <div className="space-y-2 col-span-2">
                                       <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                          <MapPin className="h-4 w-4" />
                                          Địa chỉ
                                       </Label>
                                       <p className="text-sm font-medium">
                                          {studentProfileData.data.student
                                             .userId.address.street || ""}{" "}
                                          {studentProfileData.data.student
                                             .userId.address.city || ""}
                                       </p>
                                    </div>
                                 )}
                                 {studentProfileData.data.student.userId
                                    .isBanned && (
                                    <div className="space-y-2 col-span-2">
                                       <Label className="text-sm text-red-600">
                                          Trạng thái tài khoản
                                       </Label>
                                       <div className="space-y-1">
                                          <Badge variant="destructive">
                                             Đã bị khóa
                                          </Badge>
                                          {studentProfileData.data.student
                                             .userId.banReason && (
                                             <p className="text-sm text-muted-foreground">
                                                Lý do:{" "}
                                                {
                                                   studentProfileData.data
                                                      .student.userId.banReason
                                                }
                                             </p>
                                          )}
                                          {studentProfileData.data.student
                                             .userId.bannedAt && (
                                             <p className="text-sm text-muted-foreground">
                                                Ngày khóa:{" "}
                                                {new Date(
                                                   studentProfileData.data
                                                      .student.userId.bannedAt,
                                                ).toLocaleDateString("vi-VN")}
                                             </p>
                                          )}
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>

                           <Separator />

                           {/* Thông tin học tập */}
                           <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                 <BookOpen className="h-5 w-5" />
                                 Thông tin học tập
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                 {studentProfileData.data.student
                                    .gradeLevel && (
                                    <div className="space-y-2">
                                       <Label className="text-sm text-muted-foreground">
                                          Cấp độ
                                       </Label>
                                       <p className="text-sm font-medium">
                                          {getLevelLabelVi(
                                             studentProfileData.data.student
                                                .gradeLevel,
                                          )}
                                       </p>
                                    </div>
                                 )}
                                 {studentProfileData.data.student
                                    .subjectsInterested &&
                                    studentProfileData.data.student
                                       .subjectsInterested.length > 0 && (
                                       <div className="space-y-2 col-span-2">
                                          <Label className="text-sm text-muted-foreground">
                                             Môn học quan tâm
                                          </Label>
                                          <div className="flex flex-wrap gap-2">
                                             {studentProfileData.data.student.subjectsInterested.map(
                                                (subject, index) => (
                                                   <Badge
                                                      key={index}
                                                      variant="outline"
                                                   >
                                                      {getSubjectLabelVi(
                                                         subject,
                                                      )}
                                                   </Badge>
                                                ),
                                             )}
                                          </div>
                                       </div>
                                    )}
                                 {studentProfileData.data.student.bio && (
                                    <div className="space-y-2 col-span-2">
                                       <Label className="text-sm text-muted-foreground">
                                          Giới thiệu
                                       </Label>
                                       <div 
                                          className="text-sm prose prose-sm max-w-none"
                                          dangerouslySetInnerHTML={{ __html: studentProfileData.data.student.bio }}
                                       />
                                    </div>
                                 )}
                                 {studentProfileData.data.student
                                    .learningGoals && (
                                    <div className="space-y-2 col-span-2">
                                       <Label className="text-sm text-muted-foreground flex items-center gap-2">
                                          <Target className="h-4 w-4" />
                                          Mục tiêu học tập
                                       </Label>
                                       <div 
                                          className="text-sm prose prose-sm max-w-none"
                                          dangerouslySetInnerHTML={{ __html: studentProfileData.data.student.learningGoals }}
                                       />
                                    </div>
                                 )}
                              </div>
                           </div>

                           <Separator />

                           {/* Thông tin khác */}
                           <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center gap-2">
                                 <Calendar className="h-5 w-5" />
                                 Thông tin khác
                              </h3>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">
                                       Ngày tạo
                                    </Label>
                                    <p className="text-sm font-medium">
                                       {new Date(
                                          studentProfileData.data.student
                                             .createdAt,
                                       ).toLocaleDateString("vi-VN")}
                                    </p>
                                 </div>
                                 <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">
                                       Cập nhật lần cuối
                                    </Label>
                                    <p className="text-sm font-medium">
                                       {new Date(
                                          studentProfileData.data.student
                                             .updatedAt,
                                       ).toLocaleDateString("vi-VN")}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </>
                     ) : (
                        <div className="text-center py-12">
                           <p className="text-muted-foreground">
                              Học sinh chưa có profile
                           </p>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="text-center py-12 text-muted-foreground">
                     Không thể tải thông tin profile
                  </div>
               )}

               <DialogFooter>
                  <Button variant="outline" onClick={handleCloseProfile}>
                     Đóng
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default StudentManagement;
