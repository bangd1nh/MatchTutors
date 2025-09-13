import apiClient from "@/lib/api";
import { Tutor } from "@/types/Tutor";
import dayjs from "dayjs";
function formatSubject(subject: string) {
    return subject
        .toLowerCase()            // "computer_science"
        .split("_")               // ["computer", "science"]
        .map(s => s.charAt(0).toUpperCase() + s.slice(1)) // ["Computer", "Science"]
        .join(" ");               // "Computer Science"
}

function formatEducationDate(date: string | Date | null | undefined): string {
    if (!date) return "";
    return dayjs(date).format("YYYY-MM");
}


function mapTutor(apiTutor: any): Tutor {
    return {
        _id: apiTutor._id,
        userId: apiTutor.userId._id,
        fullName: apiTutor.userId?.name,
        avatarUrl: apiTutor.userId?.avatarUrl,
        gender: apiTutor.userId?.gender.charAt(0).toUpperCase() + apiTutor.userId?.gender.slice(1).toLowerCase(),
        address: {
            city: apiTutor.userId.address?.city,
            street: apiTutor.userId.address?.street,
            lat: apiTutor.userId.address?.lat,
            lng: apiTutor.userId.address?.lng,
        },
        certifications: apiTutor.certifications ?? [],
        experienceYears: apiTutor.experienceYears,
        hourlyRate: apiTutor.hourlyRate,
        education: (apiTutor.education ?? []).map((edu: any) => ({
            degree: edu.degree,
            institution: edu.institution,
            fieldOfStudy: edu.fieldOfStudy,
            dateRange: {
                startDate: formatEducationDate(edu.startDate),
                endDate: formatEducationDate(edu.endDate),
            },
            description: edu.description,
        })),
        subjects: (apiTutor.subjects ?? []).map(formatSubject),
        availability: (apiTutor.availability ?? []).map((slot: any) => ({
            dayOfWeek: slot.dayOfWeek,
            slots: slot.slots,
        })),
        contact: {
            phone: apiTutor.userId?.phone,
            email: apiTutor.userId?.email,
        },
        isApproved: apiTutor.isApproved,
        ratings: apiTutor.ratings,
        createdAt: apiTutor.createdAt,
        updatedAt: apiTutor.updatedAt,
        bio: apiTutor.bio,
        classType: apiTutor.classType,
        levels: apiTutor.levels ?? [],
    };
}

// ✅ Get all tutors
export const getTutors = async (): Promise<Tutor[]> => {
    const response = await apiClient.get("/tutor");
    return (response.data?.data || []).map(mapTutor);
};

// ✅ Get only approved tutors
export const getApprovedTutors = async (): Promise<Tutor[]> => {
    const response = await apiClient.get("/tutor/approved");
    return (response.data?.data || []).map(mapTutor);
};

// ✅ Get tutor by ID
export const getTutorById = async (id: string): Promise<Tutor | null> => {
    const response = await apiClient.get(`/tutor/${id}`);
    console.log('Tutor API Response:', response.data?.data);
    return response.data?.data ? mapTutor(response.data.data) : null;
};

// ✅ Get my tutor profile
export const getMyTutorProfile = async (): Promise<Tutor | null> => {
    const response = await apiClient.get("/tutor/me");
    return response.data?.data ? mapTutor(response.data.data) : null;
};

// ✅ Create tutor profile
export const createTutorProfile = async (payload: FormData): Promise<Tutor> => {
    const response = await apiClient.post("/tutor/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return mapTutor(response.data?.data);
};

// ✅ Update tutor profile
export const updateTutorProfile = async (payload: FormData): Promise<Tutor> => {
    const response = await apiClient.patch("/tutor/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return mapTutor(response.data?.data);
};

// ✅ Delete a certification image
export const deleteCertificationImage = async (
    certIndex: number,
    imageIndex: number
): Promise<Tutor> => {
    const response = await apiClient.delete(
        `/tutor/certifications/${certIndex}/images/${imageIndex}`
    );
    return mapTutor(response.data?.data);
};
