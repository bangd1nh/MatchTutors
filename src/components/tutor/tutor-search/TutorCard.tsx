import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   Star,
   MapPin,
   Clock,
   Heart,
   Users,
   Award,
   GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tutor, TutorUser } from "@/types/tutorListandDetail";
import { useNavigate } from "react-router-dom";
import {
   Popover,
   PopoverTrigger,
   PopoverContent,
} from "@/components/ui/popover";
import { useAddFav, useFetchFav, useRemoveFav } from "@/hooks/useFavTutor";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/useToast";
import { getSubjectLabelVi } from "@/utils/educationDisplay";

interface TutorCardProps {
   tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
   const { isAuthenticated } = useUser();
   const toast = useToast();

   // GỌI HOOKS Ở TOP-LEVEL (KHÔNG ĐIỀU KIỆN)
   const favQuery = useFetchFav(tutor._id, { enabled: isAuthenticated });
   const addFav = useAddFav();
   const deleteFav = useRemoveFav();

   const isFav = favQuery.data;

   const handleFav = (tutorId: string) => {
      if (!isAuthenticated) {
         toast("warning", "Vui lòng đăng nhập để thêm gia sư này vào danh sách yêu thích");
         return;
      }
      if (isFav?.isFav) {
         deleteFav.mutate(tutorId);
      } else {
         addFav.mutate(tutorId);
      }
   };

   const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

   // Fix availability logic - only show days that have actual time slots
   const availableDaysWithSlots = (tutor.availability ?? [])
      .filter((a) => a.slots && a.slots.length > 0)
      .map((a) => a.dayOfWeek);

   const navigate = useNavigate();

   const tutorUser: TutorUser =
      typeof tutor.userId === "string"
         ? { _id: tutor.userId, name: "Unknown Tutor" }
         : tutor.userId;

   function onViewProfile(_id: string): void {
      navigate(`/tutor-detail/${_id}`);
   }

   // Format price in VND
   const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
         minimumFractionDigits: 0,
      }).format(price);
   };

   return (
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-border bg-card text-card-foreground">
         <CardContent className="p-6">
            <div className="space-y-4">
               {/* Header Section */}
               <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                     <div className="relative">
                        <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                           <AvatarImage
                              src={tutorUser.avatarUrl || "/placeholder.svg"}
                              alt={tutorUser.name}
                              className="object-cover"
                           />
                           <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                              {tutorUser.name.charAt(0).toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                     </div>
                     <div className="flex-1">
                        <h3
                           className="text-xl font-bold text-foreground cursor-pointer transition-colors hover:text-primary"
                           onClick={() => onViewProfile(tutor._id)}
                        >
                           {tutorUser.name}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                           <MapPin className="h-4 w-4 mr-1.5" />
                           <span>{tutorUser.address?.city || "Chưa cập nhật"}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                 <Star
                                    key={i}
                                    className={cn(
                                       "h-4 w-4",
                                       tutor.ratings && i < Math.floor(tutor.ratings.average)
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-muted"
                                    )}
                                 />
                              ))}
                              <span className="text-sm text-muted-foreground ml-1">
                                 ({tutor.ratings?.totalReviews ?? 0})
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => handleFav(tutor._id)}
                     className="h-10 w-10 rounded-full hover:bg-destructive/10"
                  >
                     <Heart
                        className={cn(
                           "h-5 w-5 transition-colors",
                           isFav?.isFav === true && isFav?.tutorId === tutor._id
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground hover:text-red-400"
                        )}
                     />
                  </Button>
               </div>

               {/* Price and Experience */}
               <div className="bg-muted p-4 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm text-muted-foreground mb-1">Học phí</p>
                        <p className="text-2xl font-bold text-primary">
                           {formatPrice(tutor.hourlyRate || 0)}
                           <span className="text-sm font-normal text-muted-foreground ml-1">/giờ</span>
                        </p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Kinh nghiệm</p>
                        <div className="flex items-center gap-1">
                           <GraduationCap className="h-4 w-4 text-primary" />
                           <span className="text-lg font-semibold text-foreground">
                              {tutor.experienceYears}+ năm
                           </span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Class Type */}
               <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-border">
                     <Users className="h-4 w-4 text-primary" />
                     <span className="text-sm font-medium text-foreground">
                        {Array.isArray(tutor.classType)
                           ? tutor.classType
                                .map((type) =>
                                   type === "ONLINE" ? "Trực tuyến" : type === "IN_PERSON" ? "Tại nhà" : type
                                )
                                .join(" • ")
                           : tutor.classType ?? ""}
                     </span>
                  </div>
               </div>

               {/* Availability */}
               <div>
                  <div className="flex items-center gap-2 mb-3">
                     <Clock className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm font-medium text-foreground">Lịch rảnh</span>
                  </div>
                  <div className="flex gap-2 justify-between">
                     {dayNames.map((day, index) => (
                        <div
                           key={day}
                           className={cn(
                              "flex-1 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 border border-border",
                              availableDaysWithSlots.includes(index)
                                 ? "bg-primary text-primary-foreground shadow-md transform scale-[1.02]"
                                 : "bg-muted text-muted-foreground"
                           )}
                           title={`${day}${availableDaysWithSlots.includes(index) ? " - Có lịch" : " - Không có lịch"}`}
                        >
                           {day}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Subjects */}
               <div>
                  <div className="flex items-center gap-2 mb-3">
                     <Award className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm font-medium text-foreground">Môn học</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {(tutor.subjects ?? []).slice(0, 4).map((subject) => (
                        <Badge
                           key={subject}
                           variant="secondary"
                           className="text-xs py-1.5 px-3 rounded-full"
                        >
                           {getSubjectLabelVi(subject)}
                        </Badge>
                     ))}

                     {(tutor.subjects?.length ?? 0) > 4 && (
                        <Popover>
                           <PopoverTrigger asChild>
                              <Badge
                                 variant="outline"
                                 className="text-xs py-1.5 px-3 rounded-full bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20"
                              >
                                 +{(tutor.subjects?.length ?? 0) - 4} môn khác
                              </Badge>
                           </PopoverTrigger>
                           <PopoverContent className="w-64 p-4 bg-popover text-popover-foreground border border-border" align="start">
                              <h4 className="text-sm font-semibold mb-3 text-foreground">Tất cả môn học</h4>
                              <div className="flex flex-wrap gap-2">
                                 {(tutor.subjects ?? []).slice(4).map((subject) => (
                                    <Badge key={subject} variant="outline" className="text-xs py-1 px-2 rounded-md">
                                       {getSubjectLabelVi(subject)}
                                    </Badge>
                                 ))}
                              </div>
                           </PopoverContent>
                        </Popover>
                     )}
                  </div>
               </div>
            </div>
         </CardContent>

         {/* Footer with Action Button */}
         <CardFooter className="p-6 pt-0">
            <Button
               size="lg"
               className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-all duration-200 hover:shadow-lg"
               onClick={() => onViewProfile(tutor._id)}
            >
               Xem hồ sơ chi tiết
            </Button>
         </CardFooter>
      </Card>
   );
}
