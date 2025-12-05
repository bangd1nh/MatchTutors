import { useState } from "react"
import { Review } from "@/types/review"
import { ReviewCard } from "./ReviewCard"
import { Button } from "@/components/ui/button"

interface PublicReviewListProps {
    reviews: Review[]
    onEditReview?: (review: Review) => void
}

export function PublicReviewList({ reviews, onEditReview }: PublicReviewListProps) {
    const reviewsWithComments = reviews.filter((review) => review.comment && review.comment.trim() !== "")
    const [visibleCount, setVisibleCount] = useState(5)

    if (reviewsWithComments.length === 0) {
        return (
            <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
                <p className="text-muted-foreground">Chưa có đánh giá nào.</p>
            </div>
        )
    }

    const visibleReviews = reviewsWithComments.slice(0, visibleCount)

    return (
        <div className="space-y-6">
            {/* Render visible reviews */}
            <div className="space-y-4">
                {visibleReviews.map((review) => (
                    <ReviewCard key={review._id} review={review} onEdit={onEditReview} />
                ))}
            </div>

            {/* Load More Button */}
            {visibleCount < reviewsWithComments.length && (
                <div className="flex justify-center pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setVisibleCount((prev) => prev + 5)}
                        className="rounded-full px-6"
                    >
                        Xem thêm đánh giá
                    </Button>
                </div>
            )}
        </div>
    )
}
