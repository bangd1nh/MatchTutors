import React from "react";
import { DataTable, renderSubject, renderStatus, renderTimeRange } from "./DataTable";
import { useGetTutorSessions } from "@/hooks/useAdminTutors";

interface SessionsTabProps {
  tutorId: string;
  page: number;
  statusFilter: string;
  searchTerm: string;
  onPageChange: (page: number) => void;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({
  tutorId,
  page,
  statusFilter,
  searchTerm,
  onPageChange,
}) => {
  const { data, isLoading } = useGetTutorSessions(tutorId, {
    page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchTerm || undefined,
  });

  const responseData = data?.data as any;
  const items = responseData?.sessions || responseData?.data || [];
  const pagination = responseData?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };

  const columns = [
    {
      key: "student",
      label: "Học sinh",
      render: (item: any) =>
        item.learningCommitmentId?.student?.userId?.name ||
        item.student?.userId?.name ||
        item.student?.name ||
        "Chưa có",
    },
    {
      key: "subject",
      label: "Môn học",
      render: renderSubject,
    },
    {
      key: "time",
      label: "Thời gian",
      render: renderTimeRange,
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (item: any) => renderStatus(item, (status) => {
        if (status === "COMPLETED") return "default";
        if (status === "SCHEDULED") return "secondary";
        if (status === "CANCELLED" || status === "REJECTED" || status === "NOT_CONDUCTED") return "destructive";
        return "outline";
      }),
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
