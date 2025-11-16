import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { formatNumber } from "./formatters";

export default function UsersRolePieChart({ data }: { data: Array<{ name: string; value: number }> }) {
  if (!data?.length) return null;
  const palette = ["#6366f1", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6"];
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Người dùng theo vai trò</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
          <Tooltip
            formatter={(value: number, _name: string) => [`${formatNumber(Number(value))}`, "Số lượng"]}
            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "6px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


