export interface Tutor {
    _id: string
    userId: string
    fullName?: string
    avatarUrl?: string
    tagline?: string
    dateOfBirth?: string
    gender?: string
    address: {
        city?: string
        state?: string
        district?: string
        ward?: string
        street?: string
        country?: string
    }
    certifications: string[]
    experienceYears: number
    hourlyRate: number
    languages: string[]
    keyPoints: string[]
    education: {
        degree: string
        institution: string
        location: string
        dateRange: string
        description: string
    }[]
    subjects: {
        category: string
        items: string[]
    }[]
    availability: {
        dayOfWeek: number // 0-6 (Sun-Sat)
        timeSlots: ("morning" | "afternoon" | "evening")[]
    }[]
    contact: {
        phone: string
        email: string
        facebook?: string
    }
    isApproved: boolean
    ratings: {
        average: number
        totalReviews: number
    }
    createdAt: string
    updatedAt: string
    teachingServices: ("Online" | "Offline" | "StudentPlace" | "TutorPlace")[]
    bio: string
}
