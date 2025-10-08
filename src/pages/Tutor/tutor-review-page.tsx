import { useState, useEffect } from "react"
import { Review } from "@/types/review"
import { RatingSummary } from "@/components/tutor/tutor-review/RatingSummary"
import { ReviewList } from "@/components/tutor/tutor-review/ReviewList"
import { ReviewModalForm } from "@/components/tutor/tutor-review/ReviewModalForm"
import { WriteReviewButton } from "@/components/tutor/tutor-review/WriteReviewButton"
import { useToast } from "@/hooks/useToast"


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

interface TutorReviewPageProps {
    tutorId: string
}

export function TutorReviewPage({ tutorId }: TutorReviewPageProps) {
    const [stats, setStats] = useState<RatingStats | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingReview, setEditingReview] = useState<Review | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToast()

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [statsRes, reviewsRes] = await Promise.all([
                fetch(`/api/reviews/tutor/${tutorId}/stats`),
                fetch(`/api/reviews/tutor/${tutorId}`),
            ])

            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData)
            }

            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json()
                setReviews(reviewsData.reviews || reviewsData)
            }
        } catch (error) {
            console.error("[v0] Error fetching review data:", error)
            toast("error", "Failed to load reviews. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [tutorId])

    const handleWriteReview = () => {
        setEditingReview(null)
        setIsModalOpen(true)
    }

    const handleEditReview = (review: Review) => {
        setEditingReview(review)
        setIsModalOpen(true)
    }

    const handleSubmitReview = async (data: {
        rating: number
        comment: string
    }) => {
        try {
            const url = editingReview ? `/api/reviews/${editingReview._id}` : "/api/reviews"
            const method = editingReview ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    tutorId: editingReview ? undefined : tutorId,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to submit review")
            }

            toast("success", editingReview ? "Your review has been updated!" : "Your review has been submitted!")
        } catch (error) {
            console.error("[v0] Error submitting review:", error)
            toast("error", "Failed to submit review. Please try again.")
        }
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
            <div className="space-y-8">
                {/* Rating Summary Section */}
                {stats && <RatingSummary stats={stats} />}

                {/* Reviews List Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Student Reviews</h2>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    ) : (
                        <ReviewList reviews={reviews} onEditReview={handleEditReview} />
                    )}
                </div>

                {/* Write Review Button - Fixed on mobile */}
                <div className="fixed bottom-6 right-6 z-50 md:static md:mt-8">
                    <WriteReviewButton onClick={handleWriteReview} />
                </div>
            </div>

            {/* Review Modal Form */}
            <ReviewModalForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setEditingReview(null)
                }}
                onSubmit={handleSubmitReview}
                initialData={
                    editingReview
                        ? {
                            rating: editingReview.rating,
                            comment: editingReview.comment,
                        }
                        : undefined
                }
                isEditing={!!editingReview}
            />
        </div>
    )
}
