import { Star, TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"

interface DashboardStats {
    averageRating: number
    totalReviews: number
    ratingDistribution: {
        "5": number
        "4": number
        "3": number
        "2": number
        "1": number
    }
    trend: number
}

interface DashboardRatingSummaryProps {
    stats: DashboardStats
}

export function DashboardRatingSummary({ stats }: DashboardRatingSummaryProps) {
    const { averageRating, totalReviews, ratingDistribution, trend } = stats

    return (
        <Card className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
                {/* Bên trái: Điểm trung bình */}
                <div className="flex flex-col items-center justify-center border-r border-border pr-8 lg:min-w-[200px]">
                    <div className="text-6xl font-bold text-foreground">{averageRating.toFixed(1)}</div>

                    <div className="mt-3 flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-6 w-6 ${star <= Math.round(averageRating)
                                    ? "fill-[#FACC15] text-[#FACC15]"
                                    : "fill-muted text-muted"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="mt-3 text-sm font-medium text-muted-foreground">
                        {totalReviews.toLocaleString()} tổng số đánh giá
                    </div>

                    {/* Chỉ số xu hướng */}
                    {trend !== 0 && (
                        <div
                            className={`mt-4 flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${trend > 0
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                        >
                            {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            <span>
                                {trend > 0 ? "+" : ""}
                                {trend.toFixed(1)} so với tháng trước
                            </span>
                        </div>
                    )}
                </div>

                {/* Bên phải: Phân bố đánh giá */}
                <div className="flex flex-col justify-center space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage = ratingDistribution[rating.toString() as keyof typeof ratingDistribution] || 0
                        const count = Math.round((percentage / 100) * totalReviews)

                        return (
                            <div key={rating} className="flex items-center gap-4">
                                <div className="flex w-16 items-center gap-1.5">
                                    <span className="text-sm font-semibold text-foreground">{rating}</span>
                                    <Star className="h-4 w-4 fill-[#FACC15] text-[#FACC15]" />
                                </div>

                                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-[#FACC15] transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <div className="flex w-24 items-center justify-between text-sm">
                                    <span className="font-medium text-foreground">{percentage.toFixed(0)}%</span>
                                    <span className="text-muted-foreground">({count})</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}
