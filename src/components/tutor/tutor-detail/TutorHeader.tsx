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
         toast("warning", "Please login to favorite this tutor");
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
      <Card>
         <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
               <div className="flex flex-col items-center md:items-start">
                  <Avatar className="w-32 h-32 mb-4">
                     <AvatarImage
                        src={tutor.avatarUrl || "/placeholder.svg"}
                        alt={
                           typeof tutor.userId === "object"
                              ? tutor.userId.name
                              : tutor.fullName || "N/A"
                        }
                     />
                     <AvatarFallback className="text-2xl">
                        {(typeof tutor.userId === "object"
                           ? tutor.userId.name
                           : tutor.fullName || "N/A"
                        )
                           .split(" ")
                           .map((n: string) => n[0])
                           .join("")}
                     </AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left">
                     <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i: number) => (
                           <Star
                              key={i}
                              className={`w-4 h-4 ${tutor.ratings &&
                                 i < Math.floor(tutor.ratings.average)
                                 ? "fill-yellow-400 text-yellow-400"
                                 : "text-gray-300"
                                 }`}
                           />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                           {tutor.ratings?.average ?? "-"} (
                           {tutor.ratings?.totalReviews ?? 0} reviews)
                        </span>
                     </div>
                  </div>
               </div>

               <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{tutor.fullName}</h1>

                  <div className="flex items-center gap-2 mb-3">
                     <MapPin className="w-4 h-4 text-muted-foreground" />
                     <span className="text-sm">{tutor.address.city}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3">
                     <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                           {tutor.experienceYears}+ years experience
                        </span>
                     </div>
                     {tutor.gender && (
                        <div className="flex items-center gap-2">
                           <span className="text-sm text-muted-foreground">
                              •
                           </span>
                           <span className="text-sm">{tutor.gender}</span>
                        </div>
                     )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                     <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Languages I know:</span>
                     </div>
                     {tutor.languages
                        .slice(0, 3)
                        .map((lang: string, index: number) => (
                           <Badge key={index} variant="secondary">
                              {lang}
                           </Badge>
                        ))}
                     {tutor.languages.length > 3 && (
                        <Popover>
                           <PopoverTrigger asChild>
                              <Button
                                 variant="outline"
                                 size="sm"
                                 className="h-6 px-2 text-xs rounded-full border-dashed"
                              >
                                 +{tutor.languages.length - 3} more
                              </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-48 p-3" align="start">
                              <div className="space-y-2">
                                 {tutor.languages
                                    .slice(3)
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

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={fav?.isPending || removeFav?.isPending}
                     >
                        <Heart
                           className={`w-4 h-4 mr-2 ${isFav?.isFav ? "text-red-500 fill-red-500" : ""
                              }`}
                        />
                        {isFav?.isFav ? "Unsave" : "Save"}
                     </Button>
                     <Button size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Let's talk now
                     </Button>
                     <Button variant="secondary" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book a tuition
                     </Button>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
