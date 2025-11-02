import apiClient from "@/lib/api";
import type { IPackage } from "@/types/package";

export interface PublicPackageListResponse {
  status: string;
  message?: string;
  code?: number;
  data: {
    packages: (IPackage & { id: string })[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages?: number;
      totalPages?: number;
    };
  };
}

// Public endpoint - no authentication required
export const getPublicPackages = async (): Promise<PublicPackageListResponse> => {
  const res = await apiClient.get("/package");
  const raw = res.data || {};
  
  // Handle nested data.data structure (actual API response)
  const innerData = raw.data || {};
  const packagesArray = Array.isArray(innerData.data) 
    ? innerData.data 
    : Array.isArray(innerData.packages)
    ? innerData.packages
    : Array.isArray(raw.data)
    ? raw.data
    : [];
  
  // Map different response shapes to consistent format
  const packages = packagesArray.map((p: any) => ({ 
    ...p, 
    id: p?.id ?? p?._id ?? String(p?._id ?? "") 
  }));
    
  return {
    status: raw.status ?? "ok",
    message: raw.message,
    code: raw.code,
    data: { 
      packages,
      pagination: innerData.pagination
    },
  };
};

