import { useQuery } from "@tanstack/react-query";
import {
   fetchDashboardOverview,
   fetchDashboardCharts,
   fetchDashboardPieData,
} from "@/api/dashboardTutor";

export const useFetchDashboardOverview = () => {
   return useQuery({
      queryKey: ["TUTOR_OVERVIEW"],
      queryFn: fetchDashboardOverview,
      staleTime: 1000 * 60 * 2,
      throwOnError: true,
   });
};

export const useFetchDashboardCharts = (opts?: { enabled?: boolean }) => {
   return useQuery({
      queryKey: ["TUTOR_CHARTS", opts],
      queryFn: () => fetchDashboardCharts(),
      enabled: opts?.enabled ?? true,
      staleTime: 1000 * 60 * 2,
      throwOnError: true,
   });
};

export const useFetchDashboardPieData = () => {
   return useQuery({
      queryKey: ["TUTOR_PIE_DATA"],
      queryFn: fetchDashboardPieData,
      staleTime: 1000 * 60 * 2,
      throwOnError: true,
   });
};
