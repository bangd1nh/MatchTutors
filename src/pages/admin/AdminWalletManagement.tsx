import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet,
  TrendingUp,
  Package,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
} from "lucide-react";
import {
  useAdminPackageTransactions,
  useAdminRevenue,
} from "@/hooks/useAdminWallet";
import type { TransactionStatus } from "@/api/adminWallet";

// Constants
const ITEMS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 300;

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


const getTransactionStatusLabel = (status: TransactionStatus): string => {
  const labels: Record<string, string> = {
    SUCCESS: "Hoàn thành",
    PENDING: "Đang chờ",
    FAILED: "Thất bại",
    REFUNDED: "Đã hoàn tiền",
    pending: "Đang chờ",
    completed: "Hoàn thành",
    failed: "Thất bại",
    refunded: "Đã hoàn tiền",
  };
  return labels[status] || status;
};

const getTransactionStatusColor = (status: TransactionStatus): string => {
  const colors: Record<string, string> = {
    SUCCESS: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    FAILED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export default function AdminWalletManagement() {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<{
    page: number;
    status?: TransactionStatus;
    startDate?: string;
    endDate?: string;
  }>({
    page: 1,
  });

  // API calls
  const { data: revenueData, isLoading: isLoadingRevenue } = useAdminRevenue();
  const { data: transactionsData, isLoading: isLoadingTransactions } = useAdminPackageTransactions({
    page: filters.page,
    limit: ITEMS_PER_PAGE,
    status: filters.status,
    startDate: filters.startDate,
    endDate: filters.endDate,
    search: debouncedSearch || undefined,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [filters.status, filters.startDate, filters.endDate, debouncedSearch]);

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ page: 1 });
    setSearchTerm("");
  }, []);

  // Computed values
  const transactions = transactionsData?.transactions || [];
  const pagination = transactionsData?.pagination || {
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
    pages: 1,
  };
  
  // Sử dụng totalPages hoặc pages
  const totalPages = pagination.totalPages || pagination.pages || 1;
  
  // Calculate learning commitment revenue from revenue data
  // Doanh thu từ cam kết học tập = Tổng doanh thu - Doanh thu gói dịch vụ
  const learningCommitmentRevenue = useMemo(() => {
    if (!revenueData) return 0;
    return (revenueData.totalRevenue || 0) - (revenueData.packageRevenue || 0);
  }, [revenueData]);

  const hasActiveFilters = !!(
    filters.status ||
    filters.startDate ||
    filters.endDate ||
    debouncedSearch
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quản lý ví Admin</h1>
        <p className="text-muted-foreground mt-1">
          Xem số dư ví và lịch sử giao dịch
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(revenueData?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Bao gồm số dư ví
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Learning Commitment Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu từ cam kết học tập</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(learningCommitmentRevenue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tự động cập nhật
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Package Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu gói dịch vụ</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(revenueData?.packageRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {revenueData?.packageTransactionCount || 0} giao dịch
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng giao dịch</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {pagination.total}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tất cả loại giao dịch
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </CardTitle>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-2 lg:col-span-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo mã đơn, mã giao dịch, tên/email/phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-3">
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value === "all" ? undefined : (value as TransactionStatus),
                    page: 1,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="SUCCESS">Hoàn thành</SelectItem>
                  <SelectItem value="PENDING">Đang chờ</SelectItem>
                  <SelectItem value="FAILED">Thất bại</SelectItem>
                  <SelectItem value="REFUNDED">Đã hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="md:col-span-2 lg:col-span-4 grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Từ ngày"
                value={filters.startDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    startDate: e.target.value || undefined,
                    page: 1,
                  }))
                }
              />
              <Input
                type="date"
                placeholder="Đến ngày"
                value={filters.endDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    endDate: e.target.value || undefined,
                    page: 1,
                  }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không có giao dịch nào
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn/Giao dịch</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Admin nhận</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="space-y-1">
                            {transaction.orderCode && (
                              <div className="font-medium">{transaction.orderCode}</div>
                            )}
                            {transaction.transactionId && (
                              <div className="text-xs text-muted-foreground">
                                {transaction.transactionId}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            Gói dịch vụ
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {transaction.user?.name || "N/A"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {transaction.user?.email || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(transaction.adminAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTransactionStatusColor(transaction.status)}>
                            {getTransactionStatusLabel(transaction.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {((pagination.page - 1) * pagination.limit) + 1} -{" "}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số{" "}
                    {pagination.total} giao dịch
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={pagination.page === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                      {totalPages > 5 && (
                        <>
                          <span className="text-muted-foreground">...</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            className="w-8 h-8 p-0"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

