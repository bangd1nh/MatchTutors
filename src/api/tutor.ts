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

// ✅ Get my tutor profile
export const getMyTutorProfile = async (): Promise<Tutor | null> => {
    const response = await apiClient.get("/tutor/me");
    return response.data?.data ? response.data.data : null;
};

// ✅ Create tutor profile
export const createTutorProfile = async (payload: FormData): Promise<Tutor> => {
    const response = await apiClient.post("/tutor/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data;
};

// ✅ Update tutor profile
export const updateTutorProfile = async (payload: FormData): Promise<Tutor> => {
    const response = await apiClient.patch("/tutor/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data;
};

// ✅ Delete a certification image
export const deleteCertificationImage = async (
    certIndex: number,
    imageIndex: number
): Promise<Tutor> => {
    const response = await apiClient.delete(
        `/tutor/certifications/${certIndex}/images/${imageIndex}`
    );
    return response.data?.data;
};
