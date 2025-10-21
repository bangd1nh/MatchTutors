import { Pagination } from "@/components/common/Pagination"
import { DashboardRatingSummary } from "@/components/tutor/review-management/DashboardRatingSummary"
import { ReviewManagementCard } from "@/components/tutor/review-management/ReviewManagementCard"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useReview } from "@/hooks/useReview"
import { Review } from "@/types/review"
import { Search, Filter, X, Star, BookOpen, GraduationCap, Calendar } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { SUBJECT_VALUES } from "@/enums/subject.enum"
import { LEVEL_VALUES } from "@/enums/level.enum"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export function ReviewList() {
    const [searchQuery, setSearchQuery] = useState("")
    const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5])
    const [sortOrder, setSortOrder] = useState("newest")
    const [subjectsFilter, setSubjectsFilter] = useState<string[]>([])
    const [levelsFilter, setLevelsFilter] = useState<string[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [tempFilters, setTempFilters] = useState({
        searchQuery: "",
        ratingRange: [0, 5] as [number, number],
        sortOrder: "newest",
        subjectsFilter: [] as string[],
        levelsFilter: [] as string[],
    })
    const reviewsPerPage = 10

    const availableSubjects = SUBJECT_VALUES
    const availableLevels = LEVEL_VALUES

    // Build filters for backend
    const filters = useMemo(() => {
        const filterParams: any = {
            page: currentPage,
            limit: reviewsPerPage,
            sort: tempFilters.sortOrder,
        };

        if (tempFilters.searchQuery) {
            filterParams.keyword = tempFilters.searchQuery;
        }

        // Use minRating and maxRating for backend filtering
        if (tempFilters.ratingRange[0] !== 0 || tempFilters.ratingRange[1] !== 5) {
            filterParams.minRating = tempFilters.ratingRange[0];
            filterParams.maxRating = tempFilters.ratingRange[1];
        }

        if (tempFilters.subjectsFilter.length > 0) {
            filterParams.subjects = tempFilters.subjectsFilter;
        }

        if (tempFilters.levelsFilter.length > 0) {
            filterParams.levels = tempFilters.levelsFilter;
        }

        return filterParams;
    }, [tempFilters, currentPage, reviewsPerPage]);

    const { myTutorReviews, isMyTutorReviewsLoading } = useReview(undefined, filters)

    const mr = (myTutorReviews as any) ?? {}
    const reviews = mr.reviews ?? []
    const stats = mr.stats ?? null
    const totalReviews = mr.total ?? 0
    const totalPages = mr.totalPages ?? 1

    // Initialize temp filters when component mounts
    useEffect(() => {
        setTempFilters({
            searchQuery,
            ratingRange,
            sortOrder,
            subjectsFilter,
            levelsFilter,
        })
    }, [])

    const handleApplyFilters = () => {
        setTempFilters({
            searchQuery,
            ratingRange,
            sortOrder,
            subjectsFilter,
            levelsFilter,
        })
        setCurrentPage(1) // Reset to first page when applying filters
    }

    const handleResetFilters = () => {
        setSearchQuery("")
        setRatingRange([0, 5])
        setSortOrder("newest")
        setSubjectsFilter([])
        setLevelsFilter([])
        setTempFilters({
            searchQuery: "",
            ratingRange: [0, 5],
            sortOrder: "newest",
            subjectsFilter: [],
            levelsFilter: [],
        })
        setCurrentPage(1)
    }

    // Check if there are active filters to show reset button
    const hasActiveFilters = searchQuery ||
        ratingRange[0] !== 0 ||
        ratingRange[1] !== 5 ||
        subjectsFilter.length > 0 ||
        levelsFilter.length > 0

    // Check if there are applied filters to show in the active filters display
    const hasAppliedFilters = tempFilters.searchQuery ||
        tempFilters.ratingRange[0] !== 0 ||
        tempFilters.ratingRange[1] !== 5 ||
        tempFilters.subjectsFilter.length > 0 ||
        tempFilters.levelsFilter.length > 0

    // Format rating display for the popover trigger
    const getRatingDisplay = () => {
        if (ratingRange[0] === 0 && ratingRange[1] === 5) {
            return "All Ratings"
        } else if (ratingRange[0] === 0) {
            return `Up to ${ratingRange[1]}★`
        } else if (ratingRange[1] === 5) {
            return `${ratingRange[0]}+★`
        } else {
            return `${ratingRange[0]}-${ratingRange[1]}★`
        }
    }

    // Format subjects display for the popover trigger
    const getSubjectsDisplay = () => {
        if (subjectsFilter.length === 0) {
            return "All Subjects"
        } else if (subjectsFilter.length === 1) {
            return subjectsFilter[0]
        } else {
            return `${subjectsFilter.length} Subjects`
        }
    }

    // Format levels display for the popover trigger
    const getLevelsDisplay = () => {
        if (levelsFilter.length === 0) {
            return "All Levels"
        } else if (levelsFilter.length === 1) {
            return levelsFilter[0]
        } else {
            return `${levelsFilter.length} Levels`
        }
    }

    // Format sort display for the popover trigger
    const getSortDisplay = () => {
        return sortOrder === "newest" ? "Newest First" : "Oldest First"
    }

    if (isMyTutorReviewsLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg text-muted-foreground">Loading reviews...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-balance text-4xl font-bold text-foreground">Review Dashboard</h1>
                    <p className="mt-2 text-pretty text-muted-foreground">Manage and monitor all your student reviews</p>
                </div>

                {/* Rating Overview */}
                {stats && (
                    <div className="mb-8">
                        <DashboardRatingSummary stats={stats} />
                    </div>
                )}

                {/* Filters */}
                <Card className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    {/* Search Row - full width */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by student name"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 text-base"
                            />
                        </div>
                    </div>

                    {/* Filter Bar Row - full width with larger filters */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 flex-wrap items-center gap-4">
                            {/* Rating Range Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] h-12 justify-start text-base">
                                        <Star className="mr-3 h-5 w-5 text-yellow-500" />
                                        {getRatingDisplay()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-6" align="start">
                                    <div className="space-y-4">
                                        <div className="text-base font-medium">Rating Range</div>
                                        <Slider
                                            value={ratingRange}
                                            onValueChange={(val) => setRatingRange(val as [number, number])}
                                            max={5}
                                            min={0}
                                            step={1}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-base text-muted-foreground">
                                            <span>Min: {ratingRange[0]}★</span>
                                            <span>Max: {ratingRange[1]}★</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={() => setRatingRange([0, 5])}
                                            className="w-full"
                                        >
                                            Reset Range
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Subjects Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] h-12 justify-start text-base">
                                        <BookOpen className="mr-3 h-5 w-5 text-blue-500" />
                                        {getSubjectsDisplay()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-6" align="start">
                                    <div className="space-y-4">
                                        <div className="text-base font-medium">Filter by Subjects</div>
                                        <div className="max-h-64 space-y-3 overflow-y-auto">
                                            {availableSubjects.map((subject) => (
                                                <div key={subject} className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        id={`subject-${subject}`}
                                                        checked={subjectsFilter.includes(subject)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSubjectsFilter([...subjectsFilter, subject])
                                                            } else {
                                                                setSubjectsFilter(subjectsFilter.filter(s => s !== subject))
                                                            }
                                                        }}
                                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <label
                                                        htmlFor={`subject-${subject}`}
                                                        className="flex-1 cursor-pointer text-base"
                                                    >
                                                        {subject}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Levels Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] h-12 justify-start text-base">
                                        <GraduationCap className="mr-3 h-5 w-5 text-green-500" />
                                        {getLevelsDisplay()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-6" align="start">
                                    <div className="space-y-4">
                                        <div className="text-base font-medium">Filter by Levels</div>
                                        <div className="max-h-64 space-y-3 overflow-y-auto">
                                            {availableLevels.map((level) => (
                                                <div key={level} className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        id={`level-${level}`}
                                                        checked={levelsFilter.includes(level)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setLevelsFilter([...levelsFilter, level])
                                                            } else {
                                                                setLevelsFilter(levelsFilter.filter(l => l !== level))
                                                            }
                                                        }}
                                                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <label
                                                        htmlFor={`level-${level}`}
                                                        className="flex-1 cursor-pointer text-base"
                                                    >
                                                        {level}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Sort Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] h-12 justify-start text-base">
                                        <Calendar className="mr-3 h-5 w-5 text-purple-500" />
                                        {getSortDisplay()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[240px] p-4" align="start">
                                    <div className="space-y-2">
                                        <Button
                                            variant={sortOrder === "newest" ? "secondary" : "ghost"}
                                            className="w-full justify-start h-12 text-base"
                                            onClick={() => setSortOrder("newest")}
                                        >
                                            Newest First
                                        </Button>
                                        <Button
                                            variant={sortOrder === "oldest" ? "secondary" : "ghost"}
                                            className="w-full justify-start h-12 text-base"
                                            onClick={() => setSortOrder("oldest")}
                                        >
                                            Oldest First
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Button
                                onClick={handleApplyFilters}
                                className="flex items-center gap-2 h-12 px-6 text-base"
                                size="lg"
                            >
                                <Filter className="h-5 w-5" />
                                Apply
                            </Button>

                            {/* Reset button */}
                            <div className="w-[100px]">
                                <Button
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className={`flex items-center gap-2 whitespace-nowrap transition-opacity duration-200 h-12 text-base ${hasActiveFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                                        }`}
                                >
                                    <X className="h-5 w-5" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Active filters display */}
                    {hasAppliedFilters && (
                        <div className="mt-6 flex flex-wrap gap-3">
                            {tempFilters.searchQuery && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-base text-blue-800">
                                    Search: "{tempFilters.searchQuery}"
                                </span>
                            )}
                            {(tempFilters.ratingRange[0] !== 0 || tempFilters.ratingRange[1] !== 5) && (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-base text-green-800">
                                    Rating: {tempFilters.ratingRange[0] === 0 ? "Any" : `${tempFilters.ratingRange[0]}+`}
                                    {tempFilters.ratingRange[1] !== 5 && ` to ${tempFilters.ratingRange[1]}`} stars
                                </span>
                            )}
                            {tempFilters.subjectsFilter.length > 0 && (
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-base text-purple-800">
                                    Subjects: {tempFilters.subjectsFilter.join(", ")}
                                </span>
                            )}
                            {tempFilters.levelsFilter.length > 0 && (
                                <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-base text-orange-800">
                                    Levels: {tempFilters.levelsFilter.join(", ")}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="mt-6 text-base text-muted-foreground">
                        Showing {reviews.length} of {totalReviews} reviews
                    </div>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <Card className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
                            <p className="text-muted-foreground">No reviews found matching your filters.</p>
                        </Card>
                    ) : (
                        reviews.map((review: Review) => (
                            <ReviewManagementCard key={review._id} review={review} />
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}