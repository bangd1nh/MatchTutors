import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, Heart, User, Users, Award } from "lucide-react";
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

interface TutorCardProps {
   tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
   const { isAuthenticated } = useUser();
   const toast = useToast();
   const { data: isFav } = useFetchFav(tutor._id, { enabled: isAuthenticated });

   // Chỉ gọi các hook fav khi đã đăng nhập
   const addFav = useAddFav();
   const deleteFav = useRemoveFav();

   const handleFav = (tutorId: string) => {
      if (!isAuthenticated) {
         toast("warning", "Please login to favorite this tutor");
         return;
      }
      if (isFav?.isFav) {
         deleteFav.mutate(tutorId);
      } else {
         addFav.mutate(tutorId);
      }
   };

   // const [isSaved, setIsSaved] = useState(isFav?.isFav);
   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   const availableDays = (tutor.availability ?? []).map((a) => a.dayOfWeek);
   const navigate = useNavigate();

   const tutorUser: TutorUser =
      typeof tutor.userId === "string"
         ? { _id: tutor.userId, name: "Unknown Tutor" }
         : tutor.userId;

   function onViewProfile(_id: string): void {
      navigate(`/tutor-detail/${_id}`);
   }

   return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/60">
         <CardContent className="p-5">
            <div className="flex flex-col gap-4">
               {/* Header Section */}
               <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                     <Avatar className="h-14 w-14 border-2 border-primary/10">
                        <AvatarImage
                           src={tutorUser.avatarUrl || "/placeholder.svg"}
                           alt={tutorUser.name}
                        />
                        <AvatarFallback className="bg-primary/10">
                           <User className="h-6 w-6 text-primary" />
                        </AvatarFallback>
                     </Avatar>
                     <div>
                        <h3
                           className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
                           onClick={() => onViewProfile(tutor._id)}
                        >
                           {tutorUser.name}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                           <MapPin className="h-3.5 w-3.5 mr-1" />
                           <span>{tutorUser.address?.city || "N/A"}</span>
                        </div>
                     </div>
                  </div>

                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => handleFav(tutor._id)}
                     className="h-8 w-8 rounded-full"
                  >
                     <Heart
                        className={cn(
                           "h-4 w-4",
                           isFav?.isFav === true && isFav?.tutorId === tutor._id
                              ? "fill-red-500 text-red-500"
                              : ""
                        )}
                     />
                  </Button>
               </div>

               {/* Rating and Class Type */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                     {[...Array(5)].map((_, i) => (
                        <Star
                           key={i}
                           className={cn(
                              "h-4 w-4",
                              tutor.ratings &&
                                 i < Math.floor(tutor.ratings.average)
                                 ? "fill-yellow-400 text-yellow-400"
                                 : "text-gray-300"
                           )}
                        />
                     ))}
                     <span className="text-sm text-muted-foreground ml-1">
                        ({tutor.ratings?.totalReviews ?? 0})
                     </span>
                  </div>

                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                     <Users className="h-3.5 w-3.5 text-primary" />
                     <span className="text-xs font-medium text-primary">
                        {Array.isArray(tutor.classType)
                           ? tutor.classType.join(", ")
                           : tutor.classType ?? ""}
                     </span>
                  </div>
               </div>

               {/* Price and Experience */}
               <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg">
                  <div>
                     <p className="text-xs text-muted-foreground">
                        Starting from
                     </p>
                     <p className="text-xl font-bold text-primary">
                        ${tutor.hourlyRate}
                        <span className="text-sm font-normal text-muted-foreground">
                           /hr
                        </span>
                     </p>
                  </div>

                  <div className="text-right">
                     <p className="text-xs text-muted-foreground">Experience</p>
                     <p className="text-sm font-medium">
                        {tutor.experienceYears}+ years
                     </p>
                  </div>
               </div>
               {/* Availability */}
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <Clock className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm font-medium">Availability</span>
                  </div>
                  <div className="flex gap-1 justify-between">
                     {dayNames.map((day, index) => (
                        <div
                           key={day}
                           className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                              availableDays.includes(index)
                                 ? "bg-primary text-primary-foreground shadow-sm"
                                 : "bg-muted text-muted-foreground opacity-50"
                           )}
                           title={day}
                        >
                           {day.charAt(0)}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Subjects */}
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <Award className="h-4 w-4 text-muted-foreground" />
                     <span className="text-sm font-medium">Subjects</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {(tutor.subjects ?? []).slice(0, 3).map((subject) => (
                        <Badge
                           key={subject}
                           variant="secondary"
                           className="text-xs py-1 rounded-md"
                        >
                           {subject}
                        </Badge>
                     ))}

                     {(tutor.subjects?.length ?? 0) > 3 && (
                        <Popover>
                           <PopoverTrigger asChild>
                              <Badge
                                 variant="outline"
                                 className="text-xs py-1 rounded-md bg-muted text-muted-foreground cursor-pointer"
                              >
                                 +{(tutor.subjects?.length ?? 0) - 3} more
                              </Badge>
                           </PopoverTrigger>
                           <PopoverContent className="w-60 p-3" align="start">
                              <h4 className="text-sm font-medium mb-2">
                                 All Subjects
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                 {(tutor.subjects ?? [])
                                    .slice(3)
                                    .map((subject) => (
                                       <Badge
                                          key={subject}
                                          variant="outline"
                                          className="text-xs"
                                       >
                                          {subject}
                                       </Badge>
                                    ))}
                              </div>
                           </PopoverContent>
                        </Popover>
                     )}
                  </div>
               </div>
               {/* Bio */}
               <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {tutor.bio}
               </p>
            </div>
         </CardContent>

         {/* Footer with Action Buttons */}
         <CardFooter className="p-5 pt-0">
            <Button
               size="sm"
               className="w-full"
               onClick={() => onViewProfile(tutor._id)}
            >
               View Profile
            </Button>
         </CardFooter>
      </Card>
   );
}