import { useParams, useNavigate } from "react-router-dom";
import { useStudentProfile } from "@/hooks/useTeachingRequest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   Loader2,
   Mail,
   Phone,
   MapPin,
   GraduationCap,
   Book,
   Target,
   Calendar,
   User,
   Clock,
} from "lucide-react";
import { getSubjectLabelVi, getLevelLabelVi } from "@/utils/educationDisplay";

const formatDayOfWeek = (dayOfWeek: number): string => {
   const daysMap: Record<number, string> = {
      0: "Chủ nhật",
      1: "Thứ 2",
      2: "Thứ 3",
      3: "Thứ 4",
      4: "Thứ 5",
      5: "Thứ 6",
      6: "Thứ 7",
   };
   return daysMap[dayOfWeek] || "Unknown";
};

export default function StudentProfileForTutor() {
   const { studentUserId } = useParams<{ studentUserId: string }>();
   const navigate = useNavigate();
   const {
      data: profile,
      isLoading,
      isError,
   } = useStudentProfile(studentUserId);

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
               <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
               <p className="text-muted-foreground">
                  Đang tải hồ sơ học sinh...
               </p>
            </div>
         </div>
      );
   }

   if (isError || !profile) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
            <div className="text-center">
               <div className="inline-block p-4 bg-red-50 rounded-lg mb-4">
                  <p className="text-red-600 font-medium">
                     Không thể tải hồ sơ học sinh
                  </p>
                  <p className="text-red-500 text-sm mt-1">
                     Vui lòng thử lại sau
                  </p>
               </div>
               <Button variant="outline" onClick={() => navigate(-1)}>
                  Quay lại
               </Button>
            </div>
         </div>
      );
   }

   const user = profile.userId || {};
   const address = user.address || {};

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header với back button */}
         {/* <div className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-4">
               <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
               >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại
               </Button>
            </div>
         </div> */}

         <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
               <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                     <AvatarImage src={user.avatarUrl} alt={user.name} />
                     <AvatarFallback className="text-2xl bg-blue-600 text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || "S"}
                     </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                     <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {user.name}
                     </h1>
                     <div className="flex items-center gap-4 text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                           <User className="h-4 w-4" />
                           <span>Học sinh</span>
                        </div>
                        {profile.gradeLevel && (
                           <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span>{getLevelLabelVi(profile.gradeLevel)}</span>
                           </div>
                        )}
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                           <Mail className="h-4 w-4" />
                           <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                           <Phone className="h-4 w-4" />
                           <span>{user.phone || "Chưa cập nhật"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                           <MapPin className="h-4 w-4" />
                           <span className="truncate">
                              {address.street && address.city
                                 ? `${address.street}, ${address.city}`
                                 : "Chưa cập nhật"}
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column - Academic Info */}
               <div className="lg:col-span-2 space-y-8">
                  {/* Subjects */}
                  {profile.subjectsInterested &&
                     profile.subjectsInterested.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Book className="h-5 w-5 text-blue-600" />
                              Môn học quan tâm
                           </h3>
                           <div className="flex flex-wrap gap-2">
                              {profile.subjectsInterested.map((sub: string) => (
                                 <Badge
                                    key={sub}
                                    className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1"
                                 >
                                    {getSubjectLabelVi(sub)}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     )}

                  {/* Bio */}
                  {profile.bio && (
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                           <User className="h-5 w-5 text-blue-600" />
                           Giới thiệu
                        </h3>
                        <div
                           className="prose prose-sm max-w-none text-gray-600"
                           dangerouslySetInnerHTML={{ __html: profile.bio }}
                        />
                     </div>
                  )}

                  {/* Learning Goals */}
                  {profile.learningGoals && (
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                           <Target className="h-5 w-5 text-blue-600" />
                           Mục tiêu học tập
                        </h3>
                        <div
                           className="prose prose-sm max-w-none text-gray-600"
                           dangerouslySetInnerHTML={{
                              __html: profile.learningGoals,
                           }}
                        />
                     </div>
                  )}
               </div>

               {/* Right Column - Schedule */}
               {profile.availability && profile.availability.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Lịch rảnh
                     </h3>
                     <p className="text-sm text-gray-600 mb-6">
                        Đây là lịch rảnh của học sinh.
                     </p>

                     {/* Schedule Grid */}
                     <div className="space-y-4">
                        {/* Header */}
                        <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                           <div></div>
                           <div className="text-center">Trước 12 giờ</div>
                           <div className="text-center">Từ 12 đến 17 giờ</div>
                           <div className="text-center">Sau 17 giờ</div>
                        </div>

                        {/* Days Grid */}
                        <div className="space-y-2">
                           {[1, 2, 3, 4, 5, 6, 0].map((dayNum) => {
                              const dayAvail = profile.availability.find(
                                 (a: any) => a.dayOfWeek === dayNum
                              );
                              const dayName = formatDayOfWeek(dayNum);

                              return (
                                 <div
                                    key={dayNum}
                                    className="grid grid-cols-4 gap-2 items-center"
                                 >
                                    <div className="text-sm font-medium text-gray-700 py-2">
                                       {dayName}
                                    </div>

                                    {/* Time slots */}
                                    {["PRE_12", "MID_12_17", "AFTER_17"].map(
                                       (slot) => {
                                          const hasSlot =
                                             dayAvail?.slots?.includes(slot);
                                          return (
                                             <div
                                                key={slot}
                                                className={`h-10 rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-colors ${
                                                   hasSlot
                                                      ? "bg-blue-500 border-blue-500 text-white"
                                                      : "bg-gray-50 border-gray-200 text-gray-400"
                                                }`}
                                             >
                                                {hasSlot ? (
                                                   <Clock className="h-3 w-3" />
                                                ) : (
                                                   ""
                                                )}
                                             </div>
                                          );
                                       }
                                    )}
                                 </div>
                              );
                           })}
                        </div>

                        {/* Legend */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                           <div className="flex items-center gap-4 text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                 <span>Có thể học</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="w-3 h-3 bg-gray-200 rounded"></div>
                                 <span>Không có thời gian</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
