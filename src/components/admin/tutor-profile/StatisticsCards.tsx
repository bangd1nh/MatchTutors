import React from "react";
import { BookOpen, Calendar, FileText, Flag, MessageSquare, Star } from "lucide-react";
import { StatCard } from "./StatCard";

interface StatisticsCardsProps {
  stats: {
    totalCommitments: number;
    totalSessions: number;
    totalTeachingRequests: number;
    totalViolationReports: number;
    totalReviews: number;
    averageRating: number;
  };
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <StatCard
        icon={BookOpen}
        label="Cam kết học tập"
        value={stats.totalCommitments}
        color="blue"
      />
      <StatCard
        icon={Calendar}
        label="Buổi học"
        value={stats.totalSessions}
        color="green"
      />
      <StatCard
        icon={FileText}
        label="Yêu cầu dạy học"
        value={stats.totalTeachingRequests}
        color="yellow"
      />
      <StatCard
        icon={Flag}
        label="Báo cáo vi phạm"
        value={stats.totalViolationReports}
        color="red"
      />
      <StatCard
        icon={MessageSquare}
        label="Đánh giá"
        value={stats.totalReviews}
        color="purple"
      />
      <StatCard
        icon={Star}
        label="Điểm đánh giá"
        value={stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
        color="orange"
      />
    </div>
  );
};
