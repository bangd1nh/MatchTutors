import { GENDER_VALUES } from "@/enums/gender.enum"
import { TimeSlot } from "@/enums/timeSlot.enum"
import * as z from "zod"

export const certificationSchema = z.object({
    name: z.string().min(1, "Certification name is required"),
    imageUrl: z.string().optional(),
    imageFile: z.instanceof(File).optional(),
    description: z.string().optional(),
})

export const tutorSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    avatarUrl: z.string().optional(),
    avatarFile: z.instanceof(File).optional(),
    tagline: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(GENDER_VALUES).optional(),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
    }),
    hourlyRate: z.number().min(1, "Hourly rate is required"),
    experienceYears: z.number().min(0, "Experience years is required"),
    certifications: z.array(certificationSchema),
    classType: z.enum(["ONLINE", "IN_PERSON"]),
    education: z.array(
        z.object({
            degree: z.string().min(1, "Degree is required"),
            institution: z.string().min(1, "Institution is required"),
            fieldOfStudy: z.string().min(1, "Field of study is required"),
            dateRange: z.object({
                startDate: z.string().min(1, "Start date is required"),
                endDate: z.string().min(1, "End date is required"),
            }),
            description: z.string().optional(),
        }),
    ),
    subjects: z.array(z.string()).optional(),
    availability: z.array(
        z.object({
            dayOfWeek: z.number().min(0).max(6),
            slots: z.array(z.enum([TimeSlot.PRE_12, TimeSlot.MID_12_17, TimeSlot.AFTER_17])).min(1, "Select at least one time slot"),
        }),
    ),
    contact: z.object({
        phone: z.string().min(10, "Phone number is required"),
        email: z.string().optional(),
        facebook: z.string().optional(),
    }),
    levels: z.array(z.string()).optional(),
})

export type TutorFormData = z.infer<typeof tutorSchema>

export interface TutorProfileFormProps {
    initialData?: Partial<TutorFormData>
}

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
export const TIME_SLOTS = [TimeSlot.PRE_12, TimeSlot.MID_12_17, TimeSlot.AFTER_17] as const

export const TIME_SLOT_LABELS = {
    [TimeSlot.PRE_12]: "PRE 12PM",
    [TimeSlot.MID_12_17]: "12PM-5PM",
    [TimeSlot.AFTER_17]: "AFTER 5PM",
}

// Common subject categories
export const SUBJECT_CATEGORIES = [
    "Mathematics", "Science", "Humanities",
    "Arts", "Technology", "Business", "TestPrep",
    "Music", "Dance", "Theater", "Film",
    "Other"
];

// Function to get common subjects based on category
export function getCommonSubjects(category: string): string[] {
    const suggestions: Record<string, string[]> = {
        Mathematics: ["Algebra", "Calculus", "Geometry", "Statistics", "Trigonometry", "Number Theory", "Linear Algebra", "Differential Equations"],
        Science: ["Physics", "Chemistry", "Biology", "Earth Science", "Environmental Science", "Anatomy", "Astronomy", "Geology"],
        Humanities: ["History", "Geography", "Philosophy", "Sociology", "Psychology", "Political Science", "Anthropology", "Religious Studies"],
        Arts: ["Music", "Art", "Drama", "Photography", "Graphic Design", "Painting", "Sculpture", "Digital Arts", "Film Studies"],
        Technology: ["Programming", "Web Development", "Data Science", "Cyber Security", "Artificial Intelligence", "Machine Learning", "Database Management", "Networking"],
        Business: ["Economics", "Accounting", "Marketing", "Finance", "Management", "Business Administration", "Entrepreneurship", "Supply Chain Management"],
        TestPrep: ["SAT", "ACT", "GRE", "GMAT", "IELTS", "TOEFL", "MCAT", "LSAT", "AP Exams"],
        Music: ["Music Theory", "Instrumental", "Vocal", "Composition", "Music History"],
        Dance: ["Ballet", "Hip Hop", "Jazz", "Contemporary", "Tap"],
        Theater: ["Acting", "Directing", "Playwriting", "Stagecraft"],
        Film: ["Cinematography", "Editing", "Screenwriting", "Production"],
        Other: ["Life Skills", "Study Skills", "Test Taking Strategies"],
    }

    return suggestions[category] || []
}

