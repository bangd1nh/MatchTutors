import { type ReactNode, useMemo, useState } from "react";
import {
  Users,
  CircleDollarSign,
  GraduationCap,
  BookOpen,
  Package,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { Loader2 } from "lucide-react";
// Recharts primitives are used inside child components; not needed here
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import RecentActivityTabs from "@/components/admin/dashboard/RecentActivityTabs";
import PackagePerformanceCard from "@/components/admin/dashboard/PackagePerformanceCard";
import TopPackagesChart from "@/components/admin/dashboard/TopPackagesChart";
import TopPackagesTable from "@/components/admin/dashboard/TopPackagesTable";
import UsersRolePieChart from "@/components/admin/dashboard/UsersRolePieChart";
import PaymentStatusDonut from "@/components/admin/dashboard/PaymentStatusDonut";
// import { Link } from "react-router-dom";
import StatCard from "@/components/admin/dashboard/StatCard";
import HighlightCard from "@/components/admin/dashboard/HighlightCard";

import { useAdminDashboardSummary } from "@/hooks/useAdminDashboardSummary";
import type { AdminDashboardData } from "@/api/adminDashboard";

const EMPTY_SUMMARY: AdminDashboardData = {
  users: { total: 0, active: 0, banned: 0, newLast7Days: 0, byRole: [] },
  tutors: { total: 0, active: 0, banned: 0, pendingApproval: 0, approvedProfiles: 0, rejectedProfiles: 0 },
  students: { total: 0, active: 0, banned: 0 },
  teachingRequests: {
    total: 0,
    PENDING: 0,
    ACCEPTED: 0,
    REJECTED: 0,
    COMPLETED: 0,
    IN_PROGRESS: 0,
  },
  learningCommitments: {
    total: 0,
    pending_agreement: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    cancellation_pending: 0,
    admin_review: 0,
    rejected: 0,
  },
  packages: {
    totalPackages: 0,
    activePackages: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    revenue: 0,
    topPackage: undefined,
    topPackages: [],
  },
  payments: {
    totalRevenue: 0,
    revenueLast7Days: 0,
    revenueInRange: 0,
    revenueFromPackages: 0,
    adminWalletBalance: 0,
    successfulTransactions: 0,
    pendingCount: 0,
    failedCount: 0,
    refundedCount: 0,
    trend: [],
    trendPresets: {},
    trendPresetTotals: {},
    trendRange: undefined,
    trendRangeDays: undefined,
    trendRangeStart: undefined,
    trendRangeEnd: undefined,
    recent: [],
  },
  disputes: {
    open: 0,
    resolved: 0,
    recent: [],
  },
  violationReports: {
    summary: {},
    recent: [],
  },
  recentActivity: {
    users: [],
    tutorApplications: [],
    payments: [],
    disputes: [],
    violationReports: [],
  },
};

const formatCurrency = (amount: number) => `₫${(amount || 0).toLocaleString("vi-VN")}`;
const formatNumber = (value: number) => (value ?? 0).toLocaleString("vi-VN");

const TIME_RANGE_OPTIONS = [
  { label: "7 ngày", value: 7 },
  { label: "30 ngày", value: 30 },
  { label: "90 ngày", value: 90 },
] as const;
const RECENT_ACTIVITY_LIMIT = 5;

const formatDateDM = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};
const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric" });

