import React from "react";
import { DataTable, renderSubject, renderStatus } from "./DataTable";
import { formatDate } from "@/utils/tutorProfileHelpers";
import { useGetTutorLearningCommitments } from "@/hooks/useAdminTutors";

interface CommitmentsTabProps {
  tutorId: string;
  page: number;
  statusFilter: string;
  searchTerm: string;
  onPageChange: (page: number) => void;
}

export const CommitmentsTab: React.FC<CommitmentsTabProps> = ({
  tutorId,
  page,
  statusFilter,
  searchTerm,
  onPageChange,
}) => {
  const { data, isLoading } = useGetTutorLearningCommitments(tutorId, {
    page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchTerm || undefined,
  });

  const responseData = data?.data as any;
  const items = responseData?.commitments || responseData?.data || [];
  const pagination = responseData?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

  const columns = [
    {
      key: "student",
      label: "Học sinh",
      render: (item: any) => item.student?.userId?.name || item.student?.name || "Chưa có",
    },
    {
      key: "subject",
      label: "Môn học",
      render: renderSubject,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (item: any) => renderStatus(item, (status) => {
        if (status === "active") return "default";
        if (status === "completed") return "secondary";
        return "outline";
      }),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
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
