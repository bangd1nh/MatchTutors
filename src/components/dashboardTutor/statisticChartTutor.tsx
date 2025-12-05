import {
   ResponsiveContainer,
   ScatterChart,
   Scatter,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   LineChart,
   Line,
   Legend,
} from "recharts";
import { Activity, TrendingUp } from "lucide-react";
import { getSessionStatusLabel } from "@/utils/session-status-translation";

type DayItem = {
   date: string;
   label?: string;
   count?: number;
   total?: number;
   counts?: Record<string, number>;
   percents?: Record<string, number>;
};

type BubbleDataIn = { days: DayItem[]; range?: any };
type SessionsDataIn = { statuses: string[]; days: DayItem[]; range?: any };

export default function StatisticChartTutor(props: {
   bubble?: BubbleDataIn | null;
   sessions?: SessionsDataIn | null;
}) {
   const { bubble, sessions } = props;

   // helper to format ISO date string to local date display
   const formatLocalDate = (isoDate: string) => {
      try {
         const d = new Date(isoDate);
         // Use toLocaleDateString to respect user's local timezone
         const dateStr = d.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
         });
         return dateStr;
      } catch {
         return isoDate;
      }
   };

   // helper to build full weekday + date label in user's local timezone
   const fullLabel = (isoDate: string) => {
      try {
         const d = new Date(isoDate);
         const weekday = d.toLocaleDateString("vi-VN", { weekday: "long" });
         const dateStr = formatLocalDate(isoDate);
         return `${weekday} ${dateStr}`;
      } catch {
         return isoDate;
      }
   };

   // bubble -> transform into points
   const bubblePoints =
      bubble?.days?.map((d, i) => ({
         x: i + 1,
         y: d.count || 0,
         z: d.count || 0,
         rawDate: d.date,
         labelShort: formatLocalDate(d.date),
         labelFull: fullLabel(d.date),
      })) || [];

   // sessions line: array with local dates
   const sessionDays =
      sessions?.days?.map((d) => {
         const obj: any = { rawDate: d.date, dateLabel: fullLabel(d.date) };
         (sessions.statuses || []).forEach((s) => {
            obj[s] = d.counts?.[s] ?? 0;
         });
         return obj;
      }) || [];

   const top = 10;
   const ticks = [0, 2, 4, 6, 8, 10];

   return (
      <div className="space-y-6">
         <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg flex items-center gap-2 dark:text-white">
               <Activity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
               Số lượng buổi học hoàn thành theo ngày
            </h4>
            <div style={{ width: "100%", height: 480 }}>
               <ResponsiveContainer>
                  <ScatterChart
                     margin={{ top: 24, right: 20, bottom: 110, left: 40 }}
                  >
                     <CartesianGrid
                        stroke="#e6e6e6"
                        strokeDasharray="3 3"
                        className="dark:stroke-gray-700"
                     />
                     <XAxis
                        dataKey="x"
                        name="day"
                        ticks={bubblePoints.map((p) => p.x)}
                        tickFormatter={(v) => {
                           const idx = Number(v) - 1;
                           return bubblePoints[idx]?.labelShort || String(v);
                        }}
                        type="number"
                        allowDecimals={false}
                        domain={[1, 7]}
                        tick={{ fontSize: 13, fill: "#6b7280" }}
                        className="dark:fill-gray-400"
                        interval={0}
                        angle={-40}
                        textAnchor="end"
                        xAxisId={0}
                        height={100}
                     />
                     <YAxis
                        ticks={ticks}
                        domain={[0, top]}
                        tick={{ fontSize: 14, fill: "#6b7280" }}
                        className="dark:fill-gray-400"
                        label={{
                           value: "Số lượng",
                           angle: -90,
                           position: "insideLeft",
                           offset: -10,
                           style: { fontSize: 14, fill: "#6b7280" },
                           className: "dark:fill-gray-400",
                        }}
                        width={70}
                     />
                     <Tooltip
                        formatter={(value: any, name: any) => [
                           value,
                           name === "day" ? "ngày" : name,
                        ]}
                        labelFormatter={(label) => {
                           const idx = Number(label) - 1;
                           return bubblePoints[idx]?.labelFull || String(label);
                        }}
                        wrapperStyle={{ zIndex: 1000, fontSize: 13 }}
                        contentStyle={{
                           backgroundColor: "rgba(255, 255, 255, 0.8)",
                           border: "1px solid #ccc",
                        }}
                        itemStyle={{ color: "#333" }}
                        labelStyle={{ color: "#333", fontWeight: "bold" }}
                     />
                     <Scatter dataKey="z" data={bubblePoints} fill="#7c3aed" />
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h4 className="font-medium mb-4 text-lg flex items-center gap-2 dark:text-white">
               <TrendingUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
               Số lượng buổi học theo các trạng thái theo ngày
            </h4>
            <div style={{ width: "100%", height: 480 }}>
               <ResponsiveContainer>
                  <LineChart
                     data={sessionDays}
                     margin={{ bottom: 100, left: 40 }}
                  >
                     <CartesianGrid
                        stroke="#e6e6e6"
                        strokeDasharray="3 3"
                        className="dark:stroke-gray-700"
                     />
                     <XAxis
                        dataKey="dateLabel"
                        tick={{ fontSize: 13, fill: "#6b7280" }}
                        className="dark:fill-gray-400"
                        interval={0}
                        height={100}
                     />
                     <YAxis
                        ticks={ticks}
                        domain={[0, top]}
                        tick={{ fontSize: 14, fill: "#6b7280" }}
                        className="dark:fill-gray-400"
                        label={{
                           value: "Số lượng",
                           angle: -90,
                           position: "insideLeft",
                           offset: -10,
                           style: { fontSize: 14, fill: "#6b7280" },
                           className: "dark:fill-gray-400",
                        }}
                        width={70}
                     />
                     <Tooltip
                        formatter={(value: number, name: string) => [
                           value,
                           getSessionStatusLabel(name),
                        ]}
                        labelFormatter={(label) => label}
                        contentStyle={{
                           backgroundColor: "rgba(255, 255, 255, 0.8)",
                           border: "1px solid #ccc",
                        }}
                        itemStyle={{ color: "#333" }}
                        labelStyle={{ color: "#333", fontWeight: "bold" }}
                     />
                     <Legend wrapperStyle={{ color: "#333" }} />
                     {(sessions?.statuses || []).map((s, idx) => (
                        <Line
                           key={s}
                           name={getSessionStatusLabel(s)}
                           type="monotone"
                           dataKey={s}
                           stroke={["#8884d8", "#ff7300"][idx % 2]}
                           strokeWidth={3}
                        />
                     ))}
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
   );
}
