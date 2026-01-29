import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TabType = "overview" | "commitments" | "sessions" | "requests" | "reports" | "reviews";

interface TabFiltersProps {
  activeTab: TabType;
  searchTerm: string;
  statusFilter: string;
  ratingFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRatingChange: (value: string) => void;
}

export const TabFilters: React.FC<TabFiltersProps> = ({
  activeTab,
  searchTerm,
  statusFilter,
  ratingFilter,
  onSearchChange,
  onStatusChange,
  onRatingChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {activeTab !== "reviews" && (
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {activeTab === "commitments" && (
              <>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
                <SelectItem value="pending_agreement">Chờ thỏa thuận</SelectItem>
              </>
            )}
            {activeTab === "sessions" && (
              <>
                <SelectItem value="SCHEDULED">Đã lên lịch</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                <SelectItem value="NOT_CONDUCTED">Chưa thực hiện</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </>
            )}
            {activeTab === "requests" && (
              <>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="ACCEPTED">Đã chấp nhận</SelectItem>
                <SelectItem value="REJECTED">Đã từ chối</SelectItem>
              </>
            )}
            {activeTab === "reports" && (
              <>
                <SelectItem value="PENDING">Chờ xử lý</SelectItem>
                <SelectItem value="RESOLVED">Đã giải quyết</SelectItem>
                <SelectItem value="DISMISSED">Đã bác bỏ</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      )}
      {activeTab === "reviews" && (
        <Select value={ratingFilter} onValueChange={onRatingChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Đánh giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả đánh giá</SelectItem>
            <SelectItem value="5">5 sao</SelectItem>
            <SelectItem value="4">4 sao</SelectItem>
            <SelectItem value="3">3 sao</SelectItem>
            <SelectItem value="2">2 sao</SelectItem>
            <SelectItem value="1">1 sao</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
