"use client"

import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"

interface WriteReviewButtonProps {
    onClick: () => void
}

export function WriteReviewButton({ onClick }: WriteReviewButtonProps) {
    return (
        <Button
            onClick={onClick}
            size="lg"
            className="gap-2 rounded-full bg-[#3B82F6] text-white shadow-lg hover:bg-[#2563EB] md:rounded-lg"
        >
            <PenSquare className="h-5 w-5" />
            <span className="font-semibold">Write a Review</span>
        </Button>
    )
}
