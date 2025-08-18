import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Tutor } from "@/types/Tutor"
import tutorsData from "@/data/tutors.json"
import { TutorCard } from "@/components/tutor/tutor-search/TutorCard"
import { TutorFilterBar } from "@/components/tutor/tutor-search/TutorFilterSidebar"
import { Search } from "lucide-react"
import { Pagination } from "@/components/common/Pagination"

export default function TutorSearch() {
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

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

    const tutorsPerPage = 4
    const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage)
    const startIndex = (currentPage - 1) * tutorsPerPage
    const paginatedTutors = filteredTutors.slice(startIndex, startIndex + tutorsPerPage)

    useEffect(() => {
        setCurrentPage(1)
    }, [appliedFilters])

    const applyFilters = () => {
        setAppliedFilters(currentFilters)
        setCurrentPage(1)
    }

    const clearAllFilters = () => {
        const resetFilters: typeof currentFilters = {
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
        }
        setCurrentFilters(resetFilters)
        setAppliedFilters(resetFilters)
        setCurrentPage(1)
    }

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
                        <TutorFilterBar
                            currentFilters={currentFilters}
                            onFilterChange={(newFilters) => setCurrentFilters(prev => ({ ...prev, ...newFilters }))}
                            onApplyFilters={applyFilters}
                            onClearFilters={clearAllFilters}
                            tutors={tutors}
                        />
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
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                className="mt-8"
                            />
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