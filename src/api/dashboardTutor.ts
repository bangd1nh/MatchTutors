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

export const fetchSessionStats = async (month?: number, year?: number) => {
   console.log("Fetching stats for month:", month, "year:", year);
   const params = new URLSearchParams();
   if (month) params.append("month", month.toString());
   if (year) params.append("year", year.toString());
   const res = await apiClient.get(
      `/dashboardTutor/stats-month-year?${params.toString()}`
   );

   return res.data?.data;
};
