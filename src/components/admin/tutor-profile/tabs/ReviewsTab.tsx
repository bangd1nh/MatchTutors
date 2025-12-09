import React from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable, renderRating } from "./DataTable";
import { formatDate, translateType } from "@/utils/tutorProfileHelpers";
import { useGetTutorReviews } from "@/hooks/useAdminTutors";

interface ReviewsTabProps {
  tutorId: string;
  page: number;
  ratingFilter: string;
  onPageChange: (page: number) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  tutorId,
  page,
  ratingFilter,
  onPageChange,
}) => {
  const { data, isLoading } = useGetTutorReviews(tutorId, {
    page,
    limit: 10,
    rating: ratingFilter !== "all" ? parseInt(ratingFilter) : undefined,
  });

  const responseData = data?.data as any;
  const items = responseData?.reviews || responseData?.data || [];
  const pagination = responseData?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

  const columns = [
    {
      key: "reviewer",
      label: "Học sinh",
      render: (item: any) => item.reviewerId?.name || item.student?.name || "Chưa có",
    },
    {
      key: "type",
      label: "Loại",
      render: (item: any) => (
        <Badge variant="outline">
          {item.type ? translateType(item.type, "review") : "Chưa có"}
        </Badge>
      ),
    },
    {
      key: "rating",
      label: "Đánh giá",
      render: renderRating,
    },
    {
      key: "comment",
      label: "Nội dung",
      render: (item: any) => (
        <span className="text-gray-600">{item.comment || "Không có bình luận"}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Ngày đánh giá",
      render: (item: any) => formatDate(item.createdAt),
    },
  ];

  return (
    <DataTable
      isLoading={isLoading}
      items={items}
      pagination={pagination}
      currentPage={page}
      onPageChange={onPageChange}
      columns={columns}
    />
  );
};
