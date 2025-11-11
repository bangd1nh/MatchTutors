import { z } from "zod";
import { SUBJECT_VALUES } from "@/enums/subject.enum";
import { LEVEL_VALUES } from "@/enums/level.enum";
import { CLASS_TYPE_VALUES } from "@/enums/classType.enum";
import { GENDER_VALUES } from "@/enums/gender.enum";
import { TIME_SLOT_VALUES } from "@/enums/timeSlot.enum";
import { CITY_TYPE_VALUES } from "@/enums/city.enum";


const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// Helper schemas for nested objects
const addressSchema = z.object({
    city: z.enum(CITY_TYPE_VALUES as [string, ...string[]], {
        message: "City is required",
    }),
    street: z.string().min(1, "Street address is required").max(100, "Street address too long"),
}).optional();

const educationSchema = z.object({
    institution: z.string().min(1, "Institution is required").max(70, "Institution name too long"),
    degree: z.string().min(1, "Degree is required").max(50, "Degree name too long"),
    fieldOfStudy: z.string().max(50, "Field of study too long").min(1, "Field of study is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().max(500, "Description too long").min(10, "Description must be at least 10 characters"),
})
    .refine(
        (data) => {
            // DATE VALIDATION 1: Check if start date is valid
            if (!data.startDate) return false;
            const startDate = new Date(data.startDate);
            return !isNaN(startDate.getTime());
        },
        {
            message: "Invalid start date",
            path: ["startDate"],
        }
    )
    .refine(
        (data) => {
            // DATE VALIDATION 2: Check if end date is valid when provided
            if (!data.endDate) return true; // End date is optional
            const endDate = new Date(data.endDate);
            return !isNaN(endDate.getTime());
        },
        {
            message: "Invalid end date",
            path: ["endDate"],
        }
    )
    .refine(
        (data) => {
            // DATE VALIDATION 3: Start date should not be in the future
            if (!data.startDate) return false;
            const startDate = new Date(data.startDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Compare only dates, not times
            return startDate <= today;
        },
        {
            message: "Start date cannot be in the future",
            path: ["startDate"],
        }
    )
    .refine(
        (data) => {
            // DATE VALIDATION 4: Start date should be before end date (if both provided)
            if (!data.startDate || !data.endDate) return true;
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);
            return startDate <= endDate;
        },
        {
            message: "Start date must be before end date",
            path: ["endDate"],
        }
    )
    .refine(
        (data) => {
            // DATE VALIDATION 5: Start date should be reasonable (not before 1950)
            if (!data.startDate) return false;
            const startDate = new Date(data.startDate);
            const minDate = new Date("1950-01-01");
            return startDate >= minDate;
        },
        {
            message: "Start date seems too far in the past",
            path: ["startDate"],
        }
    );

const certificationSchema = z.object({
    name: z.string().min(1, "Certification name is required").max(100, "Name too long"),
    description: z.string().max(300, "Description too long").min(10, "Description must be at least 10 characters"),
    imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const availabilitySchema = z.object({
    dayOfWeek: z.number().min(0).max(6, "Invalid day of week"),
    slots: z.array(z.enum(TIME_SLOT_VALUES as [string, ...string[]])),
});

// Zod enums from your TypeScript enums
const SubjectEnum = z.enum(SUBJECT_VALUES as [string, ...string[]]);
const LevelEnum = z.enum(LEVEL_VALUES as [string, ...string[]]);
const ClassTypeEnum = z.enum(CLASS_TYPE_VALUES as [string, ...string[]]);
const GenderEnum = z.enum(GENDER_VALUES as [string, ...string[]]);

// Main tutor profile schema for frontend form validation
export const tutorProfileFormSchema = z.object({
    // Personal information
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    email: z.string()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
    phone: z.string()
        .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Please enter a valid phone number"),
    gender: GenderEnum.optional(),
    avatarUrl: z.string().url("Invalid URL").optional().or(z.literal("")),

    // Address
    address: addressSchema,

    // Teaching information
    experienceYears: z.number()
        .min(0, "Experience cannot be negative")
        .max(50, "Experience seems too high")
        .default(0),
    hourlyRate: z.number()
        .min(0, "Hourly rate cannot be negative")
        .max(2000000, "Hourly rate seems too high")
        .default(0),
    bio: z.string()
        .min(50, "Bio must be at least 50 characters")
        .max(2000, "Bio must not exceed 2000 characters")
        .default(""),
    classType: z.array(ClassTypeEnum)
        .min(1, "At least one class type is required"),

    // Subjects and levels
    subjects: z.array(SubjectEnum)
        .min(1, "At least one subject is required")
        .max(10, "Maximum 10 subjects allowed"),
    levels: z.array(LevelEnum)
        .min(1, "At least one level is required")
        .max(10, "Maximum 10 levels allowed"),

    // Education
    education: z.array(educationSchema)
        .min(1, "At least one education entry is required")
        .max(5, "Maximum 5 education entries allowed"),

    // Certifications
    certifications: z.array(certificationSchema)
        .max(10, "Maximum 10 certifications allowed")
        .default([]),

    // Availability
    availability: z.array(availabilitySchema)
        .refine(avails => avails.some(a => a.slots && a.slots.length > 0), {
            message: "Select at least one time slot",
        })
});

// Partial schema for edit form (all fields optional)
export const tutorProfileEditSchema = tutorProfileFormSchema.partial();

// Type inference
export type TutorProfileFormData = z.infer<typeof tutorProfileFormSchema>;
export type TutorProfileEditData = z.infer<typeof tutorProfileEditSchema>;

// Validation functions
export const validateTutorProfile = (data: unknown) => {
    return tutorProfileFormSchema.safeParse(data);
};

export const validateTutorProfileEdit = (data: unknown) => {
    return tutorProfileEditSchema.safeParse(data);
};

// Helper function to get default form values
export const getDefaultTutorFormValues = (): TutorProfileFormData => ({
    name: "",
    email: "",
    phone: "",
    gender: undefined,
    avatarUrl: "",
    address: {
        city: "",
        street: "",
    },
    experienceYears: 0,
    hourlyRate: 0,
    bio: "",
    classType: [],
    subjects: [],
    levels: [],
    education: [{
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
    }],
    certifications: [],
    availability: DAYS.map((_, index) => ({
        dayOfWeek: index,
        slots: [],
    })),
});