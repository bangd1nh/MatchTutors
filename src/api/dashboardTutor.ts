import apiClient from "@/lib/api";

export const fetchDashboardOverview = async () => {
   const res = await apiClient.get("/dashboardTutor/");
   return res.data?.data;
};

export const fetchDashboardCharts = async () => {
   const res = await apiClient.get("/dashboardTutor/analysis-charts");
   return res.data?.data;
};

export const fetchDashboardPieData = async () => {
   const res = await apiClient.get("/dashboardTutor/pie");
   return res.data?.data;
};
