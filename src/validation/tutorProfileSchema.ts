import { z } from "zod";
import { SUBJECT_VALUES } from "@/enums/subject.enum";
import { LEVEL_VALUES } from "@/enums/level.enum";
import { CLASS_TYPE_VALUES } from "@/enums/classType.enum";
import { GENDER_VALUES } from "@/enums/gender.enum";
import { TIME_SLOT_VALUES } from "@/enums/timeSlot.enum";
import { CITY_TYPE_VALUES } from "@/enums/city.enum";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Helper schemas for nested objects
const addressSchema = z.object({
    city: z.enum(CITY_TYPE_VALUES as [string, ...string[]], {
        message: "Vui lòng chọn tỉnh/thành phố",
    }),
    street: z.string()
        .min(1, "Vui lòng nhập địa chỉ đường")
        .max(100, "Địa chỉ quá dài"),
}).optional();

const educationSchema = z.object({
    institution: z.string()
        .min(1, "Tên trường không được để trống")
        .max(70, "Tên trường quá dài"),
    degree: z.string()
        .min(1, "Vui lòng nhập bằng cấp")
        .max(50, "Tên bằng cấp quá dài"),
    fieldOfStudy: z.string()
        .min(1, "Vui lòng nhập ngành học")
        .max(50, "Tên ngành học quá dài"),
    startDate: z.string()
        .min(1, "Vui lòng nhập ngày bắt đầu"),
    endDate: z.string().optional(),
    description: z.string()
        .min(10, "Mô tả phải có ít nhất 10 ký tự")
        .max(500, "Mô tả quá dài"),
})
    .refine(
        data => {
            if (!data.startDate) return false;
            return !isNaN(new Date(data.startDate).getTime());
        },
        {
            message: "Ngày bắt đầu không hợp lệ",
            path: ["startDate"],
        }
    )
    .refine(
        data => {
            if (!data.endDate) return true;
            return !isNaN(new Date(data.endDate).getTime());
        },
        {
            message: "Ngày kết thúc không hợp lệ",
            path: ["endDate"],
        }
    )
    .refine(
        data => {
            if (!data.startDate) return false;
            const start = new Date(data.startDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return start <= today;
        },
        {
            message: "Ngày bắt đầu không thể ở tương lai",
            path: ["startDate"],
        }
    )
    .refine(
        data => {
            if (!data.startDate || !data.endDate) return true;
            return new Date(data.startDate) <= new Date(data.endDate);
        },
        {
            message: "Ngày bắt đầu phải trước ngày kết thúc",
            path: ["endDate"],
        }
    )
    .refine(
        data => {
            if (!data.startDate) return false;
            return new Date(data.startDate) >= new Date("1950-01-01");
        },
        {
            message: "Ngày bắt đầu quá xa trong quá khứ",
            path: ["startDate"],
        }
    );

const certificationSchema = z.object({
    name: z.string()
        .min(1, "Tên chứng chỉ không được để trống")
        .max(100, "Tên chứng chỉ quá dài"),
    description: z.string()
        .min(10, "Mô tả phải có ít nhất 10 ký tự")
        .max(300, "Mô tả quá dài"),
    imageUrl: z.string()
        .url("URL không hợp lệ")
        .optional()
        .or(z.literal("")),
});

const availabilitySchema = z.object({
    dayOfWeek: z.number()
        .min(0)
        .max(6, "Ngày trong tuần không hợp lệ"),
    slots: z.array(z.enum(TIME_SLOT_VALUES as [string, ...string[]])),
});

// Enums
const SubjectEnum = z.enum(SUBJECT_VALUES as [string, ...string[]]);
const LevelEnum = z.enum(LEVEL_VALUES as [string, ...string[]]);
const ClassTypeEnum = z.enum(CLASS_TYPE_VALUES as [string, ...string[]]);
const GenderEnum = z.enum(GENDER_VALUES as [string, ...string[]]);

// Main tutor profile schema
export const tutorProfileFormSchema = z.object({
    name: z.string()
        .min(2, "Tên phải có ít nhất 2 ký tự")
        .max(50, "Tên không được vượt quá 50 ký tự"),

    email: z.string()
        .email("Email không hợp lệ")
        .optional()
        .or(z.literal("")),

    phone: z.string()
        .regex(/^\+?[\d\s\-\(\)]{10,}$/, "Số điện thoại không hợp lệ"),

    gender: GenderEnum.optional(),

    avatarUrl: z.string()
        .url("URL ảnh không hợp lệ")
        .optional()
        .or(z.literal("")),

    address: addressSchema,

    experienceYears: z.number()
        .min(0, "Số năm kinh nghiệm không thể âm")
        .max(50, "Số năm kinh nghiệm quá lớn"),

    hourlyRate: z.number()
        .min(0, "Giá theo giờ không thể âm")
        .max(2000000, "Giá theo giờ quá cao"),

    bio: z.string()
        .min(50, "Tiểu sử phải có ít nhất 50 ký tự")
        .max(2000, "Tiểu sử quá dài"),

    classType: z.array(ClassTypeEnum)
        .min(1, "Vui lòng chọn ít nhất một hình thức dạy"),

    subjects: z.array(SubjectEnum)
        .min(1, "Vui lòng chọn ít nhất một môn dạy")
        .max(10, "Không thể chọn quá 10 môn"),

    levels: z.array(LevelEnum)
        .min(1, "Vui lòng chọn ít nhất một trình độ dạy")
        .max(10, "Không thể chọn quá 10 trình độ"),

    education: z.array(educationSchema)
        .min(1, "Vui lòng thêm ít nhất một mục học vấn")
        .max(5, "Tối đa 5 mục học vấn"),

    certifications: z.array(certificationSchema)
        .max(10, "Tối đa 10 chứng chỉ"),

    availability: z.array(availabilitySchema)
        .refine(a => a.some(item => item.slots && item.slots.length > 0), {
            message: "Vui lòng chọn ít nhất một khung giờ trống",
        }),
});

// Partial schema for edit form
export const tutorProfileEditSchema = tutorProfileFormSchema.partial();

// Types
export type TutorProfileFormData = z.infer<typeof tutorProfileFormSchema>;
export type TutorProfileEditData = z.infer<typeof tutorProfileEditSchema>;

// Validation helpers
export const validateTutorProfile = (data: unknown) => {
    return tutorProfileFormSchema.safeParse(data);
};

export const validateTutorProfileEdit = (data: unknown) => {
    return tutorProfileEditSchema.safeParse(data);
};

// Default values
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
