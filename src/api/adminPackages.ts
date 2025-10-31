import apiClient from "@/lib/api";
import type { IPackage, PackageFormData } from "@/types/package";

export interface PackageListResponse {
  status: string;
  message?: string;
  code?: number;
  data: {
    packages: (IPackage & { id: string })[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface PackageDetailResponse {
  status: string;
  message?: string;
  code?: number;
  data: {
    package: IPackage & { id: string };
  };
}

export interface PackageStatsResponse {
  status: string;
  data: {
    total: number;
    active: number;
    inactive: number;
    avgPrice?: number;
  };
}

export interface TutorsUsingPackageResponse {
  status: string;
  data: {
    packageId: string;
    tutors: Array<{
      id: string;
      name: string;
      email?: string;
    }>;
  };
}

function normalizeDescriptionToArray(desc: unknown): string[] | undefined {
  if (Array.isArray(desc)) {
    const items = desc.filter((v) => typeof v === "string" && v.trim().length > 0) as string[];
    return items.length ? items : undefined;
  }
  if (typeof desc === "string") {
    const lines = desc
      .split(/\r?\n/)
      .map((s) => s.replace(/^[-•]\s*/, "").trim())
      .filter((s) => s.length > 0);
    return lines.length ? lines : undefined;
  }
  return undefined;
}

function mapAnyToPackagesArray(input: any): (IPackage & { id: string })[] {
  if (!input) return [];
  // Common shapes: data.packages, data.items, data, root array
  const arr = Array.isArray(input.packages)
    ? input.packages
    : Array.isArray(input.items)
    ? input.items
    : Array.isArray(input)
    ? input
    : Array.isArray(input.data)
    ? input.data
    : [];
  return arr.map((p: any) => ({ ...p, id: p?.id ?? p?._id ?? String(p?._id ?? "") }));
}

// ADMIN endpoints
export const getAllPackages = async (params?: { page?: number; limit?: number; search?: string }): Promise<PackageListResponse> => {
  const res = await apiClient.get("/admin/packages", { params });
  const raw = res.data || {};
  const packages = mapAnyToPackagesArray(raw.data ?? raw);
  const pagination = raw?.data?.pagination || raw?.pagination; // best-effort
  return {
    status: raw.status ?? "ok",
    message: raw.message,
    code: raw.code,
    data: { packages, pagination },
  };
};

export const getPackageById = async (id: string): Promise<PackageDetailResponse> => {
  const res = await apiClient.get(`/admin/packages/${id}`);
  return res.data;
};

export const getTutorPackageStats = async (): Promise<PackageStatsResponse> => {
  const res = await apiClient.get("/admin/packages/stats");
  return res.data;
};

export const getTutorsUsingPackage = async (id: string, params?: { page?: number; limit?: number }): Promise<TutorsUsingPackageResponse> => {
  const res = await apiClient.get(`/admin/packages/${id}/tutors`, { params });
  return res.data;
};

export const createPackage = async (
  payload: PackageFormData | (PackageFormData & { description?: string | string[] })
): Promise<PackageDetailResponse> => {
  const body: any = { ...payload };
  body.description = normalizeDescriptionToArray((payload as any).description);
  const res = await apiClient.post("/admin/packages", body);
  return res.data;
};

export const updatePackage = async (
  id: string,
  payload: PackageFormData | (PackageFormData & { description?: string | string[] })
): Promise<PackageDetailResponse> => {
  const body: any = { ...payload };
  body.description = normalizeDescriptionToArray((payload as any).description);
  const res = await apiClient.put(`/admin/packages/${id}`, body);
  return res.data;
};

export const deletePackage = async (id: string): Promise<{ status: string; message?: string }> => {
  const res = await apiClient.delete(`/admin/packages/${id}`);
  return res.data;
};

export const togglePackageStatus = async (id: string, isActive: boolean): Promise<PackageDetailResponse> => {
  const res = await apiClient.patch(`/admin/packages/${id}/status`, { isActive });
  return res.data;
};
