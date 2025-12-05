import { StudentReviewCard } from "@/components/review/StudentReviewCard";
import { useToast } from "@/hooks/useToast";
import { useReview } from "@/hooks/useReview";
import { Pagination } from "@/components/common/Pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Review } from "@/types/review";
import { Search, Filter, X, Star, BookOpen, GraduationCap, Calendar } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { SUBJECT_VALUES } from "@/enums/subject.enum";
import { LEVEL_VALUES } from "@/enums/level.enum";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { getLevelLabelVi, getSubjectLabelVi } from "@/utils/educationDisplay";

export function StudentReviewHistory() {
    const toast = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);
    const [sortOrder, setSortOrder] = useState("newest");
    const [subjectsFilter, setSubjectsFilter] = useState<string[]>([]);
    const [levelsFilter, setLevelsFilter] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tempFilters, setTempFilters] = useState({
        searchQuery: "",
        ratingRange: [0, 5] as [number, number],
        sortOrder: "newest",
        subjectsFilter: [] as string[],
        levelsFilter: [] as string[],
    });
    const reviewsPerPage = 10;

    const availableSubjects = SUBJECT_VALUES;
    const availableLevels = LEVEL_VALUES;

    const filters = useMemo(() => {
        const filterParams: any = {
            page: currentPage,
            limit: reviewsPerPage,
            sort: tempFilters.sortOrder,
        };

        if (tempFilters.searchQuery) {
            filterParams.keyword = tempFilters.searchQuery;
        }

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

    const {
        studentReviewHistory,
        isHistoryLoading,
        updateReview,
        refetchHistory,
    } = useReview(undefined, filters);

    const handleUpdateReview = async (reviewId: string, data: { rating: number; comment: string }) => {
        try {
            await updateReview({ reviewId, data });
            toast("success", "Cập nhật đánh giá thành công!");
            refetchHistory();
        } catch (error) {
            console.error(error);
            toast(
                "error",
                (error as any)?.response?.data?.message ||
                (error as any)?.message ||
                "Không thể gửi đánh giá"
            );
        }
    };

    const mr = (studentReviewHistory as any) ?? {};
    const reviews = mr.reviews ?? [];
    const totalReviews = mr.total ?? 0;
    const totalPages = mr.totalPages ?? 1;

    useEffect(() => {
        setTempFilters({
            searchQuery,
            ratingRange,
            sortOrder,
            subjectsFilter,
            levelsFilter,
        });
    }, []);

    const handleApplyFilters = () => {
        setTempFilters({
            searchQuery,
            ratingRange,
            sortOrder,
            subjectsFilter,
            levelsFilter,
        });
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setRatingRange([0, 5]);
        setSortOrder("newest");
        setSubjectsFilter([]);
        setLevelsFilter([]);
        setTempFilters({
            searchQuery: "",
            ratingRange: [0, 5],
            sortOrder: "newest",
            subjectsFilter: [],
            levelsFilter: [],
        });
        setCurrentPage(1);
    };

    const hasActiveFilters =
        searchQuery ||
        ratingRange[0] !== 0 ||
        ratingRange[1] !== 5 ||
        subjectsFilter.length > 0 ||
        levelsFilter.length > 0;

    const hasAppliedFilters =
        tempFilters.searchQuery ||
        tempFilters.ratingRange[0] !== 0 ||
        tempFilters.ratingRange[1] !== 5 ||
        tempFilters.subjectsFilter.length > 0 ||
        tempFilters.levelsFilter.length > 0;

    const getRatingDisplay = () => {
        if (ratingRange[0] === 0 && ratingRange[1] === 5) return "Tất cả đánh giá";
        if (ratingRange[0] === 0) return `Tối đa ${ratingRange[1]}★`;
        if (ratingRange[1] === 5) return `Từ ${ratingRange[0]}★ trở lên`;
        return `${ratingRange[0]} - ${ratingRange[1]}★`;
    };

    const getSubjectsDisplay = () => {
        if (subjectsFilter.length === 0) return "Tất cả môn học";
        if (subjectsFilter.length === 1) return subjectsFilter[0];
        return `${subjectsFilter.length} môn`;
    };

    const getLevelsDisplay = () => {
        if (levelsFilter.length === 0) return "Tất cả trình độ";
        if (levelsFilter.length === 1) return levelsFilter[0];
        return `${levelsFilter.length} trình độ`;
    };

    const getSortDisplay = () => {
        return sortOrder === "newest" ? "Mới nhất" : "Cũ nhất";
    };

    if (isHistoryLoading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-7xl">
                    <h1 className="mb-8 text-3xl font-bold text-foreground">Đánh giá của tôi</h1>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground">Đánh giá của tôi</h1>
                    <p className="mt-2 text-muted-foreground">
                        Xem và quản lý tất cả đánh giá bạn đã viết
                    </p>
                </div>

                {/* Filters */}
                <Card className="mb-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Tìm theo tên gia sư hoặc nội dung đánh giá"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 text-base"
                            />
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 flex-wrap items-center gap-4">

                            {/* Rating */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] h-12 justify-start text-base">
                                        <Star className="mr-3 h-5 w-5 text-yellow-500" />
                                        {getRatingDisplay()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-6">
                                    <div className="space-y-4">
                                        <div className="text-base font-medium">Khoảng đánh giá</div>
                                        <Slider
                                            value={ratingRange}
                                            onValueChange={(val) => setRatingRange(val as [number, number])}
                                            max={5}
                                            min={0}
                                            step={1}
                                        />
                                        <div className="flex justify-between text-base text-muted-foreground">
                                            <span>Min: {ratingRange[0]}★</span>
                                            <span>Max: {ratingRange[1]}★</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setRatingRange([0, 5])}
                                            className="w-full"
                                        >
                                            Đặt lại
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Subjects */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] h-12 justify-start text-base">
                                        <BookOpen className="mr-3 h-5 w-5 text-blue-500" />
                                        {getSubjectsDisplay()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-6">
                                    <div className="space-y-4">
                                        <div className="text-base font-medium">Lọc theo môn học</div>
                                        <div className="max-h-64 space-y-3 overflow-y-auto">
                                            {availableSubjects.map((subject) => (
                                                <div key={subject} className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={subjectsFilter.includes(subject)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSubjectsFilter([...subjectsFilter, subject]);
                                                            } else {
                                                                setSubjectsFilter(subjectsFilter.filter((s) => s !== subject));
                                                            }
                                                        }}
                                                        className="h-5 w-5"
                                                    />
                                                    <label className="flex-1 cursor-pointer text-base">
                                                        {getSubjectLabelVi(subject)}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Levels */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] h-12 justify-start text-base">
                                        <GraduationCap className="mr-3 h-5 w-5 text-green-500" />
                                        {getLevelsDisplay()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-6">
                                    <div className="space-y-4">
                                        <div className="text-base font-medium">Lọc theo trình độ</div>
                                        <div className="max-h-64 space-y-3 overflow-y-auto">
                                            {availableLevels.map((level) => (
                                                <div key={level} className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={levelsFilter.includes(level)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setLevelsFilter([...levelsFilter, level]);
                                                            } else {
                                                                setLevelsFilter(levelsFilter.filter((l) => l !== level));
                                                            }
                                                        }}
                                                        className="h-5 w-5"
                                                    />
                                                    <label className="flex-1 cursor-pointer text-base">
                                                        {getLevelLabelVi(level)}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Sort */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-[180px] h-12 justify-start text-base">
                                        <Calendar className="mr-3 h-5 w-5 text-purple-500" />
                                        {getSortDisplay()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[240px] p-4">
                                    <div className="space-y-2">
                                        <Button
                                            variant={sortOrder === "newest" ? "secondary" : "ghost"}
                                            className="w-full justify-start h-12 text-base"
                                            onClick={() => setSortOrder("newest")}
                                        >
                                            Mới nhất
                                        </Button>
                                        <Button
                                            variant={sortOrder === "oldest" ? "secondary" : "ghost"}
                                            className="w-full justify-start h-12 text-base"
                                            onClick={() => setSortOrder("oldest")}
                                        >
                                            Cũ nhất
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Button onClick={handleApplyFilters} className="h-12 px-6 text-base">
                                <Filter className="h-5 w-5 mr-2" />
                                Áp dụng
                            </Button>

                            <div className="w-[100px]">
                                <Button
                                    variant="outline"
                                    onClick={handleResetFilters}
                                    className={`h-12 text-base transition-opacity ${hasActiveFilters ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                                >
                                    <X className="h-5 w-5 mr-2" />
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {hasAppliedFilters && (
                        <div className="mt-6 flex flex-wrap gap-3">
                            {tempFilters.searchQuery && (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-blue-800 text-base">
                                    Tìm kiếm: "{tempFilters.searchQuery}"
                                </span>
                            )}
                            {(tempFilters.ratingRange[0] !== 0 || tempFilters.ratingRange[1] !== 5) && (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-green-800 text-base">
                                    Đánh giá: {tempFilters.ratingRange[0]} - {tempFilters.ratingRange[1]}★
                                </span>
                            )}
                            {tempFilters.subjectsFilter.length > 0 && (
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-purple-800 text-base">
                                    Môn học: {tempFilters.subjectsFilter.join(", ")}
                                </span>
                            )}
                            {tempFilters.levelsFilter.length > 0 && (
                                <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-orange-800 text-base">
                                    Trình độ: {tempFilters.levelsFilter.join(", ")}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="mt-6 text-base text-muted-foreground">
                        Hiển thị {reviews.length} trên tổng số {totalReviews} đánh giá
                    </div>
                </Card>

                {/* Reviews */}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <Card className="rounded-2xl p-12 text-center bg-card">
                            <p className="text-muted-foreground">
                                {hasAppliedFilters
                                    ? "Không tìm thấy đánh giá nào phù hợp với bộ lọc."
                                    : "Bạn chưa viết đánh giá nào. Hãy học với gia sư và chia sẻ trải nghiệm!"
                                }
                            </p>
                        </Card>
                    ) : (
                        reviews.map((review: Review) => (
                            <StudentReviewCard
                                key={review._id}
                                review={review}
                                onUpdate={handleUpdateReview}
                            />
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
    );
}
