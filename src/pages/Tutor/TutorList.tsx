import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Heart, User, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tutor } from "@/types/Tutor"
import tutorsData from "@/data/tutors.json"
import { useNavigate } from "react-router-dom"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

interface TutorCardProps {
    tutor: Tutor
}

function TutorCard({ tutor }: TutorCardProps) {
    const [isSaved, setIsSaved] = useState(false)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const availableDays = tutor.availability.map((a) => a.dayOfWeek)
    const navigate = useNavigate()

    const getMethodBadgeColor = (method: string) => {
        switch (method) {
            case "Online":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            case "Offline":
                return "bg-green-100 text-green-800 hover:bg-green-200"
            case "StudentPlace":
                return "bg-purple-100 text-purple-800 hover:bg-purple-200"
            case "TutorPlace":
                return "bg-orange-100 text-orange-800 hover:bg-orange-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    function onViewProfile(_id: string): void {
        navigate(`/tutor-detail/${_id}`)
    }

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center sm:items-start">
                        <Avatar className="h-20 w-20 mb-3">
                            <AvatarImage src={tutor.avatarUrl || "/placeholder.svg"} alt={tutor.fullName} />
                            <AvatarFallback>
                                <User className="h-8 w-8" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "h-4 w-4",
                                        i < Math.floor(tutor.ratings.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                                    )}
                                />
                            ))}
                            <span className="text-sm text-muted-foreground ml-1">({tutor.ratings.totalReviews})</span>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                            <div>
                                <h3 className="text-xl font-semibold mb-1 cursor-pointer" onClick={() => onViewProfile(tutor._id)}>{tutor.fullName}</h3>
                                <div className="flex items-center text-muted-foreground mb-2">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="text-sm">
                                        {tutor.address.city}, {tutor.address.state}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Starting from:</p>
                                <p className="text-2xl font-bold text-primary">${tutor.hourlyRate}.00/hr</p>
                            </div>
                        </div>

                        {/* Availability Calendar */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Availability</span>
                            </div>
                            <div className="flex gap-1">
                                {dayNames.map((day, index) => (
                                    <div
                                        key={day}
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                                            availableDays.includes(index)
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground",
                                        )}
                                    >
                                        {day.charAt(0)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Teaching Methods */}
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {tutor.teachingServices.map((method) => (
                                    <Badge key={method} variant="secondary" className={getMethodBadgeColor(method)}>
                                        {method === "StudentPlace" ? "Student Place" : method === "TutorPlace" ? "Tutor Place" : method}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Subjects */}
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {tutor.subjects
                                    .flatMap((subject) => subject.items)
                                    .slice(0, 4)
                                    .map((item) => (
                                        <Badge key={item} variant="outline">
                                            {item}
                                        </Badge>
                                    ))}

                                {tutor.subjects.flatMap((subject) => subject.items).length > 4 && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-6 px-2 text-xs rounded-full border-dashed"
                                            >
                                                +{tutor.subjects.flatMap((subject) => subject.items).length - 4} more
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 p-3" align="start">
                                            <div className="flex flex-wrap gap-2">
                                                {tutor.subjects
                                                    .flatMap((subject) => subject.items)
                                                    .slice(4)
                                                    .map((item) => (
                                                        <Badge key={item} variant="outline" className="text-xs">
                                                            {item}
                                                        </Badge>
                                                    ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tutor.bio}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsSaved(!isSaved)}
                                className="flex items-center gap-2"
                            >
                                <Heart className={cn("h-4 w-4", isSaved && "fill-red-500 text-red-500")} />
                                Save
                            </Button>
                            <Button size="sm" className="flex-1 sm:flex-none" onClick={() => onViewProfile(tutor._id)}>
                                View Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function TutorSearch() {
    const [searchQuery, setSearchQuery] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [priceRange, setPriceRange] = useState([0, 100])
    const [selectedRatings, setSelectedRatings] = useState<number[]>([])
    const [isOnline, setIsOnline] = useState<boolean | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
    const [selectedLocation, setSelectedLocation] = useState("")
    const tutorsPerPage = 4

    const [tutors, setTutors] = useState<Tutor[]>([])
    const [currentFilters, setCurrentFilters] = useState({
        searchQuery: "",
        priceRange: [0, 100] as [number, number],
        selectedRatings: [] as number[],
        selectedTimeSlots: [] as string[],
        selectedDays: [] as string[],
        isOnline: null as boolean | null,
        selectedSubjects: [] as string[],
        selectedLocation: "",
        experienceYears: [0, 20] as [number, number],
        selectedGenders: [] as string[],
        selectedTeachingServices: [] as string[],
    })
    const [appliedFilters, setAppliedFilters] = useState(currentFilters)

    useEffect(() => {
        setTutors(tutorsData as Tutor[])
    }, [])

    const filteredTutors = tutors.filter((tutor) => {
        // Search query filter
        if (appliedFilters.searchQuery) {
            const query = appliedFilters.searchQuery.toLowerCase()
            const matchesName = tutor.fullName?.toLowerCase().includes(query)
            const matchesBio = tutor.bio.toLowerCase().includes(query)
            const matchesSubjects = tutor.subjects.some((subject) =>
                subject.items.some((item) => item.toLowerCase().includes(query)),
            )
            if (!matchesName && !matchesBio && !matchesSubjects) return false
        }

        // Rating filter
        if (appliedFilters.selectedRatings.length > 0) {
            if (!appliedFilters.selectedRatings.includes(Math.floor(tutor.ratings.average))) return false
        }

        // Price filter
        if (tutor.hourlyRate < appliedFilters.priceRange[0] || tutor.hourlyRate > appliedFilters.priceRange[1]) return false

        // Online/Offline filter
        if (appliedFilters.isOnline !== null) {
            const isOnlineTutor = tutor.teachingServices.includes("Online")
            if (appliedFilters.isOnline && !isOnlineTutor) return false
            if (!appliedFilters.isOnline && isOnlineTutor) return false
        }

        // Subject filter
        if (appliedFilters.selectedSubjects.length > 0) {
            const tutorSubjects = tutor.subjects.flatMap((subject) => subject.items)
            if (!appliedFilters.selectedSubjects.some((subject) => tutorSubjects.includes(subject))) return false
        }

        // Location filter
        if (appliedFilters.selectedLocation) {
            const locationMatch = `${tutor.address.city}, ${tutor.address.state}`.toLowerCase()
            if (!locationMatch.includes(appliedFilters.selectedLocation.toLowerCase())) return false
        }

        // Experience years filter
        if (
            tutor.experienceYears < appliedFilters.experienceYears[0] ||
            tutor.experienceYears > appliedFilters.experienceYears[1]
        )
            return false

        // Gender filter
        if (appliedFilters.selectedGenders.length > 0) {
            if (!tutor.gender || !appliedFilters.selectedGenders.includes(tutor.gender)) return false
        }

        // Teaching services filter
        if (appliedFilters.selectedTeachingServices.length > 0) {
            if (!appliedFilters.selectedTeachingServices.some((service) => tutor.teachingServices.includes(service as any)))
                return false
        }

        //Time slots filter
        if (appliedFilters.selectedTimeSlots.length > 0) {
            const availableSlots = tutor.availability.flatMap((a) => a.timeSlots)
            if (
                !appliedFilters.selectedTimeSlots
                    .map((slot) => slot.toLowerCase())
                    .some((slot) => availableSlots.includes(slot as "morning" | "afternoon" | "evening"))
            )
                return false
        }

        // Days filter
        if (appliedFilters.selectedDays.length > 0) {
            const availableDays = tutor.availability.flatMap((a) => a.dayOfWeek)
            const dayNameToIndex: Record<string, number> = {
                Sunday: 0,
                Monday: 1,
                Tuesday: 2,
                Wednesday: 3,
                Thursday: 4,
                Friday: 5,
                Saturday: 6,
            }
            if (!appliedFilters.selectedDays.some((day) => availableDays.includes(dayNameToIndex[day]))) return false
        }

        return true
    })

    const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage)
    const startIndex = (currentPage - 1) * tutorsPerPage
    const paginatedTutors = filteredTutors.slice(startIndex, startIndex + tutorsPerPage)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedRatings, priceRange, isOnline, selectedSubjects, selectedLocation])

    const handleRatingChange = (rating: number, checked: boolean) => {
        setCurrentFilters((prev) => ({
            ...prev,
            selectedRatings: checked ? [...prev.selectedRatings, rating] : prev.selectedRatings.filter((r) => r !== rating),
        }))
    }

    const applyFilters = () => {
        setAppliedFilters(currentFilters)
        setCurrentPage(1) // Reset to first page when applying new filters
    }

    const clearAllFilters = () => {
        setCurrentFilters({
            searchQuery: "",
            priceRange: [0, 100],
            selectedRatings: [],
            selectedTimeSlots: [],
            selectedDays: [],
            isOnline: null,
            selectedSubjects: [],
            selectedLocation: "",
            experienceYears: [0, 20],
            selectedGenders: [],
            selectedTeachingServices: [],
        })
        setAppliedFilters({
            searchQuery: "",
            priceRange: [0, 100],
            selectedRatings: [],
            selectedTimeSlots: [],
            selectedDays: [],
            isOnline: null,
            selectedSubjects: [],
            selectedLocation: "",
            experienceYears: [0, 20],
            selectedGenders: [],
            selectedTeachingServices: [],
        })
        setCurrentPage(1)
    }

    const allSubjects = Array.from(
        new Set(tutors.flatMap((tutor) => tutor.subjects.flatMap((subject) => subject.items))),
    ).slice(0, 10)

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Mobile Filter Toggle */}
                    <div className="lg:hidden">
                        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full mb-4">
                            <Filter className="h-4 w-4 mr-2" />
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </Button>
                    </div>

                    {/* Filters Sidebar */}
                    <div className={cn("lg:w-80 lg:block", showFilters ? "block" : "hidden")}>
                        <Card className="p-6 sticky top-6">
                            <div className="space-y-6">
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
                                                        setCurrentFilters((prev) => ({
                                                            ...prev,
                                                            selectedSubjects: checked
                                                                ? [...prev.selectedSubjects, subject]
                                                                : prev.selectedSubjects.filter((s) => s !== subject),
                                                        }))
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
                                            setCurrentFilters((prev) => ({
                                                ...prev,
                                                experienceYears: value as [number, number],
                                            }))
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
                                                        setCurrentFilters((prev) => ({
                                                            ...prev,
                                                            selectedGenders: checked
                                                                ? [...prev.selectedGenders, gender]
                                                                : prev.selectedGenders.filter((g) => g !== gender),
                                                        }))
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
                                                        setCurrentFilters((prev) => ({
                                                            ...prev,
                                                            selectedTeachingServices: checked
                                                                ? [...prev.selectedTeachingServices, service.value]
                                                                : prev.selectedTeachingServices.filter((s) => s !== service.value),
                                                        }))
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
                                            setCurrentFilters((prev) => ({
                                                ...prev,
                                                selectedLocation: e.target.value,
                                            }))
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
                                            setCurrentFilters((prev) => ({
                                                ...prev,
                                                priceRange: value as [number, number],
                                            }))
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
                                                        setCurrentFilters((prev) => ({
                                                            ...prev,
                                                            selectedTimeSlots: checked
                                                                ? [...prev.selectedTimeSlots, slot]
                                                                : prev.selectedTimeSlots.filter((s) => s !== slot),
                                                        }))
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
                                                        setCurrentFilters((prev) => ({
                                                            ...prev,
                                                            selectedDays: checked
                                                                ? [...prev.selectedDays, day]
                                                                : prev.selectedDays.filter((d) => d !== day),
                                                        }))
                                                    }
                                                />
                                                <Label htmlFor={day.toLowerCase()}>{day}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Filter Actions */}
                                <div className="space-y-3 pt-4 border-t">
                                    <Button className="w-full" onClick={applyFilters}>
                                        Apply Filters
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent" onClick={clearAllFilters}>
                                        Clear All
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Search Results */}
                    <div className="flex-1">
                        {/* Search Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold mb-2">{filteredTutors.length} search results found</h1>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search by name, subject, or bio..."
                                        value={currentFilters.searchQuery}
                                        onChange={(e) => setCurrentFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                applyFilters()
                                            }
                                        }}
                                        className="pl-10"
                                    />
                                </div>
                                <Button
                                    onClick={applyFilters}
                                    className="shrink-0"
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </div>

                        {/* Tutor Cards */}
                        <div className="space-y-6">
                            {paginatedTutors.map((tutor) => (
                                <TutorCard key={tutor._id} tutor={tutor} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className="w-10"
                                    >
                                        {page}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}

                        {filteredTutors.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-lg text-muted-foreground mb-2">No tutors found</p>
                                <p className="text-sm text-muted-foreground">Try adjusting your search criteria or filters</p>
                                <Button variant="outline" onClick={clearAllFilters} className="mt-4 bg-transparent">
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
