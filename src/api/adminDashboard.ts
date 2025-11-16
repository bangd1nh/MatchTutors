import apiClient from "@/lib/api";

export interface RoleBreakdown {
  role: string;
  total: number;
  active: number;
  banned: number;
}

export interface UsersSummary {
  total: number;
  active: number;
  banned: number;
  newLast7Days: number;
  byRole: RoleBreakdown[];
}

export interface TutorsSummary {
  total: number;
  active: number;
  banned: number;
  pendingApproval: number;
  approvedProfiles: number;
  rejectedProfiles: number;
}

export interface StudentsSummary {
  total: number;
  active: number;
  banned: number;
}

export interface TeachingRequestsSummary {
  total: number;
  PENDING: number;
  ACCEPTED: number;
  REJECTED: number;
}

export interface LearningCommitmentsSummary {
  total: number;
  pending_agreement: number;
  active: number;
  completed: number;
  cancelled: number;
  cancellation_pending: number;
  admin_review: number;
  rejected: number;
}

export interface PackageTopPerformer {
  packageId: string;
  name: string;
  price: number;
  isActive: boolean;
  purchaseCount: number;
  revenue: number;
  tutorsCount: number;
  lastPurchaseAt?: string;
}

export interface PackagesSummary {
  totalPackages: number;
  activePackages: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  revenue: number;
  topPackage?: PackageTopPerformer;
  topPackages?: PackageTopPerformer[];
}

export interface PaymentTrendEntry {
  date: string;
  amount: number;
}

export type PaymentTrendPreset = Record<string, PaymentTrendEntry[]>;
export type PaymentTrendPresetTotals = Record<string, number>;

export interface PaymentRecentEntry {
  id: string;
  orderCode: number;
  amount: number;
  status: string;
  type: string;
  createdAt: string;
}

export interface PaymentsSummary {
  totalRevenue: number;
  revenueLast7Days: number;
  revenueInRange?: number;
  revenueFromPackages?: number;
  adminWalletBalance?: number;
  successfulTransactions: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
  trend: PaymentTrendEntry[];
  trendPresets?: PaymentTrendPreset;
  trendPresetTotals?: PaymentTrendPresetTotals;
  trendRange?: string;
  trendRangeDays?: number;
  trendRangeStart?: string;
  trendRangeEnd?: string;
  recent: PaymentRecentEntry[];
}

export interface DisputeRecentEntry {
  id: string;
  learningCommitmentId: string;
  startTime: string;
  endTime: string;
  dispute: {
    status: string;
    openedBy: string;
    reason: string;
    evidenceUrls: string[];
    openedAt: string;
  };
  createdAt: string;
}

export interface DisputesSummary {
  open: number;
  resolved: number;
  recent: DisputeRecentEntry[];
}

export interface ViolationReportRecentEntry {
  id: string;
  type: string;
  status: string;
  reporterId: string;
  reportedUserId: string;
  relatedTeachingRequestId: string;
  createdAt: string;
}

export interface ViolationReportsSummary {
  summary: Record<string, number>;
  recent: ViolationReportRecentEntry[];
}

export interface RecentActivitySummary {
  users: any[];
  tutorApplications: any[];
  payments: any[];
  disputes: any[];
  violationReports: any[];
}

export interface AdminDashboardData {
  users: UsersSummary;
  tutors: TutorsSummary;
  students: StudentsSummary;
  teachingRequests: TeachingRequestsSummary & Record<string, number>;
  learningCommitments: LearningCommitmentsSummary;
  packages: PackagesSummary;
  payments: PaymentsSummary;
  disputes: DisputesSummary;
  violationReports: ViolationReportsSummary;
  recentActivity: RecentActivitySummary;
}

export interface AdminDashboardSummaryResponse {
  status: string;
  message: string;
  code?: number;
  data: AdminDashboardData;
}

export const getAdminDashboardSummary = async (): Promise<AdminDashboardSummaryResponse> => {
  const res = await apiClient.get("/admin/dashboard/summary");
  return res.data;
};
