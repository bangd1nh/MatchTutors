import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, GraduationCap, Users, DollarSign, ChevronDown, X, Search, BookOpen, Layers } from "lucide-react"
import type { Tutor } from "@/types/Tutor"
import { Level, LEVEL_VALUES } from "@/enums/level.enum"

const getLevelDisplayName = (level: Level): string => {
    const levelMap: Record<Level, string> = {
        [Level.GRADE_1]: "Grade 1",
        [Level.GRADE_2]: "Grade 2",
        [Level.GRADE_3]: "Grade 3",
        [Level.GRADE_4]: "Grade 4",
        [Level.GRADE_5]: "Grade 5",
        [Level.GRADE_6]: "Grade 6",
        [Level.GRADE_7]: "Grade 7",
        [Level.GRADE_8]: "Grade 8",
        [Level.GRADE_9]: "Grade 9",
        [Level.GRADE_10]: "Grade 10",
        [Level.GRADE_11]: "Grade 11",
        [Level.GRADE_12]: "Grade 12",
        [Level.UNIVERSITY]: "University",
    };
    return levelMap[level];
};

interface TutorFilterBarProps {
    currentFilters: {
        searchQuery: string
        priceRange: [number, number]
        selectedRatings: number[]
        selectedTimeSlots: string[]
        selectedDays: string[]
        isOnline: boolean | null
        selectedSubjects: string[]
        selectedLocation: string
        experienceYears: [number, number]
        selectedGenders: string[]
        selectedClassTypes: string[]
        selectedLevels: string[]
    }
    onFilterChange: (newFilters: Partial<TutorFilterBarProps["currentFilters"]>) => void
    onApplyFilters: () => void
    onClearFilters: () => void
    tutors: Tutor[]
}

