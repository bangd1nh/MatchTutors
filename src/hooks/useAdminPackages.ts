import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackageStatus,
} from "@/api/adminPackages";
import type { PackageFormData } from "@/types/package";
import type { PackageListResponse } from "@/api/adminPackages";
import { useToast } from "@/hooks/useToast";

const keys = {
  all: ["admin-packages"] as const,
};

export function usePackages() {
  return useQuery<PackageListResponse>({
    queryKey: keys.all,
    queryFn: () => getAllPackages(),
  });
}

export function useCreatePackage() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: PackageFormData) => createPackage(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast("success", "Tạo gói thành công");
    },
    onError: (e: any) => toast("error", e?.response?.data?.message || "Tạo gói thất bại"),
  });
}

export function useUpdatePackage() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PackageFormData }) => updatePackage(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast("success", "Cập nhật gói thành công");
    },
    onError: (e: any) => toast("error", e?.response?.data?.message || "Cập nhật gói thất bại"),
  });
}

export function useDeletePackage() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => deletePackage(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all });
      toast("success", "Đã xóa gói");
    },
    onError: (e: any) => toast("error", e?.response?.data?.message || "Xóa gói thất bại"),
  });
}

export function useTogglePackageStatus() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => togglePackageStatus(id, isActive),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: keys.all });
      const status = variables.isActive ? "đã kích hoạt" : "đã tắt";
      toast("success", `Gói đã ${status}`);
    },
    onError: (e: any) => toast("error", e?.response?.data?.message || "Cập nhật trạng thái thất bại"),
  });
}
