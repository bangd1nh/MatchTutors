import { useQuery } from "@tanstack/react-query";
import {
  getAdminWalletBalance,
  getAdminTransactions,
  getAdminPackageTransactions,
  getAdminRevenue,
  type AdminWalletBalanceResponse,
  type AdminTransactionsResponse,
  type AdminPackageTransactionsResponse,
  type AdminRevenueResponse,
  type GetAdminTransactionsParams,
} from "@/api/adminWallet";

// ==================== Query Keys ====================

export const adminWalletKeys = {
  all: ["adminWallet"] as const,
  balance: () => [...adminWalletKeys.all, "balance"] as const,
  transactions: (params?: GetAdminTransactionsParams) =>
    [...adminWalletKeys.all, "transactions", params] as const,
  packageTransactions: (params?: GetAdminTransactionsParams) =>
    [...adminWalletKeys.all, "packageTransactions", params] as const,
  revenue: () => [...adminWalletKeys.all, "revenue"] as const,
};

// ==================== Hooks ====================

/**
 * Hook để lấy số dư ví admin
 */
export const useAdminWalletBalance = () => {
  return useQuery<AdminWalletBalanceResponse>({
    queryKey: adminWalletKeys.balance(),
    queryFn: () => getAdminWalletBalance(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

/**
 * Hook để lấy lịch sử giao dịch (tất cả)
 */
export const useAdminTransactions = (params?: GetAdminTransactionsParams) => {
  return useQuery<AdminTransactionsResponse>({
    queryKey: adminWalletKeys.transactions(params),
    queryFn: () => getAdminTransactions(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook để lấy lịch sử giao dịch package
 */
export const useAdminPackageTransactions = (params?: GetAdminTransactionsParams) => {
  return useQuery<AdminPackageTransactionsResponse>({
    queryKey: adminWalletKeys.packageTransactions(params),
    queryFn: () => getAdminPackageTransactions(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook để lấy tổng doanh thu
 */
export const useAdminRevenue = () => {
  return useQuery<AdminRevenueResponse>({
    queryKey: adminWalletKeys.revenue(),
    queryFn: () => getAdminRevenue(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

