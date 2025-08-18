import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star } from "lucide-react"
import type { Tutor } from "@/types/Tutor"

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
        selectedTeachingServices: string[]
    }
    onFilterChange: (newFilters: Partial<TutorFilterBarProps['currentFilters']>) => void
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
        new Set(tutors.flatMap((tutor) => tutor.subjects.flatMap((subject) => subject.items))),
    ).slice(0, 10)

    const handleRatingChange = (rating: number, checked: boolean) => {
        onFilterChange({
            selectedRatings: checked
                ? [...currentFilters.selectedRatings, rating]
                : currentFilters.selectedRatings.filter((r) => r !== rating),
        })
    }

    return (
        <Card className="p-6 sticky top-6">
            <CardContent className="space-y-6 p-0">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Filters</h3>
                </div>

                <div>
                    <Label className="text-sm font-medium mb-3 block">Subjects</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
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

                {/* Experience Years Filter */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">
                        Experience: {currentFilters.experienceYears[0]} - {currentFilters.experienceYears[1]} years
                    </Label>
                    <Slider
                        value={currentFilters.experienceYears}
                        onValueChange={(value) =>
                            onFilterChange({
                                experienceYears: value as [number, number],
                            })
                        }
                        max={20}
                        step={1}
                        className="w-full"
                    />
                </div>

                {/* Gender Filter */}
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

                <div>
                    <Label className="text-sm font-medium mb-3 block">Teaching Services</Label>
                    <div className="space-y-2">
                        {[
                            { value: "Online", label: "Online" },
                            { value: "Offline", label: "Offline" },
                            { value: "StudentPlace", label: "Student's Place" },
                            { value: "TutorPlace", label: "Tutor's Place" },
                        ].map((service) => (
                            <div key={service.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`service-${service.value.toLowerCase()}`}
                                    checked={currentFilters.selectedTeachingServices.includes(service.value)}
                                    onCheckedChange={(checked) => {
                                        onFilterChange({
                                            selectedTeachingServices: checked
                                                ? [...currentFilters.selectedTeachingServices, service.value]
                                                : currentFilters.selectedTeachingServices.filter((s) => s !== service.value),
                                        })
                                    }}
                                />
                                <Label htmlFor={`service-${service.value.toLowerCase()}`} className="text-sm">
                                    {service.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rating Filter */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">Rating</Label>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`rating-${rating}`}
                                    checked={currentFilters.selectedRatings.includes(rating)}
                                    onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
                                />
                                <div className="flex items-center">
                                    {[...Array(rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    {[...Array(5 - rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-gray-300 text-gray-300" />
                                    ))}
                                </div>
                                <Label htmlFor={`rating-${rating}`} className="text-sm">
                                    {rating}.0{" "}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location Filter */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">Location</Label>
                    <Input
                        placeholder="Search by city or state"
                        value={currentFilters.selectedLocation}
                        onChange={(e) =>
                            onFilterChange({
                                selectedLocation: e.target.value,
                            })
                        }
                    />
                </div>

                {/* Price Range */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">
                        Price Range: ${currentFilters.priceRange[0]} - ${currentFilters.priceRange[1]}/hr
                    </Label>
                    <Slider
                        value={currentFilters.priceRange}
                        onValueChange={(value) =>
                            onFilterChange({
                                priceRange: value as [number, number],
                            })
                        }
                        max={200}
                        step={5}
                        className="w-full"
                    />
                </div>

                {/* Time of Day */}
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

                {/* Days of Week */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">Days of Week</Label>
                    <div className="space-y-2">
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
                                <Label htmlFor={day.toLowerCase()}>{day}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter Actions */}
                <div className="space-y-3 pt-4 border-t">
                    <Button className="w-full" onClick={onApplyFilters}>
                        Apply Filters
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={onClearFilters}>
                        Clear All
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}