const mergeSummary = (summary?: AdminDashboardData): AdminDashboardData => ({
  ...EMPTY_SUMMARY,
  ...summary,
  users: {
    ...EMPTY_SUMMARY.users,
    ...(summary?.users ?? {}),
    byRole: summary?.users?.byRole ?? [],
  },
  tutors: {
    ...EMPTY_SUMMARY.tutors,
    ...(summary?.tutors ?? {}),
  },
  students: {
    ...EMPTY_SUMMARY.students,
    ...(summary?.students ?? {}),
  },
  teachingRequests: {
    ...EMPTY_SUMMARY.teachingRequests,
    ...(summary?.teachingRequests ?? {}),
  },
  learningCommitments: {
    ...EMPTY_SUMMARY.learningCommitments,
    ...(summary?.learningCommitments ?? {}),
  },
  packages: {
    ...EMPTY_SUMMARY.packages,
    ...(summary?.packages ?? {}),
  },
  payments: {
    ...EMPTY_SUMMARY.payments,
    ...(summary?.payments ?? {}),
    trend: summary?.payments?.trend ?? [],
    trendPresets: summary?.payments?.trendPresets ?? {},
    trendPresetTotals: summary?.payments?.trendPresetTotals ?? {},
    recent: summary?.payments?.recent ?? [],
  },
  disputes: {
    ...EMPTY_SUMMARY.disputes,
    ...(summary?.disputes ?? {}),
    recent: summary?.disputes?.recent ?? [],
  },
  violationReports: {
    summary: summary?.violationReports?.summary ?? {},
    recent: summary?.violationReports?.recent ?? [],
  },
  recentActivity: {
    ...EMPTY_SUMMARY.recentActivity,
    ...(summary?.recentActivity ?? {}),
    users: summary?.recentActivity?.users ?? [],
    tutorApplications: summary?.recentActivity?.tutorApplications ?? [],
    payments: summary?.recentActivity?.payments ?? [],
    disputes: summary?.recentActivity?.disputes ?? [],
    violationReports: summary?.recentActivity?.violationReports ?? [],
  },
});

