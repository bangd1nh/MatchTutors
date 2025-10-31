import { UIPackage } from "@/types/package";
import { Check, Trash2, Power } from "lucide-react";

interface PackageCardProps {
  package: UIPackage;
  onEdit: (pkg: UIPackage) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function PackageCard({ package: pkg, onEdit, onDelete, onToggleStatus }: PackageCardProps) {
  const isFeatured = pkg.popular || false;
  const desc = (pkg.description || []).filter((s) => s && s.trim().length > 0);

  // Thêm maxStudents và maxQuiz vào description để hiển thị
  const displayItems = [...desc];
  if (typeof pkg.features?.maxStudents === "number") {
    displayItems.push(`👨‍🎓 Tối đa ${pkg.features.maxStudents} học sinh`);
  }
  if (typeof pkg.features?.maxQuiz === "number") {
    displayItems.push(`📝 Tối đa ${pkg.features.maxQuiz} bài quiz`);
  }

  return (
    <div
      className={`bg-white rounded-lg border ${isFeatured ? "border-gray-800 shadow-xl" : "border-gray-200 shadow-sm"} overflow-hidden flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 ${isFeatured ? "hover:border-gray-900" : "hover:border-gray-300"}`}
    >
      {/* Badge for featured/status */}
      <div className="px-6 pt-6 pb-3 min-h-[60px] flex items-start">
        {isFeatured && (
          <div className="inline-block bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Phổ biến nhất
          </div>
        )}
        {!isFeatured && !pkg.isActive && (
          <div className="inline-block bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
            Không hoạt động
          </div>
        )}
      </div>

      {/* Plan name */}
      <div className="px-6 pb-4 min-h-[80px]">
        <h3 
          className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 break-words min-h-[60px]" 
          title={pkg.name}
        >
          {pkg.name}
        </h3>
      </div>

      {/* Price */}
      <div className="px-6 pb-6 min-h-[80px] flex items-center">
        <div className="flex items-baseline gap-2">
          {pkg.price === 0 ? (
            <span className="text-5xl font-bold text-gray-900">Miễn phí</span>
          ) : (
            <>
              <span className="text-5xl font-bold text-gray-900 break-all">
                {pkg.price.toLocaleString("vi-VN")}
              </span>
              <span className="text-gray-600 text-xl font-semibold">₫</span>
            </>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-6">
        <button
          onClick={() => onEdit(pkg)}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            isFeatured ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50"
          }`}
        >
          Chỉnh sửa
        </button>
      </div>

      {/* Features list - using description with maxStudents and maxQuiz */}
      {displayItems.length > 0 && (
        <div className="px-6 pb-6 flex-1">
          <ul className="space-y-3">
            {displayItems.map((line, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700 leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-6 pb-6 border-t border-gray-100 pt-4 mt-auto">
        <div className="flex gap-2">
          <button
            onClick={() => onToggleStatus(pkg.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              pkg.isActive ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            <Power className="w-4 h-4" />
            {pkg.isActive ? "Tắt" : "Bật"}
          </button>
          <button
            onClick={() => onDelete(pkg.id)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm border border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
