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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

   const formatLocalDate = (isoDate: string) => {
      try {
         const d = new Date(isoDate);
         return d.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
         });
      } catch {
         return isoDate;
      }
   };

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

   const bubblePoints =
      bubble?.days?.map((d, i) => ({
         x: i + 1,
         y: d.count || 0,
         z: d.count || 0,
         rawDate: d.date,
         labelShort: formatLocalDate(d.date),
         labelFull: fullLabel(d.date),
      })) || [];

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

   const linePalette = [
      "hsl(var(--primary))",
      "hsl(0 84% 60%)",
      "hsl(25 95% 53%)",
      "hsl(200 98% 39%)",
   ];

   return (
      <div className="space-y-6">
         <Card className="bg-card text-card-foreground border border-border shadow-sm">
            <CardHeader>
               <CardTitle className="flex items-center gap-2 text-lg font-medium">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  Số lượng buổi học hoàn thành theo ngày
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div style={{ width: "100%", height: 480 }}>
                  <ResponsiveContainer>
                     <ScatterChart
                        margin={{ top: 24, right: 20, bottom: 110, left: 40 }}
                     >
                        <CartesianGrid stroke="hsl(var(--border))" />
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
                           tick={{
                              fontSize: 13,
                              fill: "hsl(var(--foreground))",
                           }}
                           interval={0}
                           angle={-40}
                           textAnchor="end"
                           xAxisId={0}
                           height={100}
                        />
                        <YAxis
                           ticks={ticks}
                           domain={[0, top]}
                           tick={{
                              fontSize: 14,
                              fill: "hsl(var(--foreground))",
                           }}
                           label={{
                              value: "Số lượng",
                              angle: -90,
                              position: "insideLeft",
                              offset: -10,
                              style: {
                                 fontSize: 14,
                                 fill: "hsl(var(--foreground))",
                              },
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
                              return (
                                 bubblePoints[idx]?.labelFull || String(label)
                              );
                           }}
                           wrapperStyle={{
                              zIndex: 1000,
                              fontSize: 13,
                              background: "hsl(var(--popover))",
                              color: "hsl(var(--popover-foreground))",
                              border: "1px solid hsl(var(--border))",
                              boxShadow: "0 8px 24px hsla(0,0%,0%,0.15)",
                           }}
                        />
                        <Scatter
                           dataKey="z"
                           data={bubblePoints}
                           fill="hsl(var(--primary))"
                        />
                     </ScatterChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         <Card className="bg-card text-card-foreground border border-border shadow-sm">
            <CardHeader>
               <CardTitle className="flex items-center gap-2 text-lg font-medium">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  Số lượng buổi học theo các trạng thái theo ngày
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div style={{ width: "100%", height: 480 }}>
                  <ResponsiveContainer>
                     <LineChart
                        data={sessionDays}
                        margin={{ bottom: 100, left: 40 }}
                     >
                        <CartesianGrid stroke="hsl(var(--border))" />
                        <XAxis
                           dataKey="dateLabel"
                           tick={{
                              fontSize: 13,
                              fill: "hsl(var(--foreground))",
                           }}
                           interval={0}
                           height={100}
                        />
                        <YAxis
                           ticks={ticks}
                           domain={[0, top]}
                           tick={{
                              fontSize: 14,
                              fill: "hsl(var(--foreground))",
                           }}
                           label={{
                              value: "Số lượng",
                              angle: -90,
                              position: "insideLeft",
                              offset: -10,
                              style: {
                                 fontSize: 14,
                                 fill: "hsl(var(--foreground))",
                              },
                           }}
                           width={70}
                        />
                        <Tooltip
                           formatter={(value: number, name: string) => [
                              value,
                              getSessionStatusLabel(name),
                           ]}
                           labelFormatter={(label) => label}
                           wrapperStyle={{
                              zIndex: 1000,
                              fontSize: 13,
                              background: "hsl(var(--popover))",
                              color: "hsl(var(--popover-foreground))",
                              border: "1px solid hsl(var(--border))",
                              boxShadow: "0 8px 24px hsla(0,0%,0%,0.15)",
                           }}
                        />
                        <Legend
                           wrapperStyle={{
                              color: "hsl(var(--foreground))",
                           }}
                        />
                        {(sessions?.statuses || []).map((s, idx) => (
                           <Line
                              key={s}
                              name={getSessionStatusLabel(s)}
                              type="monotone"
                              dataKey={s}
                              stroke={linePalette[idx % linePalette.length]}
                              strokeWidth={3}
                              dot={{ r: 2 }}
                              activeDot={{ r: 4 }}
                           />
                        ))}
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
