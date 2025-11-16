import type { PackageTopPerformer } from "@/api/adminDashboard";
import { formatCurrency, formatNumber, formatDateDMY } from "./formatters";

export default function TopPackagesTable({ packages }: { packages: PackageTopPerformer[] }) {
  if (!packages?.length) {
    return null;
  }
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Top gói được mua nhiều nhất</h3>
        <span className="text-xs uppercase tracking-wide text-gray-500">Top {packages.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên gói</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt mua</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gia sư dùng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mua gần nhất</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg, index) => (
              <tr key={pkg.packageId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(pkg.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(pkg.purchaseCount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(pkg.revenue)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(pkg.tutorsCount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pkg.lastPurchaseAt ? formatDateDMY(pkg.lastPurchaseAt) : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


