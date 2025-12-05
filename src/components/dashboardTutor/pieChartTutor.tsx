import {
   PieChart,
   Pie,
   Cell,
   Legend,
   Tooltip,
   ResponsiveContainer,
   Sector,
} from "recharts";

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
         fill="white"
         textAnchor={x > cx ? "start" : "end"}
         dominantBaseline="central"
         className="text-xs font-semibold"
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
         <div className="bg-white p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg">Sessions by Status</h4>
            {sessionsByStatus.length > 0 ? (
               <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer>
                     <PieChart>
                        <Tooltip
                           formatter={(value: any) => [
                              `${value} sessions`,
                              "Count",
                           ]}
                        />
                        <Legend />
                        <Pie
                           data={sessionsByStatus}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={({ status, value }: any) =>
                              `${status}: ${value}`
                           }
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
               <div className="h-96 flex items-center justify-center text-gray-500">
                  No data available
               </div>
            )}
         </div>

         {/* Money Spent on Packages - Custom Active Shape */}
         <div className="bg-white p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg">
               Total Money Spent on Packages
            </h4>
            <div className="flex items-center justify-center">
               <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                     {moneySpent.toLocaleString()}
                  </div>
                  <div className="text-gray-600">VNĐ</div>
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
                           />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            )}
         </div>

         {/* Learning Commitments - Pie Chart with Customized Label */}
         <div className="bg-white p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg">
               Learning Commitments by Status
            </h4>
            {learningCommitments.length > 0 ? (
               <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer>
                     <PieChart>
                        <Tooltip
                           formatter={(value: any) => [
                              `${value} commitments`,
                              "Count",
                           ]}
                        />
                        <Legend />
                        <Pie
                           data={learningCommitments}
                           cx="50%"
                           cy="50%"
                           labelLine={true}
                           label={renderCustomLabelPosition}
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
               <div className="h-96 flex items-center justify-center text-gray-500">
                  No data available
               </div>
            )}
         </div>
      </div>
   );
}
