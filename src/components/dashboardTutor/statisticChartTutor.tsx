import {
   ResponsiveContainer,
   RadarChart,
   PolarGrid,
   PolarAngleAxis,
   PolarRadiusAxis,
   Radar,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
} from "recharts";
import { Activity, TrendingUp } from "lucide-react";
import { getSubjectLabelVi, getLevelLabelVi } from "@/utils/educationDisplay";

type SubjectAnalysisItem = {
   subject: string;
   offered: number;
   requests: number;
};

type LevelDistributionItem = {
   level: string;
   count: number;
};

export default function StatisticChartTutor(props: {
   subjectAnalysis?: SubjectAnalysisItem[] | null;
   levelDistribution?: LevelDistributionItem[] | null;
}) {
   const { subjectAnalysis, levelDistribution } = props;

   // Transform data with Vietnamese labels
   const translatedSubjectAnalysis =
      subjectAnalysis?.map((item) => ({
         ...item,
         subjectLabel: getSubjectLabelVi(item.subject),
      })) || [];

   const translatedLevelDistribution =
      levelDistribution?.map((item) => ({
         ...item,
         levelLabel: getLevelLabelVi(item.level),
      })) || [];

   return (
      <div className="space-y-6">
         <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg flex items-center gap-2 dark:text-white">
               <Activity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
               Phân tích môn học (Được mời vs. Yêu cầu)
            </h4>
            <div style={{ width: "100%", height: 480 }}>
               <ResponsiveContainer>
                  <RadarChart
                     cx="50%"
                     cy="50%"
                     outerRadius="80%"
                     data={translatedSubjectAnalysis}
                  >
                     <PolarGrid />
                     <PolarAngleAxis dataKey="subjectLabel" />
                     <PolarRadiusAxis />
                     <Tooltip />
                     <Legend />
                     <Radar
                        name="Môn học gia sư dạy"
                        dataKey="offered"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                     />
                     <Radar
                        name="Yêu cầu nhận được"
                        dataKey="requests"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.6}
                     />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg flex items-center gap-2 dark:text-white">
               <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
               Phân bổ cấp độ học sinh đang dạy
            </h4>
            <div style={{ width: "100%", height: 480 }}>
               <ResponsiveContainer>
                  <BarChart
                     data={translatedLevelDistribution}
                     margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                     }}
                  >
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis dataKey="levelLabel" />
                     <YAxis allowDecimals={false} />
                     <Tooltip />
                     <Legend />
                     <Bar
                        dataKey="count"
                        fill="#8884d8"
                        name="Số lượng học sinh"
                     />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
   );
}
