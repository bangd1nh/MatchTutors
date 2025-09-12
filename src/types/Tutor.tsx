export interface Tutor {
    _id: string
    userId: string
    fullName?: string
    avatarUrl?: string
    gender?: string
    address: {
        city?: string
        street?: string
        lat?: number
        lng?: number
    }
    certifications: {
        name: string
        description?: string
        imageUrl?: string
    }[]
    experienceYears: number
    hourlyRate: number
    languages: string[]
    education: {
        degree: string
        institution: string
        fieldOfStudy?: string
        dateRange: {
            startDate: string
            endDate: string
        }
        description: string
    }[]
    subjects: string[]
    availability: {
        dayOfWeek: number // 0-6 (Sun-Sat)
        timeSlots: ("morning" | "afternoon" | "evening")[]
    }[]
    contact: {
        phone: string
        email: string
    }
    isApproved: boolean
    ratings: {
        average: number
        totalReviews: number
    }
    createdAt: string
    updatedAt: string
    bio: string
    classType: "Online" | "In_Person"
    levels: string[]
}
