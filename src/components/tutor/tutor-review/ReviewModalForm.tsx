import type React from "react"

import { useState, useEffect } from "react"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReviewModalFormProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: { rating: number; comment: string }) => Promise<void>
    initialData?: {
        rating: number
        comment: string
    }
    isEditing?: boolean
}

export function ReviewModalForm({ isOpen, onClose, onSubmit, initialData, isEditing = false }: ReviewModalFormProps) {
    const [rating, setRating] = useState(initialData?.rating || 0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState(initialData?.comment || "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isOpen) {
            setRating(initialData?.rating || 0)
            setComment(initialData?.comment || "")
            setError("")
        }
    }, [isOpen, initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (rating === 0) {
            setError("Vui lòng chọn số sao")
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit({
                rating,
                comment: comment.trim(),
            })
        } catch (err) {
            setError("Gửi đánh giá thất bại. Vui lòng thử lại.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground">
                            {isEditing ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Star Rating Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Số sao <span className="text-destructive">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star
                                            className={`h-10 w-10 ${star <= (hoveredRating || rating)
                                                    ? "fill-[#FACC15] text-[#FACC15]"
                                                    : "fill-muted text-muted"
                                                }`}
                                        />
                                    </button>
                                ))}
                                {rating > 0 && (
                                    <span className="ml-2 text-sm font-medium text-foreground">
                                        {rating} / 5
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Comment Textarea */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Đánh giá của bạn</label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Hãy chia sẻ trải nghiệm của bạn với gia sư này…"
                                rows={5}
                                className="resize-none rounded-lg"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 bg-transparent"
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Đang gửi..."
                                    : isEditing
                                        ? "Cập nhật đánh giá"
                                        : "Gửi đánh giá"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