export default function AdminDashboard() {
  const { data, isLoading, isError } = useAdminDashboardSummary();

  const [timeRange, setTimeRange] = useState<(typeof TIME_RANGE_OPTIONS)[number]["value"]>(7);
  const dashboardData = data?.data;
  const dashboard = useMemo(() => mergeSummary(dashboardData), [dashboardData]);
  const totalDisputes = (dashboard.disputes.open || 0) + (dashboard.disputes.resolved || 0);
  const totalViolations = Object.values(dashboard.violationReports.summary).reduce(
    (acc, val) => acc + Number(val || 0),
    0
  );
  const packageStats = dashboard.packages;
  const timeRangeKey = String(timeRange);

  const presetTrend = dashboard.payments.trendPresets?.[timeRangeKey] ?? [];
  const hasPresetTrend = presetTrend.length > 0;
  const baseTrend = dashboard.payments.trend ?? [];

  const fallbackTrend = useMemo(() => {
    if (!baseTrend.length) return [];

    const sortedTrend = [...baseTrend].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeA - timeB;
    });

    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (timeRange - 1));

    const filtered = sortedTrend.filter((entry) => {
      const entryDate = new Date(entry.date);
      if (Number.isNaN(entryDate.getTime())) {
        return true;
      }
      return entryDate >= cutoff;
    });

    if (filtered.length === 0) {
      const takeCount = Math.min(timeRange, sortedTrend.length);
      return sortedTrend.slice(Math.max(sortedTrend.length - takeCount, 0));
    }

    return filtered;
  }, [baseTrend, timeRange]);

  const trendPresetTotals = dashboard.payments.trendPresetTotals ?? {};
  const hasPresetTotal = Object.prototype.hasOwnProperty.call(trendPresetTotals, timeRangeKey);
  const presetTotal = hasPresetTotal ? trendPresetTotals[timeRangeKey] : undefined;

  const trendRangeDays = dashboard.payments.trendRangeDays;
  const trendRangeKey = dashboard.payments.trendRange;
  const rangeMatchesByDays = typeof trendRangeDays === "number" && trendRangeDays === timeRange;
  const rangeMatchesByKey = typeof trendRangeKey === "string" && Number(trendRangeKey) === timeRange;
  const revenueRangeMatches = rangeMatchesByDays || rangeMatchesByKey;
  const hasRevenueInRange = revenueRangeMatches && dashboard.payments.revenueInRange !== undefined;

  const rangeAmount = hasPresetTotal
    ? presetTotal
    : hasRevenueInRange
    ? dashboard.payments.revenueInRange ?? 0
    : undefined;
  const hasRangeAmount = hasPresetTotal || hasRevenueInRange;

  const fallbackTrendTotal = fallbackTrend.reduce((sum, item) => sum + (item?.amount ?? 0), 0);

  const { revenueChartData, isFallbackRevenueTrend } = useMemo(() => {
    if (hasPresetTrend) {
      return { revenueChartData: presetTrend, isFallbackRevenueTrend: false };
    }

    if (fallbackTrend.length) {
      return { revenueChartData: fallbackTrend, isFallbackRevenueTrend: true };
    }

    if (hasRangeAmount) {
      return {
        revenueChartData: [
          {
            date: dashboard.payments.trendRangeEnd ?? new Date().toISOString(),
            amount: rangeAmount ?? 0,
          },
        ],
        isFallbackRevenueTrend: true,
      };
    }

    return { revenueChartData: [], isFallbackRevenueTrend: true };
  }, [
    hasPresetTrend,
    presetTrend,
    fallbackTrend,
    hasRangeAmount,
    rangeAmount,
    dashboard.payments.trendRangeEnd,
  ]);

  const revenueCardRangeAmount =
    hasRangeAmount ? rangeAmount ?? 0 : fallbackTrend.length ? fallbackTrendTotal : dashboard.payments.revenueLast7Days ?? 0;

  const filteredRecentPayments = useMemo(() => {
    const recent = dashboard.payments.recent ?? [];
    if (!recent.length) return [];
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (timeRange - 1));
    const filtered = recent.filter((payment) => {
      const paymentDate = new Date(payment.createdAt);
      if (Number.isNaN(paymentDate.getTime())) {
        return true;
      }
      return paymentDate >= cutoff;
    });

    if (filtered.length === 0) {
      const takeCount = Math.min(RECENT_ACTIVITY_LIMIT, recent.length);
      return recent.slice(0, takeCount);
    }

    return filtered;
  }, [dashboard.payments.recent, timeRange]);

  const revenueCardValueAmount = dashboard.payments.totalRevenue ?? 0;
  const rangeStartLabel = dashboard.payments.trendRangeStart ? formatDateDM(dashboard.payments.trendRangeStart) : undefined;
  const rangeEndLabel = dashboard.payments.trendRangeEnd ? formatDateDM(dashboard.payments.trendRangeEnd) : undefined;
  const revenueSubtitle =
    rangeStartLabel && rangeEndLabel
      ? `${formatCurrency(revenueCardRangeAmount)} (${rangeStartLabel} → ${rangeEndLabel})`
      : `${formatCurrency(revenueCardRangeAmount)} (${timeRange} ngày qua)`;

  const recentUsers = useMemo(
    () => (dashboard.recentActivity.users ?? []).slice(0, RECENT_ACTIVITY_LIMIT),
    [dashboard.recentActivity.users]
  );

  const recentTutorApplications = useMemo(
    () => (dashboard.recentActivity.tutorApplications ?? []).slice(0, RECENT_ACTIVITY_LIMIT),
    [dashboard.recentActivity.tutorApplications]
  );

  const recentPayments = useMemo(
    () => filteredRecentPayments.slice(0, RECENT_ACTIVITY_LIMIT),
    [filteredRecentPayments]
  );

  const topPackages = useMemo(
    () => (packageStats?.topPackages ?? []).slice(0, 5),
    [packageStats?.topPackages]
  );

  const topPackagesChartData = useMemo(
    () =>
      topPackages.map((pkg) => ({
        name: pkg.name,
        purchaseCount: pkg.purchaseCount ?? 0,
        revenue: pkg.revenue ?? 0,
      })),
    [topPackages]
  );

  const userRolePieData = useMemo(
    () =>
      (dashboard.users.byRole ?? []).map((r) => ({
        name:
          r.role === "TUTOR" ? "Gia sư" : r.role === "STUDENT" ? "Học sinh" : r.role === "ADMIN" ? "Quản trị" : "Phụ huynh",
        value: r.total ?? 0,
      })),
    [dashboard.users.byRole]
  );

  const paymentStatusDonutData = useMemo(
    () => [
      { name: "Thành công", value: dashboard.payments.successfulTransactions ?? 0, color: "#10b981" },
      { name: "Đang xử lý", value: dashboard.payments.pendingCount ?? 0, color: "#f59e0b" },
      { name: "Thất bại", value: dashboard.payments.failedCount ?? 0, color: "#ef4444" },
      { name: "Hoàn tiền", value: dashboard.payments.refundedCount ?? 0, color: "#6366f1" },
    ],
    [
      dashboard.payments.successfulTransactions,
      dashboard.payments.pendingCount,
      dashboard.payments.failedCount,
      dashboard.payments.refundedCount,
    ]
  );

  // removed commitments mini chart (unused)

  const userColumns: TableColumn[] = [
    { header: "Tên", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Vai trò",
      accessor: "role",
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === "TUTOR"
              ? "bg-blue-100 text-blue-700"
              : value === "STUDENT"
              ? "bg-green-100 text-green-700"
              : value === "ADMIN"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {value === "TUTOR"
            ? "Gia sư"
            : value === "STUDENT"
            ? "Học sinh"
            : value === "ADMIN"
            ? "Quản trị"
            : "Phụ huynh"}
        </span>
      ),
    },
    {
      header: "Ngày tham gia",
      accessor: "createdAt",
      render: (value: string) => formatDate(value),
    },
  ];

  const paymentColumns: TableColumn[] = [
    {
      header: "Mã đơn",
      accessor: "orderCode",
      render: (value: number) => `#${value}`,
    },
    {
      header: "Số tiền",
      accessor: "amount",
      render: (value: number) => <span className="font-semibold text-green-600">{formatCurrency(value)}</span>,
    },
    {
      header: "Loại",
      accessor: "type",
      render: (value: string) => (
        <span className="text-sm">
          {value === "learningCommitment" ? "Cam kết học" : "Gói học"}
        </span>
      ),
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === "SUCCESS"
              ? "bg-green-100 text-green-700"
              : value === "PENDING"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value === "SUCCESS"
            ? "Thành công"
            : value === "PENDING"
            ? "Đang xử lý"
            : "Thất bại"}
        </span>
      ),
    },
    {
      header: "Ngày",
      accessor: "createdAt",
      render: (value: string) => formatDate(value),
    },
  ];

  const tutorApplicationColumns: TableColumn[] = [
    {
      header: "Tên gia sư",
      accessor: "user",
      render: (user: any) => user?.name ?? "--",
    },
    {
      header: "Email",
      accessor: "user",
      render: (user: any) => user?.email ?? "--",
    },
    {
      header: "Trạng thái",
      accessor: "isApproved",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {value ? "Đã duyệt" : "Chờ duyệt"}
        </span>
      ),
    },
    {
      header: "Ngày nộp",
      accessor: "createdAt",
      render: (value: string) => formatDate(value),
    },
  ];

  const recentActivityTabs = useMemo(
    () => [
      {
        key: "users" as const,
        title: "Người dùng mới",
        columns: userColumns,
        data: recentUsers,
        emptyMessage: "Chưa có người dùng mới",
      },
      {
        key: "payments" as const,
        title: "Giao dịch thanh toán",
        columns: paymentColumns,
        data: recentPayments,
        emptyMessage: "Chưa có giao dịch trong khoảng thời gian đã chọn",
      },
      {
        key: "tutorApplications" as const,
        title: "Đơn đăng ký gia sư",
        columns: tutorApplicationColumns,
        data: recentTutorApplications,
        emptyMessage: "Chưa có đơn đăng ký mới",
      },
    ],
    [userColumns, paymentColumns, tutorApplicationColumns, recentUsers, recentPayments, recentTutorApplications]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="bg-white border border-red-200 text-red-600 rounded-xl p-6">
        Không thể tải dữ liệu tổng quan. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển quản trị</h1>
            <p className="text-gray-600 mt-2">Tổng quan hoạt động và số liệu nền tảng</p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <label htmlFor="time-range" className="text-sm text-gray-600">
              Khoảng thời gian
            </label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(event) => setTimeRange(Number(event.target.value) as (typeof TIME_RANGE_OPTIONS)[number]["value"])}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {TIME_RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng người dùng"
            value={formatNumber(dashboard.users.total)}
            subtitle={`${formatNumber(dashboard.users.active)} đang hoạt động`}
            icon={<Users size={32} />}
            to="/admin/tutors"
          />
          <StatCard
            title="Doanh thu"
            value={formatCurrency(revenueCardValueAmount)}
            subtitle={revenueSubtitle}
            icon={<CircleDollarSign size={32} />}
            to="/admin/packages"
          />
          <StatCard
            title="Gia sư"
            value={formatNumber(dashboard.tutors.active)}
            subtitle={`${formatNumber(dashboard.tutors.approvedProfiles)} hồ sơ đã duyệt`}
            icon={<GraduationCap size={32} />}
            to="/admin/tutors"
          />
          <StatCard
            title="Học sinh"
            value={formatNumber(dashboard.students.active)}
            subtitle={`${formatNumber(dashboard.learningCommitments.active)} cam kết đang học`}
            icon={<BookOpen size={32} />}
            to="/admin/students"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HighlightCard
            title="Cam kết học tập"
            value={formatNumber(dashboard.learningCommitments.active)}
            subtitle="Đang hoạt động"
            icon={<BookOpen size={20} className="text-green-500" />}
            accent="border-green-500"
            footer={`${formatNumber(dashboard.learningCommitments.completed)} hoàn thành • ${formatNumber(
              dashboard.learningCommitments.cancelled
            )} đã hủy`}
            to="/admin/learning"
          />
          <HighlightCard
            title="Gói học"
            value={formatNumber(dashboard.packages.activePackages)}
            subtitle="Đang hoạt động"
            icon={<Package size={20} className="text-purple-500" />}
            accent="border-purple-500"
            footer={
              packageStats
                ? `${formatNumber(dashboard.packages.totalPackages)} tổng gói • ${formatNumber(
                    packageStats.totalSubscriptions
                  )} lượt mua`
                : `${formatNumber(dashboard.packages.totalPackages)} tổng gói`
            }
            to="/admin/packages"
          />
        </div>

        <PackagePerformanceCard stats={packageStats} />
        {topPackagesChartData.length ? <TopPackagesChart data={topPackagesChartData} /> : null}
        {topPackages.length ? <TopPackagesTable packages={topPackages} /> : null}

        <IssuesSection
          totalDisputes={totalDisputes}
          disputesOpen={dashboard.disputes.open}
          disputesResolved={dashboard.disputes.resolved}
          totalViolations={totalViolations}
          violationSummary={dashboard.violationReports.summary}
        />

        <RevenueChart data={revenueChartData} days={timeRange} />
        <p className="text-xs text-gray-500 mt-2">
          {isFallbackRevenueTrend
            ? "Không có dữ liệu chi tiết cho khoảng thời gian này, hiển thị giá trị gần nhất."
            : `Dữ liệu hiển thị theo ${timeRange} ngày gần nhất.`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UsersRolePieChart data={userRolePieData} />
          <PaymentStatusDonut data={paymentStatusDonutData} />
        </div>

        <RecentActivityTabs tabs={recentActivityTabs} />
      </div>
    </div>
  );
}

 

