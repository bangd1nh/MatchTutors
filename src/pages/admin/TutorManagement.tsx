import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
   useGetAllTutors, 
   useBanTutor,
   useUnbanTutor,
   useGetTutorMapping,
   AdminTutor 
} from "@/hooks/useAdminTutors";
import { Search, ShieldOff, Shield, MoreVertical, Clock, ChevronLeft, ChevronRight, UserCheck } from "lucide-react";
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

// Constants
const ITEMS_PER_PAGE = 10;
const MIN_BAN_REASON_LENGTH = 10;
const MAX_BAN_REASON_LENGTH = 500;
const SEARCH_DEBOUNCE_MS = 300;

type TabType = 'all' | 'active' | 'banned';


const TutorManagement = () => {
   const navigate = useNavigate();
   
   // State
   const [searchTerm, setSearchTerm] = useState("");
   const [debouncedSearch, setDebouncedSearch] = useState("");
   const [selectedTutor, setSelectedTutor] = useState<AdminTutor | null>(null);
   const [banReason, setBanReason] = useState("");
   const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
   const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);
   const [activeTab, setActiveTab] = useState<TabType>('all');
   const [currentPage, setCurrentPage] = useState(1);

   // API calls
   const { data: allTutors, isLoading: isLoadingAll } = useGetAllTutors({ 
      search: debouncedSearch || undefined 
   });
   
   const { data: tutorMappingData } = useGetTutorMapping({ page: 1, limit: 1000 });
   
   const banTutorMutation = useBanTutor();
   const unbanTutorMutation = useUnbanTutor();

   // Debounce search
   useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedSearch(searchTerm);
      }, SEARCH_DEBOUNCE_MS);

      return () => clearTimeout(timer);
   }, [searchTerm]);

   // Memoized mappings
   const { userIdToTutorId, userIdToTutorData } = useMemo(() => {
      const mapping: Record<string, string> = {};
      const tutorDataMapping: Record<string, any> = {};
      
      tutorMappingData?.data?.tutors?.forEach((item: any) => {
         if (item.tutorId) mapping[item.userId] = item.tutorId;
         if (item.tutor) tutorDataMapping[item.userId] = item.tutor;
      });
      
      return { userIdToTutorId: mapping, userIdToTutorData: tutorDataMapping };
   }, [tutorMappingData]);

   // Helper function to get report info for a tutor
   const getReportInfo = useCallback((tutor: AdminTutor) => {
      // First try to get from tutor.reportInfo (from /admin/users API)
      if (tutor.reportInfo) {
         return {
            hasBeenReported: tutor.reportInfo.hasBeenReported || false,
            reportCount: tutor.reportInfo.reportCount || 0,
            reportedAt: tutor.reportInfo.reportedAt || null,
         };
      }
      
      // Otherwise, try to get from tutorMappingData (from /admin/tutors/mapping API)
      const tutorData = userIdToTutorData[tutor._id];
      if (tutorData) {
         return {
            hasBeenReported: tutorData.hasBeenReported || false,
            reportCount: tutorData.reportCount || 0,
            reportedAt: tutorData.reportedAt || null,
         };
      }
      
      // Default values
      return {
         hasBeenReported: false,
         reportCount: 0,
         reportedAt: null,
      };
   }, [userIdToTutorData]);

   // Memoized filtered tutors
   const filteredTutors = useMemo(() => {
      const tutors = allTutors?.data?.users || [];
      
      switch (activeTab) {
         case 'active':
            return tutors.filter(t => !t.isBanned);
         case 'banned':
            return tutors.filter(t => t.isBanned);
         default:
            return tutors;
      }
   }, [allTutors, activeTab]);

   // Memoized counts
   const { totalTutors, activeCount, bannedCount } = useMemo(() => {
      const all = allTutors?.data?.users || [];
      return {
         totalTutors: all.length,
         activeCount: all.filter(t => !t.isBanned).length,
         bannedCount: all.filter(t => t.isBanned).length,
      };
   }, [allTutors]);

   // Memoized pagination
   const { totalPages, paginatedTutors, startIndex, endIndex } = useMemo(() => {
      const pages = Math.ceil(filteredTutors.length / ITEMS_PER_PAGE);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      
      return {
         totalPages: pages,
         paginatedTutors: filteredTutors.slice(start, end),
         startIndex: start,
         endIndex: end,
      };
   }, [filteredTutors, currentPage]);

   // Reset page when filter changes
   useEffect(() => {
      setCurrentPage(1);
   }, [activeTab, debouncedSearch]);

   // Handlers with useCallback
   const handleBanTutor = useCallback(() => {
      if (selectedTutor && banReason.trim().length >= MIN_BAN_REASON_LENGTH) {
         banTutorMutation.mutate({
            userId: selectedTutor._id,
            reason: banReason.trim(),
         });
         setIsBanDialogOpen(false);
         setBanReason("");
         setSelectedTutor(null);
      }
   }, [selectedTutor, banReason, banTutorMutation]);

   const handleUnbanTutor = useCallback(() => {
      if (selectedTutor) {
         unbanTutorMutation.mutate({
            userId: selectedTutor._id,
         });
         setIsUnbanDialogOpen(false);
         setSelectedTutor(null);
      }
   }, [selectedTutor, unbanTutorMutation]);

   const handleToggleBan = useCallback((tutor: AdminTutor) => {
      setSelectedTutor(tutor);
      if (tutor.isBanned) {
         setIsUnbanDialogOpen(true);
      } else {
         setIsBanDialogOpen(true);
      }
   }, []);

   const handleViewTutorProfiles = useCallback(() => {
      navigate('/admin/tutor-profile');
   }, [navigate]);

   const hasTutorProfile = useCallback((tutor: AdminTutor) => {
      return !!userIdToTutorId[tutor._id];
   }, [userIdToTutorId]);


   // Validation
   const isBanReasonValid = banReason.length >= MIN_BAN_REASON_LENGTH && 
                            banReason.length <= MAX_BAN_REASON_LENGTH;

   return (
      <div className="w-full">
         {/* Header */}
         <div className="mb-6">
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-bold mb-2">Quản lý Tài khoản Gia sư</h1>
                  <p className="text-gray-600">Quản lý trạng thái tài khoản và khóa/mở khóa gia sư</p>
               </div>
               <Button
                  onClick={handleViewTutorProfiles}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
               >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Xem Hồ sơ Gia sư
               </Button>
            </div>
         </div>

         {/* Search */}
         <div className="mb-4">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input
                  placeholder="Tìm kiếm gia sư theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
               />
            </div>
         </div>

         {/* Tabs */}
         <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-4">
               {[
                  { key: 'all' as TabType, label: `Tất cả (${totalTutors})` },
                  { key: 'active' as TabType, label: `Đang hoạt động (${activeCount})` },
                  { key: 'banned' as TabType, label: `Đã khóa (${bannedCount})` },
               ].map(({ key, label }) => (
                  <button
                     key={key}
                     onClick={() => setActiveTab(key)}
                     className={`py-2 px-4 font-medium text-sm transition-colors ${
                        activeTab === key
                           ? 'border-b-2 border-blue-600 text-blue-600' 
                           : 'text-gray-500 hover:text-gray-700'
                     }`}
                  >
                     {label}
                  </button>
               ))}
            </div>
         </div>

         {/* Table */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-x-auto">
            <table className="w-full divide-y divide-gray-100 min-w-[800px]">
               <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                     {['Gia sư', 'Liên hệ', 'Địa chỉ', 'Xác thực', 'Trạng thái tài khoản', 'Hành động'].map((header) => (
                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                           {header}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-50">
                  {isLoadingAll ? (
                     <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                           <div className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                              Đang tải...
                           </div>
                        </td>
                     </tr>
                  ) : paginatedTutors.length > 0 ? (
                     paginatedTutors.map((tutor) => (
                        <tr
                           key={tutor._id}
                           className={`transition-colors ${tutor.isBanned ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                        >
                           {/* Avatar & Name */}
                           <td className="px-6 py-6 whitespace-nowrap">
                              <div className="flex items-center">
                                 <div className="h-12 w-12 flex-shrink-0 relative">
                                    {tutor.avatarUrl ? (
                                       <div className="relative">
                                          <img
                                             className={`h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-sm transition-all ${
                                                tutor.isBanned ? 'grayscale opacity-75' : 'hover:scale-105'
                                             }`}
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

                           {/* Contact */}
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tutor.phone || <span className="italic text-gray-400">Chưa cập nhật</span>}
                           </td>

                           {/* Address */}
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tutor.address ? (
                                 <div>
                                    <div className="font-medium">{tutor.address.city}</div>
                                    {tutor.address.street && (
                                       <div className="text-xs text-gray-400">{tutor.address.street}</div>
                                    )}
                                 </div>
                              ) : (
                                 <span className="italic text-gray-400">Chưa cập nhật</span>
                              )}
                           </td>

                           {/* Verification */}
                           <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                 variant={tutor.isVerifiedEmail ? "default" : "secondary"}
                                 className="text-xs"
                              >
                                 {tutor.isVerifiedEmail ? "✓ Email" : "✗ Email"}
                              </Badge>
                           </td>

                           {/* Account Status */}
                           <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                 {/* Ban Status */}
                                 {tutor.isBanned ? (
                                    <div className="relative group">
                                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200 cursor-help">
                                          <ShieldOff className="h-3.5 w-3.5" />
                                          Đã khóa
                                       </span>
                                       
                                       <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                          <div className="space-y-3">
                                             <div className="flex items-start gap-2 pb-3 border-b border-gray-200">
                                                <div className="bg-red-100 rounded-lg p-2">
                                                   <ShieldOff className="h-4 w-4 text-red-600" />
                                                </div>
                                                <div className="flex-1">
                                                   <div className="font-bold text-red-900 text-sm">Tài khoản bị khóa</div>
                                                   <div className="text-xs text-gray-500 mt-0.5">Thông tin chi tiết</div>
                                                </div>
                                             </div>
                                             
                                             {tutor.banReason && (
                                                <div>
                                                   <div className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                      Lý do khóa
                                                   </div>
                                                   <div className="text-gray-800 text-sm leading-relaxed bg-red-50 p-3 rounded-lg border border-red-100 max-h-32 overflow-hidden">
                                                      <p className="line-clamp-4">{tutor.banReason}</p>
                                                   </div>
                                                </div>
                                             )}
                                             
                                             {tutor.bannedAt && (
                                                <div>
                                                   <div className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                                                      Thời gian khóa
                                                   </div>
                                                   <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                      <div className="flex items-center gap-2 text-gray-800 text-sm font-medium">
                                                         <Clock className="h-4 w-4 text-gray-500" />
                                                         <span>
                                                            {new Date(tutor.bannedAt).toLocaleDateString('vi-VN', { 
                                                               weekday: 'short',
                                                               year: 'numeric', 
                                                               month: 'short', 
                                                               day: 'numeric' 
                                                            })}
                                                         </span>
                                                      </div>
                                                      <div className="text-xs text-gray-500 mt-1.5 ml-6">
                                                         🕐 {new Date(tutor.bannedAt).toLocaleTimeString('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                         })}
                                                      </div>
                                                   </div>
                                                </div>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                 ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                                       <Shield className="h-3.5 w-3.5" />
                                       Hoạt động
                                    </span>
                                 )}
                                 
                                 {/* Profile Status Indicator */}
                                 <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${
                                    hasTutorProfile(tutor) 
                                       ? 'bg-blue-100 text-blue-700' 
                                       : 'bg-gray-100 text-gray-600'
                                 }`}>
                                    {hasTutorProfile(tutor) ? 'Có hồ sơ' : 'Chưa có hồ sơ'}
                                 </span>
                                 
                                 {/* Violation Report Indicator */}
                                 {(() => {
                                    const reportInfo = getReportInfo(tutor);
                                    const tutorId = userIdToTutorId[tutor._id];
                                    return reportInfo.hasBeenReported && reportInfo.reportCount > 0 ? (
                                       <button
                                          onClick={(e) => {
                                             e.stopPropagation();
                                             navigate(`/admin/violation-reports?tutorId=${tutor._id}${tutorId ? `&tutorProfileId=${tutorId}` : ''}`);
                                          }}
                                          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors cursor-pointer"
                                          title={`Có ${reportInfo.reportCount} báo cáo vi phạm${reportInfo.reportedAt ? ` (Lần cuối: ${new Date(reportInfo.reportedAt).toLocaleDateString('vi-VN')})` : ''}. Click để xem chi tiết`}
                                       >
                                          ⚠️ {reportInfo.reportCount} báo cáo
                                       </button>
                                    ) : null;
                                 })()}
                              </div>
                           </td>

                           {/* Actions */}
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                 <Button
                                    size="sm"
                                    onClick={() => handleToggleBan(tutor)}
                                    variant="outline"
                                    className={`${
                                       tutor.isBanned 
                                          ? 'text-green-700 hover:text-green-800 hover:bg-green-50' 
                                          : 'text-red-700 hover:text-red-800 hover:bg-red-50'
                                    }`}
                                 >
                                    {tutor.isBanned ? (
                                       <>
                                          <Shield className="h-4 w-4 mr-1.5" />
                                          Mở khóa
                                       </>
                                    ) : (
                                       <>
                                          <ShieldOff className="h-4 w-4 mr-1.5" />
                                          Khóa
                                       </>
                                    )}
                                 </Button>

                                 <Button
                                    size="sm"
                                    variant="ghost"
                                    className="p-2"
                                    title="Thêm tùy chọn"
                                 >
                                    <MoreVertical className="h-4 w-4" />
                                 </Button>
                              </div>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                           <div className="flex flex-col items-center gap-2">
                              <Search className="h-12 w-12 text-gray-300" />
                              <div>
                                 {activeTab === 'banned'
                                    ? 'Không có gia sư nào bị khóa.'
                                    : searchTerm
                                    ? 'Không tìm thấy gia sư phù hợp.'
                                    : 'Chưa có gia sư nào.'}
                              </div>
                           </div>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Pagination */}
         {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
               <div className="text-sm text-gray-600">
                  Hiển thị <span className="font-medium">{startIndex + 1}</span> - <span className="font-medium">{Math.min(endIndex, filteredTutors.length)}</span> trong tổng số <span className="font-medium">{filteredTutors.length}</span> gia sư
               </div>
               <div className="flex items-center gap-2">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                     disabled={currentPage === 1}
                  >
                     <ChevronLeft className="h-4 w-4 mr-1" />
                     Trước
                  </Button>
                  
                  <div className="flex items-center gap-1">
                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        const showPage = 
                           page === 1 ||
                           page === totalPages ||
                           (page >= currentPage - 1 && page <= currentPage + 1);
                        
                        const showEllipsis =
                           (page === currentPage - 2 && currentPage > 3) ||
                           (page === currentPage + 2 && currentPage < totalPages - 2);

                        if (showEllipsis) {
                           return <span key={page} className="px-2 text-gray-400">...</span>;
                        }

                        if (!showPage) return null;

                        return (
                           <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className={`h-9 w-9 p-0 ${currentPage === page ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
                           >
                              {page}
                           </Button>
                        );
                     })}
                  </div>

                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                     disabled={currentPage === totalPages}
                  >
                     Sau
                     <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
               </div>
            </div>
         )}

         {/* Ban Dialog */}
         <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Khóa tài khoản gia sư</DialogTitle>
                  <DialogDescription>
                     Bạn có chắc chắn muốn khóa tài khoản gia sư <strong>{selectedTutor?.name}</strong>? 
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
                        placeholder="Nhập lý do khóa tài khoản gia sư..."
                        className="mt-1"
                        rows={4}
                        maxLength={MAX_BAN_REASON_LENGTH}
                     />
                     <div className="mt-1 text-sm text-gray-500">
                        {banReason.length}/{MAX_BAN_REASON_LENGTH} ký tự (tối thiểu {MIN_BAN_REASON_LENGTH} ký tự)
                     </div>
                     {banReason.length > 0 && banReason.length < MIN_BAN_REASON_LENGTH && (
                        <div className="mt-1 text-sm text-red-500">
                           Lý do phải có ít nhất {MIN_BAN_REASON_LENGTH} ký tự
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
                     disabled={!isBanReasonValid || banTutorMutation.isPending}
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
                     <br /><br />
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
