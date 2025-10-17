import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Review } from "@/types/review"

interface ReviewCardProps {
    review: Review
    onEdit?: (review: Review) => void
}

export function ReviewCard({ review }: ReviewCardProps) {
    const getInitials = (name: string) => {
        if (!name) return "??";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const relativeTime = formatDistanceToNow(new Date(review.createdAt), {
        addSuffix: true,
    })

    // Safe reviewer data extraction
    const reviewerName = typeof review.reviewerId === 'object'
        ? review.reviewerId?.name
        : 'Anonymous User';

    const reviewerAvatar = typeof review.reviewerId === 'object'
        ? review.reviewerId?.avatarUrl
        : null;

    // Safe teaching request data extraction
    const subject = typeof review.teachingRequestId === 'object'
        ? review.teachingRequestId?.subject
        : 'Unknown Subject';

    const level = typeof review.teachingRequestId === 'object'
        ? review.teachingRequestId?.level
        : 'Unknown Level';

    return (
        <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="space-y-4">
                {/* Reviewer Info */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={reviewerAvatar || "/placeholder.svg"}
                                alt={reviewerName}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(reviewerName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold text-foreground">{reviewerName}</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{relativeTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? "fill-[#FACC15] text-[#FACC15]" : "fill-muted text-muted"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Review Comment */}
                {review.comment && <p className="text-foreground leading-relaxed">{review.comment}</p>}

                {/* Teaching Request Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="rounded-full bg-muted px-3 py-1">{subject}</span>
                    <span className="rounded-full bg-muted px-3 py-1">{level}</span>
                </div>
            </div>
        </Card>
    )
}