export function TutorFilterBar({
    currentFilters,
    onFilterChange,
    onApplyFilters,
    onClearFilters,
    tutors,
}: TutorFilterBarProps) {
    const allSubjects = Array.from(
        new Set(tutors.flatMap((tutor) => tutor.subjects)),
    ).slice(0, 10)

    const handleRatingChange = (rating: number, checked: boolean) => {
        onFilterChange({
            selectedRatings: checked
                ? [...currentFilters.selectedRatings, rating]
                : currentFilters.selectedRatings.filter((r) => r !== rating),
        })
    }

    const getActiveFilterCount = () => {
        let count = 0
        if (currentFilters.selectedRatings.length > 0) count++
        if (currentFilters.selectedSubjects.length > 0) count++
        if (currentFilters.selectedLocation) count++
        if (currentFilters.selectedGenders.length > 0) count++
        if (currentFilters.selectedTimeSlots.length > 0) count++
        if (currentFilters.selectedDays.length > 0) count++
        if (currentFilters.selectedClassTypes.length > 0) count++
        if (currentFilters.selectedLevels.length > 0) count++
        if (currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 200) count++
        if (currentFilters.experienceYears[0] > 0 || currentFilters.experienceYears[1] < 20) count++
        return count
    }

    const activeFilterCount = getActiveFilterCount()

    return (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-4">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search Input */}
                    <div className="flex flex-1 max-w-[50%]">
                        <Input
                            placeholder="Search by name, subject, or bio..."
                            value={currentFilters.searchQuery}
                            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                            className="h-10 rounded-r-none" // remove right radius so it merges with button
                        />
                        <Button
                            onClick={() => onApplyFilters()}
                            className="h-10 rounded-l-none bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Filter Buttons with Popovers */}
                    <div className="flex items-center gap-2">
                        {/* Levels Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2 bg-transparent">
                                    <Layers className="h-4 w-4" />
                                    Levels
                                    {currentFilters.selectedLevels.length > 0 && (
                                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                            {currentFilters.selectedLevels.length}
                                        </Badge>
                                    )}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 max-h-80 overflow-y-auto" align="start">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm">Education Levels</h4>
                                    <div className="space-y-2">
                                        {LEVEL_VALUES.map((level) => (
                                            <div key={level} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`level-${level}`}
                                                    checked={currentFilters.selectedLevels.includes(level)}
                                                    onCheckedChange={(checked) => {
                                                        onFilterChange({
                                                            selectedLevels: checked
                                                                ? [...currentFilters.selectedLevels, level]
                                                                : currentFilters.selectedLevels.filter((l) => l !== level),
                                                        })
                                                    }}
                                                />
                                                <Label htmlFor={`level-${level}`} className="text-sm">
                                                    {getLevelDisplayName(level)}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Class Type Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2 bg-transparent">
                                    <BookOpen className="h-4 w-4" />
                                    Class Type
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60" align="start">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm">Class Type</h4>
                                    <div className="space-y-2">
                                        {[
                                            { value: "OneToOne", label: "One-on-One" },
                                            { value: "Group", label: "Group Classes" },
                                        ].map((classType) => (
                                            <div key={classType.value} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`classType-${classType.value}`}
                                                    checked={currentFilters.selectedClassTypes.includes(classType.value)}
                                                    onCheckedChange={(checked) => {
                                                        onFilterChange({
                                                            selectedClassTypes: checked
                                                                ? [...currentFilters.selectedClassTypes, classType.value]
                                                                : currentFilters.selectedClassTypes.filter((c) => c !== classType.value),
                                                        })
                                                    }}
                                                />
                                                <Label htmlFor={`classType-${classType.value}`} className="text-sm">
                                                    {classType.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Subjects Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2 bg-transparent">
                                    <GraduationCap className="h-4 w-4" />
                                    Subjects
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm">Select Subjects</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {allSubjects.map((subject) => (
                                            <div key={subject} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`subject-${subject}`}
                                                    checked={currentFilters.selectedSubjects.includes(subject)}
                                                    onCheckedChange={(checked) => {
                                                        onFilterChange({
                                                            selectedSubjects: checked
                                                                ? [...currentFilters.selectedSubjects, subject]
                                                                : currentFilters.selectedSubjects.filter((s) => s !== subject),
                                                        })
                                                    }}
                                                />
                                                <Label htmlFor={`subject-${subject}`} className="text-sm">
                                                    {subject}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Location Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2 bg-transparent">
                                    <MapPin className="h-4 w-4" />
                                    Location
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm">Filter by Location</h4>
                                    <Input
                                        placeholder="Search by city"
                                        value={currentFilters.selectedLocation}
                                        onChange={(e) => onFilterChange({ selectedLocation: e.target.value })}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Rating Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2 bg-transparent">
                                    <Star className="h-4 w-4" />
                                    Rating
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm">Minimum Rating</h4>
                                    <div className="space-y-2">
                                        {[5, 4, 3, 2, 1].map((rating) => (
                                            <div key={rating} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`rating-${rating}`}
                                                    checked={currentFilters.selectedRatings.includes(rating)}
                                                    onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                                                />
                                                <div className="flex items-center gap-1">
                                                    {[...Array(rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                    {[...Array(5 - rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-gray-300 text-gray-300" />
                                                    ))}
                                                    <span className="text-sm ml-1">{rating}.0 & up</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Price & Experience Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2 bg-transparent">
                                    <DollarSign className="h-4 w-4" />
                                    Price & Experience
                                    {(currentFilters.priceRange[0] > 0 ||
                                        currentFilters.priceRange[1] < 200 ||
                                        currentFilters.experienceYears[0] > 0 ||
                                        currentFilters.experienceYears[1] < 20) && (
                                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                                                •
                                            </Badge>
                                        )}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">
                                            Price Range: ${currentFilters.priceRange[0]} - ${currentFilters.priceRange[1]}/hr
                                        </Label>
                                        <Slider
                                            value={currentFilters.priceRange}
                                            onValueChange={(value) => onFilterChange({ priceRange: value as [number, number] })}
                                            max={200}
                                            step={5}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">
                                            Experience: {currentFilters.experienceYears[0]} - {currentFilters.experienceYears[1]} years
                                        </Label>
                                        <Slider
                                            value={currentFilters.experienceYears}
                                            onValueChange={(value) => onFilterChange({ experienceYears: value as [number, number] })}
                                            max={20}
                                            step={1}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Teaching Services & Gender Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2 bg-transparent">
                                    <Users className="h-4 w-4" />
                                    Gender
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Gender</Label>
                                        <div className="space-y-2">
                                            {["Male", "Female"].map((gender) => (
                                                <div key={gender} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`gender-${gender.toLowerCase()}`}
                                                        checked={currentFilters.selectedGenders.includes(gender)}
                                                        onCheckedChange={(checked) => {
                                                            onFilterChange({
                                                                selectedGenders: checked
                                                                    ? [...currentFilters.selectedGenders, gender]
                                                                    : currentFilters.selectedGenders.filter((g) => g !== gender),
                                                            })
                                                        }}
                                                    />
                                                    <Label htmlFor={`gender-${gender.toLowerCase()}`} className="text-sm">
                                                        {gender}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Schedule Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-10 gap-2 bg-transparent">
                                    <Clock className="h-4 w-4" />
                                    Schedule
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Time of Day</Label>
                                        <div className="space-y-2">
                                            {["Morning", "Afternoon", "Evening"].map((slot) => (
                                                <div key={slot} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={slot.toLowerCase()}
                                                        checked={currentFilters.selectedTimeSlots.includes(slot)}
                                                        onCheckedChange={(checked) =>
                                                            onFilterChange({
                                                                selectedTimeSlots: checked
                                                                    ? [...currentFilters.selectedTimeSlots, slot]
                                                                    : currentFilters.selectedTimeSlots.filter((s) => s !== slot),
                                                            })
                                                        }
                                                    />
                                                    <Label htmlFor={slot.toLowerCase()}>{slot}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Days of Week</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                                <div key={day} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={day.toLowerCase()}
                                                        checked={currentFilters.selectedDays.includes(day)}
                                                        onCheckedChange={(checked) =>
                                                            onFilterChange({
                                                                selectedDays: checked
                                                                    ? [...currentFilters.selectedDays, day]
                                                                    : currentFilters.selectedDays.filter((d) => d !== day),
                                                            })
                                                        }
                                                    />
                                                    <Label htmlFor={day.toLowerCase()} className="text-xs">
                                                        {day.slice(0, 3)}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                            <Button onClick={onApplyFilters} className="h-10">
                                Apply
                            </Button>
                            {activeFilterCount > 0 && (
                                <Button variant="ghost" onClick={onClearFilters} className="h-10 px-3">
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
