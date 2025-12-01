import apiClient from "@/lib/api";

export const fetchDashboardOverview = async () => {
   const res = await apiClient.get("/dashboardTutor/");
   return res.data?.data;
};

export const fetchDashboardCharts = async (params?: {
   month?: number;
   year?: number;
   week?: number;
}) => {
   const res = await apiClient.get("/dashboardTutor/charts", { params });
   return res.data?.data;
};

export const fetchDashboardPieData = async () => {
   const res = await apiClient.get("/dashboardTutor/pie");
   return res.data?.data;
};
