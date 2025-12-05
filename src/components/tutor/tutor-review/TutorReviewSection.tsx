import { useState } from "react";
import { Review } from "@/types/review";
import { RatingSummary } from "@/components/tutor/tutor-review/RatingSummary";
import { PublicReviewList } from "@/components/tutor/tutor-review/PublicReviewList";
import { ReviewModalForm } from "@/components/tutor/tutor-review/ReviewModalForm";
import { useToast } from "@/hooks/useToast";
import { useReview } from "@/hooks/useReview";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useReviewEligibility } from "@/hooks/useReview";

interface TutorReviewSectionProps {
   tutorId: string;
}

export function TutorReviewSection({ tutorId }: TutorReviewSectionProps) {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingReview, setEditingReview] = useState<Review | null>(null);
   const toast = useToast();
   const { user } = useUser();

   const {
      hasCompleted,
      teachingRequestIds,
      isLoading: isEligibilityLoading
   } = useReviewEligibility(tutorId);

   const {
      tutorReviews,
      tutorStats,
      isTutorReviewsLoading,
      createReview,
      updateReview,
      refetchTutorReviews,
      refetchStats,
   } = useReview(tutorId);

   const existingReview = tutorReviews?.find((review) => {
      if (!review.reviewerId) return false;

      const reviewerId =
         typeof review.reviewerId === "object"
            ? review.reviewerId._id
            : review.reviewerId;

      return reviewerId === user?.id;
   });

   const handleWriteReview = () => {
      setEditingReview(null);
      setIsModalOpen(true);
   };

   const handleEditReview = (review: Review) => {
      setEditingReview(review);
      setIsModalOpen(true);
   };

   const handleSubmitReview = async (data: {
      rating: number;
      comment: string;
   }) => {
      try {
         if (editingReview) {
            await updateReview({
               reviewId: editingReview._id,
               data: { rating: data.rating, comment: data.comment },
            });
            toast("success", "Cập nhật đánh giá thành công!");
         } else {
            if (!hasCompleted || teachingRequestIds.length === 0) {
               toast(
                  "error",
                  "Bạn cần hoàn thành ít nhất một yêu cầu học tập với gia sư này trước khi viết đánh giá."
               );
               return;
            }

            await createReview({
               teachingRequestId: teachingRequestIds[0],
               rating: data.rating,
               comment: data.comment,
            });
            toast("success", "Gửi đánh giá thành công!");
         }

         await Promise.all([refetchTutorReviews(), refetchStats()]);
         setIsModalOpen(false);
         setEditingReview(null);
      } catch (error: any) {
         console.error("Review submission error:", error);
         toast(
            "error",
            error?.response?.data?.message || "Không thể gửi đánh giá"
         );
      }
   };

   if (isEligibilityLoading) {
      return (
         <div className="py-3">
            <div className="flex items-center justify-center py-12">
               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
         </div>
      );
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
                        "5":
                           tutorStats.ratingDistribution["5"] ??
                           tutorStats.ratingDistribution[5] ??
                           0,
                        "4":
                           tutorStats.ratingDistribution["4"] ??
                           tutorStats.ratingDistribution[4] ??
                           0,
                        "3":
                           tutorStats.ratingDistribution["3"] ??
                           tutorStats.ratingDistribution[3] ??
                           0,
                        "2":
                           tutorStats.ratingDistribution["2"] ??
                           tutorStats.ratingDistribution[2] ??
                           0,
                        "1":
                           tutorStats.ratingDistribution["1"] ??
                           tutorStats.ratingDistribution[1] ??
                           0,
                     },
                  }}
               />
            )}

            {/* Reviews List Section */}
            <div className="space-y-4">
               <h2 className="text-2xl font-bold text-foreground">
                  Đánh giá của học viên
               </h2>
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

            {!isTutorReviewsLoading && user && hasCompleted && (
               <div className="fixed bottom-6 right-6 z-50 md:static md:mt-8">
                  {existingReview ? (
                     <Button
                        onClick={() => handleEditReview(existingReview)}
                        size="lg"
                        className="gap-2 rounded-full bg-[#FBBF24] text-black shadow-lg hover:bg-[#EAB308] md:rounded-lg"
                     >
                        <PenSquare className="h-5 w-5" />
                        <span className="font-semibold">Chỉnh sửa đánh giá</span>
                     </Button>
                  ) : (
                     <Button
                        onClick={handleWriteReview}
                        size="lg"
                        className="gap-2 rounded-full bg-[#3B82F6] text-white shadow-lg hover:bg-[#2563EB] md:rounded-lg"
                     >
                        <PenSquare className="h-5 w-5" />
                        <span className="font-semibold">Viết đánh giá</span>
                     </Button>
                  )}
               </div>
            )}
         </div>

         {/* Review Modal Form */}
         <ReviewModalForm
            isOpen={isModalOpen}
            onClose={() => {
               setIsModalOpen(false);
               setEditingReview(null);
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
   );
}
