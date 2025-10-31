import React, { useEffect, useMemo, useState } from "react";
import { UIPackage, PackageFormData } from "@/types/package";
import { X, ChevronDown, ChevronRight, Trash2 } from "lucide-react";

interface PackageFormProps {
  package?: UIPackage;
  onSubmit: (data: PackageFormData) => void;
  onClose: () => void;
}

export function PackageForm({ package: pkg, onSubmit, onClose }: PackageFormProps) {
  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    description: [],
    price: 0,
    isActive: true,
    popular: false,
    features: {
      boostVisibility: false,
      priorityRanking: false,
      featuredProfile: false,
      maxStudents: undefined,
      maxQuiz: undefined,
    },
  });

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [touched, setTouched] = useState<{ name?: boolean; price?: boolean; description?: boolean }>({});

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name,
        description: pkg.description || [],
        price: pkg.price,
        isActive: pkg.isActive,
        popular: pkg.popular || false,
        features: {
          boostVisibility: !!pkg.features?.boostVisibility,
          priorityRanking: !!pkg.features?.priorityRanking,
          featuredProfile: !!pkg.features?.featuredProfile,
          maxStudents: pkg.features?.maxStudents,
          maxQuiz: pkg.features?.maxQuiz,
        },
      });
    } else {
      setFormData((f) => ({ ...f, description: [] }));
    }
  }, [pkg]);

  const errors = useMemo(() => {
    const hasDesc = (formData.description || []).some((s) => s && s.trim().length > 0);
    return {
      name: !formData.name?.trim() ? "Tên gói bắt buộc" : undefined,
      price: !(Number.isFinite(formData.price) && formData.price >= 0) ? "Giá không hợp lệ" : undefined,
      description: !hasDesc ? "Ít nhất 1 dòng mô tả" : undefined,
    } as { name?: string; price?: string; description?: string };
  }, [formData]);

  const isInvalid = !!(errors.name || errors.price || errors.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, price: true, description: true });
    if (isInvalid) return;
    const descArray = (formData.description || []).map((s) => s.trim()).filter((s) => s.length > 0);
    onSubmit({
      ...formData,
      description: descArray,
    });
  };

  const updateDescItem = (idx: number, value: string) => {
    setFormData((f) => {
      const next = [...(f.description || [])];
      next[idx] = value;
      return { ...f, description: next };
    });
  };

  const addDescItem = () => {
    setFormData((f) => ({ ...f, description: [ ...(f.description || []), "" ] }));
  };

  const removeDescItem = (idx: number) => {
    setFormData((f) => {
      const next = (f.description || []).filter((_, i) => i !== idx);
      return { ...f, description: next };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{pkg ? "Chỉnh sửa Gói" : "Tạo Gói Mới"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên gói <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${touched.name && errors.name ? "border-red-400" : "border-gray-300"}`}
              placeholder="VD: Gói Cơ Bản"
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Mô tả hiển thị cho người dùng <span className="text-red-500">*</span>
              </label>
              <button type="button" onClick={addDescItem} className="text-sm text-blue-600 hover:text-blue-700">+ Thêm dòng</button>
            </div>
            <div className="space-y-2">
              {(formData.description || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateDescItem(idx, e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, description: true }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Không giới hạn học sinh"
                  />
                  {(formData.description?.length || 0) > 1 && (
                    <button type="button" onClick={() => removeDescItem(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {touched.description && errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={Number.isFinite(formData.price) ? formData.price : 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                onBlur={() => setTouched((t) => ({ ...t, price: true }))}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${touched.price && errors.price ? "border-red-400" : "border-gray-300"}`}
                placeholder="0"
              />
              {touched.price && errors.price && (
                <p className="mt-1 text-xs text-red-600">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={formData.isActive ? "active" : "inactive"}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">Phổ biến nhất (hiển thị badge)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800"
            >
              {advancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Thiết lập tính năng (lưu DB)
            </button>

            {advancedOpen && (
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!formData.features.boostVisibility}
                      onChange={(e) => setFormData({ ...formData, features: { ...formData.features, boostVisibility: e.target.checked } })}
                    />
                    <span className="text-sm text-gray-700">Tăng hiển thị</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!formData.features.priorityRanking}
                      onChange={(e) => setFormData({ ...formData, features: { ...formData.features, priorityRanking: e.target.checked } })}
                    />
                    <span className="text-sm text-gray-700">Xếp hạng ưu tiên</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!formData.features.featuredProfile}
                      onChange={(e) => setFormData({ ...formData, features: { ...formData.features, featuredProfile: e.target.checked } })}
                    />
                    <span className="text-sm text-gray-700">Trang nổi bật</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số học sinh tối đa</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.features.maxStudents ?? ""}
                      onChange={(e) => setFormData({ ...formData, features: { ...formData.features, maxStudents: e.target.value ? Number(e.target.value) : undefined } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Không giới hạn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số bài quiz tối đa</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.features.maxQuiz ?? ""}
                      onChange={(e) => setFormData({ ...formData, features: { ...formData.features, maxQuiz: e.target.value ? Number(e.target.value) : undefined } })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Không giới hạn"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={isInvalid} className={`flex-1 px-4 py-2 rounded-lg transition-colors text-white ${isInvalid ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
              {pkg ? "Cập nhật" : "Tạo gói"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
