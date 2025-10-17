import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, GraduationCap, Users, DollarSign, ChevronDown, X, Search, BookOpen, Layers, Filter } from "lucide-react"
import type { Tutor } from "@/types/Tutor"
import { Level, LEVEL_VALUES } from "@/enums/level.enum"
import { SUBJECT_VALUES } from "@/enums/subject.enum"
import { TimeSlot } from "@/enums/timeSlot.enum"
import { AnimatePresence, motion } from "framer-motion"
import { MultiSelectPopover } from "./MultiSelectPopover"
import { CITY_TYPE_VALUES } from "@/enums/city.enum"

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

const getTimeSlotDisplayName = (slot: string): string => {
    const slotMap: Record<string, string> = {
        [TimeSlot.PRE_12]: "Morning",
        [TimeSlot.MID_12_17]: "Afternoon",
        [TimeSlot.AFTER_17]: "Evening",
    };
    return slotMap[slot] || slot;
};

interface TutorFilterBarProps {
    currentFilters: {
        searchQuery: string
        priceRange: [number, number]
        ratingRange: [number, number]
        selectedTimeSlots: string[]
        selectedDays: string[]
        isOnline: boolean | null
        selectedSubjects: string[]
        selectedLocation: string
        experienceYears: [number, number]
        selectedClassTypes: string[]
        selectedLevels: string[]
        selectedCities: string[]
    }
    onFilterChange: (newFilters: Partial<TutorFilterBarProps["currentFilters"]>) => void
    onApplyFilters: () => void
    onClearFilters: () => void
    tutors: Tutor[]
}

