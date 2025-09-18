import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   Popover,
   PopoverTrigger,
   PopoverContent,
} from "@/components/ui/popover";
import type { Tutor } from "@/types/tutorListandDetail";
import { Star } from "lucide-react";

interface RelatedTutorsProps {
   relatedTutors: Tutor[];
   onViewProfile: (id: string) => void;
}

export function RelatedTutors({
   relatedTutors,
   onViewProfile,
}: RelatedTutorsProps) {
   return (
      <div className="mt-8 lg:col-span-8">
         <h3 className="text-xl font-semibold mb-4">Explore related tutors</h3>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTutors.map((tutor) => (
               <Card
                  key={tutor._id}
                  className="hover:shadow-md transition-shadow h-full"
               >
                  <CardContent className="p-4">
                     {/* Avatar and Basic Info - Compact layout */}
                     <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                           <AvatarImage src={tutor.avatarUrl} />
                           <AvatarFallback className="text-sm">
                              {(tutor.fullName ?? "")
                                 .split(" ")
                                 .map((n) => n[0])
                                 .join("")}
                           </AvatarFallback>
                        </Avatar>
                        <div>
                           <h4
                              className="text-sm font-medium cursor-pointer"
                              onClick={() => onViewProfile(tutor._id)}
                           >
                              {tutor.fullName}
                           </h4>
                           <p className="text-xs text-muted-foreground">
                              {tutor.address.city},{" "}
                           </p>
                        </div>
                     </div>

                     {/* Rating - Compact */}
                     <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                           <Star
                              key={i}
                              className={`w-3 h-3 ${
                                 i < Math.floor(tutor.ratings.average)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                              }`}
                           />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">
                           ({tutor.ratings.totalReviews})
                        </span>
                     </div>

                     {/* Key Info - Compact */}
                     <div className="mt-3 space-y-1 text-sm">
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">From:</span>
                           <span className="font-medium">
                              ${tutor.hourlyRate}/hr
                           </span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">Exp:</span>
                           <span>{tutor.experienceYears}+ yrs</span>
                        </div>
                     </div>

                     {/* Subjects - Compact */}
                     <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">
                           Teaches:
                        </p>
                        <div className="flex flex-wrap gap-1">
                           {tutor.subjects.slice(0, 2).map((subject, i) => (
                              <Badge
                                 key={i}
                                 variant="secondary"
                                 className="text-xs px-1.5 py-0.5"
                              >
                                 {subject}
                              </Badge>
                           ))}
                           {tutor.subjects.length > 2 && (
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       variant="ghost"
                                       size="sm"
                                       className="h-6 px-1.5 text-xs rounded-md"
                                    >
                                       +{tutor.subjects.length - 2}
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent
                                    className="w-64 p-2"
                                    align="start"
                                    sideOffset={4}
                                 >
                                    <div className="grid gap-2">
                                       <div className="flex flex-wrap gap-1">
                                          {tutor.subjects
                                             .slice(2)
                                             .map((subject, i) => (
                                                <Badge
                                                   key={i}
                                                   variant="secondary"
                                                   className="text-xs px-1.5 py-0.5"
                                                >
                                                   {subject}
                                                </Badge>
                                             ))}
                                       </div>
                                    </div>
                                 </PopoverContent>
                              </Popover>
                           )}
                        </div>
                     </div>

                     {/* View Profile Button - Compact */}
                     <Button
                        size="sm"
                        className="mt-3 w-full text-sm"
                        onClick={() => onViewProfile(tutor._id)}
                     >
                        View Profile
                     </Button>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
}
