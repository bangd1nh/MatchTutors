import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
   useGetAllTutors, 
   useBanTutor,
   useUnbanTutor,
   AdminTutor 
} from "@/hooks/useAdminTutors";
import { Search, ShieldOff, Shield, MoreVertical, Eye } from "lucide-react";
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

const TutorManagement = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedTutor, setSelectedTutor] = useState<AdminTutor | null>(null);
   const [banReason, setBanReason] = useState("");
   const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
   const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
   const [activeTab, setActiveTab] = useState<'all' | 'active' | 'banned'>('all');

   // API calls
   const { data: allTutors, isLoading: isLoadingAll } = useGetAllTutors({ 
      search: searchTerm || undefined 
   });
   
   const banTutorMutation = useBanTutor();
   const unbanTutorMutation = useUnbanTutor();

   const handleBanTutor = () => {
      if (selectedTutor && banReason.trim()) {
         banTutorMutation.mutate({
            userId: selectedTutor._id,
            reason: banReason.trim(),
         });
         setIsBanDialogOpen(false);
         setBanReason("");
         setSelectedTutor(null);
      }
   };

   const handleUnbanTutor = () => {
      if (selectedTutor) {
         unbanTutorMutation.mutate({
            userId: selectedTutor._id,
         });
         setIsUnbanDialogOpen(false);
         setSelectedTutor(null);
      }
   };

   const handleToggleBan = (tutor: AdminTutor) => {
      setSelectedTutor(tutor);
      if (tutor.isBanned) {
         setIsUnbanDialogOpen(true);
      } else {
         setIsBanDialogOpen(true);
      }
   };

   const getStatusColor = (tutor: AdminTutor) => {
      if (tutor.isBanned) return 'bg-red-100 text-red-800';
      if (tutor.isVerifiedEmail && tutor.isVerifiedPhoneNumber) return 'bg-green-100 text-green-800';
      if (tutor.isVerifiedEmail || tutor.isVerifiedPhoneNumber) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
   };

   const getStatus = (tutor: AdminTutor) => {
      if (tutor.isBanned) return 'Tài khoản bị khóa';
      if (tutor.isVerifiedEmail && tutor.isVerifiedPhoneNumber) return 'Đã xác thực';
      if (tutor.isVerifiedEmail || tutor.isVerifiedPhoneNumber) return 'Đang chờ';
      return 'Cần xác minh';
   };

   const getFilteredTutors = () => {
      const tutors = allTutors?.data?.users || [];
      return tutors.filter((tutor) => {
         if (activeTab === 'all') return true;
         if (activeTab === 'active') return !tutor.isBanned;
         if (activeTab === 'banned') return tutor.isBanned;
         return true;
      });
   };

   const filteredTutors = getFilteredTutors();
   const totalTutors = allTutors?.data?.users?.length || 0;
   const activeCount = (allTutors?.data?.users || []).filter(t => !t.isBanned).length;
   const bannedCount = (allTutors?.data?.users || []).filter(t => t.isBanned).length;

   return (
      <div className="h-full flex flex-col">
         {/* Header */}
         <div className="flex-shrink-0 mb-6">
            <h1 className="text-2xl font-bold mb-2">Quản lý Gia sư</h1>
            <p className="text-gray-600">Quản lý trạng thái và thông tin của các gia sư trong hệ thống</p>
         </div>

         {/* Search and Filters */}
         <div className="flex-shrink-0 mb-4">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                  placeholder="Tìm kiếm gia sư..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
               />
            </div>
         </div>

         {/* Tab Navigation */}
         <div className="flex-shrink-0 mb-6 border-b border-gray-200">
            <div className="flex space-x-4">
               <button
                  onClick={() => setActiveTab('all')}
                  className={`py-2 px-4 font-medium text-sm ${
                     activeTab === 'all' 
                        ? 'border-b-2 border-blue-600 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
               >
                  Tất cả ({totalTutors})
               </button>
               <button
                  onClick={() => setActiveTab('active')}
                  className={`py-2 px-4 font-medium text-sm ${
                     activeTab === 'active' 
                        ? 'border-b-2 border-blue-600 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                  }`}
               >
                  Đang hoạt động ({activeCount})
               </button>
               <button
                  onClick={() => setActiveTab('banned')}
                  className={`py-2 px-4 font-medium text-sm ${
                     activeTab === 'banned' 
                        ? 'border-b-2 border-blue-600 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
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
                           Gia sư
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
                           <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                              Đang tải...
                           </td>
                        </tr>
                     ) : filteredTutors.length > 0 ? (
                        filteredTutors.map((tutor) => (
                           <tr
                              key={tutor._id}
                              className={tutor.isBanned ? 'bg-gray-50' : 'hover:bg-gray-50'}
                           >
                              <td className="px-6 py-6 whitespace-nowrap">
                                 <div className="flex items-center">
                                    <div className="h-12 w-12 flex-shrink-0 relative">
                                       {tutor.avatarUrl ? (
                                          <div className="relative">
                                             <img
                                                className={`h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm transition-all duration-200 ${tutor.isBanned ? 'grayscale opacity-75' : 'hover:scale-105'}`}
                                                src={tutor.avatarUrl}
                                                alt={tutor.name}
                                             />
                                             {tutor.isBanned && (
                                                <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-xl"></div>
                                             )}
                                          </div>
                                       ) : (
                                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-sm">
                                             <span className="text-lg font-semibold text-white">
                                                {tutor.name.charAt(0).toUpperCase()}
                                             </span>
                                          </div>
                                       )}
                                    </div>
                                    <div className="ml-4">
                                       <div className="flex items-center space-x-2">
                                          <div className="text-sm font-semibold text-gray-900">
                                             {tutor.name}
                                          </div>
                                          {tutor.isBanned && (
                                             <span className="px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full bg-red-100 text-red-700 border border-red-200">
                                                Đã khóa
                                             </span>
                                          )}
                                       </div>
                                       <div className="text-sm text-gray-600 mt-1">
                                          {tutor.email}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {tutor.phone || 'Chưa cập nhật'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {tutor.address ? (
                                    <div>
                                       <div>{tutor.address.city}</div>
                                       <div className="text-xs text-gray-400">{tutor.address.street}</div>
                                    </div>
                                 ) : (
                                    'Chưa cập nhật'
                                 )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex flex-col space-y-1">
                                    <Badge 
                                       variant={tutor.isVerifiedEmail ? "default" : "secondary"}
                                       className="text-xs w-fit"
                                    >
                                       {tutor.isVerifiedEmail ? "Email ✓" : "Email ✗"}
                                    </Badge>
                                    {tutor.phone && (
                                       <Badge 
                                          variant={tutor.isVerifiedPhoneNumber ? "default" : "secondary"}
                                          className="text-xs w-fit"
                                       >
                                          {tutor.isVerifiedPhoneNumber ? "Phone ✓" : "Phone ✗"}
                                       </Badge>
                                    )}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="flex items-center space-x-3">
                                    {/* Trạng thái */}
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tutor)}`}>
                                       {getStatus(tutor)}
                                    </span>
                                    
                                    {/* Ban info indicator */}
                                    {tutor.isBanned && (
                                       <div className="relative group">
                                          <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium cursor-pointer hover:bg-red-200 transition-colors">
                                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                             <span>Chi tiết ban</span>
                                          </div>
                                          
                                          {/* Tooltip */}
                                          <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                             <div className="space-y-3">
                                                {tutor.banReason && (
                                                   <div>
                                                      <div className="font-semibold text-red-800 text-xs uppercase tracking-wide mb-1">Lý do ban</div>
                                                      <div className="text-red-700 text-sm leading-relaxed">
                                                         {tutor.banReason}
                                                      </div>
                                                   </div>
                                                )}
                                                {tutor.bannedAt && (
                                                   <div>
                                                      <div className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-1">Thời gian ban</div>
                                                      <div className="text-gray-600 text-sm">
                                                         {new Date(tutor.bannedAt).toLocaleDateString('vi-VN')} lúc {new Date(tutor.bannedAt).toLocaleTimeString('vi-VN')}
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
                                       onClick={() => handleToggleBan(tutor)}
                                       className={`flex items-center px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                          tutor.isBanned 
                                             ? 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md' 
                                             : 'bg-red-100 text-red-700 hover:bg-red-200 hover:shadow-md'
                                       }`}
                                       title={tutor.isBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                                    >
                                       {tutor.isBanned ? (
                                          <Shield className="h-4 w-4 mr-1.5" />
                                       ) : (
                                          <ShieldOff className="h-4 w-4 mr-1.5" />
                                       )}
                                       {tutor.isBanned ? 'Mở khóa' : 'Khóa'}
                                    </button>
                                    <button 
                                       className="flex items-center px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 hover:shadow-md transition-all duration-200"
                                       title="Xem chi tiết"
                                    >
                                       <Eye className="h-4 w-4 mr-1.5" />
                                       <span className="text-sm font-medium">Xem</span>
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
                           <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                              {activeTab === 'banned'
                                 ? 'Không có gia sư nào bị khóa.'
                                 : 'Không có gia sư nào được tìm thấy.'}
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
                  <DialogTitle>Khóa tài khoản gia sư</DialogTitle>
                  <DialogDescription>
                     Bạn có chắc chắn muốn khóa tài khoản gia sư {selectedTutor?.name}? 
                     Gia sư sẽ không thể đăng nhập hoặc nhận kết nối mới.
                  </DialogDescription>
               </DialogHeader>
               <div className="space-y-4">
                  <div>
                     <Label htmlFor="ban-reason">Lý do khóa tài khoản *</Label>
                     <Textarea
                        id="ban-reason"
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        placeholder="Nhập lý do khóa tài khoản gia sư (10-500 ký tự)..."
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
                  <Button variant="outline" onClick={() => setIsBanDialogOpen(false)}>
                     Hủy
                  </Button>
                  <Button 
                     onClick={handleBanTutor}
                     disabled={banReason.length < 10 || banReason.length > 500 || banTutorMutation.isPending}
                  >
                     {banTutorMutation.isPending ? "Đang khóa..." : "Khóa tài khoản"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Unban Dialog */}
         <Dialog open={isUnbanDialogOpen} onOpenChange={setIsUnbanDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Mở khóa tài khoản gia sư</DialogTitle>
                  <DialogDescription>
                     Bạn có chắc chắn muốn mở khóa tài khoản gia sư <strong>{selectedTutor?.name}</strong>?
                     <br />
                     <br />
                     Gia sư sẽ có thể đăng nhập và hoạt động bình thường trở lại.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUnbanDialogOpen(false)}>
                     Hủy
                  </Button>
                  <Button 
                     onClick={handleUnbanTutor}
                     disabled={unbanTutorMutation.isPending}
                  >
                     {unbanTutorMutation.isPending ? "Đang mở khóa..." : "Mở khóa tài khoản"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default TutorManagement;
