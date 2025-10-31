import { useMemo, useState } from "react";
import { UIPackage, PackageFormData } from "@/types/package";
import { PackageCard } from "@/components/packages/PackageCard";
import { PackageForm } from "@/components/packages/PackageForm";
import { Plus, Search as SearchIcon, Filter, ArrowUpDown, Package as PkgIcon, CheckCircle2, XCircle } from "lucide-react";
import { usePackages, useCreatePackage, useUpdatePackage, useDeletePackage, useTogglePackageStatus } from "@/hooks/useAdminPackages";

type StatusFilter = "all" | "active" | "inactive";

type SortKey = "name-asc" | "price-asc" | "price-desc" | "status";

export default function PackageManagement() {
  const { data: packagesData, isLoading, isError } = usePackages();
  const createMutation = useCreatePackage();
  const updateMutation = useUpdatePackage();
  const deleteMutation = useDeletePackage();
  const toggleMutation = useTogglePackageStatus();

  const rawList = ((packagesData as any)?.data?.packages || []) as any[];
  const apiPackages: UIPackage[] = rawList.map((p) => ({ ...p, id: p.id ?? p._id ?? "" }));

  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<UIPackage | undefined>();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("price-asc");

  const stats = useMemo(() => {
    const active = apiPackages.filter((p) => p.isActive).length;
    const inactive = apiPackages.length - active;
    return { total: apiPackages.length, active, inactive };
  }, [apiPackages]);

  const filteredSortedPackages = useMemo(() => {
    let dataList = apiPackages.filter((pkg) => {
      const descText = (pkg.description || []).join(" ").toLowerCase();
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        descText.includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "active" ? pkg.isActive : !pkg.isActive);
      return matchesSearch && matchesStatus;
    });

    switch (sortKey) {
      case "price-asc":
        dataList = dataList.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        dataList = dataList.sort((a, b) => b.price - a.price);
        break;
      case "status":
        dataList = dataList.sort((a, b) => Number(b.isActive) - Number(a.isActive));
        break;
      default:
        dataList = dataList.sort((a, b) => a.name.localeCompare(b.name));
    }

    return dataList;
  }, [apiPackages, searchQuery, statusFilter, sortKey]);

  const handleCreatePackage = (data: PackageFormData) => {
    createMutation.mutate(data, { onSuccess: () => setShowForm(false) });
  };

  const handleUpdatePackage = (data: PackageFormData) => {
    if (!editingPackage) return;
    updateMutation.mutate({ id: editingPackage.id, data }, { onSuccess: () => { setEditingPackage(undefined); setShowForm(false); } });
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: string) => {
    const current = apiPackages.find(p => p.id === id);
    if (!current) return;
    toggleMutation.mutate({ id, isActive: !current.isActive });
  };

  const handleEdit = (pkg: UIPackage) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPackage(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <PkgIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý Gói</h1>
                <p className="text-sm text-gray-500 mt-0.5">Tạo, cập nhật và quản lý trạng thái gói dịch vụ</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Tạo Gói Mới</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Tổng:</span>
            <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-sm">{stats.total}</span>
            <span className="text-sm text-gray-600 ml-2">Trạng thái:</span>
            <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-sm flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> {stats.active} hoạt động
            </span>
            <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-sm flex items-center gap-1">
              <XCircle className="h-4 w-4" /> {stats.inactive} không hoạt động
            </span>
          </div>

          {/* Controls */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative md:col-span-2">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm gói theo tên hoặc mô tả..."
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden md:inline">Sắp xếp:</span>
              <div className="relative w-full">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="name-asc">Tên (A→Z)</option>
                  <option value="price-asc">Giá (thấp→cao)</option>
                  <option value="price-desc">Giá (cao→thấp)</option>
                  <option value="status">Trạng thái (hoạt động trước)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Filter className="h-4 w-4" /> Trạng thái:
            </span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-full text-sm border ${statusFilter === "all" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-full text-sm border ${statusFilter === "active" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              Hoạt động
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-3 py-1.5 rounded-full text-sm border ${statusFilter === "inactive" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
            >
              Không hoạt động
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse h-full flex flex-col">
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                  <div className="mt-2 h-3 w-3/4 bg-gray-100 rounded" />
                  <div className="mt-6 h-24 bg-gray-100 rounded" />
                  <div className="mt-6 h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-16 text-red-600">
            Lỗi khi tải danh sách gói.
          </div>
        ) : (
          <>
            <div className="flex gap-6">
              {filteredSortedPackages.map((pkg) => (
                <div key={pkg.id} className="flex-1">
                  <PackageCard
                    package={pkg}
                    onEdit={handleEdit}
                    onDelete={handleDeletePackage}
                    onToggleStatus={handleToggleStatus}
                  />
                </div>
              ))}
            </div>

            {filteredSortedPackages.length === 0 && (
              <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl">
                <div className="mx-auto h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center">
                  <PkgIcon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-800">Không tìm thấy gói phù hợp</h3>
                <p className="mt-1 text-sm text-gray-500">Hãy thử thay đổi bộ lọc hoặc tạo gói mới.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Tạo Gói Mới
                </button>
              </div>
            )}

          </>
        )}
      </div>

      {showForm && (
        <PackageForm
          package={editingPackage}
          onSubmit={editingPackage ? handleUpdatePackage : handleCreatePackage}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
