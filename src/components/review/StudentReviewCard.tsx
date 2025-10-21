import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Review } from "@/types/review"

interface StudentReviewCardProps {
    review: Review
    onUpdate: (reviewId: string, data: { rating: number; comment: string }) => Promise<void>
}

export function StudentReviewCard({ review, onUpdate }: StudentReviewCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [rating, setRating] = useState(review.rating)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState(review.comment || "")
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        if (rating === 0) return
        setIsSaving(true)
        try {
            await onUpdate(review._id, { rating, comment: comment.trim() })
            setIsEditing(false)
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setRating(review.rating)
        setComment(review.comment || "")
        setIsEditing(false)
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })

    const tutorName = review.revieweeId?.name ?? "Unknown Tutor"
    const tutorAvatar = review.revieweeId?.avatarUrl ?? "/placeholder.svg"
    const subject = review.teachingRequestId?.subject ?? "Unknown Subject"
    const level = review.teachingRequestId?.level ?? "Unknown Level"

    return (
        <div className="w-full rounded-2xl border border-border bg-white p-6 shadow-md hover:shadow-lg transition-all duration-300">
            {/* Header: Tutor Info */}
            <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14 border-2 border-gray-200 shadow-sm">
                    <AvatarImage src={tutorAvatar} alt={tutorName} />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {tutorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">{tutorName}</h3>
                    <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Subject:</span> {subject} | <span className="font-medium">Level:</span> {level}
                    </p>
                </div>
            </div>

            {/* Body */}
            {isEditing ? (
                <div className="space-y-4">
                    {/* Rating */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Rating</label>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="transition-transform hover:scale-125 active:scale-110"
                                >
                                    <Star
                                        className={`h-8 w-8 ${star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-300 text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Your Review</label>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            rows={4}
                            className="resize-none rounded-lg border-gray-200 shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1"
                            disabled={isSaving}
                            size="sm"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                            disabled={isSaving || rating === 0}
                            size="sm"
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Display Rating */}
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-6 w-6 ${star <= review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-300 text-gray-300"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Comment Display */}
                    <p className="text-gray-700 leading-relaxed">{review.comment || "No comment provided."}</p>

                    {/* Edit Button */}
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    >
                        Edit Review
                    </Button>
                </div>
            )}
        </div>
    )
}
