import { Review } from "@/types/review"
import { ReviewCard } from "./ReviewCard"


interface ReviewListProps {
    reviews: Review[]
    onEditReview?: (review: Review) => void
}

export function ReviewList({ reviews, onEditReview }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
                <p className="text-muted-foreground">No reviews yet. Be the first to write a review!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} onEdit={onEditReview} />
            ))}
        </div>
    )
}
