import { Link } from "react-router-dom";
import type { PackagesSummary } from "@/api/adminDashboard";
import { formatCurrency, formatNumber, formatDateDMY } from "./formatters";

export default function PackagePerformanceCard({ stats }: { stats: PackagesSummary }) {
  const topPackage = stats?.topPackage;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Hiệu suất gói gia sư</h3>
        <Link to="/admin/packages" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Quản lý gói
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-white p-4 border border-indigo-100">
          <p className="text-sm text-gray-600">Tổng lượt mua</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(stats.totalSubscriptions)}</p>
          <p className="text-xs text-gray-500 mt-1">{formatNumber(stats.activeSubscriptions)} lượt đang hoạt động</p>
          <p className="text-xs text-gray-500 mt-2">
            Doanh thu: <span className="font-semibold text-green-600">{formatCurrency(stats.revenue)}</span>
          </p>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-white p-4 border border-purple-100">
          <p className="text-sm text-gray-600">Gói bán chạy nhất</p>
          <p className="text-xl font-semibold text-gray-900 mt-2">{topPackage?.name ?? "Chưa có dữ liệu"}</p>
          {topPackage ? (
            <>
              <p className="text-sm text-gray-600 mt-1">
                {formatNumber(topPackage.purchaseCount)} lượt mua • {formatCurrency(topPackage.revenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{formatNumber(topPackage.tutorsCount)} gia sư đang dùng</p>
              {topPackage.lastPurchaseAt && (
                <p className="text-xs text-gray-400 mt-1">Lần mua gần nhất: {formatDateDMY(topPackage.lastPurchaseAt)}</p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Chưa có giao dịch nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}


