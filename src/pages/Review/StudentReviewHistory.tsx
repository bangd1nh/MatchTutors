import { StudentReviewCard } from "@/components/review/StudentReviewCard";
import { useToast } from "@/hooks/useToast";
import { useReview } from "@/hooks/useReview";

export function StudentReviewHistory() {
    const toast = useToast();
    const {
        studentReviewHistory,
        isHistoryLoading,
        updateReview,
        refetchHistory,
    } = useReview(); // ✅ hook handles fetching student reviews automatically

    // Handle updating review
    const handleUpdateReview = async (reviewId: string, data: { rating: number; comment: string }) => {
        try {
            await updateReview({ reviewId, data });
            toast("success", "Your review has been updated successfully!");
            refetchHistory(); // refresh list after updating
        } catch (error) {
            console.error(error);
            toast("error", "Failed to update review. Please try again.");
        }
    };

    if (isHistoryLoading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="mb-8 text-3xl font-bold text-foreground">My Reviews</h1>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const reviews = studentReviewHistory ?? [];

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-8 text-3xl font-bold text-foreground">My Reviews</h1>

                {reviews.length === 0 ? (
                    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border-2 border-dashed border-muted bg-muted/20">
                        <div className="text-center">
                            <p className="text-lg font-medium text-muted-foreground">
                                You haven't written any reviews yet.
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Start learning with a tutor and share your experience!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {reviews.map((review) => (
                            <StudentReviewCard
                                key={review._id}
                                review={review}
                                onUpdate={handleUpdateReview}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
