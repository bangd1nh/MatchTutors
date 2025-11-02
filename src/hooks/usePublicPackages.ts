import { useQuery } from "@tanstack/react-query";
import { getPublicPackages } from "@/api/publicPackages";
import type { PublicPackageListResponse } from "@/api/publicPackages";

const keys = {
  all: ["public-packages"] as const,
};

export function usePublicPackages() {
  return useQuery<PublicPackageListResponse>({
    queryKey: keys.all,
    queryFn: () => getPublicPackages(),
  });
}

