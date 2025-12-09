import React from "react";
import { DataTable, renderSubject, renderStatus } from "./DataTable";
import { formatDate } from "@/utils/tutorProfileHelpers";
import { useGetTutorTeachingRequests } from "@/hooks/useAdminTutors";

interface RequestsTabProps {
  tutorId: string;
  page: number;
  statusFilter: string;
  searchTerm: string;
  onPageChange: (page: number) => void;
}

export const RequestsTab: React.FC<RequestsTabProps> = ({
  tutorId,
  page,
  statusFilter,
  searchTerm,
  onPageChange,
}) => {
  const { data, isLoading } = useGetTutorTeachingRequests(tutorId, {
    page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchTerm || undefined,
  });

  const responseData = data?.data as any;
  const items = responseData?.teachingRequests || responseData?.data || [];
  const pagination = responseData?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

  const columns = [
    {
      key: "student",
      label: "Học sinh",
      render: (item: any) =>
        item.studentId?.userId?.name || item.student?.userId?.name || item.student?.name || "Chưa có",
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
        if (status === "PENDING") return "secondary";
        if (status === "ACCEPTED") return "default";
        return "destructive";
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
