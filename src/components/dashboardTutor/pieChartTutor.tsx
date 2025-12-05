import {
   PieChart,
   Pie,
   Cell,
   Legend,
   Tooltip,
   ResponsiveContainer,
   Sector,
} from "recharts";
import { translatePieData } from "../../utils/statusTranslations";

type PieDataItem = {
   status: string;
   value: number;
};

type PieChartTutorProps = {
   sessionsByStatus?: PieDataItem[];
   moneySpent?: number;
   learningCommitments?: PieDataItem[];
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// Custom active shape for money spent pie chart
const renderActiveShape = (props: any) => {
   const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      value,
   } = props;
   const RADIAN = Math.PI / 180;
   const sin = Math.sin(-RADIAN * midAngle);
   const cos = Math.cos(-RADIAN * midAngle);
   const sx = cx + (outerRadius + 10) * cos;
   const sy = cy + (outerRadius + 10) * sin;
   const mx = cx + (outerRadius + 30) * cos;
   const my = cy + (outerRadius + 30) * sin;
   const ex = mx + (cos >= 0 ? 1 : -1) * 22;
   const ey = my;
   const textAnchor = cos >= 0 ? "start" : "end";

   return (
      <g>
         <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke="#8884d8"
            fill="none"
         />
         <circle cx={ex} cy={ey} r={4} fill="#8884d8" />
         <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            textAnchor={textAnchor}
            fill="#333"
            className="font-semibold"
         >{`${value.toLocaleString()} VNĐ`}</text>
         <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 10}
            startAngle={startAngle}
            endAngle={endAngle}
            fill="#8884d8"
         />
      </g>
   );
};

// Custom label component with positioning
const renderCustomLabelPosition = (props: any) => {
   const { cx, cy, midAngle, innerRadius, outerRadius, value, payload } = props;
   const RADIAN = Math.PI / 180;
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
   const x = cx + radius * Math.cos(-midAngle * RADIAN);
   const y = cy + radius * Math.sin(-midAngle * RADIAN);
   const status = payload?.status || "Unknown";

   return (
      <text
         x={x}
         y={y}
         fill="#333333"
         textAnchor={x > cx ? "start" : "end"}
         dominantBaseline="central"
         className="text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
      >
         {`${status} (${value})`}
      </text>
   );
};

// Add an any-aliased Pie to avoid strict Recharts prop typings
const AnyPie: any = Pie;

export default function PieChartTutor(props: PieChartTutorProps) {
   const {
      sessionsByStatus = [],
      moneySpent = 0,
      learningCommitments = [],
   } = props;

   const pieChartConfig = {
      gap: 3,
      cornerRadius: 8,
   };

   return (
      <div className="space-y-6">
         {/* Sessions by Status - Pie Chart with Gap & Rounded Corners */}
         <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg dark:text-white">
               Phiên học theo trạng thái
            </h4>
            {sessionsByStatus.length > 0 ? (
               <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer>
                     <PieChart>
                        <Tooltip
                           formatter={(value: any) => [
                              `${value} phiên`,
                              "Số lượng",
                           ]}
                           contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              border: "1px solid #ccc",
                           }}
                           itemStyle={{ color: "#333" }}
                        />
                        <Legend
                           formatter={(value) => {
                              const translated = translatePieData(
                                 [{ status: value, value: 0 }],
                                 "session"
                              );
                              return translated[0]?.status || value;
                           }}
                           wrapperStyle={{ color: "#333" }}
                           className="dark:text-gray-300"
                        />
                        <Pie
                           data={translatePieData(sessionsByStatus, "session")}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={({ status, value }: any) => {
                              return `${status}: ${value}`;
                           }}
                           outerRadius={100}
                           fill="#8884d8"
                           dataKey="value"
                           nameKey="status"
                           paddingAngle={pieChartConfig.gap}
                           cornerRadius={pieChartConfig.cornerRadius}
                        >
                           {sessionsByStatus.map((_, index) => (
                              <Cell
                                 key={`cell-${index}`}
                                 fill={COLORS[index % COLORS.length]}
                              />
                           ))}
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            ) : (
               <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No data available
               </div>
            )}
         </div>

         {/* Money Spent on Packages - Custom Active Shape */}
         <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg dark:text-white">
               Tổng tiền đã chi cho gói học
            </h4>
            <div className="flex items-center justify-center">
               <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                     {moneySpent.toLocaleString()}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">VNĐ</div>
               </div>
            </div>
            {moneySpent > 0 && (
               <div className="mt-6">
                  <div style={{ width: "100%", height: 300 }}>
                     <ResponsiveContainer>
                        <PieChart>
                           <AnyPie
                              data={[
                                 {
                                    name: "Money Spent",
                                    value: moneySpent,
                                 },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              activeIndex={0}
                              activeShape={renderActiveShape}
                           >
                              <Cell fill="#3b82f6" />
                           </AnyPie>
                           <Tooltip
                              formatter={(value: any) =>
                                 `${value.toLocaleString()} VNĐ`
                              }
                              contentStyle={{
                                 backgroundColor: "rgba(255, 255, 255, 0.8)",
                                 border: "1px solid #ccc",
                              }}
                              itemStyle={{ color: "#333" }}
                           />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            )}
         </div>

         {/* Learning Commitments - Pie Chart with Customized Label */}
         <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg dark:text-white">
               Cam kết học tập theo trạng thái
            </h4>
            {learningCommitments.length > 0 ? (
               <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer>
                     <PieChart>
                        <Tooltip
                           formatter={(value: any) => [
                              `${value} cam kết`,
                              "Số lượng",
                           ]}
                           contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.8)",
                              border: "1px solid #ccc",
                           }}
                           itemStyle={{ color: "#333" }}
                        />
                        <Legend
                           formatter={(value) => {
                              const translated = translatePieData(
                                 [{ status: value, value: 0 }],
                                 "commitment"
                              );
                              return translated[0]?.status || value;
                           }}
                           wrapperStyle={{ color: "#333" }}
                           className="dark:text-gray-300"
                        />
                        <Pie
                           data={translatePieData(
                              learningCommitments,
                              "commitment"
                           )}
                           cx="50%"
                           cy="50%"
                           labelLine={true}
                           label={(props: any) => {
                              const {
                                 cx,
                                 cy,
                                 midAngle,
                                 innerRadius,
                                 outerRadius,
                                 percent,
                                 index,
                                 ...rest
                              } = props;
                              if (!rest.payload?.status) return null;

                              const translatedData = translatePieData(
                                 [{ status: rest.payload.status, value: 0 }],
                                 "commitment"
                              );

                              return renderCustomLabelPosition({
                                 cx,
                                 cy,
                                 midAngle,
                                 innerRadius,
                                 outerRadius,
                                 value: rest.payload.value,
                                 payload: {
                                    ...rest.payload,
                                    status:
                                       translatedData[0]?.status ||
                                       rest.payload.status,
                                 },
                              });
                           }}
                           outerRadius={100}
                           fill="#8884d8"
                           dataKey="value"
                           nameKey="status"
                           paddingAngle={pieChartConfig.gap}
                           cornerRadius={pieChartConfig.cornerRadius}
                        >
                           {learningCommitments.map((_, index) => (
                              <Cell
                                 key={`cell-${index}`}
                                 fill={COLORS[index % COLORS.length]}
                              />
                           ))}
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            ) : (
               <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No data available
               </div>
            )}
         </div>
      </div>
   );
}
