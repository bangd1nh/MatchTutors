import { useQuery } from "@tanstack/react-query";
import {
    getTutors,
    getApprovedTutors,
    getTutorById,
} from "@/api/tutor";

// 🔹 All tutors
export const useTutors = () =>
    useQuery({
        queryKey: ["tutors"],
        queryFn: getTutors,
    });

// 🔹 Approved tutors
export const useApprovedTutors = () =>
    useQuery({
        queryKey: ["tutors", "approved"],
        queryFn: getApprovedTutors,
    });

// 🔹 Tutor by ID
export const useTutor = (id: string) =>
    useQuery({
        queryKey: ["tutor", id],
        queryFn: () => getTutorById(id),
        enabled: !!id,
    });

