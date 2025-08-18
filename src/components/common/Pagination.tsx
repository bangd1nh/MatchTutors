import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, KeyboardEvent } from "react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    maxVisiblePages?: number
    className?: string
    showQuickJump?: boolean
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 3,
    className = "",
    showQuickJump = true,
}: PaginationProps) {
    const [quickJumpPage, setQuickJumpPage] = useState("")
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const getPageRange = () => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        const half = Math.floor(maxVisiblePages / 2)
        let start = currentPage - half
        let end = currentPage + half

        if (start < 1) {
            start = 1
            end = maxVisiblePages
        } else if (end > totalPages) {
            end = totalPages
            start = totalPages - maxVisiblePages + 1
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    const handleQuickJump = () => {
        const pageNum = parseInt(quickJumpPage)
        if (pageNum >= 1 && pageNum <= totalPages) {
            onPageChange(pageNum)
            setIsPopoverOpen(false)
        }
        setQuickJumpPage("")
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleQuickJump()
        }
    }

    const pageRange = getPageRange()

    return (
        <div className={`flex items-center justify-center space-x-2 ${className}`}>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Show first page and ellipsis if needed */}
            {pageRange[0] > 1 && (
                <>
                    <Button
                        variant={currentPage === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(1)}
                        className="w-10"
                    >
                        1
                    </Button>
                    {pageRange[0] > 2 && <span className="px-2">...</span>}
                </>
            )}

            {/* Visible page buttons */}
            {pageRange.map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="w-10"
                >
                    {page}
                </Button>
            ))}

            {/* Show last page and ellipsis if needed */}
            {pageRange[pageRange.length - 1] < totalPages && (
                <>
                    {pageRange[pageRange.length - 1] < totalPages - 1 && (
                        <span className="px-2">...</span>
                    )}
                    <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        className="w-10"
                    >
                        {totalPages}
                    </Button>
                </>
            )}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            {showQuickJump && totalPages > 5 && (
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="ml-2">
                            Jump to...
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4 space-y-2">
                        <Label htmlFor="quickJump">Go to page</Label>
                        <div className="flex gap-2">
                            <Input
                                id="quickJump"
                                type="number"
                                min="1"
                                max={totalPages}
                                value={quickJumpPage}
                                onChange={(e) => setQuickJumpPage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`1-${totalPages}`}
                            />
                            <Button onClick={handleQuickJump}>Go</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    )
}