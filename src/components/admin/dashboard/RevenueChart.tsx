import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export interface RevenueChartPoint {
  date: string;
  amount: number;
}

export default function RevenueChart({ data, days }: { data: RevenueChartPoint[]; days: number }) {
  const chartData = useMemo(() => {
    return (data ?? []).map((item) => {
      const parsedDate = new Date(item.date);
      const label = Number.isNaN(parsedDate.getTime())
        ? item.date
        : parsedDate.toLocaleDateString("vi-VN", { month: "short", day: "numeric" });
      const amount = typeof item.amount === "number" ? item.amount : Number(item.amount ?? 0);
      return {
        date: label,
        amount,
      };
    });
  }, [data]);

  const { renderedData, isCompressed, compressionStep } = useMemo(() => {
    const MAX_POINTS = days > 30 ? 45 : 60;
    if (chartData.length <= MAX_POINTS) {
      return { renderedData: chartData, isCompressed: false, compressionStep: 1 };
    }
    const step = Math.ceil(chartData.length / MAX_POINTS);
    const aggregated: Array<{ date: string; amount: number }> = [];
    for (let index = 0; index < chartData.length; index += step) {
      const slice = chartData.slice(index, index + step);
      if (!slice.length) continue;
      const total = slice.reduce((sum, point) => sum + (point.amount ?? 0), 0);
      const average = total / slice.length;
      const label = slice.length === 1 ? slice[0].date : `${slice[0].date} – ${slice[slice.length - 1].date}`;
      aggregated.push({ date: label, amount: Math.round(average) });
    }
    return { renderedData: aggregated, isCompressed: true, compressionStep: step };
  }, [chartData, days]);

  const formatAxisCurrency = (value: number) => `₫${(value / 1000).toFixed(0)}k`;

  if (renderedData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu {days} ngày gần nhất</h3>
        <p className="text-sm text-gray-500">Chưa có dữ liệu doanh thu trong khoảng thời gian đã chọn.</p>
      </div>
    );
  }

  const allZero = renderedData.every((item) => item.amount === 0);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Doanh thu {days} ngày gần nhất</h3>
        {allZero && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">0₫</span>}
      </div>
      <ResponsiveContainer width="100%" height={allZero ? 180 : 240}>
        <LineChart data={renderedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tickFormatter={formatAxisCurrency}
            domain={allZero ? [0, 1] : ["auto", "auto"]}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value: number) => [`₫${value.toLocaleString("vi-VN")}`, "Doanh thu"]}
            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "6px" }}
            labelFormatter={(label) => `Ngày ${label}`}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={allZero ? "#9ca3af" : "#3b82f6"}
            strokeDasharray={allZero ? "4 4" : undefined}
            strokeWidth={2}
            dot={{ fill: allZero ? "#9ca3af" : "#3b82f6", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 space-y-1">
        {allZero && <p className="text-xs text-gray-500">Không có doanh thu phát sinh trong khoảng thời gian này.</p>}
        {isCompressed && (
          <p className="text-xs text-gray-400">Dữ liệu được gộp trung bình theo mỗi {compressionStep} ngày để hiển thị gọn hơn.</p>
        )}
      </div>
    </div>
  );
}


