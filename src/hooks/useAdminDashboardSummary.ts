import { useQuery } from "@tanstack/react-query";
import { AdminDashboardSummaryResponse, getAdminDashboardSummary } from "@/api/adminDashboard";

const queryKeys = {
  all: ["admin-dashboard", "summary"] as const,
};

export function useAdminDashboardSummary() {
  return useQuery<AdminDashboardSummaryResponse>({
    queryKey: queryKeys.all,
    queryFn: () => getAdminDashboardSummary(),
    staleTime: 1000 * 60, // 1 minute cache
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
}
