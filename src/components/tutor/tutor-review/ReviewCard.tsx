"use client"

import { useState } from "react"
import { Star, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

interface Review {
    _id: string
    rating: number
    comment: string
    reviewerId: {
        name: string
        avatarUrl: string
    }
    revieweeId: {
        name: string
        avatarUrl: string
    }
    teachingRequestId: {
        subject: string
        level: string
    }
    createdAt: string
    helpfulCount?: number
}

interface ReviewCardProps {
    review: Review
    onEdit?: (review: Review) => void
}

export function ReviewCard({ review, onEdit }: ReviewCardProps) {
    const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0)
    const [hasVoted, setHasVoted] = useState(false)

    const handleHelpful = () => {
        if (!hasVoted) {
            setHelpfulCount((prev) => prev + 1)
            setHasVoted(true)
        }
    }

    const getInitials = (name: string) => {
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

    return (
        <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="space-y-4">
                {/* Reviewer Info */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={review.reviewerId.avatarUrl || "/placeholder.svg"} alt={review.reviewerId.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                {getInitials(review.reviewerId.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold text-foreground">{review.reviewerId.name}</div>
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
                    <span className="rounded-full bg-muted px-3 py-1">{review.teachingRequestId.subject}</span>
                    <span className="rounded-full bg-muted px-3 py-1">{review.teachingRequestId.level}</span>
                </div>

                {/* Helpful Button */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleHelpful}
                        disabled={hasVoted}
                        className="gap-2 bg-transparent"
                    >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful</span>
                        {helpfulCount > 0 && <span className="text-muted-foreground">({helpfulCount})</span>}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
