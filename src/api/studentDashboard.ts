// api/studentDashboard.ts
import { StudentDashboardDTO } from "@/types/studentDashboard";
import apiClient from "@/lib/api";

interface BackendApiResponse<T> {
    status: string;
    message: string;
    code: number;
    data: T;  // Backend uses 'data' instead of 'metadata'
}

export const getStudentDashboard = async (): Promise<StudentDashboardDTO> => {
    const res = await apiClient.get<BackendApiResponse<StudentDashboardDTO>>("/studentProfile/dashboard");
    return res.data.data;
};