interface IssuesSectionProps {
  totalDisputes: number;
  disputesOpen: number;
  disputesResolved: number;
  totalViolations: number;
  violationSummary: Record<string, number>;
}

function IssuesSection({ totalDisputes, disputesOpen, disputesResolved, totalViolations, violationSummary }: IssuesSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Vấn đề cần xử lý</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Tranh chấp</h3>
              <p className="text-sm opacity-90">Các vấn đề giữa gia sư và học sinh</p>
            </div>
            <AlertTriangle size={32} />
          </div>
          <div className="p-6">
            {totalDisputes === 0 ? (
              <EmptyState message="Không có tranh chấp" subMessage="Tất cả mọi thứ đang diễn ra tốt đẹp!" />
            ) : (
              <div className="space-y-4">
                <IssueStat label="Đang mở" value={disputesOpen} color="text-red-600" bg="bg-red-50" />
                <IssueStat label="Đã giải quyết" value={disputesResolved} color="text-green-600" bg="bg-green-50" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 text-white flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Báo cáo vi phạm</h3>
              <p className="text-sm opacity-90">Các báo cáo từ người dùng</p>
            </div>
            <ShieldAlert size={32} />
          </div>
          <div className="p-6">
            {totalViolations === 0 ? (
              <EmptyState message="Không có báo cáo vi phạm" subMessage="Cộng đồng đang hoạt động an toàn!" />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(violationSummary).map(([status, count]) => (
                  <div key={status} className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-700">{count}</p>
                    <p className="text-xs text-gray-600 mt-1">{status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyState({ message, subMessage }: { message: string; subMessage: string }) {
  return (
    <div className="text-center py-8">
      <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-500 mt-1">{subMessage}</p>
    </div>
  );
}

function IssueStat({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`flex justify-between items-center p-3 rounded-lg ${bg}`}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{formatNumber(value)}</span>
    </div>
  );
}

 

interface TableColumn {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => ReactNode;
}

 