export default function TutorFilterBar({
    currentFilters,
    onFilterChange,
    onApplyFilters,
    onClearFilters,
}: TutorFilterBarProps) {

    const removeLevelFilter = (level: string) => {
        onFilterChange({
            selectedLevels: currentFilters.selectedLevels.filter(l => l !== level)
        });
    };

    const removeSubjectFilter = (subject: string) => {
        onFilterChange({
            selectedSubjects: currentFilters.selectedSubjects.filter(s => s !== subject)
        });
    };

    const removeClassTypeFilter = (classType: string) => {
        onFilterChange({
            selectedClassTypes: currentFilters.selectedClassTypes.filter(c => c !== classType)
        });
    };

    const removeCityFilter = (city: string) => {
        onFilterChange({
            selectedCities: currentFilters.selectedCities.filter(c => c !== city)
        });
    };

    const removeTimeSlotFilter = (slot: string) => {
        onFilterChange({
            selectedTimeSlots: currentFilters.selectedTimeSlots.filter(s => s !== slot)
        });
    };

    const removeDayFilter = (day: string) => {
        onFilterChange({
            selectedDays: currentFilters.selectedDays.filter(d => d !== day)
        });
    };

    const removeRatingFilter = () => {
        onFilterChange({ ratingRange: [0, 5] });
    };

    const removePriceFilter = () => {
        onFilterChange({ priceRange: [0, 2000000] });
    };

    const removeExperienceFilter = () => {
        onFilterChange({ experienceYears: [0, 20] });
    };

    const hasActiveFilters = () => {
        return currentFilters.selectedLevels.length > 0 ||
            currentFilters.selectedSubjects.length > 0 ||
            currentFilters.selectedClassTypes.length > 0 ||
            currentFilters.selectedTimeSlots.length > 0 ||
            currentFilters.selectedDays.length > 0 ||
            currentFilters.selectedLocation !== "" ||
            currentFilters.selectedCities.length > 0 ||
            currentFilters.ratingRange[0] > 0 || currentFilters.ratingRange[1] < 5 ||
            currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 2000000 ||
            currentFilters.experienceYears[0] > 0 || currentFilters.experienceYears[1] < 20;
    };

    return (
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-4 space-y-3">
                {/* Search Bar - Full width */}
                <div className="flex w-full max-w-2xl">
                    <Input
                        placeholder="Search by name, bio..."
                        value={currentFilters.searchQuery}
                        onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                        className="h-10 rounded-r-none border-r-0 flex-1"
                    />
                    <Button
                        onClick={onApplyFilters}
                        className="h-10 rounded-l-none bg-blue-600 hover:bg-blue-700 text-white border-l-0 shrink-0"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {/* Active Filter Badges - Between search and filter buttons */}
                <AnimatePresence>

                    {hasActiveFilters() && (
                        <motion.div
                            className="flex flex-wrap"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35 }}
                        >

                            <div className="flex flex-wrap gap-2 py-2">
                                {/* Level Badges */}
                                {currentFilters.selectedLevels.map(level => (
                                    <Badge key={level} variant="secondary" className="flex items-center gap-1 py-1">
                                        <Layers className="h-3 w-3" />
                                        {getLevelDisplayName(level as Level)}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={() => removeLevelFilter(level)}
                                        />
                                    </Badge>
                                ))}

                                {/* Subject Badges */}
                                {currentFilters.selectedSubjects.map(subject => (
                                    <Badge key={subject} variant="secondary" className="flex items-center gap-1 py-1">
                                        <GraduationCap className="h-3 w-3" />
                                        {subject}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={() => removeSubjectFilter(subject)}
                                        />
                                    </Badge>
                                ))}

                                {/* Class Type Badges */}
                                {currentFilters.selectedClassTypes.map(classType => (
                                    <Badge key={classType} variant="secondary" className="flex items-center gap-1 py-1">
                                        <BookOpen className="h-3 w-3" />
                                        {classType === "ONLINE" ? "Online" : "In Person"}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={() => removeClassTypeFilter(classType)}
                                        />
                                    </Badge>
                                ))}

                                {/* City Badges */}
                                {currentFilters.selectedCities.map(city => (
                                    <Badge key={city} variant="secondary" className="flex items-center gap-1 py-1">
                                        <MapPin className="h-3 w-3" />
                                        {city}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={() => removeCityFilter(city)}
                                        />
                                    </Badge>
                                ))}

                                {/* Rating Badge */}
                                {(currentFilters.ratingRange[0] > 0 || currentFilters.ratingRange[1] < 5) && (
                                    <Badge variant="secondary" className="flex items-center gap-1 py-1">
                                        <Star className="h-3 w-3" />
                                        {currentFilters.ratingRange[0]} - {currentFilters.ratingRange[1]} stars
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={removeRatingFilter}
                                        />
                                    </Badge>
                                )}

                                {/* Price Badge */}
                                {(currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 2000000) && (
                                    <Badge variant="secondary" className="flex items-center gap-1 py-1">
                                        <DollarSign className="h-3 w-3" />
                                        {currentFilters.priceRange[0].toLocaleString()} - {currentFilters.priceRange[1].toLocaleString()} vnd
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={removePriceFilter}
                                        />
                                    </Badge>
                                )}

                                {/* Experience Badge */}
                                {(currentFilters.experienceYears[0] > 0 || currentFilters.experienceYears[1] < 20) && (
                                    <Badge variant="secondary" className="flex items-center gap-1 py-1">
                                        <Users className="h-3 w-3" />
                                        {currentFilters.experienceYears[0]} - {currentFilters.experienceYears[1]} years
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={removeExperienceFilter}
                                        />
                                    </Badge>
                                )}

                                {/* Time Slot Badges */}
                                {currentFilters.selectedTimeSlots.map(slot => (
                                    <Badge key={slot} variant="secondary" className="flex items-center gap-1 py-1">
                                        <Clock className="h-3 w-3" />
                                        {getTimeSlotDisplayName(slot)}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={() => removeTimeSlotFilter(slot)}
                                        />
                                    </Badge>
                                ))}

                                {/* Day Badges */}
                                {currentFilters.selectedDays.map(day => (
                                    <Badge key={day} variant="secondary" className="flex items-center gap-1 py-1">
                                        <Clock className="h-3 w-3" />
                                        {day}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                                            onClick={() => removeDayFilter(day)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filter Buttons Row - Larger buttons that fit the width */}
                <div className="flex w-full overflow-x-auto pb-2">
                    <div className="flex items-center gap-2 flex-nowrap min-w-max w-full justify-between">
                        {/* Levels Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 gap-2 bg-transparent text-sm flex-1 min-w-24"
                                >
                                    <Layers className="h-4 w-4" />
                                    Levels
                                    {currentFilters.selectedLevels.length > 0 && (
                                        <Badge variant="secondary" className="h-5 w-5 p-0 min-w-5 text-xs flex items-center justify-center">
                                            {currentFilters.selectedLevels.length}
                                        </Badge>
                                    )}
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

                        {/* Subjects Filter */}
                        <MultiSelectPopover
                            label="Subjects"
                            icon={<GraduationCap className="h-4 w-4" />}
                            options={SUBJECT_VALUES}
                            selected={currentFilters.selectedSubjects ?? []}
                            onChange={(newSelected) =>
                                onFilterChange({ selectedSubjects: newSelected })
                            }
                            placeholder="Search subject..."
                        />

                        {/* Class Type Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 gap-2 bg-transparent text-sm flex-1 min-w-24"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    Class Type
                                    {currentFilters.selectedClassTypes.length > 0 && (
                                        <Badge variant="secondary" className="h-5 w-5 p-0 min-w-5 text-xs flex items-center justify-center">
                                            {currentFilters.selectedClassTypes.length}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60" align="start">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm">Class Type</h4>
                                    <div className="space-y-2">
                                        {[
                                            { value: "ONLINE", label: "Online" },
                                            { value: "IN_PERSON", label: "In Person" },
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

                        {/* City Filter */}
                        <MultiSelectPopover
                            label="Location"
                            icon={<MapPin className="h-4 w-4" />}
                            options={CITY_TYPE_VALUES}
                            selected={currentFilters.selectedCities ?? []}
                            onChange={(newSelected) =>
                                onFilterChange({ selectedCities: newSelected })
                            }
                            placeholder="Search city..."
                        />

                        {/* Rating Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 gap-2 bg-transparent text-sm flex-1 min-w-24"
                                >
                                    <Star className="h-4 w-4" />
                                    Rating
                                    {(currentFilters.ratingRange[0] > 0 || currentFilters.ratingRange[1] < 5) && (
                                        <Badge variant="secondary" className="h-5 w-5 p-0 min-w-5 text-xs flex items-center justify-center">
                                            1
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">
                                            Rating: {currentFilters.ratingRange[0]} - {currentFilters.ratingRange[1]} stars
                                        </Label>
                                        <Slider
                                            value={currentFilters.ratingRange}
                                            onValueChange={(value) => onFilterChange({ ratingRange: value as [number, number] })}
                                            max={5}
                                            step={1}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>0</span>
                                            <span>1</span>
                                            <span>2</span>
                                            <span>3</span>
                                            <span>4</span>
                                            <span>5</span>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Price & Experience Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 gap-2 bg-transparent text-sm flex-1 min-w-24"
                                >
                                    <DollarSign className="h-4 w-4" />
                                    Price & Exp
                                    {(currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 2000000 ||
                                        currentFilters.experienceYears[0] > 0 || currentFilters.experienceYears[1] < 20) && (
                                            <Badge variant="secondary" className="h-5 w-5 p-0 min-w-5 text-xs flex items-center justify-center">
                                                1
                                            </Badge>
                                        )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">
                                            Price Range: {currentFilters.priceRange[0].toLocaleString()} vnd - {currentFilters.priceRange[1].toLocaleString()} vnd/hr
                                        </Label>
                                        <Slider
                                            value={currentFilters.priceRange}
                                            onValueChange={(value) => onFilterChange({ priceRange: value as [number, number] })}
                                            max={2000000}
                                            step={100000}
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

                        {/* Schedule Filter */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-10 gap-2 bg-transparent text-sm flex-1 min-w-24"
                                >
                                    <Clock className="h-4 w-4" />
                                    Schedule
                                    {(currentFilters.selectedTimeSlots.length > 0 || currentFilters.selectedDays.length > 0) && (
                                        <Badge variant="secondary" className="h-5 w-5 p-0 min-w-5 text-xs flex items-center justify-center">
                                            {currentFilters.selectedTimeSlots.length + currentFilters.selectedDays.length}
                                        </Badge>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="start">
                                <div className="space-y-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-3 block">Time of Day</Label>
                                        <div className="space-y-2">
                                            {[TimeSlot.PRE_12, TimeSlot.MID_12_17, TimeSlot.AFTER_17].map((slot) => (
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
                                                    <Label htmlFor={slot.toLowerCase()}>{getTimeSlotDisplayName(slot)}</Label>
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
                        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 shrink-0">
                            <Button
                                onClick={onApplyFilters}
                                className="h-10 text-sm whitespace-nowrap px-4"
                            >
                                Apply
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={onClearFilters}
                                className={`h-10 px-3 shrink-0 transition-opacity ${hasActiveFilters() ? "opacity-100" : "opacity-0 pointer-events-none"
                                    }`}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}