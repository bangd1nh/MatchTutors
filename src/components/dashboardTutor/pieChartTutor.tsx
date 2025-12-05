import {
   PieChart,
   Pie,
   Cell,
   Legend,
   Tooltip,
   ResponsiveContainer,
   Sector,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type PieDataItem = {
   status: string;
   value: number;
};

type PieChartTutorProps = {
   sessionsByStatus?: PieDataItem[];
   moneySpent?: number;
   learningCommitments?: PieDataItem[];
};

const COLORS = [
   "hsl(var(--primary))",
   "hsl(152 76% 40%)", // green tone
   "hsl(25 95% 53%)", // orange
   "hsl(0 84% 60%)", // red
   "hsl(262 83% 58%)", // purple
];

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

   const accent = "hsl(var(--accent))";
   const fg = "hsl(var(--foreground))";

   return (
      <g>
         <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={accent}
            fill="none"
         />
         <circle cx={ex} cy={ey} r={4} fill={accent} />
         <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            textAnchor={textAnchor}
            fill={fg}
            className="font-semibold"
         >
            {`${value.toLocaleString()} VNĐ`}
         </text>
         <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 10}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={accent}
         />
      </g>
   );
};

// Custom label positioned inside slices
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
         fill="hsl(var(--primary-foreground))"
         textAnchor={x > cx ? "start" : "end"}
         dominantBaseline="central"
         className="text-xs font-semibold"
      >
         {`${status} (${value})`}
      </text>
   );
};

// Any-aliased Pie to bypass strict Recharts typing
const AnyPie: any = Pie;

export default function PieChartTutor(props: PieChartTutorProps) {
   const {
      sessionsByStatus = [],
      moneySpent = 0,
      learningCommitments = [],
   } = props;

   const pieChartConfig = { gap: 3, cornerRadius: 8 };

   const tooltipStyle = {
      zIndex: 1000,
      fontSize: 13,
      background: "hsl(var(--popover))",
      color: "hsl(var(--popover-foreground))",
      border: "1px solid hsl(var(--border))",
      boxShadow: "0 8px 24px hsla(0,0%,0%,0.15)",
   };

   return (
      <div className="space-y-6">
         {/* Sessions by Status */}
         <Card className="bg-card text-card-foreground border border-border shadow-sm">
            <CardHeader>
               <CardTitle className="font-medium text-lg">
                  Sessions by Status
               </CardTitle>
            </CardHeader>
            <CardContent>
               {sessionsByStatus.length > 0 ? (
                  <div style={{ width: "100%", height: 400 }}>
                     <ResponsiveContainer>
                        <PieChart>
                           <Tooltip
                              formatter={(value: any) => [
                                 `${value} sessions`,
                                 "Count",
                              ]}
                              wrapperStyle={tooltipStyle}
                           />
                           <Legend
                              wrapperStyle={{
                                 color: "hsl(var(--foreground))",
                              }}
                           />
                           <Pie
                              data={sessionsByStatus}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ status, value }: any) =>
                                 `${status}: ${value}`
                              }
                              outerRadius={100}
                              fill="hsl(var(--primary))"
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
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                     No data available
                  </div>
               )}
            </CardContent>
         </Card>

         {/* Money Spent */}
         <Card className="bg-card text-card-foreground border border-border shadow-sm">
            <CardHeader>
               <CardTitle className="font-medium text-lg">
                  Total Money Spent on Packages
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center">
                  <div className="text-center">
                     <div className="text-5xl font-bold text-primary mb-2">
                        {moneySpent.toLocaleString()}
                     </div>
                     <div className="text-muted-foreground">VNĐ</div>
                  </div>
               </div>
               {moneySpent > 0 && (
                  <div className="mt-6" style={{ width: "100%", height: 300 }}>
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
                              fill="hsl(var(--accent))"
                              dataKey="value"
                              activeIndex={0}
                              activeShape={renderActiveShape}
                           >
                              <Cell fill="hsl(var(--primary))" />
                           </AnyPie>
                           <Tooltip
                              formatter={(value: any) =>
                                 `${value.toLocaleString()} VNĐ`
                              }
                              wrapperStyle={tooltipStyle}
                           />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
               )}
            </CardContent>
         </Card>

         {/* Learning Commitments */}
         <Card className="bg-card text-card-foreground border border-border shadow-sm">
            <CardHeader>
               <CardTitle className="font-medium text-lg">
                  Learning Commitments by Status
               </CardTitle>
            </CardHeader>
            <CardContent>
               {learningCommitments.length > 0 ? (
                  <div style={{ width: "100%", height: 400 }}>
                     <ResponsiveContainer>
                        <PieChart>
                           <Tooltip
                              formatter={(value: any) => [
                                 `${value} commitments`,
                                 "Count",
                              ]}
                              wrapperStyle={tooltipStyle}
                           />
                           <Legend
                              wrapperStyle={{
                                 color: "hsl(var(--foreground))",
                              }}
                           />
                           <Pie
                              data={learningCommitments}
                              cx="50%"
                              cy="50%"
                              labelLine
                              label={renderCustomLabelPosition}
                              outerRadius={100}
                              fill="hsl(var(--primary))"
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
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                     No data available
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
