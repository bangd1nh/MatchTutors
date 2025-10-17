import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"

interface RatingStats {
    averageRating: number
    totalReviews: number
    ratingDistribution: {
        "5": number
        "4": number
        "3": number
        "2": number
        "1": number
    }
}

interface RatingSummaryProps {
    stats: RatingStats
}

export function RatingSummary({ stats }: RatingSummaryProps) {
    const { averageRating, totalReviews, ratingDistribution } = stats

    // Helper to render stars with fractional fill
    const renderStars = (rating: number) => {
        return [1, 2, 3, 4, 5].map((star) => {
            const fillPercent =
                rating >= star
                    ? 100
                    : rating + 1 > star
                        ? (rating - (star - 1)) * 100
                        : 0

            return (
                <div key={star} className="relative h-6 w-6">
                    {/* Empty Star (background) */}
                    <Star className="absolute h-6 w-6 text-muted" />
                    {/* Filled Star (foreground with clip) */}
                    <Star
                        className="absolute h-6 w-6 text-[#FACC15]"
                        style={{
                            clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
                            fill: "#FACC15",
                        }}
                    />
                </div>
            )
        })
    }

    return (
        <Card className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="space-y-6">
                {/* Average Rating Display */}
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-foreground">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-1">
                            {renderStars(averageRating)}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            {totalReviews.toLocaleString()} reviews
                        </div>
                    </div>

                    {/* Rating Distribution Bars */}
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const total = Object.values(ratingDistribution).reduce((a, b) => a + b, 0)
                            const percentage =
                                total > 0
                                    ? (ratingDistribution[rating.toString() as keyof typeof ratingDistribution]! /
                                        total) *
                                    100
                                    : 0
                            return (
                                <div key={rating} className="flex items-center gap-3">
                                    <div className="flex w-12 items-center gap-1">
                                        <span className="text-sm font-medium text-foreground">{rating}</span>
                                        <Star className="h-3 w-3 fill-[#FACC15] text-[#FACC15]" />
                                    </div>
                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                        <div
                                            className="h-full bg-[#FACC15] transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-right text-sm text-muted-foreground">
                                        {percentage.toFixed(1)}%
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Card>
    )
}
