import { useState, useEffect } from "react"
import { Review } from "@/types/review"
import { RatingSummary } from "@/components/tutor/tutor-review/RatingSummary"
import { PublicReviewList } from "@/components/tutor/tutor-review/PublicReviewList"
import { ReviewModalForm } from "@/components/tutor/tutor-review/ReviewModalForm"
import { useToast } from "@/hooks/useToast"
import { useReview } from "@/hooks/useReview"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { useCompletedRequestBetween } from "@/hooks/useTeachingRequest"

interface TutorReviewSectionProps {
    tutorId: string
}

export function TutorReviewSection({ tutorId }: TutorReviewSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingReview, setEditingReview] = useState<Review | null>(null)
    const toast = useToast()
    const { user } = useUser();
    const { data: completedRequest, isLoading: isRequestLoading } = useCompletedRequestBetween(
        user?.id,
        tutorId
    );

    const {
        tutorReviews,
        tutorStats,
        isTutorReviewsLoading,
        createReview,
        updateReview,
        refetchTutorReviews,
        refetchStats,
    } = useReview(tutorId)

    const existingReview = tutorReviews?.find((review) => {
        if (!review.reviewerId) return false;

        const reviewerId = typeof review.reviewerId === 'object'
            ? review.reviewerId._id
            : review.reviewerId;

        return reviewerId === user?.id;
    })

    console.log("Existing Review Found:", existingReview);

    const handleWriteReview = () => {
        setEditingReview(null)
        setIsModalOpen(true)
    }

    const handleEditReview = (review: Review) => {
        setEditingReview(review)
        setIsModalOpen(true)
    }

    const handleSubmitReview = async (data: { rating: number; comment: string }) => {
        try {
            if (editingReview) {
                // Update existing review - no teaching request needed
                await updateReview({
                    reviewId: editingReview._id,
                    data: { rating: data.rating, comment: data.comment },
                })
                toast("success", "Review updated successfully!")
            } else {
                // Create new review - need completed teaching request
                console.log("Completed Request:", completedRequest);
                if (!completedRequest || !completedRequest._id) {
                    toast("error", "You must complete a class before writing a review.");
                    return;
                }
                await createReview({
                    teachingRequestId: completedRequest._id,
                    rating: data.rating,
                    comment: data.comment,
                })
                toast("success", "Review submitted successfully!")
            }

            // Refresh data after mutation
            await Promise.all([refetchTutorReviews(), refetchStats()])
            setIsModalOpen(false)
            setEditingReview(null)
        } catch (error: any) {
            console.error("Review submission error:", error)
            toast("error", error?.response?.data?.message || "Failed to submit review")
        }
    }

    return (
        <div className="py-3">
            <div className="space-y-8">
                {/* Rating Summary Section */}
                {tutorStats && (
                    <RatingSummary
                        stats={{
                            ...tutorStats,
                            ratingDistribution: {
                                "5": tutorStats.ratingDistribution["5"] ?? tutorStats.ratingDistribution[5] ?? 0,
                                "4": tutorStats.ratingDistribution["4"] ?? tutorStats.ratingDistribution[4] ?? 0,
                                "3": tutorStats.ratingDistribution["3"] ?? tutorStats.ratingDistribution[3] ?? 0,
                                "2": tutorStats.ratingDistribution["2"] ?? tutorStats.ratingDistribution[2] ?? 0,
                                "1": tutorStats.ratingDistribution["1"] ?? tutorStats.ratingDistribution[1] ?? 0,
                            },
                        }}
                    />
                )}

                {/* Reviews List Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Student Reviews</h2>
                    {isTutorReviewsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    ) : (
                        <PublicReviewList
                            reviews={tutorReviews || []}
                            onEditReview={handleEditReview}
                        />
                    )}
                </div>

                {/* Action Button */}
                {!isTutorReviewsLoading && user && completedRequest && (
                    <div className="fixed bottom-6 right-6 z-50 md:static md:mt-8">
                        {existingReview ? (
                            <Button
                                onClick={() => handleEditReview(existingReview)}
                                size="lg"
                                className="gap-2 rounded-full bg-[#FBBF24] text-black shadow-lg hover:bg-[#EAB308] md:rounded-lg"
                            >
                                <PenSquare className="h-5 w-5" />
                                <span className="font-semibold">Edit Your Review</span>
                            </Button>
                        ) : (
                            <Button
                                onClick={handleWriteReview}
                                size="lg"
                                className="gap-2 rounded-full bg-[#3B82F6] text-white shadow-lg hover:bg-[#2563EB] md:rounded-lg"
                            >
                                <PenSquare className="h-5 w-5" />
                                <span className="font-semibold">Write a Review</span>
                            </Button>
                        )}
                    </div>
                )}
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
                            comment: editingReview.comment ?? "",
                        }
                        : undefined
                }
                isEditing={!!editingReview}
            />
        </div>
    )
}