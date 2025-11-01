import { Star, Calendar, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import type { Review } from "@/types/review";

interface ReviewManagementCardProps {
   review: Review;
}

export function ReviewManagementCard({ review }: ReviewManagementCardProps) {
   const [isExpanded, setIsExpanded] = useState(false);
   const maxLength = 150;

   const getInitials = (name: string) =>
      name
         .split(" ")
         .map((n) => n[0])
         .join("")
         .toUpperCase();

   const getTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) return "Today";
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
   };

   const comment = review.comment || "";
   const shouldTruncate = comment.length > maxLength;
   const displayComment =
      isExpanded || !shouldTruncate
         ? comment
         : `${comment.slice(0, maxLength)}...`;

   const studentName = review.reviewerId?.name || "Anonymous Student";
   const studentAvatar = review.reviewerId?.avatarUrl;
   const subject = review.teachingRequestId?.subject || "Unknown Subject";
   const level = review.teachingRequestId?.level || "Unknown Level";

   return (
      <Card className="rounded-2xl border p-6 shadow-sm transition-all">
         <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Left Section: Student Info & Review */}
            <div className="flex-1 space-y-4">
               {/* Student Header */}
               <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-border">
                     <AvatarImage
                        src={studentAvatar || "/placeholder.svg"}
                        alt={studentName}
                     />
                     <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                        {getInitials(studentName)}
                     </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                           {studentName}
                        </h3>
                        {/* Optionally show a badge if you add visibility later */}
                        {/* <Badge variant="secondary" className="text-xs">Hidden</Badge> */}
                     </div>

                     {/* Rating Stars */}
                     <div className="mt-1 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                           <Star
                              key={star}
                              className={`h-4 w-4 ${
                                 star <= review.rating
                                    ? "fill-[#FACC15] text-[#FACC15]"
                                    : "fill-muted text-muted"
                              }`}
                           />
                        ))}
                        <span className="ml-1 text-sm font-medium text-foreground">
                           {review.rating.toFixed(1)}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Review Comment */}
               <div className="space-y-2">
                  <p className="text-pretty text-sm leading-relaxed text-foreground">
                     {displayComment || "No comment provided."}
                  </p>
                  {shouldTruncate && (
                     <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm font-medium text-primary hover:underline"
                     >
                        {isExpanded ? "Show less" : "View more"}
                     </button>
                  )}
               </div>

               {/* Teaching Request Info */}
               <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                     <BookOpen className="h-4 w-4" />
                     <span className="font-medium">{subject}</span>
                  </div>
                  <span className="text-muted">•</span>
                  <span>{level}</span>
                  <span className="text-muted">•</span>
                  <div className="flex items-center gap-1.5">
                     <Calendar className="h-4 w-4" />
                     <span>{getTimeAgo(review.createdAt)}</span>
                  </div>
               </div>
            </div>
         </div>
      </Card>
   );
}
