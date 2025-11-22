import { ResponsiveContainer, BarChart, Bar, LabelList, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { formatCurrency, formatNumber } from "./formatters";

export default function TopPackagesChart({
  data,
}: {
  data: Array<{ name: string; purchaseCount: number; revenue: number }>;
}) {
  if (!data.length) {
    return null;
  }
  const totalPurchases = data.reduce((sum, item) => sum + (item.purchaseCount ?? 0), 0);
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lượt mua theo gói</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "12px" }} interval={0} height={60} />
          <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} allowDecimals={false} tickFormatter={(v) => formatNumber(Number(v))} />
          <Tooltip
            formatter={(value: number, _name: string, entry: any) => {
              const revenue = entry?.payload?.revenue ?? 0;
              return [`${formatNumber(value)} lượt`, `Doanh thu ${formatCurrency(revenue)}`];
            }}
            contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "6px" }}
          />
          <Bar dataKey="purchaseCount" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={48}>
            <LabelList dataKey="purchaseCount" position="top" fill="#374151" fontSize={12} formatter={(v: any) => formatNumber(Number(v))} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-3 text-xs text-gray-500">
        Tổng lượt mua: <span className="font-medium text-gray-900">{formatNumber(totalPurchases)}</span>
      </p>
    </div>
  );
}


