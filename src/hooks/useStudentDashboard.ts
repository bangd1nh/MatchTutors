import { useQuery } from "@tanstack/react-query";
import { getStudentDashboard } from "@/api/studentDashboard";
import { StudentDashboardDTO } from "@/types/studentDashboard";

const queryKeys = {
    all: ["student-dashboard"] as const,
    summary: () => [...queryKeys.all, "summary"] as const,
};

export function useStudentDashboard() {
    return useQuery<StudentDashboardDTO>({
        queryKey: queryKeys.summary(),
        queryFn: () => getStudentDashboard(),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        refetchOnMount: "always",
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
    });
}