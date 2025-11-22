import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { formatNumber } from "./formatters";

export default function PaymentStatusDonut({
  data,
}: {
  data: Array<{ name: string; value: number; color: string }>;
}) {
  const total = data.reduce((sum, d) => sum + (d.value ?? 0), 0);
  if (total === 0) return null;
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái giao dịch</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={95}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
          <Tooltip
            formatter={(value: number, name: string) => [`${formatNumber(Number(value))}`, name]}
            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "6px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


