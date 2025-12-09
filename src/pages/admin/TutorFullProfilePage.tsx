import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  useGetTutorFullDetails,
  useGetTutorStatistics,
} from "@/hooks/useAdminTutors";
import { ProfileHeader } from "@/components/admin/tutor-profile/ProfileHeader";
import { StatisticsCards } from "@/components/admin/tutor-profile/StatisticsCards";
import { TabFilters } from "@/components/admin/tutor-profile/TabFilters";
import { OverviewTab } from "@/components/admin/tutor-profile/tabs/OverviewTab";
import { CommitmentsTab } from "@/components/admin/tutor-profile/tabs/CommitmentsTab";
import { SessionsTab } from "@/components/admin/tutor-profile/tabs/SessionsTab";
import { RequestsTab } from "@/components/admin/tutor-profile/tabs/RequestsTab";
import { ReportsTab } from "@/components/admin/tutor-profile/tabs/ReportsTab";
import { ReviewsTab } from "@/components/admin/tutor-profile/tabs/ReviewsTab";
import { calculateStats } from "@/utils/tutorProfileHelpers";

type TabType = "overview" | "commitments" | "sessions" | "requests" | "reports" | "reviews";

const TutorFullProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  
  // Pagination states - only for tabs that need it
  const [commitmentsPage, setCommitmentsPage] = useState(1);
  const [sessionsPage, setSessionsPage] = useState(1);
  const [requestsPage, setRequestsPage] = useState(1);
  const [reportsPage, setReportsPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);

  // Only call essential APIs on mount
  const { data: fullDetails, isLoading: isLoadingDetails } = useGetTutorFullDetails(id || "");
  const { data: statistics } = useGetTutorStatistics(id || "");

  const tutor = fullDetails?.data?.tutor;
  const statsData = (statistics?.data || fullDetails?.data?.statistics) as any;
  const stats = calculateStats(statsData);

  // Loading state
  if (isLoadingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Đang tải thông tin gia sư...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy gia sư</h2>
          <p className="text-gray-600 mb-6">Gia sư này không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => navigate("/admin/tutors")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const userInfo = 'userId' in tutor ? tutor.userId : null;
  
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thông tin gia sư không hợp lệ</h2>
          <p className="text-gray-600 mb-6">Không thể tải thông tin người dùng của gia sư này.</p>
          <Button onClick={() => navigate("/admin/tutors")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Reset pagination when switching tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType);
    setCommitmentsPage(1);
    setSessionsPage(1);
    setRequestsPage(1);
    setReportsPage(1);
    setReviewsPage(1);
    setSearchTerm("");
    setStatusFilter("all");
    setRatingFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader
        name={userInfo.name}
        email={userInfo.email}
        phone={userInfo.phone}
        avatarUrl={userInfo.avatarUrl}
        isBanned={userInfo.isBanned}
      />

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <StatisticsCards stats={stats} />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="border-b border-gray-200 px-6">
              <TabsList className="bg-transparent h-auto p-0">
                <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                  Tổng quan
                </TabsTrigger>
                <TabsTrigger value="commitments" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                  Cam kết học tập
                </TabsTrigger>
                <TabsTrigger value="sessions" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                  Buổi học
                </TabsTrigger>
                <TabsTrigger value="requests" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                  Yêu cầu dạy học
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                  Báo cáo vi phạm
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                  Đánh giá
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              {/* Filters - only show for tabs that need them */}
              {activeTab !== "overview" && (
                <TabFilters
                  activeTab={activeTab}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  ratingFilter={ratingFilter}
                  onSearchChange={setSearchTerm}
                  onStatusChange={setStatusFilter}
                  onRatingChange={setRatingFilter}
                />
              )}

              {/* Tab Content */}
              <TabsContent value="overview" className="mt-0">
                <OverviewTab tutor={tutor} userInfo={userInfo} stats={stats} />
              </TabsContent>

              <TabsContent value="commitments" className="mt-0">
                {activeTab === "commitments" && (
                  <CommitmentsTab
                    tutorId={id || ""}
                    page={commitmentsPage}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                    onPageChange={setCommitmentsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="sessions" className="mt-0">
                {activeTab === "sessions" && (
                  <SessionsTab
                    tutorId={id || ""}
                    page={sessionsPage}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                    onPageChange={setSessionsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="requests" className="mt-0">
                {activeTab === "requests" && (
                  <RequestsTab
                    tutorId={id || ""}
                    page={requestsPage}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                    onPageChange={setRequestsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="reports" className="mt-0">
                {activeTab === "reports" && (
                  <ReportsTab
                    tutorId={id || ""}
                    page={reportsPage}
                    statusFilter={statusFilter}
                    searchTerm={searchTerm}
                    onPageChange={setReportsPage}
                  />
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                {activeTab === "reviews" && (
                  <ReviewsTab
                    tutorId={id || ""}
                    page={reviewsPage}
                    ratingFilter={ratingFilter}
                    onPageChange={setReviewsPage}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TutorFullProfilePage;
