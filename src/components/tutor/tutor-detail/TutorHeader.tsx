import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { useAddFav, useFetchFav, useRemoveFav } from "@/hooks/useFavTutor";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import type { Tutor } from "@/types/tutorListandDetail";
import {
   Calendar,
   Clock,
   Globe,
   Heart,
   Loader2,
   MapPin,
   MessageCircle,
   Star,
} from "lucide-react";

interface TutorHeaderProps {
   tutor: Tutor;
}

export function TutorHeader({ tutor }: TutorHeaderProps) {
   const toast = useToast();
   const { isAuthenticated } = useUser();

   // Always call the hooks (never wrap them in conditionals)
   const { data: isFav, isLoading, isError } = useFetchFav(tutor._id, {
      enabled: !!isAuthenticated,
   });

   const fav = useAddFav();
   const removeFav = useRemoveFav();

   const handleSave = () => {
      if (!isAuthenticated) {
         toast("warning", "Vui lòng đăng nhập để thêm gia sư vào danh sách yêu thích");
         return;
      }

      if (isFav?.isFav) {
         removeFav.mutate(tutor._id);
      } else {
         fav.mutate(tutor._id);
      }
   };

   // ✅ Only show loading/error when authenticated and query is running
   if (isAuthenticated && isLoading) {
      return (
         <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
         </div>
      );
   }

   if (isAuthenticated && isError) {
      return (
         <div className="text-center text-red-500 p-10">
            Không thể tải hồ sơ học gia sư.
         </div>
      );
   }

   return (
      <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
         <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
               {/* Avatar Section */}
               <div className="flex flex-col items-center lg:items-start">
                  <div className="relative">
                     <Avatar className="w-40 h-40 border-4 border-white shadow-lg">
                        <AvatarImage
                           src={tutor.avatarUrl || "/placeholder.svg"}
                           alt={
                              typeof tutor.userId === "object"
                                 ? tutor.userId.name
                                 : tutor.fullName || "N/A"
                           }
                           className="object-cover"
                        />
                        <AvatarFallback className="text-3xl font-light bg-gray-100 text-gray-600">
                           {(typeof tutor.userId === "object"
                              ? tutor.userId.name
                              : tutor.fullName || "N/A"
                           )
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                        </AvatarFallback>
                     </Avatar>
                  </div>

                  {/* Rating */}
                  <div className="mt-4 text-center lg:text-left">
                     <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                        {[...Array(5)].map((_, i: number) => (
                           <Star
                              key={i}
                              className={`w-5 h-5 ${tutor.ratings &&
                                 i < Math.floor(tutor.ratings.average)
                                 ? "fill-amber-400 text-amber-400"
                                 : "text-gray-200"
                                 }`}
                           />
                        ))}
                     </div>
                     <p className="text-sm text-gray-600 font-medium">
                        {tutor.ratings?.average?.toFixed(1) ?? "0.0"} • {tutor.ratings?.totalReviews ?? 0} đánh giá
                     </p>
                  </div>
               </div>

               {/* Info Section */}
               <div className="flex-1 space-y-6">
                  <div>
                     <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-tight">
                        {tutor.fullName}
                     </h1>
                     <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-base">{tutor.address.city}</span>
                     </div>
                  </div>

                  {/* Experience & Gender */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                     <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{tutor.experienceYears}+ năm kinh nghiệm</span>
                     </div>
                     {tutor.gender && (
                        <div className="flex items-center gap-2">
                           <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                           <span>{tutor.gender}</span>
                        </div>
                     )}
                  </div>

                  {/* Languages */}
                  {tutor.languages.length > 0 && (
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-700">
                           <Globe className="w-4 h-4" />
                           <span className="text-sm font-medium">Ngôn ngữ</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {tutor.languages
                              .slice(0, 4)
                              .map((lang: string, index: number) => (
                                 <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 px-3 py-1 text-sm font-normal"
                                 >
                                    {lang}
                                 </Badge>
                              ))}
                           {tutor.languages.length > 4 && (
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       className="h-7 px-3 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                    >
                                       +{tutor.languages.length - 4} khác
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-48 p-3" align="start">
                                    <div className="flex flex-wrap gap-2">
                                       {tutor.languages
                                          .slice(4)
                                          .map((lang: string, index: number) => (
                                             <Badge
                                                key={index}
                                                variant="secondary"
                                                className="text-xs"
                                             >
                                                {lang}
                                             </Badge>
                                          ))}
                                    </div>
                                 </PopoverContent>
                              </Popover>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                     <Button
                        variant="outline"
                        size="default"
                        onClick={handleSave}
                        disabled={fav?.isPending || removeFav?.isPending}
                        className="border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                     >
                        <Heart
                           className={`w-4 h-4 mr-2 ${isFav?.isFav ? "text-red-500 fill-red-500" : "text-gray-500"
                              }`}
                        />
                        {isFav?.isFav ? "Bỏ lưu" : "Lưu"}
                     </Button>
                     <Button
                        size="default"
                        className="bg-sky-600 hover:bg-sky-700 text-white border-0"
                     >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Nhắn tin ngay
                     </Button>
                     <Button
                        variant="secondary"
                        size="default"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 border-0"
                     >
                        <Calendar className="w-4 h-4 mr-2" />
                        Đặt lịch học
                     </Button>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
