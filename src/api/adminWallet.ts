import apiClient from "@/lib/api";

// ==================== Interfaces ====================

/**
 * Response từ API GET /api/admin/wallet/balance
 */
export interface AdminWalletBalanceResponse {
  balance: number;
  walletInfo: {
    _id: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Transaction type
 */
export type TransactionType = "package" | "learningCommitment";

/**
 * Transaction status (theo response thực tế)
 */
export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED" | "pending" | "completed" | "failed" | "refunded";

/**
 * Transaction source
 */
export interface TransactionSource {
  kind: "package" | "learningCommitment";
  commitmentId?: string;
  packageId?: string;
  name?: string;
  price?: number;
}

/**
 * Package info (trong package transactions)
 */
export interface TransactionPackage {
  id: string;
  name: string;
  price: number;
}

/**
 * Transaction user info
 */
export interface TransactionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

/**
 * Commitment info (trong commitment transactions)
 */
export interface TransactionCommitment {
  commitmentId: string;
  status: string;
}

/**
 * Transaction item trong danh sách
 */
export interface AdminTransaction {
  id: string;
  orderCode: number | string;
  transactionId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number; // Tổng số tiền giao dịch
  adminAmount: number; // Số tiền admin nhận được
  user: TransactionUser;
  source?: TransactionSource; // Có trong /admin/transactions
  package?: TransactionPackage; // Có trong /admin/transactions/packages
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number; // Backend trả về totalPages
  pages?: number; // Alias cho totalPages để tương thích
}

/**
 * Response từ API GET /api/admin/transactions
 */
export interface AdminTransactionsResponse {
  transactions: AdminTransaction[];
  pagination: PaginationInfo;
}

/**
 * Response từ API GET /api/admin/transactions/packages
 */
export interface AdminPackageTransactionsResponse {
  transactions: AdminTransaction[];
  pagination: PaginationInfo;
  totalAmount: number; // Tổng doanh thu từ packages
}

/**
 * Commitment transaction item trong danh sách
 */
export interface AdminCommitmentTransaction {
  id: string;
  orderCode: number | string;
  transactionId: string;
  amount: number; // Tổng số tiền giao dịch
  adminAmount: number; // Số tiền admin nhận được
  user: TransactionUser | null; // Có thể null
  commitment: TransactionCommitment;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response từ API GET /api/admin/transactions/commitments
 */
export interface AdminCommitmentTransactionsResponse {
  transactions: AdminCommitmentTransaction[];
  pagination: PaginationInfo;
  totalAmount: number; // Tổng doanh thu từ commitments
  totalAdminAmount: number; // Tổng số tiền admin nhận được
}

/**
 * Response từ API GET /api/admin/revenue
 */
export interface AdminRevenueResponse {
  packageRevenue: number;
  packageTransactionCount: number;
  adminWalletBalance: number;
  totalRevenue: number;
}

/**
 * Query params cho GET /api/admin/transactions
 */
export interface GetAdminTransactionsParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  userId?: string;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  search?: string; // Tìm kiếm theo orderCode, transactionId, tên/email/phone user
}

// ==================== API Functions ====================

/**
 * Lấy số dư hiện tại của ví admin
 * GET /api/admin/wallet/balance
 */
export const getAdminWalletBalance = async (): Promise<AdminWalletBalanceResponse> => {
  const response = await apiClient.get("/admin/wallet/balance");
  // Response structure có thể là: { status, message, code, data: { balance, walletInfo } } hoặc trực tiếp { balance, walletInfo }
  const responseData = response.data;
  if (responseData.data) {
    return responseData.data;
  }
  return responseData;
};

/**
 * Lấy lịch sử giao dịch (bao gồm package và learning commitment)
 * GET /api/admin/transactions
 */
export const getAdminTransactions = async (
  params?: GetAdminTransactionsParams
): Promise<AdminTransactionsResponse> => {
  const response = await apiClient.get("/admin/transactions", {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 20,
      ...(params?.type && { type: params.type }),
      ...(params?.status && { status: params.status }),
      ...(params?.userId && { userId: params.userId }),
      ...(params?.startDate && { startDate: params.startDate }),
      ...(params?.endDate && { endDate: params.endDate }),
      ...(params?.search && { search: params.search }),
    },
  });
  // Response structure: { status, message, code, data: { page, limit, total, totalPages, transactions } }
  const responseData = response.data;
  if (responseData.data) {
    const data = responseData.data;
    return {
      transactions: data.transactions || [],
      pagination: {
        page: data.page || params?.page || 1,
        limit: data.limit || params?.limit || 20,
        total: data.total || 0,
        totalPages: data.totalPages || 1,
        pages: data.totalPages || 1, // Alias cho tương thích
      },
    };
  }
  return responseData;
};

/**
 * Lấy lịch sử giao dịch package
 * GET /api/admin/transactions/packages
 */
export const getAdminPackageTransactions = async (
  params?: GetAdminTransactionsParams
): Promise<AdminPackageTransactionsResponse> => {
  const response = await apiClient.get("/admin/transactions/packages", {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 20,
      ...(params?.status && { status: params.status }),
      ...(params?.userId && { userId: params.userId }),
      ...(params?.startDate && { startDate: params.startDate }),
      ...(params?.endDate && { endDate: params.endDate }),
      ...(params?.search && { search: params.search }),
    },
  });
  // Response structure: { status, message, code, data: { page, limit, total, totalPages, transactions, totalAmount } }
  const responseData = response.data;
  if (responseData.data) {
    const data = responseData.data;
    return {
      transactions: data.transactions || [],
      pagination: {
        page: data.page || params?.page || 1,
        limit: data.limit || params?.limit || 20,
        total: data.total || 0,
        totalPages: data.totalPages || 1,
        pages: data.totalPages || 1, // Alias cho tương thích
      },
      totalAmount: data.totalAmount || 0,
    };
  }
  return responseData;
};

/**
 * Lấy lịch sử giao dịch learning commitment
 * GET /api/admin/transactions/commitments
 */
export const getAdminCommitmentTransactions = async (
  params?: GetAdminTransactionsParams
): Promise<AdminCommitmentTransactionsResponse> => {
  const response = await apiClient.get("/admin/transactions/commitments", {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 20,
      ...(params?.status && { status: params.status }),
      ...(params?.userId && { userId: params.userId }),
      ...(params?.startDate && { startDate: params.startDate }),
      ...(params?.endDate && { endDate: params.endDate }),
      ...(params?.search && { search: params.search }),
    },
  });
  // Response structure: { status, message, code, data: { page, limit, total, totalPages, transactions, totalAmount, totalAdminAmount } }
  const responseData = response.data;
  if (responseData.data) {
    const data = responseData.data;
    return {
      transactions: data.transactions || [],
      pagination: {
        page: data.page || params?.page || 1,
        limit: data.limit || params?.limit || 20,
        total: data.total || 0,
        totalPages: data.totalPages || 1,
        pages: data.totalPages || 1, // Alias cho tương thích
      },
      totalAmount: data.totalAmount || 0,
      totalAdminAmount: data.totalAdminAmount || 0,
    };
  }
  return responseData;
};

/**
 * Lấy tổng doanh thu và thống kê
 * GET /api/admin/revenue
 */
export const getAdminRevenue = async (): Promise<AdminRevenueResponse> => {
  const response = await apiClient.get("/admin/revenue");
  // Response structure: { status, message, code, data: { packageRevenue, packageTransactionCount, adminWalletBalance, totalRevenue } }
  return response.data.data || response.data;
};

