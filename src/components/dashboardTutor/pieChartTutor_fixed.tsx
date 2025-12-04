import {
   PieChart as RechartsPieChart,
   Pie,
   Cell,
   Legend,
   Tooltip,
   ResponsiveContainer,
   Sector,
} from "recharts";
import { PieChart as PieChartIcon, DollarSign, Layers } from "lucide-react";
import { translatePieData } from "@/utils/statusTranslations";

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
   const radius = innerRadius + (outerRadius - innerRadius) * 1.2; // Move labels further out
   const x = cx + radius * Math.cos(-midAngle * RADIAN);
   const y = cy + radius * Math.sin(-midAngle * RADIAN);
   const status = payload?.status || "Không xác định";
   const textColor = "#1f2937"; // Dark gray for better visibility
   const textSize = "0.75rem";

   return (
      <g>
         <text
            x={x}
            y={y}
            fill={textColor}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
               fontSize: textSize,
               fontWeight: 'bold',
               textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white', // White outline for contrast
            }}
         >
            {`${status}: ${value}`}
         </text>
      </g>
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

   // Translate statuses to Vietnamese
   const translatedSessions = translatePieData(sessionsByStatus, 'session');
   const translatedCommitments = translatePieData(learningCommitments, 'commitment');

   return (
      <div className="space-y-6">
         {/* Sessions by Status - Pie Chart with Gap & Rounded Corners */}
         <div className="bg-white p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg flex items-center gap-2">
               <PieChartIcon className="w-5 h-5 text-gray-500" />
               Tổng buổi học theo trạng thái
            </h4>
            {translatedSessions && translatedSessions.length > 0 && (
               <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer>
                     <RechartsPieChart>
                        <Tooltip 
                           formatter={(value: number, _name: string, props: any) => {
                              const total = translatedSessions.reduce((sum: number, item: any) => sum + item.value, 0);
                              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                              return [`${value} (${percentage}%)`, props.payload.status];
                           }}
                           labelFormatter={() => ''}
                        />
                        <Legend 
                           formatter={(value, entry: any, _index) => {
                              return entry.payload?.status || value;
                           }}
                        />
                        <Pie
                           data={translatedSessions}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={renderCustomLabelPosition}
                           outerRadius={100}
                           innerRadius={60}  // Creates a donut chart effect
                           paddingAngle={5}  // Adds gap between segments
                           cornerRadius={8}  // Rounds the corners of the segments
                           fill="#8884d8"
                           dataKey="value"
                           stroke="#fff"     // Adds a white border around segments
                           strokeWidth={1}   // Border width
                        >
                           {translatedSessions.map((_entry, index) => (
                              <Cell
                                 key={`cell-${index}`}
                                 fill={COLORS[index % COLORS.length]}
                              />
                           ))}
                        </Pie>
                     </RechartsPieChart>
                  </ResponsiveContainer>
               </div>
            )}
         </div>

         {/* Money Spent on Packages - Custom Active Shape */}
         <div className="bg-white p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg flex items-center gap-2">
               <DollarSign className="w-5 h-5 text-gray-500" />
               Tổng số tiền đã chi ra để mua gói học
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
                        <RechartsPieChart>
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
                        </RechartsPieChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            )}
         </div>

         {/* Learning Commitments - Pie Chart with Customized Label */}
         <div className="bg-white p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg flex items-center gap-2">
               <Layers className="w-5 h-5 text-gray-500" />
               Tổng cam kết học tập theo trạng thái
            </h4>
            {translatedCommitments && translatedCommitments.length > 0 && (
               <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer>
                     <RechartsPieChart>
                        <Tooltip 
                           formatter={(value: number, _name: string, props: any) => {
                              const total = translatedCommitments.reduce((sum: number, item: any) => sum + item.value, 0);
                              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                              return [`${value} (${percentage}%)`, props.payload.status];
                           }}
                           labelFormatter={() => ''}
                        />
                        <Legend 
                           formatter={(value, entry: any, _index) => {
                              return entry.payload?.status || value;
                           }}
                        />
                        <Pie
                           data={translatedCommitments}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={renderCustomLabelPosition}
                           outerRadius={100}
                           innerRadius={60}  // Creates a donut chart effect
                           paddingAngle={5}  // Adds gap between segments
                           cornerRadius={8}  // Rounds the corners of the segments
                           fill="#82ca9d"
                           dataKey="value"
                           stroke="#fff"     // Adds a white border around segments
                           strokeWidth={1}   // Border width
                        >
                           {translatedCommitments.map((_entry, index) => (
                              <Cell
                                 key={`cell-${index}`}
                                 fill={COLORS[index % COLORS.length]}
                              />
                           ))}
                        </Pie>
                     </RechartsPieChart>
                  </ResponsiveContainer>
               </div>
            )}
         </div>
      </div>
   );
}
